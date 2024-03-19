//textdata.js
//copyright Robert M. Hanson, St. Olaf College 9:19 PM 3/17/2003
//use . to go to a specific frame (0-based):	newCI("cell potential","_ti13.1")
//use //addScript(13,"The Chemical Connection","_bat13") to create scripts anywhere in here.



addScript(1)

////The Importance of Laboratory Data

//Chemical Reactions as Time-Dependent Phenomena


newCI("_q1","<table><tr><td><IMG exper.gif width=100 height=150></td><td><h3>The nature of all chemical change is that it takes time. Molecules must find each other, have the proper orientation, and have enough energy to get the job done. "
	+"Chemical kinetics is the study of the speed of chemical reactions. The overall goals of chemical kinetics are:"
	+"<ol>"
	+"<li>to understand what is going on \"under the hood\" in a chemical reaction.<p></li>" 
	+"<li>to predict the course of a chemical reaction, and <p></li>" 
	+"<li>to optimize conditions for the best (not necessarily the fastest) reaction.<p></li>" 
	+"</ol>"
	+"</h3></td></tr></table>"
	,"")
	newCI("overall goals","_q1")

newCI("_bs1","<table><tr><td><IMG exper.gif width=100 height=150></td><td><h3>Studying the kinetics of a chemical reaction involves several more or less distinct steps:"
	+"<ol>"
	+"<li>make observations of reactivity</li>" 
	+"<li>gather time-based data</li>" 
	+"<li>transform and tabulate the data</li>" 
	+"<li>graph the data</li>" 
	+"<li>determine the underlying \"empirical law\" for the reaction</li>" 
	+"<li>make predictions</li>" 
	+"<li>test the predictions</li>" 
	+"<li>develop a hypothetical \"mechanism\" explaining the reaction</li>" 
	+"</ol>"
	+"</h3></td></tr></table>"
	,"")
	newCI("basic sequence","_bs1")

newCI("_d1","Basic Definitions:<p><ul>"
	+"<li><b>chemical species</b> Any atom, molecule, or ion that may be involved in a chemical reaction.</li>"
	+"<li><b>chemical reaction (1)</b> A system of chemical species and its local surroundings, having mass, color, density, energy, etc., that is not in its most probable state (equilibrium), but is on its way there.</li>"
	+"<li><b>chemical reaction (2)</b> A set of specific reactants that might react in a simple integer-ratio (stoichiometric) manner to give a specific set of products.</li>"
	+"<li><b>chemical kinetics</b> The study of the rate of chemical reactions with the intent to understand and predict their behavior under a variety of conditions.</li>"
	+"<li><b>(overall) chemical equation</b> A single \"balanced\" equation depicting molecular formulas or structures that describes the stoichiometry of a chemical reaction.</li>"
	+"<li><b>reaction rate</b> The rate (usually measured in units of mol/liter per some unit of time) at which a stoichiometric amount of reactants is transformed into a stoichiometric amount of products."
	+"<li><b>chemical mechanism</b> A set of chemical reactions hypothesized to explain how exactly reactant species get to product species in a chemical reaction.</li>"
	+"<li><b>elementary mechanistic step</b> A chemical reaction with a very simple chemical equation involving no more than two components (usually) and depicting the exact individual steps that reactant molecules must go through to be transformed into products.</li>"
	+"</ul>"
	,"")
	newCI("definitions","_d1")

addScript("Chemical Reactions as Time-Dependent Phenomena","*")

newCI("_c1","Exploration $EXP(tiny1) presents two reactions that differ only by how much reactant is present. One goes considerably faster than the other, as evident by the differing rate at which they change color. Why might that be the case?"
	,"color.gif")
	newCI("color changes, in chemical reactions","_c1")
//	newCI("_cq1","$FILE","../js/explore/tiny1.htm?QONLY")

newCI("_r1","The phenomenon of color is due to the absorption of visible light energy by molecules, primarily due to electronic excitation."
	+"A <b>visible light spectrometer</b> can be used to measure the <b>absorbance</b> of a solution containing one or more colored species at a specific wavelength in the 400-700 nm region of the spectrum."
	,"abs.gif")
	newCI("color changes, and concentration","_r1")
	newCI("concentration changes, and color","_r1")

newCI("_bl1","The <b>Beer-Lambert law</b> associates the measured absorbance to concentration. The conversion factor \"epsilon\" is called the <b>molar absorptivity</b>. <i>l</i> is the path length (usually 1.00 cm). "
	+"The basic idea is simply that the absorbance of light is proportional to both the concentration of the sample and the overall distance the light has to travel in going through the sample. The law breaks down at high concentration.|"
	+"There are other ways of getting concentrations as well. A product or reactant can be titrated, or, if one of them is a solid, it can be separated and weighed. "
	+"For our purposes, we will just assume that one way or another data are available that give us knowledge of concentrations of one or more reactants or products in solution."
	,"bllaw.gif")
	newCI("Beer-Lambert law","_bl1")

addScript("Color Changes as Evidence of Reaction","*")

newCI("_data1","Exploration $EXP(tiny4) illustrates how data relating to concentrations can be used to quantify the rates of chemical reactions."
	+"<center><form><textarea rows=10 cols=50>"
	+"      time       [A]       [B]       [C]\n"
	+"         0    0.5000    0.7072         0\n"
	+"      1.00    0.3353    0.6249    0.0823\n"
	+"      2.00    0.2339    0.5742    0.1331\n"
	+"      3.00    0.1673    0.5409    0.1664\n"
	+"      4.00    0.1217    0.5180    0.1892\n"
	+"      5.00    0.0895    0.5020    0.2052\n"
	+"      6.00    0.0664    0.4904    0.2168\n"
	+"      7.00    0.0496    0.4820    0.2252\n"
	+"      8.00    0.0372    0.4758    0.2314\n"
	+"      9.00    0.0280    0.4712    0.2360\n"
	+"     10.00    0.0211    0.4678    0.2395\n"
	+"     11.00    0.0159    0.4652    0.2420\n"
	+"     12.00    0.0120    0.4632    0.2440\n"
	+"     13.00    0.0091    0.4618    0.2454\n"
	+"     14.00    0.0069    0.4607    0.2465\n"
	+"     15.00    0.0052    0.4598    0.2474\n"
	+"     16.00    0.0040    0.4592    0.2480\n"
	+"     17.00    0.0030    0.4587    0.2485\n"
	+"     18.00    0.0023    0.4584    0.2489\n"
	+"     19.00    0.0017    0.4581    0.2491\n"
	+"     20.00    0.0013    0.4579    0.2493\n"
	+"</textarea></form></center>"
	,"")
	newCI("concentration changes, and reaction rates","_data1")
	newCI("reaction rates, and concentration changes","_data1")
