//6:12 AM 2/13/2004
/*

startup example options include:

index.htm?2	load chapter 2 scripts
index.htm?2/_b2	load chapter 2 script b2
index.htm?2/c	load chapter 2 concepts
index.htm?2/i	load chapter 2 index
index.htm?2/t	load chapter 2 tools
index.htm?2/t/calc	load chapter 2 WebTool "calc"
index.htm?2/q	load chapter 2 quiz
index.htm?2/q3	load chapter 2 quiz, question 3
index.htm?2/l	load chapter 2 links

see clearFrames()
*/


function doinit(){
	setChapters()
	setTimeout("clearFrames()",200)
}

function getStyle(){
 var s="<style>"
 s+="body,a,td,th,textarea,select{font-size:14pt}"
 s+="a.btn,a.webtool,a.pctool,a.nav,a.nav1{color:darkred;text-decoration:none}"
 s+="a.pagelink{color:darkred}"
 s+="a.concept{color:darkgreen;text-decoration:none}"
 s+="a i{color:white;font-size:0pt}"
 s+="</style>"
 return s
}document.write(getStyle())

function addScript(ichap,title,list){
 if(arguments.length==1){
	if(!isNaN(parseInt(ichap))){
		lastchapter=ichap
		lastpage=0
		return
	}
	list=""
	title=ichap
	ichap=lastchapter
 }
 if(arguments.length==2){
	list=title
	if(list=="*")list=cilist
	title=ichap
	ichap=lastchapter
 }
 cilist=""

 if(!Scripts[ichap])Scripts[ichap]=new Array()
 Scripts[ichap][title]=list.split(",")
 for(var i in Scripts[ichap][title]){
	PageInfo[Scripts[ichap][title][i]]=new Array(ichap,title)
 }
}

function arrayshift(P){
 if(P.length==0)return ""
 if(P.shift)return P.shift()
 var first=P[0]
 for(var i=1;i<P.length;i++)P[i-1]=P[i]
 P.length--
 return first
}

function fullscript(){
 if(!scripting)dolistscripts()
 showConcept(thisPage)
}

function jsref(cla,cmd,txt){
 if(cla)cla=" class="+cla
 return "<a"+cla+" href=\"javascript:parent.fraCode."+cmd+"\">"+txt+"</a>"
}

function newData(S,thepage,sinfo){
//alert(S+" "+thepage+" "+sinfo)
 var n=IndexData.length
 var Ref=thepage.split("-")
 var s=""
 var nprev=0
 S[0]=S[0].replace(/\;/g,",") //for proper names, level 0
 S[1]=S[1].replace(/\;/g,",") //for others, level 1
 IndexData[n]=new Array()
 IndexData[n].n=n
 IndexData[n].info=sinfo
 IndexData[n].selected=true
 IndexData[n].ch_page=thepage
 IndexData[n].ch=parseInt(Ref[0])
 IndexData[n].page=parseInt(Ref[1])
 IndexData[n].Items=new Array()
 for(var i=0;i<S.length;i++)IndexData[n].Items[i]=S[i]
 IndexData[n].key=S[0]+", "+S[1]+", "+thepage
 IndexData[n].revKey=revKeyOf(S)+", "+thepage
 IndexData[n].linkterm1=S[0]+(S[2]?" "+S[1]:"")
 IndexData[n].linkterm2=(S[2]?S[2]:S[1])
 IndexData[n].iKeyConcept=getKeyConcept(S[0],KeyConcepts[IndexData[n].ch])
 IndexData[n].iKeyConcept0=getKeyConcept(S[0],KeyConcepts[0])
 s=IndexData[n].linkterm1+IndexData[n].linkterm2
 nprev=Temp[s]
 if(!nprev)Temp[s]=n
 IndexData[n].keySort=getKeySort(n,nprev)
 IndexData[n].keySort0=IndexData[n].iKeyConcept0+(S[1].length?IndexData[n].ch+IndexData[n].page/100:0)/100+n/10000000
}


function getKeySort(n,nprev){
 var d=0
 var sd="|"
 if(!nprev)nprev=n
 d=(IndexData[n].iKeyConcept+1)/100+.0001
 sd+=d
 sd+="|"+(IndexData[nprev].page/100+0.00001)
 sd+="|"+(n/1000+0.000001)
 sd=sd.replace(/\|\./g,"|0.") //for Netscape 4
 return sd
}
function showScript(ichap,title){
 var sout=""
 var ssep=""
 var s=""
 document.info.ch.value=ichap
 title=unescape(title)
 for(var ipage=0;ipage<Scripts[ichap][title].length;ipage++){
	thisPage=Scripts[ichap][title][ipage]
	if(thisPage==""){
		//alert(title+": No pages listed in addScript.")
	}else if(!CI[thisPage]){
		alert(title+": No CI entry in textdata.js for "+thisPage)
	}else if(CI[thisPage][0]=="$FILE"){
		parent.fraConcept.location=CI[thisPage][1]
	}else{
		var npages=CI[thisPage].length/2
		for(var iframe=0;iframe<npages;iframe++){
			s=thisPage+(npages>1?"."+iframe:"")
			sout+="\n<hr>\n"+symclean(title)+" "+jsref("","dogoto('"+s+"')",s)+" "+getThePage(iframe,false) 
		}
	}
 }	
 //alert(sout)
 sout="<table><tr><td width=600>"+sout+"</td></tr></table><pre>\n\n\n\n\n\n\n\n</pre>"
 dowrite(parent.fraConcept,sout)
}

