/*
7/12/2004: fixed parseFloat("") for Opera, where parseFloat("")=0, not NaN
10:23 AM 7/11/2004 7/11/04 added GR.ititlediv
6:04 AM 5/10/2003 modified digits for r2 to 4
6:02 AM 4/16/2003 fix for key containing |
6:27 AM 4/12/2003 4/12/2003 mouseon added
5:27 AM 4/6/2003 remove .body in style for NN6
5:18 AM 3/17/2003 () in trend printout

8:22 AM 1/31/2003 added mouseevent D.anchorname
8:02 AM 1/25/2003 added NOALPHA and mousetest
Navigator will report "e has no properties" but still work!"
2:11 PM 1/25/2003 made datamargin a GR. function

ver 6/3/02 bh

add 7/28/01 added datamargin()
add 3/9/02 added GRaddpointref(); adjusted labt and xaxis for Netscape printing bug
fix 5/8/02 docurve with # points > width and better curves. See   if(docurve){
fix 5/9/02 overlapping labels on autoscale majorx in GRdotics
fix 6/2/02 better datamargin code
add 6/2/02 support for nn6 (getElementById;removed "with")

divgraph.js by Bob Hanson (hansonr@stolaf.edu)

see examples.htm, info.htm, functions.htm for programming info.

NOTE: If the GIF files are placed in a directory OTHER than the one
the calling page is in, then you must indicate that by changing
GR.imagedir or Info.imagedir to indicate that directory.

*/

//#NOALPHA

var GR=new Array()	//globals

GR.imagedir="."		//image directory
GR.List=new Array()	//graph-specific

//--JS Math conversions:

function sin(x){return Math.sin(x)}
function cos(x){return Math.cos(x)}
function tan(x){return Math.sin(x)/Math.cos(x)}
function log(x){return Math.LOG10E*Math.log(x)}
function ln(x){return Math.log(x)}
function sqrt(x){return Math.pow(x,0.5)}
function sqr(x){return Math.pow(x,0.5)}

//--primary interface

function GRadddata(sdata,Data,Labels,Info){
	//note: CANNOT BE RUN AFTER PAGE HAS LOADED
	if(arguments.length<4)Info=new Array()
	if(arguments.length<3)Labels=new Array()
	if(arguments.length<2)Data=new Array()
	if(arguments.length<1)sdata=""
	if(Data.length==0 && sdata==""){
		sdata=GRprompt("Data to plot (x,y,x,y,x,y)?",GR.lastdata)
		GR.lastdata=sdata
		if(sdata.indexOf(",")<0)return 0
	}
	if(sdata.length){
		Data=new Array()
		if(Labels.length==0)Labels=new Array()
		if(!GRgetdata(sdata,Data,Labels))return 0
	}
	Info.append=true
	return GRdrawgraph("",Data,Labels,Info,GR.doc)
}

function GRaddfunction(f_of_x,Info){
	//note: CANNOT BE RUN AFTER PAGE HAS LOADED
	if(arguments.length<3)doc=GR.doc
	if(arguments.length<2)Info=new Array()
	if(arguments.length<1)f_of_x=""
	if(!GRinitdivs())return 0
	var D=new Array()
	var L=new Array()
	if(f_of_x.indexOf("x")<0)f_of_x=GRprompt("JavaScript function of x to plot?",GR.lastfunc)
	GR.lastfunc=f_of_x
	if(f_of_x.indexOf("x")<0)return 0
	Info.append=true
	return GRdrawgraph(f_of_x,D,L,Info,GR.doc)
}

function GRaddpoint(x,y,label,c,xytype,ngraph){
	//NN4: CANNOT BE RUN BEFORE PAGE IS LOADED
	//maximum number of points must be predefined as Info.maxaddpoints
	if(!GRinitdivs())return 0
	if(arguments.length<6)ngraph=GR.thisgraph
	if(isNaN(GR.List[ngraph].ptadd0)||GR.List[ngraph].ptadd0+GR.List[ngraph].nadd>GR.List[ngraph].ptadd1)return 0
	if(arguments.length<5)xytype=GRUSER
	if(arguments.length<3)label=x+" , "+y
	if(arguments.length<2){
		var s=GRprompt("x,y,alt|label,color? ("+(GR.List[ngraph].nadd+1)+" of "+(GR.List[ngraph].ptadd1-GR.List[ngraph].ptadd0+1)+")",GR.xlast+","+GR.ylast+","+GR.textlast+","+GR.colorlast)
		var A=s.split(",")
		if(A.length<2)return 0
		x=A[0]
		y=A[1]
		if(A.length>2)label=A[2]
		if(A.length>3)c=A[3]
		xytype=GRUSER
		GR.textlast=label
		GR.colorlast=c
	}
	if(c && c.length>0)label=GRptof(0,GR.List[ngraph].ptsize,GR.List[ngraph].ptsize,c,label)
	var i=GR.List[ngraph].ptadd0+(GR.List[ngraph].nadd++)
	GRdivwrite(i,label,x,y,xytype,ngraph)
	return i
}

function GRaddpointref(x,y,label,c,ref,xytype,ngraph){
	//NN4: CANNOT BE RUN BEFORE PAGE IS LOADED
	//maximum number of points must be predefined as Info.maxaddpoints
	if(!GRinitdivs())return 0
	if(arguments.length<7)ngraph=GR.thisgraph
	if(arguments.length<5)return 0

	if(isNaN(GR.List[ngraph].ptadd0)||GR.List[ngraph].ptadd0+GR.List[ngraph].nadd>GR.List[ngraph].ptadd1)return 0
	if(arguments.length<6)xytype=GRUSER
	if(c && c.length>0)label=GRptof(0,GR.List[ngraph].ptsize,GR.List[ngraph].ptsize,c,label)
	var i=GR.List[ngraph].ptadd0+(GR.List[ngraph].nadd++)

	label="<a href=\""+ref+"\">"+label+"</a>"
	label=label.replace(/\<img/,"<img border=0")
	GRdivwrite(i,label,x,y,xytype,ngraph)
	return i
}

function GRaddtext(x,y,stext,c,xytype,ngraph){
	//NN4: CANNOT BE RUN BEFORE PAGE IS LOADED
	//maximum number of points must be predefined as Info.maxaddpoints
	if(!GRinitdivs())return 0
	if(arguments.length<6)ngraph=GR.thisgraph
	if(isNaN(GR.List[ngraph].ptadd0)||GR.List[ngraph].ptadd0+GR.List[ngraph].nadd>GR.List[ngraph].ptadd1)return 0
	if(arguments.length<5)xytype=GRUSER
	if(arguments.length<3){
		var s=GRprompt("x,y,text,color? ("+(GR.List[ngraph].nadd+1)+" of "+(GR.List[ngraph].ptadd1-GR.List[ngraph].ptadd0+1)+")",GR.xlast+","+GR.ylast+","+GR.textlast+","+GR.colorlast)
		var A=s.split(",")
		if(A.length<3)return 0
		x=parseFloat(A[0]+"x")
		y=parseFloat(A[1]+"x")
		stext=A[2]
		if(A.length>3)c=A[3]
		xytype=GRUSER
		GR.textlast=stext
	}
	var noff=0
	if(c && c.length>0){
		noff=5
		var s=(c.indexOf("align=")>=0?GR.slabt:GR.slab)
		stext=s.replace(/_text/,stext).replace(/_color/,c)
	}
	GR.List[ngraph].anchorx+=noff
	GR.List[ngraph].anchory-=noff
	var i=GR.List[ngraph].ptadd0+(GR.List[ngraph].nadd++)
	GRdivwrite(i,stext,x,y,xytype,ngraph)
	GR.List[ngraph].anchorx-=noff
	GR.List[ngraph].anchory+=noff

	return i
}

function GRclosegraphdocument(doc){
	if(GR.win==null || GR.win.closed)return
	if(arguments.length<1)doc=GR.doc
	doc.close()
	return doc
}

function GRclosegraphwindow(ngraph,delay){
	if(ngraph==null)ngraph=0
	if(delay==null)delay=20
	for(var i=1;i<GR.List.length;i++){
		if((ngraph==0 || ngraph==i) && GR.List[i].win && GR.List[i].win != window && !GR.List[i].win.closed){
			setTimeout("GR.List["+i+"].win.close()",delay)
		}
	}
}

