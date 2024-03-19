//BH 5:24 AM 3/17/2003
//bh 5:39 AM 4/1/2003 added matheval()
//KINETEX

function registerquestions(){}

Data=new Array()
Quest=new Array()
Eqn=new Array()
BDE=new Array()
MolInfo=new Array()
TData=new Array()
EData=new Array()
PlotData=new Array()

thisqnum=0
datatext=""
x__=""
ndata=0
nquest=0
ntdata=0
ihavedata=0
DataKey=new Array()
slist=""
ncorrect=0
ntried=0
Ans=new Array()
Done=new Array()
Shown=new Array()
isdebug=true && false
debugtest=""
nquiz=(isdebug?4:10)
debugcountall=false
debugcount=0
isall=false
IfWrong=new Array()
CorrectComment=new Array()
HintData=new Array()
historylist=""
gifdir="../../common/"
haveaskedall=false
//calculation stuff
Variables=new Array()
nvar=0
VarKey=new Array()
VarVal=new Array()
ThisCalc=new Array() //[equation,varjs,ndig,value]
whendone=""
ineedsolve=false
iselecteddata=0
ncycles=0
nmaxcycles=100
theq=0
thisiq=0

SolveInfo=new Array()
SolveInfo.eqnset=""
SolveInfo.eqn=""
SolveInfo.xvar=""
SolveInfo.x0=0
SolveInfo.iq=0
SolveInfo.x=0
SolveInfo.isdone=0

x=0
//docstyle imported from styles.js

function answerButton(a,iscorrect){
	var sout=""
	sout=a+" "+iscorrect+"<p>"
	return sout
}

function getcalcunits(eqn){
	var S=new Array()
	S=eqn.split("]=")
	if(S.length<2)return ""
	S=S[S.length-2].split("[")
	if(S.length<2)return ""
	return " "+(S[S.length-1])
}

function calculate(iq,isuser,isdone){
	var eqn=ThisCalc[iq].eqn
 	var i=eqn.lastIndexOf("]=")
	ThisCalc[iq].units=""
	if(i>=0 && i==eqn.lastIndexOf("=")-1){
		ThisCalc[iq].units=getcalcunits(eqn)
	}else{
		ThisCalc[iq].units=(eqn.charAt(eqn.length-1)=="]"?" "+eqn.substring(eqn.lastIndexOf("[")+1,eqn.length-1):"")
	}
	eval(ThisCalc[iq].js)
	if(ThisCalc[iq].calcvar){
		whendone="docheckcalc2("+iq+","+isuser+")"
		x__=""
		calculatesimplex(iq)
		return
	}
	ThisCalc[iq].eqn=evaluateequation(iq,eqn,isdone)
	docheckcalc2(iq,isuser)
}

function calculatesimplex(iq){
	var eqn=ThisCalc[iq].eqn
	var slist=""
	if(eqn.indexOf("=")<0){
		calc_setupsimplexfunction(-1,eqn)
		eqn=findfunction(eqn)
		ThisCalc[iq].eqn=eqn
	}else{
		user_putinfo(eqn)  //(were reversed)
		calc_dosimplex("fullreset")
	}
	ncycles=0
	var S=ThisCalc[iq].vars.split("|")
	for(var i=0;i<S.length;i++){if(S[i] && !isNaN(ThisCalc[iq].VarVal[S[i]])){
		slist+=S[i]+"="+ThisCalc[iq].VarVal[S[i]]+";"
	}}
	calc_setvariables(slist)
	calc_setcalcvariable(ThisCalc[iq].calcvar)
	calc_setthevalue(ThisCalc[iq].calcvar+"="+ThisCalc[iq].calcvar0)
	calc_dosimplex("start")
}

function solve(seqn,xvar,x0){
	if(SolveInfo.isdone){
		return SolveInfo.x
	}
	if(arguments.length==2)x0=0
	SolveInfo.eqn=seqn
	SolveInfo.xvar=xvar
	SolveInfo.x0=x0
	user_putinfo(seqn)
	calc_dosimplex("fullreset")
	ncycles=0
	//alert(SolveInfo.vars)
	calc_setvariables(SolveInfo.vars)
	calc_setcalcvariable(xvar)
	calc_setthevalue(xvar+"="+x0)
	whendone="solve2(what)"
//alert(1)
	calc_dosimplex("start")
//alert(2)
	return 0
}

function solve2(what){
//alert(what)
	if(SolveInfo.isdone==true)return
	SolveInfo.isdone=true
	SolveInfo.x=eval(SolveInfo.xvar)
	var iq=SolveInfo.iq
//alert(SolveInfo.xvar+" "+SolveInfo.x)
	ThisCalc[iq].eqn=SolveInfo.eqnset
	//just reset the calculation, but now isdone is true
	calculate(iq,false,true)
}

function calculateusersimplex(iq,ansx){
	var eqn=ansx.substring(4,ansx.indexOf("\n"))
	user_putinfo(eqn)
	ncycles=0
	ansx=ansx.substring(ansx.indexOf("\n")+1,ansx.length)
	user_putdatavar(ansx)
	whendone="dousercalc2("+iq+",1)"
	calc_dosimplex("start")
}

function cleantest(s){
	if(s.indexOf("DELTA_")>=0)s=s.replace(/DELTA\_/g,sym("D"))
	return s
}

