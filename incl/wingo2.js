/**
 * @author	Joseph Oster, wingo.com, Copyright(c) 2005-2013 - All Rights Reserved.
 */

var menuWingo = {

	bg_set: function(xPos) {
		menuWingo.menuDIV.style.backgroundPosition = xPos + 'px 0px';
	},

	bg_start: function() {

			function start() {
				menuWingo.bg_stop();
				menuWingo.bg_timer = setInterval(function() {
					menuWingo.menuData.x += menuWingo.menuData.inc;
					menuWingo.bg_set(menuWingo.menuData.x);
					if ((menuWingo.menuData.x >= 0) || (menuWingo.menuData.x <= menuWingo.wMenu - menuWingo.bg_img.width)) {
						menuWingo.menuData.inc = menuWingo.menuData.inc * -1; // reverse
					}
				}, 1000);
			}

		if (menuWingo.bg_img) {
			start();
		}
		else {
			menuWingo.menuData = new jt_.Cookie(document, "menuData", 0, "/");
			menuWingo.menuData.load();
			if (menuWingo.menuData.inc) {
				menuWingo.menuData.x = parseInt(menuWingo.menuData.x);
				menuWingo.menuData.inc = parseInt(menuWingo.menuData.inc);
			}
			else {
				menuWingo.menuData.x = 0;
				menuWingo.menuData.inc = -1;
			}
			jt_.addListener(window, "unload", function() {
				menuWingo.menuData.store();
			});

			menuWingo.wMenu = jt_.width(menuWingo.menuDIV);

			menuWingo.bg_img = new Image();
			jt_.addListener(menuWingo.bg_img, "load", function() {
				jt_.cssClass.add(menuWingo.menuDIV, 'bg_lg');
				start();
			});
			menuWingo.bg_img.src = 'images/princeville_bg2.jpg';
		}
	},

	bg_stop: function() {
		clearInterval(menuWingo.bg_timer);
	},

	init: function(callBack) {

			function padBody() {
				document.body.style.paddingTop = (jt_.currStyle(menuWingo.wingoMobileDIV).visibility == 'visible') ? jt_.valPx(jt_.height(menuWingo.wingoMobileDIV)) : 0;
			}

			function chkMobile() {
				var bodyC = jt_.cssClass.asObj(document.body);
				if (jt_.winW() > 800) {
					if (bodyC.moBar) {
						jt_.cssClass.rem(document.body, 'moBar');
					}
					jt_.showNoneElm(menuWingo.menuDIV, bodyC.wingo);
					if (bodyC.wingo) {
						menuWingo.bg_start();
					}
					else {
						menuWingo.bg_stop();
					}
				}
				else if (!bodyC.moBar) {
					jt_.cssClass.add(document.body, 'moBar');
					jt_.showNoneElm(menuWingo.menuDIV);
				}
				padBody();
			}

		menuWingo.wingoMobileDIV = document.createElement('div');
		menuWingo.wingoMobileDIV.setAttribute('id', 'wingoMobile');
		menuWingo.wingoMobileDIV.className = 'noClick';
		menuWingo.wingoMobileDIV.innerHTML = '<a href="" id="btnMenuOn" onclick="return false;"><em></em>menu</a><span>wingo.com</span>';
		document.body.appendChild(menuWingo.wingoMobileDIV);

		menuWingo.menuDIV = document.getElementById('wingoMenu');
		jt_.addListener(document.getElementById('btnMenuOn'), "click", function() {
			var isVisible = (jt_.currStyle(menuWingo.menuDIV).display == 'block');
			menuWingo.menuDIV.style.display = isVisible ? 'none' : 'block';
			if (!isVisible) {
				window.scrollTo(0,0);
			}
			padBody();
			if (callBack) callBack();
			return false;
		});
		chkMobile();
		jt_.addListener(window, "resize", chkMobile);
	}

};

