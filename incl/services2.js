var tutorBox;
var tutorBoxHandle;
var tutorBoxCA;
var tutorBoxAW;
var winSizeX = 630;
var winSizeY = 460;

function getWindowSize() {
	winSizeX = jt_.winW();
	winSizeY = jt_.winH();
	}

function checkDragBounds() {
	if (tutorBox) {
		var x = parseInt(tutorBox.style.left);
		var y = parseInt(tutorBox.style.top);
		var w = jt_.width(tutorBox);
		var h = jt_.height(tutorBox);
		if (w < 240) w = 240; // arbitrary compensate for NS bug when box extends off screen
		tutorBoxHandle.maxX = Math.max(0, winSizeX - w);
		tutorBoxHandle.maxY = Math.max(0, winSizeY - h);
		if (x + w > winSizeX) tutorBox.style.left = jt_.valPx(tutorBoxHandle.maxX);
		if (y + h > winSizeY) tutorBox.style.top = jt_.valPx(tutorBoxHandle.maxY);
	}
}

function boxShow(isVisible) {
	if (!anyPanelVisible()) {
		tutorBox.style.visibility = isVisible ? "visible" : "hidden";
		if (isVisible) {
			jt_.BodyZ.toTop(tutorBox);
			//jt_.TraceObj.show(tutorBox);
			checkDragBounds();
		}
	}
	return false;
}

function setWidth() {
	tutorBoxCA.style.width = jt_.valPx(tutorBoxAW.getVal('width'));
}

function toggleWidth() {
	tutorBoxAW.flipRange();
	tutorBoxAW.start(checkDragBounds);
}

function viewContent(cid, cWidth) {
	document.getElementById("titleID").innerHTML = document.getElementById(cid + "_title").innerHTML + " <i>(drag me)</i>";
	tutorBoxCA.innerHTML = document.getElementById(cid + "_content").innerHTML;
	boxShow(true);
}

function viewLayout() {
	getWindowSize();
	checkDragBounds();
}

jt_.addListener(window, 'resize', viewLayout);


var pBarDemo = {
	 begin: function() {
		if (!pBarDemo.pBar) {pBarDemo.pBar = new jt_.ProgressBar(document.getElementById("barLoc"), 140, 11, "bgBar3");}
		pBarDemo.totPct = 0;
		pBarDemo.setProgress();
	},
	setProgress: function() {
		clearTimeout(pBarDemo.timerID);
		pBarDemo.totPct += 0.05;
		pBarDemo.pBar.setPercent(pBarDemo.totPct);
		if (pBarDemo.totPct < 1.0) pBarDemo.timerID = setTimeout("pBarDemo.setProgress()", 30);
	}
};



var tabViewsPanelDIV;
var tabViewsPanelLNK;
var tabViewsPanelVisible = false;

var myclPanelDIV;
var myclPanelLNK;
var myclPanelVisible = false;

var gmapsPanelDIV;
var gmapsPanelLNK;
var gmapsPanelINFO;
var gmapsPanelVisible = false;

var progressbarPanelDIV;
var progressbarPanelLNK;
var progressbarPanelVisible = false;

var sliderPanelDIV;
var sliderPanelLNK;
var sliderPanelVisible = false;

var tabBarDIV;

var map;
var mapDIV;
var mapIsGood;
var mapCntr;

function setMapHeight() {
	var handleDIV = gmapsPanelDIV;
	for (var i=0; i<gmapsPanelDIV.childNodes.length; i++) {
		if (gmapsPanelDIV.childNodes[i].className == 'panelTitle') {
			handleDIV = gmapsPanelDIV.childNodes[i];
			break;
		}
	}
	//var divPos = jt_.getOffsetXY();
	//var mapPos = jt_.getOffsetXY(mapDIV);
	//mapDIV.style.height = jt_.valPx(jt_.height(gmapsPanelDIV) - (mapPos.y - divPos.y));
	//jt_.Trace.msg(jt_.height(gmapsPanelDIV) + "][" + jt_.height(handleDIV));
	mapDIV.style.height = jt_.valPx(jt_.height(gmapsPanelDIV) - jt_.height(handleDIV));
}

