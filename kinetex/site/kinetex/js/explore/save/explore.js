SimInfo.Exp["tiny1"]=new Array("Simple Visual Comparison of Rates","Shown below are two reactions. Can you tell which one is going faster?"
,"All chemical reactions require some amount of time to proceed."
,"Some chemical reactions are faster than others."
,"Our job is to find a way to discuss chemical reactions in terms of their \"rates,\" and to discover how those observations can shed light on what exactly is going on during the reaction."
)

SimInfo.Exp["tiny4"]=new Array("Adding a Data Table","The reaction going on in the flask is based on the equation 2A + B --> C."
,"There are many ways of \"following\" a reaction. A common method is to look at the changes in color as a reaction proceeds. Different compounds absorb different wavelengths of light to different extents. This allows us to monitor one or more concentrations without disturbing the reaction."
,"The Beer-Lambert law states that the amount of light absorbed is proportional to concentration. (Actually, it's only a reasonably good approximation.)<br><img src=$CDIR/bllaw.gif>"
)

SimInfo.Exp["tiny5"]=new Array("Adding a Graph","The reaction going on in the flask is based on the equation 2A + B --> C."
,"It is quite common to display kinetic data as a graph of concentration vs. time.<br><img src=$CDIR/tiny4.gif>"
,"Reactants appear as decreasing functions of time, while products appear as increasing functions of time."
,"The <i>rate</i> of disappearance of a reactant depends upon its coefficient in the balanced chemical equation for the reaction."
)

SimInfo.Exp["tiny7"]=new Array("Multiple Reactants and Products: Rate of Change as a Slope on a Graph of [X] vs. Time","This reaction is associated with the overall equation 2A + B --> C. "
,"It is important to distinguish between a chemical <i>reaction</i> and the chemical <i>equation</i> we use to describe it. The <i>reaction</i> involves real or simulated chemicals; the <i>equation</i> involves molecular formulas and coefficients."
,"Most reactions slow down as they progress. We could focus on the rate of change at any point in the reaction, but the initial rate of change in concentration is covenient, because the only time we can be sure of the actual concentrations of reactants and products in solution is at the beginning."
,"The relative rates of change in concentration of reactants and products in a chemical reaction depend upon their coefficients in the chemical equation we use to describe the reaction."
,"By comparing the rates at which concentrations change, one can infer the coefficients of the overall chemical equation associated with the reaction.<br><img src=$CDIR/tiny7.gif>"
)

SimInfo.Exp["tiny8"]=new Array("Initial, Instantaneous, and Average Rates",""
,"There are three ways to think about the rate of change in concentrations of reactants and products of a chemical reaction:<ul><li><b>initial rates</b> are calculated at the beginning of a reaction.<li><b>instantaneous rates</b> are calculated at a specific time during a reaction.<li><b>average rates</b> are defined over a range of times."
,"Instantaneous rates of change would be valuable for measuring the rate of a reaction. In the lab, though, we generally have to settle for average rates, because we have to take two measurements at two different times before we can get a slope. The closer in time our two points are, the better we are approximating the instantaneous rate of change in a concentration."
)

SimInfo.Exp["tiny9"]=new Array("The Relation Between the Rate of a Reaction and the Rates of Change of Reactants and Products; Definition of \"Reaction Rate\"",""
,"\"Reaction rate\" and \"rate of change in concentration\" are not quite the same thing, because reactants and products will have different rates of change in concentration depending upon their relative coefficients in the chemical equation. In addition, while rates of change in concentration for reactants are negative, \"rate of reaction\" is defined in such a way as to make it always positive:<p><img src=$CDIR/rate1.gif>"
,"Just as we can refer to the \"initial,\" \"instantaneous,\" and \"average\" rates of change in concentrations, we can also refer to \"initial,\" \"instantaneous,\" and \"average\" rates of reaction."
,"Reaction rates are always positive and typically decrease with time, approaching 0 at infinite time."
,"The units of reaction rate are concentration / time."
)

