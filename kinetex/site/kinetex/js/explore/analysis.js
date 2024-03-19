//CHECKJS  D:\js\kinetex\analysis.js 1/31/2003 6:28:32 AM
//analysis.js
ihaveanalysisjs=true
//note: mouseup event is NOT triggered after a drag, although the mousemove event is.
//So we could drag and possibly wait for a trigger event?
sdebug=""
MOUSEDELAY=500
SMALLSLOPEDIM=80
SMALLSLOPEWIDTH=120

function Analysis_findSlope(t0,t1,ix,smodel){
	var lastt=DataInfo[smodel].Data.length-1
	var tpt=DataInfo[smodel].Data[0].length-1
	var A=new Array()
	var y=0
	if(t0==t1){
		t0--
		t1++
		if(t1>lastt)t1--
		if(t0<0)t0++
	}
	for(var i=t0;i<=t1;i++){
		y=DataInfo[smodel].Data[i][ix]
		if(GraphInfo[smodel].ytransform)y=eval(GraphInfo[smodel].ytransform)
		A[A.length]=new Array(DataInfo[smodel].Data[i][tpt],y)
	}
	AnalysisInfo[smodel].L=new Array()
	GRgetleastsquares(A,AnalysisInfo[smodel].L)
	AnalysisInfo[smodel].L.firsttime=t0
	AnalysisInfo[smodel].L.lasttime=t1
	AnalysisInfo[smodel].L.component=ix
}

function Analysis_hideInfo(swhat,smodel){
	if(arguments.length<2)smodel=thismodel
	if(swhat=="rate"){
		AnalysisInfo[smodel].hiderate=true
	}
}

function Analysis_mouseDown(e,D){
	MouseInfo=new Array()
	MouseInfo.event="down"
	MouseInfo.ux0=MouseInfo.ux1=D.userx
	MouseInfo.uy0=MouseInfo.uy1=D.usery
	MouseInfo.dx0=MouseInfo.dx1=D.docx
	MouseInfo.dy0=MouseInfo.dy1=D.docy
	MouseInfo.ngraph=D.ngraph
	MouseInfo.timeout=0
	//sdebug=""
}

function Analysis_mouseMove(e,D){
	if(MouseInfo.event!="down")return
	if(!AnalysisInfo.thismodel)return
	MouseInfo.ux1=D.userx
	MouseInfo.uy1=D.usery
	MouseInfo.dx1=D.docx
	MouseInfo.dy1=D.docy
	if(MouseInfo.timeout)clearTimeout(MouseInfo.timeout)
	MouseInfo.timeout=setTimeout("Analysis_mouseTrigger()",MOUSEDELAY)
	Analysis_showSlope(D.ngraph,"move")
}

function Analysis_mouseTrigger(){
	if(MouseInfo.event!="down")return
	MouseInfo.event="trigger"
	MouseInfo.ngraph=D.ngraph
	Analysis_showSlope(D.ngraph,"trigger")
}

function Analysis_mouseUp(e,D){
	//GRalert(GRshow(D,"D"))
	if(MouseInfo.event!="down")return
	MouseInfo.ux1=D.userx
	MouseInfo.uy1=D.usery
	MouseInfo.dx1=D.docx
	MouseInfo.dy1=D.docy
	MouseInfo.event="up"
	MouseInfo.ngraph=D.anchorname
	Analysis_showSlope(D.anchorname,"up")
}

function Analysis_move(smodel){
	if(!AnalysisInfo[smodel].havetarget)return
	var D=divanchor(AnalysisInfo[smodel].target)
	divmove("analysis_"+smodel,0,0)
}

function Analysis_reset(ishowmsg,smodel){
	if(!AnalysisInfo[smodel].havetarget)return
	var s="<img src="+SimInfo.gifdir+"transp.gif width=100 height=100>"
	writediv("analysis__slope_"+smodel,s)
	s=(ishowmsg?"Click graph<br>for rate<br>analysis.<br>":"")
	s+="<p><a href=javascript:Expt_startAll()>"+(ishowmsg?"Res":"S")+"tart the<br>reaction.</a>"
	if(!AnalysisInfo[smodel].ismini)s+="<br><img src="+SimInfo.gifdir+"transp.gif width="+SMALLSLOPEDIM+" height="+(SMALLSLOPEDIM-40)+">"
	s=Analysis_table("black",s,AnalysisInfo[smodel].ismini)
	writediv(AnalysisInfo[smodel].div,s)
}