function GRdrawgraph(f_of_x,Data,Labels,Info,doc){
	if(GR.win==null)GR.doc=GRsetgraphwindow()
	if(GR.win.closed)return 0

	if(arguments.length<5)doc=GR.doc
	if(arguments.length<4)Info=new Array()
	if(arguments.length<3)Labels=new Array()
	if(arguments.length<2)Data=new Array()
	if(arguments.length<1)f_of_x=""

	if(Labels.length==0)Labels=new Array()

	var s=""
	var i=0
	var n=0
	var x=0
	var x0=0
	var y0=0
	var x1=0
	var y1=0
	var x2=0
	var y2=0
	var c=""
	var y=0
	var n0=0
	var YvsX=new Array()
	var P=new Array()
	var Zeros=new Array(false,false)
	var isdata=(Data.length>0 && f_of_x.length==0)
	if(!GRinitdivs())return 0
	GR.append=GRgetinfo(Info,"append",false)
	GRcleargraph(!GR.append)
	GR.debug=GRgetinfo(Info,"debug",false)
	GR.mousetest=GRgetinfo(Info,"mousetest",false)
	GR.datatransform=(isdata?"y vs. x":GRgetinfo(Info,"datatransform","y vs. x"))

	isdata=isdata || f_of_x.indexOf(",")>=0 && (f_of_x.charAt(0)=="[" || !isNaN(parseFloat(f_of_x)))

	s=GR.datatransform.replace(/ /g,"")
	YvsX=s.split(s.indexOf("vs.")>=0?"vs.":"vs")
	if(!isdata && YvsX[0].indexOf("y")<0)YvsX[0]="y"
	if(!isdata && YvsX[1].indexOf("x")<0)YvsX[1]="x"
	GR.DataYX[0]=GRfixpower(YvsX[0])
	GR.DataYX[1]=GRfixpower(YvsX[1])
	YvsX[0]=GRfixpower(YvsX[0],"%1<sup>%2</sup>")
	YvsX[1]=GRfixpower(YvsX[1],"%1<sup>%2</sup>")

	if(GR.debug)GRalert(GRshow(YvsX,"YvsX"),GRshow(GR.DataYX,"GR.DataYX"),s)

	//change to user's

	s=GRgetinfo(Info,"xvar","x")
	if(s!="x")YvsX[1]=YvsX[1].replace(/x/g,s)
	s=GRgetinfo(Info,"yvar","y")
	if(s!="y")YvsX[0]=YvsX[0].replace(/y/g,s)

	//check for data in first parameter

	if(!isdata && f_of_x==""){
		f_of_x=GRprompt("f(x) or data in the form 'x1,y1,x2,y2,...'?",GR.lastfunc)
		if(f_of_x==null)return 0
	}
	if((f_of_x.charAt(0)=="[" || !isNaN(parseFloat(f_of_x))) && f_of_x.indexOf(",")>=0){
		isdata=true
		Data=new Array()
		if(!GRgetdata(f_of_x,Data,Labels))return 0
		f_of_x=""
	}

	GR.doxclip=GRgetinfo(Info,"xclip",true)
	GR.doyclip=GRgetinfo(Info,"yclip",true)

	GR.gheight=GRgetinfo(Info,"graphheight",GR.gheight)
	GR.imagedir=GRgetinfo(Info,"imagedir",GR.imagedir)
	GR.gleft=GRgetinfo(Info,"graphleft",GR.gleft)
	GR.gtop=GRgetinfo(Info,"graphtop",GR.gtop)
	GR.gwidth=GRgetinfo(Info,"graphwidth",GR.gwidth)
	GR.histogram=GRgetinfo(Info,"histogram",false)
	GR.mouseon=GRgetinfo(Info,"mouseon",true)
	GR.onmousedown=GRgetinfo(Info,"onmousedown",GR.onmousedown)
	var sbody=""
	if(GR.onmousedown){
		if(GR.isnn4){
			doc.captureEvents(GR.win.Event.MOUSEDOWN)
			doc.onmousedown=GRmouseevent
		}else if(GR.isnn6){
			doc.addEventListener("mousedown",GRmouseevent,true)
		}else{
			sbody+=" onmousedown=opener.GRmouseevent()"
		}
	}
	GR.onmousemove=GRgetinfo(Info,"onmousemove",GR.onmousemove)
	if(GR.onmousemove){
		if(GR.isnn4){
			doc.captureEvents(GR.win.Event.MOUSEMOVE)
			doc.onmousemove=GRmouseevent
		}else if(GR.isnn6){
			doc.addEventListener("mousemove",GRmouseevent,true)
		}else{
			sbody+=" onmousemove=opener.GRmouseevent()"
		}
	}
	GR.onmouseup=GRgetinfo(Info,"onmouseup",GR.onmouseup)
	if(GR.onmouseup){
		if(GR.isnn4){
			doc.captureEvents(GR.win.Event.MOUSEUP)
			doc.onmouseup=GRmouseevent
		}else if(GR.isnn6){
			doc.addEventListener("mouseup",GRmouseevent,true)
		}else{
			sbody+=" onmouseup=opener.GRmouseevent()"
		}
	}
	if(!GR.append){
		s=GRgetinfo(Info,"anchor","0,0")
		if(s.indexOf(",")>=0){
			P=s.split(",")
			GR.anchorx=parseInt(P[0])
			GR.anchory=parseInt(P[1])
			GR.anchorname=""
		}else{
			P=GRgetoffset(s,doc)
			if(P.left==null){
				GRalert("requested anchor was not found:"+s)
				s=""
			}
			GR.anchorx=P.left
			GR.anchory=P.top
			GR.anchorname=s
		}
	}
	GR.xmax=GRgetinfo(Info,"xmax",GR.append?GR.xmax:NaN)
	GR.xmin=GRgetinfo(Info,"xmin",GR.append?GR.xmin:NaN)
	GR.ymax=GRgetinfo(Info,"ymax",GR.append?GR.ymax:NaN)
	GR.ymin=GRgetinfo(Info,"ymin",GR.append?GR.ymin:NaN)
	GR.defaultcolor=GRgetinfo(Info,"defaultcolor","")
	GR.colorlast=(GR.defaultcolor.length?GR.defaultcolor:"blue")

	GR.ptsize=GRgetinfo(Info,"ptsize",isdata?3:1)
	if(GR.ptsize<1)GR.ptsize=1
	GR.linewidth=GRgetinfo(Info,"linewidth",GR.ptsize)
	GR.overwrite=GRgetinfo(Info,"overwrite",0)
	if(GR.overwrite<0 || GR.nplot==0)GR.overwrite=GR.nplot
	var bgcolor=GRgetinfo(Info,"bgcolor","")
	var curvecolor=GRgetinfo(Info,"curvecolor","")
	GR.datamargin=GRgetinfo(Info,"datamargin",0.05)
	var docurve=GRgetinfo(Info,"docurve",NaN)
	var dogridx=GRgetinfo(Info,"dogridx",false)
	var dogridy=GRgetinfo(Info,"dogridy",false)
	var dopoints=GRgetinfo(Info,"dopoints",true)
	var doptlabels=GRgetinfo(Info,"doptlabels",true)
	var dotrendeqn=GRgetinfo(Info,"dotrendeqn",true)
	var dotrendline=GRgetinfo(Info,"dotrendline",false)
	var doxaxis=GRgetinfo(Info,"doxaxis",true)
	var doxticnums=GRgetinfo(Info,"doxticnums",true)
	var doxtics=GRgetinfo(Info,"doxtics",true)
	var doyaxis=GRgetinfo(Info,"doyaxis",true)
	var doyticnums=GRgetinfo(Info,"doyticnums",true)
	var doytics=GRgetinfo(Info,"doytics",true)
	var key=GRgetinfo(Info,"key","")
	var keyx=GRgetinfo(Info,"keyx",10)
	var keyy=GRgetinfo(Info,"keyy",10)
	var labelsonly=GRgetinfo(Info,"labelsonly",false)
	var majorx=GRgetinfo(Info,"xticmajor","auto")
	var majory=GRgetinfo(Info,"yticmajor","auto")
	var majticlen=GRgetinfo(Info,"majorticlength",8)
	var maxadd=GRgetinfo(Info,"maxaddpoints",0)
	var minorx=GRgetinfo(Info,"xticminor","auto")
	var minory=GRgetinfo(Info,"yticminor","auto")
	var minticlen=GRgetinfo(Info,"minorticlength",5)
	var quicktrend=GRgetinfo(Info,"quicktrend",true)
	var salert=GRgetinfo(Info,"alert","")
	var sinfo=GRgetinfo(Info,"info","")
	var style=GRgetinfo(Info,"style","")
	var ticwidth=GRgetinfo(Info,"ticwidth",2)
	var title=GRgetinfo(Info,"title","")
	var trendcolor=GRgetinfo(Info,"trendcolor","black")
	var trenddig=GRgetinfo(Info,"trenddigits",-3)
	var trendx=GRgetinfo(Info,"trendlabelx",60)
	var trendy=GRgetinfo(Info,"trendlabely",60)
	var whendone=GRgetinfo(Info,"whendone","")
	var wtitle=GRgetinfo(Info,"windowtitle","")
	var xaty=GRgetinfo(Info,"xaxisaty",0)
	var yatx=GRgetinfo(Info,"yaxisatx",0)
	var xnumoff=0
	var xdig=GRgetinfo(Info,"xnumdigits",NaN)
	var xlabel=GRgetinfo(Info,"xaxislabel",YvsX[1])
	var xlabelx=GRgetinfo(Info,"xaxislabelx",1e99)
	var xlabely=GRgetinfo(Info,"xaxislabely",1e99)
	var xstep=GRgetinfo(Info,"xstep",1)
	if(xstep<1)xstep=1
	var xtic0=GRgetinfo(Info,"xticfirst",NaN)
	var ydig=GRgetinfo(Info,"ynumdigits",NaN)
	var ylabel=GRgetinfo(Info,"yaxislabel",YvsX[0])
	var ylabelx=GRgetinfo(Info,"yaxislabelx",1e99)
	var ylabely=GRgetinfo(Info,"yaxislabely",1e99)
	var ynumoff=0
	var ytic0=GRgetinfo(Info,"yticfirst",NaN)
	var xrange=0
	var yrange=0

	GR.keepopen=(GR.overwrite || GR.append || maxadd>0 || GR.anchorname.length>0 || GRgetinfo(Info,"keepopen",false))
	GR.saveHTML=GR.keepopen

	docurve=(isNaN(docurve)?!isdata:docurve)
	if(docurve && !isdata && GR.defaultcolor=="")GR.defaultcolor=curvecolor
	if(docurve && !isdata)docurve=dopoints=false
	if(dotrendline && !isdata)dotrendline=false

	if(sinfo.length)top.status=sinfo

	if(GR.debug){
		GRalert("Info:\n"+GRshow(Info,"Info"))
		GRalert((isdata?"Data:\n"+GRshow(Data,"Data"):"Function: "+f_of_x))
		GRalert("GR:\n"+GRshow(GR,"GR","_"))
	}

	var getxrange=(isNaN(GR.xmin) || isNaN(GR.xmax))
	var getyrange=(isNaN(GR.ymin) || isNaN(GR.ymax))

	if(f_of_x.length){
		if(getxrange){
			if(isNaN(GR.xmin))GR.xmin=parseFloat(GRprompt("X minimum?",-10)+"x")
			if(isNaN(GR.xmax))GR.xmax=parseFloat(GRprompt("X maximum?",10)+"x")
		}
		xrange=GR.xmax-GR.xmin
		GR.xfactor=xrange/GR.gwidth*xstep;
		GR.lastfunc=f_of_x
		GR.ptsize=GR.linewidth
		if(typeof(Data)=="string")Data=new Array()
		if(GR.xfactor!=0){
			f_of_x=GRfixpower(f_of_x)
			i=0
			x=GR.xmin
			while (GRinrange(x,GR.xmin,GR.xmax)){
				y=eval(f_of_x)
				if(GR.DataYX[0]!="y")y=eval(GR.DataYX[0])
				if(!GR.doyclip || getyrange || GRinrange(y,GR.ymin,GR.ymax)){
					x0=(GR.DataYX[1]=="x"?x:eval(GR.DataYX[1]))
					if(Math.abs(x0)<Number.MAX_VALUE && Math.abs(y)<Number.MAX_VALUE)Data[i++]=new Array(x0,y)
				}
				x+=GR.xfactor
			}
		}
	}
	if(getxrange){
		x0=GR.xmin
		x1=GR.xmax
		if(isNaN(x0))x0=Number.MAX_VALUE
		if(isNaN(x1))x1=-Number.MAX_VALUE
		for(i=0;i<Data.length;i++){
			x=Data[i][0]
			x0=Math.min(x, x0)
			x1=Math.max(x, x1)
		}
		x=(x1-x0)*GR.datamargin
		if(isNaN(GR.xmin))GR.xmin=x0-(dogridy?0:x)
		if(isNaN(GR.xmax))GR.xmax=x1+x
	}
	xrange=GR.xmax-GR.xmin
	GR.xfactor=GR.gwidth/xrange
	if(getyrange){
		y0=GR.ymin
		y1=GR.ymax
		if(isNaN(y0))y0=Number.MAX_VALUE
		if(isNaN(y1))y1=-Number.MAX_VALUE
		for(i=0;i<Data.length;i++){
			y=Data[i][1]
			y0=Math.min(y, y0)
			y1=Math.max(y, y1)
		}
		y=(y1-y0)*GR.datamargin
		if(isNaN(GR.ymin))GR.ymin=y0-y
		if(isNaN(GR.ymax))GR.ymax=y1+y
	}
	yrange=GR.ymax-GR.ymin
	GR.yfactor=GR.gheight/yrange
	if(GR.xmin>0 && GR.xmax>0 && GR.xmin*100<GR.xmax)GR.xmin=0
	if(GR.xmin<0 && GR.xmax<0 && GR.xmax*100>GR.xmin)GR.xmax=0
	if(GR.ymin>0 && GR.ymax>0 && GR.ymin*100<GR.ymax)GR.ymin=0
	if(GR.ymin<0 && GR.ymax<0 && GR.ymax*100>GR.ymin)GR.ymax=0
	if(GR.debug)GRalert("xmin:"+GR.xmin+"\nymin:"+GR.ymin+"\nxmax:"+GR.xmax+"\nymax:"+GR.ymax)
	if(GR.debug)GRalert("Labels: "+Labels)

	//all information ready--start style block

	//draw header and background, and save info unless appending
	var npts0=GR.npts
	if(GR.overwrite){
		GR.pt0=GR.List[GR.overwrite].pt0
		GR.npts=GR.pt0-1
		GR.thisgraph=GR.overwrite
	}else{
		if(!GR.append)GR.nplot++
		GR.thisgraph=GR.nplot
		doc.writeln("<title>"+wtitle+"</title><style type='text/css'>\n"+GR.defstyle+"\n"+style+"\n")
	}

	if(!GR.append){
		i=GR.thisgraph

		GR.List[i]=new Array()
		GR.List[i].nadd=0

		GR.List[i].pt0=GR.pt0
		GR.List[i].ptdata0=NaN
		GR.List[i].ptdata1=NaN
		GR.List[i].ptadd0=NaN
		GR.List[i].ptadd1=NaN
		GR.List[i].pt1=NaN
		GR.List[i].pttrend=-1

		GRsetgraph(i,true)

		if(bgcolor.length)GRnewstyle(GR.gleft,GR.gtop,GR.gwidth,GR.gheight,bgcolor,"")
		if (GRinrange(yatx,GR.xmin,GR.xmax)){
			GR.yaxisoffset=GRxof(yatx)
			Zeros[0]=true
		}else{
			GR.yaxisoffset=GRxof(GR.xmin)
			yatx=GR.xmin
		}
		if (GRinrange(xaty,GR.ymin,GR.ymax)){
			GR.xaxisoffset=GRyof(xaty)
			Zeros[1]=true
		}else{
			GR.xaxisoffset=GRyof(GR.ymin)
			xaty=GR.ymin
		}

		if(doxaxis){
			GRnewstyle(GR.gleft,GR.xaxisoffset-(GR.histogram==1 && !doyaxis?0:ticwidth/2),GR.gwidth,ticwidth,"blackh","")
			if(majorx=="auto"){
				majorx=GR10(xrange/5)
				while(majorx>0 && majorx<Math.abs(xrange)/10)majorx*=5
				if(minorx=="auto")minorx=majorx/5
				if(isNaN(xtic0)){
					xtic0=(GR.xmin==0?0:GR10(GR.xmin))
					if(xtic0<minorx)xtic0=minorx
					if(GR.xmin<0)xtic0=-xtic0
					if(!GRinrange(GR.xmin,0,GR.xmax))xtic0*=10
					if(xtic0==minorx)xtic0=0
				}
			}
			if(minorx=="auto")minorx=GR10(xrange/5)/5
			if(isNaN(minorx))minorx=-1
			if(isNaN(majorx))majorx=-1
			if(isNaN(xtic0))xtic0=GR.xmin
			var forcex=false
			if(doxticnums && majorx<=0){
				majorx=xrange
				forcex=true
			}
			;(minorx<=0 && majorx>0?minorx=majorx:majorx<=0?majorx=-1:0)
			if(doxtics && minorx>0 && minorx!=majorx){
				GRdotics(xtic0,GR.xmin,GR.xmax,minorx,NaN,
				-ticwidth/2,GR.xaxisoffset,ticwidth,minticlen,forcex,false)
			}
			if(doxtics && majorx>0){
				GRdotics(xtic0,GR.xmin,GR.xmax,minorx,majorx,
					-ticwidth/2,(dogridx?GRyof(GR.ymax):GR.xaxisoffset),
					ticwidth,majticlen+(dogridx?GR.gheight:0),forcex,false,
				doxticnums,xnumoff,GR.xaxisoffset+majticlen+10,xdig,(!doyaxis || GR.xaxisoffset==GR.gtop+GR.gwidth?NaN:yatx))
			}
		}

		if(doyaxis){
			GRnewstyle(GR.yaxisoffset-(GR.histogram==1 && !doxaxis?0:ticwidth/2),GR.gtop,ticwidth,GR.gheight,"blackv","")
			if(majory=="auto"){
				majory=GR10(yrange/5)
				while(majory>0 && majory<Math.abs(yrange)/10)majory*=5
				if(minory=="auto")minory=majory/5
				if(isNaN(ytic0)){
					ytic0=(GR.ymin==0?0:GR10(GR.ymin))
					if(ytic0<minory)ytic0=minory
					if(GR.ymin<0)ytic0=-ytic0
					if(!GRinrange(GR.ymin,0,GR.ymax))ytic0*=10
					if(ytic0==minory)ytic0=0
				}
			}

			if(minory=="auto")minory=GR10(yrange/5)/5
			if(isNaN(minory))minory=-1
			if(isNaN(majory))majory=-1
			if(isNaN(ytic0))ytic0=GR.ymin
			var forcey=false
			if(doyticnums && majory<=0){
				majory=yrange
				forcey=true
			}
			;(minory<=0 && majory>0?minory=majory:majory<=0?majory=-1:0)

			if(GR.debug)GRalert("minorx:"+minorx+"\majorx:"+majorx+"\nxtic0:"+xtic0+"\n"+"minory:"+minory+"\majory:"+majory+"\nytic0:"+ytic0)
			if(doytics && minory>0 && minory!=majory){
				GRdotics(ytic0,GR.ymin,GR.ymax,minory,NaN,
				GR.yaxisoffset-minticlen,-ticwidth/2,minticlen,ticwidth,forcey,true)
			}
			if(doytics && majory>0){
				GRdotics(ytic0,GR.ymin,GR.ymax,minory,majory,
					(dogridy?GRxof(GR.xmin):GR.yaxisoffset)-majticlen,-ticwidth/2,
					majticlen+(dogridy?GR.gwidth:0),ticwidth,forcey,true,
				doyticnums,GR.yaxisoffset-majticlen-3,ynumoff,ydig,(!doxaxis || GR.yaxisoffset==GR.gleft?NaN:xaty))
			}
		}

		if(doxaxis && doyaxis && (!Zeros[0] || !Zeros[1]))GRnewstyle(GR.yaxisoffset-ticwidth*2,GR.xaxisoffset-ticwidth*2,ticwidth*4,ticwidth*4,(bgcolor=="transp"||bgcolor==""?"white":bgcolor),"origin is not on graph")
		if(title.length){
			if(GR.anchorname.length==0 && GR.winwidth>0)title="<table><tr><td width="+GR.winwidth+"px class=title>"+title+"</td></tr></table>"
			GRnewlabel(title,0,0,"black")
			GR.ititlediv=GR.npts
		}
		if(isNaN(xlabelx))xlabelx=GR.gleft+GR.gwidth/2-3*xlabel.length
		if(isNaN(xlabely))xlabely=GR.gtop+GR.gheight+30
		if(isNaN(ylabelx))ylabelx=GR.gleft-50
		if(isNaN(ylabely))ylabely=GR.gtop+GR.gheight/2
		if(xlabelx==1e99)xlabelx=GR.gleft+GR.gwidth+15
		if(xlabely==1e99)xlabely=GRyof(xaty)-10
		if(ylabelx==1e99)ylabelx=GRxof(yatx)-5
		if(ylabely==1e99)ylabely=GR.gtop-25
		if(xlabel.length)GRnewlabel("<b>"+xlabel+"</b>",xlabelx,xlabely,"black class=xlabel")
		if(ylabel.length)GRnewlabel("<b>"+ylabel+"</b>",ylabelx,ylabely,"black class=ylabel")
	}//only if not appending

	GR.List[GR.thisgraph].ptsize=GR.ptsize

	GR.pt0=GR.npts+1

	//draw points
	if(Data.length && !labelsonly && !isNaN(Data[0][0])){
		GR.plotxmin=GRxof(GR.xmin)
		GR.plotxmax=GRxof(GR.xmax)
		GR.plotymin=GRyof(GR.ymin)
		GR.plotymax=GRyof(GR.ymax)

		GR.List[GR.thisgraph].ptdata0=GR.pt0
		var Pts=new Array()
		x0=GRxof(Data[0][0])
		y0=GRyof(Data[0][1])
		x1=GRxof(Data[Data.length>1?1:0][0])
		y1=GRyof(Data[Data.length>1?1:0][1])
		x2=GRxof(Data[Data.length>2?2:0][0])
		y2=GRyof(Data[Data.length>2?2:0][1])
		c=GRdatacolor(Data[0])
		if(docurve)Pts[0]=new Array(x0,y0,c)
		if(!isdata || dopoints)GRnewpt(0,x0,y0,Data,Labels,GR.ptsize,(dopoints || x1-x0>3?GR.ptsize:Math.abs(y1-y0)))
		for (i=1; i<(Data.length-1); i++)
		{
			x2=GRxof(Data[i+1][0])
			y2=GRyof(Data[i+1][1])
			if(docurve)Pts[i]=new Array(x1,y1,GRdatacolor(Data[i]))
			if(!isdata || dopoints)GRnewpt(i,x1,y1,Data,Labels,GR.ptsize,(dopoints || x2-x0>3?GR.ptsize:Math.abs(y2-y0)/2))
			x0=x1
			y0=y1
			x1=x2
			y1=y2
		}
		if(Data.length>i){
			if(!isdata || dopoints)GRnewpt(i,x1,y1,Data,Labels,GR.ptsize,(dopoints || x1-x0>3?GR.ptsize:Math.abs(y1-y0)))
			if(docurve)Pts[i]=new Array(x1,y1,GRdatacolor(Data[i]))
		}
		if(docurve){
			n0=Pts.length-1
			P=new Array()
			for (i=n0-1;i>=0;i--){
				x0=Pts[i][0]
				x1=Pts[i+1][0]
				c=GRdatacolor(Data[i])
				if(x1>x0+1){
					y0=Pts[i+1][1]
					P=GRspline(Pts,i)
					for(var j=x1-1;j>x0;j--){
						y1=GRnewdata(Pts,j,P)
						Pts[Pts.length-1][2]=c
						Pts[Pts.length-1][3]=Math.abs(y1-y0)
						y0=y1
					}
				}
				if(curvecolor!="" && x1<x0-1){
					y0=Pts[i][1]
					P=GRspline(Pts,i)
					for(var j=x0-1;j>=x1;j--){
						y1=GRnewdata(Pts,j,P)
						Pts[Pts.length-1][2]=c
						Pts[Pts.length-1][3]=Math.abs(y1-y0)
						y0=y1
					}
				}
			}
			for(i=Pts.length-1;i>n0;i--)GRnewpt(-1,Pts[i][0],Pts[i][1],"","",GR.linewidth,Pts[i][3],(curvecolor==""?Pts[i][2]:curvecolor))
			if(isdata && !dopoints){
				for(i=0;i<n0;i++){
					x0=Pts[i][0]
					x1=Pts[i+1][0]
					if(x1==x0 || x1==x0+1 || x1==x0-1 && curvecolor!=""){
						y0=Pts[i][1]
						y1=Pts[i+1][1]
						GRnewpt(-1,x0,(y0+y1)/2,"","",GR.linewidth,Math.abs(y1-y0),(curvecolor==""?Pts[i][2]:curvecolor))
					}
				}
			}
		}
		if(dotrendline){
			GR.L=new Array()
			GRgetleastsquares(Data,GR.L)
			if(quicktrend){
				A=[GR.xmax,GR.xmin,(GR.ymax-GR.L.b)/GR.L.m,(GR.ymin-GR.L.b)/GR.L.m].sort(GRsort)
				x1=GRxof(A[1])
				x2=GRxof(A[2])
				y1=GRyof(A[1]*GR.L.m+GR.L.b)
				y2=GRyof(A[2]*GR.L.m+GR.L.b)
				GR.List[GR.thisgraph].pttrend=GR.pt.length
				GRnewpt(-2,(x2+x1)/2,(y2+y1)/2+1,"","",Math.abs(x2-x1)+1,Math.abs(y2-y1)+1
				,(x2==x1?"blackv":y2==y1?"blackh":(x2-x1)*(y2-y1)>0?"line1":"line2"))
			}else{
				var xf=1/GR.xfactor*xstep
				x=GR.xmin
				while (GRinrange(x,GR.xmin,GR,xmax)){
					GRnewpt(-2,GRxof(x),GRyof(GR.L.m*x+GR.L.b),"","",GR.linewidth,GR.linewidth,trendcolor)
					x+=xf
				}
			}
			if(dotrendeqn && !isNaN(trendx)&&!isNaN(trendy)){
				s="<b>"+YvsX[0]+" = ("+GRroundoff(GR.L.m,trenddig)+")("+YvsX[1]+") + ("+GRroundoff(GR.L.b,trenddig)+")<br>r<sup>2</sup> = "+GRroundoff(GR.L.r2,4)+"</b>"
				GRnewlabel(s.replace(/\+ \-/,"- ").replace(/-/g,"&#150;"),GR.gleft+trendx,GR.gtop+trendy,"black class=trendeqn")
			}
		}
		GR.List[GR.thisgraph].ptdata1=GR.npts
	}
	if(isdata && labelsonly){
		for(i=0;i<Data.length;i++){
			GR.colorlast=GRdatacolor(Data[i])
			if(Labels.length>i && Labels[i].length>0)GRnewlabel(Labels[i],GRxof(Data[i][0]),GRyof(Data[i][1]),GR.colorlast+" class=ptlabel")
		}
	}

	if(key!=""){
		P=(key.indexOf("|")>=0?key.split("|"):key.split(";"))
		for(i=0;i<P.length;i++){if(P[i].length){
				P[i]=P[i].split("=")
				s=GR.spt.replace(/_dir/,GR.imagedir).replace(/_color/,P[i][0]).replace(/_width/,20).replace(/_height/,4).replace(/_text/," <b>"+P[i][1]+"</b>")
				GRnewlabel(s,GR.gleft+GR.gwidth+keyx,GR.gtop+keyy,"black class=keylabel")
				keyy+=20
		}}
	}
	if(!GR.append){
		if(maxadd){
			GR.List[GR.thisgraph].ptadd0=GR.npts+1
			GR.List[GR.thisgraph].ptadd1=GR.npts+maxadd
		}
		for(var i=1; i<=maxadd;i++)GRnewstyle(0,0,0)
	}
	if(GR.win==null || GR.win.closed)return 0
	if(GR.overwrite==0){
		doc.writeln("</style>\n<body "+sbody+" class=body>")
		i=GR.List[GR.thisgraph].pttrend
		if(i>0)GRgraphpoint(i,GR.Color[i],(doptlabels && GR.Label.length>i?GR.Label[i]:""))
		for(i=0;i<GR.Plot_.length;i++)doc.writeln(GRnewdiv(GR.Plot_[i]))
	}
	GR.Plot_=null
	if(!GR.append && GR.overwrite==0){for(var i=1; i<=maxadd;i++)GRgraphpoint(-i)}

	for (var i=0; i<GR.pt.length;i++){
		if(i!=GR.List[GR.thisgraph].pttrend)GRgraphpoint(i,GR.Color[i],(doptlabels && GR.Label.length>i?GR.Label[i]:""))
	}

	if(GR.overwrite==0)doc.writeln("</body>")
	if(GR.temp.length)GRdebugwrite(GR.temp)
	GR.temp=""
	GR.pt=null
	GR.Color=null
	GR.Label=null
	if(salert.length)GRalert(salert)
	if(GR.debug)GRalert("GR at end:\n"+GRshow(GR,"GR","_"))
	GR.List[GR.thisgraph].pt1=GR.npts
	GR.List[GR.thisgraph].title=title
	GR.List[GR.thisgraph].style=style
	if(GR.debug)GRalert(GRshow(GR.List[GR.thisgraph],"GR.List["+GR.thisgraph+"]"))
	i=GR.thisgraph
	if(GR.overwrite)GR.npts=npts0
	if(whendone.length)eval(whendone)
	GRcleargraph(whendone.length==0 && !GR.keepopen)
	return i
}

