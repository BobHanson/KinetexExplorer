
xlimits="from 0 to 100 step 10"
ylimits="from 0 to 1 step .1"

function setservers(){
 islocal=(document.location.href.toUpperCase().indexOf("FILE://")==0)
 isstolaf=false//(document.location.href.indexOf("stolaf.edu")>=0)
 if(isstolaf){
  dataserver="http://ptm237.chem.stolaf.edu/execute/windata"
  gnuserver="http://www.stolaf.edu/cgi-bin/gnuplot.pl"
  testserver="http://www.stolaf.edu/cgi-bin/test.pl"
 }else{
  dataserver="http://127.0.0.1/execute/windata"
  gnuserver=""
  testserver=""
 }
}setservers()

divgraphimagedir="." // "../divgraph"
woptionsgnu="menubar,scrollbars,resizable,alwaysRaised"
woptionsjs="menubar=yes,scrollbars,alwaysRaised,width=_w,height=_h,left=50"

colors=new Array("red","blue","green","purple","teal","brown","skyblue","yellow","black")
	
function getColor(i){ return colors[i%colors.length]; }


function jsgraph(svar,sflags,j0){
	var x=0
	var y=0
	var n=0
	swidth=parseInt(swidth)
	sheight=parseInt(sheight)
	GRinit()
	GRopengraphwindow(swidth+200,sheight+150)
	Data=new Array() 
	Labels=new Array()
	Info=new Array()
	Info.doptlabels=Info.dopoints=true
	Info.dogridx=Info.dogridy=true
	Info.title="<center><h3>"+stitle+"</h3><b>"+stitle1+"</b>" + (stitle||stitle1? "" : "<br><a href=javascript:print()>Print</a>&nbsp;&nbsp;<a href=javascript:close()>Close</a>") + "</center>"
	if(xlabel=="")xlabel=(isvsc?"["+svar+"]"+(vscn==2?"<sup>2</sup>":""):"time (sec)")
	if(ylabel=="")ylabel=(isdt?"d["+svar+"]/dt":(isln?"ln":(is1_c?"1/":""))+"["+svar+"]")
	Info.xaxislabel=xlabel
	Info.yaxislabel=ylabel
	Info.xmin=pstart
	Info.xmax=NaN
	Info.ymin=(isdt||isln?NaN:0)
	Info.ymax=NaN

  var s=xlimits
  if (s!="from auto"){
	var v=s.split(" ")
	Info.xmin=eval(v[1])
	Info.xmax=eval(v[3])
	Info.xticmajor=eval(v[5])
  }

  var s=ylimits
  if (s!="from auto"){
	var v=s.split(" ")
	Info.ymin=eval(v[1])
	Info.ymax=eval(v[3])
	Info.yticmajor=eval(v[5])
  }

	Info.defaultcolor="blue"
	Info.graphwidth=swidth
	Info.graphheight=sheight
	Info.graphtop=100
	Info.graphleft=100
	Info.ticwidth=1
	Info.maxaddpoints=0
	Info.ptsize=4
	Info.linewidth=2
	Info.docurve=(sflags.indexOf("ALLLINES")>=0)
	Info.curvecolor=""
	Info.dopoints=!Info.docurve
	Info.dotrendline=(sflags.indexOf("DOTREND")>=0)
	Info.imagedir=divgraphimagedir
	Info.doxticnums=(sflags.indexOf("NOXNUMS")<0)
	Info.doyticnums=(sflags.indexOf("NOYNUMS")<0)


//data

	var ymax=-Infinity
	var x=0
	Info.keyx=10
	Info.keyy=100
	Info.key=""
	Info.trendlabelx=400
	Info.trendlabely=-50
	Info.xvar=Info.xlabel
	Info.yvar=Info.ylabel
	rand = parseFloat(rand)

	var jstep=(Math.floor((n__-j0)/swidth)+1)
	for(var i=0;i<nv;i++)
	{
	 if(svar=="conc" || svar==Vlist[i])
	 {
		var sc = getColor(i);
		Info.key+=sc+"="+Vlist[i]+";"
		var fx=(xyof(i,j0,0,false) + xyof(i, n__-1, false))/2*rand
		var fy=(xyof(i,j0,0,true) + xyof(i, n__-1, true))/2*rand
		for(var j=j0;j<n__;j+=jstep){
			x=xyof(i,j,0,false) + (Math.random()* 2 - 1)*fx
			y=xyof(i,j,1,false) + (Math.random()* 2 - 1)*fy
			if(x>=Info.xmin && (isNaN(Info.xmax)||x<=Info.xmax) && !isNaN(y) && y>-Infinity && y<Infinity){
				ymax=Math.max(y,ymax)
				Data[Data.length]=new Array(x,y,sc)
				Labels[Labels.length]="d["+Vlist[i]+"]/dt = "+ro(dT[i][j],-3)
			}
		}
	 }
	}
	Info.xnumdigits=0
	Info.xticmajor=Info.xticminor=Info.yticmajor=Info.yticminor="auto"
	Info.xticfirst=Info.yticfirst=NaN

//Info.debug=true

	GRdrawgraph("",Data,Labels,Info)
	GRclosegraphdocument()
	return 1
}

