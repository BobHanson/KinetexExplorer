
Mech=new Array(0)
Species=new Array()
MechInfo=new Array()
debugmech=true && false

function addMechSpecies(a,n,i){
 if(!Species[a]){
	Species[a]=new Array()
 }
 var j=Species[a].length 
 Species[a][j]=new Array(n,i)
}

function addMech(a,b,c,d){
 var n=Mech.length
 Mech[n]=new Array()
 Mech[n].List=new Array(a,b,c,d)
 if(a)addMechSpecies(a,n,0)
 if(b)addMechSpecies(b,n,1)
 if(c)addMechSpecies(c,n,2)
 if(d)addMechSpecies(d,n,3)
}

function isStable(spec){
 return stablespecies.indexOf(","+spec+",")>=0
}

function isReactStable(thisn,isrev){
	return isStable(Mech[thisn].List[isrev?2:0])&&isStable(Mech[thisn].List[isrev?3:1])
}

function isProdStable(thisn,isrev){
	return isStable(Mech[thisn].List[!isrev?2:0])&&isStable(Mech[thisn].List[!isrev?3:1])
}

function createMech(stype,nstepmax){

 if(arguments.length<1)stype="ANY"
 if(arguments.length<2)nstepmax=3
 var isOK=false
 while(!isOK){

 MechInfo=new Array()
 MechInfo.stype=stype
 MechInfo.EquationSet=new Array()
 MechInfo.haveint=false
 MechInfo.havecatalyst==true

 var nsteps=2
 var S=new Array()
 var n=0
 var n1=0
 var sout=""

 while(n==0){
	var react=StableSpecies[rand(StableSpecies.length)]
	if(!Species[react])alert(react +" is not in Species[]")
	var ithis=rand(Species[react].length)
	var isp=Species[react][ithis][1]
	var isrev=(i>1)
	var thisn=Species[react][ithis][0]
	if(isReactStable(thisn,isrev))n=(isrev?-1:1)*thisn
 }
 MechInfo.N=new Array()
 MechInfo.firstIrrev=0
 addMechN(n)
 for(var i=1;i<nsteps;i++){
	isrev=(n<0)
	ithis=(isrev?0:2)
	n=Math.abs(n)
	S=new Array(Mech[n].List[ithis])
	ithis++
	if(Mech[n].List[ithis])S[1]=Mech[n].List[ithis]
	ithis=rand(S.length)
	if(isStable(S[ithis]))ithis=S.length-1-ithis
	n1=findMechStep(S[ithis],n)
	//sout+=S[ithis]+" "+n+" "
	isOK=(n1!=0 && addMechN(n1))
	n=(isOK?n1:isrev?-n:n)
	if(!isOK || i==nsteps-1 && MechInfo.haveint && nsteps<10)nsteps++
 }
 MechInfo.firstIrrev=(stype.indexOf("NOREV")>=0?0:rand(MechInfo.EquationSet.length))
 if(stype.indexOf("MUSTREV")>=0 && MechInfo.firstIrrev==0)MechInfo.firstIrrev=1
 MechInfo.overallEqn=getOverallMech(false)
 getMechSpecies("rpci")
 isOK=(
	MechInfo.nreact>0
	&& MechInfo.EquationSet.length<=nstepmax 
	&& (stype.indexOf("MUSTCAT")<0||MechInfo.havecatalyst==true)
	&& (stype.indexOf("MUSTINT")<0||MechInfo.haveint==true)
	&& (stype.indexOf("NOCAT")<0||MechInfo.spectype!="c")
	)
 }

 return sout+showMech()
}

function isCatalyst(s){
	S=new Array()
	var n=0
	for(var j=0;j<MechInfo.EquationSet.length;j++){
		if(S[s])n=S[s]
		checkMechSpecies(S,MechInfo.EquationSet[j],false)
		if(n<0 && S[s]==0)return true
	}
	return false
}