function createquestion(iq,ismulti,qtype,qask,AnsOpts,ithisdata,Keys){
	var S=new Array()
	var alist=""
	var sout=""
	var s=""
	var slist=""
	var i=0
	var ipt=0
	var ia=0
	var a=""
	var ABCDE="ABCDEFGHIJKLMNOP"
	if(qtype!="TF" && qtype!="MOPT2"){
		s=("   "+ithisdata)
		alist+=s.substring(s.length-3,s.length)
	}
	for(var i=0;i<Keys.length;i++){
		if(Keys[i] && (qtype=="TF" || qtype=="MOPT2" || Keys[i]!=ithisdata)){
			s=("   "+Keys[i])
			alist+=s.substring(s.length-3,s.length)
		}
		if(alist.length==15)break
	}
	if(qtype=="TEXT"||qtype=="INFO"||qtype=="DATA"||qtype=="CALC"||qtype=="CALCS")alist=""
	s="\n<table><tr><td class=table><table width=600>"
	s+="\n<tr>"
	s+="\n<td valign=top><a href=javascript:parent.Q_code.doq("+(-theq)+")><img valign=top border=0 name=img_"+iq+" src="+gifdir+"q.gif alt='more like this'></a></td>"
	s+=(ismulti||thisqnum?"<td class=qnum valign=top width=25><b><a href=javascript:parent.Q_code.doq("+(-theq)+")>#"+(thisqnum?thisqnum:iq)+".</a></b></td>":"")+"<td width=575 valign=top colspan=10>"+qask+"</td>"
	s+="</tr>"
	Ans[iq]=new Array()
	Done[iq]=false
	Shown[iq]=false
	//type "TF" : don't rearrange
	while(alist.length){
		ipt=(qtype=="TF"||qtype=="MOPT2"?0:rand(alist.length/3))*3
		i=parseInt(alist.substring(ipt,ipt+3))
		Ans[iq][ia]=(i==ithisdata?1:0)
		alist=alist.substring(0,ipt)+alist.substring(ipt+3,alist.length)
		s+="\n<tr><td align=right valign=top>&nbsp;&nbsp;"+ABCDE.charAt(ia)+"</td><td valign=top width=10>"
		s+="<input type=radio name=r"+iq+" onclick=parent.Q_code.doselect("+iq+","+ia+")></td>"
		s+="<td width=540 valign=top>"+AnsOpts[i]+(isdebug?"   "+Ans[iq][ia]:"")+"</td></tr>"
		ia++
	}
	if(qtype=="INFO"){
		//answer is variable names
		Ans[iq]=AnsOpts[1].split(";")
		s+="\n<tr><td>&nbsp;</td><td valign=top width=10></td><td width=540 valign=top>"
		s+="\n<p><table><tr><td>Indicate the correct values, then click \"check\" or click on \"show answer\" to see the correct values. You can do a calculation in any box.</td><td>"
		s+="\n<table><tr><td><table border>"
		for(var i=0;i<Ans[iq].length;i++){
			S=Ans[iq][i].split(/\=/)
			s+="\n<tr><td>&nbsp;"+S[0]+"&nbsp;</td><td><input type=text value='' size=20 name=i"+iq+"_"+S[0]+"></td></tr>"
		}
		s+="\n</table></td><td align=center nowrap>"
		+jsref("button","docalcinfo("+iq+")",'calculate')
		+"<br>"+jsref("button","docheckinfo("+iq+")",'check')
		+"<br>"+jsref("button","doshowinfo("+iq+")",'show answers')
		+"</td></tr></table></td></tr></table></td></tr>"		
	}
	if(qtype=="DATA"){
		s+="\n<tr><td>&nbsp;</td><td valign=top width=10></td><td width=540 valign=top>"
		+showDataWithBtns(iq,true)
	}
	if(qtype=="DATA"||qtype=="CALC"||qtype=="CALCS"){
		Ans[iq]=new Array(0,1)
		s+="\n<tr><td>&nbsp;</td><td valign=top width=10></td><td width=540 valign=top>"
		+"<textarea wrap=virtual rows=10 cols=50 name=c"+iq+">\n\n</textarea>"
		+"<input type=button value='calc' onclick=parent.Q_code.dousercalc("+iq+")>"
		+"<br><input type=text name=t"+iq+" size=20 value='answer?'>"
		+"<input type=button value='check' onclick=parent.Q_code.docheckcalc("+iq+",1)>"
		if(qtype=="CALCS"){
			s+="<input type=button value='show equation' onclick=parent.Q_code.doshoweqn("+iq+")>"
			s+="<input type=button value='show answer' onclick=parent.Q_code.dochecksimplex("+iq+")>"
		}else{
			s+="<input type=button value='show calculation' onclick=parent.Q_code.docheckcalc("+iq+",0)>"
		}
		if(HintData[iq]){
			s+="<input type=button value='hint' onclick=parent.Q_code.doshowhintdata("+iq+")>"
		}
		s+="</td></tr>"		
	}
	if(qtype=="TEXT"){
		Ans[iq]=new Array(0,1)
		s+="\n<tr><td>&nbsp;</td><td valign=top width=10></td><td width=540 valign=top>"
		+"<p>Write down your answer on paper, then check it using \"show answer.\"<br><textarea wrap=virtual rows=5 cols=50 name=c"+iq+">\n\n</textarea>"
		+"<br><input type=hidden name=t"+iq+" size=20 value='answer?'>"
		s+="<input type=button value='show answer' onclick=parent.Q_code.doshowtext("+iq+")>"
		if(HintData[iq]){
			s+="<input type=button value='hint' onclick=parent.Q_code.doshowhintdata("+iq+")>"
		}
		s+="</td></tr>"		
	}
	
	s+="\n<tr><td colspan=10 align=center>"
	s+="\n</table></td></tr></table>"
	return cleantest(s)
}

function doshowtext(iq){
	parent.Q_test.document.info["c"+iq].value=ThisCalc[iq].qans
}

function createvariables(iq,swhat,ireplace){
	var sinfo=swhat
	var sout=";"
	var vname=""
	var val=""
	var i=sinfo.indexOf("$")
	while(i>=0){
		vname=sinfo.substring(i+1,sinfo.length)
		vname=vname.substring(0,vname.indexOf("_"))
		if(vname.indexOf("$")>=0){
			vname=vname.substring(vname.indexOf("$")+1,vname.length) //$xd$yx__
			i=sinfo.indexOf("$"+vname+"_")
		}
		i=i+vname.length+2
		if(sinfo.charAt(i)=="~"){
			val=sinfo.substring(i+1,sinfo.length)
			sout+=";"+vname+"="+getvariablevalue(iq,sout,vname,parseFloat(val))
		}else{
			sout+=";"+vname+"="+getvariablevalue(iq,sout,vname)
		}
		sinfo=sinfo.substring(i,sinfo.length)
		i=sinfo.indexOf("$")
	}
	return (ireplace?replacevariables(swhat):sout)
}