//	newCI("_cr1","$FILE","../js/explore/tiny4.htm?QONLY")

newCI("_graph1","While data tables are useful, most informative are graphs of concentration vs. time.|"
	+"These graphs are particularly useful for visualizing what is going on in a reaction. Note that reactants decrease in concentration while products increase in concentration as the reaction proceeds. "
	+"Take a look at Exploration $EXP(tiny5) to see how data relating to concentration can be graphed. Notice how the reaction starts quickly but then slows down and never really seems to ever be \"finished.\""
	,"tiny4.gif")
	newCI("graphs of concentration vs. time","_graph1")
//	newCI("_cc1","$FILE","../js/explore/tiny5.htm?QONLY")

newCI("_rate1","It is the <b>rate of change in concentration</b> that turns out to be most closely related to the rate of a chemical reaction. That is why graphs of concentration vs. time are particularly useful. On these graphs, \"rate of change in concentration\" is the slope of the curve at a specific time. "
	+"The rates of change in concentration of reactants are negative; the rates of change in concentration of products is positive. It is convenient to work with the <b>initial rate of change in concentration</b>, because it is at the beginning of the reaction when we can be most sure of what the concentrations are.|"
	+"Work though the questions in the Exploration $EXP(tiny7). Notice that the relative magnitude of the coefficients of the overall chemical equation (the reaction <b>stoichiometry</b>) is related to the rates of change in concentration of reactants and products during the reaction. For example, in this case, the rate of disappearance of A is twice the rate of disappearance of B. That's because the the reaction involves 2 moles of A reacting for every 1 mole of B. "
	,"tiny7.gif")
	newCI("rate, of change in concentration","_rate1")
	newCI("rate, initial","_rate1")
	newCI("concentration changes, and overall reaction stoichiometry","_rate1")
	newCI("reaction stoichiometry, and concentration changes","_rate1")

newCI("_ratec1","|At any time during the reaction, we see that the \"instantaneous\" rate of change in concentration of a species is directly related to its coefficient in the overall chemical equation. This leads to a simple idea for the \"rate\" of the reaction: We simply divide the rate of change in concentration of any species by its coefficient."
	,"tiny7a.gif"
	,"|Since rates of change in concentration of reactants is always negative, for reactants we also multipy by &minus;1 so that the \"reaction rate\" is always defined as a positive number.<br><center><IMG rate1.gif></center>"
	+"In this particular case, the reaction rate after 2 seconds is 0.042 mol/liter per second. "
	+"Exploration $EXP(tiny9) illustrates takes a look at how reaction rates are determined experimentally."
	,"tiny7a.gif"
	)
	newCI("rate, instantaneous","_ratec1")
	newCI("concentration changes, and overall reaction stoichiometry","_ratec1")
	newCI("reaction stoichiometry, and concentration changes","_ratec1")
	newCI("rate, reaction","_ratec1")

//	+"It is common to use \"average\" rather than \"instantaneous\" rates of change."
//	newCI("rate, average","_ratec1")

newCI("_time1","<IMG tiny7b.gif><br>Both the concentration of a reactant and its rate of disappearance decrease with time. "
	+"The rates of change in concentration of both reactants and products approach zero as the reaction proceeds. That is, the reaction slows down as time goes on. But does the reaction ever truly end? An interesting philosophical question! "
	+"Could there be some relatively simple relationship between rate of change in concentration (slope) and time?"
	,"")
	newCI("concentration changes, decrease over time","_time1")

newCI("_ss1","<IMG tiny7a.gif><br>It is important to note that the definition of reaction rate involves a subtle implication."
	+"The subtlety is called the <b>steady-state approximation</b>, which argues that the only significant species in solution during a reaction are reactants and products. "
	,"rate.gif"
	,"<IMG tiny7a.gif><br>For now, we will accept the steady-state approximation, but later we will take a second look at it. We will see that it is possible to have species that are not reactants or products in solution during a reaction. "
	+"These transient species are called <b>intermediates</b>, and they are important in understanding what exactly is going on in a reaction."
	,"")
	newCI("steady-state approximation","_ss1")
	newCI("intermediates","_ss1")

addScript("Rates of Change in Concentration of Reactants and Products","*")


//Rate Laws and Reaction order 
addScript(2)

newCI("_law2","Our first approach to understanding what is going on behind the scenes in a chemical reaction "
	+"begins with the <b>empirical rate law</b>. <i>Empirical</i> means \"determined experimentally\" and "
	+"emphasizes that these laws are derived from data, not theory. The idea is to do one or more carefully selected "
	+"experiments, and from the findings of those reactions determine the relationship between reaction rate and concentrations. "
	+"The simplest form of an empirical rate law is shown below:|"
	+"The parameter <i>k</i> is the <b>rate constant</b> for the reaction. "
	+"Concentrations of reactants are taken to powers that are determined experimentally. "
	+"The exponents of the concentrations, <i>x</i> and <i>y</i> in this case, " 
	+"can be just about anything, but the most common values are 0, 1, and 2. These are the only values we will consider here. "
	+"The units of <i>k</i> are dictated by the exponents so that, overall, the right-hand side ends up with units of concentration per unit of time."
	,"rlaw.gif"
	,"|The left-hand side of the rate law is the same \"reaction rate\" that is related to rates of change in concentration of reactants and products."
	,"rlaw1.gif")
	newCI("empirical rate law, definition","_law2")
	newCI("rate, constant","_law2")

