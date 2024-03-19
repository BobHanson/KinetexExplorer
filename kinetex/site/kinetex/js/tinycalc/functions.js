//BH 10:14 AM 1/20/2003
knownconstants=";Kw=1e-14"
+";Rg=0.08205783 /* L-atm/mol-K */"
+";R=8.314 /* J/mol-K */"
+";kb=1.38066e-23 /* J */"
+";T=298 /* K */"
+";F=96485 /* C/mole e– */"
+";P=1 /* atm */"
+";V=1 /* L */"
+";n=1 /* mol */"
+";Nav=6.022e23 /*particles*/"
+";"


function RANDOM(){return Math.random()}
function RANDOMC(n){return Math.pow(10,Math.floor(n*Math.random()-n+1))}

function RANDOMG(){return RANDOMH()}

function RANDOMH(){return Math.floor(200*Math.random()-100)*1000}

function RANDOMK(){return Math.pow(10,Math.floor(10*Math.random()-5))}

function RANDOMKDIS(){return Math.pow(10,Math.floor(10*Math.random()-11))}

function RANDOMS(){return Math.floor(20*Math.random()-10)}

function RANDOMT(){return Math.floor(2000*Math.random()+100)}
function RANDOM2(t1,t2){return Math.floor((t2-t1)*Math.random()+t1)}



//note: no quotes here! use `s instead.

TERR="[T<=0?The temperature (in Kelvin!) must be positive]"
BOLTZERR="[nj>=ni?The number of particles in the upper level, nj, should be less than the number of particles in the lower level, ni]"
+"[nj<1?eval(doset(`nj=0`))!]"
+"[ni<=0?The number of particles in the lower level, ni, must be positive]"+TERR
KTERR="[Keq<=0?The equilibrium constant, K, must be positive]"+TERR
QTERR="[Q<=0?The reaction quotient, Q, must be positive]"+TERR
ARRERR="[k<=0?The rate constant, k, must be positive][Ea<=0?The activation value of Ea must be positive]"+TERR
PVERR="[P<=0?The pressure must be positive][V<=0?The volume must be positive]"+TERR
HERR="[OH<=0||H<=0?The concentration of OH- and H+ must both be positive]"
ACERR="[Ho<0||Ao<0||HAo<0?Initial concentrations must not be negative for this calculation]"
+"[Ao==0 && Ho+x<1e-7?eval(doset('x=HAo');doset('Ho=1e-7');doBtn('test'))!]"
BASERR="[BHo<0||Bo<0||OHo<0?Initial concentrations must not be negative for this calculation]"

//format is: TITLE,FORMULA,ERRORINFO,SAMPLE1,SAMPLE2,...

