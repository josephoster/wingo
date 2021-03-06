/**
 * @author	Joseph Oster, wingo.com, Copyright(c) 2005-2009 - All Rights Reserved.
 */

function jt_CloseSize(toDIV, options) {
	toDIV._jt_CloseSize = {ops:options ? options : {}};
	toDIV._jt_CloseSize.btn_Close = document.createElement("A");
	toDIV._jt_CloseSize.btn_Close.href = "";
	toDIV._jt_CloseSize.btn_Close.onclick = function(){return false;};
	toDIV._jt_CloseSize.btn_Close.className = "jt_closeX";
	toDIV._jt_CloseSize.btn_Close.title = "Close";
	toDIV.appendChild(toDIV._jt_CloseSize.btn_Close);
	jt_AddListener(toDIV._jt_CloseSize.btn_Close, 'click',
		function() {
			if (toDIV._jt_CloseSize.ops.onClose) {
				toDIV._jt_CloseSize.ops.onClose();
			}
			else if (toDIV.animB) {
				toDIV.animB.getBoxSize();
				toDIV.animB.showHide();
			}
			else {
				jt_ShowNoneElm(toDIV);
			}
		});

	if (options && options.btnSize) {
		toDIV._jt_CloseSize.btn_Size = document.createElement("A");
		toDIV._jt_CloseSize.btn_Size.href = "";
		toDIV._jt_CloseSize.btn_Size.onclick = function(){return false;};
		toDIV._jt_CloseSize.btn_Size.className = "jt_dragSize";
		toDIV._jt_CloseSize.btn_Size.title = "Drag to Re-Size";
		toDIV.appendChild(toDIV._jt_CloseSize.btn_Size);

		toDIV._jt_CloseSize.btnSizeTop = toDIV._jt_CloseSize.btn_Size.offsetTop;
		Drag.init(toDIV._jt_CloseSize.btn_Size);
		toDIV._jt_CloseSize.btn_Size.style.left = '';
		toDIV._jt_CloseSize.btn_Size.style.top = jt_valPx(toDIV._jt_CloseSize.btnSizeTop);

		toDIV._jt_CloseSize.btn_Size.onDragStart =
			function(x, y) {
				//jt_cssClass.add(toDIV._jt_CloseSize.btn_Size, 'dragging');
				toDIV._jt_CloseSize.btn_Size.style.backgroundColor = "#ffff00";
				var currStyle = jt_currStyle(toDIV);
				toDIV._jt_CloseSize.btnSizeWidth = jt_width(toDIV, currStyle);
				toDIV._jt_CloseSize.btnSizeHeight = jt_height(toDIV, currStyle);
				toDIV._jt_CloseSize.btnSizeLeft = toDIV._jt_CloseSize.btn_Size.offsetLeft;
				toDIV._jt_CloseSize.divPos = jt_getOffsetXY(toDIV);
				//jt_Trace.msg("x=" + toDIV._jt_CloseSize.divPos.x + ", y=" + toDIV._jt_CloseSize.divPos.y + ", btnSizeLeft=" + toDIV._jt_CloseSize.btnSizeLeft + ", btnSizeTop=" + toDIV._jt_CloseSize.btnSizeTop + ", btnSizeWidth=" + toDIV._jt_CloseSize.btnSizeWidth + ", btnSizeHeight=" + toDIV._jt_CloseSize.btnSizeHeight);
				jt_appendRelative(toDIV._jt_CloseSize.btn_Size, document.body);
				jt_BodyZ.toTop(toDIV._jt_CloseSize.btn_Size);

				if (options.dragStart && (typeof options.dragStart == 'function')) {
					options.dragStart();
				}
			};

		toDIV._jt_CloseSize.btn_Size.onDrag =
			function(x, y) {
				if (toDIV.animB) {
					toDIV.animB.getBoxSize();
				}
				jt_BodyZ.toTop(toDIV._jt_CloseSize.btn_Size);
				var deltaW = x - toDIV._jt_CloseSize.divPos.x - toDIV._jt_CloseSize.btnSizeLeft;
				var deltaH = y - toDIV._jt_CloseSize.divPos.y - toDIV._jt_CloseSize.btnSizeTop;
				var width = toDIV._jt_CloseSize.btnSizeWidth + deltaW;
				var height = toDIV._jt_CloseSize.btnSizeHeight - deltaH;
				var top = toDIV._jt_CloseSize.divPos.y + deltaH;
				//jt_Trace.msg("x=" + x + ", y=" + y + ", deltaW=" + deltaW + ", deltaH=" + deltaH + ", width=" + width + ", height=" + height + ", top=" + top);
				//jt_Trace.msg("offsetLeft=" + toDIV._jt_CloseSize.btn_Size.offsetLeft + ", offsetTop=" + toDIV._jt_CloseSize.btn_Size.offsetTop);
				toDIV.style.top = jt_valPx(top);
				toDIV.style.height = jt_valPx(Math.max(height, 20));
				toDIV.style.width = jt_valPx(Math.max(width, 80));
				if ((height < 20) || (width < 80)) {
					//toDIV._jt_CloseSize.divPos = jt_getOffsetXY(toDIV);
				}

				if (options.onDrag && (typeof options.onDrag == 'function')) {
					options.onDrag();
				}
			};

		toDIV._jt_CloseSize.btn_Size.onDragEnd =
			function(x, y) {
				toDIV._jt_CloseSize.btn_Size.style.backgroundColor = "transparent";
				if (toDIV.animB) {
					toDIV.animB.getBoxSize();
				}
				jt_BodyZ.toTop(toDIV);
				toDIV.appendChild(toDIV._jt_CloseSize.btn_Size);
				toDIV._jt_CloseSize.btn_Size.style.left = "";
				toDIV._jt_CloseSize.btn_Size.style.top = "";
				//jt_cssClass.rem(toDIV._jt_CloseSize.btn_Size, 'dragging');
				toDIV._jt_CloseSize.btn_SizeAuto.style.display = "block";
				toDIV._jt_CloseSize.btn_SizeAuto.blur();

				if (options.dragEnd && (typeof options.dragEnd == 'function')) {
					options.dragEnd();
				}
			};

		toDIV._jt_CloseSize.btn_SizeAuto = document.createElement("A");
		toDIV._jt_CloseSize.btn_SizeAuto.style.display = "none";
		toDIV._jt_CloseSize.btn_SizeAuto.style.position = "absolute";
		toDIV._jt_CloseSize.btn_SizeAuto.style.top = "2px";
		toDIV._jt_CloseSize.btn_SizeAuto.style.right = "35px";
		toDIV._jt_CloseSize.btn_SizeAuto.style.color = "#a9a9a9";
		toDIV._jt_CloseSize.btn_SizeAuto.appendChild(document.createTextNode("H"));
		toDIV._jt_CloseSize.btn_SizeAuto.title = "height";
		toDIV._jt_CloseSize.btn_SizeAuto.href = "";
		toDIV._jt_CloseSize.btn_SizeAuto.onclick =
			function() {
				toDIV.style.height = '';
				toDIV._jt_CloseSize.btn_SizeAuto.style.display = "none";
				return false;
			};
		toDIV.appendChild(toDIV._jt_CloseSize.btn_SizeAuto);
	}
}


