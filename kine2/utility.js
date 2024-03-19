//math,string utilities

function ro(x,ndec)
{
 //round x to ndec decimal places (+) fixed; (-) floating
 if(x==0)return 0
 if(ndec==0)return Math.round(x)
 var xs=x+""
 var i=(xs.indexOf("E") & xs.indexOf("e"))
 if(ndec<0 && i<0)
 {
  var xs=ro(x*1e-100,-ndec)
  var i=(xs.indexOf("E") & xs.indexOf("e"))
  var e=(eval(xs.substring(i+1,xs.length))+100)
  return xs.substring(0,i)+(e!=0?"E"+e:"")
 }
 if (i>0)
 {
  var s=ro(xs.substring(0,i),Math.abs(ndec)-1)+"E"+xs.substring(i+1,xs.length)
  return s 
 }
 i=xs.indexOf(".")
 if (i<0) 
 {
  xs=x+"."+"00000"+" "
  i=xs.indexOf(".")
 }
 var add1=(xs.charAt(0)=="0")
 var is9=(xs.charAt(0)=="9")
 var s=xs.substring(0,i)+xs.substring(i+1,i+1+ndec)+"."+xs.substring(i+1+ndec,xs.length)
 if(add1)s="1"+s.substring(1,s.length)
 xs=Math.round(eval(s))
 xs=xs+"00000000000"
 if(is9 && xs.charAt(0)!="9")i+=1
 if(add1)xs="0"+xs.substring(1,xs.length)
 xs=xs.substring(0,i)+"."+xs.substring(i,i+ndec)
 if(i==0) xs="0"+xs
 if(xs.indexOf("-.")==0)xs="-0"+xs.substring(1,xs.length)
 if(xs=="-")xs="0"
 return xs
}

function strsub(ssub,ch1,ch2)
{
 if (ch2!=""){if (ch2.indexOf(ch1)>=0) return ssub}
 var s=ssub
 var i=s.indexOf(ch1)
 while (i>=0)
 {
  s=s.substring(0,i)+ch2+s.substring(i+ch1.length,s.length)
  i=s.indexOf(ch1)
 }
 return s
}

function clean(sclean) 
{
 //tabs and commas to space and leading spaces removed
 var s=sclean
 s=strsub(s,","," ")
 s=strsub(s,"\r","\n")
 s=strsub(s,"\n",";")
 s=strsub(s,";;",";")
 s=strsub(s,"<"," <")
 s=strsub(s,">","> ")
 s=strsub(s,"\f"," ")
 s=strsub(s,"\t"," ")
 s=strsub(s,"\x22","") //double quote
 s=strsub(s,"'","")
 s=strsub(s,"  "," ")
 s=strsub(s," = ","=")
 s=strsub(s,"==","=")
 s=strsub(s,"  "," ")
 var i=0
 while (s.charAt(i)==" ")i++
 if(i>0)s=s.substring(i,s.length)
 var i=s.lastIndexOf(" ")
 if(i>=0 && i==s.length-1)s=s.substring(0,i)
 return s
}

function tableselect(slabel,sname,n) 
{
 var s=slabel+" <select name=s"+sname+" onchange='doselect(name)'>"
 for(var i=3; i<arguments.length-1; i+=2)
 {
  var sv=arguments[i]
  var st=arguments[i+1]
  if(st!="SKIP"){
	if(st.length==0)st=sv
	s+="<option "+((i-3)==2*n?"selected":"")+" value=\""+sv+"\">"+st
  }
 }
 return s+"</select>"
}
function tablecheck(slabel,sname,svalue,ischecked,ch)
{
 var s=(ch=="o"?"":"<td nowrap>")+"<input type=checkbox name="+ch+sname+" value='"+svalue+"' "+(ischecked?"checked":"")+">"+slabel
 return(s)
}
function tableinput(slabel,sname,svalue,isize,dotd)
{
 return (dotd?"<td nowrap>":" ")+slabel+(dotd?"<td>":" ")+"<input type=text name=t"+sname+" value='"+svalue+"' size="+isize+">"
}
function tablebtn(sname,svalue,isref)
{
 var s="doBtn('"+sname+"')"
 if(isref) return "<a href=javascript:void("+s+")>"+svalue+"</a>"
 return "<input type=button value='"+svalue+"' onclick="+s+">"
}

function sof(n,ndec)
{
  var s="          "+n.toString()
  return s.substring(s.length-(s.length<=ndec+10?ndec:s.length-10),s.length)
}

//window utilities

function getrnd(n){return Math.floor(Math.random()*n)}

function dotest(value)
{
 var s=value//(value.charAt(0)==";"?value:mathof(value))
 return alert(s+" = "+eval(s))
}
function debugprint(swhat)
{
 var s=swhat+"\n"
 for(var i=1; i<arguments.length; i++)s+=arguments[i]+"\n"
 alert (s)
}

function dogoto(swhere){document.location="#end";document.location=swhere}

function waitforload(sexec,wnd,loc)
{
 if(loc!="-")
 {
  if(loc.length)wnd.document.location=loc
  wndloading=wnd
 }else{
  var s=wndloading.status
  if(wndloading.status==null || s.length==0) {return eval(sexec)}
 }
 return setTimeout("waitforload('"+sexec+"',0,'-')",1000)
}

function selectof(c){return c[c.selectedIndex].value}
function getselectof(swhat){return selectof(eval("usr."+swhat))}
function textof(c){return c[c.selectedIndex].text}
function gettextof(swhat){return textof(eval("usr."+swhat))}

function getvalue(swhat){return eval("usr."+swhat+".value")}
function findvalue(sform,sname)
{
 var form=eval(sform)
 var i=findname(form,sname)
 return(i<0?"":form.elements[i].value)
}
function findname(form,sname)
{
 for(var i=0;i<form.elements.length;i++)
 {
  if(form.elements[i].name==sname)return i
 }
 return -1
}
function finditem(control,sitem,idef)//looks in a select control for sitem
{
 for(var i=0;i<control.length;i++)
 {
  var s=control.options[i].text
  if (s.indexOf(sitem)==0)return i
 }
 return idef
}
