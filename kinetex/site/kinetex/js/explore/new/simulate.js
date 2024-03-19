//CHECKJS  D:\js\kinetex\simulate.js 1/31/2003 6:28:29 AM
//11:23 AM 4/15/2003
// Simulate_init() should be in body tag as part of onload=
/*
simulate.js
simulate.js is a self-contained package to simulate a chemical reaction 
on the web using virtual components.
The following components are envisioned:
Model		the theoretical model for the reaction
Expt		the experiment controls--start/stop/reset/timer/wavelength/absorbance
Rxn		the reaction itself
Data		the record of data produced
Graph		the graph of the data
Analysis	an analysis of the data
Debug		debugging module
Q		question/answer module

Each of the above eight components consists of:
 --a set of underlying methods such as Model_addcomponent(), Expt_start(), Expt_stop()
 --a set of underlying data structures such as Model["simulation1"].components[]
 --a set of (optional) divs that provide a user interface, div_Model, div_Expt, etc.
The idea:
Build as many components into your page as you need. Display them or not.
Each simulation has a name and can be addressed directly from code or via the
user interface. There can be as many simuations as you need, and each one could
be as simple or complex as desired. 
The implementation:
I'm going to start simple and build from there.
First, we have just a simple model, simple experiment controls Start/Stop/Reset,
and a simple reaction:
Model	hidden
Expt	just start,stop,reset
Rxn	a test tube with a colored solution
Here goes!
*/
//global structures
SimInfo=new Array()
SimInfo.Exp=new Array()
SimInfo.gifdir="gif/"
SimInfo.divgraphdir="../common"
SimInfo.options=""
SimInfo.conceptdir="../../concept"
SimInfo.exploredir="."
SimInfo.thisexp=""
ModelInfo=new Array()
ExptInfo=new Array()
RxnInfo=new Array()
DataInfo=new Array()
GraphInfo=new Array()
AnalysisInfo=new Array()
DebugInfo=new Array()
MouseInfo=new Array()
MouseInfo.event="up"
C=new Array()
dC=new Array()
ihaverxnjs=false
ihavedatajs=false
ihavegraphjs=false
ihaveanalysisjs=false
isqonly=(location.search.indexOf("QONLY")>=0)
autostart=(isqonly||location.search.indexOf("+A")>=0)

function Simulate_showAllExp(){
 var s=""
 var n=0
 for(var what in SimInfo.Exp){
	if(SimInfo.Exp[what]){
		if(SimInfo.Exp[what].length>1){
			n++
			s+="<hr>#"+n+" ("+what+") "+Simulate_getExp(what,1)
		}
	}else{
		alert("No SimInfo.Exp['"+what+"'] in explore.js")
	}
 }
 document.write(s) 
}

function Simulate_getExp(what){
	if(!SimInfo.Exp[what]||SimInfo.Exp[what][0]=="")return ""
 	var s=""
	s=Simulate_getHeaders(what,true)
	s="<a href="+SimInfo.exploredir+"/"+what+".htm>"+s+"</a><p>"
	s+=Simulate_getExpGif(what)
	s+=Simulate_getQuestions(what,-1)
	return s
}

function Simulate_getExpGif(what){
	if(!SimInfo.Exp[what])return ""
	return "<a href="+SimInfo.exploredir+"/"+what+".htm><img border=0 src="+SimInfo.exploredir+"/x-"+what+".gif></a><p>"
}

function Simulate_init(istart){
	if(autostart)istart=true
	autostart=istart
	for(smodel in ModelInfo){
		Expt_setup(smodel)
		if(ihaverxnjs)Rxn_move(smodel)
		if(ihavegraphjs)Graph_start(smodel)
		if(ihaveanalysisjs)Analysis_move(smodel)
	}
	setTimeout("Model_refreshAll();if(ihavedatajs)Data_refreshAll()"+(istart?";Expt_startAll()":""),100)
}

function Simulate_getHeaders(what,isqonly){
	if(!SimInfo.Exp[what])return ""
	var main=SimInfo.Exp[what][0]
	var sub1=SimInfo.Exp[what][1]
	return Simulate_header(main,sub1,isqonly)
}

function Simulate_header(main,sub1,isqonly){
	var s="<h3>"+(isqonly||main==""||main.indexOf("Quiz:")>=0?"":"Exploration: ")+main+"</h3><p>"
	if(!isqonly && sub1)s+=sub1+"<p>"
	return s
}

function Simulate_sayh(what,isqonly){
	if(arguments.length<2)isqonly=false
	SimInfo.thisexp=what
	document.write(Simulate_getHeaders(what,isqonly))
}

function Simulate_say(main,sub1,isqonly){
	if(arguments.length<3)isqonly=false
	if(arguments.length<2)sub1=""
	document.write(Simulate_header(main,sub1,isqonly))
}

function Simulate_sayq(what){
	if(arguments.length==0)what=SimInfo.thisexp
	document.write(Simulate_getQuestions(what,-1))
}

function Simulate_getQuestions(what,i0){
	var s=""
	if(!SimInfo.Exp[what])return ""
	for(var i=2;i<SimInfo.Exp[what].length;i++){
		if(i0>=0)i0++
		s+=Q_format(SimInfo.Exp[what][i],(i0>=0?i0:i-1))
	}
	s=s.replace(/\$CDIR/g,SimInfo.conceptdir)
	if(i0>=0)return [s,i0]
	return s
}

function Simulate_getMainHeader(what){
	if(!SimInfo.Exp[what])return ""
	return SimInfo.Exp[what][0]
}

QInfo=new Array()
QInfo.nq=0
QInfo.includeanswer=autostart
QInfo.Ans=new Array()

function Q_showall(){
 location = (location+"?").split("?")[0]+"?+A"+(SimInfo.options.length?"+OPTIONS="+SimInfo.options:"")
}
function Q_shownone(){
 location = (location+"?").split("?")[0]
}

function Q_ask(q,a){
 if(isqonly)return
 var s=""
 if(QInfo.nq==0){
	s="<p><b>Questions to think about"+(autostart?"":" after carrying out the reaction")+": "
	if(QInfo.includeanswer){
		s+="<a href=javascript:Q_shownone()>no answers</a>"+"<p></b>"
	}else{
		s+="<a href=javascript:Q_showall()>all answers</a>"+"<p></b>"
	}
 }
 QInfo.nq++
 if(a)QInfo.Ans[QInfo.nq]=a
 var sa=(QInfo.includeanswer?"<p><blockquote><b>A:</b> "+Q_getans(QInfo.nq)+"</blockquote>":"<a href=javascript:Q_showans("+QInfo.nq+")>answer</a>")
 s+="<blockquote><b>"+QInfo.nq+".</b> "+q+" "+sa+"</blockquote>"
 document.write(s)
}

function Q_getans(n){
 //why? because this can be overridden.
 return QInfo.Ans[QInfo.nq]
}

function Q_showans(n){
 var s=(1||ExptInfo[smodel].time?QInfo.Ans[n]:"Start the reaction first, then answer this question.")
 alert(s)
}

function Q_format(q,i,isqonly){
 var s=(isqonly||i>1?"":"<p><b>Summary points:<p></b>")
 s+="\n<blockquote><b>"+i+". </b>"+q+"</blockquote>"
 return s
}