var jt_Flick = {
	init: function(divToFling, callDone) {
		divToFling.onDragStart = function(x, y) {
			jt_Flick.dragStart(divToFling, x, y);
		}
		divToFling.onDrag = function(x, y) {
			jt_Flick.onDrag(x, y);
		}
		divToFling.onDragEnd = function(x, y) {
			jt_Flick.flickIt(callDone);
		}
	},
	dragStart: function(divToFling, x, y) {
		if (typeof divToFling.jt_FlicTimer !== "undefined") clearInterval(divToFling.jt_FlicTimer);
		if (jt_Flick.history === null) {
			jt_Flick.history = [jt_Flick.maxH-1];
			for (var i=0; i<jt_Flick.maxH; i++) jt_Flick.history[i] = {};
		}
		jt_Flick.fd = divToFling;
		jt_Flick.history[0].x = x;
		jt_Flick.history[0].y = y;
		jt_Flick.idx = 1;
		jt_Flick.w = false;
		jt_Flick.ld = new Date();
	},
	onDrag: function(x, y) {
		jt_Flick.history[jt_Flick.idx].x = x;
		jt_Flick.history[jt_Flick.idx].y = y;
		var now = new Date();
		jt_Flick.history[jt_Flick.idx].t = now - jt_Flick.ld;
		jt_Flick.ld = now;
		jt_Flick.idx++;
		if (jt_Flick.idx >= jt_Flick.maxH) {
			jt_Flick.idx = 0;
			jt_Flick.w = true;
		}
	},
	flickIt: function(callDone) {
		var now = new Date();
		var tT = now - jt_Flick.ld;
		var flicD = jt_Flick.fd;
		var dX = 0;
		var dY = 0;
		var j = jt_Flick.w ? jt_Flick.idx : 0;
		for (var i=0; i<(jt_Flick.w ? jt_Flick.maxH : jt_Flick.idx); i++) {
			if (i > 0) {
				var prevH = (j > 0) ? jt_Flick.history[j-1] : jt_Flick.history[jt_Flick.maxH-1];
				var diffX = jt_Flick.history[j].x - prevH.x;
				var diffY = jt_Flick.history[j].y - prevH.y;
				dX += diffX;
				dY += diffY;
				tT += jt_Flick.history[j].t;
			}
			j++;
			if (j >= jt_Flick.maxH) j = 0;
		}
		if (tT > 0) {
			var decay = 0.85;
			var totX = 0;
			var totY = 0;
			var rX = dX/tT * 33;
			var rY = dY/tT * 33;
			var oX = parseInt(flicD.style.left);
			var oY = parseInt(flicD.style.top);
			var lastX = null;
			var lastY = null;
			flicD.jt_FlicTimer = setInterval(
				function() {
					totX += rX;
					totY += rY;
					var x = Math.round(oX + totX);
					var y = Math.round(oY + totY);
					flicD.style.left = jt_valPx(x);
					flicD.style.top = jt_valPx(y);
					if ((x <= 0) && (rX < 0)) rX = 0 - rX;
					if ((y <= 0) && (rY < 0)) rY = 0 - rY;
					if ((x == lastX) && (y == lastY)) {
						clearInterval(flicD.jt_FlicTimer);
						if (typeof callDone === "function") callDone();
					}
					lastX = x;
					lastY = y;
					rX = decay * rX;
					rY = decay * rY;
				},
			33);
		}
	},
	idx: 0,
	fd: null,
	ld: null,
	maxH: 5,
	w: false,
	history: null
}

