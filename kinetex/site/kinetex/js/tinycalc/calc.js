//BH 2:59 AM 2/9/2003

//debug variables

istest_=false 	//for simplex
testing_=true && false 	// for math conversion
testingchem_=true && false


/*

6:24 AM 3/2/2003 fix for fullreset not setting user variables

interface:

 calc_dosimplex("fullreset")	
 calc_dosimplex("reset")	
 calc_dosimplex("start")	
 calc_dosimplex("stop")	
 calc_getsimplexstatus()	returns 0 if not running, 1 if running
 calc_getvariables(smath)	returns variable list x=?;y=?;
 calc_setthevalue(s)		"set value, for example: s = 'x=34'
 calc_setvariables(s)		s = "x=34;P=322;" etc.
 calc_settestexpression(s)	sets the test expression for the end of the calculation

 calc_setupsimplexfunction(i)	i>0 is an index of Functions[]
 calc_dosample(n)		omit n for a random sample
 calc_setcalcvariable(s)	sets this variable as the calculation variable
 calc_unpairedparens(s)		counts unpaired parentheses in s

user interface must include:

 function user_getinfo()	must return the equation to solve
 function user_putinfo()	allows setting of the equation to solve
 function user_getdatavar()	variable or textarea to hold variable list
 function user_putdatavar(s)
 function user_getitest()	variable or textbox to hold test calculation math
 function user_putitest(s)
 function user_getiresult()	variable or textbox to hold result of test calculation
 function user_putiresult(s)
 function user_indicate(what,Variables[],result,niterations,simplexerror,message)
 function user_setthevariables(V)	variables have been reset
	what="start","reset","iter","stop","done"

 see user.js for how these may be implemented

problems:

 globals mostly end in underscore_, still, there my be conflicts.
 There is a more fundamental issue: when variables are assigned values
 in the calculation, they are ACTUALLY evaluated using JavaScript. So it's
 critical that you not have global variables that might be overwritten here.

*/



if(typeof(knownconstants)=="undefined")knownconstants=""
//math stuff just to translate normal math to JavaScript!
//constants--don't change

    operators_=" +-*/()[]^,!;="  //the ' ' here is important
   coperators_=" +()*{"		
     numerals_=" 0123456789."

	     e=Math.E

chemsym0= "H HeLiBeB C N O F NeNaMgAlSiP S ClArK CaScTiV CrMnFeCoNiCuZnGaGeAsSeBrKrRbSrY ZrNbMoTcRuRhPdAgCdInSnSbTeI XeCsBaLaCePrNdPmSmEuGdTbDyHoErTmYbLuHfTaW ReOsIrPtAuHgTlPbBiPoAtRnFrRaAcThPaU NpPuAmCmBkCfEsFmMdNoLrDbJlRfBhHnMt"
chemsym_=chemsym0//.replace(/Ac/,"XX").replace(/Pr/,"XX")
schem_=""
sformula_=""


   
/*

  REAL MATH TO JAVAMATH RULES

  a) common terms will be converted: 
      ln(x)==>Math.log(x)
      log(x)==>(Math.LOG10E*Math.log(x))
      sqr(x)==>Math.sqrt(x)
  b) other functions such as abs and cos are straight conversions
  c) x! evaluated using function here: fact(x) 
  d) ln(x!) evaluated either exactly (x<170) or using approx (x ln(x) - x)
  e) ')('==>')*(' ONLY when non-chem operators or chem is as 'MW()'!
     NOTE!   trailing ' ' is necessary!
    '|' will be replaced by 'Math.'
    note that '`' will be ')' closing AFTER next () phrase
*/

 funcabbrs="|log           |sqr  |ln   "
 functions="(|LOG10E*|log` |sqrt |log  "
 morefuncs="|abs |acos |asin |atan |cos |ceil |exp |floor |max |min |pow |random |round |sin |sqrt |tan "  
 myfunctions="()log()pH()fact()lnfact()MW()"

 constants="|e |ln10 |ln2 |log10e |pi |sqrt1_2 |sqrt2 "

//non-built in n! and ln(n!)
highestfactorial=170

//simplex constants
maxiter_=100
randmult_=190

//simplex globals
going_=false
overalltries_=0
overalliter_=0
niter_=0
simplexerror_=0
Pinfo_=new Array(["",0])	//just those to be solved
Vinfo_=new Array(["",0])	//all variables
nvars_=0
vbest_=0
vworst_=0
jworst_=0
jbest_=0
s_=""
sl_=""
slm_=""
sr_=""
srm_=""
abse__=0
ymin_=1E199
ymax_=-1E199
BOUNDS=new Array(-1E199,1E199)
xyv_=new Array()
sconstants_=""
paramlist_=";"
is_apdata=0
vlist_=";"
ulist_=""
havexyzs_=0
xyzlist_="x y"
xyz_=new Array("x","y")
slistnew_=""
slistold_=""
nq_=2
n__=0
x=0
smodel_=""
smath_=""
sthisop_=""
testexpr_=""
testexprJS_=""
testerr_=""		//set by the function definition x=...!?[...][...]
mainvlist_=knownconstants
defaultmainvlist_=mainvlist_
ithisfunc_=-1

function bestV(){
	var j1=0
	vbest_=1E200
	for(var j=2;j<vdim;j++)
	{
		if(Vok[j]){if(V_[j][np__]<vbest_){vbest_=V_[j][np__];j1=j}}
	}
	return j1
}

function calc_dosample(i){
	mainvlist_=defaultmainvlist_
	if(Functions[ithisfunc_].length<5){
		alert("There are no sample values for this function.")
		return
	}
	if(arguments.length<1)i=getrnd(Functions[ithisfunc_].length-4)+4
	calc_setvariables(Functions[ithisfunc_][i])
	calc_dosimplex("setup")
	calc_setthevalue(Pinfo_[0][0]+"=")
}