function dochecksimplex(iq){
	doshoweqn(iq)
	docheckcalc(iq,0)
}

function docheckcalc(iq,isuser){
	if(!ThisCalc[iq]){
		alert("No calculation is possible.")
		return
	}
	if(ThisCalc[iq].soln+""==""){
		calculate(iq,isuser,false)
	}else{
		docheckcalc2(iq,isuser)
	}
}

function docheckcalc2(iq,isuser){
	//executed after simplex or standard equation
	var ansx=""
	var ndig=ThisCalc[iq].ndig
	if(x__=="?")return
	if(ThisCalc[iq].soln==""){
		//standard solution is in x__ (CALC) or .calcvar (CALCS)
		if(ThisCalc[iq].calcvar)eval("x__="+ThisCalc[iq].calcvar)
		ThisCalc[iq].soln=(isNaN(parseInt(x__+""))?x__:roundoff(x__,ndig))
		if(ThisCalc[iq].calcvar){
			datavar=datavar.substring(0,datavar.indexOf("//"))
			ThisCalc[iq].eqn="eqn: "+ThisCalc[iq].eqn+"\n"+datavar
			ThisCalc[iq].calcvar="_"
		}
	}
	x=ThisCalc[iq].soln
	if(isuser){
		ansx=(parent.Q_test.document.info["t"+iq].value+" ").split(" ")[0].toLowerCase()
		if(ansx=="answer?")return
		if(ansx=="true"||ansx=="false"){
			ansx=eval(ansx)
		}else{
			ansx=matheval(ansx)
			ansx=roundoff(ansx,ndig)
		}
		doselect(iq,(ansx==x?1:0))
	}else{
		Shown[iq]=true
		ansx=ThisCalc[iq].eqn.replace(/\;/g,"\n")
		parent.Q_test.document.info["c"+iq].value=ansx
		parent.Q_test.document.info["t"+iq].value=(ineedsolve?"?":x+ThisCalc[iq].units)
	}
}

function docheckinfo(iq){
 var isOK=true
 var S=new Array()
 //alert(Ans[iq])
 for(var i=0;i<Ans[iq].length;i++){
	S=Ans[iq][i].split("=")
	isOK=checkinfo(S[0],S[1],parent.Q_test.document.info["i"+iq+"_"+S[0]].value)
	if(!isOK){
		alert("Your value for "+S[0]+" is incorrect.")
		break
	}
 }
 if(isOK)doshowinfo(iq)
 doselect(iq,0,isOK)
}

function checkinfo(vname,theval,theirval){
	var isgetval=(arguments.length<3)
	var ivar=findvariable(vname)
	var type=Variables[ivar][VarKey["type"]]
	var ndig=parseInt(Variables[ivar][VarKey["ndig"]])
	if (isgetval)theirval=0
	if(type=="int"||type=="float"){
		if(isNaN(theval))theval=parseFloat(theval)
		if(isNaN(theirval))theirval=matheval(theirval)
		if(type=="int"){
			if(isNaN(theval))theval=Math.floor(theval)
			if(isNaN(theirval))theirval=Math.floor(theirval)
		}
		theirval=roundoff(theirval,ndig)
		theval=roundoff(theval,ndig)
	}
	return (isgetval?theval:(theval==theirval))
}

function doshowinfo(iq){
 var S=new Array()
 for(var i=0;i<Ans[iq].length;i++){
	S=Ans[iq][i].split("=")
	parent.Q_test.document.info["i"+iq+"_"+S[0]].value=checkinfo(S[0],S[1])
 }
}

function docalcinfo(iq){
 var S=new Array()
 for(var i=0;i<Ans[iq].length;i++){
	S=Ans[iq][i].split("=")
	parent.Q_test.document.info["i"+iq+"_"+S[0]].value=matheval(parent.Q_test.document.info["i"+iq+"_"+S[0]].value)
 }
}

function doinit(){
	if(top==self)location="index.htm"
	var S=(parent.location+"").replace(/\?/g,"#").split("#")
	if(!isNaN(S[1])){
		setTimeout("doq("+(-S[1])+")",100)
		return
	}
	setTimeout("parent.Q_test.location='blank.htm'",100)
}

function doq(n){
	var sout=""
	var ismore=(n<0?-n:0)
	thisqnum=ismore
	if(ismore)n=1
	if(!ndata)getdatakey()
	if(nquest==0){
		alert("No questions!")
		return
	}
	ncorrect=0
	ntried=0
	if(!debugcountall)slist=""
	if(n==10 && isdebug)n=nquiz
	isall=(n==0)
	if(isall){
		n=nquest-1
		if(!haveaskedall)alert("Questions of all " + n + " types will be asked in order.\nStill, for some, only one of the many variations will be asked.")
		haveaskedall=true
	}
	document.images[0].src=gifdir+"q.gif"
	document.info.status.value=""
	for(var i=0;i<n;i++){
		sout+=getquestion(i+1,isall?i+1:ismore?ismore:0,n>1)
	}
	debugcount+=n
	if(debugcountall){
		document.info.status.value=debugcount
	}
	sout="<form name=info>"+sout+"</form>"
	dowrite(sout)
}

function doselect(iq,ia,v){
	if(arguments.length<3)v=Ans[iq][ia]
	var s="\n\n"
	if(!Done[iq] && !Shown[iq])ntried++
	if(v){
		if(!Shown[iq] && !Done[iq])ncorrect++
		if(CorrectComment[iq].length)alert(CorrectComment[iq])
	}else{
		if(IfWrong[iq].length)alert(IfWrong[iq])
	}
	Done[iq]=true
	s=ncorrect+" of the "+nquiz+" questions you answered were correct the first time."
	if(ncorrect==nquiz)s+="\n\nTerrific!"
	if(ntried==nquiz)alert(s)
	document.info.status.value=(v?"Correct!":"That is not the correct answer.")
	if(v){
		parent.Q_test.document["img_"+iq].src=gifdir+"ok.gif"
		document.images[0].src=gifdir+"ok.gif"
	}else{
		parent.Q_test.document["img_"+iq].src=gifdir+"x.gif"
		document.images[0].src=gifdir+"x.gif"
	}
}

