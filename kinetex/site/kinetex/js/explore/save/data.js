//CHECKJS  D:\js\kinetex\data.js 1/31/2003 6:28:31 AM
//data.js
ihavedatajs=true
DATAROUND=4
DATAWIDTH=10
DATAROWS=10
debugd=""

function Data_findPoint(anchorname,x,y,idir,smodel){

	//closest time: idir -1 BEFORE this, idir 0 closest, idir 1 AFTER this
	var dmin=1e99
	var imin=-1
	var jmin=-1
	var d=0
	var t=0
	var Pt=new Array()
	var newmodel=(smodel==""?AnalysisInfo.thismodel:smodel)
	if(smodel=="" && GraphInfo[newmodel].target!=anchorname){
		for(smodel in GraphInfo){
			if(GraphInfo[smodel].target==anchorname){
				newmodel=smodel
				break
			}
		}
	}
	Pt=Data_findPointInModel(x,y,idir,dmin,newmodel)
	imin=Pt[0]
	jmin=Pt[1]
	dmin=Pt[2]
	if(smodel==""){
		smodel=newmodel
		for(var smod in DataInfo){if(smod!=smodel && GraphInfo[smod].anchorname==anchorname){
				Pt=Data_findPointInModel(x,y,idir,dmin,smod)
				if(Pt[2]<dmin){
					newmodel=smod
					imin=Pt[0]
					jmin=Pt[1]
					dmin=Pt[2]
				}
		}}
	}
	return [imin,jmin,(imin<0?-1:DataInfo[newmodel].Data[imin][jmin]),newmodel]
}

function Data_findPointInModel(x,y,idir,dmin0,smodel){
	var dmin=1e99
	var imin=-1
	var jmin=-1
	var tmin=-1
	var d=0
	var t=0
	var tpt=DataInfo[smodel].Data[0].length-1
	var Pt=new Array()
	for(var i=0;i<DataInfo[smodel].Data.length;i++){
		t=DataInfo[smodel].Data[i][tpt]
		d=t-x
		if(idir==0){
			d*=d
			if(d<dmin){
				dmin=d
				imin=i
				tmin=t
			}
		}else{
			imin=i
		}
		if(t>x*2){
			if(idir==1)imin--
			break
		}
	}
	if(imin<0)return [-1,-1,1e99]
	dmin=dmin0
	var l=ModelInfo[smodel].Component.length
	var jlast=(DataInfo[smodel].prevcomponent+l-1)%l
	for(var j=DataInfo[smodel].prevcomponent;j>=0;j=(j+1)%l){
		if(Model_isSelected(j,smodel)){
			d=DataInfo[smodel].Data[imin][j]-y
			d*=d
			if(d<dmin){
				dmin=d
				jmin=j
			}
		}
		if(j==jlast)break
	}
	if(jmin<0)return [-1,-1,1e98]
	DataInfo[smodel].prevcomponent=jmin
	return [imin,jmin,dmin]
}

function Data_getData(smodel,mode){
	if(mode==1)DataInfo[smodel].Data=new Array()
	var n=DataInfo[smodel].Data.length
	DataInfo[smodel].Data[n]=new Array()
	for(var i in ModelInfo[smodel].Component)DataInfo[smodel].Data[n][i]=ModelInfo[smodel].Component[i].conc
	DataInfo[smodel].Data[n][DataInfo[smodel].Data[n].length]=ExptInfo[smodel].time
}

function Data_getDataForm(starget,sinfo,smodel){
	var T=starget.split(".")
	var s="\n<form name="+T[T.length-2]+"><textarea rows="+DataInfo[smodel].rows+" cols="+(DATAWIDTH*(ModelInfo[smodel].Component.length+1))+" name="+T[T.length-1]+">"+"\n</textarea></form>"
	return s
}

function Data_getDataList(mode,smodel){
	var isdXdt=DataInfo[smodel].dXdt
	var n=DataInfo[smodel].Data.length-(isdXdt?2:1)
	if(isdXdt && n==0 && mode==2)return DataInfo[smodel].s
	DataInfo[smodel].s+=Data_getLine(n,true,smodel)
	return DataInfo[smodel].s
}

function Data_getHeader(smodel){
	var isdXdt=DataInfo[smodel].dXdt
	var s=""
	if(!DataInfo[smodel].hidetemp)s+="temp="+ModelInfo[smodel].temp+" Kelvin;  "+"tempfactor="+Util_roundoff(ModelInfo[smodel].tempfactor,2)+"\n"
	s+=Util_flushRight("time",DATAWIDTH)
	for(var i in ModelInfo[smodel].Component){
		s+=Util_flushRight((isdXdt?"d[":"[")+ModelInfo[smodel].Component[i].x+(isdXdt?"]/dt":"]"),DATAWIDTH)
	}
	s+="\n"
	return s
}