newCI("_lawk2",	"|The coefficients in the overall chemical equation, the value of <i>k</i>, and the reaction rate itself all depend upon what exact overall chemical equation "
	+"happens to have been chosen to represent the reaction. "
	+"The larger the coefficients used in the chemical equation, the smaller the value of <i>k</i>, so that \"reaction rate\" calculates to be the same value regardless of which equation is used."
	,"rlaw3.gif"
	,"|In these two equations, the concentrations, the exponents, and the rates of change in concentation are all independent of the overall chemical equation chosen to represent the reaction. "
	+"If you think about it, they have to be--they are intrinsic to the <a>reaction</a>, not the <a>equation</a> we choose to describe it. It is important to understand that <b>the exponents in "
	+"a rate law and the coefficients in the overall chemical equation are two completely different sets of numbers.</b>"
	,"rlaw2.gif")
	newCI("empirical rate law, dependencies","_lawk2")

newCI("_order2","Empirical rate laws and their associated reactions are said to be of a certain <b>order</b> in specific species and overall based on the exponents. A reaction is said to be \"first order in A\" if the exponent of [A] is 1 and \"second order in A\" if the exponent of [A] is 2. "
	+"A reaction is \"zero order in A\" if [A] does not appear in the rate law (because [X]<sup>0</sup>&nbsp;=&nbsp;1). The <b>overall order</b> for a reaction is the sum of the exponents in its rate law. Examples are given below for a reaction with overall chemical equation 2A + B --> C."
	+"<p><table>"
	+"<tr><td nowrap><b><i>reaction rate</i> = <i>k</i>[A]</b></td><td valign=top>first order in A, zero order in B, first order overall.</td></tr>"
	+"<tr><td nowrap><b><i>reaction rate</i> = <i>k</i>[A][B]</b></td><td valign=top>first order in A, first order in B, second order overall.</td></tr>"
	+"<tr><td nowrap><b><i>reaction rate</i> = <i>k</i>[A][B]<sup>2</sup></b></td><td valign=top>first order in A, second order in B, third order overall.</td></tr>"
	+"<tr><td nowrap><b><i>reaction rate</i> = <i>k</i>[A]<sup>2</sup>[B]<sup>2</sup></b></td><td valign=top>second order in A, second order in B, fourth order overall.</td></tr>"
	+"</table>"
	,"")
	newCI("empirical rate law, reaction order","_order2")

newCI("_rl2","A fundamental idea of kinetics is that rate laws can be used "
	+"to predict the course of a reaction. The sorts of questions we wish to be able answer go something like this:"
	+"<ul>"
	+"<li>\"What will be the effect on the rate of a chemical reaction of doubling the concentration of species A?\""
	+"<li>\"How long will it take to react half of the reactant?\" "
	+"</ul>"
	+"Exploration $EXP(ratelaw) takes a look at the effect of changes in the rate law on reaction kinetics. "
	+"Try different values for the exponents and the rate constant. What are all the different ways you can make the reaction go faster or slower?"
	,"rlaw.gif")
	newCI("empirical rate law, usefulness","_rl2")

addScript("Empirical Rate Laws and Reaction Order","*")

newCI("_ir2","|The rate law for a reaction must be determined experimentally. A classic technique, the <b>method of initial rates</b>, is illustrated in Exploration $EXP(ratelaw1). "
	+"The basic idea is to carry out several reactions that differ only by one reactant at a time. "
	+"By carefully noting the effect on the reaction rate of changing a reactant concentration, we can learn what the exponent for that reactant is in the rate law. The following example illustrates the process."
	,"rlaw.gif"
	,"|We need to determine <i>k</i>, <i>x</i>, and <i>y</i> in the rate law. We start with a known overall equation for the reaction. One of these reactants or products must be able to be monitored in some way so that we can determine its concentration. In this case, we'll pick the product, C."
	,"rlawk2.gif"
	,"|We select starting conditions with a specific initial concentration of A and B, carry out the reaction, and determine the <b>initial</b> rate of change in concentration of C. "
	,"rlawk3.gif"
	,"|We then change the initial concentrations of A and again measure the initial rate of change in concentration of C. In this, case, the fact that when [A] is doubled, d[C]/dt doubles, indicates the <i>x</i> is 1."
	,"rlawk4.gif"
	,"|Repeating this process for B, we discover that its exponent is 2. Note that these exponents bear no connection to the coefficients in the overall equation for the reaction."
	,"rlawk5.gif"
	,"|To solve for <i>k</i>, we select one of the experiments. In this case the rate of the reaction is equal to (1/2)d[C]/dt (because C is a product, and its coefficient is 2). "
	+"Filling in all the known information, we can now solve for <i>k</i>."
	,"rlawk6.gif"
	,"|Units are chosen to be <i>M</i><sup>&nbsp;&minus;2</sup><i>s</i><sup>&nbsp;&minus;1</sup> so that when multiplied by <i>M</i><sup>&nbsp;3</sup> from [A][B]<sup>2</sup> the result is mol/liter/s. Ready to try it yourself? See Exploration $EXP(quiz1)."
	,"rlawk7.gif")
	newCI("empirical rate law, determined using the method of initial rates","_ir2")
	newCI("method of initial rates","_ir2")

addScript("Determining the Rate Law Using the Method of Initial Rates","*")

