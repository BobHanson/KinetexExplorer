//CHECKJS  D:\js\kinetex\rxn.js 1/31/2003 6:28:31 AM
//rxn.js
ihaverxnjs=true
RXNFLASKGIF="flask.gif"

function Rxn_getSoln(idata,smodel){
	var sc=Rxn_getSolutionColor(idata,smodel)
	var s="\n<table width=80 height=130>"
	s+="<tr><td height=70>&nbsp;</td></tr>"
	s+="<tr><td bgcolor=#"+sc+">&nbsp;</td></tr>"
	s+="\n</table>"
	return s
}

function Rxn_getSolutionColor(idata,smodel){
	RxnInfo[smodel].Abs=new Array(0,0,0)
	var x
	var c
	for(var i in ModelInfo[smodel].Component){
		x=ModelInfo[smodel].Component[i]
		c=(idata>0?DataInfo[smodel].Data[idata][i]:x.conc)
		RxnInfo[smodel].Abs[0]+=x.MolAbs[0]*c
		RxnInfo[smodel].Abs[1]+=x.MolAbs[1]*c
		RxnInfo[smodel].Abs[2]+=x.MolAbs[2]*c
	}
	return Util_getColor(RxnInfo[smodel].Abs[0],RxnInfo[smodel].Abs[1],RxnInfo[smodel].Abs[2])
}

function Rxn_move(smodel){
	if(!RxnInfo[smodel].havetarget) return
	var D=divanchor(RxnInfo[smodel].target)
	divmove("rxnsoln_"+smodel,0,0)
	divmove("rxnflask_"+smodel,0,0)
}

function Rxn_setDefaults(smodel){
	RxnInfo[smodel].target=RxnInfo[smodel].defaulttarget="rxn_"+smodel
	RxnInfo[smodel].havetarget=false
}

function Rxn_setFlask(gif,smodel){
	if(arguments.length<2)smodel=thismodel
	writediv("rxnflask_"+smodel,"<img src="+SimInfo.gifdir+gif+">")
}

function Rxn_setParameters(plist,smodel){
	if(arguments.length<2)smodel=thismodel
	Util_setParameters("Rxn",plist,smodel)
}

function Rxn_setTarget(targetimg,smodel){
	if(arguments.length<2)smodel=thismodel
	if(arguments.length<1 || targetimg=="")targetimg=RxnInfo[smodel].defaulttarget
	if(RxnInfo[targetimg]){
		RxnInfo[smodel].target=RxnInfo[targetimg].target
	}else{
		RxnInfo[smodel].target=targetimg
	}
	if(RxnInfo[smodel].target==RxnInfo[smodel].defaulttarget){
		//just a placeholder
		document.write("<img name="+RxnInfo[smodel].target+" src="+SimInfo.gifdir+RXNFLASKGIF+">")
	}
	Util_createDiv("rxnsoln_"+smodel,Rxn_getSoln(0,smodel))
	Util_createDiv("rxnflask_"+smodel,"<img src="+SimInfo.gifdir+RXNFLASKGIF+">")
	RxnInfo[smodel].havetarget=true
	Rxn_move(smodel)
}

function Rxn_show(smodel,imustdo){
	if(!imustdo && isqonly)return
	if(arguments.length<1)smodel=thismodel
	Rxn_setTarget("",smodel)
}

function Rxn_updateInterface(idata,smodel){
	if(!RxnInfo[smodel].havetarget)return
	var s=Rxn_getSoln(idata,smodel)
	writediv("rxnsoln_"+smodel,s)
}