function wrapScript(iscript,ichap,title,thepage){
 if(arguments.length<4)thepage=""
 var sout=""
 var ssep=""
 var s=""
 var npages=0 
 var n=0
 var iframe=0
 var havei=0
 var thisframe=-1
 var S=thepage.split(".")
 if(S.length==2){
	thisframe=parseInt(S[1])
	thepage=S[0]
 }
 thisScriptN=iscript
 /* 
 alert(title)
 for(var i in Scripts[ichap])s+="\n"+i
 alert(s)
 */

 if(arguments.length>=3){
	document.info.ch.value=ichap
	title=unescape(title)
	ScriptList=new Array()
	for(var ipage=0;ipage<Scripts[ichap][title].length;ipage++){
		thisPage=Scripts[ichap][title][ipage]
		npages=CI[thisPage].length/2
		for(var i=0;i<npages;i++){
			ScriptList[n]=new Array(ichap,title,thisPage,i)
			if(!havei && thisPage==thepage && (thisframe<0||i==thisframe)){
				iscript=n
				havei=1
			}
			n++
		}
	}
 }
 ichap=ScriptList[iscript][0]
 title=ScriptList[iscript][1]
 thisPage=ScriptList[iscript][2]
 iframe=ScriptList[iscript][3] 
 if(!CI[thisPage]){
 }else if(CI[thisPage][0]=="$FILE"){
 }else{
	npages=CI[thisPage].length/2
	sout="<b>"+symclean(title)+" <font color=#C0C0C0>"+thisPage+(iframe && npages>1?"."+iframe:"")+"</font>"+"</b><p>"+getThePage(iframe,true,iscript,ScriptList.length)+"<pre>\n\n\n\n\n\n\n\n</pre>"
 }	
 dowrite(parent.fraConcept,sout)
}

function createIndexJS(){
 if(IndexByKey.length==IndexData.length)return

 var sout=""
 IndexByKey=new Array()
 IndexData.sort(sortIndexByKeyConcept0) //ie by overall alphabetical concept list
 for(var i=0;i<IndexData.length;i++)IndexByKey[i]=IndexData[i].n
 createIndexByPage()

 sout+="<p>IndexByKey=new Array("+IndexByKey.join(", ")+")"
 var S=sout.split(", ")
 sout=S[0]
 var n=sout.length
 for(var i=1;i<S.length;i++){
	if(n>80){
		sout+="<br>"
		n=0
	}
	n+=1+S[i].length
	sout+=","+S[i]
 }
 sout="//add this information to indexdata.js:\n"+sout
 dowrite(parent.fraConcept,sout)
}

function createIndexByPage(){
 IndexByPage=new Array()
 IndexData.sort(sortIndexByPage)
 for(var i=0;i<IndexData.length;i++)IndexByPage[i]=IndexData[i].n
 IndexData.sort(sortIndexByN)
}

function showindexdata(ithis){
 var s="<pre>"
 nmax=1000
 if(arguments.length==0)ithis=0
 for(var i=0;i<IndexData.length;i++){
	if(i==ithis|| ithis==0 || ithis<0 && IndexData[i].selected){
		s+=showdata(i)
	}
 }
 dowrite(parent.fraConcept,s)
}


function showdata(i){
 return showall("IndexData["+i+"]")+"\n"
}

function showall(objName,snot){
 if(nlines>nmax || depth==depthmax)return ""
 nlines++
 depth++
 var s = ""
 var obj=eval(objName)
 for(var i in obj){
   var st=obj[i]+"\n"
   if(st==null){
	s+=objName+(isNaN(i)?"."+i:"["+i+"]")+" = *UNDEFINED*\n"
   }else{
	if(snot==null || st.indexOf(snot)<0)s+=objName+(isNaN(i)?"."+i:"["+i+"]")+" = "+st.replace(/</g,"&lt;")
	if(i!=0 && st.indexOf("[")>=0){
		if(isNaN(i)){if(i!="all" 
			&& i!="document"
			&& i.indexOf("top")<0
			&& i.indexOf("arent")<0
			&& i.indexOf("self")<0
			&& i.indexOf("Sibling")<0
			&& i.indexOf("window")<0
			&& i.indexOf("frame")<0
			&& i.indexOf("next")<0
			&& i.indexOf("previous")<0
		){
			s+=showall(objName+"."+i,snot)
		}}else{if(objName.indexOf(".all")<0){
			s+=showall(objName+"["+i+"]",snot)
		}}
	}
   }
 }
 depth--
 return s
}

function getKeyConcept(skey,A){
 if(!A)return -1
 for(var i=0;i<A.length;i++){
	if(A[i]==skey)return i
 }
 return -1
}

function revKeyOf(S){
 var sout=""
 var skey1=""
 var skey2=""
 if(S.length>2 && S[2].length)return "xx"
 skey1=S[0]
 skey2=S[1]
 if(skey2.indexOf("and ")==0){
	skey1="and "+skey1
	skey2=skey2.substring(4,skey2.length)
 }else if(skey2.indexOf("vs. ")==0){
	skey1="vs. "+skey1
	skey2=skey2.substring(4,skey2.length)
 }else if(skey2.indexOf("as ")==0){
	skey1="as "+skey1
	skey2=skey2.substring(3,skey2.length)
 }else if(skey2.indexOf("reaction with ")==0){
	skey1="reaction with "+skey1
	skey2=skey2.substring(14,skey2.length)
 }else if(skey2.indexOf("equilibrium with ")==0){
	skey1="equilibrium with "+skey1
	skey2=skey2.substring(17,skey2.length)
 }
 return skey2+", "+skey1
}


function sortChapterListByKeyConcept(a,b){
 return (IndexData[a].keySort<IndexData[b].keySort?-1:IndexData[a].keySort>IndexData[b].keySort?1:0)
}

function sortIndexByKeyConcept0(a,b){
 return (a.keySort0<b.keySort0?-1:a.keySort0>b.keySort0?1:0)
}

function sortIndexByPage(a,b){
 if(a.ch<b.ch)return -1
 if(a.ch>b.ch)return 1
 if(a.page<b.page)return -1
 if(a.page>b.page)return 1
 return (a.n<b.n?-1:a.n>b.n?1:0)
}

function sortIndexByN(a,b){
 return (a.n<b.n?-1:a.n>b.n?1:0)
}
function newCI(key){
 if(key.indexOf("_")==0){
	cilist+=(cilist.length?",":"")+key
	if(overallcilist.indexOf(key+",")>=0)alert(key + " is already defined.")
	overallcilist+=key+","
 }else{
	key=addinfo(key,1)+":"+key
 }
 CI[key]=new Array()
 for(var i=1;i<arguments.length;i++)CI[key][i-1]=arguments[i]
}