function mapInit() {

	function clipDecimal(stNum, maxAfter) {
		stNum = "" + stNum;
		var newSt = "";
		var after = false;
		for (var i=0; i<stNum.length; i++) {
			if (maxAfter == 0) break;
			var ch = stNum.charAt(i);
			if (ch == '.') after = true;
			else if (after) maxAfter--;
			newSt += ch;
		}
		return newSt;
	}

	if (mapIsGood) {
		setMapHeight();
	}
	else {
		mapIsGood = true;
		mapDIV = document.getElementById("map");
		setMapHeight();
		map = new google.maps.Map2(mapDIV);
		map.setCenter(new GLatLng(22.055, -159.5269), 9);
		map.addControl(new GLargeMapControl());
		map.addControl(new GMenuMapTypeControl());
		map.addControl(new GScaleControl());
		map.setMapType(G_SATELLITE_MAP);
		GEvent.addListener(map, 'move', function() {
			var mapCntr = map.getCenter();
			gmapsPanelINFO.innerHTML = "&nbsp;&nbsp;<i>(" + clipDecimal(mapCntr.lat(), 4) + ", " + clipDecimal(mapCntr.lng(), 4) + ")</i>";
		});
	}
	map.checkResize();
}


var resizeLevel = 0; // prevent recursion in IE
var alignPanelMode = 0;
var menuPos;

function panelsAlign() {

	function alignPanel(panelDIV, alignLNK, TlTrBlBr, xOffset, yOffset) {
		jt_.alignCorner(panelDIV, alignLNK, TlTrBlBr, xOffset, yOffset);
		panelDIV.animB.setStyle(TlTrBlBr);
		panelDIV.animB.getBoxPos();
		//jt_.Trace.msg("alignPanelMode=" + alignPanelMode + ", panelDIV=" + panelDIV.id);
	}

	function movePanel(panelDIV, TlTrBlBr, xOffset, yOffset) {
		jt_.moveTo(panelDIV, menuPos.x + xOffset, menuPos.y + yOffset);
		panelDIV.animB.setStyle(TlTrBlBr);
		panelDIV.animB.getBoxPos();
	}

	if (alignPanelMode == 0) {
		alignPanel(tabViewsPanelDIV, tabBarDIV, "TL", 0, jt_.height(tabBarDIV)-1);
		alignPanel(myclPanelDIV, myclPanelLNK, "TL", 0, jt_.height(myclPanelLNK)-1);
		alignPanel(gmapsPanelDIV, gmapsPanelLNK, "TR", 0, jt_.height(gmapsPanelLNK)-1);
		alignPanel(sliderPanelDIV, sliderPanelLNK, "TR", 0, jt_.height(sliderPanelLNK)-1);
		alignPanel(progressbarPanelDIV, progressbarPanelLNK, "TR", 0, jt_.height(progressbarPanelLNK)-1);
	}
	else if (alignPanelMode == 1) {
		alignPanel(tabViewsPanelDIV, tabBarDIV, "TL", 0, jt_.height(tabBarDIV)-1);
		alignPanel(myclPanelDIV, tabBarDIV, "TL", 0, jt_.height(tabBarDIV)-1);
		alignPanel(gmapsPanelDIV, tabBarDIV, "TL", 0, jt_.height(tabBarDIV)-1);
		alignPanel(sliderPanelDIV, tabBarDIV, "TL", 0, jt_.height(tabBarDIV)-1);
		alignPanel(progressbarPanelDIV, tabBarDIV, "TL", 0, jt_.height(tabBarDIV)-1);
	}
	else if (alignPanelMode == 2) {
		alignPanel(tabViewsPanelDIV, progressbarPanelLNK, "TR", 0, jt_.height(progressbarPanelLNK)-1);
		alignPanel(myclPanelDIV, progressbarPanelLNK, "TR", 0, jt_.height(progressbarPanelLNK)-1);
		alignPanel(gmapsPanelDIV, progressbarPanelLNK, "TR", 0, jt_.height(progressbarPanelLNK)-1);
		alignPanel(sliderPanelDIV, progressbarPanelLNK, "TR", 0, jt_.height(progressbarPanelLNK)-1);
		alignPanel(progressbarPanelDIV, progressbarPanelLNK, "TR", 0, jt_.height(progressbarPanelLNK)-1);
	}
	else if (alignPanelMode == 3) {
		menuPos = jt_.getOffsetXY(tabBarDIV);
		movePanel(tabViewsPanelDIV, "TR", 89, 26);
		movePanel(myclPanelDIV, "TL", -239, 25);
		movePanel(gmapsPanelDIV, "TR", -239, 47);
		movePanel(sliderPanelDIV, "TL", -141, 208);
		movePanel(progressbarPanelDIV, "TR", 260, 77);
	}
}

