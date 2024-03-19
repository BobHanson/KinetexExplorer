//CHECKJS  D:\js\kinetex\simulate.js 1/31/2003 6:28:29 AM
//11:23 AM 4/15/2003
// Model_init() should be in body tag as part of onload=
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

thismodel=""
MINTEMP=10
TEMPFACTOR=Math.E
REFERENCETEMP=298
infinity=Infinity

SimInfo=new Array()
SimInfo.Exp=new Array()
SimInfo.gifdir="gif/"
SimInfo.divgraphdir="../common"
SimInfo.options=""
SimInfo.conceptdir="../../concept/img"
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

function Model_showAllExp(){
 var s=""
 var n=0
 for(var what in SimInfo.Exp){
	if(SimInfo.Exp[what]){
		if(SimInfo.Exp[what].length>1){
			n++
			s+="<hr>#"+n+" ("+what+") "+Model_getExp(what,1)
		}
	}else{
		alert("No SimInfo.Exp['"+what+"'] in explore.js")
	}
 }
 document.write(s) 
}

function Model_getExp(what){
	if(!SimInfo.Exp[what]||SimInfo.Exp[what][0]=="")return ""
 	var s=""
	s=Explore_getHeaders(what,true)
	s="<a href="+SimInfo.exploredir+"/"+what+".htm>"+s+"</a><p>"
	s+=Model_getExpGif(what)
	s+=Explore_getQuestions(what,-1)
	return s
}

function Model_getExpGif(what){
	if(!SimInfo.Exp[what])return ""
	return "<a href="+SimInfo.exploredir+"/"+what+".htm><img border=0 src="+SimInfo.exploredir+"/x-"+what+".gif></a><p>"
}