newCI("_irl2","The rate law for a reaction does not just define the first few moments during the initial stage of a reaction. "
	+"Indeed, employing integral calculus we can use the rate law to get a function that describes the entire course of a reaction. "
	+"While any reaction can be analyzed this way, we will look specifically at <b>integrated rate laws</b> of the simplest sort, involving just a single reactant. Only three reaction orders will be discussed: "
	+"<p><table cellspacing=3>"
	+"<tr><td nowrap>  (&minus;1/<i>a</i>)<i>d</i>[A]/<i>dt</i> = <b><i>reaction rate</i> = <i>k</i></b></td><td valign=top>zero order</td></tr>"
	+"<tr><td nowrap>  (&minus;1/<i>a</i>)<i>d</i>[A]/<i>dt</i> = <b><i>reaction rate</i> = <i>k</i>[A]</b></td><td valign=top>first order</td></tr>"
	+"<tr><td nowrap>  (&minus;1/<i>a</i>)<i>d</i>[A]/<i>dt</i> = <b><i>reaction rate</i> = <i>k</i>[A]<sup>2</sup></b></td><td valign=top>second order</td></tr>"
	+"</table>"
	+"Although most reactions involve more than one reactant, we'll illustrate a technique that allows us to determine the order of one reactant at a time, thus effectively determining the entire rate law for a reaction."
	,""
	,"Recall what we know about a reaction when we start employing kinetics:"
	+"<p><table cellspacing=3>"
	+"<tr><td valign=top>(1)</td><td valign=top>an overall chemical equation for the reaction:</td><td valign=top>aA + bB --> cC</td></tr>"
	+"<tr><td valign=top>(2)</td><td valign=top>the definition of reaction rate:</td><td valign=top>reaction rate = &minus;(1/a)<i>d</i>[A]/<i>dt</i></td></tr>"
	+"<tr><td valign=top>(3)</td><td valign=top>a proposed rate law for the reaction:</td><td valign=top>reaction rate = [A]<sup><i>x</i></sup>[B]<sup><i>y</i></sup></td></tr>"
	+"<tr><td valign=top>(4)</td><td valign=top>known starting conditions:</td><td valign=top>[A]<sub>o</sub>, [B]<sub>o</sub>, [C]<sub>o</sub> </td></tr>"
	+"</table>"
	+"<p>Our goal is to discover the function that relates concentration to time. Our process begins by making a guess at what <i>x</i> and <i>y</i> might be. We then set (2) equal to (3) and solve the resultant calculus equation using (4) as boundary conditions. "
	+"To illustrate the technique, we start with the simplest of situations: <i>x</i>=0, <i>y</i>=0 (zero-order rate law). "
	,""
	,"For a zero-order rate law, we can write:|Thus, for a zero-order reaction, the concentration of A simply decreases linearly until all of the A is gone. Plotted as [A] vs. time, we should see a straight line with slope equal to &minus;<i>ka</i>."
	,"i0.gif"
	,"If the reaction really <i>is</i> zero-order, then we should be able to plot the data as [A] vs. time and see a well-fit straight line with a slope of &minus;<i>ka</i>. If the graph doesn't look like a straight line, we simply don't have a zero-order reaction! Shown here are two hypothetical reactions involving NO<sub>2</sub>."
	,"i0graph.gif")
	newCI("integrated rate law","_irl2")
	newCI("integrated rate law, zero-order reactions","_irl2.2")
	newCI("empirical rate law, integrated zero-order","_irl2.2")

addScript("Integration of Rate Laws: Zero-Order Reactions","*")

newCI("_first2","Integration of the first-order rate law uses the fact that <i>d</i>[ln(<i>x</i>)]/<i>dx</i> = 1/<i>x</i>. |For a first-order reaction, if we plot ln[A] vs. time, we should see a straight line with slope &minus;<i>ka</i>."
	,"i1.gif"
	,"If the reaction really <i>is</i> first-order, then we should be able to plot the data as ln[A] vs. time and see a well-fit straight line with a slope of &minus;<i>ka</i>. Shown here are two hypothetical reactions involving NO<sub>2</sub>."
	,"i1graph.gif"
	,"|A little rearranging of the first-order integrated rate law shows that [A] as an exponentially decreasing function of time:"
	,"i1b.gif"
	,"|For first-order reactions, the <b>half-life</b> of the reaction is constant. That is, the amount of time necessary for half of the reactant to be consumed in a first-order reaction is independent of the amount of material present. It is simply ln(2)/<i>ka</i>. "
	,"i1c.gif"
	,"This suggests a very quick way of determining--or at least estimating--the value of <i>k</i> simply by inspecting a graph of [A] vs. time. "
	+"One simply finds the time that the concentration of A is half its original value, then, provided the coefficient of the species in the overall chemical equation is 1, we just divide ln(2) by this time to get a value for <i>k</i>. Take a look at Exploration $EXP(t12)."
	,"i1graph2.gif")
	newCI("integrated rate law, first-order reactions","_first2")
	newCI("empirical rate law, integrated first-order","_first2")
	newCI("half-life, for first-order reactions","_first2.3")

//o 	Exploration: First-Order Reactions and First-Order Half Lives
//o 	Exploration: Determining the Rate Constant For a First-Order Reaction By Plotting Ln[X] Vs. Time 

addScript("Integrated Rate Laws and First-Order Reactions","*")

newCI("_second2","Integration of the second-order rate law uses the fact that <i>d</i>[1/(<i>x</i>)]/<i>dx</i> = &minus;1/<i>x</i><sup>2</sup>. "
	+"|For a second-order reaction, if we plot 1/[A] vs. time, we should see a straight line with slope <i>ka</i>."
	,"i2.gif"
	,"If the reaction really <i>is</i> second-order, then we should be able to plot the data as 1/[A] vs. time and see a well-fit straight line with a slope of <i>ka</i>. "
	+"Shown here are two hypothetical reactions involving NO<sub>2</sub>."
	,"i2graph.gif")
	newCI("integrated rate law, second-order reactions","_second2")
	newCI("empirical rate law, integrated second-order","_second2")