function addMechN(n){
	var S=new Array()
	MechInfo.haveint=false
	for(var j=0;j<MechInfo.EquationSet.length;j++){
		checkMechSpecies(S,MechInfo.EquationSet[j],true)
	}
	checkMechSpecies(S,n,true)
	for(var i in S){
		if(S[i]<0 && !isStable(i))return 0
		if(S[i]>0 && !isStable(i))MechInfo.haveint=true
	}
	MechInfo.EquationSet[MechInfo.EquationSet.length]=n
	MechInfo.N[Math.abs(n)]=true
	return 1
}

function getOverallMech(ishtml){
	var sout=""
	MechInfo.S=new Array()
	MechInfo.Type=new Array()
	MechInfo.havecatalyst=false
	MechInfo.haveint=false
	MechInfo.nreact=0
	MechInfo.nprod=0
	for(var j=0;j<MechInfo.EquationSet.length;j++){
		checkMechSpecies(MechInfo.S,MechInfo.EquationSet[j],false)
	}
	for(var i in MechInfo.S){
		if(MechInfo.S[i]<0){
			sout+=(sout?" + ":"")+(MechInfo.S[i]!=-1?-MechInfo.S[i]:"")+(ishtml?setsubs(i):i)
			MechInfo.Type[i]="r"
			MechInfo.nreact++
		}
	}
	for(var i in MechInfo.S){
		if(MechInfo.S[i]>0){
			sout+=(sout.indexOf("-->")<0?" --> ":" + ")+(MechInfo.S[i]!=1?MechInfo.S[i]:"")+(ishtml?setsubs(i):i)
			MechInfo.Type[i]="p"
			MechInfo.nprod++
		}
	}
	for(var i in MechInfo.S){
		if(MechInfo.S[i]==0){
			MechInfo.Type[i]=(isCatalyst(i)?"c":"i")
//sout+="   ("+i+MechInfo.Type[i]
		}
		if(MechInfo.Type[i]=="c")MechInfo.havecatalyst=true
		if(MechInfo.Type[i]=="i")MechInfo.haveint=true
	}
	return "Overall: " + sout
}

function getMechSpecies(stype){
	if(arguments.length<1)stype="rpci"
	var T=new Array()
	var s=""
	for(var i in MechInfo.S){
		if(stype.indexOf(MechInfo.Type[i])>=0)T[T.length]=i
	}
	s=T[rand(T.length)]
	MechInfo.thisspecies=s
	MechInfo.spectype=MechInfo.Type[s]
	return s
}

function checkMechSpecies(S,n,isint){
	var isrev=(n<0)
	var s=""
	n=Math.abs(n)
	for(var i=0;i<4;i++){
		s=Mech[n].List[i]
		if(s && (!isint || !isStable(s))){
			if(!S[s])S[s]=0
			S[s]+=(!isrev && i<2||isrev && i>1?-1:1)
		}	
	}
}

function findMechStep(react,n){
	var i=n
	var ithis
	var ntry=0
	while(i==n|| MechInfo.N[i] && ntry++<1000){
		ithis=rand(Species[react].length)
		i=Species[react][ithis][0]
	}
	if(ntry>=1000){
		alert("couldn't find second mech step for "+react)
		return 0
	}
	return (Species[react][ithis][1]>1?-i:i)	
}

