/**
 * map/mapWingo.js - Google Maps API Demo
 *
 * @version 15 Dec 2012
 * @author	Joseph Oster, wingo.com
 */

var mapWingo = {

	viewNames: [ "AddressLU", "Markers", "Routes", "Polygons", "Bookmarks", "LatLon" ],
	appPanels: {},

	resizeWin: function(event, isInit) {
		var scrnW = jt_.winW();
		var scrnH = jt_.winH();
		var ctrlH = jt_.height(mapWingo.wingo_ctrls_elm);
		if ( isInit || (scrnW != mapWingo.winCurrW) || (scrnH != mapWingo.winCurrH) || (frameH != mapWingo._ctrlH_) ) {
			jt_.showNoneElm(mapWingo.crosshairDIV);
			jt_.showNoneElm(mapWingo.mapFrame_elm);

			mapWingo.winCurrW = scrnW;
			mapWingo.winCurrH = scrnH;
			mapWingo._ctrlH_ = ctrlH;
			mapWingo.mapFrame_elm.style.top = jt_.valPx(ctrlH);
			var frameH = scrnH - ctrlH;
			mapWingo.mapFrame_elm.style.height = jt_.valPx(frameH);
			jt_.showNoneElm(mapWingo.mapFrame_elm, true);

			jt_.moveTo(mapWingo.crosshairDIV, Math.round(scrnW/2) - 8, ctrlH + Math.round(frameH/2) - 8);
			jt_.showNoneElm(mapWingo.crosshairDIV, true);
		}
	},

	showView: function(vuName) {
		for (var i=0; i<mapWingo.viewNames.length; i++) {
			var showIt = (vuName == mapWingo.viewNames[i]);
			mapWingo.appPanels[mapWingo.viewNames[i]].style.display = showIt ? "block" : "none";
			if (showIt) { // init each view?
				switch (vuName) {
					case "AddressLU": {
						mapWingo.fldAddr.focus();
						break;
					}
					case "Markers": {
						mapWingo.markerDescFld.focus();
						break;
					}
				}
			}
		}
		return false;
	},

	plotLonLat: function(lng, lat, zoomLevel, mapType) {
		mapWingo.wingoMapFrame.plotLonLat(lng, lat, zoomLevel, mapType);
	},

	latLngUpdate: function(lng, lat) {
		mapWingo.fldLat.value = lat.toFixed(6);
		mapWingo.fldLon.value = lng.toFixed(6);
		$(mapWingo.latVu).text(mapWingo.fldLat.value);
		$(mapWingo.lonVu).text(mapWingo.fldLon.value);
		jt_.cssClass.rem(mapWingo.latLonVu, 'hideElm');
	},

	zoom_changed: function(zVal) {
		jt_.fo.setSelectVal(mapWingo.zoomPD, zVal);
	},

	showlatLon: function(showIt) {
		if (showIt) {
			$(mapWingo.latLonVu).show();
		}
		else {
			$(mapWingo.latLonVu).hide();
		}
		mapWingo.resizeWin(); // can re-size header
	},

	myLoc: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(

				function(position) { // success
					mapWingo.plotLonLat(position.coords.longitude, position.coords.latitude);
				},

				function(msg) { // error
					alert(msg);
					console.log(arguments);
				}

			);
		}
		else alert("Not supported");
	},

	init: function(wingoMapFrame) {
		mapWingo.wingoMapFrame = wingoMapFrame; // 'WingoMap' passed from iFrame to parent

		mapWingo.mapFrame_elm = document.getElementById("mapFrame");
		mapWingo.wingo_ctrls_elm = document.getElementById("wingo_ctrls");
		mapWingo.crosshairDIV = document.getElementById("myCrosshair");
		mapWingo.errMSG = document.getElementById("err");
		mapWingo.fldAddr = document.getElementById("address");
		mapWingo.fldLon = document.getElementById("long");
		mapWingo.fldLat = document.getElementById("lat");
		mapWingo.zoomPD = document.getElementById("zoomLevel");

		mapWingo.latLonVu = document.getElementById("latLonVu");
		mapWingo.latVu = document.getElementById("latVu");
		mapWingo.lonVu = document.getElementById("lonVu");

		jt_.addListener(document.getElementById("btn_Menu"), 'click', mapWingo.showView);

		jt_.addListener(mapWingo.zoomPD, 'change', function() {
			mapWingo.wingoMapFrame.map.setZoom(parseInt(jt_.fo.selected(mapWingo.zoomPD)));
		});

		jt_.addListener(document.getElementById("btnGoTo"), 'click', function() {
			mapWingo.fldAddr.value = "";
			mapWingo.wingoMapFrame.panTo(mapWingo.fldLat.value, mapWingo.fldLon.value);
		});
	
		mapWingo.resizeWin(true, true);
		wingoMapFrame.initMap(37.443330303736026, -122.16418147087097, 10); // Center the map on Palo Alto
		jt_.addListener(window, 'resize', mapWingo.resizeWin);

		$("#latLonShow").click(function () {
			mapWingo.showlatLon(this.checked);
		});

		mapWingo.polyPD = document.getElementById("polyShape");
		mapWingo.markerDescFld = document.getElementById("markerDesc");

		// initAppViews
		for (var i=0; i<mapWingo.viewNames.length; i++) {
			mapWingo.appPanels[mapWingo.viewNames[i]] = document.getElementById("panel" + mapWingo.viewNames[i]);
		}

		$(".xPanel").click(mapWingo.showView);

		wmPolys.load();
		wmMarkers.load();
	}
};