function addinfo(sinfo,iskinetics){
 //kinetics: assume NO page number and automatically assign one.
 var skey=""
 if(iskinetics){
	skey=lastchapter+"-"+(++lastpage)
 	sinfo+=", "+skey
 }
 if(sinfo.length==0)return ""
 var s=sinfo.replace(/\x0C/g,"").replace(/\_So/,"_S<sup>o</sup>")
 var isname=false
 for(var i=0;i<Names.length;i++){
	if(s.indexOf(Names[i])>=0)isname=true
 }
 if(isname)s=s.replace(/\,/,";")
 var S=s.split("  ")
 var n=S.length
 if(S[0]=="" && n>1)S[0]=lastdata0
 if(S[1]=="" && n>2)S[1]=lastdata1
 if(S[2]=="" && n>3)S[2]=lastdata2
 var P=S[n-1].split(", ")
 S[n-1]=arrayshift(P)
 if(P.length && isNaN(parseInt(P[0].charAt(0))))S[n]=arrayshift(P)

 if(P.length>1){
   for(var i=0;i<P.length;i++)addinfo(S.join(", ")+", "+P[i])
 }else{
   if(S.length<2)S[1]=""
   if(S.length<3)S[2]=""
   lastdata0=S[0]
   lastdata1=S[1]
   lastdata2=S[2]
   if(P.length==1){
	newData(S,P[0],s)
   }
 }
 return skey
}


function selectThisChapter(ichap,isinternal,isthis){

 //isthis=true normal
 //isthis=false then keylinks--key concepts specifically linked to other chapters
 if(ichap<-1){ //from chapter list
	selectThisChapter(-1,false,isthis)
	for(var i=0;i<ChapterList.length;i++)selectThisChapter(ChapterList[i],true,isthis)
	return
 }
 for(var i=0;i<IndexData.length;i++){
	if(!isinternal)IndexData[i].selected=!isthis
	if(isthis){ //selecting this chapter
		IndexData[i].selected=(
			IndexData[i].selected 
			|| ichap==0 
			|| IndexData[i].ch==ichap 
		)
	}else{ //knocking out this chapter
		IndexData[i].selected=!(
			!IndexData[i].selected
			|| IndexData[i].ch==ichap 
		)
	}
 }
}


function searchIndex(){
 var i=0
 if(thesearch.charAt(0)=="#"){
	ishowindexnumber=true
	for(var i=0;i<IndexData.length;i++)IndexData[i].selected=false
	i=parseInt(thesearch.substring(1,thesearch.length))
	IndexData[i].selected=true
	showindexdata(i)
	return
 }
 var srch=thesearch.toLowerCase()
 var skey=""
 var spage=""
 var data0=""
 var data1=""
 var data2=""
 if(idosearchindex){
	for(var i=0;i<IndexData.length;i++){if(IndexData[i].selected){
		IndexData[i].selected=(IndexData[i].Items.join().toLowerCase().indexOf(srch)>=0||IndexData[i].ch_page==srch)
	}}
	return
 }
 for(var i=0;i<IndexData.length;i++){if(IndexData[i].selected){
	skey=getPageLink(i,1)
	IndexData[i].selected=(CI[skey][0].toLowerCase().indexOf(srch)>=0)
 }}
}


function selectKeyConcepts(ichap,ilinkonly){
 var s=","
 if(ilinkonly){
	for(var i=0;i<IndexData.length;i++){if(IndexData[i].selected && IndexData[i].iKeyConcept0>=0){
		s+=IndexData[i].iKeyConcept0+","
	}}
	selectThisChapter(ichap,false,false) //all NOT these chapters
	for(var i=0;i<IndexData.length;i++){if(IndexData[i].selected){
		IndexData[i].selected=(s.indexOf(","+IndexData[i].iKeyConcept0+",")>=0)
	}}
 }else{
	if(ichap>0){
		for(var i=0;i<IndexData.length;i++){if(IndexData[i].selected){
			IndexData[i].selected=(IndexData[i].iKeyConcept>=0)
		}}
	}else{
		for(var i=0;i<IndexData.length;i++){if(IndexData[i].selected){
			IndexData[i].selected=(IndexData[i].iKeyConcept0>=0)
		}}
	}
 }
}


function unselectDuplicates(iforcekey1){
 var slist=""
 for(var i=0;i<IndexData.length;i++){if(IndexData[i].selected){
	if(slist.indexOf(";"+IndexData[i].revKey+";")>=0 && (!iforcekey1 || IndexData[i].iKeyConcept==0)){
		IndexData[i].selected=false
	}else{
		slist+=";"+IndexData[i].key+";"
	}
 }}
}


function dokeyconcepts(){
 isanimating=false
 getChapterList()
 if(ChapterList.length==0)return
 idokeyconceptsonly=true
 idokeylinksonly=false
 idosortbypage=false
 idosearchindex=false
 idosearchinfo=false
 showIndex(thischapter,0,0) 
}


function dolistscripts(){
 isanimating=false
 getChapterList()
 if(ChapterList.length==0)return
 listScripts(thischapter)
}

function doShowScript(ichap,title,thepage){
 title=title.replace(/\~/g,"'") 
 if(arguments.length<3)thepage=""
 isanimating=false
 scripting=true
 scripttype=(!parent.fraIndex.document.info||!parent.fraIndex.document.info.asprint.checked)
 if(scripttype==0){
	showScript(ichap,title)
 }else{
	var n=(thisScript==title?thisScriptN:0)
	thisScript=title
	wrapScript(n,ichap,title,thepage)
 }
}


function dosearch(isterms){
 isanimating=false
 var srch=document.info.srch.value
 if(isterms||srch=="")srch=prompt("What would you like to search for?",srch)
 if(!srch)return
 if(isterms)document.info.srch.value=srch 
 getChapterList()
 idokeyconceptsonly=false
 idokeylinksonly=false
 idosortbypage=false
 idosearchindex=!isterms
 idosearchinfo=isterms
 thesearch=srch.toLowerCase()
 showIndex(thischapter,0,1) 
}

function dogettools(){
 isanimating=false
 getChapterList()
 if(ChapterList.length==0)return
 var sout=getToolsList(-1)
 dowrite(parent.fraIndex,sout)
}

function dokeylinks(){
 isanimating=false
 getChapterList()
 if(ChapterList.length==0)return
 if(ChapterList.length==nChapters){
	var sout="Select one or more chapters--but not the whole book--before checking for key links. The idea is to find entries in the index that are \"linked\" to the specified chapter(s) but not actually in those chapters. All references to a chapter's key concepts that are not in that chapter are returned. So it doesn't work to select all of the chapters in the book."
	sout=sout.replace(/chapter/g,CHAPTERTYPE)
	dowrite(parent.fraIndex,sout)
	dogetchapterlist()
	return
 }
 idokeyconceptsonly=true
 idokeylinksonly=true
 idosortbypage=false
 idosearchindex=false
 idosearchinfo=false
 showIndex(thischapter,0,0) 
}

