
function getdata(){

//add a file and a descriptor on new lines
//careful with the commas!

 return tableselect("","data",1,


 "a_b.htm","Simple Unimolecular Mechanism",
 "ab_c.htm","Simple Bimolecular Mechanism",
 "a2b_c.htm","A + 2B ---> 3C",
 "a2b__c.htm","A + 2B <===> 3C",
 "n2h2nh3.htm","N2 + 3H2 <===> 2NH3",
 "no2co.htm","Simple Two-Step Mechanism",
 "ab__c.htm","Mechanism With a Reversible First Step",
 "enzyme.htm","Enzymatic Catalysis",
 "explode.htm","Product Catalysis (Explosion)",
 "lotka.htm","Oscillating Reaction (Lotka-Volterra Model)",
 "blank.htm","My Proposed Mechanism ",


 "FILE",(islocal?"more data by filename............................................":"SKIP"))

}
