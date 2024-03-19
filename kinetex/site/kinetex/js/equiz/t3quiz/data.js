Data=new Array([]
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
)

Variables=new Array([]
,['name','type','min','max','ndig','value','','','','','']
,['k1','float','0.0000001','0.000001','-2','','','','','','']
,['k2','float','0.000001','0.00001','-2','','','','','','']
,['T1','int','273','298','','','','','','','']
,['T2','int','325','350','','','','','','','']
,['Ea','int','12000','24000','100','','','','','','']
,['A','float','0.0001','0.001','-2','','','','','','']
,['T3','int','400','425','','','','','','','']
,['n','int','1','4','0','','','','','','']
,['data','string','','','','[[createRateDataSet($A_,$Ea_,250,350,5)]]','','','','','']
,['R','const','8.31451','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
)


Quest=new Array([]
,['CALCS','ln(k1/k2)=-(Ea/8.31451)(1/T1 - 1/T2):Ea=30@.3','A first-order reaction has a rate constant of $k1_ sec<sup>'+MINUS+'1</sup> at $T1_ Kelvin and $k2_ sec<sup>'+MINUS+'1</sup> at $T2_ Kelvin. What is <i>E</i><sub>a</sub> for this reaction in Joules? ','kt3']
,['CALCS','ln(k1/k2)=-(Ea/8.31451)(1/T1 - 1/T2):k2=1e-4@-2','A  first-order reaction with <i>E</i><sub>a</sub> = $Ea_ Joules has a rate constant of $k1_ sec<sup>'+MINUS+'1</sup> at $T1_ Kelvin. What should we expect for the rate constant at $T2_ Kelvin?','ke3']
,['DATA','plot(ln(k) vs. 1/T);slope;intercept;Ea [J]= -slope*8.3145;Ea [kJ]= Ea [J]/1000@0','Based on the data below,[[hidden("$data_")]] determine the activation energy for the reaction to the nearest kilojoule.','kd3']
,['CALCS','ln(k1/k2)/ln(k1/k3)=(1/T1-1/T2)/(1/T1-1/T3):k3=1e-5@-2','A first-order reaction has a rate constant of $k1_ sec<sup>'+MINUS+'1</sup> at $T1_ Kelvin and $k2_ sec<sup>'+MINUS+'1</sup> at $T2_ Kelvin. Using the Arrhenius equation, what should we expect for the value of the rate constant at $T3_ Kelvin? ??The idea here is to use the Arrhenius equation twice. The first time we use k1, T1, k2, and T2 to calculate Ea. Then we use that Ea with k1, T1, and a third temperature to get the rate constant at that third temperature. The calculation shown here bypasses the need to calculate Ea explicitly. See if you can figure out why it works.','kkt3']
,['CALC','//f=e^(-Ea/RT) = e^(-$n_RT/RT);f=e^(-$n_)@2','What fraction of molecules in a Boltzmann distribution having <br>equally spaced energy levels have an energy greater than [[$n_>1?$n_:""]]RT? ','kb3']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
)

registerquestions(3)















