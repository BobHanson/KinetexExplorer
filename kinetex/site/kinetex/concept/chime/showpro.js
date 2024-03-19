//10:59 AM 4/16/01 added zoom, cleaned up View--BH
//8:56 AM 12/23/2002 modified to work with IE6 and NN7 using fraSPT
//copywrite 2001 Robert M. Hanson, St. Olaf College, Northfield, MN
//accepts parameters: ?1zni.pdb|Scheme['insulin']
// or scheme: ?1zni.pdb|select cys;color red

if(top==self)document.location="index.htm"

//IE 4.0 security work-around

isoldie=(true || navigator.appVersion.indexOf("MSIE 5.0")>=0)

chimename="snchime"
loadlist=""
thecolor="color cpk"
solvoff="select solvent;spacefill off;wireframe off;"
satoms="spacefill 120;wireframe 50;"
defaultview="select *;spacefill off;wireframe on;select not (protein or rna or dna);"+satoms
_newwinoptions='width=400,height=200,left=0,top=0,scrollbars,resizable'
_winname="1873498734"

function setHTML(s){
 s="<table><tr><td>"+s+"</td></tr></table>"
 return s
}

function dosay(s,nsec,uselast){
 
 if(!uselast){
	_winname=""+Math.random()
	_winname=_winname.substring(3,10)
 }
 var spage=""
 s=(nsec?"<body onload=setTimeout('window.close()',"+(nsec*1000)+")>":"<body>")+"<center>"+s+"<p><a href=javascript:window.close()>close</a></center></body>"
 if(isoldie){
   spage="showinfo.htm?"+escape(s)
 }
 var newwin=open(spage,"js_"+_winname,_newwinoptions)
 if(spage!="")return
 newwin.document.open()
 newwin.document.write(s)
 newwin.document.close()
}

//the list of structures; filled by newStructure
IDlist=new Array()

//for button options
View=new Array()
View['pri']=new Array(false,"select protein or rna or dna;spacefill off;wireframe ","on","off")
View['sec']=new Array(false,"select all;cartoon ","","off")
View['non']=new Array(false,"select not (protein or solvent);",satoms,"spacefill off;wireframe off")
View['solv']=new Array(false,"select solvent;",satoms,"spacefill off;wireframe off")
View['hbonds']=new Array(false,"select *;hbonds ","on","off")
View['ssbonds']=new Array(false,"select protein;ssbonds ","on","off")
View['aa']=new Array(false,"",satoms,"")

function newStructure(fname,keyname,selectname,notes,scheme){
 IDlist[keyname]=new Array()
 IDlist[keyname]["fname"]=fname
 IDlist[keyname]["selectname"]=selectname
 if(arguments.length<4)notes=""
 IDlist[keyname]["notes"]=notes
 if(arguments.length<5)scheme=Scheme["cartoonorganic"]
 IDlist[keyname]["scheme"]=scheme
 Scheme[keyname]=scheme
}

function writeChime(){
 chimename="C"+Math.random()
 chimename=chimename.replace(/\./g,"_")
 var s="<embed width=400 height=400 src=small.pdb name="+chimename
 s+=" spiny=80 startspin=false script='select not protein;spacefill 120;wireframe 40;select solvent;spacefill 0'"
 s+=" messagecallback=chimeloaded>"
 document.write(s)
}

function chimeloaded(n,m){
 if(m.indexOf("completed")>=0){
   if(thescheme){
	var s=thescheme
	thescheme=""
	show(s)
	if(thenotes)dosay(setHTML(thenotes),0,1)
   }
 }
}

function writeSelections(){
 var s="<select name=names onchange=getstructure()><option value=''>"
 var S=new Array()
 for(var i in IDlist)S[S.length]=IDlist[i]["selectname"]+";"+i
 S=S.sort(lcasesort)
 for(var i=0;i<S.length;i++){
	var S1=S[i].split(";")
	s+="\n<option value="+S1[1]+">"+S1[0]
 }
 s+="\n</select>"
 document.write(s)
}

function lcasesort(a,b){
 var sa=a.toLowerCase().replace(/;/,"   ")
 var sb=b.toLowerCase().replace(/;/,"   ")
 return (sa<sb?-1:sa>sb?1:0)
}

function executeScript(script){
	document.frm2.rascmd.value =script
	var s="<embed type=application/x-spt hidden=true width=10 height=10 button=push target="+chimename+" script=\""+script+"\" immediate=1>"
	openframe(parent.fraSPT,s)
}

