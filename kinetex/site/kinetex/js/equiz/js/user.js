//6:18 AM 1/16/2003
tsmodel=""
datavar=""
iresult=""
itest=""

function user_indicate(what,Variables,theresult,niter,err){
//alert(what+" "+whendone+" "+Variables+" "+theresult+" "+err)

	if(what=="iter"){
		if(ncycles++>nmaxcycles){
			calc_dosimplex("stop")
			//document.info.result.value+=tsmodel+"\n\n"+datavar+"\nCalculation failed.\n"
			eval(whendone)
		}
		return
	}
	if(what=="reset"){
		return
	}
	if(what=="start"){
		return
	}
	if(what=="stop"){
		return
	}
	if(what=="done"){
		eval(whendone)
		return
	}
}



function user_getinfo(){
 return tsmodel
}

function user_putinfo(smodel){
 tsmodel=smodel
}

function user_getdatavar(){
	return datavar
}
function user_putdatavar(s){
	datavar=s
}

function user_getiresult(){
	return iresult
}
function user_putiresult(s){
	iresult=s
}

function user_getitest(){
	return itest
}
function user_putitest(s){
	itest=s
}

function user_setthevariables(){}

function user_strsub(ssub,ch1,ch2)
{
	if (ch2!=""){if (ch2.indexOf(ch1)>=0) return ssub}
	var s=ssub
	var i=s.indexOf(ch1)
	while (i>=0)
	{
		s=s.substring(0,i)+ch2+s.substring(i+ch1.length,s.length)
		i=s.indexOf(ch1)
	}
	return s
}
