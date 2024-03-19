Data=new Array([]
,['','this','curve','conc','whichrate','change','whichrate2','change2','','','']
,['','O<sub>2</sub>','#1','1.0 M','rate of change in [A] after 4.0 seconds','-0.05 mol/L/sec','reactionrate after 4.0 seconds','0.025 mol/L/sec','','','']
,['','H<sub>2</sub>','#2','0.8 M','rate of change in [A] after 2.0 seconds','-0.14 mol/L/sec','average rate of reaction during the first 4 seconds','0.08 mol/L/sec','','','']
,['','H<sub>2</sub>O','#3','0 M','average rate of change in [A] in the first 4 seconds','-0.16 mol/L/sec','initial reaction rate','0.24 mol/L/sec','','','']
,['','','','','initial rate of change in [A]','-0.48 mol/L/sec','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
)

Variables=new Array([]
,['name','type','min','max','ndig','value','','','','','']
,['','','','','','','','','','','']
,['x','int','','','0','[[getInitialInfo("x")]]','','','','','']
,['y','int','','','0','[[getInitialInfo("y")]]','','','','','']
,['z','int','','','0','[[getInitialInfo("z")]]','','','','','']
,['k','float','','','-2','[[getInitialInfo("k")]]','','','','','']
,['eqn','string','','','','[[getInitialInfo("EQN")]]','','','','','']
,['rp','string','','','','[[Equation.thisRP]]','','','','','']
,['rprate','float','','','-2','[[Equation.thisRPrate]]','','','','','']
,['dxdt','float','','','-2','[[Equation.dxdt]]','','','','','']
,['ratelaw','string','','','','[[Equation.ratelaw]]','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
)


Quest=new Array([]
,['MOPT2','$curve','The graph below is for a reaction that has the overall equation 2H<sub>2</sub> + O<sub>2</sub> --> 2H<sub>2</sub>O. Which curve identifies $this_?<br><img src=rxn.gif>','rg1']
,['MOPT2','$conc','The graph below is for a reaction that has the overall equation 2H<sub>2</sub> + O<sub>2</sub> --> 2H<sub>2</sub>O. What is the initial concentration of $this_?<br><img src=rxn.gif>','ic1']
,['MOPT','H<sub>2</sub>*,O<sub>2</sub>','The graph below is for a reaction that has the overall equation 2H<sub>2</sub> + O<sub>2</sub> --> 2H<sub>2</sub>O. What is the limiting reactant?<br><img src=rxn.gif>','lr1']
,['MOPT','[[getRateOpts("rate")]]','[[hidden("$eqn_")]]At a certain point in a reaction based on the overall equation shown below, it is found that d[$rp_]/dt = $rprate_ moles/liter/second. What is the "reaction rate" at this point in the reaction?<p><center><pre>$eqn_</pre></center>','rr1']
,['MOPT2','$change','The graph below is for a reaction that has the overall equation 2A + B --> C. Approximately what is the $whichrate_?<br><img src=rxn2.gif>','rc1']
,['MOPT2','$change2','The graph below is for a reaction that has the overall equation 2A + B --> C. Approximately what is the $whichrate2_?<br><img src=rxn2.gif>','rcr1']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
,['','','','']
)

registerquestions(1)