var wmMarkers = {

	markList: [],
	markerEditIdx: -1,

	showList: function() {
		var listDIV = document.getElementById("markerList");
		$(listDIV).empty();
		for (var i=0; i<wmMarkers.markList.length; i++) {
			var st = '<li>' + (i+1) + ') <a href="javascript:wmMarkers.centerOn(' + i + ')" class="btn btn-mini btn-info">center</a> ';
			st += '<a href="javascript:wmMarkers.edit(' + i + ')" class="btn btn-mini btn-primary">Edit/Move</a> ';
			st += '<a href="javascript:wmMarkers.remove(' + i + ')" class="btn btn-mini btn-danger">Remove</a></li>';
			$(st).appendTo(listDIV);
		}
	},

	centerOn: function(idx) {
		mapWingo.wingoMapFrame.map.panTo(wmMarkers.markList[idx].position);
	},

	setButtons: function(editIdx) {
		wmMarkers.markerEditIdx = editIdx;
		document.getElementById('markerButton').innerHTML = (editIdx == -1) ? "Create Marker" : "Save Changes";
		jt_.showNone("markerCancelButton", editIdx != -1, "inline");
	},

	edit: function(idx) {
		mapWingo.wingoMapFrame.infowindow.close();
		wmMarkers.centerOn(idx);
		wmMarkers.setButtons(idx);
		mapWingo.markerDescFld.value = wmMarkers.markList[idx]._appInfoHTML;
		mapWingo.markerDescFld.focus();
	},

	remove: function(idx) {
		mapWingo.wingoMapFrame.infowindow.close();
		wmMarkers.markList[idx].setMap();
		wmMarkers.markList.splice(idx, 1);
		wmMarkers.setButtons(-1);
		wmMarkers.showList();
		wmMarkers.save();
	},

	clearDescrip: function() {
		mapWingo.markerDescFld.value = "";
	},

	add: function(marker) {
		wmMarkers.markList.push(marker);
		wmMarkers.showList();
	},

	createSave: function() {
		if (wmMarkers.markerEditIdx == -1) { // create new
			wmMarkers.add(mapWingo.wingoMapFrame.createNewMarker(mapWingo.markerDescFld.value));
		}
		else { // save/replace
			wmMarkers.markList[wmMarkers.markerEditIdx].setMap();
			wmMarkers.markList[wmMarkers.markerEditIdx] = mapWingo.wingoMapFrame.createNewMarker(mapWingo.markerDescFld.value);
			wmMarkers.setButtons(-1);
		}
		wmMarkers.save();
	},

	ls_KEY: 'WingoMap.wmMarkers',

	save: function() {
		var listObj = [];
		for (var i=0; i<wmMarkers.markList.length; i++) {
			listObj.push(wmMarkers.markList[i]._wpParams);
		}
		localStorage[wmMarkers.ls_KEY] = JSON.stringify(listObj);
	},

	load: function() {
		var listObj = JSON.parse(localStorage[wmMarkers.ls_KEY]);
		if (listObj && (listObj.length > 0)) {
			for (var i=0; i<listObj.length; i++) {
				var params = listObj[i];
				var marker = mapWingo.wingoMapFrame.createNewMarker(params.txt, params.lat, params.lon);
				marker._wpParams = params;
				wmMarkers.markList.push(marker);
			}
			wmMarkers.showList();
		}
	}

};


