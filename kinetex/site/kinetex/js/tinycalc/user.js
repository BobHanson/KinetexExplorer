//CHECKJS  D:\imt\js\tinycalc\user.js 1/17/2003 4:48:27 PM
/*

6:18 AM 1/16/2003
6:24 AM 3/2/2003  fix for "What?" box (usr.svar) not showing variables properly

*/

ihavedataxyz=false //set true by ?+DATA
imgnum=1
//user-initiated functions

function doBtn(sname)
{
	var s=""
	if(calc_getsimplexstatus() || sname=="stop"){
		calc_dosimplex("stop")
		return
	}
	if(sname=="load") return doselect("ssolve")
	if(sname=="cleardata"){
		user_putdata("")
	}
	if(sname=="recalcdata"){
		if(user_getdatavar(2).indexOf("=")<0){
			alert("Recalculation is for when one of your headers contains a definition for a variable, and you want to calculate those values.\nIn that case, use a pair of commas to indicate that the field is blank.\nFor example:\n\nTc, T=Tc+273.15,K\n42,, 1.3\n72,, 2.6\n102,, 5.2\n") 
			return
		}
		calc_recalcdata()
	}
	if(sname=="solvereset"){
		return calc_dosimplex("reset")
	}
	if(sname=="eval") {
		calc_dosimplex("start")
		return 1
	}
	if(sname=="sample") return dosample()
	if(sname=="test") {
		calc_setvariables()
		s=user_getitest()
		if(s.charAt(0)==";"){
			alert(eval(s))
			return 1
		}
                calc_settestexpression(s)
		user_putiresult(dotest(s))
		if(s.indexOf("=")>0)calc_setthevalue(s)
		return 1
	}
	return 0
}

function docheck(sname){
}

function dokeypress(sname){
        if(sname=="tsmodel")return setTimeout("checknewmodel()",100)
        if(sname=="tstest")return setTimeout("checknewtest()",100)
        if(sname=="dataxyz")return setTimeout("checknewdata()",100)
}

function checknewmodel(){
	var s=user_getinfo()
	var i=calc_unpairedparens(s)
	if(i==0 && s.length>0 && s.indexOf("=")!=s.length-1){
		calc_dosimplex("fullreset")
	}
        calc_settestexpression("")
}

function checknewdata(){
        calc_dosimplex("setdata")
}

function checknewtest(){
        calc_settestexpression(user_getitest())
}

function dosample(){
	calc_dosample()
}

function doselect(sname){
	var i=user_getselectindexof(sname)
	var stext=user_getselecttextof(sname)
	var sval=user_getselectvalueof(sname)

	if(sname=="ssolve"){
		calc_setupsimplexfunction(i+1)
		return
	}
	if(sname=="svar"){
		if(stext=="")return
		if(i==0){
			calc_dosimplex("fullreset")
			return
		}
		calc_setcalcvariable(stext)
	}
}

function getstyles(idowrite){
	docstyle="<style>"
	+"a {text-decoration:none;color:brown}"
	+"pre {font-size:12pt;color:darkblue}"
	+"body {font-size:14pt}"
	+"h3 {font-size:16pt}"
	+"h1 {font-size:24pt}"
	+"td {font-size:14pt}"
	+"p {line-height:16pt;font-size:14pt}"
	+"sub {font-size:10pt}"
	+"sup {font-size:10pt}"
	+".info {background-color:lightgrey}"
	+"i{color:white}"
	+"</style>"
	if(idowrite)document.write(docstyle)
	return docstyle
}getstyles(true)

function user_createinterface(){
	var s=location.search
	if(s.indexOf("+DATA")>=0)ihavedataxyz=true
	s="<center><form name=info>"
	+"<table border=3 cellpadding=25><tr><td>"
	+user_loaddatatable()
	+user_loadselectlist()
	+user_loadcalctable()
	+"</td></tr></table></form></center>"	
	document.write(s)
}
function user_getdatavar(idatamode){
	var s=""
	if(arguments.length==0)idatamode=3
	if(idatamode&1)s=usr.datavar.value
	var ignoredata=(ihavedataxyz && usr.ignoredata.checked?1:0)
	if(idatamode==2 && ihavedataxyz && !ignoredata)s=usr.dataxyz.value
	if(idatamode==3 && ihavedataxyz && !ignoredata && usr.dataxyz.value!="")s+="\n//DATA:\n"+usr.dataxyz.value
	return s
}

function user_getinfo(){
	return usr.tsmodel.value
}

function user_putdata(sdata){
	if(ihavedataxyz)usr.dataxyz.value=sdata
}

function user_putinfo(smodel){
	usr.tsmodel.value=smodel
}

function user_getiresult(){
	return usr.iresult.value
}

function user_getitest(){
	return usr.itest.value
}

function user_getselectindexof(swhat){
	var c=eval("usr."+swhat)
	return c.selectedIndex
}

function user_getselectvalueof(swhat){
	var c=eval("usr."+swhat)
	return c[c.selectedIndex].value
}

function user_getselecttextof(swhat){
	var c=eval("usr."+swhat)
	return c[c.selectedIndex].text
}

function user_help(what){
	var s=""
	if(what=="data"){
		s="If you have more than one unknown, then you can still solve the equation. In that case, enter data in the form of a table, with headers to indicate what is being entered.You will need at least as many pieces of data as variables you wish to solve for.\n\nFor example: \n\nT, K\n315, 1.3\n345, 2.6\n375, 5.2\n" 
	}
	if(s)alert(s)
}