function GRinit(){
	GRNONE=0
	GRUSER=1
	GRANCHOR=2
	GRDOC=3
	GR.win=window
	GR.doc=document
	var s=GR.imagedir
	GR=new Array()
	GR.imagedir=s
	GR.resizetoggle=true
	GR.init=false
	GR.npts=0
	GR.nplot=0
	GR.thisgraph=NaN
	GR.List=new Array()
	GR.S_=new Array()
	GR.X_=new Array()
	GR.Y_=new Array()
	GR.temp=""
	GRcleargraph(true)
}

function GRopengraphframe(frame){
	GRsetgraphwindow(frame)
	GR.doc.open()
	GR.winwidth=0
	return GR.doc
}

function GRopengraphwindow(w,h,t,l){

	if(arguments.length<4||!l)l=50
	if(arguments.length<3||!t)t=50
	if(arguments.length<2||!h)h=300
	if(arguments.length<1||!w)w=300
	var opt=GR.winoptions.replace(/_w/,w).replace(/_h/,h).replace(/_t/,t).replace(/_l/,l)
	GR.win=GRgetnewwindow("",opt)
	GR.winwidth=w
	GR.winheight=h
	GR.wintop=t
	GR.winleft=l
	GR.doc=GR.win.document
	GR.doc.open()
	return GR.win
}

