Data=new Array([]
,['','rlaw','order','graph','order2','','','','','','']
,['','A plot of [A] vs. time will be a straight line with slope '+MINUS+'<i>k</i>.','zero','A plot of [A] vs. time is found to be a straight line.','The reaction must be zero order in A.','','','','','','']
,['','A plot of ln[A] vs. time will be a straight line with slope '+MINUS+'<i>k</i>.','first','A plot of ln[A] vs. time is found to be a straight line.','The reaction must be first order in A.','','','','','','']
,['','A plot of 1/[A] vs. time will be a straight line with slope <i>k</i>.','second','A plot of 1/[A] vs. time is found to be a straight line.','The reaction must be second order in A.','','','','','','']
,['','A plot of [A] vs. time will be a straight line with slope <i>k</i>.','!','','','','','','','','']
,['','A plot of ln[A] vs. time will be a straight line with slope <i>k</i>.','!','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
)

Variables=new Array([]
,['name','type','min','max','ndig','value','','','','','']
,['n','int','2','4','0','','','','','','']
,['x','int','','','0','[[getInitialInfo("x")]]','','','','','']
,['y','int','','','0','[[getInitialInfo("y")]]','','','','','']
,['z','int','','','0','[[getInitialInfo("z")]]','','','','','']
,['k','float','','','-2','[[getInitialInfo("k")]]','','','','','']
,['eqn','string','','','','[[getInitialInfo("EQN")]]','','','','','']
,['rp','string','','','','[[Equation.thisRP]]','','','','','']
,['rprate','float','','','-2','[[Equation.thisRPrate]]','','','','','']
,['dxdt','float','','','-2','[[Equation.dxdt]]','','','','','']
,['ratelaw','string','','','','[[Equation.ratelaw]]','','','','','']
,['r','string','','','','[[Equation.thisR]]','','','','','']
,['t12','int','10','1000','10','','','','','','']
,['','','','','','','','','','','']
)


Quest=new Array([]
,['MOPT2','[[getRateOpts("kunits")]]','[[hidden("$eqn_")]]A reaction based on the overall equation shown below is found to have the indicated rate law:<p><center><pre>$eqn_</pre></center><p>$ratelaw_<p>Which of the following would be acceptable units for <i>k</i>?','rl2']
,['MOPT2','[[getRateOpts("order")]]','[[hidden("$eqn_")]]A reaction based on the overall equation shown below is found to have the indicated rate law:<p><center><pre>$eqn_</pre></center><p>$ratelaw_<p>What is the overall order of the reaction?','ro2']
,['MOPT2','[[getRateOpts("rorder")]]','[[hidden("$eqn_")]]A reaction based on the overall equation shown below is found to have the indicated rate law:<p><center><pre>$eqn_</pre></center><p>$ratelaw_<p>What is the overall order with respect to $r_?','rro2']
,['INFO','x,y,k','Fill in the information below based on the overall chemical equation and data provided. [[getInitialInfo()]]','ir2']
,['MOPT','$order2','$graph_ What must be true?','lo2']
,['MOPT','$rlaw','What is true for a $order_-order reaction based on the equation A --> products?','o2']
,['CALC','k [s^-1]=ln(2)/($n_ * $t12_)@-2','A first-order reaction with overall chemical equation "$n_A --> products" is found to have a half-life of $t12_ seconds. What is the rate constant for this reaction? ','h2']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
)

registerquestions(2)