function openframe(f,s){
 f.document.open()
 f.document.write("<html>"+s+"</html>")
 f.document.close()
}

function addlink(sname,slist,scolor){
	var S=slist.split(",")
	var s="<br><a href=\"javascript:showaa('"+slist+"')\"><font color="+scolor+"><b>"+sname+"</b></font></a>:"
	for(var i=0;i<S.length;i++)s+="\n&nbsp;<a href=\"javascript:showaa('"+S[i]+"')\"><font color="+scolor+"><b>"+S[i]+"</b></font></a>"
	document.writeln(s)
}

function docolor(){
	var d=document.frm1.color
	thecolor=d[d.selectedIndex].value
	show('select *;'+thecolor)
}

function doinit(){
	var s=unescape(parent.document.location)
	var i=s.indexOf("?")
	s=(i>=0?s.substring(i+1,s.length):"1ash.pdb")
	if(s.length==0)return
	if(s.length==4)s+=".pdb"
	s+="|"
	var S=s.split("|")
	c=S[1]
	if(c.indexOf("Scheme[")==0)eval("c="+c)
	thefile=S[0]
	thescript=c
	setTimeout("doload(thefile,true,thescript,true)",1000)
}

function haveloaded(sfile){
	var s=";"+sfile+";"
	if(loadlist.indexOf(s)>=0)return true
	loadlist+=s
	return false
}

function doload(sfile,showfilename,script,shownotes){
	//sfile can be a keyword (insulin) or a pdb file code
	if(arguments.length<3)script=""
	var S=new Array()
	var scheme=Scheme["cartoonorganic"]
	var notes=""
	var selectname=""
	sfile=sfile.toLowerCase()
	var swhat=findStructure(sfile)
	if(IDlist[swhat]){
		sfile=IDlist[swhat]["fname"]
		scheme=IDlist[swhat]["scheme"]
		notes=IDlist[swhat]["notes"]
		selectname=IDlist[swhat]["selectname"]
	}
	if(showfilename) document.frm1.pdb.value=sfile
	if(!haveloaded(sfile)){
		dosay("The model<p>"+selectname+" ("+sfile+")<p>is loading.<br>This may take a few seconds.<p>",5,0)//+(!shownotes && notes?setHTML("Note: "+notes):""))
	}
	var d=document.frm1.names
	if(d[d.selectedIndex].value!=swhat){
		d.selectedIndex=0
		for(var i=1;i<d.length;i++){if(d[i].value==swhat){
			d.selectedIndex=i
			break;
		}}
	}
	thescheme=scheme+script
	thenotes=(shownotes?notes:"")
	show("load pdb "+sfile)
}

function findStructure(sfile){
	if(IDlist[sfile])return sfile
	for(var i in IDlist){
		if(IDlist[i]["fname"]==sfile||IDlist[i]["fname"]==sfile+".pdb")return i
	}
	return ""
}

function donotes(sfile){
	if(arguments.length==0)sfile=document.frm1.pdb.value
	var swhat=findStructure(sfile)
	var s=""
	if(IDlist[swhat] && IDlist[swhat]["notes"].length){
		s=IDlist[swhat]["notes"].replace(/\n/g,"<br>")
		dosay(setHTML(s),0,0)
	}else{
		s="There are no notes for "+sfile+"."
		alert(s)
	}
}

function getstructure(){
	var d=document.frm1.names
	var swhat=d[d.selectedIndex].value
	if(swhat=="")return
	doload(swhat,true,"",true)
}

function label(satom,slabel){
	var s= "color labels red;select " + satom + ";label "
	if(slabel==null){
		slabel=satom.charAt(0)
		slabel=slabel.toUpperCase()+satom.substring(1,3)+" " + satom.substring(3,satom.indexOf("."))
	}
	return s+slabel+";"
}

function loadfile(){
	document.frm1.names.selectedIndex=0
	doload(document.frm1.pdb.value,false,"",false)
} 

function setscale(n){show("zoom "+n+"00")}

function setview(swhat,TF){
	View[swhat][0]=TF
	show(viewof(swhat))
}

function show(swhat){
	executeScript(swhat)
}

function showaa(swhat){
	View['ssbonds'][0]=(swhat.indexOf("cys")>=0)
	View['aa'][0]=true
	View['aa'][1]="select "+swhat+";"
	var s=viewof('ssbonds')+viewof('pri')+viewof('aa')
	show(s)
}

function viewof(s){
	var i=View[s][0]
	return (i==99?"":View[s][1]+View[s][2+(i?0:1)]+";")
}