function dofullindex(isbypage){
 isanimating=false
 idokeyconceptsonly=false
 idokeylinksonly=false
 idosearchindex=false
 idosearchinfo=false
 if(isbypage==-1){
	document.info.ch.value=" 1-"+nChapters
	thischapter=0
	idosortbypage=false
 }else{
	getChapterList()
	if(ChapterList.length==0)return
	idosortbypage=isbypage
	if(idosortbypage && IndexByPage.length==0)createIndexByPage()
 }
 showIndex(thischapter,0,1) 
}

function showIndex(ichap,iconcept,idoexpand){
 scripting=false
 selectThisChapter(ichap,false,true)
 if(idokeyconceptsonly && (ichap<0 || ichap && KeyConcepts[ichap])){
	selectKeyConcepts(ichap,idokeylinksonly)
 }
 if(idosearchindex||idosearchinfo)searchIndex()

 if(ichap>0 && !idodups)unselectDuplicates(idokeyconceptsonly)

 SelectedItems=new Array()
 if(ichap>0 && idokeyconceptsonly){
	setSelectedItems(SelectedItems,IndexByKey)
 }else if(icreatejslist||idosortbypage){
	setSelectedItems(SelectedItems,IndexByPage)
 }else{
	setSelectedItems(SelectedItems,(indexlistisalphabetical?[]:IndexByKey))
 }
 if(ichap>0 && idokeyconceptsonly && KeyConcepts[ichap] && !idokeylinksonly){
	if(SelectedItems.length)SelectedItems=SelectedItems.sort(sortChapterListByKeyConcept)
 }
//alert(SelectedItems)
 createIndex(ichap,iconcept,idoexpand)
}


function dolistexplorations(){
 isanimating=false
 getChapterList()
 if(ChapterList.length==0)return
 listExplorations(thischapter)
}

function setSelectedItems(A,I){
 var i=0
 if(I.length==0){
	for(var i=0;i<IndexData.length;i++){
		if(IndexData[i] && IndexData[i].selected)A[A.length]=i
	}
	return
 }
 for(var ii=0;ii<I.length;ii++){
	i=I[ii]
	if(IndexData[i] && IndexData[i].selected)A[A.length]=i
 }
}

function getChapterList(){ //for now, only one
 ChapterList=createArrayFromList(document.info.ch.value)
 if(ChapterList.length==0)ChapterList[0]=0
 if(ChapterList.length==1){
  thischapter=ChapterList[0]
 }else{
  thischapter=-ChapterList.length
 }
}

function setChapters(){
	var A=chapters.split("\n")
	var s=A[0]
	for(var i=1;i<A.length;i++){
		if(A[i].indexOf("Topic ")==0||A[i].indexOf("Chapter ")==0)s+="\n"+A[i]
	}
	ChapterTitle=s.split("\n")
}


function getAllKeyConcepts(){
 var s=""
 var slist=","
 for(var i=1;i<KeyConcepts.length;i++){
	for(var j=0;j<KeyConcepts[i].length;j++){
		s=","+KeyConcepts[i][j]+","
		if(slist.indexOf(s)<0)slist+=s.substring(1,s.length)
	}
 }
 KeyConcepts[0]=slist.substring(1,slist.length).split(",")
 KeyConcepts[0].sort(sorta)
}


function sorta(a,b){
 var a1=a.toLowerCase()
 var b1=b.toLowerCase()
 return (a1<b1?-1:a1>b1?1:0) 
}

function sortn(a,b){
 return (a<b?-1:a>b?1:0) 
}


function clearFrames(){
//dowrite(parent.fraIndex,'')
//dofullindex(-1)
	dogetchapterlist()
	createIndexJS()
	var s=(parent.location+"?").split("?")[1]
	if(!s)return
	s+="/scripts/"
	var A=s.toLowerCase().split("/")
	if(A[0].length)document.info.ch.value=A[0]
	s=A[1].substring(0,1)
	var cmd="dolistscripts()"
	if(s=="s")cmd="dolistscripts()"
	if(s=="c")cmd="dokeyconcepts()"
	if(s=="t")cmd="dogettools()"
	if(s=="l")cmd="dokeylinks()"
	if(s=="i")cmd="dofullindex(0)"
	if(s=="q"){
		cmd="dolistscripts()"
		if(WebTools["t"+A[0]+"quiz"])cmd+=";gotoTool('t"+A[0]+"quiz."+A[1].substring(1,A[1].length)+"')"
		if(WebTools["equiz"+A[0]])cmd+=";gotoTool('equiz"+A[0]+"."+A[1].substring(1,A[1].length)+"')"
	}
	if(A[2] && WebTools[A[2]])cmd+=";gotoTool('"+A[2]+"')"
	if(A[2].charAt(0)=="_"){
		s="_"
		A[1]=A[2]
	}
	if(s=="_"){
		s=A[1]//.replace(/\./,"#")
		thisPage=s
		cmd="fullscript()"
	}
//alert(cmd)
	eval(cmd)
}		