SimInfo.Exp["ratelaw"]=new Array("The Effect of Rate Law Parameters on Reaction Rate","You may adjust any of the information listed. Then restart the reaction to see the effect."
,"The rate law for a reaction governs the entire course of the reaction:<br><img src=$CDIR/rlaw.gif>"
,"The rate constant <i>k</i> as well as the exponents <i>x</i> and <i>y</i> are quantities that are assumed to be independent of concentrations of reactants and products--a constant throughout the reaction. The units of <i>k</i> are determined by the values of the exponents in such a way as to give an overall reaction rate with units of concentration / time."
,"If a species is in the rate law, changing its concentration will affect the rate of the reaction in a predictable way."
,"If a species is NOT in the rate law, changing its concentration will NOT affect the rate of the reaction."
)

SimInfo.Exp["ratelaw1"]=new Array("The Method of Initial Rates","The reactions shown are identical, with the same rate constant and same rate law. Compare initial rates. Experiment with the effect of changing different parameters."
+"The only differences are the rate constant and the initial concentrations of A and B. "
+"(Click <a href=javascript:location=location>here</a> to try another example.)"
,"Initial rates are particularly useful for discovering the rate law for a reaction in the form<br><img src=$CDIR/rlaw.gif><br>"
,"By changing just one concentration at a time, we can determine one exponent of the rate law at a time."
,"Once the exponents of the rate law are all determined, we can solve for <i>k</i>. This involves a few steps:<br><img src=$CDIR/rlawk.gif><br>Basically, we need to equate \"reaction rate\" as defined in terms of one of the rates of change in concentration to \"reaction rate\" as determined for the rate law. Once this is done, it's a fairly simple matter to put in all the known pieces and solve for <i>k</i>.<br><img src=$CDIR/rlawk1.gif> "
) 

SimInfo.Exp["quiz1"]=new Array("Quiz: Determining the Rate Law and Rate Constant Using the Method of Initial Rates","Change concentrations, start the reaction, and compare initial rates. "
+"(Click <a href=javascript:location=location>here</a> to try another example.)"
,"By systematically changing initial concentrations of reactants and comparing the initial reaction rate, we can determine reaction orders."
,"We have to be careful with reactants or products that do not have 1 as their coefficient in the equation, because of the definition of reaction rate:<br><img src=$CDIR/rate1.gif>"
,"Only once the orders have been determined can we can determine the value of the rate constant, <i>k</i>."
)

SimInfo.Exp["t12"]=new Array("First-Order Rate Constants from Half Lives"
,"(Click <a href=javascript:location=location>here</a> to try another example.)"
,"A quick look at a plot of concentration vs. time can sometimes spot a first-order reaction and at the same time allow an estimation of the rate constant for the reaction.<br><img src=$CDIR/i1graph2.gif>"
,"The key is to look for half-lives. If they are spaced evenly in time, then this is a first-order reaction. The rate constant (times the coefficient of the reactant in the overall chemical equation) is then simply ln(2)/t<sub>1/2</sub>."
)

SimInfo.Exp["quiz3"]=new Array("Quiz: Determining the Rate Law and Rate Constant Graphically (I)"
,"(Click <a href=javascript:Q_shownone()>here</a> to try another example.)"
,"A reaction is first order if the best-fit plot is ln[X] vs. time. In that case, the slope is &minus;<i>ka</i>, where \"a\" is the coefficient of the species in the overall chemical equation chosen to represent the reaction. "
,"A reaction is second order if the best-fit plot is 1/[X] vs. time. In that case, the slope is <i>ka</i>, where \"a\" is the coefficient of the species in the overall chemical equation chosen to represent the reaction. "
,"The half-life is the time required to reduce the amount of species present to 50% of its original value. For a first-order reaction, <i>t</i><sub>1/2</sub> = ln(2)/<i>ka</i>."
,"In the case of second-order and zero-order reactions, the half-life will not be constant." 
)

SimInfo.Exp["quiz4"]=new Array("Quiz: Determining the Rate Law and Rate Constant Graphically (II)",""
,"It is important to plot data in more than one way to really be sure that you have the right rate law."
,"First-order reactions will best fit a plot of ln[X] vs. time. The slope will be &minus;<i>ka</i>, where \"a\" is the coefficient of the species in the overall chemical equation chosen to represent the reaction.<br><img src=$CDIR/1st.gif>"
,"Second-order reacitons will best fit a plot of 1/[X] vs. time. The slope will be <i>ka</i>, where \"a\" is the coefficient of the species in the overall chemical equation chosen to represent the reaction.<br><img src=$CDIR/2nd.gif>"
)

