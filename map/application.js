/**
 * map/application.js - Google Maps API Demo
 *
 * @version 11 Dec 2012
 * @author	Joseph Oster, wingo.com
 */

var viewNames = [ "AddressLU", "Markers", "Routes", "Polygons", "Bookmarks", "LatLon" ];
var appPanels = {};

var myPoints = [];
var myPolys = [];


function viewInit(vuName) {
	switch (vuName) {
		case "AddressLU": {
			mapWingo.fldAddr.focus();
			break;
		}
		case "Markers": {
			mapWingo.markerDescFld.focus();
			break;
		}
		case "Routes": {
			break;
		}
		case "Polygons": {
			break;
		}
		case "Bookmarks": {
			break;
		}
		case "LatLon": {
			break;
		}
	}
}

function showView(vuName) {
	for (var i=0; i<viewNames.length; i++) {
		if (appPanels[viewNames[i]]) { // no-op prior to init!
			var showIt = (vuName == viewNames[i]);
			jt_.Trace.msg("vuName=" + vuName + '][' + viewNames[i] + '][' + showIt);
			if (showIt) {
				jt_.TraceObj.show(appPanels[viewNames[i]]);
				viewInit(i);
			}
			appPanels[viewNames[i]].style.display = showIt ? "block" : "none";
		}
	}
}

function showMarkers() {
	var st = "";
	for (var i=0; i<myPoints.length; i++) {
		st += (i+1) + ') <a href="javascript:centerMarker(' + i + ')">center</a> - ';
		st += '<a href="javascript:editMarker(' + i + ')">edit/move</a> - ';
		st += '<a href="javascript:removeMarker(' + i + ')">remove</a><br>';
	}
	document.getElementById("markerList").innerHTML = st;
}

function centerMarker(idx) {
	mapWingo.wingoMapFrame.map.panTo(myPoints[idx].position);
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
	mapWingo.markerDescFld.value = myPoints[idx]._appInfoHTML;
	setMarkerButton(idx);
	mapWingo.markerDescFld.focus();
}

function removeMarker(idx) {
	mapWingo.wingoMapFrame.infowindow.close();
	myPoints[idx].setMap();
	myPoints.splice(idx, 1);
	setMarkerButton(-1);
	showMarkers();
}

function addMarker(marker) {
	myPoints.push(marker);
	showMarkers();
}

function createMarkerBtn() {
	if (markerEditIdx == -1) { // create new
		addMarker(mapWingo.wingoMapFrame.createNewMarker(mapWingo.markerDescFld.value));
	}
	else { // replace
		myPoints[markerEditIdx].setMap();
		myPoints[markerEditIdx] = mapWingo.wingoMapFrame.createNewMarker(mapWingo.markerDescFld.value);
		setMarkerButton(-1);
	}
}

function showPolys() {
	var st = "";
	for (var i=0; i<myPolys.length; i++) {
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
		myPolys.push(createPolygon());
		showPolys();
	}
	else { // replace
		myPolys[polyEditIdx].setMap();
		myPolys[polyEditIdx] = createPolygon();
		setPolyButton(-1);
	}
}

function centerPoly(idx) {
	mapWingo.wingoMapFrame.map.panTo(myPolys[idx].myCP);
}

var polyEditIdx = -1;

function setPolyButton(editIdx) {
	polyEditIdx = editIdx;
	document.getElementById('polyButton').innerHTML = (editIdx == -1) ? "Create " + mapWingo.polyPD.options[mapWingo.polyPD.selectedIndex].text : "Save Changes";
	jt_.showNone("polyCancelButton", editIdx != -1, "inline");
}

function editPoly(idx) {
	centerPoly(idx);
	jt_.fo.setSelectVal(mapWingo.polyPD, myPolys[idx].getPath().getLength()-1);
	var PR = document.getElementById("polyRadius");
	PR.value = myPolys[idx].myRadius;
	document.getElementById("polyColor").value = myPolys[idx].strokeColor.substring(1);
	document.getElementById("polyWidth").value = myPolys[idx].strokeWeight;
	document.getElementById("polyTransparency").value = myPolys[idx].strokeOpacity;
	setPolyButton(idx);
}

function removePoly(idx) {
	myPolys[idx].setMap();
	myPolys.splice(idx, 1);
	setPolyButton(-1);
	showPolys();
}

function initAppViews() {
	for (var i=0; i<viewNames.length; i++) {
		appPanels[viewNames[i]] = document.getElementById("panel" + viewNames[i]);
	}
}