function GRreplot(n,xoff,yoff,doc2,w,h,t,l){
	var newwin=null
	var grwin=GR.win
	var grdoc=GR.doc

	if(arguments.length<8)l=GR.winleft
	if(arguments.length<7)t=GR.wintop
	if(arguments.length<6)h=GR.winheight
	if(arguments.length<5)w=GR.winwidth
	if(arguments.length<4 || doc2==null){
		newwin=GRopengraphwindow(w,h,t,l)
		doc2=GR.doc
	}
	if(arguments.length<3)yoff=0
	if(arguments.length<2)xoff=0
	if(arguments.length<1)n=GR.List.length-1

	if(n<1||n>=GR.List.length)return 0

	var i0=GR.List[n].pt0
	var i1=GR.List[n].pt1
	var doc1=GR.List[n].doc
	GR.List[n].anchorx+=xoff
	GR.List[n].anchory+=yoff
	GR.anchorx=GR.List[n].anchorx
	GR.anchory=GR.List[n].anchory
	if(doc1==doc2){
		np=0
		i=GR.List[n].pttrend
		if(i>=0){
			var D=GRdivinfo(i,doc1)
			if(D.innerHTML!=null && D.innerHTML.length){
				np++
				GRdivwrite(i,D.innerHTML,D.offsetLeft+xoff,D.offsetTop+yoff,GRDOC,n)
			}
		}
		for(var i=i0;i<=i1;i++){
			var D=GRdivinfo(i,doc1)
			if(i!=GR.List[n].pttrend && D.innerHTML!=null && D.innerHTML.length){
				np++
				GRdivwrite(i,D.innerHTML,D.offsetLeft+xoff,D.offsetTop+yoff,GRDOC,n)
			}
		}
		return GR.List[n].anchorname+" np:" + np+"\n xoff,yoff:"+xoff+ " " +yoff+"\n"+GRshow(D,"D")
	}
	doc2.writeln("<style type='text/css'>\n"+GR.defstyle+GR.List[n].style)
	for(var i=i0;i<=i1;i++){
		var D=GRdivinfo(i,doc1)
		if(D.innerHTML!=null)doc2.writeln("#G"+i+" {position:absolute;top:"+(D.offsetTop+yoff)+";left:"+(D.offsetLeft+xoff)+"}")
	}
	doc2.writeln("</style><body>")

	//must write trend line FIRST

	i=GR.List[n].pttrend
	if(i>=0){
		var D=GRdivinfo(i,doc1)
		if(D.innerHTML!=null)doc2.writeln("<div id=G"+i+">"+D.innerHTML+"</div>")
	}
	for(var i=i0;i<=i1;i++){
		var D=GRdivinfo(i,doc1)
		if(i!=GR.List[n].pttrend && D.innerHTML!=null)doc2.writeln("<div id=G"+i+">"+D.innerHTML+"</div>")
	}

	doc2.writeln("</body>")
	if(newwin!=null){
		GRclosegraphdocument(newwin.document)
		if(grwin==window){
			GR.win=grwin
			GR.doc=grdoc
		}else{
			GR.List[n].win=GR.win
			grwin.close()
		}
	}
	return newwin
}

