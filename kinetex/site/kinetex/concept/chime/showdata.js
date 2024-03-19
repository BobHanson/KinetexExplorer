//BH 5:33 PM 12/23/2002
//standard schemes
Scheme=new Array()
Scheme["cartoononly"]="select *;wireframe off;color structure;structure;cartoon;"
Scheme["aminocartoon"]=Scheme["cartoononly"]+"color amino;"
Scheme["cartoonorganic"]=Scheme["cartoononly"]+"select not (protein or rna or dna or water);color cpk;"+satoms+solvoff

//structures
newStructure("1arl.pdb","carboxypeptidase","carboxypeptidase A"
,"In carboxypeptidase A, a central antiparallel beta-pleated sheet is surrounded on both sides by alpha-helices. If you look closely, you will see a channel through the middle of the molecule that forms the active site."
,Scheme["cartoononly"]+"select helix;color magenta;select sheet;color darkgreen;"
)

newStructure("1ab9.pdb","chymotrypsin","chymotrypsin"
,"The active site in chymotrypsin involves a pocket bounded by Gly 216 and Gly 226, shown here in red. Chymotrypsin binds flat nonpolar amino acids."
,Scheme["cartoononly"]+"select 216-226;color red;"
)

newStructure("1a3n.pdb","deoxyhemoglobin","deoxyhemoglobin"
,"The hemoglobin structure consists of four indentical subunits. Each subunit holds one iron-containing prophyrin ring. Species such as O<sub>2</sub>, CO, and CN<sup>-</sup> bind to this iron group. Notice how each iron atom is also associated with a histidine group (His 87)."
,Scheme["cartoononly"]+"select *;color chain;select hetero,87A,92B,87C,92D;color cpk;"+satoms+solvoff
)

newStructure("1zni.pdb","insulin","insulin"
,"In this crystal there are two identical independent molecules of insulin. Each molecule consists of two chains, which are cross-linked by disulfide bridges formed from cysteine groups."
,Scheme["aminocartoon"]+"color amino;ssbonds;trace;restrict protein;select cys;"+satoms+solvoff
)

newStructure("1ash.pdb","oxyhemoglobin","oxyhemoglobin"
,"This is only one of four identical subunits. If you look closely, you can see the O<sub>2</sub> molecule attached to the iron atom of the heme group."
,Scheme["cartoononly"]+"select *;color chain;select hetero,his;color cpk;"+satoms+solvoff
)

newStructure("193l.pdb","lysozyme","lysozyme"
,"The active site of lysozyme is thought to be a groove along one side of the molecule. The proposed mechanism of carbohydrate cleavage involves Glu 35 and Asp 52, shown here as space-filled models."
,Scheme["cartoononly"]+"select 52,35;spacefill on;"
)

newStructure("1lmq.pdb","boundlysozyme","lysozyme bound to (NAG)4"
,"The (NAG)4 substrate is in a large groove lined with polar amino acid residues.\nAsp 52 and Glu 35 are labeled."
,Scheme["cartoonorganic"]+"select glu35 or asp52;color cpk;"+satoms+label("glu35.cd")+label("asp52.cg")+"rotate y -45;"
)

newStructure("1hkg.pdb","hexokinase","hexokinase"
,"A deep, wide-open groove leads to the active site of hexokinase."
,Scheme["cartoonorganic"]+"rotate x 180;rotate z -45;"
)

newStructure("2xat1.pdb","acetyltransferase","acetyltransferase with chloramphenicol"
,"Chloramphenicol is the compound with the para-nitrophenyl group. Behind it is a molecule of desulfo-coenzyme A."
,Scheme["cartoonorganic"]+"rotate x -90;rotate y -110;rotate z -70;rotate x 20"
)

newStructure("4ald.pdb","aldolase","aldolase"
,"D-Fructose-1,6-diphosphate is near the center of this structure."
)

newStructure("1qnf1.pdb","dnalyase","DNA lyase"
,"The two bound molecules are FAD and a synthetic flavin that lacks a nitrogen atom, 8-hydroxy-5-deazaflavin."
)

newStructure("1bdg.pdb","hexokinaseglucose","hexokinase bound to glucose"
,"Glucose is the small molecule in the center."
,Scheme["cartoonorganic"]+"rotate y 90;rotate x 200;rotate y 145"
)