function Data_getLine(n,iadderror,smodel){
	var isdXdt=DataInfo[smodel].dXdt
	var c=0
	if(isdXdt){
		if(n+1>=DataInfo[smodel].Data.length)return ""
	}
	var D=DataInfo[smodel].Data[n<0?0:n]
	var tpt=D.length-1
	var t=D[tpt]
	var s=Util_flushRight(Util_roundoff(t,2),DATAWIDTH)
	var ir=DATAROUND
	var cmin=Math.pow(10,-DATAROUND)
	for(var i=0;i<tpt;i++){
		if(isdXdt){
			if(n<1){
				c=ExptInfo[smodel].initialrate*ModelInfo[smodel].Component[i].coeff0
			}else{
				c=(DataInfo[smodel].Data[n+1][i]-DataInfo[smodel].Data[n-1][i])/2
			}
		}else{
			c=D[i]+(iadderror?Expt_getRandomError(i,smodel):0)
		}
		ir=(Math.abs(c)<cmin?-DATAROUND:DATAROUND)
		s+=Util_flushRight(Util_roundoff(c,ir),DATAWIDTH)
	}
	s+="\n"
	DataInfo[smodel].s=s
	return s
}

function Data_getTable(smodel){
	var s=Data_getHeader(smodel)
	for(var i=0;i<DataInfo[smodel].Data.length;i++)s+=Data_getLine(i,false,smodel)
	return s
}

function Data_refreshAll(){
	for(smodel in ModelInfo)Data_updateInterface(smodel,-1)
}

function Data_reset(smodel,from){
	if(!DataInfo[smodel].haveinterface)return
	DataInfo[smodel].s=Data_getHeader(smodel)
}

function Data_setDefaults(smodel){
	DataInfo[smodel].Data=new Array()
	DataInfo[smodel].s=""
	DataInfo[smodel].hidetemp=true
	DataInfo[smodel].rows=DATAROWS
	DataInfo[smodel].dXdt=false
	DataInfo[smodel].prevcomponent=0
	DataInfo[smodel].target=DataInfo[smodel].defaulttarget="document.data_"+smodel+".data"
}

function Data_setParameters(plist,smodel){
	if(arguments.length<2)smodel=thismodel
	Util_setParameters("Data",plist,smodel)
}

function Data_setRows(n,smodel){
	if(arguments.length<2)smodel=thismodel
	DataInfo[smodel].rows=n
}

function Data_setTarget(targetobj,smodel){
	if(arguments.length<2)smodel=thismodel
	if(arguments.length<1||targetobj=="")targetobj=DataInfo[smodel].defaulttarget
	if(DataInfo[targetobj]){
		DataInfo[smodel].target=DataInfo[targetobj].target
	}else{
		DataInfo[smodel].target=targetobj
	}
	if(DataInfo[smodel].target==DataInfo[smodel].defaulttarget){
		Data_reset(smodel,"dsettarg")
		var s=Data_getDataForm(DataInfo[smodel].target,"data will appear here",smodel)
		document.write(s)
	}
	DataInfo[smodel].haveinterface=true	
}

function Data_show(smodel,imustdo){
	if(!imustdo && isqonly)return
	if(arguments.length<1)smodel=thismodel
	if(DataInfo[smodel].haveinterface)return
	Data_setTarget("",smodel)
}

function Data_showDerivatives(TF,smodel){
	if(arguments.length<2)smodel=thismodel
	if(arguments.length<1)TF=true
	DataInfo[smodel].dXdt=(TF!=0)
	if(!DataInfo[smodel].haveinterface)return
	var s=Data_getTable(smodel)
	Data_writeData(s,smodel)
}

function Data_updateInterface(smodel,mode){
	Data_getData(smodel,mode)
	if(!DataInfo[smodel].haveinterface)return
	if(mode==-1)Data_reset(smodel,"dupdatei mode-1")
	var s=Data_getDataList(mode,smodel)
	Data_writeData(s,smodel)
}

function Data_writeData(s,smodel){
	var Target=DataInfo[smodel].target.split("|")
	if(Target.length==1){
		var d=eval(Target[0])
		d.value=s
	}else{//must be a div
		writedivtextarea(Target[0],Target[1],s)
	}
}