function Analysis_setDefaults(smodel){
	AnalysisInfo[smodel].isvisible=false
	AnalysisInfo[smodel].hiderate=false
	AnalysisInfo[smodel].ishidden=false
	AnalysisInfo[smodel].havetarget=false
	AnalysisInfo[smodel].ismini=false
	AnalysisInfo[smodel].defaulttarget="analysisimg_"+smodel
	AnalysisInfo[smodel].notify=""
	AnalysisInfo[smodel].div="analysis_"+smodel
}

function Analysis_setNotify(func,smodel){
	if(arguments.length<2)smodel=thismodel
	AnalysisInfo[smodel].notify=func
}

function Analysis_setParameters(plist,smodel){
	if(arguments.length<2)smodel=thismodel
	Util_setParameters("Analysis",plist,smodel)
}

function Analysis_setTarget(targetimg,smodel){
	if(arguments.length<2)smodel=thismodel
//	if(!AnalysisInfo.thismodel){ //only done once
		AnalysisInfo.thismodel=smodel
		Util_createDiv("analysis__slope_"+smodel)
//	}
	if(arguments.length<1){
		AnalysisInfo[smodel].ishidden=true
		return  //must be hidden
	}
	if(targetimg=="")targetimg=AnalysisInfo[smodel].defaulttarget
	AnalysisInfo[smodel].havetarget=true
	if(AnalysisInfo[targetimg]){
		AnalysisInfo[smodel].target=AnalysisInfo[targetimg].target
		AnalysisInfo[smodel].div=AnalysisInfo[targetimg].div
	}else{
		AnalysisInfo[smodel].target=targetimg
		Util_createDiv(AnalysisInfo[smodel].div)
	}
	if(AnalysisInfo[smodel].target==AnalysisInfo[smodel].defaulttarget){
		s="<img name="+AnalysisInfo[smodel].target+" src="+SimInfo.gifdir+"transp.gif width="+SMALLSLOPEDIM+" height="+((AnalysisInfo[smodel].ismini?1:2)*SMALLSLOPEDIM)+">"
		document.write(s)
	}
	Analysis_move(smodel)
}

function Analysis_show(smodel,imustdo){
	if(!imustdo && isqonly)return
	if(arguments.length<1)smodel=thismodel
	AnalysisInfo[smodel].isvisible=true
	Analysis_setTarget("",smodel)
}

