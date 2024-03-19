//BH 10:14 AM 1/20/2003
/*


interface:

 calc_dosimplex("reset")	
 calc_dosimplex("start")	
 calc_dosimplex("stop")	
 calc_getsimplexstatus()	returns 0 if not running, 1 if running
 calc_setthevalue(s)		"set value, for example: s = 'x=34'
 calc_setvariables(s)		s = "x=34;P=322;" etc.
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
 in the calculation, they are ACTUALLY evaluated using javascript. So it's
 critical that you not have global variables that might be overwritten here.

*/

//debug variables
istest_=false 	//for simplex
testing_=false 	// for math conversion


if(typeof(knownconstants)=="undefined")knownconstants=""
//math stuff just to translate normal math to javascript!
//constants--don't change

    operators=" +-*/()[]^,!;="  //the ' ' here is important
   moperators=" /^,!;[]="       //because s.indexOf("") returns 0!
   coperators=" +()*"
     numerals=" 0123456789."
	    e=Math.E
   
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
 myfunctions="()log()pH()fact()lnfact"

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
	if(Functions[ithisfunc_].length<4){
		alert("There are no sample values for this function.")
		return
	}
	if(arguments.length<1)i=getrnd(Functions[ithisfunc_].length-3)+3
	calc_setvariables(Functions[ithisfunc_][i])
	calc_dosimplex("setup")
	calc_setthevalue(Pinfo_[0][0]+"=")
}

