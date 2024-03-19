/*

equiz

bh 5:38 AM 4/1/2003 added matheval of x,y

alternative entry point:

data(
"K","T"
,[2,300]
,[4,500]
,[8,700]
)
plot(ln(K) vs. 1/T)
m=slope
b=intercept

*/

plotswitherror=0

PlotData=new Array()
PlotData.col1="Keq"
PlotData.col2="T"
PlotData.x="1/T"
PlotData.y="ln(Keq)"
PlotData.xmath="1/T"	//set in plot()
PlotData.ymath="ln(Keq)"//set in plot()
PlotData.dim=2
PlotData.ndata=0
PlotData.xyz=new Array()  //xyz variable names
PlotData.xyzu=new Array() //xyz variable units
PlotData.data=new Array() //xyz raw data, before transform
PlotData.xyv=new Array()  //xy-value data, after transform
PlotData.L=new Array()    //least square info

function newPlotData(P){
 P.xunits=""
 P.yunits=""
 P.xyzu=new Array()
 P.xyz=new Array()
 P.data=new Array()
 P.xyv=new Array()
}

function data(x,y){
 PlotData=new Array()
 newPlotData(PlotData)
 PlotData.col1=x
 PlotData.col2=y
 var d=0
 for(var i=2;i<arguments.length;i++){
	PlotData.data[d++]=new Array(arguments[i][0],arguments[i][1])
 }
 PlotData.ndata=d
}

function getTheData(data){
 var A=new Array()
 var B=new Array()
 var x=""
 var y=""
 var d=0
 var s=""
 var ndim=0
 var iselect=(data.indexOf("*")>=0?-1:-2)
 //get data from textarea into PlotData array
 
 data=dataclean(data)

 var S=data.split("\n")
 PlotData=new Array()
 newPlotData(PlotData)
 s=(isNaN(parseFloat(S[0]+"x"))?S[0]:"x,y")
 A=s.replace(/\]/g,"").split(",")
 ndim=A.length-1
 for(var i=0;i<A.length;i++){
	B=(A[i]+"[").split("[")
	PlotData.xyz[i]=B[0]
	PlotData.xyzu[i]=B[1]
 }
 //plot default is first two columns
 PlotData.col1=PlotData.xyz[0]
 PlotData.col2=PlotData.xyz[1]
 PlotData.xunits=PlotData.xyzu[0]
 PlotData.yunits=PlotData.xyzu[1]
 //allow selection of points with *
 d=0
 PlotData.dim=0
 for(var i=0;i<S.length;i++){if(!isNaN(parseFloat(S[i])) && S[i].indexOf("*")>iselect){
	A=S[i].split(",")
	PlotData.data[d]=new Array()
	for(var j=0;j<A.length;j++){
		PlotData.data[d][j]=matheval(A[j])
		if(j>PlotData.dim)PlotData.dim=j
	}
	//alert(PlotData.data[d])
	d++
 }}
 PlotData.ndata=d
}

function doShowPlot(txtarea,yvsx){
 yvsx.replace(/ /g,"")
 var data=fixinputlines(eval(txtarea+".value"))
 getTheData(data)
 if(PlotData.col1!="x")yvsx=yvsx.replace(/x/g,PlotData.col1)
 if(PlotData.col2!="y")yvsx=yvsx.replace(/y/g,PlotData.col2)
 plot(yvsx)
}

function plot(yvsx){
 var S=yvsx.replace(/ /g,"").split("vs.")
 var s=""
 var d=0
 var x=0
 var y=0

 PlotData.y=S[0]
 PlotData.x=S[1]
 PlotData.xmath=mathof(PlotData.x)
 PlotData.ymath=mathof(PlotData.y)
 PlotData.xyv=new Array()
 for(var i_=0;i_<PlotData.data.length;i_++){
	PlotData.xyv[i_]=new Array()
	s=PlotData.col1+"="+PlotData.data[i_][0]+";"+PlotData.col2+"="+PlotData.data[i_][1]
	PlotData.xyv[i_][0]=eval(s+";"+PlotData.xmath)
	PlotData.xyv[i_][1]=eval(s+";"+PlotData.ymath)
 }
 PlotData.L=new Array() 
 GRgetleastsquares(PlotData.xyv,PlotData.L)
 slope=PlotData.L.m
 intercept=PlotData.L.b
 showPlot(PlotData)
}
 
