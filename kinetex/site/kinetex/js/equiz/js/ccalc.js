//CHECKJS  D:\imt\js\equiz\js\ccalc.js 2/11/2003 11:28:45 AM
/*

FOR KINETICS ONLY -- somewhat older version; streamlined, just need balancing

ccalc.js calculates the number of each element in a formula
bh 10:46 AM 2/11/2003 removed checkmolecule() 6:06 PM 7/10/2004
*/

// "A,B" here means BOTH,  ["A","B"] means either

EqnData=new Array(["H","H2","H2O"]
	,["O","H2O","H2O2","O2"]
	,["C","CH4","C2H4","C2H2","CH3OH",["HCHO","CH3CO2H"],["HCO2H","CO"],"CO2"]
	,["N","NH3",["H2NNH2","NH2OH"],"N2",["NO2","N2O4"]]
	,["F","COF2","CO2,2HF"]
)

//gifdir is defined in quiz.js
//and must be overridden if Hess is used from another directory

minussign="&#150"
O2CUTOFF=0.1  //fraction of time O2/H2/H2O
sdebug=""

     sdigits=" 0123456789"

Equation=new Array()
datatext=""

function getEqnCoef(Eqn,mol){
	return Eqn.list[mol].n
}

function getReactant(Eqn){
 var S=new Array()
 for(var mol in Equation.list){
	if(Equation.list[mol].n<0)S[S.length]=mol
 }
 return S[rand(S.length)]
}

function addMolecule(Eqn,mol,idir){
	var n=1
	if(mol=="")return
	if(mol.indexOf(",")>=0){
		var M=mol.split(",")
		for(var i=0;i<M.length;i++)addMolecule(Eqn,M[i],idir)
		return
	}
	if(!Eqn.list)Eqn.list=new Array()
	n=parseInt(mol)
	if(isNaN(n))n=1
	if(n>1)mol=mol.substring(n.toString().length,mol.length)
	if(!Eqn.list[mol]){
		Eqn.list[mol]=new Array()
		Eqn.list[mol].n=0
		getchem(mol,Eqn.list[mol])
	}
	idir*=n
	for(var i in Eqn.list[mol].Alist){
		if(!Eqn.Alist[i])Eqn.Alist[i]=0
		Eqn.Alist[i]+=Eqn.list[mol].Alist[i]*idir
	}
	Eqn.list[mol].n+=idir
	
}

function balanceEquation(Eqn){
	var x=""
	var h=""
	var o=""
	var n=0
	var ihavex=false
	var C=new Array()
	for(i=0;i<3;i++){
		x=findUnbalanced(Eqn,"","O;H;")
		if(x){
			ihavex=true
			n=findUnbalanced(Eqn,x)
			if(n){
				C=new Array([],[])
				findComponents(Eqn,C)
				if(n>0)addMolecule(Eqn,C[0][0],-n)
				if(n<0)addMolecule(Eqn,C[1][0],-n)
			}
		}
	}
	h=findUnbalanced(Eqn,"H")
	o=findUnbalanced(Eqn,"O")
	//two ways to proceed.
	//if h and o
	if(h && (Eqn["O2"] || o==0 && Eqn["H2O"])){
		addMolecule(Eqn,"H2",-h/2)
	}else if(h==0 && o && Eqn["H2O"]){
	}else{
		addMolecule(Eqn,"H2O",-h/2)
		o=findUnbalanced(Eqn,"O")
	}
	if(o)addMolecule(Eqn,"O2",-o/2)
	for(var i=0;i<3;i++){
		for(var mol in Eqn.list){
			n=Eqn.list[mol].n
			if(n!=Math.floor(n)){
				n=Math.abs(n)
				n=n-Math.floor(n)
				for(var mol in Eqn.list)addMolecule(Eqn,mol,Eqn.list[mol].n*(1/n-1))
				break
			}
		}
	}
}

function checkMolecules(slist){
	return true  //for kinetics
}

function createEquation(Eqn,isthermo,isQcalc,seqn){
	var isOK=false
	var imol1=0
	var imol2=0
	var mol=""
	var mol1=""
	var mol2=""
	var sout=""
	var ntry=0
	var S=new Array()
	var n=0
	if(arguments.length<2)isthermo=0
	if(arguments.length<3)isQcalc=0
	if(arguments.length<4)seqn=""
	Eqn.list=new Array()
	Eqn.Alist=new Array()
	Eqn.Alist.n=0

while(!isOK){

if(seqn==""){


	Eqn.list=new Array()
	Eqn.Alist=new Array()
	Eqn.Alist.n=0
	//pick a group row in EqnData
	while(!isOK && (++ntry)<100){

	while(!isOK){
		igroup=randx_y(2,EqnData.length-1)
		isOK=true
	}
	igroup=(Math.random()<O2CUTOFF?1:igroup)//sometimes O2/H2O
	
	//pick two molecules
	imol1=randx_y(1,EqnData[igroup].length-2)
	imol2=randx_y(imol1+1,EqnData[igroup].length-1)
	mol1=getMolecule(igroup,imol1)
	mol2=getMolecule(igroup,imol2)
        isOK=checkMolecules(mol1+","+mol2)
	}
	//pick a random direction
	idir=(Math.random()>0.5?1:-1)

}else{
	S=(seqn+">").replace(/ /g,"").replace(/\|/g,">").replace(/\-/g,"").replace(/\+/g,",").split(">")
	if(!checkMolecules(S.join(","),isthermo)){
		alert("Cannot process this equation "+seqn)
		return ""
	}
	mol1=S[0]
	mol2=S[1]
	idir=1
	isOK=true
}
	
	//add the molecules to the equation
	addMolecule(Eqn,mol1,-idir)
	addMolecule(Eqn,mol2,idir)
	balanceEquation(Eqn)
	//document.write( test(Eqn,"createEquation"))
	isOK=getAtoms(Eqn)
	Eqn.show=showEquation(Eqn,3,isthermo)
}
	Eqn.react=showEquation(Eqn,1,isthermo)
	Eqn.prod=showEquation(Eqn,2,isthermo)
	Eqn.Qcalc=(isQcalc?getQcalc(Eqn):0)
	return Eqn.show
}

