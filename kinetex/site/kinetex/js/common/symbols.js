//2:03 PM 1/17/2003 5:23 PM 1/14/2009
//symbol generator
//------------page code----------

function dw(s){
	document.write(sym(s))
}

//so, to write a specific symbol:  dw(s)

//to just return the symbol as a string:  sym(s)

//------------header code--------

SYM_NONE=4	//raw character
SYM_FS=1	//font face symbol
SYM_AMP=2	//character name
SYM_N=3		//character number

//I've set the defaults here for AMP
//this will kick in only when it's not a Mac or PC running Netscape or IE

Syms=new Array()  //name,number,default
Syms["a"]=["alpha",945,SYM_AMP]
Syms["b"]=["beta",946,SYM_AMP]
Syms["g"]=["gamma",947,SYM_AMP]
Syms["d"]=["delta",948,SYM_AMP]
Syms["D"]=["Delta",916,SYM_AMP]
Syms["l"]=["lambda",955,SYM_AMP]
Syms["m"]=["mu",956,SYM_AMP]
Syms["n"]=["nu",957,SYM_AMP]
Syms["p"]=["pi",960,SYM_AMP]
Syms["s"]=["sigma",963,SYM_AMP]
Syms["y"]=["psi",968,SYM_AMP]
Syms["¢"]=["prime",8242,SYM_AMP]
Syms["·"]=["middot",183,SYM_AMP]
Syms["‡"]=["Dagger",8225,SYM_AMP]
Syms["#1"]=["uuml",252,SYM_AMP]
Syms["#2"]=["acirc",226,SYM_AMP]
Syms["#3"]=["eacute",233,SYM_AMP]
Syms["#4"]=["oslash",248,SYM_AMP]
Syms["-"]=["minus",150,SYM_N]


//add most recent AT THE TOP on each platform:
//because if the version isn't found, the first one
//for that browser/platform is used
//add /x where x is a character to above to be more specific, as in:
//	SymDef['browserinfo/a']=SYM_FS


SymDef=new Array()

//PC:

SymDef['Win32;Microsoft Internet Explorer 4.']=SYM_AMP
SymDef['Win32;Netscape 5.']=SYM_AMP
SymDef['Win32;Netscape 4.']=SYM_FS
SymDef['Win32;Netscape 4./·']=SYM_NONE
SymDef['Win32;Netscape 4./‡']=SYM_NONE
SymDef['Win32;Netscape 4./#1']=SYM_N
SymDef['Win32;Netscape 4./#2']=SYM_N
SymDef['Win32;Netscape 4./#3']=SYM_N
SymDef['Win32;Netscape 4./#4']=SYM_N

//MAC:
// lots of omegas on G3 in lab "Netscape 5.0"

SymDef['MacPPC;Microsoft Internet Explorer 5.']=SYM_AMP
SymDef['MacPPC;Netscape 5.']=SYM_N  //for NS 6 as well
SymDef['MacPPC;Netscape 4.']=SYM_FS
SymDef['MacPPC;Netscape 4./·']=SYM_NONE
SymDef['MacPPC;Netscape 4./‡']=SYM_NONE
SymDef['MacPPC;Netscape 4./#1']=SYM_N
SymDef['MacPPC;Netscape 4./#2']=SYM_N
SymDef['MacPPC;Netscape 4./#3']=SYM_N
SymDef['MacPPC;Netscape 4./#4']=SYM_N


NavSyms=new Array()
ihavenavinfo=false
navinfo=navigator.platform+";"+navigator.appName+" "+navigator.appVersion.substring(0,3)
usinginfo=""

function sym(s,itype){
 	if(!ihavenavinfo)checknav()
	if(!Syms[s]||itype==SYM_NONE)return s
	if(arguments.length==1){
		return NavSyms[s]
	}
	if(itype==SYM_FS)return "<font face=symbol>"+s+"</font>"
	if(itype==SYM_AMP)return "&"+Syms[s][0]+";"
	if(itype==SYM_N)return "&#"+Syms[s][1]+";"
}

var ichecknav=true

function checknav(){
 if (!ichecknav)return
 NavSyms=new Array()
 ihavenavinfo=(SymDef[navinfo]?1:0)
 var sinfo=navinfo
 if(!ihavenavinfo){
	sinfo=navigator.platform+";"+navigator.appName+" "+navigator.appVersion.substring(0,2)
	ihavenavinfo=(SymDef[sinfo]?1:0)
	if(!ihavenavinfo){
		sinfo=navigator.platform+";"+navigator.appName
		for(var i in SymDef){
			if(i.indexOf(sinfo)==0){
				sinfo=i
				break
			}
		}
		ihavenavinfo=(SymDef[sinfo]?1:0)
	}
 }
 usinginfo=sinfo
 if(ihavenavinfo){
	for(var s in Syms){
		var d=sinfo+"/"+s
		if(!SymDef[d])d=sinfo
		NavSyms[s]=sym(s,SymDef[d]) 
	}
 }else{
//	for(var s in Syms)NavSyms[s]=Syms[s] 
	ichecknav=false
	for(var s in Syms){
		NavSyms[s]=sym(s,SYM_AMP) 
	}
 }	
}

DELTA=sym("D")
MINUS=sym("-")
NU=sym("n")
MU=sym("m")

function symclean(s){
 return s.replace(/DELTA_/g,DELTA).replace(/\&minus\;/g,MINUS).replace(/NU_/g,NU).replace(/MU_/g,MU)
}