function GRsetgraphwindow(w){
	if(arguments.length<1)w=window
	GR.win=w
	GR.doc=w.document
	GR.winwidth=0
	return GR.doc
}

//--secondary interface

function GRalert(){
	var msg="Press Enter to close\n\n"
	for(var i=0;i<arguments.length;i++)msg+=arguments[i]+"\n"
	;(GR.win==null || GR.win.closed?alert(msg):GR.win.alert(msg))
}

function GRdebugwrite(){
	var w=GRgetnewwindow("","menubar,scrollbars,width=600,height=400,left=50,top=30")
	doc=w.document.open()
	var msg=""
	for(var i=0;i<arguments.length;i++)msg+=arguments[i]+"\n"
	doc.writeln("<pre>"+msg+"</pre>")
	doc.close()
}

function GRdiv(i,doc){return (doc==null?null:GR.isnn4?doc.layers["G"+i]:GR.isnn6?doc.getElementById("G"+i):doc.all["G"+i])}

function GRdivinfo(i,doc){
	var D=new Array()
	var d=GRdiv(i,doc)
	if(GR.isnn4){
		D.innerHTML=GR.S_[i]
		D.offsetLeft=GR.X_[i]
		D.offsetTop=GR.Y_[i]
		return D
	}else{
		if(d==null)return D
		return d
	}
}
function GRdivmove(i,x,y,xytype,ngraph){
	if(GR.win==null || GR.win.closed)return null

	if(arguments.length<5)ngraph=GR.thisgraph
	if(arguments.length<4)xytype=GRUSER
	if(arguments.length<3)return null

	var d=GRdiv(i,GR.List[ngraph].doc)

	if(d==null)return null
	GRsetgraph(ngraph)
	if(xytype==GRUSER){
		GR.xlast=x
		GR.ylast=y
		x=GRxof(x)-GR.ptsize/2
		y=GRyof(y)-GR.ptsize/2
	}

	if(xytype!=GRDOC){
		x+=GR.anchorx
		y+=GR.anchory
	}
	if(GR.isnn4){
		d.left=x
		d.top=y
	}else{
		d.style.left=x//*0+i*5-50
		d.style.top=y
	}
	GR.X_[i]=x
	GR.Y_[i]=y
	;(GR.isnn4?d.visibility="show":d.style.visibility="visible")
	return d
}

