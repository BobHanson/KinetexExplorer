//6:18 AM 1/16/2003
tsmodel=""
datavar=""
iresult=""
itest=""

function user_indicate(what,Variables,theresult,niter,err){
alert(what)
	if(what=="iter"){
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