function setTabVu(alignMode) {
	tabViewsPanelDIV.animB.showHide(false, function(){
		if (typeof alignMode == 'number') {
			alignPanelMode = alignMode;
			panelsAlign();
		}
		var panels = [tabViewsPanelDIV, myclPanelDIV, gmapsPanelDIV, sliderPanelDIV, progressbarPanelDIV];
		var vTimer = setInterval(function() {
			if (panels.length == 0) clearInterval(vTimer);
			else {
				var thisPanel = panels.pop();
				thisPanel.animB.showHide(true, function(){setTimeout(function(){thisPanel.animB.showHide(false)}, 250);});
			}
		}, 100);
	});
}


var okPanels = [];

function chkPropPanel(e) {
	// hide panels if click is elsewhere
	if (!e) e = window.event;
	var oNode = e.target ? e.target : e.srcElement;
	var node = oNode;
	var count = 0;
	while ((node != null) && (count != -1) && (count < 12)) {
		if (node.dialogBox || (node.id == "scrollToolIcon") || jt_.cssClass.asObj(node)["jt_dragSize"]) count = -1; // ignore clicks on 'dialogBox', 'scrollToolIcon'
		if (count != -1) {
			for (var i=0; i<okPanels.length; i++) {
				if (node.id == okPanels[i]) {
					count = -1;
					break;
				}
			}
			if (count != -1) {
				node = node.parentNode;
				count++;
			}
		}
	} // while
	if (count != -1) showView();
}

jt_.addListener(document, 'mousedown', chkPropPanel);


function panelActiveTab(nodeLNK, isActive) {
	// find parent 'LI' node and set the 'className' of its node.id; isActive ? "tabCurrent" : ""
	var count = 3;
	var node = nodeLNK;
	if (node) {
		do {
			if (node.nodeName == "LI") {
				node.id = isActive ? "tabCurrent" : "";
				count = 0;
			}
			else {
				node = node.parentNode;
				count--;
			}
		}
		while (count > 0);
	}
}

function view_tabViews(showIt, usePanels) {
	if (tabViewsPanelDIV) {
		tabViewsPanelVisible = showIt;
		if (showIt) okPanels = usePanels;
		panelActiveTab(tabViewsPanelLNK, showIt);
		tabViewsPanelDIV.animB.showHide(showIt);
	}
}

function view_mycl(showIt, usePanels) {
	if (myclPanelDIV) {
		myclPanelVisible = showIt;
		if (showIt) okPanels = usePanels;
		panelActiveTab(myclPanelLNK, showIt);
		myclPanelDIV.animB.showHide(showIt);
	}
}

function view_gmaps(showIt, usePanels) {
	if (gmapsPanelDIV) {
		gmapsPanelVisible = showIt;
		if (showIt) okPanels = usePanels;
		panelActiveTab(gmapsPanelLNK, showIt);
		gmapsPanelDIV.animB.showHide(showIt, function(){
			if (showIt) {
				mapInit();
			}
		});
	}
}