function calc_dosimplex(mode,iscontinue){
	if(arguments.length==1)iscontinue=false
	if(mode=="stop"){
		going_=false
		user_indicate("stop",Vinfo_,Pinfo_[0],overalliter_,simplexerror_,"stopped by calc_dosimplex('stop')")
		return 0
	}
	
	if(!iscontinue){
		smodel_=user_getinfo()
		if(calc_unpairedparens(smodel_))return alert("There are unmatched parentheses in this equation.")			
	}
	if(mode=="start"){
		overalltries_=0
		overalliter_=0
	}

	if(mode=="reset"){
		updatemainvlist()
	}
	
	if(mode=="fullreset"){
		testerr_=""
	}

	var s=""
	sl_=""
	slm_=""
	sr_=""
	srm_=""
	nvars_=0
	vlist_=";"
	ulist_=""
	havexyzs_=0
//alert(mode)
	s__=mathof(smodel_,(mode=="start"||mode=="continue"?1:-2))
//	alert(mode+" "+vlist_)
	
	if(mode=="start"||mode=="continue"||mode=="setup")updatemainvlist()
	sl_=smodel_.substring(0,smodel_.indexOf("="))
	slm_=s__.substring(0,s__.indexOf("="))
	sr_=smodel_.substring(smodel_.indexOf("=")+1,smodel_.length)
	srm_=s__.substring(s__.indexOf("=")+1,s__.length)
	s__="("+strsub(s__,"=",")-(")+")"
	sm_="("+strsub(smodel_,"=",")-(")+")"
	
	if (mode!="fullreset" && smodel_.indexOf("=")<0)return alert("\n"+smodel_+"="+eval(s__))
	if (nvars_<=0)return alert("\n"+"No variables to optimize! \n"+sm_+"="+eval(s__))
	simplexsetup()
	
	var isdone=0
	
	if (np__==1 && !is_apdata  && Pinfo_[0][0]==sl_)
	{
		eval(mainvlist_)
		var e_=eval(srm_)
		if(!isNaN(e_))
		{
			isdone=-1
			Pinfo_[0][1]=e_
			vlist_=strsub(vlist_,";"+Pinfo_[0][0]+";",";")
			vlist_=updatevlist(vlist_,Pinfo_[0][0],e_+"=",0,"calc_dosimplex "+mode)
			simplexsetup()
			user_putdatavar(showlist(false,"from isNaNtest"))
			mainvlist_=updatevlist(mainvlist_,Pinfo_[0][0],e_,0)
			eval(mainvlist_)
			return 0
		}
	}
	user_putdatavar(showlist(false,"from end of simplex"))
	if(mode=="setup"||mode=="reset"||mode=="fullreset" && !iscontinue){
		user_setthevariables(Vinfo_)
		user_indicate(mode,Vinfo_,Pinfo_[0],0,0)
	}
	if (np__==0)
	{
		if(mode=="fullreset")return 0
		var s="\n\nAll variables are marked as constants. Add an '=' after any you wish to allow to change.\n\n"
		if(havexyzs_) return alert(s+"sigma^2 for "+sm_+" = "+evalV(-1))
		return alert(s+s__+"="+eval(s__))
	}
	if(mode!="start" && mode!="continue") return 1
	
	if((is_apdata?n__:0)+1<np__)return alert("\nMore than one variable is unknown! Enter values for all except one variable.")
	
	if(mode=="start")user_indicate("start",Vinfo_,Pinfo_[0],0,0)
	
	dooptimize(isdone)
	return 1
}

function calc_getsimplexstatus(){
	return going_
}

function calc_getvariables(smath){
 var s=""
 vlist_=""
 mainvlist_=defaultmainvlist_
 math(smath,true)
 var S=vlist_.split(";")
 var V=new Array()
 var svar=""
 for(var i=0;i<S.length;i++){
	svar=S[i]+";"
	if(svar.indexOf("=")>=0 && s.indexOf(svar)<0)s+=svar
 }
 if(s=="")return ""
 return s.replace(/\;\;/g,";").replace(/\=\=/g,"=").replace(/\?\=/g,"?")
}

function calc_setcalcvariable(s){
	vlist_=vlist_.replace(/\?/g,"0").replace(/\=\;/g,"=0;")
	updatemainvlist()
	var val=varvalue(vlist_,s)
	if(val=="?"||val=="=0")val="="
//	s=s+val+(val.length>1?"=":"")

	calc_setthevalue(s+"=")
	user_putdatavar(showlist(false,"from setcalcvariable "+s))
}

function calc_settestexpression(s){
	testexpr_=s
	testexprJS_=mathof(testexpr_,false)
}

function calc_setthevalue(s){
	var sval=""
	if(arguments.length==0)s=prompt("enter variable=value")
	var S=s.split("=")
	if(S.length<1)return
	if(S.length<2)S[1]=""
	if(S[1].length){
		S[1]=eval(S[1])
		eval(S[0]+"="+S[1])
	}
	sval=S[1]+(S.length==3?"=":"")
	vlist_=updatevlist(vlist_,S[0],sval,0,"setthevalue "+s)
	user_putdatavar(showlist(false,"from setthevalue "+s))
}