//o 	Exploration: Second-Order Reactions, and Second-Order Half Lives
//o 	Exploration: Determining the Rate Constant For a Second-Order Reaction By Plotting 1/[X] Vs. Time.

addScript("Integrated Rate Law for Second-Order Reactions","*")

newCI("_lawc2","A simple way of determining the order for a reaction is to make THREE plots:"
	+"<table cellspacing=3>"
	+"<tr><td>[A] vs. <i>time</i></td><td><i>reaction rate</i> = <i>k</i></td><td>zero order</td><td>slope = &minus;<i>ka</i></td></tr>"
	+"<tr><td>ln[A] vs. <i>time</i></td><td><i>reaction rate</i> = <i>k</i>[A]</td><td>first order<i></td><td>slope = &minus;<i>ka</i></td></tr>"
	+"<tr><td>1/[A] vs. <i>time</i></td><td><i>reaction rate</i> = <i>k</i>[A]<sup>2</sup></td><td>second order</td><td>slope = <i>ka</i></td></tr>"
	+"</table><p>"
	+"Try $EXP(quiz3) or $EXP(quiz4) to see how this works."
	,"i3graph.gif")
	newCI("empirical rate law, determining graphically","_lawc2")

//o 	Exploration: Determining the Rate Law By Plotting [X] Vs. Time, ln[X] Vs. Time, and 1/[X] Vs. Time

addScript("Determining the Rate Law Using Integrated Rate Laws","*")

newCI("_pseudo2","When the rate law involves concentrations of more than one species, there is a problem with integrating the rate law. "
	+"If both [A] and [B] are changing, then we can't separate variables in order to do the integration. One way around this problem "
	+"is to make sure one of the species' concentrations is so much larger than the other's that it is \"effectively\" constant throughout the reaction. "
	+"That is, its concentration will change, but by so little there won't be any significant error in just considering it constant. "
	+"The resultant \"constant\" <i>k'</i> is called a <b>pseudo-first-order rate constant</b> if <i>x</i> is 1. |"
	+"When the reaction is carried out, <i>x</i> can be determined. Similarly, <i>y</i> can be determined by keeping [A] relatively constant and following the change in [B] vs. time. "
	+"In the end, <i>k</i> can be determined from <i>k'</i>. Exploration $EXP(pseudo) takes a look at pseudo-first-order reactions."
	,"pseudo.gif")
	newCI("empirical rate law, pseudo-order reactions","_pseudo2")
  
addScript("Integration of More Complicated Rate Laws: Pseudo Order","*")


//Temperature Dependence of Reaction Rates
addScript(3)

newCI("_arrh3","Most reactions go faster at higher temperature. The effect of increasing the temperature is an increase in the value of the rate constant, <i>k</i>. Check this out with Exploration $EXP(temp)."
	,"arate.gif"
	,"|While there is no obvious, simple function that relates <i>k</i> to temperature, many reactions have been found to roughly follow the <b>Arrhenius equation</b>. Two parameters are involved, the <b>pre-exponential factor</b> <i>A</i> and the <b>activation energy</b>, <i>E</i><sub>a</sub>. These \"empirical parameters\" are different for different reactions and must be determined experimentally--in the lab."
	,"arrhen1.gif"
	,"|A graph of ln <i>k</i> vs. <i>T</i> (in Kelvin) allows determination of both <i>A</i> and <i>E</i><sub>a</sub>."
	,"arrhen2.gif"
	,"If we know the rate constant for a reaction at two different temperatures, we can estimate the activation energy for the reaction. Then, using that information, we can estimate the rate constant at another temperature."
	,"arrhen2b.gif")
	newCI("temperature, effect on reaction rate","_arrh3")

//o 	Exploration: Effect of Changes in Reaction Conditions: Temperature

addScript("Higher Temperature Generally Leads To Faster Reactions","*")

newCI("_teff3","|The real question is, what exactly are <i>A</i> and <i>E</i><sub>a</sub>?"
	,"arrhen1.gif"
	,"|There are many ways to explain the significance of <i>A</i> and <i>E</i><sub>a</sub>. One method uses a classical <b>collision model</b>. "
	+"Another, based on a slightly different model, is described here. It involves the <b>Boltzmann distribution</b> of energy in a system. " 
	+"The essence of the model is as follows:"
	+"<ul>"
	+"<li>Virtually all chemical reactions can be seen as an extension of a single <b>molecular vibration</b>. Basically, if a molecule has enough vibrational energy, it will split apart. Two molecules coming together can be seen as a vibration \"in reverse.\"<p>"
	+"<li>Two factors go into making a reaction happen: <b>entropy</b> and <b>energy</b>. <p>"
	+"</ul>"
	,"arrhen1.gif"
	,"|<ul>"
	+"<li>Entropy effects show up in the <b>pre-exponential factor, <i>A</i></b>, which is particularly important at high temperature. Entropy effects involve molecules finding the right orientation to react and the probability that the energy will find its way to the right vibrational \"mode.\"<p>"
	+"</ul>"
	,"arrhen1a.gif"
	,"|<ul>"
	+"<li>Energy effects show up in the <b>activation energy, <i>E</i><sub>a</sub></b>, which is especially important at lower temperatures. The lower the temperature, the less likely it is for a molecule to have enough energy to react--to turn a molecular vibration into a dissociation.<p>"
	+"</ul>"
	,"arrhen1e.gif"
	,""
	,"arrhen3.gif"
	,""
	,"arrhen3b.gif"
	,""
	,"arrhen4.gif"
	,"|The <b>transition state</b> includes aspects of both energy and entropy. We say that to go from reactants to products (or vice-versa), individual molecules must go though the \"transition state.\" By that, we mean that they must have enough energy. In addition, that energy must be in the right \"mode.\" "
	+"A common way of referring to the right mode is to say that the molecules involved must have the correct \"orientation\" to react, but it's really more than that. The <i>energy</i> in the molecules must also be present in a form that is productive to reaction."
	,"arrhen5.gif"
	)	
	newCI("temperature, entropy and energy","_teff3")
	newCI("Boltzmann, and temperature effect","_teff3.4")
	newCI("temperature effect, and Boltzmann distributions","_teff3.4")
	newCI("reaction coordinate diagram","_teff3.5")
	newCI("transition state","_teff3.6")