function view_progressbar(showIt, usePanels) {
	if (progressbarPanelDIV) {
		progressbarPanelVisible = showIt;
		if (showIt) okPanels = usePanels;
		panelActiveTab(progressbarPanelLNK, showIt);
		progressbarPanelDIV.animB.showHide(showIt, pBarDemo.begin);
	}
}

function view_slider(showIt, usePanels) {
	if (sliderPanelDIV) {
		sliderPanelVisible = showIt;
		if (showIt) okPanels = usePanels;
		panelActiveTab(sliderPanelLNK, showIt);
		sliderPanelDIV.animB.showHide(showIt);
	}
}

function anyPanelVisible() {
	return tabViewsPanelVisible || myclPanelVisible || gmapsPanelVisible || progressbarPanelVisible || sliderPanelVisible;
}

function onViewPanel(showIt) {
	//if (showIt) hideBox();
}

var panelList = {};

function showView(viewName, vuLink) {
	if (viewName) {
		if (vuLink) {
			vuLink.blur();
		}
		if (panelList[viewName]) {
			jt_.BodyZ.toTop(panelList[viewName]);
			//jt_.TraceObj.show(panelList[viewName]);
		}
		//if (jt_bgGame.tip) jt_.showNoneElm(jt_bgGame.tip);
	}
	okPanels = ["tabBar"];
	view_tabViews(viewName == "tabViews", ["tabBar", "tabViewsPanel"]);
	view_mycl(viewName == "mycl", ["tabBar", "myclPanel"]);
	view_gmaps(viewName == "gmaps", ["tabBar", "gmapsPanel"]);
	view_progressbar(viewName == "progressbar", ["tabBar", "progressbarPanel"]);
	view_slider(viewName == "slider", ["tabBar", "sliderPanel"]);
	onViewPanel(anyPanelVisible());
}

