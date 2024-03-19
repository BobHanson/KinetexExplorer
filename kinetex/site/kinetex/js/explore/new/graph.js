//graph.js
idebugg=false && true
sdebug=""
allowmouseaction=false

ihavegraphjs=true

function Graph_setKey(skey,smodel){
	if(arguments.length<2)smodel=thismodel 
	if(arguments.length<1)skey="" 
	var G=GraphInfo[smodel]
	if(skey==""){
		for(var i in ModelInfo[smodel].Component){if(Model_isSelected(i,smodel)){
			skey+=(skey==""?"":"|")+ModelInfo[smodel].Component[i].graphcolor+"=["+ModelInfo[smodel].Component[i].xhtml+"]"
		}}
	}
	if(skey=="-")skey=""
	G.key=skey
}

function Graph_setTitle(s,smodel){
	if(arguments.length<2)smodel=thismodel 
	var G=GraphInfo[smodel]
	G.title=s
	if(!G.thisgraph)return
	GRdivwrite(G.pttitle,s,0,0,0,G.thisgraph)
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
	var G=GraphInfo[smodel]
	if(t=="ln(y)"){
		G.ytransform="Math.log(y)"
		G.yaxislabel="ln[X]"
	}else{
		G.ytransform=t
		if(t=="")t="y"
		G.yaxislabel=t.replace(/y/g,"[X]")
	}
}

function Graph_setXmax(x,smodel){
	if(arguments.length<2)smodel=thismodel 
	GraphInfo[smodel].xmax=x
}

function Graph_setBox(left,top,width,height,smodel){
	if(arguments.length<5)smodel=thismodel 
	var G=GraphInfo[smodel]
	if(left)G.graphleft=left
	if(top)G.graphtop=top
	if(width)G.graphwidth=width
	if(height)G.graphheight=height
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
 var G=GraphInfo[smodel]
 G.imagedir=SimInfo.divgraphdir
 G.types="[X] vs. t"
 G.target=""
 G.defaulttarget="graph_"+smodel
 G.havetarget=false //MUST be false for compare2.htm
 G.style=".xaxisnum {font-size:8pt} .yaxisnum {font-size:8pt}"
 //other elements include .title, .keylabel, .ptlabel, .trendeqn, .xlabel, .ylabel,.tline
 G.xmin=0
 G.ymin=0
 G.xmax=20  //will be set to ExptInfo[smodel].endtime
 G.ymax=2
 G.ytransform=""
 G.xaxislabel="time (sec)"
 G.yaxislabel="[X]"
 G.windowtitle="Kinetex -- Reaction Graph"
 G.windowleft=300
 G.windowtop=100
 G.graphleft=50
 G.graphtop=50
 G.graphwidth=350
 G.graphheight=200
 G.imagewidth=480
 G.imageheight=300
 G.maxaddpoints=1
 G.ptsize=4
 G.xstep=2
 G.docurve=false
 G.title=ModelInfo[smodel].title
 G.thisgraph=0
 G.ptadd0=0
 G.pttitle=0
 G.usesgraphof=""  //another graph
 G.graphwindow=0
 G.key=""
// G.keyx="-10"
// G.keyy="-20"
 G.selected=""
 G.anchory=0
 G.anchorx=0
 G.anchorname=""
 G.onmousedown=""
 G.onmousemove=""
 G.onmouseup=""
 G.mouseon=false
 G.debug=false && true
 G.isinitialized=true
}

function Graph_debug(smodel){
 if(arguments.length<1)smodel=thismodel 
 GraphInfo[smodel].debug=true
}

function Graph_initialize(smodel){
	//from Expt_start
	var G=GraphInfo[smodel]
	if(G.graphwindow && G.graphwindow.closed)G.isinitialized=false
 	if(G.isinitialized){
		G.graphwindow.focus()
		return true
	}
	Graph_setup(smodel)
	G.isinitialized=true
	thismodel=smodel
	G.graphwindow.focus()
	setTimeout("Expt_start()",100)
	return false
}

function Graph_reset(smodel,issetuponly){
	var G=GraphInfo[smodel]
	var y=0
	var n=G.ptadd0-1
	var ig=G.thisgraph
	G.ngraphed=n
	if(!GR.List || !GR.List[ig])return
	GR.List[ig].nadd=0
	for(var i=0;i<=ExptInfo[smodel].nmaxloops+1;i++){
		for(var j in ModelInfo[smodel].Component){if(Model_isSelected(j,smodel)){
			y=ModelInfo[smodel].Component[j].conc0
			if(G.ytransform!=""||y>G.ymax)y=10000
			GRdivmove(++n,0,y,GRUSER,ig)
		}}
	}
}

function Graph_setTarget(target,smodel){
	if(arguments.length<2)smodel=thismodel 
	var G=GraphInfo[smodel]
	if(!target)target="NEWWINDOW"
	if(GraphInfo[target]){
		G.usesgraphof=target
		G.target=GraphInfo[target].target
		G.pttitle=GraphInfo[target].pttitle
		Util_copyArray(GraphInfo[target],G,
		 "xmin,ymin,xmax,ymax,graphleft,graphtop,graphwidth,graphheight,imagewidth,imageheight"
		)
//		Graph_setParameters("doxaxis=false|doyaxis=false",smodel)

		//Debug_showObj("GraphInfo","graph_settarget")

	}else{
		G.target=target
		G.usesgraphof=""
		if(target=="NEWWINDOW")G.isinitialized=false
	}
}