function Analysis_showSlope(anchorname,mode){
	if(mode=="move")return
	var m=0
	var b=0
	var x=0
	var y=0
	var dx=0
	var dy=0
	var x1=0
	var x2=0
	var y1=0
	var y2=0
	var h=0
	var w=0
	var Pt0=new Array()
	var Pt1=new Array()
	var t0=0
	var t1=0
	var ix=0
	var rate=""
	var s=""
	var sgif=""
	var slopetype=""
	var smodel=""
	//Data_findPoint return is [timept,componentpt,yval,smodel]
	Pt0=Data_findPoint(anchorname,MouseInfo.ux0,MouseInfo.uy0,(mode=="up"?0:-1),"")
	t0=Pt0[0]
	ix=Pt0[1]
	smodel=Pt0[3]
	if(t0<0||t1<0) return
	AnalysisInfo.thismodel=smodel
	if(mode=="up"){
		x=t1=t0
	}else{
		Pt1=Data_findPoint(anchorname,MouseInfo.ux1,MouseInfo.uy1,1,smodel)
		t1=Pt1[0]
		if(t0>t1){
			x=t1
			t1=t0
			t0=x
		}
		x=(t0+t1)/2
	}
	slopetype=(t0==0 && t1==0?"initial":t0==t1?"average at pt#"+(t0+1):"average ("+(t0+1)+"-"+(t1+1)+")")
	if(slopetype=="initial" && GraphInfo[smodel].ytransform)return

for(var smodel in GraphInfo){if(GraphInfo[smodel].target==anchorname){

	Analysis_findSlope(t0,t1,ix,smodel)
	if(t1==0){
		AnalysisInfo[smodel].L.m=ExptInfo[smodel].initialrate*ModelInfo[smodel].Component[ix].coeff0
		AnalysisInfo[smodel].L.b=Pt0[2]
		//Debug_showObj("AnalysisInfo['"+smodel+"'].L")
	}
	// y=mx+b, so b=y-mx
	m=AnalysisInfo[smodel].L.m
	y=DataInfo[smodel].Data[t0][ix]
	if(GraphInfo[smodel].ytransform)y=eval(GraphInfo[smodel].ytransform)
	b=(x==t0?y-m*t0:AnalysisInfo[smodel].L.b)
	Rxn_updateInterface(t0,smodel)
	if(AnalysisInfo[smodel].notify)AnalysisInfo[smodel].notify(t0,t1,m,b,smodel)
	if(AnalysisInfo[smodel].ishidden)return
	
	//rest is for the slope divs
	
	dx=ExptInfo[smodel].endtime/2
	x1=Math.max(x-dx,0)
	x2=Math.min(x+dx,ExptInfo[smodel].endtime)
	
	y1=x1*m+b
	y2=x2*m+b
	if(y2<GraphInfo[smodel].ymin){
		y2=GraphInfo[smodel].ymin
		x2=(y2-b)/m
	}
	if(y1<GraphInfo[smodel].ymin){
		y1=GraphInfo[smodel].ymin
		x1=(y1-b)/m
	}
	
	GRsetgraph(GraphInfo[smodel].thisgraph)
	x1=GRxof(x1)
	x2=GRxof(x2)
	y1=GRyof(y1)
	y2=GRyof(y2)
	dy=Math.abs(y2-y1)
	//small one
	w=Math.floor(x2-x1+1)
	h=Math.floor(dy/w*SMALLSLOPEDIM+1)

	if(h>SMALLSLOPEDIM){
		w=Math.floor(SMALLSLOPEDIM*SMALLSLOPEDIM/h+1)
		h=SMALLSLOPEDIM
	}else{
		w=SMALLSLOPEDIM
	}
	sgif=SimInfo.gifdir+(x2==x1?"blackv":y2==y1?"blackh":((x2-x1)*(y2-y1)>0?"line1s":"line2s")+(h/w<0.25?"s":""))+".gif"
	var rate=m/ModelInfo[smodel].Component[ix].coeff
	
	s=ModelInfo[smodel].Component[ix].xhtml
	if(GraphInfo[smodel].ytransform){
		s="slope="+Util_roundoff(m)
	}else{
		s=slopetype+"<br>"+(AnalysisInfo[smodel].hiderate?"":"rate="+Util_roundoff(rate)+"<br>")+"d["+s+"]/dt="+Util_roundoff(m)
	}
	if(!AnalysisInfo[smodel].ismini)s+="<br><img src="+sgif+" width="+w+" height="+h+">"
	s=Analysis_table(ModelInfo[smodel].Component[ix].graphcolor,s,AnalysisInfo[smodel].ismini)
	writediv(AnalysisInfo[smodel].div,s)
	
	//these are in PAGE coordinates
	//top edge connection y=mx+b so x=(y-b)/m
	if(dy>GraphInfo[smodel].imageheight){
		m=(y2-y1)/(x2-x1)
		b=y2-m*x2
		x1=(0-b)/m
		x2=(GraphInfo[smodel].imageheight-b)/m
		y1=m*x1+b
		y2=m*x2+b
	}
	
	w=Math.floor(Math.abs(x2-x1)+1)
	h=Math.floor(Math.abs(y2-y1)+1)
	
	
	sgif=SimInfo.gifdir+(x2==x1?"blackv":y2==y1?"blackh":((x2-x1)*(y2-y1)>0?"line1":"line2")+(h/w<0.25?"b":""))+".gif"
	s="<img src="+sgif+" width="+w+" height="+h+">"
	writediv("analysis__slope_"+smodel,s)
	anchorx=GraphInfo[smodel].anchorx
	anchory=GraphInfo[smodel].anchory
	divmove("analysis__slope_"+smodel,Math.min(x1,x2),Math.min(y1,y2))

}}

}

function Analysis_table(c,s,ismini){
	if(ismini){
		var s="<table width="+(SMALLSLOPEWIDTH*1.2)+" height="+SMALLSLOPEDIM+" border=3 bordercolor="+c+"><tr><td valign=top align=center>"+s+"</td></tr></table>"
	}else{
		var s="<table width="+(SMALLSLOPEWIDTH*1.2)+" height="+(2*SMALLSLOPEDIM)+" border=3 bordercolor="+c+"><tr><td height="+(2*SMALLSLOPEDIM)+" valign=top align=center>"+s+"</td></tr></table>"
	}
	return s
	
}

function Analysis_updateInterface(smodel){
}