function jt_CloseSize(toDIV, options) {
	toDIV._jt_CloseSize = {ops:options ? options : {}};
	toDIV._jt_CloseSize.btn_Close = document.createElement("A");
	toDIV._jt_CloseSize.btn_Close.href = "";
	toDIV._jt_CloseSize.btn_Close.onclick = function(){return false;};
	toDIV._jt_CloseSize.btn_Close.className = "jt_closeX";
	toDIV._jt_CloseSize.btn_Close.title = "Close";
	toDIV.appendChild(toDIV._jt_CloseSize.btn_Close);
	jt_.addListener(toDIV._jt_CloseSize.btn_Close, 'click',
		function() {
			if (toDIV._jt_CloseSize.ops.onClose) {
				toDIV._jt_CloseSize.ops.onClose();
			}
			else if (toDIV.animB) {
				toDIV.animB.getBoxSize();
				toDIV.animB.showHide();
			}
			else {
				jt_.showNoneElm(toDIV);
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
		toDIV._jt_CloseSize.btn_Size.style.top = jt_.valPx(toDIV._jt_CloseSize.btnSizeTop);

		toDIV._jt_CloseSize.btn_Size.onDragStart =
			function(x, y) {
				//jt_cssClass.add(toDIV._jt_CloseSize.btn_Size, 'dragging');
				toDIV._jt_CloseSize.btn_Size.style.backgroundColor = "#ffff00";
				var currStyle = jt_.currStyle(toDIV);
				toDIV._jt_CloseSize.btnSizeWidth = jt_.width(toDIV, currStyle);
				toDIV._jt_CloseSize.btnSizeHeight = jt_.height(toDIV, currStyle);
				toDIV._jt_CloseSize.btnSizeLeft = toDIV._jt_CloseSize.btn_Size.offsetLeft;
				toDIV._jt_CloseSize.divPos = jt_.getOffsetXY(toDIV);
				//jt_Trace.msg("x=" + toDIV._jt_CloseSize.divPos.x + ", y=" + toDIV._jt_CloseSize.divPos.y + ", btnSizeLeft=" + toDIV._jt_CloseSize.btnSizeLeft + ", btnSizeTop=" + toDIV._jt_CloseSize.btnSizeTop + ", btnSizeWidth=" + toDIV._jt_CloseSize.btnSizeWidth + ", btnSizeHeight=" + toDIV._jt_CloseSize.btnSizeHeight);
				jt_.appendRelative(toDIV._jt_CloseSize.btn_Size, document.body);
				jt_.BodyZ.toTop(toDIV._jt_CloseSize.btn_Size);

				if (options.dragStart && (typeof options.dragStart == 'function')) {
					options.dragStart();
				}
			};

		toDIV._jt_CloseSize.btn_Size.onDrag =
			function(x, y) {
				if (toDIV.animB) {
					toDIV.animB.getBoxSize();
				}
				jt_.BodyZ.toTop(toDIV._jt_CloseSize.btn_Size);
				var deltaW = x - toDIV._jt_CloseSize.divPos.x - toDIV._jt_CloseSize.btnSizeLeft;
				var deltaH = y - toDIV._jt_CloseSize.divPos.y - toDIV._jt_CloseSize.btnSizeTop;
				var width = toDIV._jt_CloseSize.btnSizeWidth + deltaW;
				var height = toDIV._jt_CloseSize.btnSizeHeight - deltaH;
				var top = toDIV._jt_CloseSize.divPos.y + deltaH;
				//jt_Trace.msg("x=" + x + ", y=" + y + ", deltaW=" + deltaW + ", deltaH=" + deltaH + ", width=" + width + ", height=" + height + ", top=" + top);
				//jt_Trace.msg("offsetLeft=" + toDIV._jt_CloseSize.btn_Size.offsetLeft + ", offsetTop=" + toDIV._jt_CloseSize.btn_Size.offsetTop);
				toDIV.style.top = jt_.valPx(top);
				toDIV.style.height = jt_.valPx(Math.max(height, 20));
				toDIV.style.width = jt_.valPx(Math.max(width, 80));
				if ((height < 20) || (width < 80)) {
					//toDIV._jt_CloseSize.divPos = jt_.getOffsetXY(toDIV);
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
				jt_.BodyZ.toTop(toDIV);
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


function initPage() {

	function initPanel(panel_ID, viewName) {
		var panelDIV = document.getElementById(panel_ID);
		panelList[viewName] = panelDIV;
		panelDIV.animB = new jt_.AnimBox(panelDIV);
		var handleDIV = panelDIV;
		for (var i=0; i<panelDIV.childNodes.length; i++) {
			if (panelDIV.childNodes[i].className == 'panelTitle') {
				handleDIV = panelDIV.childNodes[i];
				break;
			}
		}
		Drag.init(handleDIV, panelDIV);
		jt_Flick.init(panelDIV, function(){panelDIV.animB.getBoxPos();});
		return panelDIV;
	}

	function mapUpdate() {
		//setCrosshair();
		setMapHeight();
		map.checkResize();
		map.panTo(mapCntr);
	}

	tutorBox = document.getElementById("dialogBox1");
	tutorBoxHandle = document.getElementById("titleID");
	Drag.init(tutorBoxHandle, tutorBox, 0, null, 0);
	jt_Flick.init(tutorBox);

	tutorBoxCA = document.getElementById("contentID");
	tutorBoxAW = new jt_.AnimCalc(true, setWidth);
	tutorBoxAW.setRange('width', 300, 240); // will be flipped before use!
	getWindowSize();
	jt_.moveTo(tutorBox, winSizeX - 340, 110);
		//boxShow(false);

	tabBarDIV = document.getElementById("tabBar");

	tabViewsPanelLNK = document.getElementById("tabViewsLink");
	tabViewsPanelDIV = initPanel("tabViewsPanel", "tabViews");
		jt_CloseSize(tabViewsPanelDIV, {onClose: showView, btnSize: true});

	myclPanelLNK = document.getElementById("myclLink");
	myclPanelDIV = initPanel("myclPanel", "mycl");
		jt_CloseSize(myclPanelDIV, {onClose: showView, btnSize: true});

	gmapsPanelLNK = document.getElementById("gmapsLink");
	gmapsPanelDIV = initPanel("gmapsPanel", "gmaps");
	gmapsPanelDIV.animB.setStyle('TR');
		jt_CloseSize(gmapsPanelDIV, {
			onClose: showView,
			btnSize: true,
			dragStart: function() {mapCntr = map.getCenter();},
			onDrag: function() {mapUpdate();},
			dragEnd: function() {mapUpdate();}
		});
	gmapsPanelINFO = document.getElementById("gmapsInfo");

	sliderPanelLNK = document.getElementById("sliderLink");
	sliderPanelDIV = initPanel("sliderPanel", "slider");
	sliderPanelDIV.animB.setStyle('TR');
		jt_CloseSize(sliderPanelDIV, {onClose: showView, btnSize: true});

	progressbarPanelLNK = document.getElementById("progressbarLink");
	progressbarPanelDIV = initPanel("progressbarPanel", "progressbar");
	progressbarPanelDIV.animB.setStyle('TR');
		jt_CloseSize(progressbarPanelDIV, {onClose: showView});

	panelsAlign();
	showView('progressbar');
	jt_.addListener(window, 'resize', panelsAlign);
}

function winOpen(winName, width, height, url) {
	var popup = window.open(url, winName, "height=" + height + ",width=" + width + ",scrollbars=yes,resizable=yes,location=yes,menubar=yes,toolbar=yes");
	popup.focus();
}

function winOpenPct(winName, pct, url) {
	winOpen(winName, Math.round(jt_.winW() * pct), Math.round(jt_.winH() * pct), url);
}

var jt_bgGame = {
	showTip: function() {
		if (jt_bgGame.tip == null) {
			jt_bgGame.tip = document.getElementById("gamingBG");
			jt_bgGame.lnk = document.getElementById("gamingBGLink");
		}
		jt_.showHideElm(jt_bgGame.tip);
		jt_.showNoneElm(jt_bgGame.tip, true);
		jt_.alignCorner(jt_bgGame.tip, jt_bgGame.lnk, "TL", 0, 20);
		jt_.showHideElm(jt_bgGame.tip, true);
	},
	start: function() {
		if (jt_bgGame.timer == null) {
			jt_bgGame.showTip();
			jt_bgGame.ico = document.getElementById("scrollToolIcon");
			jt_bgGame.sX = 0;
			jt_bgGame.sY = 1;
			jt_.cssClass.rpl(document.body, 'wingo', 'wingoGame');
			jt_bgGame.reset();
			jt_bgGame.XC = jt_.winW() / 2;
			jt_bgGame.YC = jt_.winH() / 2;
			jt_.moveTo(jt_bgGame.ico, jt_bgGame.XC-9, jt_bgGame.YC-9);
			jt_.showNoneElm(jt_bgGame.ico, true);
			jt_.addListener((BrowserDetect.browser == 'Explorer') ? document.body : window, "mousemove", jt_bgGame.setSpeed);
			jt_.addListener(window, "unload", jt_bgGame.stop);
			jt_bgGame.lnk.style.background = "#ffffcc";
			jt_bgGame.timer = setInterval(jt_bgGame.step, 40);
		}
		else jt_bgGame.stop();
	},
	stop: function() {
		clearInterval(jt_bgGame.timer);
		jt_bgGame.timer = null;
		jt_bgGame.lnk.style.background = "none";
		jt_.showNoneElm(jt_bgGame.ico);
		jt_.showNoneElm(jt_bgGame.tip);
		jt_.remListener((BrowserDetect.browser == 'Explorer') ? document.body : window, "mousemove", jt_bgGame.setSpeed);
		jt_.remListener(window, "unload", jt_bgGame.stop);
		jt_.cssClass.rpl(document.body, 'wingoGame', 'wingo');
		document.body.style.backgroundPosition = '-5px top';
	},
	useTwo:true,
	oneTwo: function() {
		jt_bgGame.useTwo = !jt_bgGame.useTwo;
		return false;
	},
	/*** PRIVATE BELOW ***/
	setSpeed: function(ev) {
		var e = jt_.fixE(ev);
		jt_bgGame.sX = Math.round((e.clientX - jt_bgGame.XC) / jt_bgGame.XC * 50);
		jt_bgGame.sY = Math.round((e.clientY - jt_bgGame.YC) / jt_bgGame.YC * 50);
	},
	moveBG: function(reset) {
		document.body.style.backgroundPosition = (jt_bgGame.x) + 'px ' + jt_bgGame.y + 'px';
	},
	reset: function() {
		jt_bgGame.x = 0;
		jt_bgGame.y = jt_.winH() - 969;
		jt_bgGame.moveBG(true);
	},
	step: function() {
		jt_bgGame.x += jt_bgGame.sX;
		jt_bgGame.y += jt_bgGame.sY;
		jt_bgGame.moveBG();
	},
	timer: null
}


var pageTour = {
	show: function() {
		if (pageTour.box) pageTour.box.show();
		else {
			pageTour.box = new jt_DialogBox(false);
			jt_Flick.init(pageTour.box.container);
			var cN = pageTour.box.getContentNode();
			cN.style.width = jt_.valPx(350);
			var cid = "browserTest_";
			pageTour.box.setTitle(document.getElementById(cid + "title").innerHTML);
			pageTour.box.setContent(document.getElementById(cid + "content").innerHTML);
			pageTour.box.show();
			jt_.alignCorner(pageTour.box.container, document.getElementById("browserTestLink"), 'TL', -24, 18);
		}
	}
}

var boxIFRAME = function(url, height) {
	var box = new jt_DialogBox(false);
/*
	jt_CloseSize(box.container, {
		btnSize: true,
		dragStart: function() {
			box._jt_CloseSize = {};
			box._jt_CloseSize.oWidth = jt_.width(box.contentArea);
		},
		onDrag: function(x, y) {
			box.setWidth(box._jt_CloseSize.oWidth + x);
		}
	});
*/
	jt_Flick.init(box.container);
	box.getContentNode().className = "ifDemo";
	box.setUrl(url, height);
	return box;
}

var msgSlow = " - in IFRAME... <i>(so may drag slowly)</i>";

var myPersonal = {
	show: function(url) {
		if (myPersonal.box) {
			myPersonal.set(url);
		}
		else {
			myPersonal.box = boxIFRAME(url, jt_.valPx(540));
			myPersonal.box.setWidth(740);
			myPersonal.box.setCallCancel(function() {
				myPersonal.box.setUrl('');
			});
			myPersonal.set(url);
			myPersonal.box.moveTo(-1,-1);
		}
	},
	set: function(url) {
		myPersonal.box.setTitle(url + msgSlow);
		myPersonal.box.setUrl(url);
		myPersonal.box.setContent('<a href="' + url + '" target="_blank">open in separate window</a>');
		myPersonal.box.show();
	}
}

var sliderDemo = {
	show: function() {
		if (sliderDemo.box) sliderDemo.box.show();
		else {
			sliderDemo.box = boxIFRAME("art/index.html", jt_.valPx(400));
			sliderDemo.box.setTitle("Slider Demo" + msgSlow);
			sliderDemo.box.setWidth(740);
			sliderDemo.box.setContent(document.getElementById("sliderDemoTxt").innerHTML + '<br><a href="art/index.html" target="_blank">open in separate window</a>');
			sliderDemo.box.show();
			sliderDemo.box.moveTo(-1,-1);
		}
	}
}