function doshoweqn(iq){
	var s=ThisCalc[iq].eqn
	if(s.indexOf("eqn:")==0){
		s=s.substring(5,s.indexOf("\n"))
	}
	if(s.indexOf("=")<0)s=findfunction(s)
	s+="\n"
	s="eqn: "+s+calc_getvariables(s).replace(/\?/g,"").replace(/\;/g,"\n")
	parent.Q_test.document.info["c"+iq].value=s
}

function doshowhintdata(iq){
	alert(HintData[iq])
}

function dousercalc(iq){
	var ansx=""
	ansx=parent.Q_test.document.info["c"+iq].value
	if(ansx.indexOf("eqn:")==0){
		calculateusersimplex(iq,ansx)
		return
	}
	
	ansx=fixcalc(ansx)
	parent.Q_test.document.info["c"+iq].value=evaluateequation(iq,ansx,false).replace(/\;/g,"\n")
	parent.Q_test.document.info["t"+iq].value=x__
}

function dousercalc2(iq){
	var ndig=ThisCalc[iq].ndig
	var eqn=parent.Q_test.document.info["c"+iq].value
	if(eqn.indexOf("eqn:")==0){
		eqn=eqn.substring(0,eqn.indexOf("\n"))
		datavar=datavar.substring(0,datavar.indexOf("//"))
		parent.Q_test.document.info["c"+iq].value=eqn+"\n"+datavar
		parent.Q_test.document.info["t"+iq].value=roundoff(iresult,ndig)
	}
}

function dowrite(sout){
	var d=parent.Q_test.document
	
	d.open()
	d.write(docstyle)
	d.write(sout)
	d.close()
}

function evaluateequation(iq,eqn,isdone){
	if(arguments.length==1){
		eqn=iq
		iq=0
		isdone=false
	}
	x__=0
	var pt__=0
	var sout=""
	var s__=""
	var seq__=""
	var sunits__=""
	var slast=""
	var A__=new Array()
	var ilong__=0
	mainvlist_=defaultmainvlist_
	var S__=eqn.split(";")
	ineedsolve=false
	SolveInfo.eqnset=eqn
	SolveInfo.vars=""
	SolveInfo.isdone=isdone
//alert(isdone+" "+eqn)
	for(var i__=0;i__<S__.length;i__++){if(S__[i__].length){
			A__[i__]=""
			s__=x__=S__[i__]
			pt__=x__.indexOf("=")
			if(x__.length>40 && pt__>=0){
				s__="  "+x__.substring(pt__+1,x__.length)				
				S__[i__]=x__.substring(0,pt__+1)+"\n"+s__
			}
			ilong__=Math.max(s__.length,ilong__)
			if(x__.indexOf("BDE(")>=0)x__=BDEfilter(x__)
			if(x__.indexOf("solve(")>=0){
				ineedsolve=!isdone
				SolveInfo.eqnset=eqn
				SolveInfo.iq=iq
				x__=""+eval(x__)
			}
			if(x__.indexOf("plot(")>=0){
				getTheData(ThisCalc[iq].datatext)
				plot(x__.substring(x__.indexOf("plot(")+5,x__.lastIndexOf(")")))
				x__=""+PlotData.L.r2
			}
			if(ineedsolve){
				A__[i__]="?"
			}else if(x__.indexOf("//")<0){
				x__=math(x__,true)
				A__[i__]=eval(x__)
				SolveInfo.vars+=S__[i__].split("=")[0]+"="+A__[i__]+";"
			}
	}}
	for(var i__=0;i__<S__.length;i__++){if(S__[i__].length){
			x__=A__[i__]
			sunits__=getcalcunits(S__[i__])
			if(S__[i__].indexOf("\n")>=0){
				sout+=S__[i__].split("\n")[0]+"\n"
				S__[i__]=S__[i__].split("\n")[1]
			}
			s__=S__[i__]+"\n"
			seq__=(x__==""?"":"= "+x__)
			if(s__.indexOf(seq__+"\n")>=0)seq__=""
			if(seq__!="")seq__="   "+seq__+sunits__+";"
			if(s__!=slast)sout+=s__+seq__
			slast=s__+seq__

	}}
	return sout
}

function findfunction(fname){
	for(var i in Functions){if(Functions[i][0]==fname)return Functions[i][2]}
	return ""
}

function findvariable(vname){
	var iname=VarKey["name"]
	for(var i=1;i<Variables.length;i++){
		if(Variables[i][iname]==vname){
			return i
		}
	}
	return 0
}

function showascii(s){
 alert(s)
 var sout=""
 for(var i=0;i<s.length;i++)sout+=s.charCodeAt(i)+" "
 alert(sout)
}

function fixinputlines(s){
	//IE uses \r\n for line ends, while Netscape uses just \n
	//figure on some browsers just using \r as well.
	//furthermore, some versions of IE refuse to replace \r with \n!
	//however, it can replace \r\n with \n.
	return strsub(strsub(s.replace(/\r/g,"\n").replace(/\r\n/g,"\n"),"\n\n","\n"),"  "," ")
}

function fixcalc(ansx){
	ansx=ansx.replace(/\ /g,"")
	ansx=fixinputlines(ansx)
	var S=ansx.split("\n")
	var L=new Array()
	var sout=""
	for(var i=0;i<S.length;i++){
		L=S[i].split("...=")
		if(L[0].charAt(0)!="=")sout+=L[0]+";"	
	}
	sout=sout.replace(/\n/g,";")
	sout=sout.replace(/\;\;/g,";")
	sout=sout.replace(/\=\;/g,"=")
	return sout
}

function flushleft(s,n){
	var sp=s+"                                                       "
	return sp.substring(0,n)
}

