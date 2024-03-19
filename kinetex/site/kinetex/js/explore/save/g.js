//graph.js
idebugg=false && true
sdebug=""

ihavegraphjs=true

function Graph_setKey(skey,smodel){
	if(arguments.length<2)smodel=thismodel 
	if(arguments.length<1)skey="" 
	if(skey==""){
		for(var i in ModelInfo[smodel].Component)skey+=(skey==""?"":";")+ModelInfo[smodel].Component[i].graphcolor+"=["+ModelInfo[smodel].Component[i].xhtml+"]"
	}
	if(skey=="-")skey=""
	GraphInfo[smodel].key=skey
}

function Graph_setTitle(s,smodel){
	if(arguments.length<2)smodel=thismodel 
	GraphInfo[smodel].title=s
	if(!GraphInfo[smodel].thisgraph)return
	GRdivwrite(GraphInfo[smodel].pttitle,s,0,0,0,GraphInfo[smodel].thisgraph)
}

function Graph_setYmax(y,smodel){
	if(arguments.length<2)smodel=thismodel 
	GraphInfo[smodel].ymax=y
}

function Graph_setYmin(y,smodel){
	if(arguments.length<2)smodel=thismodel 
	GraphInfo[smodel].ymin=y
}

function Graph_setYtransform(t,smodel){
	if(arguments.length<2)smodel=thismodel 
	if(t=="ln(y)"){
		GraphInfo[smodel].ytransform="Math.log(y)"
		GraphInfo[smodel].yaxislabel="ln[X]"
	}else{
		GraphInfo[smodel].ytransform=t
		if(t=="")t="y"
		GraphInfo[smodel].yaxislabel=t.replace(/y/g,"[X]")
	}
}

function Graph_setXmax(x,smodel){
	if(arguments.length<2)smodel=thismodel 
	GraphInfo[smodel].xmax=x
}

function Graph_setBox(left,top,width,height,smodel){
	if(arguments.length<5)smodel=thismodel 
	if(left)GraphInfo[smodel].graphleft=left
	if(top)GraphInfo[smodel].graphtop=top
	if(width)GraphInfo[smodel].graphwidth=width
	if(height)GraphInfo[smodel].graphheight=height
}

function Graph_setImageSize(width,height,smodel){
	if(arguments.length<3)smodel=thismodel 
	if(width)GraphInfo[smodel].imagewidth=width
	if(height)GraphInfo[smodel].imageheight=height
}

function Graph_setPointSize(pt,smodel){
	if(arguments.length<2)smodel=thismodel 
	GraphInfo[smodel].ptsize=pt
	}

function Graph_setXstep(x,smodel){
	if(arguments.length<2)smodel=thismodel 
	GraphInfo[smodel].xstep=x
}

function Graph_setParameters(plist,smodel){
	if(arguments.length<2)smodel=thismodel 
	Util_setParameters("Graph",plist,smodel)
}