function GRdivshow(i,TF,ngraph){
	if(GR.win==null || GR.win.closed)return
	if(arguments.length<3)ngraph=GR.thisgraph
	if(arguments.length<2)TF=true
	var d=GRdiv(i,GR.List[ngraph].doc)
	if(d==null)return
	;(GR.isnn4?d.visibility=(TF?"show":"hide"):d.style.visibility=(TF?"visible":"hidden"))
}

function GRdivwrite(i,s,x,y,xytype,ngraph){
	if(GR.win==null || GR.win.closed)return null
	if(arguments.length<6)ngraph=GR.thisgraph
	if(arguments.length<5)xytype=GRUSER
	if(arguments.length<2)return null
	var d=GRdiv(i,GR.List[ngraph].doc)
	if(d==null)return null
	if(GR.isnn4){
		d.document.open()
		d.document.write(s)
		d.document.close()
	}else{
		d.innerHTML=s
	}
	if(GR.saveHTML)GR.S_[i]=s
	if(arguments.length>3 && xytype!=0)return GRdivmove(i,x,y,xytype,ngraph)
	;(GR.isnn4?d.visibility="show":d.style.visibility="visible")
	return d
}

function GRfixpower(s,format){
	if(arguments.length<2)format="Math.pow(%1,%2)"
	var ipt1=0
	var ipt2=0
	var i=s.indexOf("^")
	var isneg=0
	while(i>0){
		isneg=(s.charAt(i+1)=="-")
		ipt1=GRfindparen(s,i-1,-1)
		ipt2=GRfindparen(s,i+(isneg?2:1),1)
		s=s.substring(0,ipt1)+format.replace(/%1/,s.substring(ipt1,i)).replace(/%2/,s.substring(i+1,ipt2+1))+s.substring(ipt2+1,s.length)
		i=s.indexOf("^")
	}
	return s
}

function GRgetleastsquares(Data,L){
	L.m=null
	for(var i=0;i<Data.length;i++)GRLSQ(L,Data[i][0],Data[i][1])
	GRLSQ(L)
	for(var i=0;i<Data.length;i++)GRLSR(L,Data[i][0],Data[i][1])
	GRLSR(L)
	return 1
}

function GRgetoffset(aname,doc){
	var e=aname
	if(arguments.length<2)doc=GR.doc
	D=new Array()
	if(GR.isnn4){
		if(doc[aname]==null)return D
		D.left=doc[aname].x
		D.top=doc[aname].y
	}else{
		e=(GR.isnn6?doc.getElementById(aname):doc.all[aname])

		if(e==null && GR.isnn6)e=doc[aname]
		if(e==null && GR.isnn6)e=doc.anchors[aname]
		if(e==null && GR.isnn6)e=doc.images[aname]
		if(e==null)return D
		D.left=e.offsetLeft
		D.top=e.offsetTop
		while(e.offsetParent!=null){
			e=e.offsetParent
			D.left+=e.offsetLeft
			D.top+=e.offsetTop
//alert(D.left)
		}
	}
	return D
}

function GRgetnewwindow(s,opt){
	var sm=""+Math.random()
	sm=sm.substring(3,10)
	return open(s,"GR_"+sm,opt)
}

function GRgraph(x,y){
	for(var i=GR.List.length-1;i>0;i--){
		if(GR.List[i].win==GR.win && GRinrange(x-GR.List[i].anchorx-GR.List[i].gleft,-GR.List[i].gwidth*GR.datamargin,GR.List[i].gwidth*(1+GR.datamargin)) && GRinrange(y-GR.List[i].anchory-GR.List[i].gtop,-GR.List[i].gheight*GR.datamargin,GR.List[i].gheight*(1+GR.datamargin)))return i
	}
	return 0
}

function GRinitdivs(){
	GR.isnn4=(document.layers?true:false)
	GR.isie4=(document.all?true:false)
	GR.isnn6=(!GR.isie4 && document.getElementById?true:false)
//	GR.isnn6=(document.getElementById?true:false)
	if(!GR.isnn4 && !GR.isie4 && !GR.isnn6){if(!GR.init)alert("This page will work properly only with browsers capable of supporting layers.");GR.init=true;return false}
	return true
}

function GRmouseevent(e,x,y,scmd){
if(!GR.mouseon)return
//return //for debugging
	//note: problems here if multiple graph windows
	var D=new Array()
	var isnn=(GR.isnn4||GR.isnn6)
	if(!isnn)e=GR.win.event
	if(scmd==null){
		scmd="GR.on"+e.type
		scmd=eval(scmd)
	}
	if(x==null)x=(isnn?e.pageX:e.clientX+GR.doc.body.scrollLeft-2)
	if(y==null)y=(isnn?e.pageY:e.clientY+GR.doc.body.scrollTop-2)
	var n=GRgraph(x,y)
	if(n==0)return
	D.ngraph=n
	D.button=(isnn?e.which:e.button)
	D.docx=x
	D.docy=y

	D.anchorx=D.docx-GR.List[n].anchorx
	D.anchory=D.docy-GR.List[n].anchory
	D.anchorname=GR.List[n].anchorname
	D.userx=(D.anchorx-GR.List[n].gleft)/GR.List[n].gwidth*(GR.List[n].xmax-GR.List[n].xmin)+GR.List[n].xmin
	D.usery=(D.anchory-GR.List[n].gtop)/GR.List[n].gheight*(GR.List[n].ymin-GR.List[n].ymax)+GR.List[n].ymax
	if(GR.mousetest){ //something like this for testing
		GRdebugwrite(scmd+"\n"+GRshow(D,"D")+"\nNote: the \"e\" object would be different using "+(isnn?"Explorer":"Navigator")+".\n\n"+GRshow(e,"e"))
		GR.mousetest=false
	}

	if(scmd==null || scmd==true){
		top.status=scmd + " " + D.userx+" "+D.usery
	}else{
		eval(scmd+"(e,D)")
	}
	return
}

function GRprompt(q,a){return(GR.win==null || GR.win.closed?prompt(q,a):GR.win.prompt(q,a))}

function GRrect(x1,y1,x2,y2,c,xytype,ngraph){
	//x1,y1 upper left, x2,y2 lower right
	if(ngraph==null)ngraph=GR.thisgraph
	if(xytype==null)xytype=GRUSER
	if(xytype==GRUSER){
		GRsetgraph(ngraph)
		x1=GRxof(x1)
		x2=GRxof(x2)
		y1=GRyof(y1)
		y2=GRyof(y2)
	}
	var w=(x2-x1)
	var h=(y2-y1)
	if(w<=0 || h<=0)return ""
	if(c==null)c="black"
	return GR.spt.replace(/_dir/,GR.imagedir).replace(/_color/,c).replace(/_width/,w).replace(/_height/,h).replace(/_text/,"")
}