SimInfo.Exp["pseudo"]=new Array("Pseudo-First-Order Reactions","By setting [B] much higher than [A], we make it \"effectively\" constant, and the reaction appears to be first order!"
,"The main idea for pseudo-order reactions is that all except one species' concentration are set very high. During the reaction, although all the concentrations change, only one changes significantly."
,"All of the high, relatively constant concentrations are combined with the rate constant for the reaction into a new \"pseudo-constant\" <i>k'</i>.<br><img src=$CDIR/pseudo.gif>"
,"When the reaction is carried out, it appears to be the order only of the species that is at low concentration. So, for example, if the rate law is <i>rate</i> = <i>k</i>[A][B]<sup>2</sup>, and [B] is high, then the reaction will behave as though it were first-order in A. We would call it <b>pseudo-first-order</b> in A."  
)

SimInfo.Exp["temp"]=new Array("Temperature Effect on Rate Constants","Try different temperatures to see the effect on the rate constant and initial rate of the reaction."
,"Most reactions go faster at higher temperature."
,"The effect of increasing the temperature is an increase in the value of the rate constant, <i>k</i>."
,"There is no obvious, simple function that relates <i>k</i> to temperature. However, many reactions have been found to roughly follow the <b>Arrhenius equation</b><br><img src=$CDIR/arrhen.gif>"
,"A graph of ln <i>k</i> vs. <i>T</i> (in Kelvin) allows determination of both the <b>pre-exponential factor</b>, A, which relates to orientation and entropy, and the <b>activation energy</b>, <i>E</i><sub>a</sub>, which relates to the amount of energy needed to get the reaction going.<br><img src=$CDIR/arrhplot.gif>"
)


SimInfo.Exp["data"]=new Array("X,Y Data Plotter",""
,"By plotting data in a linear form, we can often quickly get two parameters at the same time."
,"Plotting ln(<i>k</i>) vs. 1/<i>T</i> (Kelvin), for example, often gives a straight line with <i>y</i>-intercept ln <i>A</i> and slope &minus;<i>E</i><sub>a</sub>/<i>R</i>.")

SimInfo.Exp["inter"]=new Array("Intermediates and Multi-Step Reactions",""
,"When a reaction consists of multiple steps, species will be formed during the reaction that are not products of the reaction. We call these species <b>intermediates</b>. "
,"During the initial stage of a multi-step reaction, the concentrations of intermediates increases, then, later, the concentrations of intermediates drops slowly. "
,"Technically, in multi-step reactions, the definition of \"reaction rate\" is incorrect.<br><img src=$CDIR/rate1x.gif>"
,"Nonetheless, after an initial stage of the reaction, the concentration of intermediates stabilizes at relatively low concentration, and the definition of reaction rate is <i>roughly</i> usable<br><img src=$CDIR/rate1a.gif> "
,"The second stage of a multi-step reaction is said to be a <b>steady state</b>, where reactants are entering the reaction, products are leaving, and intermediate concentrations are low and relatively steady."
)

SimInfo.Exp["inter2"]=new Array("The Rate-Determining Step",""
,"In a multi-step reaction, we call the first <i>irreversible</i> step the <b>rate-determining step</b> because the entire reaction rate is determined by this one step."
,"We can write the rate law for a multi-step reaction as simply the rate law for for the rate-determining step.<br><img src=$CDIR/inter2.gif>"
)	

SimInfo.Exp["clock"]=new Array("The Clock Reaction and Limiting Reactants",""
,"It is possible to measure the initial rate of a chemical reaction using just a stopwatch and your eyes."
,"The trick is to have a very fast reaction that consumes a colored product immediately as it forms."
,"The species reacting with the colored product must be in short supply--it must be the limiting reactant overall."
,"When the limiting reactant runs out, we mark the time. The longer the time, the slower the reaction.<br><img src=$CDIR/clock.gif>"
,"By changing the concentrations of reactants and seeing the effect on the time it takes for the color change, we can determine the rate law."
)

SimInfo.Exp["clock1"]=new Array("The Iodine Clock Reaction With Added Starch",""
,"Adding starch to the iodine clock reaction allows us to better see the change in color when the thiosulfate \"timer\" runs out."
)