function showSpeciesOpts(stype){
 if(arguments.length<1)stype="TYPE"
 var sout=""
 var n=0
 var S=new Array()
 var s=""
 if(stype=="TYPE"){
	 sout="a reactant"
	 if(MechInfo.spectype=="r")sout+="*"
	 sout+=",a product"
	 if(MechInfo.spectype=="p")sout+="*"
	 sout+=",an intermediate"
	 if(MechInfo.spectype=="i")sout+="*"
	 if(MechInfo.stype.indexOf("NOCAT")<0){
		sout+=",a catalyst"
		if(MechInfo.spectype=="c")sout+="*"
	 }
 }
 if(stype=="EFFECT"){
	sout="the reaction rate will increase,the reaction rate will decrease,the reaction rate will not change"
	s=MechInfo.thisspecies
	for(var j=0;j<=MechInfo.firstIrrev;j++){
		checkMechSpecies(S,MechInfo.EquationSet[j],false)
		if(S[s] && S[s]<0){
			sout=sout.replace(/increase/,"increase*")
			return sout
		}
		if(S[s] && S[s]>0 && j!=MechInfo.firstIrrev){
			sout=sout.replace(/decrease/,"decrease*")
			return sout
		}
	}
	return sout+"*"
 }

 if(stype=="CATSPECIES"){
	for(var i in MechInfo.Type){
		if(MechInfo.Type[i]=="c" && (++n)==1)S[S.length]=setsubs(i)+"<a name=" + Math.random()+"></a>"+"*"+(debugmech?"c":"")
	}
	sout=S[rand(S.length)]
	for(var i in MechInfo.S){
		if(MechInfo.Type[i]!="c" && (++n)<5)sout+=(sout?",":"")+setsubs(i)+"<a name=" + Math.random()+"></a>"+(debugmech?MechInfo.Type[i]:"")
	}
 }
//top.document.title=sout
 if(stype=="INTSPECIES"){
	for(var i in MechInfo.Type){
		if(MechInfo.Type[i]=="i" && (++n)==1)S[S.length]=setsubs(i)+"*"
	}
	sout=S[rand(S.length)]
	for(var i in MechInfo.Type){
		if(MechInfo.Type[i]!="i" && (++n)<5)sout+=(sout?",":"")+setsubs(i)
	}
 }
 return sout
}

function showMech(){
 var sout=""
 var s=""
 var sarrow=""
 var style=""
 for(i=0;i<MechInfo.EquationSet.length;i++){
	style=" class="+(i%2?"table1":"table2")
	s=showMechStep(MechInfo.EquationSet[i])
	if(MechInfo.firstIrrev>i){
		sarrow="--<i>k</i><sub>"+(i+1)+"</sub>--><br>&nbsp;&nbsp;&lt;--<i>k</i><sub>"+MINUS+(i+1)+"</sub>--"
	}else{
		sarrow="--<i>k</i><sub>"+(i+1)+"</sub>-->"
	}
	s=s.replace(/\-\-\>/,"</td><td "+style+" align=center>&nbsp;&nbsp;"+sarrow+"&nbsp;&nbsp;</td><td "+style+" >")
	sout+="<tr><td "+style+" align=right>"+s+"</td></tr>"
 }
 sout="<table cellspacing=0 cellpadding=3>"+sout+"</table>"
 if(MechInfo.stype.indexOf("MECHONLY")<0)sout="<table><tr><td align=center>"+sout+"</td></tr><tr><td><hr>"+getOverallMech(true)+"</td></tr></table>"
 return sout
}

function showOverallOnly(){
 return MechInfo.overallEqn
}

function showMechStep(n){
 var sout=""
 var isrev=(n<0)
 if(isrev)n=-n
// alert(n+" "+isrev+" "+Mech[n].List)
 if(isrev){
	for(var i=2;i<6;i++){
		if(Mech[n].List[i%4]) sout+=(i==4?" --> ":" + ")+Mech[n].List[i%4]+(debugmech?MechInfo.Type[Mech[n].List[i%4]]:"")
	}
 }else{
	for(var i=0;i<4;i++){
		if(Mech[n].List[i]) sout+=(i==2?" --> ":" + ")+Mech[n].List[i]+(debugmech?MechInfo.Type[Mech[n].List[i]]:"")
	}
 }
 return setsubs(sout.substring(3,sout.length))
}