function formatquestion(iq,ismulti,qtype,qask,qinsert,qanslist,AnsOpts,InsertOpts,Keys){

	var isOK=false
	var s=""
	var i=0
	var sout=""
	var thisinsert=""
	var ithisdata=0
	var ithisdata2=0
	var ikey=0
	var ntry=0
	var ihint=0
	var theanswer=0
	var slist=""
	var sno=""
	var ineedvariables=true

	//returns just the formatted question part in AnsOpts[0]
	//find an acceptable correct answer
	if(qtype=="CALCS"||qanslist=="CALCEQN"||qtype=="INFO"||qtype=="TEXT"){
		isOK=true
		ithisdata=1
		thisinsert=""
	}else if(qtype=="TF"){
		isOK=true
		ithisdata=-1
		thisinsert=""
	}else if(qtype=="MREL" && InsertOpts[0]){
		ihint=InsertOpts[0]
	}else if((qtype=="MOPT"||qtype=="MOPT2") && qanslist.charAt(0)=="["){
		isOK=true
		ithisdata=-1
		thisinsert=""
	}
	while(!isOK){
		if(++ntry==100)isOK=true
		ikey=rand(Keys.length)
		i=Keys[ikey]
		if(InsertOpts.length>i)thisinsert=InsertOpts[i]
		if((thisinsert+"").charAt(0)!="!" && (qanslist==""||qanslist.indexOf(AnsOpts[i])>=0)){
			isOK=true
			ithisdata=i
			if(ihint==0)ihint=ithisdata
		}
	}
	if(ithisdata==0){
		sout+="Couldn't format question--ithisdata=0, ntry="+ntry+"\n" + qask
		sout+="<pre>ithisdata: "+ithisdata+"\nqanslist: "+qanslist+"</pre>"
		sout+="<pre>"+"\nAnsOpts "+AnsOpts+"\nKeys "+Keys+"\nInsertOpts "+InsertOpts+"</pre>"
		isdebug=true
		return sout
	}
	if(ithisdata>1 && InsertOpts[ithisdata])thisinsert=InsertOpts[ithisdata]
	if(ihint>1 && DataKey["hint"] && Data[ihint][DataKey["hint"]])IfWrong[iq]="Hint: "+Data[ihint][DataKey["hint"]]
	//RELATIVE option a > b? InsertOpts[1] holds 1 or -1
	if(qtype=="MREL"){
		isOK=false
		ntry=0
		while(!isOK){
			if(++ntry==100)isOK=true
			ikey=rand(Keys.length)
			i=Keys[ikey]
			if(isdebug && qanslist!="")sout+="<pre>\n"+i+" "+qanslist+" "+AnsOpts[i]+"</pre>"
			if((qanslist==""||qanslist.indexOf(AnsOpts[i])>=0)&& i!=ithisdata && InsertOpts[i]!=thisinsert){
				isOK=true
				ithisdata2=i
				Keys=new Array(ithisdata,ithisdata2)
			}
		}
		thisinsert=""
	}
	
	if(isdebug)sout+="<pre>"+i+ " Keys: "+Keys+"</pre>"
	
	sno=""
	//remove other acceptable answers
	if(ithisdata2==0 && InsertOpts.length>0){
		for(var i=2;i<InsertOpts.length;i++){
			if(i!=ithisdata && InsertOpts[i]==thisinsert)sno+=","+i+","
		}
	}
	if(isdebug)sout+="<pre>removing other acceptable answers:"+sno+"</pre>"
	slist=","+AnsOpts[ithisdata]+","
	
	
	//remove multiple identical answers
	for(var i=2;i<AnsOpts.length;i++){
		if(i!=ithisdata && slist.indexOf(","+AnsOpts[i]+",")>=0)sno+=","+i+","
		slist+=","+AnsOpts[i]+","
		if(isdebug)sout+="<pre>"+i+ " remove multiple here:"+AnsOpts[i]+" real:"+AnsOpts[ithisdata]+" same?"+(AnsOpts[i]==AnsOpts[ithisdata])+" excluding:"+sno+"</pre>"
		
	}
	
	if(isdebug)sout+="<pre>removing multiple identical answers:"+sno+"</pre>"
	
	//remove multiple correct answers
	slist=","+qanslist+","
	if(qanslist.length){
		for(var i=2;i<AnsOpts.length;i++){
			if(i!=ithisdata && slist.indexOf(","+AnsOpts[i]+",")>=0)sno+=","+i+","
		}
	}
	
	if(isdebug)sout+="<pre>removing multiple correct answers:"+sno+"</pre>"
	
	if(sno!=""){
		for(var i=0;i<Keys.length;i++){
			if(sno.indexOf(","+Keys[i]+",")>=0)Keys[i]=""
		}
	}
	
	if(ithisdata>1 && thisinsert.indexOf(".gif")>=0){
		thisinsert="<center><img src="+thisinsert+"></center>"
		if(qask.indexOf("<table")<0 && qask.indexOf("on the right")>=0){
			qask="<table><tr><td valign=top>"+qask+"</td></tr></table>"
			thisinsert="</td><td>"+thisinsert
		}else{
			thisinsert="<p>"+thisinsert
		}
	}
	i=qask.indexOf("$")
	if(ithisdata>1)qask=strsub(qask,"$"+qinsert+"_",thisinsert)

	ThisCalc[iq].i=ithisdata

	createvariables(iq,qask,false)
//	alert(qask+" NOW HAVE VARS "+ThisCalc[iq].vars)
	ThisCalc[iq].datatext=datatext
	qask=replacevariables(qask)
	if(HintData[iq])HintData[iq]=replacevariables(HintData[iq])//.replace(/\@/g,"\t")
	if(qtype=="DATA"||qtype=="CALC"||qtype=="CALCS"){
		//must substitute values into qask and do calculation now
		if(qtype=="CALCS"){
			ThisCalc[iq].calcvar=AnsOpts[0].split("=")[0]
			ThisCalc[iq].calcvar0=parseFloat((AnsOpts[0]+"=0").split("=")[1])
			ThisCalc[iq].ndig=parseFloat(Variables[findvariable(ThisCalc[iq].calcvar)][VarKey["ndig"]])
		}else{
			ThisCalc[iq].calcvar=""
			ThisCalc[iq].ndig=parseFloat(ithisdata==1?AnsOpts[0]:Data[ithisdata][DataKey["ndig"]])
			if(isNaN(ThisCalc[iq].ndig))ThisCalc[iq].ndig=0
		}
		ThisCalc[iq].eqn=replacevariables(AnsOpts[ithisdata])//1 for CALCS
	}else if(qtype=="MOPT"||qtype=="MOPT2"){
		qask=qask.replace(/\_\?\_/,"_______________")
	}
	
	if(i==0)qask=qask.charAt(0).toUpperCase()+qask.substring(1,qask.length)
	if(isdebug)sout+="<pre>"+qask+"\nAnsOpts "+AnsOpts+"\nKeys "+Keys+"\nInsertOpts "+InsertOpts+"\nithisdata"+ithisdata+"</pre>"
	
	if(qtype=="MREL"){
		i=(InsertOpts[ithisdata]>InsertOpts[ithisdata2] && InsertOpts[1]==1 || InsertOpts[ithisdata]<InsertOpts[ithisdata2] && InsertOpts[1]==-1)
		ithisdata=(i?ithisdata:ithisdata2)
	}else if(qtype=="MOPT"||qtype=="MOPT2"){
		if(ithisdata<0)ithisdata=parseInt(replacevariables(qanslist))+2
	}else if(qtype=="TF"){
		ithisdata=InsertOpts[1]
		if(ithisdata<0)ithisdata=(parseInt(replacevariables(InsertOpts[0]))?2:3)
	}
	sout+=createquestion(iq,ismulti,qtype,qask,AnsOpts,ithisdata,Keys)
	AnsOpts[0]=qask
	return sout
}

