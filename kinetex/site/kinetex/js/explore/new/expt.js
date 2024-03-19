//CHECKJS  D:\js\kinetex\expt.js 1/31/2003 6:28:31 AM
//expt.js
MINEXPTDELAY=50
EXPLOOPCOUNT=50
DEFAULTEXPTENDTIME=20//50
DEFAULTDELTATIME=1   //
idebugx=20

function Expt_getRandomError(i,smodel){
	var v=0
	if(ExptInfo[smodel].randomerror>0 && ModelInfo[smodel].Component[i].isvariable){
		//not really satisfactory--errors are random over a specific interval instead of Gaussian
		v=(Math.random()-0.5)*ExptInfo[smodel].randomerror
	}
	ModelInfo[smodel].Component[i].err=v
	return v
}

function Expt_infiniteRate(i,smodel){
	var E=ModelInfo[smodel].RateEqn[i]
	//must be first or second order!
	//direction is positive: A + B --> C + D
	//produces: .dxylist=["A",-1,"B",-1,"C",1,"D",1]
	var xmin=1e10
	var x=0
	var chi=1e99
	var R=new Array()
	//flush concentrations
	//determine maximum chi
	for(var i=0;i<E.dxylist.length;i+=2){
		x=C[smodel][E.dxylist[i]]+dC[smodel][E.dxylist[i]]
		C[smodel][E.dxylist[i]]=x
		dC[smodel][E.dxylist[i]]=0
		if(E.dxylist[i+1]<0)chi=Math.min(chi,-x/E.dxylist[i+1])
	}
	if(chi==1e99)return //huh?
	//for the limiting reactant, this will wipe it out
	//rest will be reduced to non-zero values
	for(var i=0;i<E.dxylist.length;i+=2){
		C[smodel][E.dxylist[i]]+=chi*E.dxylist[i+1]
	}
// if(idebugx>0) GRalert(E.x,C[smodel][E.x])
	idebugx--
}

function Expt_loop(smodel){
	var maxdC=0
	var v=0
	var n=0
	var iserror=false
	var dt=ExptInfo[smodel].dt/EXPLOOPCOUNT  //used in eval()
	var dxfactor=1	
	if(!ExptInfo[smodel].going){
		return
	}
	for(var il=0;il<EXPLOOPCOUNT;il++){//inner loop
		
		ExptInfo[smodel].time+=dt	
		for(var i in C[smodel]){
			dC[smodel][i]=0
		}
		for(var i in ModelInfo[smodel].RateEqn){
			
			// this is where the actual calculation is carried out: d[x]=dt*k[x][y]
			
			eval(ModelInfo[smodel].RateEqn[i].js)
		}
		
		for(var i in C[smodel]){
			n=ModelInfo[smodel].ComponentPtr[i]-1
			if(!ModelInfo[smodel].Component[n].isvariable)dC[smodel][i]=0
			if(C[smodel][i]+dC[smodel][i]<0){
				dxfactor=Math.min(dxfactor,C[smodel][i]/-dC[smodel][i])
			}
		}
		for(var i in C[smodel]){
			C[smodel][i]+=dC[smodel][i]*dxfactor
			if(C[smodel][i]<0){
				if(ModelInfo[smodel].stoponerror){
					iserror=true
				}else{
					C[smodel][i]=0
				}
			}
			v=Math.abs(dC[smodel][i])
			if(v>maxdC)maxdC=v
		}	
		
	}//inner loop
	for(var i in ModelInfo[smodel].Component){
		ModelInfo[smodel].Component[i].conclast=ModelInfo[smodel].Component[i].conc
		ModelInfo[smodel].Component[i].conc=C[smodel][ModelInfo[smodel].Component[i].x]
	}
	Expt_updateInfo(smodel,2)
	if(iserror
		||++ExptInfo[smodel].iloop>ExptInfo[smodel].nmaxloops
		||ExptInfo[smodel].time+.000001>=ExptInfo[smodel].endtime
		||maxdC<ExptInfo[smodel].endthreshold
		){
		ExptInfo[smodel].going=false
		//		if(iserror)alert("The reaction is going too fast to track at this temperature. Try lowering the temperature.")//Reaction halted after "+ExptInfo[smodel].iloop+" steps."
		if(ExptInfo[smodel].notify)ExptInfo[smodel].notify("done",smodel)
		if(ihaveanalysisjs && MouseInfo.event && MouseInfo.event=="up"
			&& AnalysisInfo[smodel].havetarget && AnalysisInfo.thisamodel==smodel){
			Analysis_showSlope(MouseInfo.event)
		}
		return
	}
	if(ExptInfo[smodel].notify)ExptInfo[smodel].notify("loop",smodel)
	setTimeout("Expt_loop('"+smodel+"')",ExptInfo[smodel].delay)
}

function Expt_onChangeValue(what,smodel){
}

function Expt_reset(smodel){
	if(arguments.length<1)smodel=thismodel
	ExptInfo[smodel].going=false
	if(ExptInfo[smodel].notify)ExptInfo[smodel].notify("reset",smodel)
	Expt_setup(smodel)
}

function Expt_setDefaults(smodel){
	if(arguments.length<1)smodel=thismodel
	ExptInfo[smodel].notify=""
	ExptInfo[smodel].time=0
	ExptInfo[smodel].endthreshold=0
	ExptInfo[smodel].nmaxloops=0 //will be endtime/dt
	ExptInfo[smodel].endtime=DEFAULTEXPTENDTIME
	ExptInfo[smodel].dt=DEFAULTDELTATIME
	ExptInfo[smodel].havetarget=false
	ExptInfo[smodel].initialrate=0
	ExptInfo[smodel].ismini=false
	ExptInfo[smodel].randomerror=0//0.001 (used by graphing and data)
}