Functions=new Array([]
	,["BOLTZ","Boltzmann Law","nj/ni=e^(-dEij/(kb*T))",BOLTZERR
		,"dEij=1e-20*RANDOM();ni=6.022e23;nj="
		,"nj=1e20*RANDOM();ni=6.022e23;dEij="
		,"dEij=1e-20*RANDOM();nj=6.022e23;ni="
		,"T=RANDOMT();dEij=1e-20;ni=6.022e23;nj="
	]
	,["KVST","Keq vs. T (Nonlinear Form)","Keq=e^(-(dHo-T*dSo)/(R*T))",KTERR
		,"Keq=;dHo=100000;dSo=25;T=RANDOMT()"
		,"Keq=RANDOMK();dHo=;dSo=25;T=298"
		,"Keq=RANDOMK();dHo=100000;dSo=;T=298"
		,"Keq=RANDOMK();dHo=100000;dSo=(Keq>1?-25:25);T="
		,"Keq=RANDOMK();dHo=RANDOMH();dSo=RANDOMS();T="
	]
	,["KVS1/T","Keq vs 1/T (Linear Form)","ln(Keq)=(-dHo/R)*(1/T)+dSo/R",KTERR
		,"Keq=;dHo=100000;dSo=25;T=RANDOMT()"
		,"Keq=RANDOMK();dHo=;dSo=25;T=298"
		,"Keq=RANDOMK();dHo=100000;dSo=;T=298"
		,"Keq=RANDOMK();dHo=100000;dSo=(Keq>1?-25:25);T="
		,"Keq=RANDOMK();dHo=RANDOMH();dSo=RANDOMS();T="
	]
	,["KEQT","Free Energy Equil. (0=dHo+...)","0=dHo-T(dSo-R*ln(Keq))",TERR
		,"Keq=;dHo=100000;dSo=25;T=RANDOMT()"
		,"Keq=RANDOMK();dHo=;dSo=25;T=298"
		,"Keq=RANDOMK();dHo=100000;dSo=;T=298"
		,"Keq=RANDOMK();dHo=100000;dSo=(Keq>1?-25:25);T="
		,"Keq=RANDOMK();dHo=RANDOMH();dSo=RANDOMS();T="
	]
	,["K2T2","Clausius-Clapeyron Eqn.","ln(K2/K1)=(dHo/R)(1/T1-1/T2)",""
		,"K1=1;K2=;dHo=100000;T1=RANDOM2(250,299);T2=RANDOM2(300,350)"
		,"K1=RANDOMK();K2=RANDOMK();dHo=;T1=298;T2=328"
	]
	,["PVAP","Free Energy Equil. Vapor Pressure","0=dHo-T(dSo-R*ln(Pvap))|Pvap*760",TERR
		,"Pvap=;dHo=44000;dSo=119;T=RANDOM2(290,340)"
		,"Pvap=RANDOM2(5,90)/100;dHo=44000;dSo=119;T="
	]
	,["GTQ","Free Energy Nonequil. (dG=dHo+...)","dG=dHo-T(dSo-R*ln(Q))",QTERR
		,"dG=;Q=RANDOMK();dHo=100000;dSo=25;T=298"
		,"dG=;Q=RANDOMK();dHo=RANDOMH();dSo=RANDOMS();T=298"
		,"Keq=RANDOMK();dHo=100000;dSo=(Keq>1?-25:25);T="
		,"dG=0;Q=;dHo=100000;dSo=25;T=RANDOMT()"
	]
	,["VGQ","Voltage (Go Form)","-n*F*E=dGo+T*R*ln(Q)",QTERR]
	,["VHSQ","Voltage (Ho,So Form)","-n*F*E=dHo-T(dSo-R*ln(Q))",QTERR]
	,["NERNST","Nernst Eqn.","E=Eo-(R*T)/(n*F)*ln(Q)",QTERR]
	,["ARR","Arrhenius Equation (Nonlinear Form)","k=A*e^(-Ea/(R*T))",ARRERR]
	,["ARRLN","Arrhenius Equation (Linear Form)","ln(k)=ln(A)-Ea/(R*T)",ARRERR]
	,["IDEAL","Ideal Gas Equation","P*V=n*Rg*T",PVERR]
	,["KW","Water Dissociation","(H)(OH)=Kw|-log(H)",HERR
		,"H=RANDOMC(10);OH="
		,"H=;OH=RANDOMC(10)"
	]	
	,["KA","General Acid Dissociation","(Ho+x)(Ao+x)/(HAo-x)=Keq|-log(Ho+x)",ACERR
		,"x=;Ho=0;Ao=0;HAo=RANDOMC(2);Keq=RANDOMKDIS()"
		,"x=;Ho=0;Ao=RANDOMC(2);HAo=Ao;Keq=RANDOMKDIS()"
		,"x=;Ho=0;Ao=RANDOMC(2);HAo=Ao/2;Keq=RANDOMKDIS()"
		,"x=;Ho=0;Ao=RANDOMC(2);HAo=Ao*2;Keq=RANDOMKDIS()"
		,"x=;Ho=0;Ao=0;HAo=RANDOMC(2);Keq=RANDOMKDIS()"
	]
	,["KB","General Base Hydrolysis","(OHo+x)(BHo+x)/(Bo-x)=Keq|14-log(OHo+x)",BASERR
		,"x=;BHo=0;Bo=RANDOMC(3);OHo=0;Keq=RANDOMKDIS()"
		,"x=;BHo=RANDOMC(3);Bo=BHo;OHo=0;Keq=RANDOMKDIS()"
		,"x=;BHo=RANDOMC(3);Bo=BHo*5;OHo=0;Keq=RANDOMKDIS()"
		,"x=;BHo=RANDOMC(3);Bo=BHo/5;OHo=0;Keq=RANDOMKDIS()"
	]
)