function getComparison(what,A){
 //returns array with first two slots empty, as in Data
 var icompare=DataKey[what]
 var s=""
 var i=0
 var j=0
 while(s==""){
	j=randx_y(2,Data.length-1)
	s=Data[j][icompare]
 }
 s=",,"+s
 var S=s.split(",")
 for(i=0;i<S.length;i++)A[i]=S[i]
 return j
}

function dataselect(what,val){
	if(arguments.length==1)val=""
	if(!DataKey[what]){
		alert("No column heading "+what)
		return what+"?"
	}
	var S=new Array()
	for(var i=2;i<Data.length;i++){
		if(Data[i][DataKey[what]]!="" && (val=="" || Data[i][DataKey[what]]==val))S[S.length]=i
	}
	return S[rand(S.length)]	
}

function getdatakey(){
	var val=""
	ndata=Data.length
	if(ndata){
		//set column headings
		for(var i=0;i<Data[1].length;i++){
			DataKey[Data[1][i]]=i
		}
	}
	
	nvar=Variables.length
	if(nvar){
		//set column headings
		for(var i=0;i<Variables[1].length;i++){
			VarKey[Variables[1][i]]=i
		}
		//set const values
		for(var i=0;i<nvar;i++){
			val=Variables[i][VarKey["value"]]
			VarVal[Variables[i][VarKey["name"]]]=(Variables[i][VarKey["type"]]=="const"?(val.indexOf(".")>=0?parseFloat(val):parseInt(val)):Variables[i][VarKey["name"]])
		}
	}
	//set number of question types
	nquest=0
	for(var i=Quest.length-1;i>=0;i--){
		if(Quest[i][0].length){
			nquest=i+1
			break
		}
	}
}