function calc_setupsimplexfunction(i,sabbr){
	if(i<0){
		for(var i=1;i<Functions.length;i++){
			if(Functions[i][0]==sabbr)break
		}
	}
	if(i==Functions.length){
		alert("No function found with abbreviation "+sabbr)
		return
	}
	ithisfunc_=i
	var s=Functions[ithisfunc_][2]
	mainvlist_=defaultmainvlist_
	calc_settestexpression("")
	s+="|"
	var S=s.split("|")
	s=S[0]
	calc_settestexpression(S[1])
	user_putinfo(getfunc(s)) //allows for abbreviations
	user_putitest(testexpr_)
	calc_dosimplex("fullreset")
	testerr_=Functions[ithisfunc_][3]
	 .replace(/\?eval\(/g,"){void(")
	 .replace(/\;/g,")@void(")
	 .replace(/\?/g,"){alert(\"Note! ")
	 .replace(/\`\`/g,"\"")
	 .replace(/\`/g,"'")
	 .replace(/\!]/g,"}")
	 .replace(/\@/g,";")
	 .replace(/\]/g,"!\")}")
	 .replace(/\[/g,"\n;if(")
	//alert(testerr_)
}

function calc_setvariables(s){
	if(arguments.length==0){
		updatemainvlist()
		return
	}
	mainvlist_=defaultmainvlist_
	var S=s.split(";")
	calc_dosimplex("reset")
	for(var i=0;i<S.length;i++)calc_setthevalue(S[i])
}

function centV(){	//centroid
	for(var i=0;i<np__;i++)
	{
		V_[0][i]=0
		for(var j=2;j<vdim;j++){if(j!=jworst_ && Vok[j])V_[0][i]+=V_[j][i]}
		V_[0][i]=V_[0][i]/np__
	}
}

function checkVs(){
	return (slistnew_==slistold_ || vbest_==0)
}

function clean(sclean,ch1,ch2){
	//tabs and commas to space and leading spaces removed
	var s=sclean
	s=strsub(s,"mw(","MW(")
	s=strsub(s,"[","")
	s=strsub(s,"]","")
	s=strsub(s,"{","(")
	s=strsub(s,"}",")")
	s=strsub(s,"\n"," ")
	s=strsub(s,"\r"," ")
	s=strsub(s,"\f"," ")
	s=strsub(s,"\t"," ")
	s=strsub(s,"\"","")
	s=strsub(s,"'","")
	s=strsub(s,"==","=")
	s=strsub(s,ch1,ch2)
	s=strsub(s,"  "," ")
	var i=0
	while (s.charAt(i)==" ")i++
	if(i>0)s=s.substring(i,s.length)
	var i=s.lastIndexOf(" ")
	if(i>=0 && i==s.length-1)s=s.substring(0,i)
	return s
}

function contV(j,j1,scalar){
	for(var i=0;i<np__;i++)V_[j1][i]=V_[j][i]+V_[1][i]*scalar
	return evalV(j1)
}

function contVs(){
	//NEW!!--why contract along OK coordinate?
	//semicontraction amounts to shear instead of shrink
	if(np__<3)
	{
		contV(jworst_,jworst_,.5)
	}else{
		//[1] holds projection vector Vp
		//we will take (V.Vp)/(Vp.Vp)*Vp/np__
		var e=dotVs(1,1)*np__
		for(var j=2;j<vdim;j++)
		{
			if(Vok[j])
			{
				diffV(0,j,jnew1)
				contV(j,j,dotVs(jnew1,1)/e)
			}
		}
	}
	jbest_=bestV()
	jworst_=worstV()
}

function debugprint(swhat){
	var s=swhat+"\n"
	for(var i=1; i<arguments.length; i++)s+=arguments[i]+"\n"
	alert (s)
}

function diffV(j0,j1,j2){
	for(var i=0;i<np__;i++)V_[j2][i]=V_[j0][i]-V_[j1][i]
}

function dooptimize(mode){
	ds=""
	var ni=0
	if(mode<1)
	{
		niter_=0
		if(!initVs(mode)){
			dotesterr()
			endop("Optimization is not possible from these starting conditions!\n\nPress 'Reset' and try again or make a better guess at a reasonable starting value for "+Pinfo_[0][0]+".",0)
			user_indicate("stop",Vinfo_,Pinfo_[0],overalliter_,simplexerror_,"Can't initialize simplex vectors")
			return 0
		}
		going_=true
	}
	ds=""
	if(!going_){
		endop("Optimization halted after "+niter_+" iterations.",0)
		user_putiresult("")
		user_indicate("stop",Vinfo_,Pinfo_[0],overalliter_,simplexerror_,"halted by user")
		return 0
	}
	if(vbest_==0 || niter_>0 && checkVs()){
		endop((1 || niter_==0?"":"Optimization finished after "+niter_+" iterations."),0)
		user_putitest(testexpr_.length?testexpr_:Pinfo_[0][0])
		user_putiresult(testexpr_.length?eval(testexprJS_):Pinfo_[0]?dotest(Pinfo_[0][0]):"")
		if(testexpr_.length==0 || user_getiresult()!="NaN"){
			dotesterr()
			user_indicate("done",Vinfo_,Pinfo_[0],overalliter_,simplexerror_)
			return 0
		}
		if(overalltries_>10){
			dotesterr()
			user_indicate("stop",Vinfo_,Pinfo_[0],overalliter_,simplexerror_,"tried 10 times after a reset and failed")
			return 0
		}
		overalltries_++
		calc_dosimplex("reset",true)
		setTimeout("calc_dosimplex('continue',true)",10)
		return 0
	}
	while((ni!=maxiter_) && going_){ni++;newVs()}
	setV(false)
	user_indicate("iter",Vinfo_,Pinfo_[0],overalliter_,simplexerror_)
	if(going_)setTimeout('dooptimize(1)',10)
	return 0
}

function doset(s){  //fired by testerr in function 
	calc_dosimplex("reset")
	if(s.indexOf(Pinfo_[0][0]+"=")==0)s+="="
	calc_setthevalue(s)
}

function dotest(value){
	var s=(value.charAt(0)==";"?value:mathof(value,false))
	return eval(s)
}

function dotesterr(){
	//provides feedback and also can set values specially --see functions.js
	if(testerr_.length==0)return 0
        //alert(testerr_)
	eval(testerr_)
	return 1
}

function dotVs(j,j1){
	var e=0
	for(var i=0;i<np__;i++)e+=V_[j][i]*V_[j1][i]
	return e
}

function dumpVs(swhere){
	var s=swhere+"\nvbest_ "+vbest_+"\nvworst_ "+vworst_+"\nbest_ "+jbest_+"\nworst_ "+jworst_+"\nnew1 "+jnew1+"\nnew2 "+jnew2+"\n"
	for(var j=0;j<vdim;j++)s+=j+":"+Vok[j]+":"+V_[j]+"\n"
	alert(s)
	s=prompt("continue(no) with dumping YES?","yes")
	going_=(s!="no")
	istest_=(s=="YES")
}

function endop(msg,doupdate){
	going_=false
	if(V_.length)setV(true)
	evalV(jbest_)
	if(havexyzs_ && abse__> ymax_-ymin_)
	{
		msg+="\n\nNote: error is HUGE!\n"+abse__ + ">"+ymax_+"-"+ymin_ +"\nPressing 'Reset' and solving again will probably give a better solution."
	}else{
		//too late
		updatemainvlist()
	}
	V_=new Array()
	vlist_=""
	ulist_=""
	status=""
	if(msg.length)alert("\n"+msg)
	return 0
}

function evalV(j__){
	var es__=0
	for(var i__=0;i__<np__;i__++)
	{
		var e__=V_[j__][i__]
		if(e__>=BOUNDS[0] && e__<=BOUNDS[1])
		{
			e__=Pinfo_[i__][0]+"="+e__
			eval(e__)
		}else{
			es__=1E199
		}
	}
	if(es__==0)
	{
		if(havexyzs_)
		{
			abse__=0
			for(var i__=0;i__<n__;i__++)
			{
				for(iq_=0;iq_<nq_;iq_++)eval(xyz_[iq_]+"="+xyv_[i__][iq_])
				var e__=eval(s__)
				abse__+=Math.abs(e__)
				es__+=e__*e__
			}
		}else{
			var e__=eval(s__)
			if (e__!=-(-e__)|| e__<-1e100)e__=-1e100
			es__+=e__*e__
		}
		if(isNaN(es__))es__=1E199
	}
	if(j__>=0)V_[j__][np__]=es__
	return es__
}

function fact(nin){
	var n=Math.floor(nin)
	var nout=1
	if (n<0){alert("Can't take log of a negative number!");return 0}
	if (n<=highestfactorial)
	{
		for(var i=2;i<=n;i++){nout=nout*i}
	}else{
		alert(n+"! is too large. You can take the log of this factorial, but not the factorial itself. Returning 0")
		nout=0
	}
	return nout
}

function findparen(s,ipt0,idirect){
	//returns ptr to ")" or "("
	var ipt=ipt0
	var schar=(idirect==1?"(":")")
	var i=(s.charAt(ipt)==schar?0:idirect)
	while (ipt<s.length && ipt>=0)
	{
		if (s.charAt(ipt)=="("){i=i+1}
		if (s.charAt(ipt)==")"){i=i-1}
		if (i==0) {return ipt}
		ipt+=idirect
	}
	return ipt  //-1 or s.length on failure to close
}

function getfunc(sf){
	var s=sf
	var x=(is_apdata==2 && xyz_[0]=="x"?"y":is_apdata?xyz_[0]:"x")
	var y=(is_apdata==2 && xyz_[1]=="y"?"x":is_apdata?xyz_[1]:"y")
	if(s=="LINE") s="y=m*x+b"
	if(s=="QUAD") s= "y=a*x^2+b*x+c"
	if(s=="EXP+") s= "y=a*e^(k*x)"
	if(s=="EXP-") s= "y=a*e^(-k*x)+b"
	if(s=="1STP") s= "y=a(1-e^(-k*x))"
	if(s=="1-")   s= "y=yo*e^(-k1*x)"
	if(s=="1L-")  s= "ln(y)=ln(yo)-k1*x"
	if(s=="2-")   s= "y=1/(k2*x+1/yo)"
	if(s=="2L-")  s= "1/y=k2*x+1/yo"
	if(x!="x"||y!="y")s=strsub(s,"x","@")
	s=strsub(s,"y",y)
	s=strsub(s,"@",x)
	return s
}

function getrnd(n){return Math.floor(Math.random()*n)}

function getyrange(){
	ymin_=1E199
	ymax_=-1E199
	for(var i__=0;i__<n__;i__++)
	{
		for(iq_=0;iq_<nq_;iq_++)eval(xyz_[iq_]+"="+xyv_[i__][iq_])
		var e__=eval(slm_)
		ymin_=Math.min(ymin_,e__)
		ymax_=Math.max(ymax_,e__)
	}
}

function initVs(nooffset){//V_[0] has starting points; V_[1] has offsets
	ymin_=-1E199
	ymax_=1E199
	if(havexyzs_)getyrange()
	if(havenew)
	{
		jworst_=0
		vworst_=0
		randV(2)
		for(var i=0;i<200;i++)
		{
			for(var j=3;j<vdim;j++)randV(j)
			jbest_=bestV()
			putV(jbest_,2,1)
			//   ds+=".";status=ds
		}
		putV(jbest_,0,1)
	}
	
	var sqr2=Math.pow(2,0.5)
	var q=(nooffset?0:(Math.pow(np__+1,0.5)-1)/sqr2/np__)
	for(var i=0;i<np__;i++)V_[1][i]=(V_[0][i]==0?1:V_[0][i])*0.097
	Vok[2]=Vok[3]=0
	for(var j=4;j<vdim;j++)
	{
		Vok[j]=1
		for(var i=0;i<np__;i++)V_[j][i]=V_[0][i]+(j==i+5?V_[1][i]:0)
	}
	for(var i=0;i<np__;i++)V_[4][i]-=q
	for(var j=4;j<vdim;j++)evalV(j)
	jbest_=bestV()
	jworst_=worstV()
	jnew1=2
	jnew2=3
	slistnew_=""
	slistold_=";"
	evalV(jbest_)
	if (nooffset)return true
	return(jbest_>0 && jworst_>0 && jbest_ !=jworst_ && vworst_>vbest_)
}

function lnfact(n){
	if (n<=highestfactorial)
	{
		return Math.log(fact(n))
	}else{  //Stirling's approximation!
		return n*Math.log(n)-n
	}
}

function log(x){return Math.LOG10E*Math.log(x)}

function commentclean(s){
 //simple replace doesn't work on Netscape 4.9
 //	smath_=mathclean(stin.replace(/\[[^\]]+\]/g,""))
 s=""+s
 var i=s.indexOf("[")
 var sout=""
 while(i>=0){
	sout+=s.substring(0,i)
	s=s.substring(i+1,s.length)
	i=s.indexOf("]")
	s=s.substring(i+1,s.length)
	i=s.indexOf("[")
 }
 sout+=s
 return sout
}

function matheval(sval){
	return eval(math(sval))
}

function math(stin,dovlist){
	//cleans math; uses smath_, sthisop_
	//also removes all [xxx]
	smath_=commentclean(stin)	
	smath_=mathclean(smath_)
	var ipt=0
	var i=0
	var s=""
	var doreclean=0
	var snew=" "
	var swhat=""
	var svar=""
//alert("old mathof"+vlist_+dovlist)

	if(testing_)alert("math processing: "+smath_+" ; vlist_="+vlist_)
	while (smath_.length!=0)
	{
		swhat=tokenof(1)
		if (testing_) alert("checking "+swhat+" ---- "+sthisop_+" ---- "+smath_)
		svar=(numerals_.indexOf(swhat.charAt(0))>0?"":swhat)
		if (swhat.length==0 && numerals_.indexOf(smath_.charAt(0))>0)
		{
			if (sthisop_=="-" || sthisop_=="+")
			{
				swhat=sthisop_
				swhat+=tokenof(1)
			}
		}
		if (sthisop_.length>0)
		{
			if (sthisop_=="^")
			{
				if(smath_.charAt(0)=="(")
				{
					s=ptokenof()
				}else{
					s=tokenof(0)
				}
				if (swhat.length==0)
				{
					ipt=findparen(snew,snew.length-1,-1)
					swhat=snew.substring(ipt,snew.length)
					snew=snew.substring(0,ipt)
				}
				swhat="(Math.pow("+swhat+","+s+"))"
				svar=""
				doreclean=1
				sthisop_=""
			}
			if (sthisop_=="!")
			{
			if (snew.charAt(snew.length-1)==")" && snew.lastIndexOf("fact(")!=snew.lastIndexOf("(")-4)
				{
					ipt=findparen(snew,snew.length-1,-1)
					snew=snew.substring(0,ipt)+"(fact"+snew.substring(ipt,snew.length)+")"
					swhat=""
					sthisop_=""
				}else{
					snew+="fact("
					snew=snew.replace(/\)fact/,")*fact")
					sthisop_=")"
				}
			}
			if (sthisop_=="(")
			{
				var sv0=svar
				svar=""
				if (swhat.length>0)
				{
					var i=funcabbrs.indexOf("|"+swhat.toLowerCase()+" ")
					if (i>=0)
					{
						swhat=functions.substring(i,i+20)
						swhat=swhat.substring(0,swhat.indexOf(" "))
					}
					var i=morefuncs.indexOf("|"+swhat.toLowerCase()+" ")
					if (i>=0)
					{
						swhat=morefuncs.substring(i,i+20)
						swhat=swhat.substring(0,swhat.indexOf(" "))
					}
					if (testing_) alert("checking function "+swhat)
					var i=myfunctions.indexOf("()"+swhat+"()")
					if (i<0 && swhat.indexOf("Math")<0  && swhat.indexOf("|")<0)
					{
						swhat+="*"
						svar=sv0
					}
					if(swhat=="MW"){
						ipt=findcloseparen(smath_)
						if(ipt<0){
							alert("missing right parenthesis in "+smath_)
						}else{
							swhat="("+MW(smath_.substring(0,ipt))+")"
                                                }
						smath_=smath_.substring(ipt+1,smath_.length)
						sthisop_=""
					}
					
				}
			}
		}
		
		if (constants.indexOf("|"+swhat+" ")>=0)
		{
			swhat="|"+swhat.toUpperCase()
			svar=""
		}
		if(svar.length)
		{
			var s=","+svar+","
			var havexyz=(xyzlist_.indexOf(s)>=0)
			if(havexyz)ulist_+=s
			havexyzs_=is_apdata && (havexyzs_ || havexyz)
			if (svar.indexOf("Math.")<0 && (!havexyzs_ || !havexyz))
			{
				var s=vlist_
				vlist_=updatevlist(vlist_,svar,"",dovlist,"from math ")
				nvars_+=(vlist_.length>s.length?1:0)
//alert("mathof"+is_apdata+" xyz "+xyzlist_+"\nsv"+svar+" "+nvars_+"\nv"+vlist_+"\nu"+ulist_)
			}
		}
		swhat=strsub(swhat,"|","Math.")
		snew+=swhat+sthisop_
		if(testing_)alert("snew="+snew)
	}

	if(testing_)alert("snew="+snew)

	if (snew.length==0){snew="0"}
	snew=mathclean(snew)
	ipt=snew.indexOf("`(")
	while (ipt>=0)
	{
		snew=snew.substring(0,ipt)+snew.substring(ipt+1,snew.length)
		ipt=findparen(snew,ipt+1,1)
		snew=snew.substring(0,ipt+1)+")"+snew.substring(ipt+1,snew.length)
		ipt=snew.indexOf("`(")
	}
	if (doreclean) snew=math(snew,dovlist)
	snew=strsub(snew,"Math.log(fact(","lnfact((")
	snew=strsub(snew,")(",")*(")
	if (testing_) alert("math() returns: "+snew)
	return snew
}

function mathclean(sclean){
	return clean(sclean," ","")
}

function mathof(sx,dovlist){
	var s=strsub(sx,"X","x")
	s=strsub(s,"Y","y")
	return math(s,dovlist)
}

function newVs(){
	niter_++
	overalliter_++
	ds+=".";status=ds
	centV()
	var vs=projV(jworst_,jnew1)
	if(istest_)dumpVs("newVS prior to testing_ "+jnew1)
	if(vs<=vbest_)
	{
		if(contV(jnew1,jnew2,1)<=vs)
		{
			jbest_=jnew2
			jnew2=jnew1
		}else{
			jbest_=jnew1
		}
		Vok[jbest_]=1
	}else{//not new best
		if(vs>=vworst_)
		{
			if(contV(jnew1,jnew2,-0.5)<vworst_)
			{
				Vok[jnew2]=1
				jnew2=jnew1
			}else{
				contVs()
				return
			}
		}else{
			Vok[jnew1]=1
		}
	}
	jnew1=jworst_
	Vok[jnew1]=0
	jworst_=worstV()
	vbest_=V_[jbest_][np__]
	vworst_=V_[jworst_][np__]
	if(istest_)dumpVs("looping")
}

function pH(x){return -Math.log(x)}


function projV(j,j1){//project j to j1
	diffV(0,j,1)
	return contV(j,j1,2)
}

function ptokenof()// get next parenthetical expression in s
{
	if (smath_.length==0){return ""}
	var spnew=""
	var ipt=0
	if (smath_.charAt(ipt)!="("){return ""}
	ipt=findparen(smath_,ipt,1)
	spnew=smath_.substring(1,ipt)
	smath_=smath_.substring(ipt+1,smath_.length)
	return spnew
}

function calc_unpairedparens(s){	//returns 0 if OK, >0 if too many (, <0 if too many ) 
 var ipt=0
 var i=0
 var schar="("
 if(s.indexOf("(")<0 && s.indexOf(")")<0)return 0
 while (ipt<s.length && ipt>=0){
	if(s.charAt(ipt)=="(")i+=1
	if(s.charAt(ipt)==")")i-=1
	if(i<0)break
	ipt+=1
 }
 return i
}

function findcloseparen(s){
 var ipt=0
 var i=0
 var schar="("
 if(s.indexOf("(")<0 && s.indexOf(")")<0)return s.length
 while (ipt<s.length){
	if(s.charAt(ipt)=="(")i+=1
	if(s.charAt(ipt)==")")i-=1
	if(i<0)break
	ipt++
 }
 return ipt
}

function putV(ifrom,ito,scalar){
	for(var i=0;i<=np__;i++)V_[ito][i]=V_[ifrom][i]*scalar
}

function randV(j){
	putV(0,j,1)
	for(var i=0;i<np__;i++)if(Pnew[i])V_[j][i]=Math.pow(e,Math.random()*randmult_-randmult_/2)
	return evalV(j)
}

function ndig(n){
	var x=Math.abs(n)
	return(x>=9999||x<0.01?-3:x>=100?0:x>=1?1:x>=.1?3:3)
}

function calc_roundoff(x,ndec){
	//.n means n digit integer with trailing 0s
	var s=""
	if(ndec==999){ //TF test
		return(x?"true":"false")
	}
	if(isNaN(x) || x==0)return "0"
	if(arguments.length<2 || isNaN(ndec))ndec=ndig(x)
	if(ndec==0)return ""+Math.round(x)
	var neg=(x<0?"-":"")
	var xs=Math.abs(x)+""
	var i=(xs.indexOf("E") & xs.indexOf("e"))
	if(ndec>0 && ndec<1){ //3400
		return parseFloat(calc_roundoff(x,-Math.floor(ndec*10.01)))
	}
	if(ndec<0 && i<0){
		xs=calc_roundoff(Math.abs(x)*1e-100,-ndec)
		i=(xs.indexOf("E") & xs.indexOf("e"))
		var e=parseInt(xs.substring(i+1,xs.length))+100
		s=neg+xs.substring(0,i)+(e!=0?"E"+e:"")
		return s
	}
	if (i>0){
		s=calc_roundoff(xs.substring(0,i),Math.abs(ndec)-1)+"E"+xs.substring(i+1,xs.length)
		if(s.indexOf("10.")==0){
			i=(s.indexOf("E") & s.indexOf("e"))
			s="1"+s.substring(2,i+1)+(parseInt(s.substring(i+1,s.length))+1)
		}
		return neg+s
	}
	i=xs.indexOf(".")
	if(i<0){xs+=".";i+=xs.length}
	xs+="000000000"
	s="."+xs.substring(i+1+ndec,xs.length)
	xs=xs.substring(0,i)+xs.substring(i+1,i+1+ndec)
	var add1=(xs.charAt(0)=="0")
	if(add1)xs="1"+xs
	xs=parseInt(xs)+Math.round(parseFloat(s))+""
	if(add1)xs=xs.substring(1,xs.length)
	xs=xs.substring(0,xs.length-ndec)+"."+xs.substring(xs.length-ndec,xs.length)
	if(xs.indexOf(".")==0)xs="0"+xs
	return neg+xs
}


function setV(isdone){
	for(var i=0;i<np__;i++)
	{
		var e=V_[jbest_][i]
		Pinfo_[i][1]=e
		vlist_=updatevlist(vlist_,Pinfo_[i][0],e+"=",0,"SetV"+isdone)
	}
	
	var Ndeg=(is_apdata?n__:2)-np__
	if(Ndeg==0)Ndeg=1
	if(isdone)
	{
		simplexerror_=Math.pow(vbest_,0.5)/Ndeg
	}else{
		e=0
		for(var j=2;j<vdim;j++){if(Vok[j])e+=V_[j][np__]}
		simplexerror_=Math.pow(e,0.5)/Ndeg
	}
	
	vlist_+="//"
	vlist_=vlist_.substring(0,vlist_.indexOf("//"))
	vlist_=updatevlist(vlist_,"//err",simplexerror_,0,"setting error")
	// vlist_=updatevlist(vlist_,"//niter_",overalliter_,0,"setting ninit")
	slistold_=slistnew_
	slistnew_=vlist_.substring(0,vlist_.indexOf("//"))
	slistnew_=strsub(slistnew_,"=;",";")
	slistnew_=strsub(slistnew_,">","")
        if(slistnew_.indexOf("=?")<0)eval(slistnew_)
	user_putdatavar(showlist(true,"setV "+isdone))
}

function showlist(addlisting,comment){
	var s=vlist_
	s=strsub(s,"=?=","=")
	s=strsub(s,"=?","=")
	s=strsub(s,"==","=")
	s=strsub(s,";","\n")
	s=strsub(s,"\r","\n")
	s=strsub(s,"\r\n","\n")
	s=strsub(s,"\n>=\n","\n")
	s=strsub(s,"\n\n","\n")
	s=strsub(s,"'","")
	s=s.substring(1,s.length)
	s=s.replace(/undefined\=/g,"")
	s=" "+s.replace(/\n/g,"\n ")
	s=s.replace(/\ \>/g,">")
	if(s.indexOf("=\n")>=0)s=s.replace(/\>/g," ")
	var i=s.indexOf("//")
	if(i<0)i=s.length
	s=s.substring(0,i)+"//BOUNDS={"+BOUNDS+"}\n"+s.substring(i,s.length)
	s=s.replace(/\ \/\//g,"//")
	var S=s.split("\n")
	for(var i=0;i<S.length;i++){
		if(S[i].indexOf("=")>=0 && S[i].lastIndexOf("=")==S[i].length-1 && S[i].indexOf(">")<0)S[i]=">"+S[i].substring(1,S[i].length)
		if(S[i].lastIndexOf("=")>S[i].indexOf("="))S[i]=S[i].substring(0,S[i].lastIndexOf("="))
	}
	s=S.join("\n")
	//alert(comment+":\n\n"+s)
	return s
}

function simplexsetup(){
	np__=0
	sconstants_=""
	var s=mathclean(vlist_)+";"
	if(s.indexOf("=;")>=0)s=s.replace(/\>/g,"")
	var Va=s.split(";")
	paramlist_=";"
	Pinfo_=new Array()
	Vinfo_=new Array()
	var nv=0
	Pnew=new Array()
	havenew=false
	for(var i=0;i<Va.length;i++)
	{
		if(Va[i].charAt(0)==">"){
			Va[i]=Va[i].substring(1,Va[i].length)+"="
			Va[i]=Va[i].replace(/\=\=/g,"=")
		}
		var ieq=Va[i].indexOf("=")
		var ieq1=Va[i].lastIndexOf("=")
		if (ieq!=ieq1)Va[i]=Va[i].substring(0,ieq1)+"?"
		if(ieq<0){Va[i]+="=?";ieq=Va[i].length-2}
		if(ieq==Va[i].length-1){Va[i]+="?";ieq=Va[i].length-2}
		if (ieq>0 && Va[i].indexOf("?")>ieq)
		{
			Pinfo_[np__]=Va[i].split("=")
			vlist_=strsub(vlist_,";"+Pinfo_[np__][0]+";",";")
			paramlist_+=";"+Pinfo_[np__][0]+"="
			var s=Pinfo_[np__][1]
			var iq=s.indexOf("?")
			if(iq<=0)
			{
				Pinfo_[np__][1]=0
				Pnew[np__]=havenew=true
			}else{
				Pinfo_[np__][1]=eval(s.substring(0,iq))
				Pnew[np__]=false
			}
			Vinfo_[nv++]=new Array(Pinfo_[np__][0],Pinfo_[np__][1],true)
			np__++
		}else{
			if(ieq>0)
			{
				var Vc=Va[i].split("=")
				var val=eval(Vc[1])
				s="="+val+";"
				vlist_=strsub(vlist_,";"+Vc[0]+"="+Vc[1]+";",";"+Vc[0]+s)				
				sconstants_+=Vc[0]+s
				Vinfo_[nv++]=new Array(Vc[0],val,false)
			}
		}
	}
	V_=new Array()
	Vok=new Array()
	eval(sconstants_)
	if(np__==0)return 0
	vdim=np__+5
	V_=new Array(vdim)
	Vok=new Array(vdim)
	for(var j=0;j<vdim;j++)
	{
		V_[j]=new Array(np__+1)
		Vok[j]=1
	}
	for(var i=0;i<np__;i++)V_[0][i]=Pinfo_[i][1]
	//V_[0] center (initially starting values)
	//V_[2] new1
	//V_[3] new2
	
	jnew1=2
	jnew2=3
	return np__
}

function sof(n,ndec){
	var s="          "+n.toString()
	return s.substring(s.length-(s.length<=ndec+10?ndec:s.length-10),s.length)
}

function strclean(sclean){return clean(sclean,","," ")}

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

function tokenof(dochopoperator) //next token in smath_; sthisop_ is next operator
{ //returns 2 for 2x  but x2 for x2
	if (testing_) alert ("getting token for "+smath_)
	sthisop_=""
	var isexp=0
	var stoken=""
	if (smath_.length==0) return ""
	var sch=smath_.charAt(0)
	var havenum=(numerals_.indexOf(sch)>0?1:0)
	var i=0
	while (i<smath_.length)
	{
		sch=smath_.charAt(i)
		if (operators_.indexOf(sch)>0)
		{
			sthisop_=sch
			if (i>0){stoken=smath_.substring(0,i)}
			smath_=smath_.substring(i+dochopoperator,smath_.length)
			if (testing_) alert ("token: "+stoken+" "+sthisop_+" "+smath_)
			return stoken
		}else{
			if (havenum && (numerals_.indexOf(sch)<0))
			{
				if (sch=="E" || sch=="e")
				{
					i++ //skip +/-
				}else{
					sthisop_="*"
					stoken=smath_.substring(0,i)
					smath_=smath_.substring(i,smath_.length)
					if (testing_) alert(stoken+" "+sthisop_+" "+smath_)
					return stoken
				}
			}
		}
		i++
	}
	stoken=smath_
	smath_=""
	if (testing_) alert (stoken+" ---- "+sthisop_+" ---- "+smath_)
	return stoken
}

function updatemainvlist(vname,vval){
	vlist_=";"+user_getdatavar()
	var s=vlist_
	var i=s.indexOf("//BOUNDS=")
	BOUNDS=new Array(-1E199,1E199)
	if(i>=0)eval("BOUNDS=new Array("+s.substring(i+10,s.length-1).replace(/\}/g,"")+")")
	vlist_=strsub(vlist_,"\r","\n")
	vlist_=strsub(vlist_,"\n",";")
	vlist_=mathclean(vlist_)
	vlist_=strsub(vlist_,";;",";")+"//"
	vlist_=vlist_.substring(0,vlist_.indexOf("//"))
	if(arguments.length==2)vlist_+=";"+vname+"="+vval
	var Av=vlist_.split(";")
	
	for(var i=0;i<Av.length;i++)
	{
		var sa=Av[i]
		if(sa.charAt(0)==">"){
			sa=sa.substring(1,sa.length)+"="
			sa=sa.replace(/\=\=/g,"=")
		}
		if(sa.indexOf("?")<0)
		{
			if(sa.indexOf("=")>0 && sa.indexOf("=")<sa.length-1)
			{
				var AA=sa.split("=")
				mainvlist_=updatevlist(mainvlist_,AA[0],AA[1],0,"updatemainlist")
			}
		}
	}
	eval(mainvlist_)
	return 0
}

function updatevlist(slist,svar,sval,usemain,fromwhere){
//alert("updatevlist"+fromwhere+" "+vlist_)
	var s=";"+svar+"="
	var sr=(usemain?varvalue(mainvlist_,s):sval)
	if(usemain && sr.length && paramlist_.indexOf(s)>=0)sr=(usemain==-2?"":sr+"=")
	var sl=slist
	var i=sl.lastIndexOf(s)
	if (i<0){
		i=sl.lastIndexOf(";>"+svar+"=")
		if(i<0){
			sl+=s.substring(1,s.length)+sr+";"
		}else{
			sl=sl.substring(0,i)+";>"+svar+"="+sr+sl.substring(sl.indexOf(";",i+1),sl.length)
		}
	}else{
		sl=sl.substring(0,i)+s+sr+sl.substring(sl.indexOf(";",i+1),sl.length)
	}
	return sl
}

function varvalue(varlist,vdef){//vdef form is ";variable="
	var i=varlist.indexOf(vdef)
	if(i<0)return "?"
	return varlist.substring(i+vdef.length,varlist.indexOf(";",i+1))
}

function worstV(){
	j1=0
	vworst_=-1E200
	for(var j=2;j<vdim;j++)
	{
		if(Vok[j]){if(V_[j][np__]>vworst_){vworst_=V_[j][np__];j1=j}}
	}
	return j1
}

///////////////chemistry part///////////////

function getchem(stin,M){ //cleans chem; generates M.Alist and M.Nlist
	var ipt=0
	var i=0
	var e=""
	var s=""
	var schar=""
	var snew=" "
	var swhat=""
	var slast=""
	var havesym=0
	var havenum=0
	var snewform=""
	var inumpt1=0
	var inumpt2=0
	var alist=""
	if(arguments.length==1)M=new Array()
	M.Alist=new Array()
	var Nlist=new Array()
	schem_=strclean(stin)
	schem_+="+"
	if(testingchem_) alert("entry processing "+stin)
	while (schem_.length){
		sformula_=getnextformula()
		if(testingchem_)alert("schem_:" + schem_ + "\nsformula_:"+sformula_)
		snewform=""
		havesym=0
		havenum=0
		inumpt1=0
		inumpt2=0  //for hydration
		isatend=0
		if(testingchem_) alert ("formula "+sformula_)
		while (sformula_.length){
			swhat=ntokenof()
			if(testingchem_)alert("token: " + swhat)
			if(swhat=="+"){isatend=1} //at end
			if(swhat.charAt(0)=="@"){  //hydrate
				inumpt2=inumpt1
				inumpt1=0
				havesym=0
				havenum=0
				snewform=snewform+"@"
				swhat=swhat.substring(1,swhat.length)
			}
			if(swhat=="(" && havenum==1 && havesym==0)swhat="{"
			if(coperators_.indexOf(swhat)>0){
				snewform=snewform+swhat
				swhat=""
			}
			if(swhat.length>0 && isatend==0){
				schar=swhat.charAt(0)
				if(numerals_.indexOf(schar)>0){
					havenum=(havesym==0?1:2)
				}else{
					if(++havesym==1 && havenum==1)inumpt1=snewform.length+1
					s=swhat.charAt(1)
					ipt=2
					i=chemsym_.indexOf(swhat.substring(0,2))
					if(i<0 && s==s.toUpperCase()){
						ipt=1
						i=chemsym_.indexOf(schar+" ")
					}
					if(i % 2==0){
						sformula_=swhat.substring(ipt,swhat.length)+sformula_
						s=swhat.substring(0,ipt)
						swhat="("+s+")"
						e=s
						s=";"+s+"=1"
						if(alist.indexOf(s)<0){alist=alist+s;M.Alist[e]=0}
					}else{// not a chemical symbol.
						alert(swhat +" is not a chemical element.")
						sformula_="(0)"+swhat.substring(ipt,swhat.length)+sformula_
						swhat=""
					}
				}
			}
			snewform=snewform+swhat
			slast=swhat.substring(swhat.length-1,swhat.length)
			if(isatend){
				if(inumpt2==0 && inumpt1<snewform.length)inumpt2=inumpt1
				if(inumpt1<snewform.length)snewform=snewform.substring(0,inumpt1)+"{"+snewform.substring(inumpt1,snewform.length-1)+"}+"
				if(inumpt2<snewform.length)snewform=snewform.substring(0,inumpt2)+"{"+snewform.substring(inumpt2,snewform.length-1)+"}+"
				if(testingchem_) alert("atend:" + snew + " ::: " + snewform + " ::: " + sformula_)
				snewform=snewform+sformula_
				sformula_=""
			}
		}
		snew= snew+snewform
	}
	if(testingchem_) alert("processing "+snew)
	snew=snew.substring(0,snew.length-1)
	if(testingchem_) alert("processing "+snew)
	if(snew.length==0){snew="0"}
	snew=strsub(snew,"({","{(")
	snew=strsub(snew,"{{}}+","")
	snew=strsub(snew,")(",")+(")
	snew=chemfix(snew,"*",")",1)
	snew=chemfix(snew,"+","(",-1)
	if(testingchem_) alert("fixing "+snew)
	snew=chemfix(snew,"*","{",-1)
	snew=chemfix(snew,"*","}",1)
	if(testingchem_) alert("fixing "+snew)
	snew=strsub(snew,"@","+")
	snew=strclean(snew)
	M.js=snew
	for(var i in M.Alist){
		for(var ii in M.Alist)eval(ii+"="+(i==ii?1:0))
		M.Alist[i]=eval(M.js)
	}
	return M.js
}

function getnextformula(){
	var s=""
	if(schem_.length==0) return ""
	var ipt=schem_.indexOf("+")
	if(ipt>=0){
		s=schem_.substring(0,ipt+1)
		schem_=schem_.substring(ipt+1,schem_.length)
	}else{
		s=schem_
		schem_=""
	}
	return s
}

// Chemistry translation:
// CH4           ==> (C)(H)4                 symbols isolated
// CH4           ==> (C)+(H)*4               ')(' means ')+('
// 2(CH3)2CHCH3  ==> 2*( (CH3)2CHCH3) )     'n(' to 'n*( (...end of line or "+") )'
// 3CH4*6H2O     ==> 3*( CH4+6*(H2O) )
// beyond that, we just let JavaScript handle ALL constants!!!
// string utilities

function chemfix(s,sadd,slook,idirect){
	var ipt=1
	var snew=""
	snew=s
	var ioff=(idirect==1?1:0)
	while (ipt>=0 && ipt<snew.length-1){
		ipt=snew.indexOf(slook,ipt)
		if(ipt>=0 && ipt<snew.length-1){
			if(numerals_.indexOf(snew.charAt(ipt+idirect))>0){
				snew=snew.substring(0,ipt+ioff)+sadd+snew.substring(ipt+ioff,snew.length)
				ipt=ipt+1-ioff
			}
			ipt=ipt+1
		}
	}
	return snew
}

function ntokenof(){ //next token in sformula_  4CH( ==> 4  CH  (
	sformula_=strclean(sformula_)
	if(sformula_.length==0) return ""
	var stoken=sformula_.charAt(0)
	if(coperators_.indexOf(stoken)>0){
		sformula_=sformula_.substring(1,sformula_.length)
		return stoken
	}
	var havenum=(numerals_.indexOf(stoken)>0?1:0)
	var havetoken=0
	var i=0
	var ipt=0
	while (i<sformula_.length){
		var sch=sformula_.charAt(i)
		if(coperators_.indexOf(sch)>0){havetoken=1}
		ipt=numerals_.indexOf(sch)  //ok if sch="" since numerals starts with " "
		if(havetoken==0 && ipt>0 && havenum==0)havetoken=1
		if(havetoken==0 && ipt<=0 && havenum)havetoken=1
		if(havetoken){
			stoken=sformula_.substring(0,i)
			sformula_=sformula_.substring(i,sformula_.length)
			return stoken
		}
		i+=1
	}
	stoken=sformula_
	sformula_=""
	return stoken
}

function MW(x){
 var sjs=getchem(x)
 //if you don't do this all at once, then the AtWts don't actually get
 //assigned when using Netscape 4.

 var mw=eval(AtWts+";"+sjs)
// var mw=eval(sjs)
 return mw
}



/////atomic weight data
AtWts="var H=1.008;"
	+"var He=4.003;"
	+"var Li=6.941;"
	+"var Be=9.012;"
	+"var B=10.81;"
	+"var C=12.01;"
	+"var N=14.01;"
	+"var O=16.00;"
	+"var F=19.00;"
	+"var Ne=20.18;"
	+"var Na=22.99;"
	+"var Mg=24.31;"
	+"var Al=26.98;"
	+"var Si=28.09;"
	+"var P=30.97;"
	+"var S=32.07;"
	+"var Cl=35.45;"
	+"var Ar=39.95;"
	+"var K=39.10;"
	+"var Ca=40.08;"
	+"var Sc=44.96;"
	+"var Ti=47.88;"
	+"var V=50.94;"
	+"var Cr=52.00;"
	+"var Mn=54.94;"
	+"var Fe=55.85;"
	+"var Co=58.93;"
	+"var Ni=58.69;"
	+"var Cu=63.55;"
	+"var Zn=65.38;"
	+"var Ga=69.72;"
	+"var Ge=72.59;"
	+"var As=74.92;"
	+"var Se=78.96;"
	+"var Br=79.90;"
	+"var Kr=83.80;"
	+"var Rb=85.47;"
	+"var Sr=87.62;"
	+"var Y=88.91;"
	+"var Zr=91.22;"
	+"var Nb=92.91;"
	+"var Mo=95.94;"
	+"var Tc=98.00;"
	+"var Ru=101.1;"
	+"var Rh=102.9;"
	+"var Pd=106.4;"
	+"var Ag=107.9;"
	+"var Cd=112.4;"
	+"var In=114.8;"
	+"var Sn=118.7;"
	+"var Sb=121.8;"
	+"var Te=127.6;"
	+"var I=126.9;"
	+"var Xe=131.3;"
	+"var Cs=132.9;"
	+"var Ba=137.3;"
	+"var La=138.9;"
	+"var Ce=140.1;"
	+"var Pr=140.9;"
	+"var Nd=144.2;"
	+"var Pm=145.0;"
	+"var Sm=150.4;"
	+"var Eu=152.0;"
	+"var Gd=157.3;"
	+"var Tb=158.9;"
	+"var Dy=162.5;"
	+"var Ho=164.9;"
	+"var Er=167.3;"
	+"var Tm=168.9;"
	+"var Yb=173.0;"
	+"var Lu=175.0;"
	+"var Hf=178.5;"
	+"var Ta=180.9;"
	+"var W=183.9;"
	+"var Re=186.2;"
	+"var Os=190.2;"
	+"var Ir=192.2;"
	+"var Pt=195.1;"
	+"var Au=197.0;"
	+"var Hg=200.6;"
	+"var Tl=204.4;"
	+"var Pb=207.2;"
	+"var Bi=209.0;"
	+"var Po=209.0;"
	+"var At=210.0;"
	+"var Rn=222;"
	+"var Fr=223;"
	+"var Ra=226;"
	+"var Ac=227;"
	+"var Th=232;"
	+"var Pa=231;"
	+"var U=238;"
	+"var Np=237;"
	+"var Pu=244;"
	+"var Am=243;"
	+"var Cm=247;"
	+"var Bk=247;"
	+"var Cf=251;"
	+"var Es=252;"
	+"var Fm=257;"
	+"var Md=258;"
	+"var No=259;"
	+"var Lr=260;"
	+"var Db=261;"
	+"var Jl=262;"
	+"var Rf=263;"
	+"var Bh=262;"
	+"var Hn=265;"
	+"var Mt=268;"


