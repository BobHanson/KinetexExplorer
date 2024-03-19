//CHECKJS  D:\js\kinetex\debug.js 1/31/2003 6:28:30 AM
//debug.js
DebugInfo.depth=0			//for getObj()
DebugInfo.depthmax=4		//for getObj()
DebugInfo.nmax=1000		//for getObj()
DebugInfo.nlines=0		//for getObj()

function Debug_alert(smodel){
	alert(DebugInfo[smodel].s)
}

function Debug_getObj(objName,snot){
	if(DebugInfo.nlines>DebugInfo.nmax || DebugInfo.depth==DebugInfo.depthmax)return ""
	DebugInfo.nlines++
	DebugInfo.depth++
	var s = ""

//alert(objName)
	var obj=eval(objName)
//alert(obj)
	for(var i in obj){
//alert(objName+"."+i)
lastobj=objName+"."+i
		i=i+""
		var st=obj[i]+"\n"
		if(st==null){
			s+=objName+"."+i+" = *UNDEFINED*\n"
		}else if(i=="all" || i=="document"
			|| i.indexOf("efault")
			|| i.indexOf("wner")
			|| i.indexOf("top")
			|| i.indexOf("ode")
			|| i.indexOf("namespaces")
			|| i.indexOf("arent")
			|| i.indexOf("hild")
			|| i.indexOf("self")
			|| i.indexOf("Sibling")
			|| i.indexOf("window")
			|| i.indexOf("frame")
			|| i.indexOf("next")
			|| i.indexOf("previous")
			){
lastobj=objName+"."+i+"OK2"
			s+=""+objName+"["+i+"]"+" = "+st.replace(/</g,"&lt;")
lastobj=objName+"."+i+"OK3"
		}else{
lastobj=objName+"."+i+"OK"+st

			if(snot==null || st.indexOf(snot)<0){
				s+=objName+"["+i+"]"+" = "+st.replace(/</g,"&lt;")
			}

			var t=(!obj[i]?"":typeof(eval(objName+"['"+i+"']")))


			if( (st.indexOf("[")>=0 || t.indexOf("bject"))){
				if(isNaN(i)){
						s+=Debug_getObj(objName+"['"+i+"']",snot)
				}else{
					if(objName.indexOf(".all")<0){
						s+=Debug_getObj(objName+"["+i+"]",snot)
					}
				}
			}

		}
	}
	DebugInfo.depth--
lastobjret=s
	return s
}

function Debug_initialize(smodel){
	DebugInfo[smodel]=new Array()
	DebugInfo[smodel].s=smodel
}

function Debug_show(smodel){
	Util_createWindow("<pre>"+DebugInfo[smodel].s+"</pre>"+Debug_getObj(ModelInfo[smodel]))
}

function Debug_showObj(objName,smsg){
	if(arguments.length==0)objName=prompt("enter an object name","document")
	var s=Debug_getObj(objName)
	Util_createWindow(smsg+"<pre>"+s+"</pre>")
}