function Model_init(istart){
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


function Model_addComponent(x,conc0,color,smodel){
	//component name, html name, initial concentration, 1-M absorbance
	//the absorbance is an array of three numbers, each 0-255,
	//representing a color value r g b.
	var MolAbs=new Array()
	if(color=="")color="colorless"
	var colorpt=0
	if(color.indexOf(",")>=0){
		MolAbs=color.split(",")
	}else{
		colorpt=Util_colorGetIndex(color)
		MolAbs=Util_colorGetArray(colorpt)
	}
	if(arguments.length<5)smodel=thismodel
	var n=ModelInfo[smodel].Component.length
	ModelInfo[smodel].Component[n]=new Array()
	ModelInfo[smodel].Component[n].x=x
	ModelInfo[smodel].Component[n].species=x
	ModelInfo[smodel].Component[n].xhtml=Util_fixExponents(x)
	ModelInfo[smodel].ComponentPtr[x]=n+1 //so never 0
	ModelInfo[smodel].Component[n].coeff=1
	ModelInfo[smodel].Component[n].coeff0=1
	ModelInfo[smodel].Component[n].conc=ModelInfo[smodel].Component[n].conc0=conc0
	ModelInfo[smodel].Component[n].conclast=0
	ModelInfo[smodel].Component[n].MolAbs=new Array(MolAbs[0],MolAbs[1],MolAbs[2])
	ModelInfo[smodel].Component[n].graphcolor=Util_colorGetName(colorpt)
	ModelInfo[smodel].Component[n].isvariable=true
	ModelInfo[smodel].Component[n].err=0
	if(ihavegraphjs)Graph_setKey("",smodel)
	//Debug_showObj("ModelInfo","from Model_addComponent")
	
}

function Model_addRateEqn(eqn,smodel){
	//of the form	"d[x]/dt=-k[x]^a[y]^b"
	//no parentheses!
	//x,y must be A-Z, exactly ONE character!
	var s=""
	if(arguments.length<2)smodel=thismodel
	var n=ModelInfo[smodel].RateEqn.length
	ModelInfo[smodel].RateEqn[n]=new Array()
	ModelInfo[smodel].RateEqn[n].eqn=eqn
	ModelInfo[smodel].RateEqn[n].x=eqn.substring(eqn.indexOf("[")+1,eqn.indexOf("]"))
	s=eqn.split("=")[1].split("k")[0].replace(/\*/,"")
	if(s=="-")s="-1"
	ModelInfo[smodel].RateEqn[n].n=eval(s)
	ModelInfo[smodel].RateEqn[n].dxylist=new Array()
	s=eqn.split("=")[1]
	ModelInfo[smodel].RateEqn[n].js=Util_fixEqn(eqn,smodel)
	
	//sdebug=Debug_getObj("ModelInfo['"+smodel+"'].RateEqn")
	//alert(sdebug)
}

function Model_changeTemp(T,smodel){ //this one must adjust k values
	if(arguments.length<2)smodel=thismodel
	var f=(T==ModelInfo[smodel].tempref?1:Math.pow(Math.E,1-ModelInfo[smodel].tempref/T))
	ModelInfo[smodel].temp=T
	ModelInfo[smodel].tempfactor=f
	for(var i in ModelInfo[smodel].Constant){
		if(i.charAt(0)=="k"){
			ModelInfo[smodel][i]=parseFloat(Util_roundoff(ModelInfo[smodel][i+"ref"]*f))
			if(ModelInfo[smodel].havetarget){
				var d=eval("document.model_"+smodel+"."+i)
				if(d)d.value=ModelInfo[smodel][i]
			}
		}
	}
	Expt_reset(smodel)
}

function Model_createNew(smodel){
	thismodel=smodel
	Debug_initialize(smodel)
	ModelInfo[smodel]=new Array()
	ModelInfo[smodel].Constant=new Array()
	ModelInfo[smodel].Component=new Array()
	ModelInfo[smodel].ComponentPtr=new Array()
	ModelInfo[smodel].OverallEquation=new Array()
	ModelInfo[smodel].RateLaw=new Array()
	ModelInfo[smodel].RateConstant=new Array()
	ModelInfo[smodel].RateEqn=new Array()
	ModelInfo[smodel].Abs=new Array(0,0,0)
	ModelInfo[smodel].havetarget=false
	ModelInfo[smodel].title=" "//forces a div
	ModelInfo[smodel].overallequation="" //optional; displayed for mechanisms only
	ModelInfo[smodel].havemech=false
	ModelInfo[smodel].fixedinfo=""
	ModelInfo[smodel].hiddeninfo=""
	ModelInfo[smodel].queryinfo=""
	ModelInfo[smodel].selected=""
	ModelInfo[smodel].ishowtemp=true
	Model_setTemp(REFERENCETEMP,smodel)
	
	ExptInfo[smodel]=new Array()
	Expt_setDefaults(smodel)
	
	C[smodel]=new Array()
	dC[smodel]=new Array()
	
	RxnInfo[smodel]=new Array()
	RxnInfo[smodel].havetarget=false
	if(ihaverxnjs)Rxn_setDefaults(smodel)
	
	DataInfo[smodel]=new Array()
	DataInfo[smodel].Data=new Array()
	DataInfo[smodel].havetarget=false
	if(ihavedatajs)Data_setDefaults(smodel)
	
	GraphInfo[smodel]=new Array()
	GraphInfo[smodel].havetarget=false
	if(ihavegraphjs)Graph_setDefaults(smodel)
	
	AnalysisInfo[smodel]=new Array()
	AnalysisInfo[smodel].havetarget=false
	if(ihaveanalysisjs)Analysis_setDefaults(smodel)	
}

function Model_fixInfo(swhat,smodel){
	if(arguments.length<2)smodel=thismodel
	ModelInfo[smodel].fixedinfo+=","+swhat+","
}

function Model_formrow(key,text,value,w,smodel){
	var swhat=","+text+","
	var swhat2=","+key+","
	if(text.indexOf("]")>=0){
		swhat=swhat.substring(0,swhat.indexOf("]")+1)
	}else{
		swhat=swhat.substring(0,4)
	}
	if(ModelInfo[smodel].hiddeninfo.indexOf(swhat)>=0||ModelInfo[smodel].hiddeninfo.indexOf(swhat2)>=0)return ""
	var s="<tr><td nowrap width=75 valign=top>"+Util_fixExponents(text)+"</td><td nowrap>"
	if(key=="overalleqn"|| ModelInfo[smodel].fixedinfo.indexOf(swhat)>=0||ModelInfo[smodel].fixedinfo.indexOf(swhat2)>=0){
		if((value+"").indexOf("\n")<0){
			s+=value
		}else{
			s+=value.replace(/\n/g,"<br>")
		}
	}else if(ModelInfo[smodel].queryinfo.indexOf(swhat)>=0||ModelInfo[smodel].queryinfo.indexOf(swhat2)>=0){
		s+="<a href=\"javascript:Model_revealInfo('"+key+"','"+smodel+"')\">Determine, then click here.</a>"
	}else if((""+value).indexOf("\n")<0){
		s+="<input name="+key+" type=text size="+w+" value=\""+value+"\" onkeypress=\"Model_onChangeValue('"+key+"','"+smodel+"')\">"
	}else{
		s+="<textarea name="+key+" cols="+w+" rows=3 onchange=\"Model_onChangeValue('"+key+"','"+smodel+"')\">"+value+"</textarea>"
	}
	s=s.replace(/Infinity/g,"Very Large")
	s+="</td></tr>"
	return s
}

function Model_getInfo(swhat,smodel){
	var k=""
	var ismulti=(ModelInfo[smodel].havemech || ModelInfo[smodel].OverallEquation.length>1)
	var sinfo=""
	if(swhat=="overall"){
		sinfo=ModelInfo[smodel].OverallEquation.join("\n")
		if(ismulti){
			for(var i=0;i<ModelInfo[smodel].OverallEquation.length;i++){
				k=ModelInfo[smodel].RateConstant[i]
				sinfo=sinfo.replace(/\-\-/,"~~"+k+"~~")
			}
			sinfo=sinfo.replace(/\~/g,"-")
		}
	}else if(swhat=="ratelaw"){
		sinfo=ModelInfo[smodel].RateLaw.join("\n")
		if(ismulti){
			for(var i=0;i<ModelInfo[smodel].RateLaw.length;i++){
				sinfo=sinfo.replace(/rate\=/,"rate"+(i+1)+"=")
			}
		}
	}
	return sinfo
}

function Model_getOverallEquation(smodel,n){
	if(arguments.length==1)n=0
	return Model[smodel].OverallEquation[n]
}

function Model_getRateConstant(smodel,n){
	if(arguments.length==1)n=0
	return Model[smodel].RateConstant[n]
}

function Model_getRateLaw(smodel,n){
	if(arguments.length==1)n=0
	return Model[smodel].RateLaw[n]
}

function Model_hideInfo(swhat,smodel){
	if(arguments.length<2)smodel=thismodel
	ModelInfo[smodel].hiddeninfo+=","+swhat+","
}

function Model_isSelected(i,smodel){
	if(ModelInfo[smodel].selected=="")return true
	var sx=ModelInfo[smodel].Component[i].x
	return(ModelInfo[smodel].selected.indexOf(sx)>=0)
}

function Model_onChangeValue(what,smodel){
	setTimeout("Model_setValue('"+what+"','"+smodel+"',true)",10)
}

function Model_pickRandom(what,list){
	var S=list.split("||")
	var s=""
	var opt=unescape(location.search)
	if(opt.indexOf("OPTIONS=")<0)opt=""
	while(s==""){
		s=S[Util_random_1_to(S.length)-1]
		if(opt.length && opt.indexOf(";"+what+"=")>=0 && opt.indexOf(";"+what+"="+s+";")<0)s=""
	}
	SimInfo.options+=";"+what+"="+s+";"
	return s
}

function Model_queryInfo(swhat,smodel){
	if(arguments.length<2)smodel=thismodel
	ModelInfo[smodel].queryinfo=","+swhat+","
}

function Model_refresh(isfromform,smodel){
	if(arguments.length<2)smodel=thismodel
	if(!ModelInfo[smodel].havetarget)return
	A=new Array()
	for(var i in ModelInfo[smodel].Constant){if(ModelInfo[smodel].Constant[i]){
			A[i]=ModelInfo[smodel][i]
	}}
	A["temp"]=ModelInfo[smodel].temp
	A["overall"]=Model_getInfo("overall",smodel)
	A["ratelaw"]=Model_getInfo("ratelaw",smodel)
	for(var i in ModelInfo[smodel].Component)A[ModelInfo[smodel].Component[i].x]=ModelInfo[smodel].Component[i].conc0
	for(var i in A){
		var d=eval("document.model_"+smodel+"."+i)
		if(d){
			if(isfromform){
				Model_setValue(i,smodel,false)
			}else{
				d.value=A[i]
			}
		}
	}
	Expt_reset(smodel)
}

function Model_refreshAll(isfromform){
	if(arguments.length==0)isfromform=false
	for(var smodel in ModelInfo)Model_refresh(isfromform,smodel)
}

function Model_revealInfo(what,smodel){
	if(what=="overall"){
		alert("The overall equation for this reaction is \n\n"+ModelInfo[smodel].OverallEquation[0])
	}else if(what=="ratelaw"){
		alert("The rate law for this reaction is \n\n"+ModelInfo[smodel].RateLaw[0])
	}else if(!isNaN(ModelInfo[smodel][what])){
		alert(what+" = "+ModelInfo[smodel][what])
	}
}

function Model_select(swhat,smodel){
	if(arguments.length<2)smodel=thismodel
	ModelInfo[smodel].selected=swhat
	if(ihavegraphjs)Graph_setKey("",smodel)
	Expt_reset()
}

function Model_setConcentration(name,value,isvariable,smodel){
	if(arguments.length<3)isvariable=true
	if(arguments.length<4)smodel=thismodel
	var i=ModelInfo[smodel].ComponentPtr[name]-1
	ModelInfo[smodel].Component[i].conc=ModelInfo[smodel].Component[i].conc0=value
	if(isvariable!=-1)ModelInfo[smodel].Component[i].isvariable=isvariable
}

function Model_setConstant(name,value,smodel){
	if(arguments.length<3)smodel=thismodel
	if(ModelInfo[smodel].ComponentPtr[name]){
		Model_setConcentration(name,value,false,smodel)
	}else{
		ModelInfo[smodel][name]=value
		ModelInfo[smodel].Constant[name]=1
		if(name.charAt(0)=="k"){
			ModelInfo[smodel].RateConstant[ModelInfo[smodel].RateConstant.length]=name
			ModelInfo[smodel][name+"ref"]=value
			if(value==Infinity){
				var sjs=""
				var lasti=-1
				for(var i=0;i<ModelInfo[smodel].RateEqn.length;i++){if(ModelInfo[smodel].RateEqn[i].eqn.indexOf(name+"[")>=0){
						ModelInfo[smodel].RateEqn[i].js=0
						sjs+=",'"+ModelInfo[smodel].RateEqn[i].x+"',"+ModelInfo[smodel].RateEqn[i].n
						lasti=i
				}}
				if(lasti>=0){
					ModelInfo[smodel].RateEqn[lasti].js="Expt_infiniteRate("+lasti+",'"+smodel+"')"
					ModelInfo[smodel].RateEqn[lasti].dxylist=eval("new Array("+sjs.substring(1,sjs.length)+")")
				}
			}
		}
	}
}

function Model_setMechStep(eqn,kinfo,smodel){
/*  this function may be called several ways. 
    smodel is optional.

	Model_setMechStep("A + B --> C","k1=0.02")
	Model_setMechStep("X + C --> B + D","k2=infinity")
	Model_setMechStep("A + B --> 2B","k1=0.5")
	Model_setMechStep("A + B <--> 2B","k1=0.5,k-1=0.1")

*/
	var kname=""
	var kval=""
	var V=new Array()
	var K=new Array()
	var seqn=""
	var xy=""
	var isrev=(eqn.indexOf("<")>=0)
	if(arguments.length<3)smodel=thismodel
	ModelInfo[smodel].havemech=true
	var K=kinfo.split(",")
	if(K.length==1 && isrev){
		K[1]=kinfo.charAt(0)+"_"+kinfo.substring(1,kinfo.length)
	}
	if(K.length==2 && !isrev){
		eqn=eqn.replace(/\-/,"<-")
		isrev=true
	}
	var seqn=eqn.replace(/\</,"")
	var conc=Model_setOverallEquation(seqn,smodel)
	var V=K[0].split("=")
	if(V.length==1)V[1]="0.1"
	kname=V[0]
	kval=("infinity very large".indexOf(V[1])>=0?infinity:parseFloat(V[1]))
	if(isNaN(kval)||kval<=0)kval=0.1
	Model_setRateLaw(kname+conc,smodel)
	Model_setConstant(kname,kval,smodel)
	
	
	if(!isrev)return
	seqn=eqn.replace(/\>/,"")
	xy=Model_setOverallEquation(seqn,smodel)

	var V=K[1].split("=")
	if(V.length==1)V[1]="0.1"
	kname=V[0]
	kval=("infinity very large".indexOf(V[1])>=0?infinity:parseFloat(V[1]))
	if(isNaN(kval)||kval<=0)kval=0.1
	kname=kname.replace(/\-/,"_")
	Model_setRateLaw(kname+xy,smodel)
	Model_setConstant(kname,kval,smodel)	
	
}

function Model_setOverallEquation(eqn,smodel){
	if(arguments.length<2)smodel=thismodel
	if(eqn.indexOf("||")>=0)eqn=Model_pickRandom("Overall",eqn,smodel)
	var xy=""
	var S=new Array()
	var M=new Array()
	var n=0
	var sn=""
	var x=""
	var isrev=0
	var neq=ModelInfo[smodel].OverallEquation.length
	ModelInfo[smodel].OverallEquation[neq]=eqn
	eqn=eqn.replace(/ /g,"").replace(/\-/g,"")
	if(eqn.indexOf("<")>=0){
		isrev=1
		S=eqn.split("<")
	}else{
		S=eqn.split(">")	
	}
	for(var i in ModelInfo[smodel].Component){
		ModelInfo[smodel].Component[i].coeff=0
	}
	for(var i=0;i<2;i++){
		M=S[i].split("+")
		for(var k=0;k<M.length;k++){
			x=M[k]
			n=parseInt(x)
			if(isNaN(n)){
				n=1
			}else{
				sn=""+n
				x=x.substring(sn.length,x.length)
			}
			if(!ModelInfo[smodel].ComponentPtr[x]){
				Model_addComponent(x,0,"colorless",smodel)
				ModelInfo[smodel].Component[ModelInfo[smodel].ComponentPtr[x]-1].coeff=0
			}
			ModelInfo[smodel].Component[ModelInfo[smodel].ComponentPtr[x]-1].coeff+=n*(isrev?(i==0?1:-1):i==0?-1:1)
			if(i==isrev)xy+="["+x+"]"+(n>1?n:"")
		}
	}
	//set first of multi for initial rate calc. This may not be quite right...
	if(neq==0){
		for(var i in ModelInfo[smodel].Component)ModelInfo[smodel].Component[i].coeff0=ModelInfo[smodel].Component[i].coeff
	}
	return xy
}

function Model_setParameters(plist,smodel){
	if(arguments.length<2)smodel=thismodel
	Util_setParameters("Model",plist,smodel)
}

function Model_setRateLaw(law,smodel){
	//assumed "rate=" law
	if(arguments.length<2)smodel=thismodel
	if(law.indexOf("||")>=0)law=Model_pickRandom("Rate Law",law,smodel)
	law=law.replace(/\ /g,"").replace(/rate\=/,"")
	ModelInfo[smodel].RateLaw[ModelInfo[smodel].RateLaw.length]="rate="+law
	for(var i in ModelInfo[smodel].Component){if(ModelInfo[smodel].Component[i].coeff!=0){
			Model_addRateEqn(
				"d["+ModelInfo[smodel].Component[i].x+"]/dt=("
				+ModelInfo[smodel].Component[i].coeff
				+")*"+law,smodel
			)	
	}}
}

function Model_setSpecies(x,species,xhtml,smodel){
	if(arguments.length<3)xhtml=species
	if(arguments.length<4)smodel=thismodel
	var i=ModelInfo[smodel].ComponentPtr[x]-1
	ModelInfo[smodel].Component[i].species=species
	ModelInfo[smodel].Component[i].xhtml=xhtml
}

function Model_setTemp(T,smodel){
	if(arguments.length<2)smodel=thismodel
	if(T<MINTEMP)T=MINTEMP
	ModelInfo[smodel].temp=T
	ModelInfo[smodel].tempref=T
	ModelInfo[smodel].tempfactor=1
}

function Model_setTitle(s,smodel){
	if(arguments.length<2)smodel=thismodel
	if(ihavegraphjs)Graph_setTitle(s,smodel)
}

function Model_setValue(what,smodel,idoupdate){
	var v=eval("document.model_"+smodel+"."+what+".value").replace(/Very Large/g,"Infinity")
	var fv=parseFloat(v)
	if(what=="overall"){
		var s=ModelInfo[smodel].RateLaw[0]
		ModelInfo[smodel].OverallEquation=new Array()
		Model_setOverallEquation(v,smodel)		
		ModelInfo[smodel].RateLaw=new Array()
		ModelInfo[smodel].RateEqn=new Array()
		Model_setRateLaw(s,smodel)
	}else if(what=="ratelaw"){
		ModelInfo[smodel].RateLaw=new Array()
		ModelInfo[smodel].RateEqn=new Array()
		Model_setRateLaw(v,smodel)
	}else if(ModelInfo[smodel].ComponentPtr[what] && !isNaN(fv)){
		Model_setConcentration(what,fv,-1,smodel)		
	}else if(what=="temp" && !isNaN(fv) && fv>0){
		Model_changeTemp(fv,smodel)
	}else if(!isNaN(fv)){
		ModelInfo[smodel][what]=fv
	}
	Expt_reset(smodel)
}

function Model_show(smodel,imustdo){
	if(!imustdo && isqonly)return
	if(arguments.length<1)smodel=thismodel
	var sinfo=""
	var ismulti=(ModelInfo[smodel].havemech || ModelInfo[smodel].OverallEquation.length>1)	
	var s="\n<form name= model_"+smodel+">"
	s+="<table>"
	sinfo=ModelInfo[smodel].overallequation
	if(ismulti && sinfo)s+=Model_formrow("overalleqn","Overall Eqn",Util_fixExponents(sinfo)+"<hr width=150>",20,smodel)
	sinfo=Model_getInfo("overall",smodel)
	s+=Model_formrow("overall",(ismulti?"Mechanism":"Overall"),Util_fixExponents(sinfo),20,smodel)
	sinfo=Model_getInfo("ratelaw",smodel)
	s+=Model_formrow("ratelaw","Rate Law",Util_fixExponents(sinfo),20,smodel)
	for(var i in ModelInfo[smodel].Constant)s+=Model_formrow(i,i,ModelInfo[smodel][i],20,smodel)
	for(var i in ModelInfo[smodel].Component)s+=Model_formrow(ModelInfo[smodel].Component[i].x,"["+ModelInfo[smodel].Component[i].xhtml+"]<sub>o</sub>",ModelInfo[smodel].Component[i].conc0,20,smodel)
	if(ModelInfo[smodel].ishowtemp)s+=Model_formrow("temp","Temp (Kelvin)",ModelInfo[smodel].temp,20,smodel)
	s+="</table>"	
	s+="</form>"
	document.write(s)
	ModelInfo[smodel].havetarget=true
}

function Model_updateInterface(smodel){
	if(!ModelInfo[smodel].havetarget)return
}