addScript("The Boltzmann Model","*")


////Explaining and Interpreting the Data

//skipping this.... I love it, but probably it's a bit too confusing to present.

//Probability and Reactivity
//addScript(4)

//addScript("Relative Rate (DELTA_[X]/[X] / DELTA_t) and the Probability of Reaction")
//o 	Exploration: a Simple Probability-Based Reaction
//addScript("Relative Rate is Constant for a First-Order Reaction")
//o 	Exploration: Radioactive Decay
//addScript("Relative Rate is Proportional to [X] for a Second-Order Reaction")
//o 	Exploration: Reaction Requiring a Partner

//addScript("Temperature and Reactivity")
//o 	Exploration: the Boltzmann Law and “Activation Energy”
//o 	Exploration: the Arrhenius Equation


//Mechanisms and Elementary Steps
addScript(4)

newCI("_mech4","A <b>reaction mechanism</b> is a detailed, step-by-step accounting of how a chemical reaction occurs. "
	+"In a mechanism we use equations to describe the fates of individual <i>molecules</i>. The idea is to see the "
	+"overall reaction as a series of one or more individual <b>mechanistic steps</b>, each of which may or may not "
	+"be considered to be <b>reversible</b> or <b>irreversible</b>. Each mechanistic step is thought to have its own rate constant. Reversible mechanistic steps have two rate constants, one for the forward reaction and one for the reverse reaction. "
	+"|Our goal in looking at mechanisms is to rationalize (explain after the fact) " 
	+"the empirical rate law determined in the lab. Thus, mechanisms are \"proposed\"--they are hypotheses--and can be tested experimentally. "
	+"One important characteristic of a proposed mechanism is that it sum to give the overall chemical equation for the reaction we are studying. "
	,"mech.gif"
	) 
	newCI("reaction mechanism","_mech4")

addScript("Reaction Mechanisms","*")

newCI("_uni4","|Mechanistic steps fall into two basic categories: <b>unimolecular</b> and <b>bimolecular</b>. "
	+"Unimolecular mechanistic steps involve only a single molecule of reactant. Examples of unimolecular steps are <b>isomerization</b>, whereby one species converts to another directly, and <b>dissociation</b>, whereby one species splits up to give two others."
	,"mech1.gif"
	,"|Bimolecular mechanistic steps involve two molecules coming together to react. Examples of bimolecular steps include <b>dimerization</b>, whereby two of the same species join together to make a new bond, <b>disproportionation</b>,whereby two of the same species come together, exchange one or more atoms, and leave as two distinct species, "
	+"<b>bond formation</b>, whereby two species come together to make a third, and <b>displacement</b>, in which two different species come together, exchange one or more atoms, and leave as two new species."
	,"mech2.gif"
	,"|\"Termolecular mechanistic steps,\" involving three molecules coming together to react all at the same moment are essentially unheard of. It's just too improbable for such a reaction to happen. Basically, before a termolecular reaction could occur, something else will happen."
	,"mech3.gif"
	,"|The idea of a mechanism is to use only unimolecular and bimolecular steps to explain how a reaction occurs. As we shall see, the rate law for a reaction can be determined from a proposed mechanism. It is the testing of this rate law experimentally that can support or disprove a proposed mechanism for a reaction."
	,"mech4.gif"
	)
	newCI("unimolecular steps","_uni4")
	newCI("bimolecular steps","_uni4.1")

addScript("Unimolecular and Bimolecular Elementary Steps","*")

newCI("_s4","The simplest reaction mechanism consists of a just a single irreversible mechanistic step. "
	+"For reactions involving only a single mechanistic step, the rate of the reaction is defined explicitly by the <b>molecularity</b> of that single step. "
	+"We simply write the rate law based on what we see in that step. Notice that the products do not appear in the rate law, because the steps are irreversible. "
	,"single.gif"
	)
	newCI("reaction mechanism, just one irreversible step","_s4")

addScript("Single-Step Irreversible Reaction Mechanisms","*")

newCI("_i4","When two reaction steps are involved, then it gets interesting! The first step often involves the formation of an <b>intermediate</b>, which then continues to react to form the product. "
	+"An intermediate is a species that is produced in one step and then consumed in a later mechanistic step so that, overall, it doesn't show up in the chemical equation describing the reaction. "
	+"Take a look at Exploration $EXP(inter) to see what will happen in this case." 
	,"inter.gif"
	,"When a reaction consists of multiple steps, species will be formed during the reaction that are not products of the reaction. We call these species <b>intermediates</b>. "
	+"During the initial stage of a multi-step reaction, the concentrations of intermediates increase, then, later, the concentrations of intermediates slowly decrease. "
	+"Technically, in multi-step reactions, the definition of \"reaction rate\" is incorrect."
	,"irate.gif"
	,"Nonetheless, after an initial stage of the reaction, the concentrations of intermediates stabilize at relatively low levels, and the definition of reaction rate is <i>roughly</i> usable. "
	+"This second stage of the reaction is said to be a <b>steady state</b>, where reactants are entering the reaction, products are leaving, and intermediate concentrations are low and relatively steady."
	,"irate2.gif"
	,"In a multi-step reaction, we call the first <i>irreversible</i> step the <b>rate-determining step</b> because the entire reaction rate is determined by this one step. Check Exploration $EXP(inter2) to see how this works."
	,"inter2.gif"
	)
	newCI("reaction mechanism, multistep reactions","_i4")
	newCI("intermediate","_i4.1")
	newCI("steady-state approximation","_i4.2")
	newCI("rate-determining step","_i4.3")

