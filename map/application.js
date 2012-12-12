/**
 * map/application.js - Google Maps API Demo
 *
 * @version 12 Dec 2012
 * @author	Joseph Oster, wingo.com
 */

var mapWingo = {

	viewNames: [ "AddressLU", "Markers", "Routes", "Polygons", "Bookmarks", "LatLon" ],
	appPanels: {},
	myPoints: [],
	myPolys: [],

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

	clearMarkerTxt: function() {
		mapWingo.markerDescFld.value = "";
	},

	init: function(wingoMapFrame) {
		mapWingo.wingoMapFrame = wingoMapFrame; // 'WingoMap' passed from iFrame to parent

		mapWingo.wingo_ctrls_elm = document.getElementById("wingo_ctrls");
		mapWingo.mapFrame_elm = document.getElementById("mapFrame");
		mapWingo.crosshairDIV = document.getElementById("myCrosshair");
		mapWingo.errMSG = document.getElementById("err");
		mapWingo.fldAddr = document.getElementById("address");
		mapWingo.fldLng = document.getElementById("long");
		mapWingo.fldLat = document.getElementById("lat");
		mapWingo.zoomPD = document.getElementById("zoomLevel");

		jt_.addListener(document.getElementById("btn_Menu"), 'click', showView);

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
	}
};


function showView(vuName) {
	for (var i=0; i<mapWingo.viewNames.length; i++) {
		if (mapWingo.appPanels[mapWingo.viewNames[i]]) { // no-op prior to init!
			var showIt = (vuName == mapWingo.viewNames[i]);
			mapWingo.appPanels[mapWingo.viewNames[i]].style.display = showIt ? "block" : "none";
			if (showIt) {
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
	}
}

function showMarkers() {
	var st = "";
	for (var i=0; i<mapWingo.myPoints.length; i++) {
		st += (i+1) + ') <a href="javascript:centerMarker(' + i + ')">center</a> - ';
		st += '<a href="javascript:editMarker(' + i + ')">edit/move</a> - ';
		st += '<a href="javascript:removeMarker(' + i + ')">remove</a><br>';
	}
	document.getElementById("markerList").innerHTML = st;
}

function centerMarker(idx) {
	mapWingo.wingoMapFrame.map.panTo(mapWingo.myPoints[idx].position);
}

var markerEditIdx = -1;

function setMarkerButton(editIdx) {
	markerEditIdx = editIdx;
	document.getElementById('markerButton').innerHTML = (editIdx == -1) ? "Create Marker" : "Save Changes";
	jt_.showNone("markerCancelButton", editIdx != -1, "inline");
}

function editMarker(idx) {
	mapWingo.wingoMapFrame.infowindow.close();
	centerMarker(idx);
	mapWingo.markerDescFld.value = mapWingo.myPoints[idx]._appInfoHTML;
	setMarkerButton(idx);
	mapWingo.markerDescFld.focus();
}

function removeMarker(idx) {
	mapWingo.wingoMapFrame.infowindow.close();
	mapWingo.myPoints[idx].setMap();
	mapWingo.myPoints.splice(idx, 1);
	setMarkerButton(-1);
	showMarkers();
}

function addMarker(marker) {
	mapWingo.myPoints.push(marker);
	showMarkers();
}

function createMarkerBtn() {
	if (markerEditIdx == -1) { // create new
		addMarker(mapWingo.wingoMapFrame.createNewMarker(mapWingo.markerDescFld.value));
	}
	else { // replace
		mapWingo.myPoints[markerEditIdx].setMap();
		mapWingo.myPoints[markerEditIdx] = mapWingo.wingoMapFrame.createNewMarker(mapWingo.markerDescFld.value);
		setMarkerButton(-1);
	}
}

function showPolys() {
	var st = "";
	for (var i=0; i<mapWingo.myPolys.length; i++) {
		st += (i+1) + ') <a href="javascript:centerPoly(' + i + ')">center</a> - <a href="javascript:editPoly(' + i + ')">edit/move</a> - <a href="javascript:removePoly(' + i + ')">remove</a><br />';
	}
	document.getElementById("polyList").innerHTML = st;
}

function createPolygon() {
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
}

function createPolyBtn() {
	if (polyEditIdx == -1) { // create new
		mapWingo.myPolys.push(createPolygon());
		showPolys();
	}
	else { // replace
		mapWingo.myPolys[polyEditIdx].setMap();
		mapWingo.myPolys[polyEditIdx] = createPolygon();
		setPolyButton(-1);
	}
}

function centerPoly(idx) {
	mapWingo.wingoMapFrame.map.panTo(mapWingo.myPolys[idx].myCP);
}

var polyEditIdx = -1;

function setPolyButton(editIdx) {
	polyEditIdx = editIdx;
	document.getElementById('polyButton').innerHTML = (editIdx == -1) ? "Create " + mapWingo.polyPD.options[mapWingo.polyPD.selectedIndex].text : "Save Changes";
	jt_.showNone("polyCancelButton", editIdx != -1, "inline");
}

function editPoly(idx) {
	centerPoly(idx);
	jt_.fo.setSelectVal(mapWingo.polyPD, mapWingo.myPolys[idx].getPath().getLength()-1);
	var PR = document.getElementById("polyRadius");
	PR.value = mapWingo.myPolys[idx].myRadius;
	document.getElementById("polyColor").value = mapWingo.myPolys[idx].strokeColor.substring(1);
	document.getElementById("polyWidth").value = mapWingo.myPolys[idx].strokeWeight;
	document.getElementById("polyTransparency").value = mapWingo.myPolys[idx].strokeOpacity;
	setPolyButton(idx);
}

function removePoly(idx) {
	mapWingo.myPolys[idx].setMap();
	mapWingo.myPolys.splice(idx, 1);
	setPolyButton(-1);
	showPolys();
}
