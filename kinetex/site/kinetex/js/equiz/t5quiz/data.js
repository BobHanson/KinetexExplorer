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
,['anymech','string','','','','[[createMech()]]','','','','','']
,['rpc','string','','','','[[setsubs(getMechSpecies("rpc"))]]','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
,['','','','','','','','','','','']
)


Quest=new Array([]
,['MOPT','[[showSpeciesOpts("EFFECT")]]','[[hidden("$anymech_")]]What will be the effect of increasing the concentration of $rpc_ for a reaction with the following mechanism and overall equation?<p>$anymech_','me5']
,['MOPT','[[showSpeciesOpts("CATSPECIES")]]','Which species in the following mechanism is a catalyst?<p>$catmech_','mc5']
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
,['','','','']
,['','','','']
,['','','','']
)

registerquestions(5)