function Expt_setDeltaTime(t,smodel){
	if(arguments.length<2)smodel=thismodel
	ExptInfo[smodel].dt=t
	ExptInfo[smodel].nmaxloops=Math.floor(ExptInfo[smodel].endtime/ExptInfo[smodel].dt)
}

function Expt_setEndThreshold(x,smodel){
	if(arguments.length<2)smodel=thismodel
	ExptInfo[smodel].endthreshold=x
}

function Expt_setEndTime(t,smodel){
	if(arguments.length<2)smodel=thismodel
	ExptInfo[smodel].endtime=t
	ExptInfo[smodel].nmaxloops=Math.floor(ExptInfo[smodel].endtime/ExptInfo[smodel].dt)
}

function Expt_setNotify(func,smodel){
	if(arguments.length<2)smodel=thismodel
	ExptInfo[smodel].notify=func
}

function Expt_setParameters(plist,smodel){
	if(arguments.length<2)smodel=thismodel
	Util_setParameters("Expt",plist,smodel)
}

function Expt_setRandomError(x,smodel){
	if(arguments.length<2)smodel=thismodel
	ExptInfo[smodel].randomerror=x
}

function Expt_setup(smodel){
	if(arguments.length<1)smodel=thismodel
	Expt_start(smodel,true)
}

function Expt_show(smodel,imustdo){
	if(!imustdo && isqonly)return
	if(arguments.length<1)smodel=thismodel
	var ismini=ExptInfo[smodel].ismini
	var s="\n<form name=expt_"+smodel+"><table>"
	if(!ismini){
		s+="\n<tr><td>Time</td><td><input type=text name=time value=00:00 size=5></td><td></td></tr>"
	}
	s+="\n<tr><td><a href=\"javascript:Expt_start('"+smodel+"',false)\">Start</a></td>"
	
	if(!ismini){
		s+="\n<td><a href=\"javascript:Expt_stop('"+smodel+"')\">Stop</a></td>"
		s+="\n<td><a href=\"javascript:Expt_reset('"+smodel+"')\">Reset</a></td>"
	}
	s+="\n</tr></table></form>"
	document.write(s)
	ExptInfo[smodel].havetarget=true
}

function Expt_showTime(smodel){
	var i=parseInt(Util_roundoff(ExptInfo[smodel].time,0))
	var isec=i % 60
	var imin=(i-isec)/60
	var s=("0"+isec)
	var d=eval("document.expt_"+smodel+".time")
	if(!d)return
	s=":"+s.substring(s.length-2,s.length)
	s="0"+imin+s
	s=s.substring(s.length-5,s.length)
	d.value=s
}

function Expt_start(smodel,issetuponly){

	if(arguments.length<1)smodel=thismodel
	if(arguments.length<2)issetuponly=false
	if(ihavegraphjs && !issetuponly && !Graph_initialize(smodel))return
	C[smodel]=new Array()
	dC[smodel]=new Array()
	for(var i in ModelInfo[smodel].Component){
		var x=ModelInfo[smodel].Component[i].x
		C[smodel][x]=ModelInfo[smodel].Component[i].conc=ModelInfo[smodel].Component[i].conc0
		//alert(smodel+" Expt_start"+x+" "+C[smodel][x])
	}
	
	ExptInfo[smodel].delay=MINEXPTDELAY
	ExptInfo[smodel].time=0
	ExptInfo[smodel].iloop=0
	ExptInfo[smodel].nmaxloops=Math.floor(ExptInfo[smodel].endtime/ExptInfo[smodel].dt)
	ExptInfo[smodel].initialrate=eval(Util_fixEqn(ModelInfo[smodel].RateLaw[0],smodel))*ModelInfo[smodel].tempfactor
	//alert(ExptInfo[smodel].going+" "+smodel+" "+ModelInfo[smodel].RateLaw[0]+" "+ExptInfo[smodel].initialrate)	
	
	ExptInfo[smodel].going=true
	if(ihavedatajs)Data_reset(smodel,"estart"+issetuponly)
	if(ihavegraphjs)Graph_reset(smodel,issetuponly)
	if(ihaveanalysisjs && (!document.layers||document.layers.length>0))Analysis_reset(!issetuponly,smodel)
	Expt_updateInfo(smodel,1)
	//Debug_showObj("ModelInfo","from exptstart")
	if(issetuponly)return
	if(ExptInfo[smodel].notify)ExptInfo[smodel].notify("start",smodel)
	
	
	setTimeout("Expt_loop('"+smodel+"')",ExptInfo[smodel].delay)
}

function Expt_startAll(){
	for(i in ExptInfo)Expt_start(i)
}

function Expt_stop(smodel){
	if(arguments.length<1)smodel=thismodel
	if(!ExptInfo[smodel].going)return
	ExptInfo[smodel].going=false
	Expt_updateInfo(smodel,0)
	if(ExptInfo[smodel].notify)ExptInfo[smodel].notify("stop",smodel)
}

function Expt_updateInfo(smodel,mode){ //mode=1 start, 2 continue 0 stop
	Expt_updateInterface(smodel,mode)
	if(ihavedatajs)Data_updateInterface(smodel,mode)
	if(ihaverxnjs && (!document.layers||document.layers.length>0))Rxn_updateInterface(-1,smodel)
	if(ihavegraphjs)Graph_updateInterface(smodel,mode)
	if(ihaveanalysisjs)Analysis_updateInterface(smodel,mode)
}

function Expt_updateInterface(smodel){
	if(!ExptInfo[smodel].havetarget)return
	Expt_showTime(smodel)
}