function showRateLaw(){
	var sint=""
	var sout0="Reaction Rate = "
	var sout="              = "
	var S=new Array()
	var n=MechInfo.firstIrrev+1
	var absn=0
	checkMechSpecies(S,MechInfo.EquationSet[MechInfo.firstIrrev],false)
	sout0+="k"+n
	for(var i in S){
		if(S[i]<0)sout0+="["+i+"]"+(S[i]<-1?"^"+(-S[i]):"")
	}
	if(MechInfo.firstIrrev==0)return sout0
	MechInfo.k=""
	MechInfo.Exp=new Array()
	for(i in S)MechInfo.Exp[i]=(S[i]>0?0:-S[i])
	MechInfo.k="k"+(MechInfo.firstIrrev+1)
	var ntry=0
	while(++ntry<100){
		sint=""
		for(i in MechInfo.Exp){
			if(MechInfo.Type[i]=="i" && MechInfo.Exp[i]!=0){
				sint=i
				break
			}
		}
		if(!sint)break
		for(var i=MechInfo.firstIrrev-1;i>=0;i--){
			n=MechInfo.EquationSet[i]
			absn=Math.abs(n)
			
//alert("ex "+i+" sint="+sint+" Mech[n].List="+ Mech[n].List)
			if(isProduct(n,sint)){
//alert(n+" sint="+sint)
				S=new Array()
				checkMechSpecies(S,n,false)
				MechInfo.k+="(k"+(i+1)+"/k_"+(i+1)+")"
				var x=S[sint]
				for(var j in S){if(j!=sint){
					if(!MechInfo.Exp[j])MechInfo.Exp[j]=0
						MechInfo.Exp[j]-=S[j]/x
				}}
				MechInfo.Exp[sint]=0
			}		
		}
	}
	sout+=MechInfo.k
	var l=sout.length
	var snum=space(l)
	var snumsup=snum
	var sden=snum
	var sdensup=snum
	var spad=snum
	for(var i in MechInfo.Exp){
		if(MechInfo.Exp[i]){
			if(MechInfo.Exp[i]>0)snum+="["+i+"]"
			if(MechInfo.Exp[i]<0)sden+="["+i+"]"
			if(MechInfo.Exp[i]>1){
//				snumsup+=space(snum.length-snumsup.length)+MechInfo.Exp[i]
				snum+="^"+MechInfo.Exp[i]
			}
			if(MechInfo.Exp[i]<-1){
//				sdensup+=space(sden.length-sdensup.length)+(-MechInfo.Exp[i])
				sden+="^"+(-MechInfo.Exp[i])
			}			
		}
	}
	if(snum.indexOf("[")<0)snum+="1"
	if(sden.length<snum.length-1){
		spad=space((snum.length-sden.length)/2)
		sden=spad+sden
		sdensup=spad+sdensup
	}else if(snum.length<sden.length-1){
		spad=space((sden.length-snum.length)/2)
		snum=spad+snum
		snumsup=spad+snumsup
	}
	if(sden.indexOf("[")>=0){
		sout=(parseInt(snumsup)?snumsup+"\n":"")+snum+"\n"+sout+bar(snum.length+1-l)+"\n"+(parseInt(sdensup)?sdensup+"\n":"")+sden
	}else{
		snum=sout+snum.substring(l,snum.length)
		sout=(parseInt(snumsup)?snumsup+"\n":"")+snum
	}
	return sout0+"\n\n"+sout
}

function space(n){
	return "                                            ".substring(0,Math.floor(n))
}
function bar(n){
	return "--------------------------------------------".substring(0,Math.floor(n))
}

function isProduct(n,species){
	var isrev=(n<0)
	n=Math.abs(n)
	for(var i=0;i<4;i++){
		if(Mech[n].List[i]==species){
			return (isrev && i<2||!isrev && i>1)
		}
	}
	return false
}


stablespecies="N2,NO,NO2,O2,CO,O3,CO2"
StableSpecies=stablespecies.split(",")
stablespecies=","+stablespecies+",,"


addMech('NO','NO','N2','O2')
addMech('NO2','NO2','NO','NO3')
addMech('NO3','CO','NO2','CO2')
addMech('NO2','CO','NO','CO2')
addMech('O2','O2','O3','O')
addMech('CO','O2','CO2','O')
addMech('NO2','O2','NO','O3')
addMech('NO2','O','NO3','')
addMech('NO','O','NO2','')
addMech('CO2','O2','CO','O3')
addMech('N2','O','N2O','')
addMech('N2','O3','N2O','O2')