function dograph(gtype)
{
 var s=""
 var itype=usr.sdtype.selectedIndex
 var vtype=usr.sdtype[itype].value
 iswindata=(vtype.substring(0,3)=="wdt")
 if(gtype==0 && vtype=="csv")gtype=8
 if(gtype==0 && vtype=="js")gtype=7
 if(gtype==0 && !iswindata)gtype=6
 if(gtype==0 && vtype=="wdt-l")gtype=4
 if(gtype==0 && vtype=="wdt-r")gtype=2
 if(gtype==4)gtype==2 //no local windata since NN4
 getinfo()
 var svar=textof(usr.swherex)
 var ivar=usr.swherex.selectedIndex-1
 var j0=Math.max(Math.round(eval(usr.tpstart.value)),0)/nstep

 if(svar=="all..." || svar=="")
 {
  svar="conc"
  sflags=strsub(sflags,"DOTREND","")
  sflags+=" LABELS=("+Vlist.join(",")+")"
 }

 if(vtype=="js")return jsgraph(svar,sflags,j0)

 if(xlabel=="")xlabel=(isvsc?"["+svar+"]"+(vscn==2?"^2":""):"time (sec)")
 if(ylabel=="")ylabel=(isdt?"d["+svar+"]/dt":(isln?"ln":(is1_c?"1/":""))+"["+svar+"]")
 nl=(gtype==6||gtype==8?"\n":"||"+(gtype==1?"":"\r\n"))
 var sm=""+Math.random()
 sm=sm.substring(2,10)
 var ssrc=""
 if(gtype==0 || gtype==2 || gtype==6 || gtype==8)
 {
  var newwin=open("","CALC_k"+sm,woptionsgnu)
  s=document.location.hash
  s=s.substring(1,s.length)
  s="<html><body><form name='FORM' method='POST' action='"+(gtype==6?(istest?testserver:gnuserver):dataserver+"/"+sm)+"'><a name="+s+">"
  s+="<h1>"+stitle+"</h1></a>"

  if(iswindata){
	s+="<input type=hidden name='ID' value='g41698'>\n"
	s+="<input type=hidden name='TOPIC' value='"+(gtype==2?"reflect":"windata")+"'>\n"
	if(gtype==2)s+="<input type=hidden name='mimetype' value='application/x-windata'>\n"
  }else{if(gtype!=8){
	s+="display type: <input type=text name=_term size=10 value="+vtype+">\n"
	if(vtype!="table")s+=" options: <input type=text name=_termoptions size=20 value='color'>\n"		
  }}
  s+="<p>"+n__+" data point"+(n__==1?"":"s")+"<p>" 
  if(gtype!=8)s+="<input type=submit value=Plot><br><small>Job "+sm+"</small><br>"
  if(istest)alert(s)
  newwin.document.write(s)
  ssrc=""
  ssrc+="<textarea bgcolor=#FFFFFF  rows=15 cols=70 name="+(gtype==2?"mimeinfo":(gtype==6?"_data":"xydata"))+">"
 }

 var sfit=""
 var sfittitle=""
 if(sflags.indexOf("DOTREND")>=0){
  var L=new Array()
  L.m=null
  for(var j=j0;j<n__;j++)GRLSQ(L,xyof(ivar,j,0,false),xyof(ivar,j,1,false))
  GRLSQ(L)
  for(var j=j0;j<n__;j++)GRLSR(L,xyof(ivar,j,0,false),xyof(ivar,j,1,false))
  GRLSR(L)
  sfit=ro(L.m,-5)+"*x+"+ro(L.b,-5)
  sfittitle="y="+sfit+" r^2="+ro(L.r2,5)
 }
 if(iswindata || gtype==8){
	var sep=","
	if(iswindata)ssrc+="===flags:  DISPLAY "+sflags+" HEIGHT="+sheight+" WIDTH="+swidth+" DODATE"+nl
	ssrc+="===file:   "+(iswindata?"<HFF0000>":"")+stitle+nl
	ssrc+="===title1: "+stitle1+nl
	ssrc=strsub(ssrc,"#","")
	ssrc+="===fit: "+sfittitle+nl
	ssrc+="===x-axis: "+(iswindata?"man ":" ")+xlabel+nl
	ssrc+="===x "+xlimits+nl
	ssrc+="===y-axis: "+(iswindata?"man ":" ")+ylabel+nl
	ssrc+="===y "+ylimits+nl
	ssrc+="===points: "+n__+nl
	ssrc+="===All data"+nl
	ssrc+="===x,y:"+nl
 }else{
	var slines=(sflags.indexOf("ALLLINES")>=0?"with lines":"")
	var sep=" "
	if(sfit.length){
	 sfit=","+sfit+" title '"+sfittitle+"' lt 3"
	 ssrc+="# least squares results:\n"
	 ssrc+="#   m="+L.m+"\n"
	 ssrc+="#   b="+L.b+"\n"
	 ssrc+="#   r^2="+(L.r2)+"\n"
	}
	ssrc+='set tmargin 10;set bmargin 10;set lmargin 10;set rmargin 10'+nl
	ssrc+='set title "'+stitle+(stitle1.length?'\\n'+stitle1:'')+'"'+nl
	ssrc+='set xlabel "'+xlabel+'"'+nl
	ssrc+='set ylabel "'+ylabel+'"'+nl
	if(sflags.indexOf("NOXNUMS")>=0)ssrc+='set noxtics'+nl
	if(sflags.indexOf("NOYNUMS")>=0)ssrc+='set noytics'+nl
	ssrc+='set tics '+(sflags.indexOf("XTICSUP")>=0?'in':'out')+nl
	if(xlimits!="from auto"){
		var gxlimits=strsub(xlimits,"from","[")
		gxlimits=strsub(gxlimits,"to",":")
		gxlimits=strsub(gxlimits,"step","]# ")
		ssrc+='set xrange '+gxlimits+nl
	}
	if(ylimits!="from auto"){
		var gylimits=strsub(ylimits,"from","[")
		gylimits=strsub(gylimits,"to",":")
		gylimits=strsub(gylimits,"step","]# ")
		ssrc+='set yrange '+gylimits+nl
	}
	var splot=""
	for(var i=0;i<nv;i++)
 	{
		if(svar=="conc" || svar==Vlist[i])splot+=",'-' title '"+Vlist[i]+"' "+slines
	}
	ssrc+="plot "+splot.substring(1,splot.length)+sfit+nl
 }

 if(!isvsc && gtype==8){
  for(var j=j0;j<n__;j++){
	ssrc+=xyof(i,j,0,true)
	for(var i=0;i<nv;i++){if(svar=="conc" || svar==Vlist[i]){
		ssrc+=sep+xyof(i,j,1,true)
   	}}
	ssrc+=nl
  }
 }else{
  for(var i=0;i<nv;i++)
  {
   if(svar=="conc" || svar==Vlist[i])
   {
    var sc=(iswindata?","+CH[i]:"")
    for(var j=j0;j<n__;j++)ssrc+=xyof(i,j,0,true)+sep+xyof(i,j,1,true)+sc+nl
    ssrc+=(iswindata?"1e99,0,-1":"e ")+nl//write label;-1 removes from least-squares
   }
  }
 }
 if(gtype==4)//local windata
 {
  if(istest)alert(ssrc)
  parent.CALC_k.document.close()
  parent.CALC_k.document.open("text/whatdoyoucallit")
  parent.CALC_k.document.write("<html>\n"+ssrc)
  parent.CALC_k.document.write("</html>")
  parent.CALC_k.document.close()
//  CALC_k.close()
  return 1
 } 
 //gnuplot or remote windata or reflect x-windata
 ssrc+="</textarea bgcolor=#FFFFFF ><p><center><a href=javascript:close()>Close</a></form></body></html>"
 if(istest)alert(ssrc)
 newwin.document.write(ssrc)
 newwin.document.close()
 return 1
}

function xyof(i,j,isy,iround){
 if(isy){
  var y=(isdt?dT[i][j]:(isln?Math.log(T[i][j]):T[i][j]))
  if(is1_c)y=1/y
  return(iround && !isNaN(y) && y<Infinity && y>-Infinity?ro(y,-5):y)
 }else{
  var x=(isvsc?T[i][j]*(vscn==2?T[i][j]:1):nT[j] * dt)
  return(iround && isvsc?ro(x,-5):x)
 }
}


