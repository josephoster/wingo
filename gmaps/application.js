/**
 * gmaps/application.js - Google Maps API Demo
 *
 * @version 21 Dec 2010
 * @author	Joseph Oster, wingo.com
 */

var viewAddressLU = 0;
var viewMarkers	= 1;
var viewRoutes		= 2;
var viewPolygons	= 3;
var viewBookmarks = 4;

var numAppViews = 5;

var polyPD;
var markerDescFld;

function viewName(viewNum) {
	switch (viewNum) {
		case viewAddressLU: return "AddressLU";
		case viewMarkers	: return "Markers";
		case viewRoutes	: return "Routes";
		case viewPolygons : return "Polygons";
		case viewBookmarks: return "Bookmarks";
	}
}

function viewInit(viewNum) {
	switch (viewNum) {
		case viewAddressLU: {
			fldAddr.focus();
			break;
		}
		case viewMarkers	: {
			markerDescFld.focus();
			break;
		}
		case viewRoutes	 : {
			break;
		}
		case viewPolygons : {
			break;
		}
		case viewBookmarks: {
			break;
		}
	}
}

var appLinks = new Array(numAppViews);
var appPanels = new Array(numAppViews);

function showView(viewNum) {
	for (var i=0; i<numAppViews; i++) {
		var showIt = (viewNum == i);
		appPanels[i].style.display = showIt ? "block" : "none";
		if (showIt) {
			jt_.alignCorner(appPanels[i], appLinks[i], "TR");
			viewInit(i);
		}
	}
}

function initApplication() {
	for (var viewNum=0; viewNum<numAppViews; viewNum++) {
		appLinks[viewNum]	= document.getElementById("link" +	viewName(viewNum));
		appPanels[viewNum] = document.getElementById("panel" + viewName(viewNum));
	}
	polyPD = document.getElementById("polyShape");
	markerDescFld = document.getElementById("markerDesc");
}

var myPoints = new Array();
var myPolys = new Array();

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
	map.panTo(myPoints[idx].position);
}

var markerEditIdx = -1;

function setMarkerButton(editIdx) {
	markerEditIdx = editIdx;
	document.getElementById('markerButton').innerHTML = (editIdx == -1) ? "Create Marker" : "Save Changes";
	jt_.showNone("markerCancelButton", editIdx != -1, "inline");
}

function editMarker(idx) {
	infowindow.close();
	centerMarker(idx);
	markerDescFld.value = myPoints[idx]._appInfoHTML;
	setMarkerButton(idx);
	markerDescFld.focus();
}

function removeMarker(idx) {
	infowindow.close();
	myPoints[idx].setMap();
	myPoints.splice(idx, 1);
	setMarkerButton(-1);
	showMarkers();
}

function addMarker(marker) {
	myPoints.push(marker);
	showMarkers();
}

function clearMarkerTxt() {
	markerDescFld.value = "";
}

function createNewMarker(infoTxt, atPos) {
	atPos = atPos ? atPos : map.getCenter();
	var marker = new google.maps.Marker({position: atPos, map: map, draggable: true});
	marker._appInfoHTML = jt_.htmlEncode(infoTxt).replace(/\n/gi,"<br>");
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent("<span class='markerTxt'>" + marker._appInfoHTML + "</span>");
		infowindow.open(map, marker);
	});
	clearMarkerTxt();
	return marker;
}

function createMarkerBtn() {
	if (markerEditIdx == -1) { // create new
		addMarker(createNewMarker(markerDescFld.value));
	}
	else { // replace
		myPoints[markerEditIdx].setMap();
		myPoints[markerEditIdx] = createNewMarker(markerDescFld.value);
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

// 'drawPolygon()' from Joe Murphy - http://www.mailbag.com/users/joe_/
var d2r = Math.PI/180; // degrees to radians
var r2d = 180/Math.PI; // radians to degrees

function drawPolygon(lat, lng, PGsides, PGradius, PGcolor, PGwidth, PGtrans) {
/* parameters:
  'PGsides' - number of sides of polygon (use 36 for circle)
  'PGradius' - radius in miles of polygon vertices
  'PGcolor' - polygon color, hex
  'PGwidth' - line width in pixels
  'PGtrans' - transparency 0..1
*/
	var PGstart = (PGsides%2 == 1) ? 2/PGsides : 1/PGsides;
	PGstart = (0.5 - PGstart) * Math.PI;
	var PGlat = (PGradius/3963)*r2d; // using 3963 miles as earth's radius
	var PGlng = PGlat/Math.cos(lat*d2r);
	var PGpoints = [];
	for (var i=-1; i < PGsides; i++) {
		var theta = 2*i*Math.PI/PGsides + PGstart;
		PGx = lng + (PGlng * Math.cos(theta));
		PGy = lat + (PGlat * Math.sin(theta));
		PGpoints.push(new google.maps.LatLng(PGy, PGx, true));
	}
	var poly = new google.maps.Polyline({path: PGpoints, strokeColor: "#" + PGcolor, strokeWeight: PGwidth, strokeOpacity: PGtrans, map: map});
	return poly;
	}

function createPolygon() {
	var numSides = jt_.fo.selected(document.getElementById("polyShape"));
	var radius = parseInt(document.getElementById("polyRadius").value);
	var color = document.getElementById("polyColor").value;
	var lineWidth = parseInt(document.getElementById("polyWidth").value);
	var trans = parseFloat(document.getElementById("polyTransparency").value);
	var centerPoint = map.getCenter();
	var poly = drawPolygon(centerPoint.lat(), centerPoint.lng(), numSides, radius, color, lineWidth, trans);
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
	map.panTo(myPolys[idx].myCP);
}

var polyEditIdx = -1;

function setPolyButton(editIdx) {
	polyEditIdx = editIdx;
	document.getElementById('polyButton').innerHTML = (editIdx == -1) ? "Create " + polyPD.options[polyPD.selectedIndex].text : "Save Changes";
	jt_.showNone("polyCancelButton", editIdx != -1, "inline");
}

function editPoly(idx) {
	centerPoly(idx);
	jt_.fo.setSelectVal(polyPD, myPolys[idx].getPath().getLength()-1);
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

function clearAllOverlays() {
	map.clearOverlays();
	myPoints.length = 0;
	showMarkers();
	myPolys.length = 0;
	showPolys();
}