function Graph_setDefaults(smodel){
 GraphInfo[smodel].imagedir=SimInfo.divgraphdir
 GraphInfo[smodel].types="[X] vs. t"
 GraphInfo[smodel].target=GraphInfo[smodel].defaulttarget="graph_"+smodel
 GraphInfo[smodel].style=".xaxisnum {font-size:8pt} .yaxisnum {font-size:8pt}"
 GraphInfo[smodel].xmin=0
 GraphInfo[smodel].ymin=0
 GraphInfo[smodel].xmax=20  //will be set to ExptInfo[smodel].endtime
 GraphInfo[smodel].ymax=2
 GraphInfo[smodel].ytransform=""
 GraphInfo[smodel].xaxislabel="time (sec)"
 GraphInfo[smodel].yaxislabel="[X]"
 GraphInfo[smodel].graphleft=50
 GraphInfo[smodel].graphtop=50
 GraphInfo[smodel].graphwidth=350
 GraphInfo[smodel].graphheight=200
 GraphInfo[smodel].imagewidth=480
 GraphInfo[smodel].imageheight=300
 GraphInfo[smodel].maxaddpoints=1
 GraphInfo[smodel].ptsize=4
 GraphInfo[smodel].xstep=2
 GraphInfo[smodel].docurve=false
 GraphInfo[smodel].title=ModelInfo[smodel].title
 GraphInfo[smodel].thisgraph=0
 GraphInfo[smodel].ptadd0=0
 GraphInfo[smodel].pttitle=0
 GraphInfo[smodel].targetgraph=""  //another graph
 GraphInfo[smodel].graphwindow=0
 GraphInfo[smodel].key=""
// GraphInfo[smodel].keyx="-10"
// GraphInfo[smodel].keyy="-20"
 GraphInfo[smodel].selected=""
 GraphInfo[smodel].haveinterface=true
 GraphInfo[smodel].anchory=0
 GraphInfo[smodel].anchorx=0
 GraphInfo[smodel].anchorname=""
//	GraphInfo[smodel].onmousedown = "Analysis_mouseDown"
//	GraphInfo[smodel].onmousemove = "Analysis_mouseMove"
//	GraphInfo[smodel].onmouseup = "Analysis_mouseUp"

 GraphInfo[smodel].debug=false && true
}

function Graph_debug(smodel){
 if(arguments.length<1)smodel=thismodel 
 GraphInfo[smodel].debug=true
}

function Graph_reset(smodel){
	if(!GraphInfo[smodel].haveinterface)return
	var y=0
	var n=GraphInfo[smodel].ptadd0-1
	var ig=GraphInfo[smodel].thisgraph
	GraphInfo[smodel].ngraphed=n
	for(var i=0;i<=ExptInfo[smodel].nmaxloops+1;i++){
		for(var j in ModelInfo[smodel].Component){if(Model_isSelected(j,smodel)){
			y=ModelInfo[smodel].Component[j].conc0
			if(GraphInfo[smodel].ytransform!=""||y>GraphInfo[smodel].ymax)y=10000
			GRdivmove(++n,0,y,GRUSER,ig)
		}}
	}
}

function Graph_setTarget(target,smodel){
	if(arguments.length<2)smodel=thismodel 
	if(GraphInfo[target]){
		GraphInfo[smodel].targetgraph=target
		GraphInfo[smodel].target=GraphInfo[target].target
		GraphInfo[smodel].pttitle=GraphInfo[target].pttitle
		Util_copyArray(GraphInfo[target],GraphInfo[smodel],
		 "xmin,ymin,xmax,ymax,graphleft,graphtop,graphwidth,graphheight,imagewidth,imageheight"
		)
//		Graph_setParameters("doxaxis=false|doyaxis=false",smodel)

		//Debug_showObj("GraphInfo","graph_settarget")

	}else{
		GraphInfo[smodel].target=target
		GraphInfo[smodel].targetgraph=""
	}
}


function Graph_show(smodel,imustdo){
	if(!imustdo && isqonly)return
	Util_setDivs()
	if(arguments.length<1)smodel=thismodel 
	if(GraphInfo[smodel].target==GraphInfo[smodel].defaulttarget){
		var s="\n<img name="+GraphInfo[smodel].target+" src="+SimInfo.gifdir+"graph.gif width="+GraphInfo[smodel].imagewidth+" height="+GraphInfo[smodel].imageheight+">"
		document.write(s)
	}
	Graph_setup(smodel)
	GraphInfo[smodel].haveinterface=true
}