var wmPolys = {

	polyList: [],
	polyEditIdx: -1,

	showList: function() {
		var listDIV = document.getElementById("polyList");
		$(listDIV).empty();
		for (var i=0; i<wmPolys.polyList.length; i++) {
			var st = '<li>' + (i+1) + ') <a href="javascript:wmPolys.centerOn(' + i + ')" class="btn btn-mini btn-info">center</a> <a href="javascript:wmPolys.edit(' + i + ')" class="btn btn-mini btn-primary">Edit/Move</a> <a href="javascript:wmPolys.remove(' + i + ')" class="btn btn-mini btn-danger">Remove</a></li>';
			$(st).appendTo(listDIV);
		}
	},

	centerOn: function(idx) {
		mapWingo.wingoMapFrame.panTo(wmPolys.polyList[idx]._wpParams.lat, wmPolys.polyList[idx]._wpParams.lon);
	},

	setButtons: function(editIdx) {
		wmPolys.polyEditIdx = editIdx;
		document.getElementById('polyButton').innerHTML = (editIdx == -1) ? "Create " + mapWingo.polyPD.options[mapWingo.polyPD.selectedIndex].text : "Save Changes";
		jt_.showNone("polyCancelButton", editIdx != -1, "inline");
	},

	edit: function(idx) {
		wmPolys.centerOn(idx);
		wmPolys.setButtons(idx);
		jt_.fo.setSelectVal(mapWingo.polyPD, wmPolys.polyList[idx]._wpParams.numSides);
		document.getElementById("polyRadius").value = wmPolys.polyList[idx]._wpParams.radius;
		document.getElementById("polyColor").value = wmPolys.polyList[idx]._wpParams.color;
		document.getElementById("polyWidth").value = wmPolys.polyList[idx]._wpParams.lineWidth;
		document.getElementById("polyTransparency").value = wmPolys.polyList[idx]._wpParams.trans;
	},

	remove: function(idx) {
		wmPolys.polyList[idx].setMap();
		wmPolys.polyList.splice(idx, 1);
		wmPolys.setButtons(-1);
		wmPolys.showList();
		wmPolys.save();
	},

	createPolygon: function() {
		var centerPoint = mapWingo.wingoMapFrame.map.getCenter();
		var params = {
			numSides: parseInt(jt_.fo.selected(document.getElementById("polyShape"))),
			radius: parseInt(document.getElementById("polyRadius").value),
			color: document.getElementById("polyColor").value,
			lineWidth: parseInt(document.getElementById("polyWidth").value),
			trans: parseFloat(document.getElementById("polyTransparency").value),
			lat: centerPoint.lat(),
			lon: centerPoint.lng()
		};
		var poly = mapWingo.wingoMapFrame.drawPolygon(params.lat, params.lon, params.numSides, params.radius, params.color, params.lineWidth, params.trans);
		poly._wpParams = params;
		return poly;
	},

	createSave: function() {
		if (wmPolys.polyEditIdx == -1) { // create new
			wmPolys.polyList.push(wmPolys.createPolygon());
			wmPolys.showList();
		}
		else { // replace
			wmPolys.polyList[wmPolys.polyEditIdx].setMap();
			wmPolys.polyList[wmPolys.polyEditIdx] = wmPolys.createPolygon();
			wmPolys.setButtons(-1);
		}
		wmPolys.save();
	},

	ls_KEY: 'WingoMap.polys',

	save: function() {
		var listObj = [];
		for (var i=0; i<wmPolys.polyList.length; i++) {
			listObj.push(wmPolys.polyList[i]._wpParams);
		}
		localStorage[wmPolys.ls_KEY] = JSON.stringify(listObj);
	},

	load: function() {
		var listObj = JSON.parse(localStorage[wmPolys.ls_KEY]);
		if (listObj && (listObj.length > 0)) {
			for (var i=0; i<listObj.length; i++) {
				var params = listObj[i];
				var poly = mapWingo.wingoMapFrame.drawPolygon(params.lat, params.lon, params.numSides, params.radius, params.color, params.lineWidth, params.trans);
				poly._wpParams = params;
				wmPolys.polyList.push(poly);
			}
			wmPolys.showList();
		}
	}

};