function createArrayFromList(alist){
 // "3,5,6-10,22" ---> 3,5,6,7,8,9,10,22
 // spaces count as commas here
 alist=alist.replace(/  /g," ")
 for(var i=0;i<20;i++)alist=alist.replace(/(\d) (\d)/g,"$1,$2")
 alist=alist.replace(/ /g,"").replace(/\-/g,",#").replace(/\#/g,"-")
 var P=alist.split(",")
 var Q=new Array()
 var plast=-1
 if(P.length==0)return Q
 P[0]=parseInt(P[0])
 for(var i=1;i<P.length;i++){
	P[i]=parseInt(P[i])
	if(P[i]<0){
		P[i]=-P[i]
		for(var j=P[i-1]+1;j<P[i];j++)P[P.length]=j
	}
 }
 P=P.sort(sortn)
 for(var i=0;i<P.length;i++){
	if(P[i]!=plast && P[i]>0)Q[Q.length]=P[i]
	plast=P[i]
 }
 return Q
}

function createListFromArray(A){
 // 3,5,6,7,8,9,10,22 ---> "3,5,6-10,22"
 var s=""
 var ilast=0
 var irange=false
 var B=A.sort(sortn)
 for(var j=0;j<B.length;j++){
	i=B[j]
	if(j>0 && i==ilast+1){
		irange=true
	}else{
		if(irange)s+="-"+ilast
		irange=false
		s+=(ilast>0?",":"")+i
	}
	ilast=i
 }
 if(irange)s+="-"+ilast
 return s
}

function dowrite(frame,s){
 frame.document.open()
 frame.document.write(getStyle())
 frame.document.write(s)
 frame.document.close()
 if(frame==parent.fraConcept)setTimeout("scrollConcept()",500)
}

function createIndex(ichap,iconcept,idoexpand){
 var sout="<b>"+(ichap<0?"Chapters "+createListFromArray(ChapterList):ChapterTitle[ichap])
	+" ("+(idosearchindex||idosearchinfo
		?"search for \""+thesearch+"\" in the "+(idosearchindex?"index terms":"concept text")
		:idokeylinksonly?"key links"
		:idokeyconceptsonly?"key concepts"
		:"index")
	+")</b><p>"

 var sconcept=(iconcept>0?Concepts[iconcept]:idokeyconceptsonly?"":"ALL")
 var s=""
 var spage=""
 var data0=""
 var data1=""
 var data2=""
 var new0=false
 var new1=false
 var new2=false
 var add0=false
 var add1=false
 var add2=false
 var firstconcept=(iconcept>maxlist?iconcept-maxlist:1)
 var defaultpage=0
 Concepts=new Array()
 nPages=0
 nconcepts=0
 sout+="<table><tr><td width=10><td width=10><td width=10><td width=300></tr><tr><td width=10><img src=img/blank.gif></td><td colspan=3>"
 if(firstconcept>1)sout+=jsref("nav","dogotoconcept(0)","top")+" "+jsref("nav","dogotoconcept("+(iconcept-maxlist)+")","back")
 sout+="</td></tr>"
 if(SelectedItems.length==0){
	sout+="<tr><td colspan=4>"
	if(idokeylinksonly){
		sout+="Select one or more chapters--but not the whole book--before checking for key links. The idea is to find entries in the index that are \"linked\" to the specified chapter(s) but not actually in those chapters. All references to a chapter's key concepts that are <i>not</i> in that chapter are returned. So it doesn't work to select all of the chapters in the book."
		dogetchapterlist()
	}else{
		sout+="No items were found."
	}
 }

 sJS="<pre>"
 for(var ii=0;ii<SelectedItems.length;ii++){
	i=SelectedItems[ii]
	new0=(IndexData[i].Items[0]!=data0)
	new1=(IndexData[i].Items[1]!=data1)
	new2=(IndexData[i].Items[2]!=data2)
	data0=IndexData[i].Items[0]
	data1=IndexData[i].Items[1]
	data2=IndexData[i].Items[2]
	add0=false
	add1=false
	add2=false
	if(!new0 && !new1 && !new2){
		//just new page
	}else if(!new0 && !new1){
		//only third item is different
		add2=true
	}else if(!new0){
		//only second item is different
		add1=true
		if(data2!="")add2=true
	}else{
		//first is different
		add0=true
		if(data1!="")add1=true
		if(data2!="")add2=true
	}
	spage=getPageLink(i,0)
	s=""
	if(add0){
		nconcepts++
		Concepts[nconcepts]=data0
		if(nconcepts>=firstconcept){
			s+="<tr><td>"+(idoexpand && sconcept==data0?jsref("","doarrow("+nconcepts+")","<img border=0 src=img/arrow.gif></a>"):"")
			+"</td><td colspan=3>"+(idokeyconceptsonly?jsref("concept",(idoexpand && sconcept==data0?"doarrow":"doShowConcept")+"("+nconcepts+")",data0):"<b>"+data0+"</b>")
			if(idoexpand && sconcept==data0 && !add1 && !add2 && spage.indexOf("doshow")>0)defaultpage=nPages
		}
	}
	if(nconcepts>=firstconcept && idoexpand && (sconcept=="ALL" || sconcept==data0)){
		if(add1)s+="<tr><td><td>"+indent+"<td colspan=2>"+data1
		if(add2)s+="<tr><td><td>"+indent+"<td>"+indent+"<td>"+data2
		s+=", "+spage
		if(icreatejslist){
			if(IndexData[i].ch>=icreatejsallfromchapter||spage.indexOf("<")<0){
				sJS+="\n//CI[\""+IndexData[i].ch_page+":"+(data2?data0+" "+data1+", "+data2:data1?data0+", "+data1:data0)+"\"]=new Array(\"TEMP\",\"p"+IndexData[i].n+".gif\")"
			}
		}
	}
	sout+=s
 }
 sout+="</table>"
 if(CHAPTERTYPE=="topic")sout=sout.replace(/Chapter/g,"Topic").replace(/chapter/g,"topic")
 //if(idokeyconceptsonly)sout+=getToolsList(ichap)
 dowrite(parent.fraIndex,sout)
 setTimeout("scrollIndex()",100)
 if(defaultpage)setTimeout("doshowinfo("+defaultpage+")",200)
 if(icreatejslist)setTimeout("dowrite(parent.fraConcept,sJS)",1000)
 icreatejslist=false

}

function doarrow(i){
 if(idokeylinksonly){
	dokeylinks()
 }else{
	dokeyconcepts()
 }
}

function scrollIndex(){
	if(parent.fraIndex.scrollTo)return parent.fraIndex.scrollTo(0,0)
	if(parent.fraIndex.document.scrollTo)parent.fraIndex.document.scrollTo(0,0)
}

function scrollConcept(){
	if(parent.fraConcept.scrollTo)return parent.fraConcept.scrollTo(0,0)
	if(parent.fraConcept.document.scrollTo)parent.fraConcept.document.scrollTo(0,0)
}

function iHaveCI(s){
 return (CI[s]?1:0)
}

function doShowConcept(n){
 showCI(Concepts[n])
 setTimeout("showIndex(thischapter,"+n+",1)",200)
}

function dogotoconcept(n){
 setTimeout("createIndex(thischapter,"+n+",0)",200)
}

function dogoto(s){
 setTimeout("showCI(\""+s+"\")",200)
}

function showCI(s){
 var S=(s+".0").split(".")
 var p=S[0]
 var n=parseInt(S[1])
 if(!iHaveCI(p))return
 if(CI[p].length==1){
	//a single entry means a reference to another CI element.
	//adding .n sends us to that particular "frame" of a multi-frame panel.
	showCI(CI[p][0])
	return
 }
 thisPage=p
 isanimating=false
 nextPage(n)
}

function showConcept(s){
 thisPage=s.split(".")[0]
 setTimeout('doShowScript('+PageInfo[thisPage][0]+',"'+PageInfo[thisPage][1]+'","'+s+'")',100)
}

function doanimate(n){
 if(n==-1)isanimating=true
 if(!isanimating)return
 if(CI[thisPage].length>(n+1)*2 || CI[thisPage][0].indexOf("_loop")>0){
	n=(n+1)%(CI[thisPage].length/2)
	donext(n)
	setTimeout("doanimate("+(n)+")",2000)
	isanimating=true
 }
}

function nextPage(n){
 if(scripttype==1 && scripting){
	wrapScript(n) 	
 }else{
//	dowrite(parent.fraConcept,getThePage(n,true)+(scripting && PageInfo[thisPage]?"<p>"+jsref("","fullscript()","full script"):"")) 
	dowrite(parent.fraConcept,getThePage(n,true)+"<p>"+jsref("","fullscript()","script format")+"<pre>\n\n\n\n\n\n\n\n</pre>") 
 }
}

function wrapPage(ithis,npages,stext,ianimate){
 var s="<table cellpadding=0 cellspacing=0><tr><td align=center valign=top width=10><form>"
 for(var i=0;i<npages;i++)s+="<br><input type=radio name=p"+(i==ithis?" checked=true":"")+" onclick=parent.fraCode.donext("+(i)+")>"
 if(ianimate)s+="<br>"+jsref("","doanimate(-1)","<img src=img/animate.gif border=0>")
 s+="</form></td><td valign=top>"
 s+=stext
 s+="</td></tr></table>"
 return s
}

function getThePage(n,iwrap,nwrap,ntotal){
 //title info will be   preceding Page|after Page|extra search text or animate info.
 var s=""
 var swhat=thisPage
 var npages=CI[swhat].length/2
 n=(n % npages)
 if(arguments.length<3)nwrap=n
 if(arguments.length<4)ntotal=npages
 if(ntotal==1)iwrap=false
 var sinfo=CI[swhat][n*2]
 var sgif=CI[swhat][n*2+1]
 var ianimate=(npages>1 && CI[swhat].join(",").indexOf("animate")>=0)
 var S=sinfo.split("|")
 var stitle=S[0]+(S.length>1?"|"+S[1]:"")
 sinfo=(S.length>2?S[2]:"")
 S=stitle.split("|")
 s="<img border=0 src="+(sgif.indexOf("..")<0?"img/":"")+sgif+">"
 s="<blockquote>"+S[0]+"</blockquote>"
	+(sgif.length?(iwrap?jsref("","donext("+(n+1)+")",s):"<center>"+s+"</center>"):"")
	+(S.length>1 && !isanimating?"<blockquote>"+S[1]+"</blockquote>":"")
 //if(isbuild)s=s.replace(/\.\.\//g,"../../")
 s=s.replace(/\<IMG /g,"<img src=img/")
 if(iwrap)s=wrapPage(nwrap,ntotal,s,ianimate)
 s=expsub(s)
 s=symclean(s)
 return s
}

function expsub(s){
 var i0=0
 var i1=0
 var stool=""
 var S=new Array()
 while(s.indexOf("$EXP(")>=0){
	i0=s.indexOf("$EXP(")
	i1=s.indexOf(")",i0)
	stool=s.substring(i0+5,i1)
	s=s.substring(0,i0)+getexptoolref(stool,"exp")+s.substring(i1+1,s.length)
 }
 while(s.indexOf("$CON(")>=0){
	i0=s.indexOf("$CON(")
	i1=s.indexOf(")",i0)
	S=s.substring(i0+5,i1).split(",")
	s=s.substring(0,i0)+jsref("concept","showConcept('"+S[0]+"')",S[1])+s.substring(i1+1,s.length)
 }
 while(s.indexOf("$QUIZ(")>=0){
	i0=s.indexOf("$QUIZ(")
	i1=s.indexOf(")",i0)
	stool=s.substring(i0+6,i1)
	s=s.substring(0,i0)+getwebtoollink(stool)+s.substring(i1+1,s.length)
 }
 return s
}


function donext(n){
 isanimating=false
 setTimeout("nextPage("+n+")",200)
}

function getPageLink(i,ijustgetkey){
 var sterm1=IndexData[i].linkterm1
 var sterm2=IndexData[i].linkterm2
 var ich=IndexData[i].ch
 var spage=IndexData[i].ch_page
 var skey=sterm1+(sterm2.length?", "+sterm2:"")
 var skey2=(sterm2.length?revKeyOf([sterm1,sterm2]):"")
 var sout=""

 //looking for page-specific and chapter-specific items here

 if(iHaveCI(spage+":"+skey)){
	skey=spage+":"+skey
 }else if(skey2.length && iHaveCI(spage+":"+skey2)){
	skey=spage+":"+skey2
 }else if(iHaveCI(ich+":"+skey)){
	skey=ich+":"+skey
 }else if(skey2.length && iHaveCI(ich+":"+skey2)){
	skey=ich+":"+skey2
 }else if(iHaveCI(skey)){
 }else if(skey2.length && iHaveCI(skey2)){
	skey=skey2
 }else{
	if(ijustgetkey)return ""
	if(ishowindexnumber)spage+=jsref("nlink","showindexdata("+i+")","#"+i)
	return spage
 }
 if(CI[skey].length<2){
 	skey=CI[skey][0] //only one array element: must be reference to another
 }
 if(ijustgetkey)return skey
 nPages++
 ConceptInfo[nPages]=skey
 sout=jsref("pagelink","doshowinfo("+nPages+")",spage)
 if(ishowindexnumber)sout+=jsref("nlink","showindexdata("+i+")","#"+i)
 return sout
}

function doshowinfo(n){
 showCI(ConceptInfo[n])
}

function dogetchapterlist(n){
 //if(arguments.length)thischapter=n
 var s="<center><form name=info action=javascript://>"
 s+=CHAPTERLISTHEADER
 s+=getChapterSelectList()
 s+="</form></center>"
 document.info.ch.value="1-"+nChapters
 dowrite(parent.fraConcept,s)
}
function doselectch(idokey){
 var slist=""
 var d=parent.fraConcept.document.info.chap
 var n=0
 for(var i=1;i<d.options.length;i++){
	if(d.options[i].selected)n++
 }

 for(var i=1;i<d.options.length;i++){
	 if(n==0||d.options[0].selected||d.options[i].selected)slist+=","+d.options[i].value
 }
 slist=slist.replace(/\,99/,"")
 slist=slist.substring(1,slist.length)
 document.info.ch.value=" "+createListFromArray(createArrayFromList(slist))
 if(idokey==1){ 
	dokeyconcepts()
 }else if(idokey==2){
	if(n==0){
		alert("You must select one or more topics before looking for key links.")
		return
	}
	dokeylinks()
 }else if(idokey==3){
	dosearch(1)
 }else if(idokey==4){
	dogettools()
 }else if(idokey==5){
	dolistscripts()
 }else if(idokey==6){
	dolistexplorations()
 }else{
	dofullindex(ishowindexbypage?1:0)
 }
}

function getToolsList(ichap){
 var sout="<p><p><p><p>"
 var slist=""
 var weblist=""
 var pclist=""
 var stool=""
 var slink=""
 var simg=""
 var s=(ichap<0?createListFromArray(ChapterList):ichap==0?"1-13":ichap+"")
 var S=createArrayFromList(s)
 var nchap=S.length
 S=S.sort(sortn)
 var i=0
 for(var ii=0;ii<S.length;ii++){
	i=parseInt(S[ii])
	if(ChapterTools[i]){
		weblist+=","+ChapterTools[i][0]
		pclist+=","+ChapterTools[i][1]
	}
 }
 slist=""
 S=weblist.split(",")
 for(var i=1;i<S.length;i++){if(S[i].length){
	s=","+S[i]
	if(slist.indexOf(s)<0)slist+=s
 }}
 S=slist.split(",")
 slist=""
 for(var i=1;i<S.length;i++){if(S[i].length){
	stool=S[i]
	s=WebTools[stool][2]
	if(s.indexOf("//")<0)s=jsdir+s
	if(s.indexOf(".htm")<0)s+="/index.htm" 
	slink="<a class=webtool href=\""+s+"\" target="+WebTools[stool][3]+">"
	simg=(WebTools[stool][0].length?slink+"<img src="+jsdir+WebTools[stool][0]+"></a>":"")
	slist+="<tr><td>"+simg+"</a></td><td>"+slink+WebTools[stool][1]+"</a></td></tr>"
 }}
 if(slist.length)sout+="<b>WebTools for "+(ichap<0?"Chapter"+(nchap>1?"s ":" ")+createListFromArray(ChapterList):ChapterTitle[ichap])+"</b><table>"+slist+"</table>"

 slist=""
 S=pclist.split(",")
 for(var i=1;i<S.length;i++){if(S[i].length){
	s=","+S[i]
	if(slist.indexOf(s)<0)slist+=s
 }}
 S=slist.split(",")
 slist=""
 for(var i=1;i<S.length;i++){if(S[i].length){
	stool=S[i]
	s=PCTools[stool][2]
	if(s.indexOf("//")<0)s=pcdir+s
	if(s.indexOf(".")<0)s+=".exe" 
	slink="<a class=pctool href=\""+s+"\">"
	simg=(PCTools[stool][0].length?slink+"<img src="+pcdir+PCTools[stool][0]+"></a>":"")
	slist+="<tr><td>"+simg+"</a></td><td>"+slink+PCTools[stool][1]+"</a></td></tr>"
 }}
 if(slist.length)sout+="<p><p><b>PCTools for "+(ichap<0?"Chapter"+(nchap>1?"s ":" ")+createListFromArray(ChapterList):ChapterTitle[ichap])+"</b><table>"+slist+"</table>"
 if(CHAPTERTYPE=="topic")sout=sout.replace(/Chapter/g,"Topic")
 return sout
}


function getwebtoollink(stool,istable){
	var S=stool.split(".")
	stool=S[0]
	var sq=(S.length>1 && S[1]?QuizID[S[1]]:0)
	var s=WebTools[stool][2]
	if(s.indexOf("//")<0)s=jsdir+s
	if(s.indexOf(".htm")<0)s+="/index.htm" 
	var slink="<a class=webtool href=\""+s+(sq?"?"+sq:"")+"\" target="+WebTools[stool][3]+">"
	var simg=(WebTools[stool][0].length?slink+"<img src="+jsdir+WebTools[stool][0]+">":"")+"</a>"
	slink+=(SimInfo && SimInfo.Exp[stool]?SimInfo.Exp[stool][0]:WebTools[stool][1])+(sq?" problem #"+sq:"")+"</a>"
	if(istable)slink="<td>"+simg+"</td><td colspan=3>"+slink+"</td>"
	return slink
}

function gotoTool(stool){
	var S=stool.split(stool.indexOf("#")<0?".":"#")
	stool=S[0]
	var sq=(S.length<2||!S[1]?0:isNaN(parseFloat(S[1]))?QuizID[S[1]]:S[1])
	var s=WebTools[stool][2]
	if(s.indexOf("//")<0)s=jsdir+s
	if(s.indexOf(".htm")<0)s+="/index.htm"
	if(sq)s+="?"+sq
	parent.fraConcept.location=s
}

function dowritefraconcept(){
 dowrite(parent.fraConcept,FRACONCEPTOUT+"<pre>\n\n\n\n\n\n\n\n</pre>")
 FRACONCEPTOUT=""
}

function listScripts(ichap){
 if(ichap>0)document.info.ch.value=ichap
 var s=(ichap<0?createListFromArray(ChapterList):ichap==0?"1-"+nChapters:ichap+"")
 var S=createArrayFromList(s)
 var W=new Array()
 var sout="<form name=info><b>"+(ichap<0?"Chapters "+createListFromArray(ChapterList):ChapterTitle[ichap])+" (scripts)</b><br><input type=checkbox name=asprint "+(!scripttype?"checked=true":"")+">printable</form><p>"
 var n=0
 var alph="abcdefghijklmnop"
 scripting=true
 sout+="<table><tr><td width=10><td width=10><td width=10><td width=300></tr><tr><td width=10><img src=img/blank.gif></td><td colspan=3></td></tr>"
 for(var i=0;i<S.length;i++){
	ichap=S[i]
	if(Scripts[ichap]){
		if(S.length>1)sout+="<tr><td colspan=4><br><b>"+ChapterTitle[ichap]+"<b></td></tr>"
		n=0
		for(var what in Scripts[ichap]){
			sout+="<tr><td valign=top><b>"+alph.substring(n,n+1)+".</b></td><td colspan=3>"+jsref("concept","doShowScript("+ichap+",'"+ escape(what.replace(/\'/g,"~")) +"')",symclean(what))+"</td></tr>"
			n++
		}
		if(Summaries)sout+="<tr><td></td><td colspan=3>"+jsref("summary","doShowSummary("+ichap+")","Summary Points")+"</td></tr>"
		if(Practice && Practice[ichap])sout+="<tr><td></td><td colspan=3>"+jsref("practice","listPractice("+ichap+")","Practice Questions")
		if(ChapterTools && ChapterTools[ichap][0]!=""){
			W=ChapterTools[ichap][0].split(",")
			for(var j=0;j<W.length;j++){if(W[j].length){
				sout+="<tr>"+getwebtoollink(W[j],true)+"</tr>"
			}}
		}
		sout+"</td></tr>"
	}
 }
 if(Summaries && S.length==nChapters)sout+="<tr><td colspan=4>&nbsp;<p>"+jsref("summary","doShowSummary(0)","<b>Overall Summary of Kinetics</b>")+"</td></tr>"

 sout+="</table>"
 if(CHAPTERTYPE=="topic")sout=sout.replace(/Chapter/g,"Topic")
 dowrite(parent.fraIndex,sout)
}

function listPractice(ichap){
 if(ichap>0)document.info.ch.value=ichap
 var s=(ichap<0?createListFromArray(ChapterList):ichap==0?"1-"+nChapters:ichap+"")
 var S=createArrayFromList(s)
 var sout="<b>"+(ichap<0?"Chapters "+createListFromArray(ChapterList):ChapterTitle[ichap])+" (practice questions)</b><p>"
 var n=0
 sout+="<table><tr><td width=10><td width=10><td width=10><td width=300></tr><tr><td width=10><img src=img/blank.gif></td><td colspan=3></td></tr>"
 for(var i=0;i<S.length;i++){
	ichap=S[i]
	sout+="<tr><td colspan=4>"+getpractice(ichap)+"</td></tr>"
 }
 sout+="</table>"
 if(CHAPTERTYPE=="topic")sout=sout.replace(/Chapter/g,"Topic")
 dowrite(parent.fraIndex,sout)
}


function doShowSummary(ichap){
 var stool=""
 var S=new Array()
 var n=0
 if(ChapterTools[ichap] && ChapterTools[ichap][2]){
	FRACONCEPTOUT="<tr><td colspan=4><br><b>"+(ichap==0?"Kinetics and Mechanism":ChapterTitle[ichap])+"</b></td></tr>"
	var A=ChapterTools[ichap][2].split(",")
	for(var j=0;j<A.length;j++){
		stool=A[j]
		S=Explore_getQuestions(stool,n)
		FRACONCEPTOUT+=S[0]
		if(SimInfo.Exp[stool] && SimInfo.Exp[stool][0]!="")FRACONCEPTOUT+="<br><blockquote>See "+getexptoolref(stool,"exp")+"</blockquote>"
		FRACONCEPTOUT+="<hr>"
		n=S[1]
	}
	dowritefraconcept()
 }
}

function doShowPractice(ichap){
 thispractice=(thispractice==ichap?0:ichap)
 listScripts(ichap)
}


function getpractice(ichap){
 if(!Practice[ichap])return ""
 var s=""
 for(var j=1;j<Practice[ichap].length;j++){
	s+="<p><b>"+j+". </b>"+expsub(Practice[ichap][j])
 }
 return s+"<p>"
}

function listExplorations(ichap){
 var s=(ichap<0?createListFromArray(ChapterList):ichap==0?"1-"+nChapters:ichap+"")
 var S=createArrayFromList(s)
 var sout="<b>"+(ichap<0?"Topics "+createListFromArray(ChapterList):ChapterTitle[ichap])
	+" ("+jsref("","showallexp()","explorations")+")</b><p>"
 var ichap=0
 var A=new Array()
 var n=0
 var alph="abcdefghijklmnop"
 var stool=""
 allexplist=""
 sout+="<table><tr><td width=10><td width=10><td width=10><td width=300></tr><tr><td width=10><img src=img/blank.gif></td><td colspan=3></td></tr>"
 for(var i=0;i<S.length;i++){
	ichap=S[i]
	if(ChapterTools[ichap] && ChapterTools[ichap][2]){
		if(S.length>1)sout+="<tr><td colspan=4><br><b>Topic " + ichap+"<b></td></tr>"
		n=0
		var A=ChapterTools[ichap][2].split(",")
		for(var j=0;j<A.length;j++){
			stool=A[j]
			if(SimInfo.Exp[stool] && SimInfo.Exp[stool][0]!=""){
				sout+="<tr><td valign=top><b>"+alph.substring(n,n+1)+".</b></td><td colspan=3>"+getexptoolref(stool,"webtool")+"</td></tr>"
				allexplist+=","+stool
				n++
			}
		}
	}
 }
 sout+="</table>"
 dowrite(parent.fraIndex,sout)
}

function showallexp(){
 var S=allexplist.split(",")
 FRACONCEPTOUT=""
 for(var i=1;i<S.length;i++)showexplore(S[i],0)
 dowritefraconcept()
}

function showexplore(stool,iwrite){
 if(iwrite)FRACONCEPTOUT=""
 FRACONCEPTOUT+="<table border=2 width=650><tr><td>Click title to start: "+Model_getExp(stool)+"</td></tr></table>"
 if(iwrite)setTimeout("dowritefraconcept()",50)
}

function getexptoolref(stool,cla){
 if(!ExpTools[stool])alert("No ExpTool for "+stool)
 return jsref(cla,"showexplore('"+stool+"',1)",symclean(SimInfo.Exp[stool][0]))
}


function registerquestions(){
 var n=0
 for(var i=1;i<Quest.length;i++){if(Quest[i][0]){
	QuizID[Quest[i][3]]=(++n)
 }}
}
