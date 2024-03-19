function getRateOpts(what){
 var s=""
 var sout=""
 if(what=="rate"){
	var T=new Array([2,1,-1,-0.5],[1,-1,-0.5],[2,1,-2])
	T=T[rand(T.length)]
	var thisrate=Equation.dxdt
	sout+=calc_roundoff(Equation.dxdt,-2)+" mol/L/sec*"
	for(var i=0;i<T.length;i++)sout+=","+calc_roundoff(Equation.thisRPrate*T[i],-2)+" mol/L/sec"
 }
 if(what=="kunits"){
	s=["sec","min","hr"][rand(3)]
	for(var i=1;i<=4;i++){
		sout+=","+(i==1?"  ":"M<sup>"+MINUS+(i-1)+"</sup>")+s+"<sup>"+MINUS+"1</sup>"+(i==Equation.order?"*":"")
	}
	sout=sout.substring(1,sout.length)
 }
 if(what=="order"){
	for(var i=1;i<=4;i++){
		sout+=","+i+(i==Equation.order?"*":"")
	}
	sout=sout.substring(1,sout.length)
 }
 if(what=="rorder"){
	for(var i=0;i<=2;i++){
		sout+=","+i+(i==Equation.thisRorder?"*":"")
	}
	sout=sout.substring(1,sout.length)
 }
//alert(sout.replace(/,/g,"\n"))
 return sout
}

function createKEquation(Eqn,n){
 if(arguments.length<2)n=2
 var thisn=0
 var sout=""
 while(thisn!=n){
	sout=createEquation(Eqn)
	thisn=Eqn.react.split("+").length
 }
 return sout
}


function getInitialInfo(what){
 var sout=""
 if(arguments.length<1)what=""
 if(what==""||what=="EQN"){
	sout="<p>Overall Equation: "+createKEquation(Equation,2)+"<p>"
	sout+=getInitialTable(Equation)
 }
 if(what=="EQN")return Equation.show
 if(what!="")return Equation[what]
 return sout
}


function getInitialTable(Eqn){
 var s=""
 var sout=""
 var RP=new Array()
 Eqn.R=new Array()
 for(var mol in Eqn.list){
	if(Eqn.list[mol].n){
		RP[RP.length]=new Array(mol,Eqn.list[mol].n)
	}
	if(Eqn.list[mol].n<0){
		Eqn.R[Eqn.R.length]=mol
 	} 	
 }
 
 var T=new Array([[1,1],[1,.5],[2,1]]
 ,[[1,1],[1,2],[2,1]]
 ,[[1,1],[1,.5],[.5,1]]
 ,[[1,1],[1,2],[.5,1]]
 )
 T=T[rand(T.length)]

 var xyz="xyz"
 var x=(Math.random()>.5?1:Math.random()>.1?2:0)
 var y=(Math.random()>.5?1:Math.random()>.1?2:0)
 if(x==0 && y==0){
	if(Math.random()>.5){
		x=(Math.random()>.5?1:2)
	}else{
		Y=(Math.random()>.5?1:2)
	}
 }
 var z=(Math.random()>.5?1:Math.random()>.1?2:0)
 Eqn.XYZ=new Array(x,y,z)
 Eqn.x=x
 Eqn.y=y
 Eqn.z=z
 Eqn.order=x+y

 var Co=new Array()
 for(var i=0;i<Eqn.R.length;i++){
	Co[i]=calc_roundoff(rand2(0.1,0.6),2)
 }

 var ithis=rand(RP.length)
 var ithisr=rand(Eqn.R.length)
 while(RP[ithis][1]<0 && Eqn.XYZ[ithis]==0)ithis=rand(RP.length)

 Eqn.k=Math.pow(10,Math.floor(5*Math.random()-7))*(rand(9)+1)

 sout+="<p>"+(RP[ithis][1]<0?MINUS:"")+(RP[ithis][1]==1||RP[ithis][1]==-1?"":"(1/"+Math.abs(RP[ithis][1])+")")+"d["+setsubs(RP[ithis][0])+"]/dt = Reaction Rate = <i>k</i>"
 for(var i=0;i<Eqn.R.length;i++){
	sout+="["+setsubs(Eqn.R[i])+"]<sup><i>"+xyz.charAt(i)+"</i></sup>"
 }


 sout+="<p><table border cellspacing=3 cellpadding=10><tr><th>Expt</th>"

 Eqn.ratelaw="reaction rate = <i>k</i>"
 for(var i=0;i<Eqn.R.length;i++){
	s="["+setsubs(Eqn.R[i])+"]"
	if(Eqn.XYZ[i]){
		Eqn.ratelaw+=s+(Eqn.XYZ[i]>1?"<sup>"+Eqn.XYZ[i]+"</sup>":"")
	}
	sout+="<th>"+s+"</th>"
 }
 sout+="<th>d["+setsubs(RP[ithis][0])+"]/dt</th>"
 sout+="</tr>"
 var dxdt=1
 var C=new Array()
 for(var r=0;r<T.length;r++){
	sout+="<tr><td align=right>"+(r+1)+"</td>"
	dxdt=Eqn.k
	for(var i=0;i<Eqn.R.length;i++){
		C[i]=Co[i]*T[r][i]
		dxdt*=Math.pow(C[i],Eqn.XYZ[i])

		sout+="<td align=right>"+calc_roundoff(C[i],3)+" <i>M</i></td>"
//		sout+="<td>"+Eqn.XYZ[i]+" "+Co[i]+" "+T[r][i]+" "+C[i]+"</td>"
	}
	sout+="<td align=right>"+calc_roundoff(dxdt*RP[ithis][1],-3)+" mol/L/sec"
//	sout+=" "+dxdt
	sout+="</td></tr>"
 }
 sout+="</table>"

 Eqn.thisRP=setsubs(RP[ithis][0])
 Eqn.thisRPcoef=RP[ithis][1]
 Eqn.thisRPrate=dxdt*RP[ithis][1]
 Eqn.thisR=setsubs(Eqn.R[ithisr])
 Eqn.thisRcoef=Eqn.list[Eqn.R[ithisr]].n
 Eqn.thisRrate=dxdt*Eqn.thisRcoef
 Eqn.thisRorder=Eqn.XYZ[ithisr]
 Eqn.dxdt=dxdt
 return sout
}