function Graph_setup(smodel){
 Expt_reset(smodel)
 GraphInfo[smodel].xmax=ExptInfo[smodel].endtime
 if(ihaveanalysisjs){
	GraphInfo[smodel].onmousedown = "Analysis_mouseDown"
	GraphInfo[smodel].onmousemove = "Analysis_mouseMove"
	GraphInfo[smodel].onmouseup = "Analysis_mouseUp"
 }
 if(GraphInfo[smodel].target==""){
	GRopengraphwindow(GraphInfo[smodel].imagewidth,GraphInfo[smodel].imageheight)
 }else{
	GraphInfo[smodel].anchor=GraphInfo[smodel].target
	GRsetgraphwindow()
 }
 GraphInfo[smodel].graphwindow=GR.win
 Data=new Array([NaN,NaN])
 var nview=0
 for(var i in ModelInfo[smodel].Component)nview+=(Model_isSelected(i,smodel)?1:0)

 GraphInfo[smodel].maxaddpoints=(ExptInfo[smodel].nmaxloops+2)*nview

 if(ModelInfo[smodel].selected.length==1){
	GraphInfo[smodel].yaxislabel=GraphInfo[smodel].yaxislabel.replace(/X/g,ModelInfo[smodel].selected)
 }

 GRdrawgraph("",Data,"",GraphInfo[smodel])
 GraphInfo[smodel].thisgraph=GR.thisgraph
 GraphInfo[smodel].ptadd0=GR.List[GR.thisgraph].ptadd0
 GraphInfo[smodel].anchorx=GR.anchorx
 GraphInfo[smodel].anchory=GR.anchory
 GraphInfo[smodel].anchorname=GR.anchorname

//GRalert(smodel,GraphInfo[smodel].maxaddpoints,GraphInfo[smodel].ptadd0)

 if(GraphInfo[smodel].pttitle==0)GraphInfo[smodel].pttitle=GR.ititlediv
}

function Graph_showAll(){
 for(var i in GraphInfo){
	Graph_show(i)
 }
}

function Graph_start(smodel){
 if(!GraphInfo[smodel].haveinterface)return
 var y=0
 var ifirst=-1
 var ig=GraphInfo[smodel].thisgraph
 if(idebugg)sdebug=""

 for(var i=0;i<=ExptInfo[smodel].nmaxloops+1;i++){
	for(var j in ModelInfo[smodel].Component){if(Model_isSelected(j,smodel)){
		y=ModelInfo[smodel].Component[j].conc0
	 	if(GraphInfo[smodel].ytransform||y>GraphInfo[smodel].ymax)y=10000
		GraphInfo[smodel].ngraphed=GRaddpoint(0,y,ModelInfo[smodel].Component[j].x,ModelInfo[smodel].Component[j].graphcolor,GRUSER,ig)
		if(ifirst<0)ifirst=GraphInfo[smodel].ngraphed
		//if(idebugg)sdebug+="start "+smodel+"\n"+GraphInfo[smodel].ngraphed+" "+i+" "+j+" "+y
	}}
 }
 //if(idebugg){alert(sdebug);sdebug=""}
 GraphInfo[smodel].ngraphed=ifirst
}

function Graph_showPoint(smodel){
	var x=ExptInfo[smodel].time
	var y=0
	var ig=GraphInfo[smodel].thisgraph	
	var ipt=0
//	GRsetgraph(ig)
	for(var j in ModelInfo[smodel].Component){if(Model_isSelected(j,smodel)){
		y=ModelInfo[smodel].Component[j].conc+ModelInfo[smodel].Component[j].err
		if(idebugg)sdebug+="\n"+ModelInfo[smodel].k+"\ny="+smodel+" "+y+" "+GraphInfo[smodel].ytransform
		if(GraphInfo[smodel].ytransform)y=eval(GraphInfo[smodel].ytransform)
		ipt=++GraphInfo[smodel].ngraphed
	 	if(y<=GraphInfo[smodel].ymax && y+.1>GraphInfo[smodel].ymin){
			GRdivmove(ipt,x,y,GRUSER,ig)
			if(idebugg && ig==2)sdebug+="\n"+smodel+" "+ig+" "+ipt+" ("+x+","+y+")"
		}
	}}
	if(idebugg && ig==2 && (ipt% 10==0))alert(sdebug)
} 

function Graph_updateInterface(smodel,mode){
	if(!GraphInfo[smodel].haveinterface)return
	Graph_showPoint(smodel)
}

function Graph_setTypes(stypes,smodel){
	if(arguments.length<2)smodel=thismodel 
	GraphInfo[smodel].types=stypes
}