function GRresize(){
	GR.resizetoggle=!GR.resizetoggle
	if(!GR.resizetoggle && !GR.isnn4)return 1
	for(var i=1;i<GR.List.length;i++){

		if(GR.List[i].anchorname.length){
			var D=GRgetoffset(GR.List[i].anchorname,GR.List[i].doc)
			GRreplot(i,D.left-GR.List[i].anchorx,D.top-GR.List[i].anchory, GR.List[i].doc)
		}
	}
	return 1
}

function GRroundoff(x,ndec){
	var s=""
	if(isNaN(x) || x==0)return "0"
	if(arguments.length<2)ndec=GRndig(x)
	if(ndec==0)return ""+Math.round(x)
	var neg=(x<0?"-":"")
	var xs=Math.abs(x)+""
	var i=(xs.indexOf("E") & xs.indexOf("e"))
	if(ndec<0 && i<0){
		xs=GRroundoff(Math.abs(x)*1e-100,-ndec)
		i=(xs.indexOf("E") & xs.indexOf("e"))
		var e=parseInt(xs.substring(i+1,xs.length))+100
		s=neg+xs.substring(0,i)+(e!=0?"E"+e:"")
		return s
	}
	if (i>0){
		s=GRroundoff(xs.substring(0,i),Math.abs(ndec)-1)+"E"+xs.substring(i+1,xs.length)
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

function GRsetgraph(ngraph,tolist){
	if(GR.thisgraph==ngraph && !tolist)return
	if(tolist==null)tolist=false
	GRcopy(	(tolist?GR:GR.List[ngraph]),(tolist?GR.List[ngraph]:GR),
		"win","doc","xmin","xmax","ymin","ymax","xfactor","yfactor",
		"gleft","gtop","gwidth","gheight","histogram",
		"linewidth","ptsize","pttrend",
	"anchorx","anchory","anchorname")
	//GRdebugwrite("setting graph from " + GR.thisgraph + " to " + ngraph,GRshow(GR.List[ngraph],"GR.List["+ngraph+"]"),GRshow(GR,"GR"))
	GR.thisgraph=ngraph
}

function GRshow(obj,objName,signore,sonly){
	if(objName==null)objName="obj"
	var s = ""
	for(var i in obj){if(!isNaN(i) || i.indexOf(signore)<0 && (sonly==null || i.indexOf(sonly)>=0))s+=objName+"."+i+" = "+obj[i]+"\n"}
	return s
}

function GRxof(x){return Math.round(GR.gleft+(x-GR.xmin)*GR.xfactor)}

function GRyof(y){return Math.round(GR.gtop+GR.gheight-(y-GR.ymin)*GR.yfactor)}

//--internal functions---

function GRcleargraph(setdefaults){
	GR.pt=new Array()
	GR.Color=new Array()
	GR.Label=new Array()
	GR.Plot_=new Array()
	GR.pt0=GR.npts+1
	GR.pttrend=-1

	if(!setdefaults)return

	GR.DataYX=new Array("y","x")
	GR.append=false

	GR.gwidth=200
	GR.gheight=200
	GR.gtop=50
	GR.gleft=50

	GR.colorlast=GR.defaultcolor
	GR.datatransform="y vs. x"
	GR.defaultcolor="blue"
	GR.defstyle=".keylabel {font-size:10pt;font-weight:bold;color:black}\n"
	+".ptlabel {font-size:10pt;font-weight:normal;font-style:italic}\n"
	+".trendeqn {font-size:10pt;font-weight:normal;color:black}\n"
	+".xaxisnum {font-size:10pt;font-weight:normal;color:black}\n"
	+".xlabel {font-size:10pt;font-weight:normal;color:black}\n"
	+".yaxisnum {font-size:10pt;font-weight:normal;color:black}\n"
	+".ylabel {font-size:10pt;font-weight:normal;color:black}\n"
	+".tline {background-color:transparent}\n"
	+".title {font-size:13pt;font-weight:bold;color:black}\n"
	//+".body {font-size:10pt;color:black}\n"
	GR.debug=false
	GR.keepopen=false
	GR.lastdata="-1,-1,0,2,2,1"
	GR.lastfunc="10*sin(x)*x^2"
	GR.linewidth=1
	GR.ptsize=2
	GR.saveHTML=false
	GR.spt="<img src=_dir/_color.gif width=_width height=_height _alt>_text"
	GR.sdiv="<div id=_id>_text</div>"
	GR.sdivclass="<div id=_id xinfo=_class>_text</div>"
	GR.slab="<font color=_color>_text</font>"
	GR.justwidth=50
	GR.slabt="<table border=0 cellpadding=0 cellspacing=0><tr><td _color>_text</td></tr></table>"
	GR.textlast=""
	GR.xfactor=1
	GR.xlast=0
	GR.xmax=NaN
	GR.xmin=NaN
	GR.yfactor=1
	GR.ylast=0
	GR.ymax=NaN
	GR.ymin=NaN
	GR.winoptions="menubar=yes,width=_w,height=_h,left=_l,top=_t"
}

function GRcopy(Afrom,Ato,list){
	for(var i=2;i<arguments.length;i++)Ato[arguments[i]]=Afrom[arguments[i]]
}

function GRdatacolor(D){
	return(D.length>2 && D[2].length?D[2]:GR.defaultcolor.length?GR.defaultcolor:GR.colorlast)
}

function GRdotics(tic0,tmin,tmax,minort,majort,stylex,styley,plotx,ploty,force,isy,doticnums,numx,numy,ndig,nignore){
	var t=tic0
	var st=""
	var noff=0
	var inrange=0
	var isok=false
	var isminor=isNaN(majort)
	var tdir=(tmax>tmin?1:-1)
	var tstep=tdir*(!force || isminor?minort:majort)
	var xt=0
	var xtlast=-9999
	tmax+=tdir*minort/20
	tmin-=tdir*minort/20
	if(!isminor && isNaN(ndig))ndig=GRndig(majort)
	while(GRinrange(t,tic0,tmax)){
		inrange=GRinrange(t,tmin,tmax)
		if((isminor && majort>0 && !force || !isminor) && (force || inrange && Math.abs(t/majort-Math.round(t/majort))<0.001)){
			isok=!isminor
		}else{
			isok=(isminor && (force || inrange && Math.abs(t/minort-Math.round(t/minort))<0.001))
		}
		if(isok){
			if(doticnums){
				if(Math.abs(t/(tmax-tmin))<0.01)t=0
				st=GRroundoff(t,ndig)
			}
			if(isy){
				GRnewstyle(stylex,GRyof(t)+styley,plotx,ploty,"blackh","")
				if(doticnums && parseFloat(st)!=nignore)GRnewlabel(st,numx,GRyof(t)+numy,"class=yaxisnum align=right")
			}else{
				GRnewstyle(GRxof(t)+stylex,styley,plotx,ploty,"blackv","")
				xt=GRxof(t)+numx
				if(doticnums){
					isok=((xt-xtlast)>st.length*6)
					if(isok)xtlast=xt
				}
				if(isok && doticnums && parseFloat(st)!=nignore)GRnewlabel(st,xt,numy,"class=xaxisnum align=center")
			}
		}
		t+=tstep
	}
}

function GRfindparen(s,ipt0,idirect)
{
	var i=0
	var ipt=ipt0
	while (ipt<s.length && ipt>=0)
	{
		i+=(s.charAt(ipt)=="("?1:s.charAt(ipt)==")"?-1:0)
		if(i==0)return ipt
		ipt+=idirect
	}
	return ipt
}

function GRgetdata(sdata,Data,Labels){
	var dolabels=(Labels.length==0)
	var D=new Array()
	var P=new Array()
	var n=0
	var x=0
	var y=0
	var xt=0
	var yt=0
	sdata=sdata.replace(/,\[/g,"").replace(/\[/g,"").replace(/\]/g,"\n")
	sdata=sdata.replace(/\r/g,"\n").replace(/\n\n/g,"\n")
	if(sdata.indexOf("\n")>=0){ //x,y pairs from a textbox, probably
		D=sdata.split("\n")
		for(var i=0;i<D.length;i++){
			P=D[i].split(",")
			x=parseFloat(P[0]+"x")
			y=parseFloat(P[1]+"x")
			if(!isNaN(x) && !isNaN(y)){
				xt=(GR.DataYX[1]=="x"?x:eval(GR.DataYX[1]))
				yt=(GR.DataYX[0]=="y"?y:eval(GR.DataYX[0]))
				if(Math.abs(xt)<Number.MAX_VALUE && Math.abs(yt)<Number.MAX_VALUE){
					Data[n]=new Array(xt,yt)
					if(P.length>2)Data[n][2]=P[2]
					if(dolabels)Labels[n]=(P.length>3?P[3]:x+" , "+y)
					n++
				}
			}
		}
	}else{
		D=sdata.split(",")
		for(var i=0;i<D.length;i+=2){
			x=parseFloat(D[i]+"x")
			y=parseFloat(D[i+1]+"x")
			if(!isNaN(x) && !isNaN(y)){
				xt=(GR.DataYX[1]=="x"?x:eval(GR.DataYX[1]))
				yt=(GR.DataYX[0]=="y"?y:eval(GR.DataYX[0]))
				if(Math.abs(xt)<Number.MAX_VALUE && Math.abs(yt)<Number.MAX_VALUE){
					Data[n]=new Array(xt,yt)
					if(dolabels)Labels[n]=x+" , "+y
					n++
				}
			}
		}
	}
	if(GR.debug)GRalert(GRshow(Data,"Data"))
	return(n>0)
}

function GRgetinfo(A,skey,def){return (A[skey]==null?def:A[skey])}

function GRgraphpoint(i,scolor,slabel){
	if(GR.win==null || GR.win.closed)return
	var n=(i<0?GR.List[GR.thisgraph].ptadd0-1-i:GR.pt0+i)
	var s=(i<0?"<div id=G"+n+"></div>":GRptof((GR.overwrite?0:n),GR.pt[i][0],Math.ceil(GR.pt[i][1]),scolor,slabel))
	if(GR.overwrite){
		(s!=GR.S_[n]?GRdivwrite(n,s,GR.X_[n],GR.Y_[n],GRDOC):GRdivmove(n,GR.X_[n],GR.Y_[n],GRDOC))
	}else{
		GR.doc.writeln(s)
	}
}

function GRLSQ(L,x,y){//least squares fit
	if(L.m==null){
		L.x=L.y=L.xx=L.yy=L.xy=L.n=0
		L.x_=L.y_=L.m=L.b=NaN
		L.r2=null
	}
	if(arguments.length==3){
		L.x+=x
		L.y+=y
		L.xx+=x*x
		L.yy+=y*y
		L.xy+=x*y
		L.n++
		return 1
	}
	var d=0
	d=L.n*L.xx-L.x*L.x
	if(d==0)return 0
	L.b=(L.xx*L.y-L.x*L.xy)/d
	L.m=(L.n*L.xy-L.x*L.y)/d
	L.x_=L.x/L.n
	L.y_=L.y/L.n
	return 1
}

function GRLSR(L,x,y){//returns coef of linear coor, r
	if(L.r2==null){
		L.x=L.y=L.xy=0
		L.r2=NaN
	}
	if(arguments.length==3){
		var dx=x-L.x_
		var dy=y-L.y_
		L.x+=dx*dx
		L.y+=dy*dy
		L.xy+=dx*dy
		return 1
	}
	L.r2=(L.x==0 || L.y==0?1:L.xy*L.xy/(L.x*L.y))
	return L.r2
}

function GRndig(n){
	var x=Math.abs(n)
	return(x>=9999||x<0.01?-2:x>=10?0:x>=1?1:x>=.1?2:3)
}

function GRnewdata(A,x,P){
	var y=P[0]+x*(P[1]+x*(P[2]+x*P[3]))
	A[A.length]=new Array(x,y)
	return y
}

function GRnewlabel(s,x,y,c){
	var ialign=(c.indexOf(" align=")<0?0:c.indexOf("=left")>=0?1:c.indexOf("=center")>=0?2:c.indexOf("=right")>=0?3:0)
	GRnewstyle(x-(ialign==2?GR.justwidth/2:ialign==3?GR.justwidth:0),y-(ialign?8:0),1)
	GR.Plot_[GR.Plot_.length]=[-GR.npts,s,c+(ialign?" width="+GR.justwidth:"")]
}

function GRnewpt(i,x,y,Data,Labels,width,height,c){
	c=(i<0?(c==null?GR.colorlast:c):GRdatacolor(Data[i]))
	if(GR.doxclip && c!="transp" && !GRinrange(x,GR.plotxmin,GR.plotxmax))return
	if(GR.doyclip && c!="transp" && !GRinrange(y,GR.plotymin,GR.plotymax))return
	var n=GR.pt.length
	GR.Label[n]=(i<0?"":i<Labels.length?Labels[i]:Data[i].length>3?Data[i][3]:"")
	GR.colorlast=GR.Color[n]=c
	if(height==0)height=1
	if(width==0)width=1
	if(i>=0 && GR.histogram && GR.colorlast!="transp"){
		if(GR.histogram==1){
			height=Math.abs(y-GR.xaxisoffset)
			y=Math.min(y,GR.xaxisoffset)
			x-=width/2
		}else{
			width=Math.abs(x-GR.yaxisoffset)
			x=Math.min(x,GR.yaxisoffset)
			y-=height/2
		}
	}else{
		x-=width/2
		y-=height/2
	}
	GR.pt[n]=new Array(width,height)
	GRnewstyle(x,y,1)
}

function GRnewstyle(left,top,width,height,color,label){
	if(GR.win==null || GR.win.closed)return
	left=GR.anchorx+Math.round(left)
	top=GR.anchory+Math.round(top)
	GR.npts++
	if(GR.overwrite==0)GR.doc.writeln("#G"+GR.npts+" {position:absolute;"+(width>0?"left:"+left+";top:"+top:"visibility:hidden")+"}")
	GR.X_[GR.npts]=left
	GR.Y_[GR.npts]=top
	if(arguments.length<=3 || GR.overwrite)return
	GR.Plot_[GR.Plot_.length]=[GR.npts,width,height,color,label]
}

function GRlabelof(i,s,c){
	var t=(c.indexOf(" align=")>=0?GR.slabt:GR.slab)
	t=t.replace(/_text/,s).replace(/_color/,c)
	if(GR.saveHTML)GR.S_[i]=t
	return GR.sdiv.replace(/_id/,"G"+i).replace(/_text/,t)
}

function GRnewdiv(P){
	if(P[0]>=0)return GRptof(P[0],P[1],P[2],P[3],P[4])
	return GRlabelof(-P[0],P[1],P[2])
}

function GRptof(i,w,h,c,a){
	a+=""
	var j=a.indexOf("|")
	var txt=""
	if(j>=0){txt=a.substring(j+1,a.length);a=a.substring(0,j)}
	var s=GR.spt.replace(/_dir/,GR.imagedir).replace(/_color/,c).replace(/_width/,w).replace(/_height/,h)
	s=s.replace(/_alt/,(a.length?"alt=\""+a+"\"":"")+(txt.length?" align=top":"")).replace(/_text/,txt)
	if(i && GR.saveHTML)GR.S_[i]=s
	if(!i)return s
	if(c.indexOf(" class=")<0) return GR.sdiv.replace(/_id/,"G"+i).replace(/_text/,s)
	return GR.sdivclass.replace(/_id/,"G"+i).replace(/_class/,c).replace(/_text/,s)
}

function GRsort(a,b){return a-b}

function GRspline(Data,i){
	//f(x)=P[0]+P[1]x+P[2]x^2+P[3]x^3
	//matches approx slopes at endpoints
	var P=new Array(NaN,0,0,0)
	if(i<0 || i>=Data.length)return P
	var x1=Data[i][0]
	var x2=Data[i+1][0]
	if(x1==x2)return P
	var y1=Data[i][1]
	var y2=Data[i+1][1]
	var dy=y2-y1
	var dx=x2-x1
	var s12=dy/dx
	if(Data.length==2){
		P[0]=y1-s12*x1
		P[1]=s12
		return P
	}
	var x0=(i>0?Data[i-1][0]:x2)
	var y0=(i>0?Data[i-1][1]:y2)
	var x3=(i+2<Data.length?Data[i+2][0]:x1)
	var y3=(i+2<Data.length?Data[i+2][1]:y1)
	var s=x1+x2
	var s1=(y2-y0)/(x2-x0)
	var s2=(y3-y1)/(x3-x1)
	if(isNaN(s1))s1=(s12+(s2-s12)/10)
	if(isNaN(s2))s2=(s12+(s1-s12)/10)
	var ds=(s2-s1)
	var dsdx=ds/dx
	P[3]=(s1+s2-s12-s12)/(dx*dx)
	P[2]=(dsdx-3*s*P[3])/2
	P[1]=s12-s*P[2]-(s*s-x1*x2)*P[3]
	P[0]=y1-(x1*(P[1]+x1*(P[2]+x1*P[3])))
	return P
}

function GR10(x){with(Math){return pow(10,floor(LOG10E*log(abs(x))))}}

//--initialize now

function GRinrange(x,a,b){return x>=a && x<=b || x>=b && x<=a}

GRinit()