function getquestion(iq,thisq,ismulti){
	var sout=""
	var qtype=""
	var qans=""
	theq=0
	iselecteddata=0
	var isOK=false
	var qinsert=""
	var qanstype=""
	var qreltype=""
	var qrelorder=0
	var i=0
	var s=""
	var S=new Array()
	var A=new Array()
	var qanslist=""
	var icount=0
	var icount2=0

	while (!isOK && ++icount<1000){
		sout=""
		thisiq=iq
		ThisCalc[iq]=new Array()
		ThisCalc[iq].soln=""
		ThisCalc[iq].vars=""
		ThisCalc[iq].js=""
		ThisCalc[iq].VarVal=new Array()
		ThisCalc[iq].AnsOpts=new Array()
		ThisCalc[iq].InsertOpts=new Array()
		ThisCalc[iq].Keys=new Array()
		PlotData=new Array()
		qanslist=""
		theq=0
		icount2=0
		while(theq==0||thisq==0 && !ismulti && historylist.indexOf(","+theq+",")>=0){
			theq=(thisq && icount==1?thisq:rand1_n(nquest-1))
			if(++icount2==100)historylist="x" //having trouble...
		}
		historylist+=","+theq+","
		qtype=Quest[theq][0]
		qans=Quest[theq][1]
		qask=Quest[theq][2]
		
		//check for question|explanation on error
		IfWrong[iq]=""
		i=qask.indexOf("|")
		if(i>=0){
			IfWrong[iq]=qask.substring(i+1,qask.length)
			qask=qask.substring(0,i)
		}
		//check for comment on correct
		CorrectComment[iq]=""
		i=qask.indexOf("!!")
		if(i>=0){
			CorrectComment[iq]=qask.substring(i+2,qask.length)
			qask=qask.substring(0,i)
		}
		HintData[iq]=""
		i=qask.indexOf("??")
		if(i>=0){
			HintData[iq]=qask.substring(i+2,qask.length)
			qask=qask.substring(0,i)
		}
		
		//check for needed insertion
		qinsert=""
		i=qask.indexOf("$")
		if(i>=0){
			qinsert=qask.substring(i+1,qask.length)
			qinsert=qinsert.substring(0,qinsert.indexOf("_"))
			if(isNaN(DataKey[qinsert]) && !VarVal[qinsert]){
				alert("No column heading '"+qinsert+"' required for "+qask+".")
			}
			for(var i=2;i<ndata;i++){if(!isNaN(DataKey[qinsert])){
					s=Data[i][DataKey[qinsert]].replace(/\ /g,"")
					if(s!="")ThisCalc[iq].InsertOpts[i]=Data[i][DataKey[qinsert]]
			}}
			if(ThisCalc[iq].InsertOpts.length==0 && !qtype=="CALCS"){alert("No information in column heading "+qinsert+" was found.")}
		}	
		if(qtype=="INFO"){
			qanslist=qans
			S=qans.split(",")
			qans=""
			for(var i=0;i<S.length;i++)qans+=(i==0?"":";")+S[i]+"=\$"+S[i]+"_"
			createvariables(iq,qask,false)
			qask=replacevariables(qask)
			createvariables(iq,qans,false)
			qans=replacevariables(qans)
			ThisCalc[iq].AnsOpts[1]=qans
			qanstype="info"
		}else if(qtype=="TEXT"){
			createvariables(iq,qask,false)
			qask=replacevariables(qask)
			createvariables(iq,qans,false)
			qans=replacevariables(qans)
			ThisCalc[iq].AnsOpts[1]=qans
			ThisCalc[iq].qans=qans
			qanstype="text"
		}else if(qtype=="MOPT"||qtype=="MOPT2"||qtype=="DATA"||qtype=="CALC"||qtype=="CALCS"){
			i=qans.indexOf(":")
			qanstype=""
			if(i>=0 &&(qtype=="MOPT"||qtype=="MOPT2"||qtype=="CALCS")){
				//$type:some subset which is correct
				//or eqn:var for CALCS
				//qanstype:qanslist
				qanslist=qans.substring(i+1,qans.length)
				qanstype=qans.substring((qans.charAt(0)=="$"?1:0),i)
			}else if(qans.charAt(0)=="$"){
				//$type only
				qanstype=qans.substring(1,qans.length)
			}else if(qtype!="MOPT" && qtype!="MOPT2" && (qans.indexOf("=")>=0 || qans.charAt(0)=="[")){
				S=(qans+"@X").split("@")
				ThisCalc[iq].AnsOpts[1]=S[0]
				ThisCalc[iq].AnsOpts[0]=S[1]
				ThisCalc[iq].Keys[0]=1
				qanstype="CALCEQN"
				qanslist="CALCEQN"
			}	
			if(qtype=="MOPT"||qtype=="MOPT2"){
				if(qans.charAt(0)=="["){
					createvariables(iq,qask,false)
					qask=replacevariables(qask)
					qans=replacevariables(qans)
				}
				if(qans.indexOf("*")>=0){
					//option1,option2*,option3
					//or $type:option1,option2*,option3
					//can accomodate more than one correct answer
					qans=",,"+(qanslist.length?qanslist:qans)
					S=qans.split(",")
					for(var i=2;i<S.length;i++){
						ThisCalc[iq].InsertOpts[i]="X"+i
						ThisCalc[iq].AnsOpts[i]=S[i].replace(/\*/,"")
						if(S[i].indexOf("*")>=0)qanslist+=","+ThisCalc[iq].AnsOpts[i]
					}
					qanstype="list"
				}else if(qans.indexOf("|")>=0){
					//option1,option2,...|[[Javascript]]
					A=qans.split("|")
					qans=",,"+A[0]
					S=qans.split(",")
					for(var i=2;i<S.length;i++){
						ThisCalc[iq].InsertOpts[i]="X"+i
						ThisCalc[iq].AnsOpts[i]=S[i]
					}
					qanslist=A[1] //[[calc]]
					qanstype="calc"		
				}
			}
			if(qanstype==""){
				alert("Can't decode " + qans+" in "+qask)
				return ""
			}
			//load answer options
			if(qtype=="CALCS"){
				ThisCalc[iq].AnsOpts[1]=qanstype  //eqn
				ThisCalc[iq].AnsOpts[0]=qanslist  //var
			}else if(ThisCalc[iq].AnsOpts.length==0){
				for(var i=2;i<ndata;i++){
					ThisCalc[iq].AnsOpts[i]=Data[i][DataKey[qanstype]]
				}
			}
		}else if(qtype=="MREL"){ 
			//$column1_,$column2_,1 or -1
			//or $column,$function,1 or -1
			S=qans.split(",")
			qanstype=S[0].substring(1,S[0].length)
			qreltype=S[1].substring(1,S[1].length)
			qrelorder=parseInt(S[2])
			ThisCalc[iq].InsertOpts[1]=qrelorder
			qinsert=qreltype
			if(S[1].indexOf("[[")==0){
				//function instead of column
				s=S[1].substring(2,S[1].length-2)
				ThisCalc[iq].InsertOpts[0]=getComparison(qanstype,ThisCalc[iq].AnsOpts)//points to data
				for(var i=2;i<ThisCalc[iq].AnsOpts.length;i++){
					ThisCalc[iq].InsertOpts[i]=eval(s.replace(/\$x\_/g,ThisCalc[iq].AnsOpts[i]))
				}
				for(var i=2;i<ThisCalc[iq].AnsOpts.length;i++){
					ThisCalc[iq].AnsOpts[i]=setsubs(ThisCalc[iq].AnsOpts[i],0)
				}
			}else{
				//load answer options from columns
				for(var i=2;i<ndata;i++){
					ThisCalc[iq].AnsOpts[i]=Data[i][DataKey[qanstype]]
				}
				for(var i=2;i<ndata;i++){
					ThisCalc[iq].InsertOpts[i]=parseFloat(Data[i][DataKey[qinsert]])
				}
			}
		}else if(qtype=="TF"){
			ThisCalc[iq].AnsOpts=new Array("","","True","False")
			ThisCalc[iq].InsertOpts=new Array(qans,(qans.charAt(0)=="["?-1:parseInt(qans)?2:3),"1","0")
		}else{
			alert("Unknown type:"+qtype+" in "+qask)
			return ""
		}
		//check for answer options and insert options BOTH being nonzero
		if(qtype!="CALCS" && qtype!="INFO"){
			for(var i=2;i<ndata;i++){
				if(ThisCalc[iq].AnsOpts[i]!="" && (ThisCalc[iq].InsertOpts.length==0||(ThisCalc[iq].InsertOpts.length>i && ThisCalc[iq].InsertOpts[i] && ThisCalc[iq].InsertOpts[i]!=""))){
					ThisCalc[iq].Keys[ThisCalc[iq].Keys.length]=i
				}
			}

			if(ThisCalc[iq].Keys.length==0){
				sout+=("Problems--no acceptable answer for " + qask)
				alert(ndata +" "+sout+"\n"+ThisCalc[iq].InsertOpts+"\n"+ThisCalc[iq].AnsOpts)
				return ""
			}
		}
		sout+=formatquestion(iq,ismulti,qtype,qask,qinsert,qanslist,ThisCalc[iq].AnsOpts,ThisCalc[iq].InsertOpts,ThisCalc[iq].Keys)
		isOK=(slist.indexOf(ThisCalc[iq].AnsOpts[0])<0)
		if(isdebug && debugtest.length)isOK=isOK && (ThisCalc[iq].AnsOpts[0].indexOf(debugtest)>=0)
		//alert(isOK+" "+ThisCalc[iq].AnsOpts[0])
	}
	slist+=ThisCalc[iq].AnsOpts[0]
	return sout
}

