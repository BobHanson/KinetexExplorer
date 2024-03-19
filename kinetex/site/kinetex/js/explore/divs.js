//CHECKJS  D:\js\kinetex\divs.js 1/31/2003 6:28:29 AM
//browser-dependent div stuff here
//copyright 2001 Robert M. Hanson, St. Olaf College, Northfield, MN.
var DivPosX=new Array()
var DivPosY=new Array()
var DivS=new Array()
var anchorx=0
var anchory=0

function divanchor(s){
	var e=s
	var doc=document
	D=new Array()
	
	if(isnn4){
		if(doc[s]==null)return D
		D.left=doc[e].x
		D.top=doc[e].y
	}else{
		e=(isnn6?doc.getElementById(s):doc.all[s])
		if(e==null && isnn6)e=doc[s]
		if(e==null && isnn6)e=doc.anchors[s]
		if(e==null && isnn6)e=doc.images[s]	
		if(e==null)return D
		D.left=e.offsetLeft
		D.top=e.offsetTop
		while(e.offsetParent!=null){
			e=e.offsetParent
			D.left+=e.offsetLeft
			D.top+=e.offsetTop
		}
	}
	anchorx=D.left
	anchory=D.top
	return D
}

function divmove(s,x,y){
	var d=findlayer(s)
	if(d==null)return null
	x+=anchorx
	y+=anchory
	if(isnn4){
		d.left=x
		d.top=y
	}else{
		d.style.left=x
		d.style.top=y
	}
	DivPosX[s]=x
	DivPosY[s]=y
	return d
}

function divwidth(s){
	var d=findlayer(s)
	return(isnn4?d.clip.width:isnn6?d.offsetWidth:d.clientWidth)
}

function findlayer(name){
	if(isnn4)return document.layers[name]
	if(isnn6)return document.getElementById(name)
	if(isie4)return eval('document.all.' + name)
	return false
}

function getdivlistbox(sdiv,slistbox){
	if(isnn4){
		//no var here!
		ds=findlayer(sdiv)
		return eval("ds.document."+slistbox)
	}
	return eval("document."+slistbox)
}

function initdivs(){
	isnn4=(document.layers?true:false)
	isie4=(document.all?true:false)
	isnn6=(!isie4 && document.getElementById?true:false)
	if(!isnn4 && !isie4 && !isnn6)alert("This page will work properly only with browsers capable of supporting layers.")
}initdivs()

function movedivleft(name,left){
	var ds=findlayer(name)
	var d=(isnn4?ds:ds.style)
	d.left=left
}

function writediv(name,sinfo){
	var ds=findlayer(name)
	if(!ds)alert("No div for " + name)
	if(isnn4){
		ds.document.open()
		ds.document.write(sinfo)
		ds.document.close()
	}else{
		ds.innerHTML=sinfo
	}
	DivS[name]=sinfo
}

function writedivtextarea(name,stextarea,sinfo){
	if(isnn4){
		var ds=findlayer(name)
		var d=eval("ds.document."+stextarea)
	}else{
		var d=eval("document."+stextarea)
	}
	d.value=sinfo
}