function emLink(txtLink, subj) {
	var mLink = ["os","ter","@","wi","ngo",".","com"];
	var stSubj = subj ? '?' + 'subject' + '=' + subj : "";
	document.write('<a href="mai' + 'lto' + ':' + 'Joseph Oster' + '<' + mLink.join("") + '>' + stSubj + '">' + txtLink + '</a>');
}

jt_Hex = {
	chars:['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'],
	rgbHex: function(red, grn, blu) {
		return ["#",
			jt_Hex.chars[Math.floor(red / 16)],
			jt_Hex.chars[red % 16],
			jt_Hex.chars[Math.floor(grn / 16)],
			jt_Hex.chars[grn % 16],
			jt_Hex.chars[Math.floor(blu / 16)],
			jt_Hex.chars[blu % 16]
			].join("");
	},
	rgbHexInvert: function(red, grn, blu) {
		return jt_Hex.rgbHex(255 - red, 255 - grn, 255 - blu);
	}
}

/********* BEGIN: 'jt_ColorSine' class *********/
jt_ColorSine = function(Frequency, Phase) {
	this.setFrequency(Frequency);
	this.setPhase(Phase);
	this.setBias(128);
	}

jt_ColorSine.prototype.setFrequency = function(Frequency) {
	this.Frequency = Frequency; // radians/second
	}

jt_ColorSine.prototype.setPhase = function(Phase) {
	this.Phase = Phase; // radians
	}

jt_ColorSine.prototype.setBias = function(Bias) {
	this.Bias = Bias;
	this.Amplitude = (Bias > 127) ? 255 - Bias : Bias;
	}