SimInfo.Exp["preeq"]=new Array("Pre-Equilibrium",""
,"The rate-determining step in a reaction is the first <i>irreversible</i> step."
,"The rate law for a reaction is set to be the rate law for the rate-determining step."
,"When the rate-determining step is not the very first step in a reaction, intermediates are bound to be involved. For example, in this case we have \"reaction rate = <i>k</i><sub>2</sub>[O3][O].\" O, however, is an intermediate."
,"Since the concentration of intermediates is low and generally unknown, they must not be left in the rate law."
,"To remove an intermediate from the rate law, we look for an earlier reversible step that inolves it, write the \"pre-equilibrium\" expression, and solve for its concentration.<br><img src=$CDIR/preeq2.gif>"
,"Substitution into the rate law written for the rate-determining step gives the proposed rate law for the reaction."
)	

SimInfo.Exp["inhibit"]=new Array("",""
,"An <b>inhibitor</b> slows down a reaction."
,"<b>Product inhibition</b> arises in situations where one of the products of the overall reaction is formed in an early reversible step."
)
SimInfo.Exp["enzyme"]=new Array("",""
,"A <b>catalyst</b> is a species that accelerates the rate of a chemical reaction without itself being consumed during the reaction."
,"In terms of mechanism, a catalyst is a species that is a reactant in an early mechanistic step and a product of a later mechanistic step."
,"The presence of the catalyst makes possible an entirely new lower-energy pathway from reactants to products."
,"In a catalyzed reaction, the activation energy, <i>E</i><sub>a</sub>, is decreased, and the rate constant <i>k</i> is increased. The pre-exponential entropy factor <i>A</i> is also affected.<p><img src=$CDIR/cat2.gif>"
,"An <b>enzyme</b> is a biological catalyst, usually a <b>protein</b> with very high molecular weight."
,"In terms of mechanism, enzymes are like any catalyst. Generally at least the first step, formation of the <b>enzyme-substrate complex</b>, is reversible."
,"When the concentration of substrate is high, the rate of an enzyme-catalyzed reaction is independent of [A]. We say the enzyme is \"saturated.\""
)


SimInfo.Exp["explode"]=new Array("Explosions and Positive Feedback",""
,"An <b>explosion</b> is a rapid exothermic chemical reaction within a confined space."
,"Typically, an explosion involves some sort of <b>positive feedback</b>, which involves a product also being a reactant in the reaction."
,"The result of positive feedback is a reaction that is initially very slow, then rapidly accelerates."
)

SimInfo.Exp["oscil"]=new Array("Oscillating Reactions",""
,"<b>Oscillating reactions</b> involve positive feedback to create a situation where the concentration of one or more reactants, intermediates, or products fluctuates with time."
,"In oscillating reactions, the relationship between reaction rate and concentration breaks down entirely.<p><img src=$CDIR/rate1x.gif>"
)

SimInfo.Exp["summary"]=new Array("",""
,"<b>Kinetics</b> is the study of the rates of chemical reactions."
,"Kinetics is a powerful tool we can use to get \"under the hood\" of a chemical reaction--to understand precisely what is going on when reactants react to form products."
,"From an experimental point of view, kinetics gives us <b>empirical rate laws</b> for a reaction."
,"From a theoretical point of view, kinetics provides one or more possible <b>mechanisms</b> that are consistent with the rate law."
,"Overall, the mechanism of a reaction is understandable in terms of a sequence of relatively simple <b>mechanistic steps</b>."
,"By understanding the mechanism of a reaction, we gain insight into how to speed up a desired reaction or slow down one that is not wanted."
,"Kinetics and the concept of mechanism are used by chemists of all walks of life. "
+"<b>Inorganic chemists</b> use mechanisms and kinetics to explore new catalysts and new processes that hold promise for the development of new materials. "
+"<b>Medicinal organic chemists</b> use mechanisms as starting points for the design of new drugs. "
+"<b>Biochemists</b> use kinetics to determine which drug candidate is particularly active. "
+"<b>Pharmacologists</b> use kinetics to determine how a drug gets to the target organ and how the body gets rid of it. "
+"<b>Atmospheric chemists</b> look at how the rate of reactions influences pollution. "
+"<b>Physicians</b>, though not necessarily interested in the details of drug action, use mechanistic thinking on a daily basis to diagnose illness and propose remedies. "
,"These examples just touch the surface. The list goes on and on! Chances are you, too, will use mechanistic thinking in your career or at least will be part of a team that does. What do you think?"
)  