function getvariablevalue(iq,sinfo,vname,val){
	if(iq>=0)ThisCalc[iq].vars+=vname+"|"

	if(sinfo.indexOf(";"+vname+"=")>=0){
		return VarVal[vname]
	}
	if(arguments.length==4){
		VarVal[vname]=val
		ThisCalc[iq].VarVal[vname]=val
		return val
	}
	var ivar=findvariable(vname)
	if(ivar==0 && DataKey[vname]){
		if(iselecteddata==0)iselecteddata=dataselect(vname)
		val=Data[iselecteddata][DataKey[vname]]
		VarVal[vname]=val
		ThisCalc[iq].VarVal[vname]=val
		return val
	}
	if(ivar==0){
		alert("data.js does not contain the variable "+vname)
		return 0
	}
	var type=Variables[ivar][VarKey["type"]]
	var min=parseFloat(Variables[ivar][VarKey["min"]])
	var max=parseFloat(Variables[ivar][VarKey["max"]])
	//nig>=10 implies we are rounding to the nearest ndig (ch8quiz)
	var ndig=parseInt(Variables[ivar][VarKey["ndig"]])
	val=Variables[ivar][VarKey["value"]]
	//[[xxxx]] means evaluate this--see ch5
	if(val.indexOf("[[")==0){
		val=eval(createvariables(iq,val.substring(2,val.length-2),true))
	}else if(type=="array"){
		var S=val.split(",")
		val=parseFloat(S[rand(S.length)])
	}else if(type=="const"){
	}else if(type=="string"){
	}else{
		val=rand2(min,(ndig>=10?ndig-1:0)+max)
	}
	if(type=="int")val=Math.floor(val)
	if(type=="int"||type=="float"){
		val=roundoff(val,ndig)
	}
	if(type=="int")val=Math.floor(val)
	VarVal[vname]=val
	ThisCalc[iq].VarVal[vname]=val
	return val
}

function rand(n){
	return randx_y(0,n-1)
}

function rand0_n(n){
	return randx_y(0,n)
}

function rand1_n(n){
	return randx_y(1,n)
}

function rand2(t1,t2){return (t2-t1)*Math.random()+t1}

function randx_y(x,y){
	return Math.floor(Math.random()*(y-x+1)+x)
}

function replacevariables(sinfo){
	var vname=""
	var i=sinfo.indexOf("$")
	var val=""
	while(i>=0){
		vname=sinfo.substring(i+1,sinfo.length)
		vname=vname.substring(0,vname.indexOf("_"))
		if(vname.indexOf(" ")>=0)alert("Variable name error with "+vname)
		if(vname.indexOf("$")>=0){
			vname=vname.substring(vname.indexOf("$")+1,vname.length) //$xd$yx__
			i=sinfo.indexOf("$"+vname+"_")
		}
		if(sinfo.charAt(i+vname.length+2)=="~"){  // Temp of ($T_~345.15;72) .... for example
			val=sinfo.substring(i+vname.length+3,sinfo.indexOf(")",i))
			if(val.indexOf(";")>=0)val=val.substring(val.indexOf(";")+1,val.length)
			sinfo=sinfo.substring(0,i-1)+val+sinfo.substring(sinfo.indexOf(")",i)+1,sinfo.length)
		}else{
			sinfo=sinfo.substring(0,i)+VarVal[vname]+sinfo.substring(i+vname.length+2,sinfo.length)
		}
		i=sinfo.indexOf("$")
	}
	return replaceJS(sinfo)
}

function replaceJS(sinfo){
	var js=""
	var i=sinfo.indexOf("[[")
	while(i>=0){
		js=sinfo.substring(i+2,sinfo.length)
		js=js.substring(0,js.indexOf("]]"))
		sinfo=sinfo.substring(0,i)+eval(js)+sinfo.substring(i+js.length+4,sinfo.length)
		i=sinfo.indexOf("[[")
	}
	return sinfo
}

function showtop(){
	getdatakey()
	var s='<form name=info>'
	+'<input type=text name=status size=30 class=statusinfo value="">'
	+'<input type=button name=btnQ onclick=doq(1) value="New Question">'
//	+'<input type=button name=btnQ onclick=doq(10) value="10-Question Quiz">'
	+'<input type=button name=btnQ onclick=doq(0) value="All '+(nquest-1)+'">'
	+'<img border=0 src='+gifdir+'q.gif><br>'
	+'</form>'
	for(var n=1;n<nquest;n++)s+="\n<a href=javascript:parent.Q_code.doq("+(-n)+")>#"+n+"</a>"	

	document.write(s)
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

function plural(i){return (i==1?"":"s")}

function hidden(s){return ""}

function getRandomItem(A,notlist){
 var S=new Array()
 var i=-1
 var x=""
 if(arguments.length<2)notlist=""
 for(var x in A)S[S.length]=x
 var s=notlist
 notlist=";"+s+";"
 while(notlist.indexOf(";"+s+";")>=0){
	x=S[rand(S.length)]
	if(s=="")return x
	s=x
 }
 return x
}

function jsref(cla,cmd,txt){
 if(cla)cla=" class="+cla
 return "<a"+cla+" href=\"javascript:parent.Q_code."+cmd+"\">"+txt+"</a>"
}

function roundoff(x,ndig){
 return (ndig>=10?calc_roundoff(x/ndig,0)*ndig:calc_roundoff(x,ndig))
}