newCI("_clock4","|A classic technique for determining the rate of a reaction without any fancy equipment is called the <b>clock reaction.</b>."
	+"The basic idea is to set up a reaction that \"reveals itself\" after a specific number of seconds. Check Exploration $EXP(clock) for details."
	,"clock.gif"
	,""
	,"clock1.gif"
	,""
	,"clock2.gif"
	,""
	,"clock3.gif"
	,""
	,"clock4.gif"
	,""
	,"clock5.gif"
	,"|Fun! See Exploration $EXP(clock1) for the starch effect."
	,"clock6.gif"
)
	newCI("clock reaction","_clock4")

addScript("Multi-Step Reaction Mechanisms: Intermediates and the Rate-Determining Step","*")

//o 	Exploration: a Two-Step Reaction Involving An Intermediate
//o 	Exploration: Establishing a Steady State
//o 	Exploration: Identifying the Rate-Determining Step

newCI("_preeq4","|Sometimes one or more of the first steps of a reaction are <b>reversible</b>. In that case, another interesting phenomenon appears. Check this out with Exploration $EXP(preeq)."
	,"preeq.gif"
	,"|To determine the rate law associated with this proposed mechanism, we first write the law for the rate-determining step. Unfortunately, it contains an intermediate. "
	,"preeq1.gif"
	,"|Using the <b>pre-equilibrium approximation</b>, that a fast reversible first step is similar to an equilibrium, we solve for the concentration of the intermediate. The idea is that if the second step is slow enough, we can ignore it for the purposes of determining the concentration of the intermediate."
	,"preeq2.gif"
	)
	newCI("pre-equilibrium","_preeq4")

addScript("Fast Early Reversible Steps and Pre-Equilibrium","*")
//o 	Exploration: Pre-Equilibrium
//o 	Exploration: Determining the Theoretical Rate Law


//Special Topics
addScript(5)

newCI("_pi5","|<b>Product inhibition</b> arises in situations where one of the products of the overall reaction is formed in an early reversible step."
	,"inhibit1.gif"
	,"|The result of being a product of an early reversible step is that the product has negative order in the rate law. An increase in product concentration results in a <i>decrease</i> in the rate of the reaction." 
	,"inhibit2.gif"
)
	newCI("product inhibition","_pi5")

addScript("Product Inhibition","*")

newCI("_cat5","|A <b>catalyst</b>, as defined in 1894 by Ostwald, is a species \"that accelerates the rate of a chemical reaction without itself being consumed during the reaction.\"<p>"
	+"In terms of mechanism, a catalyst is a species that is a reactant in an early mechanistic step and a product of a later mechanistic step. The concentration of the catalyst appears in the rate law."
	,"cat1.gif"
	,"|The presence of the catalyst makes possible an entirely new lower-energy pathway from reactants to products. The activation energy, <i>E</i><sub>a</sub>, is decreased, and the rate constant <i>k</i> is increased. The pre-exponential entropy factor <i>A</i> is also affected. The result? A faster reaction."
	,"cat2.gif")
	newCI("catalysis","_cat5")

newCI("_enz5","An <b>enzyme</b> is a biological catalyst, usually a <b>protein</b> with very high molecular weight. This one is oxyhemoglobin. "
+getapplet("jmol","","JmolApplet.jar",300,300,"load 1ash.pdb;spacefill 0.4;wireframe off; ; spacefill off; wireframe on;  moveTo 10 851 -361 -381 163.4;;ribbons on;spacefill off;color structure;moveTo 10 -1 -240 971 159.4;;select not protein and not solvent; color blue;spacefill 150; moveTo 10 -866 -495 68 172.3;;select OXY.*;spacefill 200;color red;moveTo 10 935 -258 243 136.2;")
+"|Watch the structure appear slowly. Can you find the O<sub>2</sub>?"
,""
//	,"enz1.gif"
//	,"Actually, there's recognizable stucture there! This is oxyhemoglobin. |Do you see the red <font color=red>O<sub>2</sub></font> attached to the heme group? (With the <a target=_blank href=chime>chime</a> plug-in, this is particularly fun!)"
//	,"enz2.gif"
	,"In terms of mechanism, enzymes are like any catalyst. |Generally at least the first step, formation of the <b>enzyme-substrate complex</b>, is reversible. The rate law is based, as always, on the rate-determining step, which is the second step in this case."
	,"enz3.gif"
	,"For the rate law, we have to consider that neither [E] nor [AE] can be known. |Instead, all we can know is the total amount of enzyme present in solution, [E]<sub>total</sub>. To properly derive the rate law, we consider the system to be a steady state, so <i>d</i>[AE]/<i>dt</i> = 0."
	,"enz4.gif"
	,"Now what?|Setting the rate of change in concentration of the enzyme-substrate complex to be the sum of all of the rate laws of all the steps it's involved in, we can solve the two simultaneous equations for [AE]."
	,"enz5.gif"
	,"The rate law can be understood in terms of different situations."
	,"enz6.gif"
	,"When the concentration of substrate is high, the rate is independent of [A]."
	,"enz7.gif"
	,"The result is that at high concentration of substrate, the rate \"maxes out.\" |We say the enzyme is \"saturated.\" Basically, essentially all the enzyme is in the complexed form, and that form can only react so fast. If it weren't for enzyme saturation, when you eat a candy bar, you would burn up!"
	,"enz8.gif"
	)
	newCI("catalysis, and enzymes","_enz5")
	newCI("enzymes, and catalysis","_enz5")

addScript("Catalysis and Enzymes","*")
//o 	Exploration: Product Inhibition
//o 	Exploration: Catalyst Saturation


newCI("_exp5","|An <b>explosion</b> is a rapid exothermic chemical reaction within a confined space. Typically, an explosion involves some sort of <b>positive feedback</b>, which involves a product also being a reactant in the reaction."
	,"explode1.gif"
	,"|"
	,"explode2.gif"
	,"|See Exploration $EXP(explode) for a demonstration."
	,"explode3.gif"
	)
	newCI("explosions, and positive feedback","_exp5")
	newCI("positive feedback, and explosions","_exp5")