function Graph_show(smodel,imustdo){
	if(arguments.length<1)smodel=thismodel 
	if(!imustdo && isqonly)return
	Util_setDivs()
	var G=GraphInfo[smodel]

	if(G.target+G.usesgraphof==""){
		G.target=G.defaulttarget
		var s="\n<img name="+G.target+" src="+SimInfo.gifdir+"graph.gif width="+G.imagewidth+" height="+G.imageheight+">"
		document.write(s)
	}
	Graph_setup(smodel)
}

function Graph_setup(smodel){
 Expt_reset(smodel)
 var G=GraphInfo[smodel]
 G.xmax=ExptInfo[smodel].endtime
 if(ihaveanalysisjs){
	G.onmousedown="Analysis_mouseDown"
	G.onmousemove="Analysis_mouseMove"
	G.onmouseup="Analysis_mouseUp"
	G.mouseon=allowmouseaction
 }
 if(G.target=="NEWWINDOW"){
	GRopengraphwindow(G.imagewidth,G.imageheight,G.windowleft,G.windowtop)
 }else{
	G.anchor=G.target
	GRsetgraphwindow()
 }
 G.graphwindow=GR.win
 Data=new Array([NaN,NaN])
 var nview=0
 for(var i in ModelInfo[smodel].Component)nview+=(Model_isSelected(i,smodel)?1:0)

 G.maxaddpoints=(ExptInfo[smodel].nmaxloops+2)*nview

 if(ModelInfo[smodel].selected.length==1){
	G.yaxislabel=G.yaxislabel.replace(/X/g,ModelInfo[smodel].selected)
 }

 GRdrawgraph("",Data,"",G)
 if(G.target=="NEWWINDOW")GRclosegraphdocument()

 G.thisgraph=GR.thisgraph
 G.ptadd0=GR.List[GR.thisgraph].ptadd0
 G.anchorx=GR.anchorx
 G.anchory=GR.anchory
 G.anchorname=GR.anchorname

//alert(smodel+" graph_setup thisgraph="+GR.thisgraph+" "+G.target+" "+G.usesgraphof)
//GRalert(smodel,G.maxaddpoints,G.ptadd0)

 if(G.pttitle==0)G.pttitle=GR.ititlediv

 G.havetarget=true
}

function Graph_showAll(){
 for(var i in GraphInfo){
	Graph_show(i)
 }
}

function Graph_start(smodel){
 var G=GraphInfo[smodel]
 if(G.target=="NEWWINDOW"){
	//we'll handle this later, because the window isn't open yet
//	if(autostart)alert("You can't use Simulate_init(1) on a page that automatically pops up a new window. Netscape considers this a security risk.")
	return
 }
 if(!G.havetarget)return
 var y=0
 var ifirst=-1
 var ig=G.thisgraph
 if(idebugg)sdebug=""

 for(var i=0;i<=ExptInfo[smodel].nmaxloops+1;i++){
	for(var j in ModelInfo[smodel].Component){if(Model_isSelected(j,smodel)){
		y=ModelInfo[smodel].Component[j].conc0
	 	if(G.ytransform||y>G.ymax)y=10000
		G.ngraphed=GRaddpoint(0,y,ModelInfo[smodel].Component[j].x,ModelInfo[smodel].Component[j].graphcolor,GRUSER,ig)
		if(ifirst<0)ifirst=G.ngraphed
		//if(idebugg)sdebug+="start "+smodel+"\n"+G.ngraphed+" "+i+" "+j+" "+y
	}}
 }
 //if(idebugg){alert(sdebug);sdebug=""}
 G.ngraphed=ifirst
}

function Graph_showPoint(smodel){
	var G=GraphInfo[smodel]
	if(!G.havetarget)return
	var x=ExptInfo[smodel].time
	var y=0
	var isnewwin=(G.target=="NEWWINDOW")
	var ig=G.thisgraph	
	var ipt=0
	for(var j in ModelInfo[smodel].Component){if(Model_isSelected(j,smodel)){
		y=ModelInfo[smodel].Component[j].conc+ModelInfo[smodel].Component[j].err
		if(idebugg)sdebug+="\n"+ModelInfo[smodel].k+"\ny="+smodel+" "+y+" "+G.ytransform
		if(G.ytransform)y=eval(G.ytransform)
		ipt=++G.ngraphed
	 	if(y<=G.ymax && y+.1>G.ymin){

			if(isnewwin){
				GRaddpoint(x, y, "", ModelInfo[smodel].Component[j].graphcolor, GRUSER,ig)
			}else{
				GRdivmove(ipt,x,y,GRUSER,ig)
			}

			if(idebugg && ig==2)sdebug+="\n"+smodel+" "+ig+" "+ipt+" ("+x+","+y+")"
		}
	}}
	if(idebugg && ig==2 && (ipt% 10==0))alert(sdebug)
} 

function Graph_updateInterface(smodel,mode){
	if(!GraphInfo[smodel].havetarget)return
	Graph_showPoint(smodel)
}

function Graph_setTypes(stypes,smodel){
	if(arguments.length<2)smodel=thismodel 
	GraphInfo[smodel].types=stypes
}


