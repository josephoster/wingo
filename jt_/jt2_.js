/**
 * jt2_.js - "JavaScript Toolkit", V.2 (re-factored Nov 1 2009 from 'jt_.js'; was 'jt_utils.js')
 *
 * Copyright (c) 2005-2012 by Joseph Oster, wingo.com
 * http://www.wingo.com/jt_/jt_.js
 * @license http://www.wingo.com/jt_/jt_license.html
 */

String.prototype.trim = function () {
	return this.replace(/^\s+/g, '').replace(/\s+$/g, '');
}

var jt_ = {

	showHideElm: function(elm, showIt, showStyle) {
		if (elm) {elm.style.visibility = (showIt) ? (showStyle ? showStyle : 'visible') : 'hidden';}
	},

	showNoneElm: function(elm, showIt, showStyle) {
		if (elm) {elm.style.display = showIt ? (showStyle ? showStyle : 'block') : 'none';}
	},

	showHide: function(divName, showIt, showStyle) {
		jt_.showHideElm(document.getElementById(divName), showIt, showStyle);
	},

	showNone: function(divName, showIt, showStyle) {
		//alert("showNone=" + divName + "][showIt=" + showIt);
		//	jt_.Trace.msg("showNone=" + divName + "][showIt=" + showIt);
		jt_.showNoneElm(document.getElementById(divName), showIt, showStyle);
	},

	strEmpty: function(st) {
		return (typeof st === 'string') ? (st.trim() == '') : true;
	},

	zInt: function(val) {
		var num = parseInt(val);
		return isNaN(num) ? 0 : num;
	},

	zFloat: function(val) {
		var num = parseFloat(val);
		return isNaN(num) ? 0 : num;
	},

	valPx: function(pixels) {
		return isNaN(pixels) ? 0 : pixels + "px";
	},

	moveTo: function(obj, x, y) {
		obj.style.left = jt_.valPx(x);
		obj.style.top = jt_.valPx(y);
	},

	Point: function(x, y) {
		// returns a "Point" object with '.x' and '.y' properties
		this.x = x;
		this.y = y;
	},

	getOffsetXY: function(obj, findID, point) {
		// returns 'jt_.Point' object with '.x' and '.y' offsets of 'obj' relative to page
		// or relative to optional 'findID', if 'findID' is found as a parent
		if (point) { // optional 'point' is re-used when valid; good practice when dragging
			point.x = obj.offsetLeft;
			point.y = obj.offsetTop;
		}
		else {point = new jt_.Point(obj.offsetLeft, obj.offsetTop);}
		var parent = obj.offsetParent;
		while (parent !== null) {
			if (findID && (parent.id == findID)) break;
			point.x += parent.offsetLeft;
			point.y += parent.offsetTop;
			parent = parent.offsetParent;
		}
		return point;
	},

	addListener: function(obj, evType, fn) {
		if (obj.addEventListener) {obj.addEventListener(evType, fn, false);}
		else if (obj.attachEvent) {obj.attachEvent('on' + evType, fn);}
	},

	remListener: function(obj, evType, fn) {
		if (obj.removeEventListener) {obj.removeEventListener(evType, fn, false);}
		else if (obj.detachEvent) {obj.detachEvent('on' + evType, fn);}
	},

	fixE: function(ev) {
		return ev ? ev : window.event;
		//var e = ev ? ev : window.event;
		//return e;
	},

	cancelEvent: function(ev) {
		var e = jt_.fixE(ev);
		if (e.stopPropagation) e.stopPropagation();
		if(e.preventDefault) e.preventDefault();
		e.cancelBubble = true;
		e.cancel = true;
		e.returnValue = false;
		return false;
	},

	setOpacity: function(elm, opacity) {
		elm.style.opacity = opacity / 100;
		elm.style.filter = 'alpha(opacity=' + opacity + ')';
	},

	currStyle: function(divToRead) { // return current (derived) CSS style object
		var cs = divToRead.style;
		if (window.getComputedStyle) {cs = window.getComputedStyle(divToRead,null);}
		else if (divToRead.currentStyle) {cs = divToRead.currentStyle;}
		return cs;
	},

	width: function(divToRead, currStyle) {
		var wide = currStyle ? currStyle.width : jt_.currStyle(divToRead).width;
		return (wide = 'auto') ? divToRead.offsetWidth : parseInt(wide);
	},

	height: function(divToRead, currStyle) {
		var high = currStyle ? currStyle.height : jt_.currStyle(divToRead).height;
		return (high = 'auto') ? divToRead.offsetHeight : parseInt(high);
	},

	winW: function() {
		if (document.documentElement && (document.documentElement.clientWidth > 0)) {return document.documentElement.clientWidth;}
		else if (window.innerWidth) {return window.innerWidth;}
		else {return document.body.clientWidth;}
	},

	winH: function() {
		if (document.documentElement && (document.documentElement.clientHeight > 0)) {return document.documentElement.clientHeight;}
		else if (window.innerHeight) {return window.innerHeight;}
		else {return document.body.clientHeight;}
	},

	scrollLeft: function() {
		if (window.pageXOffset) {return window.pageXOffset;}
		else if (document.documentElement && (document.documentElement.scrollLeft > 0)) {return document.documentElement.scrollLeft;}
		else {return document.body.scrollLeft;}
	},

	scrollTop: function() {
		if (window.pageYOffset) {return window.pageYOffset;}
		else if (document.documentElement && (document.documentElement.scrollTop > 0)) {return document.documentElement.scrollTop;}
		else {return document.body.scrollTop;}
	},

	htmlEncode: function(st) {
		if (st.length === 0) return "";
		st = st.replace(/</gi,"&lt;");
		st = st.replace(/>/gi,"&gt;");
		st = st.replace(/\"/gi,'&quot;');
		st = st.replace(/\'/gi,"&#39;");
		st = st.replace(/\\/gi,"&#92;");
		return st;
	},

	htmlDecode: function(st) {
		if (st.length === 0) return "";
		st = st.replace(/&lt;/gi,"<");
		st = st.replace(/&gt;/gi,">");
		st = st.replace(/&quot;/gi,'"');
		st = st.replace(/&#39;/gi,"'");
		st = st.replace(/&#92;/gi,"\\");
		return st;
	},

	parseQuery: function(queryString) { // converts name/value pairs in 'queryString' to JS object
		var stQuery = (queryString) ? queryString : location.search; // use 'top.location.search' if 'queryString' is null
		if (stQuery.indexOf("?") === 0) stQuery = stQuery.substring(1);
		var qObj = {};
		if (stQuery) {
			var nvPairs = stQuery.split("&");
			for (var i=0; i < nvPairs.length; i++) {
				var posEq = nvPairs[i].indexOf("=");
				if (posEq !== -1) {
					var nam = nvPairs[i].substring(0,posEq);
					if (nam.indexOf('.') === -1) qObj[nam] = nvPairs[i].substring(posEq+1);
				}
			}
		}
		return qObj;
	},

	getKeycode: function(e) {
		if (window.event) return window.event.keyCode;
		else if (e) return e.which;
		else return true;
	},

	onEnter: function(e, callFunc) {
		if (jt_.getKeycode(e) == 13) {
			callFunc();
			return false;
		}
		else return true;
	},

	delChildren: function(elm) { // remove all child nodes of 'elm' from DOM and delete them
		while (elm.hasChildNodes()) {
			var oldChild = elm.removeChild(elm.childNodes[elm.childNodes.length-1]);
			delete(oldChild);
		}
	},

	objCount: function(obj) {
		var tot = 0;
		for (var prop in obj) tot++;
		return tot;
	}

}; /********* END: jt_ (additional parts below) *******/



jt_.cssClass = { // CSS classNames

	add: function(elm, className) {
		if (elm) {
			var obj = jt_.cssClass.asObj(elm);
			obj[className] = true;
			elm.className = jt_.cssClass.asStr(obj);
		}
	},

	rem: function(elm, className) {
		if (elm) {
			var obj = jt_.cssClass.asObj(elm);
			delete obj[className];
			elm.className = jt_.cssClass.asStr(obj);
		}
	},

	rpl: function(elm, remClassName, addClassName) {
		if (elm) {
			var obj = jt_.cssClass.asObj(elm);
			delete obj[remClassName];
			obj[addClassName] = true;
			elm.className = jt_.cssClass.asStr(obj);
		}
	},

	asObj: function(elm) {
		var obj = {};
		if (elm.className) {
			var list = elm.className.split(' ');
			for (var i=0; i<list.length; i++) {
				obj[list[i]] = true;
			}
		}
		return obj;
	},

	asStr: function(obj) {
		var st = '';
		var sep = '';
		for (var prop in obj) {
			st += sep + prop;
			sep = ' ';
		}
		return st;
	}

}


jt_.fo = { // Form Ops

	setRadio: function(radioFld, val) { // set 'radioFld' button with value == val and return 'true' (if not disabled!)
		for (var i=0; i<radioFld.length; i++) {
			if (radioFld[i].value == val) {
				if (!radioFld[i].disabled) {
					radioFld[i].checked = true;
					return true;
				}
			}
		}
		return false;
	},

	getRadio: function(radioFld) { // return value of selected 'radioFld' button
		var st = "";
		for (var i=0; i<radioFld.length; i++) {
			if (radioFld[i].checked) {
				st = radioFld[i].value;
				break;
			}
		}
		return st;
	},

	selected: function(pulldown) { // return value of selected item
		var st = "";
		for (var i=0; i<pulldown.options.length; i++) {
			if (pulldown.options[i].selected) {
				if (pulldown.options[i].value) st = pulldown.options[i].value
				else st = pulldown.options[i].text;
				break;
			}
		}
		return st;
	},

	posInList: function(pulldown, val) { // return position of 'val' in pulldown menu, -1 if not found
		if (val !== "") {
			for (var i=0; i<pulldown.options.length; i++) {
				var opVal = pulldown.options[i].value;
				if (opVal === "") opVal = pulldown.options[i].text;
				if (opVal == val) {
					return i;
					break;
				}
			}
		}
		return -1;
	},

	setSelectVal: function(pulldown, val) { // set "SELECTED" for item in pulldown menu with 'value===val'
		var p = jt_.fo.posInList(pulldown,val);
		pulldown.options.selectedIndex = (p != -1) ? p : 0;
	},

	formStr: function(aForm) {
		var qSt = '';
		for (var i=0; i<aForm.elements.length; i++) {
			if ((aForm.elements[i].type == 'radio') || (aForm.elements[i].type == 'checkbox')) {
				if (aForm.elements[i].checked) {
					qSt += '&' + aForm.elements[i].name + '=' + aForm.elements[i].value || 'checked';
				}
			}
			else if (aForm.elements[i].type.indexOf('select') !== -1) {
				for (var j=0; j<aForm.elements[i].options.length; j++) {
					if (aForm.elements[i].options[j].selected) {
						qSt += '&' + aForm.elements[i].name + '=' + encodeURIComponent((aForm.elements[i].options[j].value) ? aForm.elements[i].options[j].value : aForm.elements[i].options[j].text);
					}
				}
			}
			else {
				qSt += '&' + aForm.elements[i].name + '=' + encodeURIComponent(aForm.elements[i].value);
			}
		}
		return qSt;
	}

}; /********* END: jt_.fo (Form Ops) *******/



jt_.FormValid = { // Form Validation

	reset: function() {
		jt_FormValid.msg = "";
		jt_FormValid.focusIsSet = false;
	},

	reqField: function(formField, fldLabel) {
		if (formField.type != 'file') formField.value = formField.value.trim(); // security error for 'file'
		if (formField.value == "") jt_FormValid.setError(formField, jt_FormValid.pleaseEnter + fldLabel + ".");
	},

	reqSelect: function(formField, fldLabel) {
		if (formField.selectedIndex == 0) jt_FormValid.setError(formField, "Please select " + fldLabel + ".");
	},

	reqEmail: function(formField) {
		formField.value = formField.value.trim();
		if (formField.value == "") jt_FormValid.setError(formField, jt_FormValid.pleaseEnter + "Email Address.");
		else if (!jt_FormValid.validEmail(formField.value)) jt_FormValid.setError(formField, "Email Address is invalid.");
	},

	validEmail: function(emailStr) {
		// return true if 'emailStr' has valid email address format
		var emailPat=/^(.+)@(.+)$/
		var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]"
		var validChars="\[^\\s" + specialChars + "\]"
		var quotedUser="(\"[^\"]*\")"
		var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/
		var atom=validChars + '+'
		var word="(" + atom + "|" + quotedUser + ")"
		var userPat=new RegExp("^" + word + "(\\." + word + ")*$")
		var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$")
		var matchArray=emailStr.match(emailPat)
		if (matchArray==null) return false
		var user=matchArray[1]
		var domain=matchArray[2]
		if (user.match(userPat)==null) return false
		var IPArray=domain.match(ipDomainPat)
		if (IPArray!=null) {
			for (var i=1;i<=4;i++) {
				if (IPArray[i]>255) return false
			}
			return true
		}
		var domainArray=domain.match(domainPat)
		if (domainArray==null) return false
		var atomPat=new RegExp(atom,"g")
		var domArr=domain.match(atomPat)
		var len=domArr.length
		if (domArr[domArr.length-1].length<2 || 
		domArr[domArr.length-1].length>4) return false
		if (len<2) return false
		return true;
	},

	setFldGood: function(formField) {
		formField.className = "formFldGood";
	},

	setError: function(formField, addMsg) {
		jt_FormValid.msg += addMsg + "\n";
		formField.className = "formFldBad";
		if (!jt_FormValid.focusIsSet) {
			formField.focus();
			jt_FormValid.focusIsSet = true;
		}
	},

	pleaseEnter: "Please enter ",
	msg: "",
	focusIsSet: false
}; /********* END: jt_.FormValid *******/



/********* BEGIN: jt_.Cookie *******/
// NOTE: jt_.Cookie is based largely on code originally from Netscape
jt_.Cookie = function(document, name, hours, path, domain, secure) {
	this.$document = document;
	this.$name = name;
	this.$hours = hours;
	this.$path = path;
	this.$domain = domain;
	this.$secure = secure;
}

jt_.Cookie.prototype.store = function() {
	var cookieval = "";
	for(var prop in this) {
		if ((prop.charAt(0) == '$') || ((typeof this[prop]) == 'function')) continue;
		if (cookieval != "") cookieval += '&';
		cookieval += prop + ':' + escape(this[prop]);
	}
	var cookie = this.$name + '=' + cookieval;
	if (this.$hours) {
		var expiration = new Date((new Date()).getTime() + this.$hours*3600000);
		cookie += '; expires=' + expiration.toGMTString();
	}
	if (this.$path) cookie += '; path=' + this.$path;
	if (this.$domain) cookie += '; domain=' + this.$domain;
	if (this.$secure) cookie += '; secure';
	this.$document.cookie = cookie;
}

jt_.Cookie.prototype.load = function() {
	var allcookies = this.$document.cookie;
	if (allcookies == "") return false;

	var start = allcookies.indexOf(this.$name + '=');
	if (start == -1) return false;
	start += this.$name.length + 1;
	var end = allcookies.indexOf(';', start);
	if (end == -1) end = allcookies.length;
	var cookieval = allcookies.substring(start, end);

	var a = cookieval.split('&');
	for(var i=0; i < a.length; i++) a[i] = a[i].split(':');
	for(var i = 0; i < a.length; i++) {this[a[i][0]] = unescape(a[i][1])};
	return true;
}

jt_.Cookie.prototype.setAsObj = function(obj) {
	var old = this.getAsObj();
	for(var prop in old) delete this[old[prop]];
	for(var prop in obj) this[prop] = obj[prop];
}

jt_.Cookie.prototype.getAsObj = function() {
	var obj = {};
	for(var prop in this) {
		if ((prop.charAt(0) == '$') || ((typeof this[prop]) == 'function')) continue;
		obj[prop] = this[prop];
	}
	return obj;
}

jt_.Cookie.prototype.remove = function() {
	var cookie = this.$name + '=';
	if (this.$path) cookie += '; path=' + this.$path;
	if (this.$domain) cookie += '; domain=' + this.$domain;
	cookie += '; expires=Fri, 02-Jan-1970 00:00:00 GMT';
	this.$document.cookie = cookie;
} /********* END: jt_.Cookie *******/



/********* BEGIN: AJAX features *******/
jt_.xhr = {

	newRequest: function() {
		// CONSTRUCTOR for basic XMLHttpRequest object 'xh_Request'
		// - USAGE: var req = jt_.xhr.newRequest();  NOTE: DO _NOT_ USE 'new jt_.xhr.newRequest()'!
		// source: http://developer.yahoo.com/javascript/howto-ajax.html
		var xmlhttp = null;
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
			if (typeof xmlhttp.overrideMimeType != 'undefined') {
				xmlhttp.overrideMimeType('text/xml');
			}
		}
		else if (window.ActiveXObject) {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		return xmlhttp;
	},

	statusMsg: function(state) {
		var msg = state;
		switch (state) {
			case 0: {msg = "Uninitialized"; break;}
			case 1: {msg = "Loading..."; break;}
			case 2: {msg = "Loaded"; break;}
			case 3: {msg = "Interactive"; break;}
			case 4: {msg = "Complete"; break;}
		}
		return msg;
	},

	getNode: function(atNode, nodeName) { // returns XML DOM node of first 'nodeName' child of 'atNode' (typically unique!)
		return atNode.getElementsByTagName(nodeName)[0];
	},

	nodeVal: function(atNode) { // returns 'nodeValue' of 'atNode'
		return atNode ? atNode.firstChild.nodeValue : '';
	},

	getNodeVal: function(atNode, nodeName) { // returns 'nodeValue' of first 'nodeName' child of 'atNode' (typically unique!)
		return jt_.xhr.nodeVal(jt_.xhr.getNode(atNode, nodeName));
	},

	getNodeAttr: function(atNode, attrName) {
		return atNode.getAttribute(attrName);
	},

	ajaxThis: function(url, func, req) {
		if (!req) req = jt_.xhr.newRequest();
		if (req.readyState != 0) req.abort();
		req.open("GET", url, true);
		req.onreadystatechange = function () {
			if (req.readyState == 4) {
				if (func) func(req);
			}
		}
		req.send(null);
	}

}; /********* END: AJAX features *******/



jt_.BodyZ = { /***** manages z-Index visibility */
	toTop: function(elm) { // adds any 'elm' to top of 'jt_.BodyZ.que'
		if (!jt_.BodyZ.que) {
			jt_.BodyZ.que = document.createElement("div");
			document.body.appendChild(jt_.BodyZ.que);
		}
		if (!elm._jt_BodyZZ) {
			elm._jt_BodyZZ = jt_.BodyZ.nid++;
			jt_.addListener(elm, "mousedown", function() {
				jt_.BodyZ.toTop(elm);
				if (jt_.BodyZ.trace && (elm != jt_.Trace.tDIV)) {jt_.TraceObj.show(elm);}
			});
			jt_.BodyZ.que.appendChild(elm);
			jt_.BodyZ.set(elm);
		}
		else if (elm._jt_BodyZZ != jt_.BodyZ.last._jt_BodyZZ) jt_.BodyZ.set(elm);
	},

	// PRIVATE BELOW
	set: function(elm) {
		elm.style.zIndex = jt_.BodyZ.nextZ++;
		jt_.BodyZ.last = elm;
	},
	nid:1,
	nextZ:1
}; /********* END: jt_.BodyZ *******/



jt_.Veil = { /***** cooperates w/ 'jt_.BodyZ', required by 'jt_DialogBox' */
	show: function(showIt) {
		jt_.Veil.init();
		if (!showIt) jt_.Veil.reqs.pop();
		else if (jt_.BodyZ.last) jt_.Veil.reqs.push(jt_.BodyZ.last);
		if (jt_.Veil.reqs.length > 0) {
			jt_.Veil.fix();
			jt_.Veil.veil.style.zIndex = jt_.Veil.reqs[jt_.Veil.reqs.length-1].style.zIndex-1;
			jt_.BodyZ.que.insertBefore(jt_.Veil.veil, jt_.Veil.reqs[jt_.Veil.reqs.length-1]);
		}
		jt_.Veil.setVis();
	},

	// PRIVATE BELOW
	setVis: function() {
		jt_.showNoneElm(jt_.Veil.veil, jt_.Veil.reqs.length > 0);
	},
	fix: function() {
		jt_.showNoneElm(jt_.Veil.veil);
		jt_.Veil.veil.style.width = jt_.valPx(Math.max(jt_.width(document.body), jt_.winW()));
		jt_.Veil.veil.style.height = jt_.valPx(Math.max(jt_.height(document.body), jt_.winH()));
		jt_.Veil.setVis();
	},
	init: function() {
		if (typeof jt_.Veil.veil == "undefined") { // once per page
			jt_.Veil.reqs = [];
			jt_.Veil.veil = document.createElement('div');
			jt_.Veil.veil.innerHTML = "&nbsp;";
			jt_.Veil.default_css();
			if (jt_.BodyZ.que) jt_.BodyZ.que.insertBefore(jt_.Veil.veil, jt_.BodyZ.que.firstChild);
			else jt_.BodyZ.toTop(jt_.Veil.veil);
			jt_.addListener(window, "resize", jt_.Veil.fix);
		}
	},
	default_css: function() {
		for (var prop in jt_.Veil.css) jt_.Veil.veil.style[prop] = jt_.Veil.css[prop];
	},
	css: {position:"absolute", display:"none", top:0, left:0, cursor:"not-allowed", backgroundColor:"#000000", filter:"alpha(opacity=20)", opacity:0.2}
}; /********* END: jt_.Veil *******/



/********* BEGIN: jt_.AnimCalc *******/
jt_.AnimCalc = function(dummy, callFunc, specs) {
	this._callFunc = callFunc;
	this.ranges = {};
	this._specs = {};
	this.setSpecs(jt_.AnimCalc.defaultSpecs);
	if (specs) this.setSpecs(specs);
}

jt_.AnimCalc.prototype.setRange = function(name, from, to) {
	this.ranges[name] = {'from':from, 'to':to, 'delta':to - from};
}

jt_.AnimCalc.prototype.flipRange = function() {
	for (var prop in this.ranges) {
		var temp = this.ranges[prop].from;
		this.ranges[prop].from = this.ranges[prop].to;
		this.ranges[prop].to = temp;
		this.ranges[prop].delta = this.ranges[prop].to - this.ranges[prop].from;
	}
}

jt_.AnimCalc.prototype.start = function(callDone) {
	this.stop();
	this._callDone = callDone;
	this.step = 0;
	this._frac = this.step;
	this._callFunc(0);
	var aCalcInst = this;
	this.timer = setInterval(function() {
			aCalcInst.step++;
			aCalcInst._frac = (1 - Math.cos(aCalcInst.step * aCalcInst.piStep)) / 2;
			aCalcInst._callFunc(aCalcInst.step);
			if (aCalcInst.step == aCalcInst._specs.numSteps) {
				aCalcInst.stop();
			}
		}, this.interval);
}

jt_.AnimCalc.prototype.stop = function() {
	if (this.timer) {
		clearInterval(this.timer);
		this.timer = null;
		if (this.step !== this._specs.numSteps) { // skip to last!
			this.step = this._specs.numSteps;
			this._frac = 1;
			this._callFunc(this.step);
			}
		if (this._callDone) {
			this._callDone();
		}
	}
}

jt_.AnimCalc.prototype.getVal = function(name) {
	return this.ranges[name].from + Math.round(this._frac * this.ranges[name].delta);
}

jt_.AnimCalc.prototype.setSpecs = function(specs) {
	for (var prop in specs) this._specs[prop] = specs[prop];
	this.interval = Math.round(this._specs.elapsed / this._specs.numSteps);
	this.piStep = Math.PI / this._specs.numSteps;
}

jt_.AnimCalc.defaultSpecs = {'numSteps':10, 'elapsed':333};
/********* END: jt_.AnimCalc *******/



/********* BEGIN: jt_.AnimBox *******/
jt_.AnimBox = function(boxDIV, opacityDIV, anim_Specs) {
	this._boxDIV = boxDIV;
	this._boxDIV.style.overflow = 'hidden';
	this._opacityDIV = opacityDIV ? opacityDIV : boxDIV;
	this.getBoxSize();
	this.wantShow = false;
	this.setStyle('TL'); // default is from top/left
	var aBox = this;
	this.animC = new jt_.AnimCalc(true, function() {
		aBox._boxDIV.style.width = jt_.valPx(aBox.animC.getVal('width'));
		aBox._boxDIV.style.height = jt_.valPx(aBox.animC.getVal('height'));
		if (aBox._animStyle == 'TR') aBox._boxDIV.style.left = jt_.valPx(aBox.animC.getVal('left'));
		if (aBox._opacityDIV) jt_.setOpacity(aBox._opacityDIV, aBox.animC.getVal('opacity'));
		}, anim_Specs);
	jt_.AnimBox.boxList.push(this);
}

jt_.AnimBox.prototype.getBoxPos = function() {
	this.oLeft = parseInt(this._boxDIV.style.left);
	this.oTop = parseInt(this._boxDIV.style.top);
}

jt_.AnimBox.prototype.getBoxSize = function() {
	var currStyle = jt_.currStyle(this._boxDIV);
	this.oWidth = jt_.width(this._boxDIV, currStyle);
	this.oHeight = jt_.height(this._boxDIV, currStyle);
	this.getBoxPos();
}

jt_.AnimBox.prototype.setStyle = function(animStyle) { // currently supported: 'TL' and 'TR'
	this._animStyle = animStyle;
}

jt_.AnimBox.prototype.showHide = function(showIt, callDone) {
	if (showIt !== this.wantShow) {
		this.wantShow = showIt;
		if (showIt) jt_.SelectTags.hide();
		this._callDone = callDone;
		var isOn = (this._boxDIV.style.visibility !== 'hidden') && (this._boxDIV.style.display !== 'none');
		if (!isOn) {
			jt_.showHideElm(this._boxDIV, false);
			jt_.showNoneElm(this._boxDIV, true, 'block');
		}
		this.getBoxPos();
		this.animC.setRange('width', showIt ? 0 : this.oWidth, showIt ? this.oWidth : 0);
		this.animC.setRange('height', showIt ? 0 : this.oHeight, showIt ? this.oHeight : 0);
		this.animC.setRange('left', showIt ? this.oLeft + this.oWidth : this.oLeft, showIt ? this.oLeft : this.oLeft + this.oWidth);
		if (this._opacityDIV) this.animC.setRange('opacity', showIt ? 0 : 100, showIt ? 100 : 0);
		jt_.showHideElm(this._boxDIV, true);
		var aBox = this;
		this.animC.start(function() {
			if (aBox.wantShow) {
				if (!aBox._boxDIV._jt_CloseSize) {
					aBox._boxDIV.style.height = '';
				}
			}
			else {
				jt_.showHideElm(aBox._boxDIV);
				aBox._boxDIV.style.left = jt_.valPx(aBox.oLeft);
				aBox._boxDIV.style.width = jt_.valPx(aBox.oWidth);

				// 'jt_.SelectTags' for IE6
				var noRefs = true;
				for (var i=0; i<jt_.AnimBox.boxList.length; i++)
					if (jt_.AnimBox.boxList[i].wantShow) {noRefs = false; break;};
				if (noRefs) jt_.SelectTags.show();
			}
			if (aBox._callDone) aBox._callDone();
		});
	}
}

jt_.AnimBox.prototype.toggle = function(callDone) {
	this.showHide(!this.wantShow, callDone);
}

jt_.AnimBox.boxList = [];
/********* END: jt_.AnimBox *******/



/********* BEGIN: jt_.Slider *******/
jt_.Slider = function(track, onDrag) {
	this.track = track;
	this.track.onclick = jt_.Slider.clickTrack;
	this.track._jt_Slider = this;
	this.onDrag = onDrag;
	for (var i=0; i<track.childNodes.length; i++) {
		if (track.childNodes[i].getAttribute) {
			if (track.childNodes[i].getAttribute("jt_.Slider") == "handle") {
				this.handle = track.childNodes[i];
				jt_.addListener(this.handle, "mousedown", function(ev) {
					var e = jt_.fixE(ev);
					var node = e.target ? e.target : e.srcElement;
					if (node._jt_Slider.enabled) node._jt_Slider.dragging = true;
				});
				this.handle._jt_Slider = this;
				this.len = this.track.offsetWidth - this.handle.offsetWidth;
				Drag.init(this.handle, null, 0, this.len, this.handle.offsetTop, this.handle.offsetTop);
				this.handle.onDrag = function(x, y) {
					var _this = Drag.obj._jt_Slider;
					if (_this.enabled) {
						if (_this.progress) _this.progress.style.width = jt_.valPx(x);
						_this.onDrag(x / _this.len);
					}
				};
			}
			else if (track.childNodes[i].getAttribute("jt_.Slider") == "progress") {
				this.progress = track.childNodes[i];
				this.progress.onclick = jt_.Slider.clickTrack;
				this.progress._jt_Slider = this;
			}
		}
	}
	this.enabled = true;
}

jt_.Slider.prototype.setPos = function(pct) {
	var px = jt_.valPx(Math.round(this.len * jt_.Slider.minMax(pct)));
	this.handle.style.left = px;
	if (this.progress) this.progress.style.width = px;
}

jt_.Slider.prototype.getPos = function() {
	return parseInt(this.handle.style.left) / this.len;
}

jt_.Slider.prototype.enable = function(onOff) {
	this.enabled = onOff;
	jt_.showHideElm(this.handle, onOff);
	jt_.showHideElm(this.progress, onOff);
}

jt_.Slider.clickTrack = function(ev) {
	var e = jt_.fixE(ev);
	var node = e.target ? e.target : e.srcElement;
	var _this = node._jt_Slider;
	if (_this.dragging) _this.dragging = false;
	else if (_this.enabled) {
		var pct = jt_.Slider.minMax((e.clientX + document.body.scrollLeft - jt_.getOffsetXY(node).x) / _this.len);
		_this.setPos(pct);
		_this.onDrag(pct);
	}
}

jt_.Slider.minMax = function(pct) {
	if (pct > 0.99999) pct = 0.99999; // VLC 'input.position' bug!
	else if (pct < 0) pct = 0;
	return pct;
}
/********* END: jt_.Slider *******/



/********* BEGIN: jt_.ProgressBar *******/
jt_.ProgressBar = function(parent, width, fontSize, barClass) {
	// constructor for Progress Bar object; 'width' and 'fontSize' in pixels
	this.fontSize = fontSize;
	this.outerDIV = document.createElement("div");
	parent.appendChild(this.outerDIV);
	if (barClass) this.outerDIV.className = barClass;
	else {
		this.pixels = width;
		this.outerDIV.style.width = (width + 2) + "px";
		this.outerDIV.style.textAlign = "left";
		this.outerDIV.style.border = "1px solid #000000";
		this.outerDIV.style.background = "#FFFFFF";
		this.outerDIV.style.fontFamily = "Arial,Verdana";
		this.outerDIV.style.fontSize = fontSize + "px";
	}

	this.fillDIV = document.createElement("div");
	this.outerDIV.appendChild(this.fillDIV);
	this.fillDIV.style.textAlign = "right";
	this.fillDIV.style.overflow = "hidden";
	this.fillDIV.innerHTML = "&nbsp;";
	this.fillDIV.style.width = "0px";
	if (!barClass) {
		this.fillDIV.style.background = "#00008b";
		this.fillDIV.style.border = "1px solid #FFFFFF";
		this.fillDIV.style.color = "#FFFFFF";
	}
	var os = jt_.currStyle(this.outerDIV);
	var fs = jt_.currStyle(this.fillDIV);
	this.pixels = jt_.width(this.outerDIV) - jt_.zInt(os.paddingLeft) - jt_.zInt(os.paddingRight) - jt_.zInt(os.borderLeftWidth) - jt_.zInt(os.borderRightWidth) - jt_.zInt(fs.borderLeftWidth) - jt_.zInt(fs.borderRightWidth);
}

jt_.ProgressBar.prototype.setPercent = function(pct) {
	// expects 'pct' values between 0.0 and 1.0
	var fillPixels = 0;
	if (pct <= 0) {
		pct = 0.0;
	}
	else if (pct >= 1.0) {
		pct = 1.0;
		fillPixels = this.pixels;
	}
	else fillPixels = Math.round(this.pixels * pct);
	if (this.fontSize > 0) this.fillDIV.innerHTML = Math.round(100 * pct) + "%";
	this.fillDIV.style.width = fillPixels + "px";
}
/********* END: jt_.ProgressBar *******/



/********* BEGIN: Misc. functions *******/
jt_.objJSON = function(obj) {
	if (typeof obj == 'string') return '"' + obj + '"';
	else if (typeof obj == 'object') {
		if (obj.length && (obj.length > 0)) { // array
			var st = '';
			for (var i=0; i<obj.length; i++) {
				st += (st == '' ? '' : ', ') + jt_.objJSON(obj[i]);
			}
			return "[" + st + "]";
		}
		else { // object
			var st = '';
			for (var prop in obj) {
				st += (st == '' ? '' : ', ') + '"' + prop + '":' + jt_.objJSON(obj[prop]);
			}
			return "{" + st + "}";
		}
	}
};

jt_.objClone = function(obj) {
	var newObj = {};
	for (var prop in obj) {
		newObj[prop] = (typeof obj[prop] == 'object') ? jt_.objClone(obj[prop]) : obj[prop];
	}
	return newObj;
};

jt_.hyphenCamel = function(cssName) {
	if (cssName == 'float') {
		return jt_.isIE ? 'styleFloat' : 'cssFloat';
	}
	else {
		var parts = cssName.split('-');
		if (parts.length > 1) {
			return parts[0] + parts[1].substr(0,1).toUpperCase() + parts[1].substr(1);
		}
		else return cssName;
	}
};

jt_.cssApply = function(cssList, toDIV) {
	for (var prop in cssList) toDIV.style[jt_.hyphenCamel(prop)] = cssList[prop];
};


jt_.jsonToHTML = function(parent, json, jsonMap, mapToID) {
	if (json.tag) {
		var obj = document.createElement(jt_.isIE && (json.tag == 'input') ? '<input type="' + json.type + '">' : json.tag);
		parent.appendChild(obj);
		if (jsonMap[mapToID]) alert("ERROR! Duplicate jsonMap key: " + mapToID);
		else jsonMap[mapToID] = obj;
		for (var prop in json) {
			if (prop == 'html') obj.innerHTML = json[prop];
			else if (typeof json[prop] == 'object') jt_.jsonToHTML(obj, json[prop], jsonMap, prop);
			else if (prop != 'tag') {
				if (prop == 'onclick') {
					var f = json[prop];
					obj.onclick = function(){eval(f);return false;};
				}
				else if (prop == 'onmouseover') {
					var f = json[prop];
					obj.onmouseover = function(){eval(f);return false;};
				}
				else if (prop == 'className') obj.className = json[prop];
				else if ( (prop == 'style') && (typeof obj.style.cssText != 'undefined') ) obj.style.cssText = json[prop];
				else if (prop == 'type') {
					if (!jt_.isIE) obj.type = json[prop]; // otherwise done in 'createElement'
				}
				else obj.setAttribute(prop, json[prop]);
			}
		}
	}
	else for (var prop in json) jt_.jsonToHTML(parent, json[prop], jsonMap, prop);
} // jt_.jsonToHTML


jt_.tagCloud = function(options) { // options: numTags, showCount, list, addTo, addTag, fracs, title, valAttr

	function sortN(itemA, itemB) {
		if (itemA.N > itemB.N) return -1;
		if (itemB.N > itemA.N) return 1;
		return 0;
	}

	function sortAlpha(itemA, itemB) {
		var A = itemA.tag.toLowerCase();
		var B = itemB.tag.toLowerCase();
		if (A < B) return -1;
		if (B < A) return 1;
		return 0;
	}

	options.list.sort(sortN);
	var tagCount = options.numTags ? Math.min(options.numTags, options.list.length) : options.list.length;
	var tagsArry = options.list.slice(0, tagCount);
	var minN = 100000000;
	var maxN = 0;
	for (var i=0; i<tagCount; i++) {
		minN = Math.min(minN, tagsArry[i].N);
		maxN = Math.max(maxN, tagsArry[i].N);
	}
	var range = maxN - minN;
	tagsArry.sort(sortAlpha);
	var fracs = options.fracs ? options.fracs : [.80, .60, .33];
	for (var i=0; i<tagCount; i++) {
		var tagLink = document.createElement('A');
		tagLink.href = "";
		var pctOfList = (tagsArry[i].N - minN) / range;
		for (var j=0; j<fracs.length; j++) {
			if (pctOfList > fracs[j]) {
				tagLink.className = 'tag' + (j+1);
				break;
			}
		}
		tagLink.appendChild(document.createTextNode(tagsArry[i].tag + (options.showCount ? (' (' + tagsArry[i].N + ')') : '') ));
		if (options.valAttr) {
			tagLink.setAttribute(options.valAttr, tagsArry[i][options.valAttr]);
		}
		if (options.title) {
			tagLink.setAttribute('title', options.title);
		}
		tagLink.onclick = options.addTag;
		options.addTo(tagLink);
        options.addTo(document.createTextNode(' ')); // insert space between, formats tags better
	}
} // jt_.tagCloud


jt_.alignCorner = function(elmToMove, elmAnchor, TlTrBlBr, xOffset, yOffset) {
	// aligns 'elmToMove' with 'elmAnchor' based on 2-character 'TlTrBlBr' indicating corner: 'TL' | 'TR' | 'BL' | 'BR'
	xOffset = xOffset ? xOffset : 0; // optional param
	yOffset = yOffset ? yOffset : 0; // optional param
	var anchorXY = jt_.getOffsetXY(elmAnchor);
	var xxOffset = (TlTrBlBr.indexOf('R') !== -1) ? (jt_.width(elmAnchor) - jt_.width(elmToMove)) : 0;
	var yyOffset = (TlTrBlBr.indexOf('B') !== -1) ? (jt_.height(elmAnchor) - jt_.height(elmToMove)) : 0;
	jt_.moveTo(elmToMove, anchorXY.x + xxOffset + xOffset, anchorXY.y + yyOffset + yOffset);
};

jt_.divOnScrn = function(divOnScrn) {
	var divPos = jt_.getOffsetXY(divOnScrn);
	var newX = divPos.x;
	var newY = divPos.y;
	if (divPos.x + divOnScrn.offsetWidth - document.body.scrollLeft > jt_.winW()) newX = document.body.scrollLeft + jt_.winW() - divOnScrn.offsetWidth;
	if (divPos.x < document.body.scrollLeft) newX = document.body.scrollLeft;
	if (divPos.y + divOnScrn.offsetHeight - document.body.scrollTop > jt_.winH()) newY = document.body.scrollTop + jt_.winH() - divOnScrn.offsetHeight;
	if (divPos.y < document.body.scrollTop) newY = document.body.scrollTop;
	if ((newX !== divPos.x) || (newY !== divPos.y)) jt_.moveTo(divOnScrn, newX, newY);
};

jt_.appendRelative = function(dragDIV, newParentDIV, xOffset, yOffset) {
	var dragPos = jt_.getOffsetXY(dragDIV);
	var newParentPos = jt_.getOffsetXY(newParentDIV);
	var xPos = dragPos.x - newParentPos.x;
	var yPos = dragPos.y - newParentPos.y;
	newParentDIV.appendChild(dragDIV);
	jt_.moveTo(dragDIV, xPos + (xOffset ? xOffset : 0), yPos + (yOffset ? yOffset : 0));
};

jt_.plural = function(qty, lbl) {
	// returns plural suffix or optional extended format if 'lbl' is present; example: qty=12, lbl="error", return value="12 errors"
	var stPlural = (qty == 1) ? "" : "s";
	if (lbl) stPlural = qty + " " + lbl + stPlural;
	return stPlural;
};

jt_.htmlVuSrc = function(src) {
	//src = jt_.htmlVuSrc(src).replace(/\t/gi,"&nbsp;&nbsp;&nbsp;&nbsp;");
	//if (BrowserDetect && (BrowserDetect.browser == 'Explorer')) src = src.replace(/\n/gi,"&nbsp;<br />");
	return jt_.htmlEncode(src).replace(/\t/gi,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\n/gi,"<br>");
};

jt_.AjaxToSrc = function(url, toDIV, req) {
	toDIV.innerHTML = 'Loading...';
	jt_.xhr.ajaxThis(url, function(req) {toDIV.innerHTML = jt_.htmlVuSrc(req.responseText);}, req);
};

jt_.boxOverlap = function(objectA, objectB, mode, xOffsetA, yOffsetA, xOffsetB, yOffsetB) {
	// box collision detector; returns area of overlap (if any) in pixels between DOM elements 'objectA' and 'objectB'
	// adapted from http://www.gamedev.net/reference/articles/article754.asp
	// 'mode' is optional - two special modes are offered:
	//   mode='X' - test for overlap of X-coordinates only; ignore Y
	//   mode='Y' - test for overlap of Y-coordinates only; ignore X
	var xyA = jt_.getOffsetXY(objectA);
	if (xOffsetA) xyA.x -= xOffsetA;
	if (yOffsetA) xyA.y -= yOffsetA;
	var xyB = jt_.getOffsetXY(objectB);
	if (xOffsetB) xyB.x -= xOffsetB;
	if (yOffsetB) xyB.y -= yOffsetB;
/*
jt_Trace.msg("xyA.x=" + xyA.x + " - xyA.y=" + xyA.y + " - xyB.x=" + xyB.x + " - xyB.y=" + xyB.y + "<br>" +
			"xOffsetA=" + xOffsetA + " - yOffsetA=" + yOffsetA + " - xOffsetB=" + xOffsetB + " - yOffsetB=" + yOffsetB);
*/
	var objAxTL = xyA.x; // AX1 - xTopLeft
	var objAyTL = xyA.y; // AY1 - yTopLeft
	var objAxBR = xyA.x + objectA.offsetWidth; // AX2 - xBottomRight
	var objAyBR = xyA.y + objectA.offsetHeight; // AY2 - yBottomRight

	var objBxTL = xyB.x; // BX1
	var objByTL = xyB.y; // BY1
	var objBxBR = xyB.x + objectB.offsetWidth; // BX2
	var objByBR = xyB.y + objectB.offsetHeight; // BY2
/*
jt_Trace.msg("objAxTL=" + objAxTL + " - objAyTL=" + objAyTL + " - objAxBR=" + objAxBR + " - objAyBR=" + objAyBR + "\n" +
			"objBxTL=" + objBxTL + " - objByTL=" + objByTL + " - objBxBR=" + objBxBR + " - objByBR=" + objByBR);

reject the following conditions:
AX2<BX1
AY2<BY1
BX2<AX1
BY2<AY1
*/
	if (mode !== 'Y') {
		if (objAxBR < objBxTL) return -1;
		if (objBxBR < objAxTL) return -1;
		}
	if (mode !== 'X') {
		if (objAyBR < objByTL) return -1;
		if (objByBR < objAyTL) return -1;
		}
/*
If AX1<BX1 then CX1=BX1 and CX2=AX2, otherwise, CX1=AX1 and CX2=BX2
If AY1<BY1 then CY1=BY1 and CY2=AY2, otherwise, CY1=AY1 and CY2=BY2
*/
	var objCxTL;
	var objCyTL;
	var objCxBR;
	var objCyBR;
	if (objAxTL < objBxTL) {
		objCxTL = objBxTL;
		objCxBR = objAxBR;
		}
	else {
		objCxTL = objAxTL;
		objCxBR = objBxBR;
		}
	if (objAyTL < objByTL) {
		objCyTL = objByTL;
		objCyBR = objAyBR;
		}
	else {
		objCyTL = objAyTL;
		objCyBR = objByBR;
		}
	var olX = objCxBR - objCxTL;
	var olY = objCyBR - objCyTL;
	if (mode == 'X') return olX;
	else if (mode == 'Y') return olY;
	else return olX * olY;
}; // jt_.boxOverlap



/*!
 * contentloaded.js
 *
 * Author: Diego Perini (diego.perini at gmail.com)
 * Summary: cross-browser wrapper for DOMContentLoaded
 * Updated: 20101020
 * License: MIT
 * Version: 1.2
 *
 * URL:
 * http://javascript.nwbox.com/ContentLoaded/
 * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
 *
 */

// @win window reference
// @fn function reference
function contentLoaded(win, fn) {

	var done = false, top = true,

	doc = win.document, root = doc.documentElement,

	add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
	rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
	pre = doc.addEventListener ? '' : 'on',

	init = function(e) {
		if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
		(e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
		if (!done && (done = true)) fn.call(win, e.type || e);
	},

	poll = function() {
		try { root.doScroll('left'); } catch(e) { setTimeout(poll, 50); return; }
		init('poll');
	};

	if (doc.readyState == 'complete') fn.call(win, 'lazy');
	else {
		if (doc.createEventObject && root.doScroll) {
			try { top = !win.frameElement; } catch(e) { }
			if (top) poll();
		}
		doc[add](pre + 'DOMContentLoaded', init, false);
		doc[add](pre + 'readystatechange', init, false);
		win[add](pre + 'load', init, false);
	}

}



var BrowserDetect = { // NOTE: from http://www.quirksmode.org/js/detect.html
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].string;
			var dataProp = data[i].prop;
			this.versionSearchString = data[i].versionSearch || data[i].identity;
			if (dataString) {
				if (dataString.indexOf(data[i].subString) !== -1) return data[i].identity;
				}
			else if (dataProp) return data[i].identity;
			}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [
		{string: navigator.vendor, subString: "Apple", identity: "Safari"},
		{prop: window.opera, identity: "Opera"},
		{string: navigator.vendor, subString: "iCab", identity: "iCab"},
		{string: navigator.vendor, subString: "KDE", identity: "Konqueror"},
		{string: navigator.userAgent, subString: "Firefox", identity: "Firefox"},
		{string: navigator.userAgent, subString: "Netscape", identity: "Netscape"},	// for newer Netscapes (6+)
		{string: navigator.userAgent, subString: "MSIE", identity: "Explorer", versionSearch: "MSIE"},
		{string: navigator.userAgent, subString: "Gecko", identity: "Mozilla", versionSearch: "rv"},
		{string: navigator.userAgent, subString: "Mozilla", identity: "Netscape", versionSearch: "Mozilla"} // for older Netscapes (4-)
		],
	dataOS : [
		{string: navigator.platform, subString: "Win", identity: "Windows"},
		{string: navigator.platform, subString: "Mac", identity: "Mac"},
		{string: navigator.platform, subString: "Linux", identity: "Linux"}
		]
};

BrowserDetect.init();
jt_.isIE = (BrowserDetect.browser == 'Explorer');
jt_.FixIE6 = jt_.isIE && (BrowserDetect.version < 7);

jt_.SelectTags = {
	hide: function() {
		if (jt_.FixIE6) {
			if (!jt_.SelectTags.sels) jt_.SelectTags.sels = document.body.getElementsByTagName('select');
			for (var i=0; i<jt_.SelectTags.sels.length; i++) jt_.showHideElm(jt_.SelectTags.sels[i]);
			}
		},
	show: function() {
		if (jt_.FixIE6 && jt_.SelectTags.sels) {
			for (var i=0; i<jt_.SelectTags.sels.length; i++) jt_.showHideElm(jt_.SelectTags.sels[i], true);
		}
	}
};


/********* BEGIN: jt_.Trace *******/
jt_.Trace = {
	msg: function(txt) {
		jt_.Trace.init();
		if (jt_.Trace.trace) jt_.Trace.txt(txt);
	},
	xml: function(req, lbl) { // 'req' is 'XMLHttpRequest'
		jt_.Trace.init();
		if (jt_.Trace.trace && jt_.Trace.traceXML) jt_.Trace.txt(lbl + "<br>" + jt_.htmlEncode(req.responseText).replace(/\t/gi,"&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\n/gi,"<br>"));
	},
	on: function() {
		jt_.Trace.trace = true;
		if (jt_.Trace.tDIV) {jt_.Trace.tDIV.style.display = "block";}
	},
	off: function() {
		jt_.Trace.trace = false;
		if (jt_.Trace.tDIV) {jt_.Trace.tDIV.style.display = "none";}
	},
	bg: function(bg) {
		//if (jt_.Trace.tDIV) {jt_.Trace.tDIV.style.background = bg ? jt_.Trace.css.background : "none";}
	},
	clr: function() {
		if (jt_.Trace.tDIV) {
			jt_.Trace.bg();
			jt_.Trace.tDIV.innerHTML = jt_.Trace.aTag('jt_.Trace.off()', 'off') + jt_.Trace.aTag('jt_.Trace.clr()', 'clear trace', true);
			jt_.Trace.clrd = jt_.Trace.tDIV.childNodes.length;
		}
	},

	// PRIVATE BELOW
	txt: function(txt) {
		var txtDIV = document.createElement("div");
		txtDIV.innerHTML = txt;
		if (jt_.Trace.tDIV.childNodes.length == jt_.Trace.clrd) jt_.Trace.tDIV.appendChild(txtDIV)
		else jt_.Trace.tDIV.insertBefore(txtDIV, jt_.Trace.tDIV.childNodes[jt_.Trace.clrd]);
		jt_.Trace.tDIV.style.top = jt_.Trace.css.top;
		jt_.Trace.tDIV.style.left = jt_.Trace.css.left;
	},
	init: function() {
		if (!jt_.Trace.pq) {
			jt_.Trace.pq = jt_.parseQuery();
			if (jt_.Trace.pq.trace) jt_.Trace.trace = (jt_.Trace.pq.trace != 0);
			if (jt_.Trace.pq.traceXML) jt_.Trace.traceXML = (jt_.Trace.pq.traceXML != 0);
		}
		if (jt_.Trace.trace && !jt_.Trace.tDIV) {
			jt_.Trace.tDIV = document.createElement("div");
			jt_.cssApply(jt_.Trace.css, jt_.Trace.tDIV);
			if (jt_.BodyZ) jt_.BodyZ.toTop(jt_.Trace.tDIV);
			else document.body.appendChild(jt_.Trace.tDIV);
			jt_.Trace.clr();
		}
	},
	traceXML: true,
	aTag: function(aFunc, aTxt, dash) {return (dash ? ' - ' : '') + '<a href="" onClick="' + aFunc + ';return false;">' + aTxt + '</a>'},
	css: {top:"20px", left:"20px", background:"#FFFFFF", border:"1px solid #a9a9a9", color:"#5a5a5a", textAlign:"left", fontSize:"0.85em", padding:"5px", opacity:"0.9", className:"jt_Trace", position:"absolute"}
}; /********* END: jt_.Trace *******/


/********* BEGIN: jt_.TraceObj *******/
jt_.TraceObj = {

	str: function(obj, sep, links) { // convert any JS object 'obj' to string of name:value pairs - adds 'links' for 'jt_.TraceObj.show()'

			function stLbl(lbl) {
				st += (st == "" ? "" : "<br>") + '<b><font color="#FF0000">' + lbl + '</font></b>: ';
				addSep = false;
			}

			function aLnk(aObj, aTxt) {
				if (addSep) st += sep;
				if (links && (typeof aObj == "object")) {
					st += jt_.Trace.aTag('jt_.TraceObj.mem(' + jt_.TraceObj.stack.length + ')', aTxt);
					jt_.TraceObj.stack.push(aObj);
				}
				else st += aTxt;
				var p = aTxt;
				st += ":" + ((p.toLowerCase().indexOf("html") == -1) ? aObj : "HTML");
				addSep = true;
			}

		if (!sep) sep = ' ][ ';
		var st = "";
		var addSep = false;
		if (obj) {
			try {
				if (obj.length && (obj.length > 0) && (typeof obj.item != "undefined")) {
					stLbl('items');
					for (var x = 0; x < obj.length; x++)
						if (obj.item(x)) aLnk(obj.item(x), obj.item(x).nodeName);
				}
				stLbl('props');
				for (var prop in obj) {
					if (prop.charAt(0) == '$') continue;
					if ((typeof obj[prop] == 'function') && !jt_.TraceObj.okf) continue;
					aLnk(obj[prop], prop);
				}
				if (obj.attributes) {
					stLbl('attributes');
					for (var x = 0; x < obj.attributes.length; x++)
						if (obj.attributes[x].nodeValue) aLnk(obj.attributes[x].nodeValue, obj.attributes[x].nodeName);
				}
			}
			catch(e) {st += "ERROR: " + e.message;}
		}
		return st;
	},

	show: function(obj, inLine) { // use 'jt_.Trace', show 'links' 

			function aTag(aFunc, aTxt) {return jt_.Trace.aTag('jt_.TraceObj.show(jt_.TraceObj.tObj.' + aFunc + ')', aTxt, true);}

		jt_.Trace.init();
		if (jt_.Trace.trace) {
			jt_.TraceObj.clr(obj, inLine);
			jt_.Trace.msg(jt_.TraceObj.str(obj, null, true));
			jt_.TraceObj.hist.push(obj);
			var lnk = jt_.Trace.aTag('jt_.TraceObj.clr()', 'clear') + jt_.Trace.aTag('jt_.TraceObj.okfT()', 'functions', true);
			if (jt_.TraceObj.tn != obj) lnk += jt_.Trace.aTag('jt_.TraceObj.bac()', 'back', true) + jt_.Trace.aTag('jt_.TraceObj.show(jt_.TraceObj.tn)', 'begin', true);
			if (obj) {
				if (obj.parentNode) lnk += aTag('parentNode', 'parent');
				if (obj.previousSibling) lnk += aTag('previousSibling', 'prev');
				if (obj.nextSibling) lnk += aTag('nextSibling', 'next');
				if (obj.childNodes && (obj.childNodes.length > 0)) lnk += jt_.Trace.aTag('jt_.TraceObj.cnOn(event)', 'childNodes', true);
				if (obj.nodeName) {
					lnk += ' - ' + obj.nodeName;
					if (obj.id) lnk += ' (' + obj.id + ')';
				}
			}
			jt_.Trace.msg('<b>jt_.TraceObj: ' + lnk + '</b>');
			jt_.Trace.bg(true);
		}
	},
	clr: function(obj, inLine) {
		if (!inLine) jt_.Trace.clr();
		jt_.TraceObj.stack = [];
		jt_.TraceObj.tObj = obj;
		jt_.TraceObj.cnOff();
		if (obj && ((jt_.TraceObj.tn == null) || (jt_.TraceObj.tn == obj))) {
			jt_.TraceObj.tn = obj;
			jt_.TraceObj.hist = [];
		}
	},

	// PRIVATE BELOW
	tn: null,
	hist: [],
	okf:false,
	mem: function(idx) {jt_.TraceObj.show(jt_.TraceObj.stack[idx]);},
	bac: function() {
		var t = jt_.TraceObj.hist.pop();
		jt_.TraceObj.show(jt_.TraceObj.hist.pop());
	},
	okfT: function() {
		jt_.TraceObj.okf = !jt_.TraceObj.okf;
		jt_.TraceObj.show(jt_.TraceObj.hist.pop());
	},
	cnOn: function(ev) {

			function pfxGet(depth) {
				if (!jt_.TraceObj.cnT[depth]) {
					jt_.TraceObj.cnT[depth] = "";
					for (var i=0; i<depth; i++) jt_.TraceObj.cnT[depth] += jt_.TraceObj.spTab;
				}
				return jt_.TraceObj.cnT[depth];
			}

			function addCNs(obj, depth) {
				if (obj.childNodes && (obj.childNodes.length > 0)) {
					var pfx = pfxGet(depth);
					if ((obj == jt_.Trace.tDIV) && (depth > 0)) st.push(pfx + jt_.Trace.aTag('jt_.TraceObj.show(jt_.Trace.tDIV)', 'jt_Trace') + '<br>');
					else for (var x=0; x<obj.childNodes.length; x++) {
						var itm = obj.childNodes.item(x);
						if (itm) {
							var iVal = (itm.nodeName == "#text") ? (' ' + itm.nodeValue) : '';
							st.push(pfx + jt_.Trace.aTag('jt_.TraceObj.mem(' + jt_.TraceObj.stack.length + ')', itm.nodeName) + iVal + '<br>');
							jt_.TraceObj.stack.push(itm);
							addCNs(itm, depth+1);
						}
					}
				}
			}

		if (!jt_.TraceObj.cnDIV) {
			jt_.TraceObj.cnDIV = document.createElement("div");
			for (var prop in jt_.TraceObj.cnCss) jt_.TraceObj.cnDIV.style[prop] = jt_.TraceObj.cnCss[prop];
			jt_.TraceObj.spTab = "";
			for (var i=0; i<7; i++) jt_.TraceObj.spTab += "&nbsp;";
		}
		var targ = ev.srcElement ? ev.srcElement : ev.target;
		targ.parentNode.parentNode.parentNode.appendChild(jt_.TraceObj.cnDIV);
		jt_.TraceObj.cnDIV.style.zIndex = jt_.Trace.tDIV.zIndex+1;
		var st = ['<b>[', jt_.Trace.aTag('jt_.TraceObj.cnOff()', 'childNodes'), ']</b><br>'];
		addCNs(jt_.TraceObj.tObj, 0);
		jt_.TraceObj.cnDIV.innerHTML = st.join('');
		jt_.TraceObj.cnDIV.style.display = "block";
	},

	cnOff: function() {if (jt_.TraceObj.cnDIV) jt_.TraceObj.cnDIV.style.display = "none";},
	cnCss: {top:"40px", left:"40px", background:"#FFFFFF", border:"1px solid blue", padding:"10px", className:"jt_.TraceObj_cnCss", position:"absolute", display:"none"},
	cnT: []
}; /********* END: jt_.TraceObj *******/


function xh_newRequest() {
	// CONSTRUCTOR for basic XMLHttpRequest object 'xh_Request'
	// - USAGE: var req = jt_.xhr.newRequest();  NOTE: DO _NOT_ USE 'new jt_.xhr.newRequest()'!
	// source: http://developer.yahoo.com/javascript/howto-ajax.html
	var xmlhttp = null;
	if (window.XMLHttpRequest) {
		xmlhttp = new XMLHttpRequest();
		if (typeof xmlhttp.overrideMimeType != 'undefined') {
			xmlhttp.overrideMimeType('text/xml');
		}
	}
	else if (window.ActiveXObject) {
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	return xmlhttp;
}