newCI("_osc5","A reaction with a heartbeat? <b>Oscillating reactions</b> are very curious beasts. While the mechanisms of real oscillating reactions are largely unknown, several mechanisms have been proposed." 
	,"oscilate.gif"
	,"|One of the simplest is the Lottka-Volterra model, which involves two positive-feedback steps. "
	,"oscilate1.gif"
	,"|"
	,"oscilate2.gif"
	,"|"
	,"oscilate3.gif"
	,"|"
	,"oscilate4.gif"
	,"|see Explorations $EXP(oscil2) and $EXP(oscil) for a demonstration."
	,"oscilate5.gif"
	)
	newCI("oscillating reactions, and positive feedback","_osc5")
	newCI("positive feedback, and oscillating reactions","_osc5")

addScript("Positive Feedback","*")
//o 	Exploration: An Explosion
//o 	Exploration: An oscillating Reaction


Practice[1]=new Array(""
,"Working with $EXP(tiny7), confirm that you understand the relationship between the rate of change of concentration of a reactant or product in a reaction and its coefficient in the overall chemical equation used to represent the reaction. Try also $QUIZ(t1quiz.rg1)"
,"Using $EXP(tiny8), confirm that you understand the difference between <b>instantaneous</b>, <b>average</b>, and <b>initial</b> rate of change in concentration."
,"Using $EXP(tiny9) or $QUIZ(t1quiz.rr1), confirm that you understand the definition of <b>reaction rate</b> and how it relates to rates of change in concentration of reactants and products of a reaction."
,"See if you know how to measure the rate of change of concentration graphically using $QUIZ(t1quiz.rc1) or $QUIZ(t1quiz.rcr1)."
)

Practice[2]=new Array(""
,"What is a \"$CON(_law2,rate law)\"? See also $QUIZ(t2quiz.rl2)."
,"What is \"$CON(_order2,reaction order)\"? See $QUIZ(t2quiz.ro2) and $QUIZ(t2quiz.rro2)."
,"What is the \"$CON(_ir2,method of initial rates)\" and how does it work to get us the rate law for a reaction? See $EXP(quiz1) or $QUIZ(t2quiz.ir2)."
,"What is the integrated form of a $CON(_irl2.2,zero-order rate law)?"
,"How can you tell if a reaction is $CON(_irl2.3,zero order) using the integrated rate law?"
,"What is the integrated form of a $CON(_first2,first-order rate law)?"
,"How can you tell if a reaction is $CON(_first2.1,first order) using the integrated rate law?"
,"What is a \"$CON(_first2.3,half life)\"? Using $EXP(t12), test yourself over using the half life to estimate the value of the rate constant in a first-order reaction."
,"What is the integrated form of a $CON(_second2,second-order rate law)?"
,"How can you tell if a reaction is $CON(_second2.1,second order) using the integrated rate law?"
,"Quiz yourself over determining the rate law of a reaction using $EXP(quiz3) and $EXP(quiz4)."
)

Practice[3]=new Array(""
,"How is the rate constant for a reaction dependent upon $CON(_arrh3.1,temperature)? See $QUIZ(t3quiz.kt3) and $QUIZ(t3quiz.ke3)."
,"How can one determine the $CON(_arrh3.2,activation energy of a reaction) experimentally? See $QUIZ(t3quiz.kd3)."
,"How does $CON(_teff3.2,entropy) play a role in the rate of chemical reactions?"
,"How does $CON(_teff3.3,energy) play a role in the rate of chemical reactions?"
,"Why does $CON(_teff3.4,increasing the temperature of a reaction) speed it up? See $QUIZ(t3quiz.kb3)."
,"What is a $CON(_teff3.6,reaction coordinate diagram)?"
,"What is a $CON(_teff3.7,transition state)?"
)

Practice[4]=new Array(""
,"What is a \"$CON(_mech4,reaction mechanism)\"? Practice determining the overall equation with $QUIZ(t4quiz.mo4)."
,"What are \"$CON(_uni4,unimolecular reaction step)\" and \"$CON(_uni4.1,bimolecular)\" reaction steps? For practice, see $QUIZ(t4quiz.mmm4)."
,"What is an \"$CON(_i4,intermediate)\"? See $QUIZ(t4quiz.mi4)."
,"How does the presence of an intermediate change the $CON(_i4.1,definition of reaction rate) for a reaction?"
,"What is a \"$CON(_i4.3,rate-determining step)\"? Practice determining the rate law for multi-step reactions using $QUIZ(t4quiz.ml4)"
,"What is the principle behind a \"$CON(_clock4,clock reaction)\"?"
,"How do we write the rate law when there is are $CON(_preeq4.1,early reversible steps) in a mechanism?"
,"How does the $CON(_preeq4.2,pre-equilibrium approximation) simplify the rate law in the case of mechanisms with early reversible steps? Practice determining the rate law using the pre-equilibrium approximtaion using $QUIZ(t4quiz.mml4)."
)

Practice[5]=new Array(""
,"What is \"$CON(_pi5,product inhibition),\" and how does it arise?"
,"What is the evidence of $CON(_pi5.1,product inhibition) in an experimentally determined rate law? See $QUIZ(t5quiz.me5)."
,"What is a \"$CON(_cat5,catalyst)\"? See $QUIZ(t5quiz.mc5)."
,"How does the presence of a catalyst $CON(_cat5.1,effect the rate of a reaction)?"
,"What is an \"$CON(_enz5,enzyme)\"?"
,"What is an \"$CON(_enz5.2,enzyme-substrate complex)\"?"
,"What is enzyme \"$CON(_enz5.6,saturation),\" and when does it arise?"
,"What is \"$CON(_exp5,positive feedback)\"?"
,"What is an \"$CON(_osc5,oscillating reaction)\"?"
)