function topLink() {
	if (top !== self) {
		document.writeln('<p align="center" class="sm"><b><a href="' + location.href + '" target="_blank">open in separate window</a></b><br><i>to bookmark or print this page...</i></p>');
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
					flicD.style.left = jt_.valPx(x);
					flicD.style.top = jt_.valPx(y);
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
 * @version Sep 2012, created 16 Jan 2006
 * @author	Joseph Oster, wingo.com
 */
var jt_demoMB = {
	init: function() {
		//jt_Trace.msg('jt_demoMB.init');
		jt_demoMB.box = document.createElement("div");
		jt_demoMB.box.className = "myBox";
		jt_demoMB.box.innerHTML = '<a href="#" id="jt_demoMBidClick" onClick="return false;" title="\'click\' stops/starts color animation">click</a> anywhere<br>to move this box<br>(<a href="#" id="jt_demoMBidDisable" onClick="return false;">disable</a>)';
		jt_.BodyZ.toTop(jt_demoMB.box);

		jt_demoMB.redSine = new jt_ColorSine(-jt_demoMB.baseFreq * jt_demoMB.cRatio, 0.0625);
		jt_demoMB.grnSine = new jt_ColorSine(jt_demoMB.baseFreq * jt_demoMB.cRatio * 1.15, 1.238);
		jt_demoMB.bluSine = new jt_ColorSine(jt_demoMB.baseFreq, 1.065);

		jt_demoMB.anim = new jt_.AnimCalc(true, jt_demoMB.oneStep, {'numSteps':jt_demoMB.numSteps});
		jt_demoMB.startTime = new Date();
		jt_demoMB.boxMem = new jt_.Cookie(document, "boxCookie", 0, "/");
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
					jt_.moveTo(jt_demoMB.box, jt_demoMB.boxMem.boxX, jt_demoMB.boxMem.boxY);
				}
			}
			else {
				jt_.moveTo(jt_demoMB.box, 300, 360);
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
			jt_.addListener(document, "mousedown", jt_demoMB.moveBox);
		}
		jt_.BodyZ.toTop(jt_demoMB.box);
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
		jt_.remListener(document, "mousedown", jt_demoMB.moveBox);
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
		jt_.moveTo(jt_demoMB.box, jt_demoMB.xBox, jt_demoMB.yBox);
		jt_demoMB.cross[step].style.display = 'block';
		jt_.moveTo(jt_demoMB.cross[step], jt_demoMB.xBox-8, jt_demoMB.yBox-8);
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
		//jt_.BodyZ.toTop(jt_demoMB.box);
		var loc = new jt_.getOffsetXY(jt_demoMB.box);
		jt_demoMB.anim.setRange('x', loc.x, x + jt_.scrollLeft());
		jt_demoMB.anim.setRange('y', loc.y, y + jt_.scrollTop());
		jt_demoMB.anim.start(jt_demoMB.moveDone);
	},
	moveBox: function(ev) {

			function okToClick() {
				// ignore clicks on links, input tags, scrollbar, wingo navigation
				var classNames = ["navWingo", "taMenu", "jt_closeX", "noClick"];
				var count = 0;
				while ((node != null) && (count < 5)) {
					if ( (node.nodeName == "A") || (node.nodeName == "INPUT") ) {
						return false;
					}
					for (var i=0; i<classNames.length; i++) {
						if (node.className == classNames[i]) {
							return false;
						}
					}
					node = node.parentNode;
					count++;
				}
				return true;
			}

		var e = jt_.fixE(ev);
		var node = e.target ? e.target : e.srcElement;
		if (node.id == "jt_demoMBidDisable") jt_demoMB.hide();
		else if (node.id == "jt_demoMBidClick") jt_demoMB.show();
		else if ( jt_demoMB.okToShow && (e.clientX < document.body.clientWidth) && okToClick() ) {
			jt_demoMB.moveTo(e.clientX, e.clientY);
		}
	}
}

var vidBox = {
	player: {},
	play: function(video_id) {
		var firstTime = false;
		if (!vidBox.vu) {
			firstTime = true;
			vidBox.vu = new jt_DialogBox(false);
			jt_Flick.init(vidBox.vu.container);
			vidBox.vu.getContentNode().className = "vidDemo";
			vidBox.vu.setCallCancel(function() {
				vidBox.clr();
				if (vidBox.callBack) vidBox.callBack();
			});
		}
		vidBox.vu.show();
		if (!vidBox.player[video_id]) vidBox.player[video_id] = document.getElementById(video_id);
		vidBox.clr();
		vidBox.curr = vidBox.player[video_id];
		vidBox.vu.setTitle(vidBox.curr.getAttribute('title'));
		vidBox.vu.getContentNode().appendChild(vidBox.curr);
		jt_.showNoneElm(vidBox.curr, true);
		if (firstTime) vidBox.vu.moveTo(-1, -1);
	},
	clr: function() {
		if (vidBox.curr != null) {
			jt_.showNoneElm(vidBox.curr);
			vidBox.vu.container.appendChild(vidBox.curr);
			vidBox.curr = null;
		}
	},
	curr:null
}