function showPlot(PlotData){
 if(plotswitherror>=2){
	if(plotswitherror++==2)alert("Your browser is not capable of displaying the graphs.")
	return
 }
 plotswitherror=2
 GRopengraphwindow(300,300,50,300)
 Info=new Array()
 Info.graphleft=Info.graphtop=50
 Info.dotrendline=true
 Info.defaultcolor="black"
 Info.style=".trendeqn {font-size:10pt;color:red}"
 Info.trendcolor="red"
 Info.xvar=PlotData.x
 Info.yvar=PlotData.y
 Info.ptsize=6
 Info.linewidth=1
 Info.trendlabelx=60
 Info.trendlabely=-20
 Info.imagedir="../../common"
 GRdrawgraph("",PlotData.xyv,"",Info)
 GRclosegraphdocument()
 plotswitherror=1
}

function showDataWithBtns(iq,iallowchange,text,form,name,codeframe){
	if(arguments.length<1 || iq==0)iq=thisiq
	if(arguments.length<2)iallowchange=false
	if(arguments.length<3)text=datatext
	if(arguments.length<4)form='parent.Q_test.document.info'
	if(arguments.length<5)name="d"+iq
	if(arguments.length<6)codeframe='parent.Q_code'

	var s="<textarea wrap=virtual rows=6 cols=20 name="+name+(iallowchange?"":" READONLY")+">"+text+"</textarea>" 
	s="<table><tr><td valign=top>"+s+"</td><td valign=top>"+getPlotBtns(form+"."+name,codeframe)+"</td></tr></table>"
	return s
}

function showPlotBtns(txt,codeframe){
 if(arguments.length==1)codeframe=""
 if(codeframe.length)codeframe+="."
 document.write(getPlotBtns(txt,codeframe))
}

function getPlotBtns(txt,codeframe){
 if(arguments.length==1)codeframe=""
 if(codeframe.length)codeframe+="."
 var sout=""
 sout+="\n<a href=\"javascript:"+codeframe+"doShowPlot('"+txt+"','y vs. x')\"><img src="+gifdir+"/yvsx.gif></a>"
 sout+="\n<a href=\"javascript:"+codeframe+"doShowPlot('"+txt+"','1/y vs. x')\"><img src="+gifdir+"/1yvsx.gif></a>"
 sout+="\n<a href=\"javascript:"+codeframe+"doShowPlot('"+txt+"','ln(y) vs. x')\"><img src="+gifdir+"/lnyvsx.gif></a>"
 sout+="\n<a href=\"javascript:"+codeframe+"doShowPlot('"+txt+"','ln(y) vs. 1/x')\"><img src="+gifdir+"/lnyvs1x.gif></a>"
 sout+="<br>"
 sout+="\n<a href=\"javascript:"+codeframe+"doShowPlot('"+txt+"','x vs. y')\"><img src="+gifdir+"/xvsy.gif></a>"
 sout+="\n<a href=\"javascript:"+codeframe+"doShowPlot('"+txt+"','1/x vs. y')\"><img src="+gifdir+"/1xvsy.gif></a>"
 sout+="\n<a href=\"javascript:"+codeframe+"doShowPlot('"+txt+"','ln(x) vs. y')\"><img src="+gifdir+"/lnxvsy.gif></a>"
 sout+="\n<a href=\"javascript:"+codeframe+"doShowPlot('"+txt+"','ln(x) vs. 1/y')\"><img src="+gifdir+"/lnxvs1y.gif></a>"
 return sout
}

function strim(s,ch){
	var i=0
	while (s.charAt(i)==ch)i++
	if(i>0)s=s.substring(i,s.length)
	var i=s.lastIndexOf(ch)
	if(i>=0 && i==s.length-1)s=s.substring(0,i)
	return s
}

function dataclean(sclean,ch1,ch2){
 //IE uses \r\n for line ends, while Netscape uses just \n
 //figure on some browsers just using \r as well.
 //furthermore, some versions of IE refuse to replace \r with \n!
 //however, it can replace \r\n with \n.
 //tabs to commas and leading spaces removed

	var s=sclean.replace(/\r/g,"\n").replace(/\r\n/g,"\n").replace(/\t/g,",")
	s=strsub(s,"\n\n","\n")
	s=strsub(s,"  "," ")
	s=strsub(s,"\n ","\n")
	s=strsub(s," \n","\n")
	while(s.charAt(0)==" "||s.charAt(0)=="\n"){
		s=strim(s," ")
		s=strim(s,"\n")
	}
	return s
}

