//You can <a href=javascript:showobject()>explore the elements of this page</a>.

wopt="scrollbar,scrollbars,height=300,width=600"

function GRgetnewwindow(opt){
 var sm=""+Math.random()
 sm=sm.substring(3,10)
 return open("","GR_"+sm,opt)
}

GR=new Array()
function GRinitdivs(){
	GR.isnn4=(document.layers?true:false)
	GR.isie4=(document.all?true:false)
	GR.isnn6=(!GR.isie4 && document.getElementById?true:false)
	if(!GR.isnn4 && !GR.isie4 && !GR.isnn6){if(!GR.init)alert("This page will work properly only with browsers capable of supporting layers.");GR.init=true;return false}
	return true
}GRinitdivs()

depth=0
depthmax=2
nmax=300
nlines=0
slast=null

function showobject(){
 GRinitdivs()
 depthmax=(GR.isnn4?5:2)
 slast=(slast==null?(document.all?"document.all[0],document.all":"window,document"):slast)
 var s=prompt("What do you want to see?",slast)
 if(s==null)return
 slast=s
 var w=GRgetnewwindow(wopt)
 var d=w.document
 d.open()
 d.write("<title>"+s+"</title>")
 var A=s.split(",")
 for(var j=0;j<A.length;j++){
  s=showall(A[j],"function")
  var S=s.split("\n")
  d.write("<pre>")
  for(var i=0;i<S.length;i++)d.writeln(S[i])
  d.write("</pre>")
 }
 d.close()
}

function showall(objName,snot){
 if(nlines>nmax || depth==depthmax)return ""
 nlines++
 depth++
 var s = ""
 var obj=eval(objName)
 for(var i in obj){
   var st=obj[i]+"\n"
   if(st==null){
	s+=objName+(isNaN(i)?"."+i:"["+i+"]")+" = *UNDEFINED*\n"
   }else{
	if(snot==null || st.indexOf(snot)<0)s+=objName+(isNaN(i)?"."+i:"["+i+"]")+" = "+st.replace(/</g,"&lt;")
	if(i!=0 && st.indexOf("[")>=0){
		if(isNaN(i)){if(i!="all" 
			&& i!="document"
			&& i.indexOf("top")<0
			&& i.indexOf("arent")<0
			&& i.indexOf("self")<0
			&& i.indexOf("Sibling")<0
			&& i.indexOf("window")<0
			&& i.indexOf("frame")<0
			&& i.indexOf("next")<0
			&& i.indexOf("previous")<0

		){
			s+=showall(objName+"."+i,snot)
		}}else{if(objName.indexOf(".all")<0){
			s+=showall(objName+"["+i+"]",snot)
		}}
	}
   }
 }
 depth--
 return s
}


