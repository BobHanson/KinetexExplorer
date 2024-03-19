//copyright Rober M. Hanson, St. Olaf College 12:00 AM 1/8/2003
//this file cannot be accessed directly; use index.htm instead
//for kinetex

//debugging: search for #203, for example, to see entry #203; #0 gives all

if(top==self)location="index.htm"	//force frames


msg="<p>Please note: This page is still in preparation.<br><a href=mailto:hansonr@stolaf.edu>Feedback</a> is appreciated.<br>"

CHAPTERTYPE="topic"
Summaries=1

//Explore_say requires concept dir definition

SimInfo.conceptdir="./img"
SimInfo.exploredir="../js/explore"

//debugging only:
sJS=""
ishowindexnumber=false && true
ishowindexbypage=false && true
icreatejslist=false
icreatejsallfromchapter=9
indexlistisalphabetical=false

//chapterdata constants
Temp=new Array()
KeyConcepts=new Array() //constant array
ChapterTitle=new Array()//constant array, from chaptertitles
ChapterTools=new Array()
Scripts=new Array()
PageInfo=new Array()	//points to script
WebTools=new Array()
PCTools=new Array()
Practice=new Array()		
jsdir="../js/"
pcdir="../pc/"

//indexdata constants
Names=new Array()	//first names for allowing "," in phrase
IndexData=new Array()   //constant array, but sort changes
IndexByKey=new Array()
IndexByPage=new Array()

//textdata constants
CI=new Array()		//concept info array

//quiz data constants
QuizID=new Array()

//global constants:
indent="&nbsp;&nbsp;"	//for createIndex()
maxlist=5		//for createIndex()
depth=0			//for showall()
depthmax=2		//for showall()
nmax=1000		//for showall()
nlines=0		//for showall()

//gobal variables:
Concepts=new Array()	//variable numerical listing for hrefs
ConceptInfo=new Array()	//concept list for currently displayed index
ChapterList=new Array() //represents selections, from getChapterList()
SelectedItems=new Array() //for createIndex
lastdata0=""		//for addinfo()
lastdata1=""
lastdata2=""
lastpage=0
thischapter=0 		//set to -n to run multiple chapters
thisPage=""
sout=""			//for debugging only
idodups=true|| false	//this is experimental--not show duplicates
idokeyconceptsonly=false
idokeylinksonly=false
idosortbypage=false
idosearchindex=false
idosearchinfo=false
thesearch=""
nconcepts=0
nPages=0
isallchapters=false
isanimating=false
allexplist=""
scripttype=1
thisScript=""
thisScriptN=0
scripting=false
ScriptList=new Array()
thispractice=0

//for textdata.js:

cilist=""
lastchapter=1		//for addScript()
lastpage=0
overallcilist=""
CHAPTERLISTHEADER="Select one or more chapters to view a list of scripts, explorations, or concepts.<p>"

//functions

function docheckselectlist(){
 var d=parent.fraConcept.document.info.chap
 if(d.options[d.options.length-1].selected)doShowSummary(0)
}

function getChapterSelectList(){
 var A=chapters.split("\n")
 var s="<select size="+A.length+" name=chap MULTIPLE onchange=parent.fraCode.docheckselectlist() onclick=parent.fraCode.docheckselectlist()>"
 var v=""
 var j=0
 for(var i=0;i<A.length;i++){
	j=A[i].indexOf("Topic")
	if(A[i].indexOf("Topics ")==j)v=A[i].substring(j+7,j+10)
	if(A[i].indexOf("Topics:")==j)v="0"
	if(A[i].indexOf("Topic ")==j)v=A[i].substring(j+6,j+7)
	if(j>=0)s+="<option value='"+v+"'>"+A[i]+"</option>"
 }
 s+="<option value=99>----------Overall Kinetics Summary</option>"
 s+="</select><br>"
 s+="<input type=button value=\"Scripts\" onclick=parent.fraCode.doselectch(5)>"
 s+="<input type=button value=\"Explorations\" onclick=parent.fraCode.doselectch(6)>"
 s+="<input type=button value=\"Key Concepts\" onclick=parent.fraCode.doselectch(1)>"
// s+="<input type=button value=\"Tools\" onclick=parent.fraCode.doselectch(4)>"
// s+="<input type=button value=\"Key Links\" onclick=parent.fraCode.doselectch(2)>"
// s+="<input type=button value=Index onclick=parent.fraCode.doselectch(0)>"
 s+="<input type=button value=\"Search Text\" onclick=parent.fraCode.doselectch(3)>"
 s+="<p><b>Scripts</b> are concept-based \"slide shows\" displayed in printable form."
 s+="<p><b>Explorations</b> are hands-on activities that focus on specific concepts."
 s+="<p><b>Key Concepts</b> are index terms identified to be especially important."
// s+="<p><b>Tools</b> are web-based or Windows-based exercises and simulations."
// s+="<p><b>Key Links</b> are links in <i>other</i> chapters to key concepts in the specified chapter(s)."
 s+="<p><small>"+msg+"</small>"
 return s
}

function showform(){
 var s="Topic(s): <input type=text size=10 name=ch value=1-"+nChapters+">"
 s+="&nbsp;&nbsp;<a class=btn href=javascript:dolistscripts()>Scripts</a>"
 s+="&nbsp;&nbsp;<a class=btn href=javascript:dolistexplorations()>Explorations</a>"
 s+="&nbsp;&nbsp;<a class=btn href=javascript:dokeyconcepts()>Concepts</a>"
// s+="&nbsp;&nbsp;<a class=btn href=javascript:dogettools()>Tools</a>"
// s+="&nbsp;&nbsp;<a class=btn href=javascript:dokeylinks()>Links</a>"
// s+="&nbsp;&nbsp;<a class=btn href=javascript:dofullindex(0)>Index</a>"
   s+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <input type=text size=10 name=srch value=''> <a class=btn href=javascript:dosearch(0)>Search Index</a>"
 s+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;<a class=btn href=javascript:dogetchapterlist()>Topic List</a>"
// s+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a class=btn href=javascript:dofullindex(-1)>Complete Book Index</a>"
 document.write(s)
}