function user_indicate(what,Variables,theresult,niter,err,msg){
	//alert(what+Variables)
	if(what=="start"){
		document.images[0].src="calc0.gif"
		imgnum=1
		return
	}
	if(what=="iter"){
		imgnum=3-imgnum
		document.images[0].src="calc"+imgnum+".gif"
		return
	}
	if(what=="reset"){
		document.images[0].src="calc0.gif"
		return
	}
	if(what=="stop"){
		document.images[0].src="stop.gif"
		return
	}
	if(what=="done"){
		document.images[0].src="calc3.gif"
		return
	}
}

function user_init(){
	usr=document.info
	doBtn("load")
}

function user_loadcalctable(){
	var s="<table>"
	var tr="<tr>"
	s+=tr
	s+="<td valign=top><textarea rows=8 cols=40 name=datavar></textarea></td>"
	s+="<td valign=top>"
	s+=user_tablebtn("solvereset","Reset",1)
	s+="<br>"
	s+=user_tablebtn("eval","Solve",1)
	s+="<BR>"+user_tablebtn("stop","Stop",1)
	s+="<p>&nbsp;&nbsp;<img src=calc0.gif>"+"</td></tr>"
	s+=tr+"<td><table><tr><td>Evaluate:</td><td><input type=text name=itest size=30 value='x'>"
	s+=" "+user_tablebtn("test","OK",0)+"</td></tr>"
	s+=tr+"<td>Result:</td><td><input type=text name=iresult size=30 value='0'>"
	s+="</td></tr></table></td></tr></table>"
	return s
}

function user_loaddatatable(){
	if(!ihavedataxyz)return ""
	var s="<table>"
	s+="<tr><td colspan=2>Enter <a href=javascript:user_help('data')>data</a> here if two or more variables are unknown:</td></tr>"
	+"<tr><td valign=top><textarea rows=4 cols=40 name=dataxyz onkeypress=dokeypress('dataxyz')></textarea></td>"
	s+="<td valign=top>"
	s+=user_tablebtn("cleardata","Clear",1)
	s+="<br>"+user_tablebtn("recalcdata","Recalc",1)
	s+="<br><input type=checkbox name=ignoredata> Ignore"
	s+="</td></tr></table>"
	return s
}

function user_loadselectlist(){
	var s="<table>"
	var tr="<tr>"
	s+=tr+"<td>Select:</td><td>"
	s+=user_tableselectArray("","solve",0,Functions,1,Functions.length,1)
	s+=user_tablebtn("load","Load",1)
	s+=user_tablebtn("sample","Sample",1)
	s+="</td></tr>"+tr+user_tableinput("Solve:","smodel","y=m*x+b",30,true)
//	s+="<a href=javascript:dokeypress('tsmodel')><img valign=bottom src=ok.gif width=16 height=16></a>"
	s+=user_tableselectArray(" for ","var",0,["What?","y","m","x","b","","","","","","",""],0,11,-1)
	s+="</td></tr>"
	s+="</table>"
	return s
}

function user_putdatavar(s){
	usr.datavar.value=s
}


function user_putiresult(s){
	var v=parseFloat(s)
	usr.iresult.value=(isNaN(v)?s:calc_roundoff(v))
}

function user_putitest(s){
	usr.itest.value=s
}

function user_setselect(slist,swhat){
	var c=eval("usr."+slist)
	for(var i=0;i<c.length;i++){
		if(c[i].text==swhat){
			c.selectedIndex=i
			doselect(slist)
			break
		}
	}
}

function user_setthevariables(V){
	//V from Vinfo_ or Dinfo_
	//V[i][0] name
	//V[i][1] value
	//V[i][2] selected

	var c=usr.svar
	var ithis=-1
	var nopt=0
	for(var i=0;i<V.length;i++){
		if(V[i][2]){
			ithis=i
			nopt++
		}
	}
	if(nopt!=1)ithis=-1
	ithis++
	for(var i=1;i<c.length;i++){
		c[i].text=(i<=V.length?V[i-1][0]:"")
	}
//	if(c.selectedIndex!=ithis){
		c.selectedIndex=0
		c.selectedIndex=ithis
//	}
}

function user_tablebtn(sname,svalue,isref){
	var s="doBtn('"+sname+"')"
	if(isref) return "&nbsp;&nbsp;<a href=javascript:void("+s+")>"+svalue+"</a>&nbsp;&nbsp;"
	return "<input type=button value='"+svalue+"' onclick="+s+">"
}

function user_tablecheck(slabel,sname,svalue,ischecked,ch){
	var s=(ch=="_"?"":"<td nowrap>")+"<input type=checkbox name=o"+ch+sname+" value='"+svalue+"' "+(ischecked?"checked":"")+"  onChange=docheck(name)>"+slabel
	return(s)
}

function user_tableinput(slabel,sname,svalue,isize,dotd){
	return (dotd?"<td nowrap>":" ")+slabel+(dotd?"</td><td>":" ")+"<input type=text name=t"+sname+" value='"+svalue+"' size="+isize+" onkeypress=dokeypress(name)>"
}

function user_tableselect(slabel,sname,n){
	var s=slabel+" <select name=s"+sname+" onchange='doselect(name)'>"
	for(var i=3; i<arguments.length-1; i+=2)
	{
		var sv=arguments[i]
		var st=arguments[i+1]
		if(st.length==0)st=sv
		s+="<option "+((i-3)==2*n?"selected":"")+" value=\""+sv+"\">"+st
	}
	return s+"</select>"
}

function user_tableselectArray(slabel,sname,n,A,ifirst,ilast,index){
	var s=slabel+" <select name=s"+sname+" onchange='doselect(name)'>"
	for(var i=ifirst; i<ilast; i++)
	{
		var sv=i
		var st=(index<0?A[i]:A[i][index])
		if(st.length==0)st=sv
		s+="\n<option "+(i==n?"selected":"")+" value=\""+sv+"\">"+st
	}
	return s+"\n</select>"
}