function createRateDataSet(A,Ea,t0,t1,npoints){
	var sout="\nT [Kelvin], k [sec-1]"
	var dt=Math.floor((t1-t0)/npoints)
	var t=0
	for(var i=0;i<npoints;i++){
		t=t0+i*dt
		sout+="\n"+t+" , "+calc_roundoff(A*Math.pow(Math.E,-(Ea)/(8.3145*t)),-3)		 
	}
	//alert(sout)
	datatext=sout
	return 1
}


function findComponents(Eqn,C){
	for(var mol in Eqn.list){if(Eqn.list[mol].n){
			if(Eqn.list[mol].n<0)C[0][C[0].length]=mol
			if(Eqn.list[mol].n>0)C[1][C[1].length]=mol
	}}
}


function findUnbalanced(Eqn,swhat,snotwhat){
	var Alist=Eqn.Alist
	if(swhat){
		return(Alist[swhat]?Alist[swhat]:0)
	}
	for(var mol in Alist){
		if(Alist[mol] && (snotwhat=="" || snotwhat.indexOf(mol+";")<0))return mol
	}
	return ""
}

function getMolecule(igroup,imol){
	var M=EqnData[igroup][imol]
	while(typeof(M)=="object")M=M[rand(M.length)]
	return M
}

function setsubs(sform,icharge){
	var s=""
	var sf=""
	if(arguments.length==1)icharge=0
	var iabs=Math.abs(icharge)
	for (var i=0;i<sform.length;i++)
	{
		s=sform.charAt(i)
		sf=sf + (sdigits.indexOf(s)>0?"<sub>"+s+"</sub>":s)
	}
	if(icharge)sf+="<sup>"+(iabs==1?"":iabs)+(icharge>0?"+":minussign)+"</sup>"
	return sf
}

function showEquation(Eqn,iwhich,isthermo){
	var s=""
	var sout=""

	if(arguments.length<2||iwhich==0)iwhich=3
	if(iwhich & 1){
		for(var mol in Eqn.list){if(Eqn.list[mol].n<0){
			s+=(s.length?"+ ":"")+(Eqn.list[mol].n==-1?"":-Eqn.list[mol].n)+setsubs(isthermo?MolInfo[mol].tref:mol)+" "
		}}
		sout+=s
	}
	if(iwhich==3)sout+=" --->  "
	if(iwhich & 2){
		s=""
		for(var mol in Eqn.list){if(Eqn.list[mol].n>0){
			s+=(s.length?"+ ":"")+(Eqn.list[mol].n==1?"":Eqn.list[mol].n)+setsubs(isthermo?MolInfo[mol].tref:mol)+" "
		}}
		sout+=s
	}
	return sout
}

function strclean(sclean){
	//tabs and spaces removed; {} to ()
	var s=sclean
	s=strsub(s,"{","(")
	s=strsub(s,"}",")")
	s=strsub(s,"\n","")
	s=strsub(s,"\x22","") //double quote
	s=strsub(s,"\r","")
	s=strsub(s,"\f","")
	s=strsub(s,"\t","")
	s=strsub(s," ","")
	return s
}

function strsub(ssub,ch1,ch2){
	if(ssub.length==0) return ""
	if(ch2.length>0){if(ch2.indexOf(ch1)>=0) return ssub}
	var s=ssub
	var i=s.indexOf(ch1)
	while (i>=0){
		s=s.substring(0,i)+ch2+s.substring(i+ch1.length,s.length)
		i=s.indexOf(ch1)
	}
	return s
}


function getAtoms(Eqn){
	Eqn.atoms=new Array()
	for(var mol in Eqn.list){if(Eqn.list[mol].n>0){
		for(a in Eqn.list[mol].Alist){
			if(!Eqn.atoms[a])Eqn.atoms[a]=0
			Eqn.atoms[a]+=Eqn.list[mol].Alist[a]*Eqn.list[mol].n
		}
	}}
	var sout=""
	for(var a in Eqn.atoms)sout+=(sout==""?"":" + ")+(Eqn.atoms[a]==1?"":Eqn.atoms[a])+a
	Eqn.atomlist=sout
	return sout
}

