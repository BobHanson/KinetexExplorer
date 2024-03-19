//CHECKJS  D:\js\kinetex\util.js 1/31/2003 6:28:30 AM
//util.js
//colors are r g b
//add whatever additional colors you wish to use
//note that any color name here should have a gif by the name in the directory
//shades of these are used for the reaction;

debugdiv=false && true
divlist=""

ColorTable=new Array()
COLORS=new Array(["black",[256,256,256]]
	,["green",[256,0,256]]
	,["blue",[256,256,0]]
	,["red",[0,256,256]]
	,["teal",[256,0,0]]
	,["yellow",[0,0,256]]
	,["purple",[0,256,0]]
	,["colorless",[0,0,0]]
)

function Util_colorGetArray(colorpt){
	var A=new Array()
	if(i<0 || i>=COLORS.length)colorpt=0
	for(var i=0;i<3;i++)A[i]=COLORS[colorpt][1][i]
	return A
}

function Util_colorGetIndex(color){
	if(ColorTable.length==0)Util_colorSetScheme()
	return(ColorTable[color]?ColorTable[color]:0)
}

function Util_colorGetName(i){
	return (i>=0 && i<COLORS.length?COLORS[i][0]:"black")
}

function Util_colorSetScheme(){
	//assigns javascript values to color names
	for(var i=0;i<COLORS.length;i++){
		ColorTable[COLORS[i][0]]=i
	}
}

function Util_copyArray(Afrom,Ato,list){
	var A=list.split(",")
	for(var i=0;i<A.length;i++)Ato[A[i]]=Afrom[A[i]]
}

function Util_copyArrayAll(Afrom,Ato){
	for(var i in Afrom)Ato[i]=Afrom[i]
}

function Util_createDiv(id,s){
	if(arguments.length<2)s="&nbsp;"
	var sout="\n<style>#"+id+"{position:absolute;left:10000;top:10000}</style>"
	sout+="\n<div id="+id+">"+s+"\n</div>"
//	var sout="\n<div id="+id+" style='position:absolute;left:0;top:0'>"+s+"\n</div>"
//	document.write(sout)
	divlist+=sout
}		

function Util_createWindow(s){
	var opt="menubar,scrollbars,width=600,height=400,left=100,top=30"
	var sm=""+Math.random()
	sm=sm.substring(3,10)
	sm="DEBUGWIN"
	var w=open("","Sim_"+sm,opt)
	var doc=w.document.open()
	doc.writeln("<a href=javascript:close()>Close</a><p><pre>")
	doc.writeln(s)
	doc.writeln("</pre>")
	doc.close()
}

function Util_fixEqn(e,smodel){
	
	//must be fairly simple
	
	e=e
	.replace(/\/dt\=/,"+=dt*")
	.replace(/\[/g,"*[")
	
	var ileft=-1
	var i=0
	var n=0
	var sn=""
	var sconc=""
	while(i<e.length){
		if(e.charAt(i)=="[")ileft=i
		if(e.charAt(i)=="]" && !isNaN(parseFloat(e.substring(i+1,e.length)))){
			e=e.substring(0,i+1)+"^"+e.substring(i+1,e.length)
		}
		if(e.charAt(i)=="^"){
			n=parseFloat(e.substring(i+1,e.length))
			sn=""+n
			sconc=e.substring(ileft,i)
			e=e.substring(0,ileft)+"Math.pow("+sconc+","+n+")"+e.substring(i+1+sn.length,e.length)
		}
		i++						
	}
	e=e
	.replace(/k/g,"ModelInfo{"+smodel+"}.k")
	.replace(/\[/g,"C{"+smodel+"}[")
	.replace(/\{/g,"[")
	.replace(/\}/g,"]")
	.replace(/d\*C/g,"dC")
	.replace(/\(\*/g,"(")
	.replace(/\[/g,"['")
	.replace(/\]/g,"']")
	return e
}

function Util_fixExponents(s){
	var i=0
	var n=0
	var sn=n
	var c=""
	var sout=""
	s=s.replace(/\^/g,"")
	var issub=false
	var isnum=false
	var issup=false
	var isdash=false
	var isspace=true
	var digs="0123456789"
// k2[A][B]2
	for(var i=0;i<s.length;i++){
		c=s.charAt(i)
		isdash=(c=="-" && !isnum)
		isnum=(digs.indexOf(c)>=0)
		if(isnum){
			if(!issup && !isspace)issub=true
			if(issup)c="<sup>"+c+"</sup>"
			if(issub)c="<sub>"+c+"</sub>"
		}else{
			issub=(c=="e" || c=="k")
			issup=(c=="]")
			isspace=(c==" ")
		}
		sout+=c
	}
	return sout

	while(s.indexOf("^")>=0){
		i=s.indexOf("^")
		n=parseFloat(s.substring(i+1,s.length))
		if(isNaN(n)){
			s=s.substring(0,i)+s.substring(i+1,s.length)
		}else{
			sn=""+n
			s=s.substring(0,i)+"<sup>"+sn+"</sup>"+s.substring(i+sn.length+1,s.length)
		}
	}

}

function Util_flushRight(s,n){
	var sp="                                       "+s
	return sp.substring(sp.length-n,sp.length)
}

function Util_getColor(absr,absg,absb){
	return Util_getRGB(256-absr,256-absg,256-absb)
}

function Util_getRGB(r,g,b){
	var s=Util_radix(r)+Util_radix(g)+Util_radix(b)
	return s
}

function Util_ndig(n){
	var x=Math.abs(n)
	return(x>=9999||x<0.01?-2:x>=10?0:x>=1?1:x>=.1?2:3)
}

function Util_radix(i){
	var si="00"+Math.floor((i>255?255:i<0?0:i)).toString(16)
	return si.substring(si.length-2,si.length)
}

function Util_random_1_to(n){
	return Math.floor(Math.random()*n+1)
}

function Util_roundoff(x,ndec){
	var s=""
	if(isNaN(x) || x==0)return "0"
	if(arguments.length<2)ndec=Util_ndig(x)
	if(ndec==0)return ""+Math.round(x)
	var neg=(x<0?"-":"")
	var xs=Math.abs(x)+""
	var i=(xs.indexOf("E") & xs.indexOf("e"))
	if(ndec<0 && i<0){
		xs=Util_roundoff(Math.abs(x)*1e-100,-ndec)
		i=(xs.indexOf("E") & xs.indexOf("e"))
		var e=parseInt(xs.substring(i+1,xs.length))+100
		s=neg+xs.substring(0,i)+(e!=0?"E"+e:"")
		return s
	}
	if (i>0){
		s=Util_roundoff(xs.substring(0,i),Math.abs(ndec)-1)+"E"+xs.substring(i+1,xs.length)
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

function Util_setDivs(){
	if(divlist=="")return
	document.write(divlist)
	document.write(divlist.replace(/\</g,"&lt;"))
	divlist=""
}

function Util_setParameters(type,plist,smodel){
	var S=plist.split("|")
	for(var i in S)	eval(type+"Info['"+smodel+"']."+S[i])
}

