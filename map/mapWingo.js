/**
 * map/mapWingo.js - Google Maps API Demo
 *
 * @version 12 Dec 2012
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

	plotLongLat: function(lng, lat, zoomLevel, mapType) {
		mapWingo.wingoMapFrame.plotLongLat(lng, lat, zoomLevel, mapType);
	},

	latLngUpdate: function(lng, lat) {
		mapWingo.fldLng.value = lng.toFixed(5);
		mapWingo.fldLat.value = lat.toFixed(5);
	},

	zoom_changed: function(zVal) {
		jt_.fo.setSelectVal(mapWingo.zoomPD, zVal);
	},

	init: function(wingoMapFrame) {
		mapWingo.wingoMapFrame = wingoMapFrame; // 'WingoMap' passed from iFrame to parent

		mapWingo.mapFrame_elm = document.getElementById("mapFrame");
		mapWingo.wingo_ctrls_elm = document.getElementById("wingo_ctrls");
		mapWingo.crosshairDIV = document.getElementById("myCrosshair");
		mapWingo.errMSG = document.getElementById("err");
		mapWingo.fldAddr = document.getElementById("address");
		mapWingo.fldLng = document.getElementById("long");
		mapWingo.fldLat = document.getElementById("lat");
		mapWingo.zoomPD = document.getElementById("zoomLevel");

		jt_.addListener(document.getElementById("btn_Menu"), 'click', mapWingo.showView);

		jt_.addListener(mapWingo.zoomPD, 'change', function() {
			mapWingo.wingoMapFrame.map.setZoom(parseInt(jt_.fo.selected(mapWingo.zoomPD)));
		});

		jt_.addListener(document.getElementById("btnGoTo"), 'click', function() {
			mapWingo.fldAddr.value = "";
			mapWingo.wingoMapFrame.panTo(mapWingo.fldLat.value, mapWingo.fldLng.value);
		});

		mapWingo.resizeWin(true, true);
		wingoMapFrame.initMap(37.443330303736026, -122.16418147087097, 10); // Center the map on Palo Alto
		jt_.addListener(window, 'resize', mapWingo.resizeWin);

		mapWingo.polyPD = document.getElementById("polyShape");
		mapWingo.markerDescFld = document.getElementById("markerDesc");

		// initAppViews
		for (var i=0; i<mapWingo.viewNames.length; i++) {
			mapWingo.appPanels[mapWingo.viewNames[i]] = document.getElementById("panel" + mapWingo.viewNames[i]);
		}

		$(".xPanel").click(mapWingo.showView);
	}
};


var wmMarkers = {

	markList: [],
	markerEditIdx: -1,

	centerMarker: function(idx) {
		mapWingo.wingoMapFrame.map.panTo(wmMarkers.markList[idx].position);
	},

	editMarker: function(idx) {
		mapWingo.wingoMapFrame.infowindow.close();
		wmMarkers.centerMarker(idx);
		mapWingo.markerDescFld.value = wmMarkers.markList[idx]._appInfoHTML;
		wmMarkers.setMarkerButton(idx);
		mapWingo.markerDescFld.focus();
	},

	removeMarker: function(idx) {
		mapWingo.wingoMapFrame.infowindow.close();
		wmMarkers.markList[idx].setMap();
		wmMarkers.markList.splice(idx, 1);
		wmMarkers.setMarkerButton(-1);
		wmMarkers.showMarkers();
	},

	showMarkers: function() {
		var st = "";
		for (var i=0; i<wmMarkers.markList.length; i++) {
			st += (i+1) + ') <a href="javascript:wmMarkers.centerMarker(' + i + ')">center</a> - ';
			st += '<a href="javascript:wmMarkers.editMarker(' + i + ')">edit/move</a> - ';
			st += '<a href="javascript:wmMarkers.removeMarker(' + i + ')">remove</a><br>';
		}
		document.getElementById("markerList").innerHTML = st;
	},

	clearMarkerTxt: function() {
		mapWingo.markerDescFld.value = "";
	},

	setMarkerButton: function(editIdx) {
		wmMarkers.markerEditIdx = editIdx;
		document.getElementById('markerButton').innerHTML = (editIdx == -1) ? "Create Marker" : "Save Changes";
		jt_.showNone("markerCancelButton", editIdx != -1, "inline");
	},

	addMarker: function(marker) {
		wmMarkers.markList.push(marker);
		wmMarkers.showMarkers();
	},

	createMarkerBtn: function() {
		if (wmMarkers.markerEditIdx == -1) { // create new
			wmMarkers.addMarker(mapWingo.wingoMapFrame.createNewMarker(mapWingo.markerDescFld.value));
		}
		else { // replace
			wmMarkers.markList[wmMarkers.markerEditIdx].setMap();
			wmMarkers.markList[wmMarkers.markerEditIdx] = mapWingo.wingoMapFrame.createNewMarker(mapWingo.markerDescFld.value);
			wmMarkers.setMarkerButton(-1);
		}
	}

};


var wmPloys = {

	polyList: [],
	polyEditIdx: -1,

	centerPoly: function(idx) {
		mapWingo.wingoMapFrame.map.panTo(wmPloys.polyList[idx].myCP);
	},

	editPoly: function(idx) {
		wmPloys.centerPoly(idx);
		jt_.fo.setSelectVal(mapWingo.polyPD, wmPloys.polyList[idx].getPath().getLength()-1);
		var PR = document.getElementById("polyRadius");
		PR.value = wmPloys.polyList[idx].myRadius;
		document.getElementById("polyColor").value = wmPloys.polyList[idx].strokeColor.substring(1);
		document.getElementById("polyWidth").value = wmPloys.polyList[idx].strokeWeight;
		document.getElementById("polyTransparency").value = wmPloys.polyList[idx].strokeOpacity;
		wmPloys.setPolyButton(idx);
	},

	removePoly: function(idx) {
		wmPloys.polyList[idx].setMap();
		wmPloys.polyList.splice(idx, 1);
		wmPloys.setPolyButton(-1);
		wmPloys.showPolys();
	},

	showPolys: function() {
		var st = "";
		for (var i=0; i<wmPloys.polyList.length; i++) {
			st += (i+1) + ') <a href="javascript:wmPloys.centerPoly(' + i + ')">center</a> - <a href="javascript:wmPloys.editPoly(' + i + ')">edit/move</a> - <a href="javascript:wmPloys.removePoly(' + i + ')">remove</a><br />';
		}
		document.getElementById("polyList").innerHTML = st;
	},

	createPolygon: function() {
		var numSides = jt_.fo.selected(document.getElementById("polyShape"));
		var radius = parseInt(document.getElementById("polyRadius").value);
		var color = document.getElementById("polyColor").value;
		var lineWidth = parseInt(document.getElementById("polyWidth").value);
		var trans = parseFloat(document.getElementById("polyTransparency").value);
		var centerPoint = mapWingo.wingoMapFrame.map.getCenter();
		var poly = mapWingo.wingoMapFrame.drawPolygon(centerPoint.lat(), centerPoint.lng(), numSides, radius, color, lineWidth, trans);
		poly.myCP = centerPoint;
		poly.myRadius = radius;
		return poly;
	},

	setPolyButton: function(editIdx) {
		wmPloys.polyEditIdx = editIdx;
		document.getElementById('polyButton').innerHTML = (editIdx == -1) ? "Create " + mapWingo.polyPD.options[mapWingo.polyPD.selectedIndex].text : "Save Changes";
		jt_.showNone("polyCancelButton", editIdx != -1, "inline");
	},

	createPolyBtn: function() {
		if (wmPloys.polyEditIdx == -1) { // create new
			wmPloys.polyList.push(wmPloys.createPolygon());
			wmPloys.showPolys();
		}
		else { // replace
			wmPloys.polyList[wmPloys.polyEditIdx].setMap();
			wmPloys.polyList[wmPloys.polyEditIdx] = wmPloys.createPolygon();
			wmPloys.setPolyButton(-1);
		}
	}

};