function calc_dosimplex(mode,iscontinue){
	if(arguments.length==1)iscontinue=false
	if(mode=="stop"){
		going_=false
		user_indicate("stop",Vinfo_,Pinfo_[0],overaliter_,simplexerror_,"stopped by calc_dosimplex('stop')")
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
	
	var s=""
	sl_=""
	slm_=""
	sr_=""
	srm_=""
	nvars_=0
	vlist_=";"
	ulist_=""
	havexyzs_=0
	s__=mathof(smodel_,(mode=="start"||mode=="continue"?1:-2))
	//alert(vlist_)
	
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
	if (np__==0)
	{
		if(mode=="fullreset")return 0
		var s="\n\nAll variables are marked as constants. Add an '=' after any you wish to allow to change.\n\n"
		if(havexyzs_) return alert(s+"sigma^2 for "+sm_+" = "+evalV(-1))
		return alert(s+s__+"="+eval(s__))
	}
	if(mode=="setup"||mode=="reset"||mode=="fullreset" && !iscontinue){
		user_setthevariables(Vinfo_)
		user_indicate(mode,Vinfo_,Pinfo_[0],0,0)
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

function calc_setcalcvariable(s){
	vlist_=vlist_.replace(/\?/g,"0").replace(/\=\;/g,"=0;")
	updatemainvlist()
	var val=varvalue(vlist_,s)
	if(val=="?"||val=="=0")val="="
//	s=s+val+(val.length>1?"=":"")

	calc_setthevalue(s+"=")
	user_putdatavar(showlist(false,"from setcalcvariable "+s))
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

function calc_setupsimplexfunction(i){
	ithisfunc_=i
	var s=Functions[i][1]
	mainvlist_=defaultmainvlist_
	testexpr_=""
	testexprJS_=""
	testerr_=Functions[i][2]
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
	s+="|"
	var S=s.split("|")
	s=S[0]
	testexpr_=S[1]
	testexprJS_=mathof(testexpr_,false)
	user_putinfo(getfunc(s)) //allows for abbreviations
	user_putitest(testexpr_)
	calc_dosimplex("fullreset")
}

function calc_setvariables(s){
	if(arguments.length==0){
		updatemainvlist()
		return
	}
	mainvlist_=defaultmainvlist_
	while(s.indexOf("?")>=0)s=s.replace(/\?/,Math.random()+"")
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
	s=strsub(s,"[","")
	s=strsub(s,"]","")
	s=strsub(s,"{","(")
	s=strsub(s,"}",")")
	s=strsub(s,"\n"," ")
	s=strsub(s,"\r"," ")
	s=strsub(s,"\f"," ")
	s=strsub(s,"\t"," ")
	s=strsub(s,"\x22","") //double quote
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
			user_indicate("stop",Vinfo_,Pinfo_[0],overaliter_,simplexerror_,"Can't initialize simplex vectors")
			return 0
		}
		going_=true
	}
	ds=""
	if(!going_){
		endop("Optimization halted after "+niter_+" iterations.",0)
		user_putiresult("")
		user_indicate("stop",Vinfo_,Pinfo_[0],overaliter_,simplexerror_,"halted by user")
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
			user_indicate("stop",Vinfo_,Pinfo_[0],overaliter_,simplexerror_,"tried 10 times after a reset and failed")
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
	if (n<0){Alert("Can't take log of a negative number!");return 0}
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

function math(stin,dovlist){
	//cleans math; uses smath_, sthisop_
	smath_=mathclean(stin)
	var ipt=0
	var i=0
	var s=""
	var doreclean=0
	var snew=" "
	var swhat=""
	var svar=""
	if(testing_)alert("math processing: "+smath_+" "+vlist_)
	while (smath_.length!=0)
	{
		swhat=tokenof(1)
		if (testing_) alert("checking "+swhat+" "+sthisop_+" "+smath_)
		svar=(numerals.indexOf(swhat.charAt(0))>0?"":swhat)
		if (swhat.length==0 && numerals.indexOf(smath_.charAt(0))>0)
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
				if (snew.charAt(snew.length-1)==")")
				{
					ipt=findparen(snew,snew.length-1,-1)
					snew=snew.substring(0,ipt)+"(fact"+snew.substring(ipt,snew.length)+")"
					swhat=""
					sthisop_=""
				}else{
					snew+="fact("
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
			}
		}
		swhat=strsub(swhat,"|","Math.")
		snew+=swhat+sthisop_
	}
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

function mathclean(sclean){return clean(sclean," ","")}

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

function putV(ifrom,ito,scalar){
	for(var i=0;i<=np__;i++)V_[ito][i]=V_[ifrom][i]*scalar
}

function randV(j){
	putV(0,j,1)
	for(var i=0;i<np__;i++)if(Pnew[i])V_[j][i]=Math.pow(e,Math.random()*randmult_-randmult_/2)
	return evalV(j)
}

function roundoff(x,ndec)
{
	//round x to ndec decimal places (+) fixed; (-) floating
	if(x==0)return 0
	if(ndec==0)return Math.round(x)
	var neg=(x<0?"-":"")
	var xs=Math.abs(x)+""
	var i=(xs.indexOf("E") & xs.indexOf("e"))
	if(ndec<0 && i<0)
	{
		var xs=roundoff(Math.abs(x)*1e-100,-ndec)
		var i=(xs.indexOf("E") & xs.indexOf("e"))
		var e=(eval(xs.substring(i+1,xs.length))+100)
		return neg+xs.substring(0,i)+(e!=0?"E"+e:"")
	}
	if (i>0)
	{
		var s=roundoff(xs.substring(0,i),Math.abs(ndec)-1)+"E"+xs.substring(i+1,xs.length)
		return neg+s
	}
	i=xs.indexOf(".")
	if (i<0)
	{
		xs=xs+"."
		i=xs.indexOf(".")
	}
	xs=xs+"000000000"
	var s="."+xs.substring(i+1+ndec,xs.length)
	xs=xs.substring(0,i)+xs.substring(i+1,i+1+ndec)
	var add1=(xs.charAt(0)=="0")
	if(add1)xs="1"+xs
	xs=eval(xs)+Math.round(eval(s))+""
	if(add1)xs=xs.substring(1,xs.length)
	xs=xs.substring(0,xs.length-ndec)+"."+xs.substring(xs.length-ndec,xs.length)
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
	eval(slistnew_)
	user_putdatavar(showlist(true,"setV "+isdone))
}

function showlist(addlisting,comment){
	var s=vlist_
	s=strsub(s,"=?=","=")
	s=strsub(s,"=?","=")
	s=strsub(s,"==","=")
	s=strsub(s,";","\n")
	s=strsub(s,"\r","\n")
	s=strsub(s,"\r\n","\n") //for older IE
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
	s=s.substring(0,i)+"//BOUNDS=("+BOUNDS+")\n"+s.substring(i,s.length)
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
	var havenum=(numerals.indexOf(sch)>0?1:0)
	var i=0
	while (i<smath_.length)
	{
		sch=smath_.charAt(i)
		if (operators.indexOf(sch)>0)
		{
			sthisop_=sch
			if (i>0){stoken=smath_.substring(0,i)}
			smath_=smath_.substring(i+dochopoperator,smath_.length)
			if (testing_) alert ("token: "+stoken+" "+sthisop_+" "+smath_)
			return stoken
		}else{
			if (havenum && (numerals.indexOf(sch)<0))
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
	if (testing_) alert (stoken+" "+sthisop_+" "+smath_)
	return stoken
}

function updatemainvlist(vname,vval){
	vlist_=";"+user_getdatavar()
	var s=vlist_
	var i=s.indexOf("//BOUNDS=")
	BOUNDS=new Array(-1E199,1E199)
	if(i>=0)eval("BOUNDS=new Array"+s.substring(i+9,s.length))
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

