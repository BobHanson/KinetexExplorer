Data=new Array([]
,['species','type','','rxn','molecularity','','','','','','']
,['NO<sub>2</sub>','a reactant','','O<sub>3</sub>  --> O<sub>2</sub> + O','unimolecular','','','','','','']
,['NO<sub>3</sub>','an intermediate','','O<sub>3</sub> + NO --> O<sub>2</sub> + NO<sub>2</sub>','bimolecular','','','','','','']
,['CO','a reactant','','NO<sub>2</sub> + NO<sub>2</sub> --> N<sub>2</sub>O<sub>4</sub>','bimolecular','','','','','','']
,['CO<sub>2</sub>','a product','','O<sub>2</sub> + O<sub>2</sub> --> O<sub>3</sub> + O','bimolecular','','','','','','']
,['NO','a product','','CO + O<sub>2</sub> + NO --> CO<sub>2</sub> + NO<sub>2</sub>','termolecular','','','','','','']
,['','','','2CO + O<sub>2</sub> --> 2CO<sub>2</sub>','termolecular','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
)

Variables=new Array([]
,['name','type','min','max','ndig','value','','','','','']
,['mechonly','string','','','','[[createMech("MECHONLY")]]','','','','','']
,['mech','string','','','','[[createMech("NOCAT")]]','','','','','']
,['spec','string','','','','[[setsubs(MechInfo.thisspecies)]]','','','','','']
,['intmech','string','','','','[[createMech("MUSTINT")]]','','','','','']
,['catmech','string','','','','[[createMech("MUSTCAT",2)]]','','','','','']
,['ratelaw0','string','','','','[[createMech("NOREV")]]','','','','','']
,['ratelaw1','string','','','','[[createMech("MUSTREV,NOCAT")]]','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
)


Quest=new Array([]
,['TEXT','[[showOverallOnly()]]','What is the overall equation for the following mechanism?<p>$mechonly_','mo4']
,['MOPT','$molecularity','What is the molecularity of the following mechanistic step:<p>$rxn_','mmm4']
,['MOPT','[[showSpeciesOpts()]]','[[hidden("$mech_")]]In the following mechanism, $spec_ is _?_.<p>[[showMech()]]','mm4']
,['MOPT','[[showSpeciesOpts("INTSPECIES")]]','Which of the indicated species in the following mechanism is an intermediate?<p>$intmech_','mi4']
,['TEXT','[[showRateLaw()]]','What is the rate law for a reaction with the following mechanism and overall equation?<p>$ratelaw0_','ml4']
,['TEXT','[[showRateLaw()]]','What is the rate law for a reaction with the following mechanism and overall equation?<p>$ratelaw1_','mml4']
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

registerquestions(4)