jt_ColorSine.prototype.color = function(timeElapsed) {
	// return value of 0..255 based on 'timeElapsed', 'Frequency' and 'Phase'
	return this.Bias + Math.round(this.Amplitude * Math.sin(timeElapsed * this.Frequency + this.Phase));
	}
/********* END: 'jt_ColorSine' class *********/


/**
 * was 'move_box.js' - DHTML animation demo
 *
 * @version Aug 2007, created 16 Jan 2006
 * @author	Joseph Oster, wingo.com
 */
function parentClass(node, classNames, maxDepth) {
	maxDepth = maxDepth ? maxDepth : 5;
	var count = 0;
	while ((node != null) && (count < maxDepth)) {
		for (var i=0; i<classNames.length; i++) {
			if (node.className == classNames[i]) {
				return true;
			}
		}
		node = node.parentNode;
		count++;
	}
	return false;
}

var jt_demoMB = {
	init: function() {
		//jt_Trace.msg('jt_demoMB.init');
		jt_demoMB.box = document.createElement("div");
		jt_demoMB.box.className = "myBox";
		jt_demoMB.box.innerHTML = '<a href="#" id="jt_demoMBidClick" onClick="return false;" title="\'click\' stops/starts color animation">click</a> anywhere<br>to move this box<br>(<a href="#" id="jt_demoMBidDisable" onClick="return false;">disable</a>)';
		jt_BodyZ.toTop(jt_demoMB.box);

		jt_demoMB.redSine = new jt_ColorSine(-jt_demoMB.baseFreq * jt_demoMB.cRatio, 0.0625);
		jt_demoMB.grnSine = new jt_ColorSine(jt_demoMB.baseFreq * jt_demoMB.cRatio * 1.15, 1.238);
		jt_demoMB.bluSine = new jt_ColorSine(jt_demoMB.baseFreq, 1.065);

		jt_demoMB.anim = new jt_AnimCalc(true, jt_demoMB.oneStep, {'numSteps':jt_demoMB.numSteps});
		jt_demoMB.startTime = new Date();
		jt_demoMB.boxMem = new jt_Cookie(document, "boxCookie", 0, "/");
		jt_demoMB.boxMem.load();
		if (jt_demoMB.boxMem.ST) {
			jt_demoMB.startTime = parseInt(jt_demoMB.boxMem.ST);
		}
		else {
			jt_demoMB.boxMem.ST = jt_demoMB.startTime.valueOf();
			jt_demoMB.boxMem.store();
		}
		if (jt_demoMB.boxMem.turnedOff) jt_demoMB.okToShow = (jt_demoMB.boxMem.turnedOff != "true");
		if (jt_demoMB.okToShow) {
			if (jt_demoMB.boxMem.boxX) {
				if (jt_demoMB.boxMem.boxX != "no") {
					jt_moveTo(jt_demoMB.box, jt_demoMB.boxMem.boxX, jt_demoMB.boxMem.boxY);
				}
			}
			else {
				jt_moveTo(jt_demoMB.box, 300, 360);
			}
			if (document.location.pathname.indexOf("services.html") == -1) jt_demoMB.show();
		}
		var imgUrl = (location.protocol == 'http:' ? '/' : '') + 'images/crosshair.gif';
		jt_demoMB.cross = new Array(jt_demoMB.numSteps+1);
		for (var i=0; i<=jt_demoMB.numSteps; i++) {
			jt_demoMB.cross[i] = new Image();
			jt_demoMB.cross[i].src = imgUrl;
			jt_demoMB.cross[i].style.position = 'absolute';
			jt_demoMB.cross[i].style.display = 'none';
			document.body.appendChild(jt_demoMB.cross[i]);
		}
	},
	show: function() {
		if (jt_demoMB.box.style.display != "block") {
			jt_demoMB.box.style.display = "block";
			jt_AddListener(document, "mousedown", jt_demoMB.moveBox);
		}
		jt_BodyZ.toTop(jt_demoMB.box);
		if (jt_demoMB.cTimer == null) {
			jt_demoMB.okToShow = true;
			jt_demoMB.boxMem.turnedOff = "false";
			if (jt_demoMB.paws) {
				jt_demoMB.startTime = new Date();
				jt_demoMB.startTime -= jt_demoMB.paws;
			}
			jt_demoMB.boxMem.ST = jt_demoMB.startTime.valueOf();
			jt_demoMB.boxMem.store();
			jt_demoMB.cTimer = setInterval(function() {
				var now = new Date();
				jt_demoMB.setColors( (now - jt_demoMB.startTime) / 1000);
				},
				Math.round(1000 / jt_demoMB.FrameRate));
		}
		else {
			clearInterval(jt_demoMB.cTimer);
			jt_demoMB.cTimer = null;
			var now = new Date();
			jt_demoMB.paws = now - jt_demoMB.startTime;
		}
	},
	hide: function() {
		clearInterval(jt_demoMB.cTimer);
		jt_demoMB.cTimer = null;
		jt_RemListener(document, "mousedown", jt_demoMB.moveBox);
		jt_demoMB.okToShow = false;
		if (jt_demoMB.box) {
			jt_demoMB.box.style.display = "none";
			jt_demoMB.boxMem.turnedOff = "true";
			jt_demoMB.boxMem.boxX = "no";
			jt_demoMB.boxMem.ST = "";
			jt_demoMB.boxMem.store();
		}
	},
	setColors: function(timeElapsed) {
		var r = jt_demoMB.redSine.color(timeElapsed);
		var g = jt_demoMB.grnSine.color(timeElapsed);
		var b = jt_demoMB.bluSine.color(timeElapsed);
		jt_demoMB.box.style.backgroundColor = jt_Hex.rgbHex(r, g, b);
		jt_demoMB.box.style.color = jt_Hex.rgbHexInvert(r, g, b);
	},
	FrameRate: 12, // "frames" per second
	baseFreq: 0.125,
	cRatio: 1.81,
	cTimer: null,
	okToShow: true,
	numSteps: 10,
	hideCross: function() {
		for (var i=0; i<=jt_demoMB.numSteps; i++) jt_demoMB.cross[i].style.display = 'none';
	},
	oneStep: function(step) {
		//jt_Trace.msg('step=' + step + ' - jt_demoMB.cross=' + jt_demoMB.cross);
		jt_demoMB.xBox = jt_demoMB.anim.getVal('x');
		jt_demoMB.yBox = jt_demoMB.anim.getVal('y');
		jt_moveTo(jt_demoMB.box, jt_demoMB.xBox, jt_demoMB.yBox);
		jt_demoMB.cross[step].style.display = 'block';
		jt_moveTo(jt_demoMB.cross[step], jt_demoMB.xBox-8, jt_demoMB.yBox-8);
	},
	moveDone: function() {
		jt_demoMB.boxMem.boxX = jt_demoMB.xBox;
		jt_demoMB.boxMem.boxY = jt_demoMB.yBox;
		jt_demoMB.boxMem.turnedOff = false;
		jt_demoMB.boxMem.store();
		jt_demoMB.hTimer = setTimeout('jt_demoMB.hideCross()', 2000);
	},
	moveTo: function(x, y) {
		clearTimeout(jt_demoMB.hTimer);
		//jt_BodyZ.toTop(jt_demoMB.box);
		var loc = new jt_getOffsetXY(jt_demoMB.box);
		jt_demoMB.anim.setRange('x', loc.x, x + jt_scrollLeft());
		jt_demoMB.anim.setRange('y', loc.y, y + jt_scrollTop());
		jt_demoMB.anim.start(jt_demoMB.moveDone);
	},
	moveBox: function(ev) {
		var e = jt_fixE(ev);
		var node = e.target ? e.target : e.srcElement;
		if (node.id == "jt_demoMBidDisable") jt_demoMB.hide();
		else if (node.id == "jt_demoMBidClick") jt_demoMB.show();
		else // ignore clicks on scrollbar and wingo navigation
			if (jt_demoMB.okToShow && (e.clientX < document.body.clientWidth) && (node.nodeName != "A") && (node.nodeName != "INPUT") && !parentClass(node, ["navWingo", "taMenu", "jt_closeX", "noClick"])) jt_demoMB.moveTo(e.clientX, e.clientY);
	}
}
