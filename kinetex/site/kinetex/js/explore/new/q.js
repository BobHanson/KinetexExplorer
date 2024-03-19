QInfo=new Array()
QInfo.nq=0
QInfo.includeanswer=autostart
QInfo.Ans=new Array()

function Q_showall(){
 location = (location+"?").split("?")[0]+"?+A"+(SimInfo.options.length?"+OPTIONS="+SimInfo.options:"")
}
function Q_shownone(){
 location = (location+"?").split("?")[0]
}

function Q_ask(q,a){
 if(isqonly)return
 var s=""
 if(QInfo.nq==0){
	s="<p><b>Questions to think about"+(autostart?"":" after carrying out the reaction")+": "
	if(QInfo.includeanswer){
		s+="<a href=javascript:Q_shownone()>no answers</a>"+"<p></b>"
	}else{
		s+="<a href=javascript:Q_showall()>all answers</a>"+"<p></b>"
	}
 }
 QInfo.nq++
 if(a)QInfo.Ans[QInfo.nq]=a
 var sa=(QInfo.includeanswer?"<p><blockquote><b>A:</b> "+Q_getans(QInfo.nq)+"</blockquote>":"<a href=javascript:Q_showans("+QInfo.nq+")>answer</a>")
 s+="<blockquote><b>"+QInfo.nq+".</b> "+q+" "+sa+"</blockquote>"
 document.write(s)
}

function Q_getans(n){
 //why? because this can be overridden.
 return QInfo.Ans[QInfo.nq]
}

function Q_showans(n){
 var s=(1||ExptInfo[smodel].time?QInfo.Ans[n]:"Start the reaction first, then answer this question.")
 alert(s)
}

function Q_format(q,i,isqonly){
 var s=(isqonly||i>1?"":"<p><b>Summary points:<p></b>")
 s+="\n<blockquote><b>"+i+".</b> "+q+"</blockquote>"
 return s
}

