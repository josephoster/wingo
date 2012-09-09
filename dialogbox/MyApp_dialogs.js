var alertDialog = null;
var alertX = -1; // centers dialog in window!
var alertY = -1;
var i18N_MyAppAlert = "MyApp Alert"; // can be changed by application

function MyAppAlertSetXY(x, y) {
	// call prior to 'MyAppAlert()'
	alertX = x;
	alertY = y;
	}

function MyAppAlertXY(ev) {
	// call using 'onclick' prior to 'MyAppAlert()'
	var e = jt_.fixE(ev);
	MyAppAlertSetXY(e.clientX, e.clientY + document.body.scrollTop);
	return true;
	}

function MyAppAlertInit(title, icon) {
	// 'title' and 'icon' are optional; both may be changed using 'MyAppAlert()'
	var locTitle = i18N_MyAppAlert;
	if (title) locTitle += " - " + title;
	if (alertDialog == null) {
		alertDialog = new jt_AppAlert(icon ? icon : jt_AppAlert.Error);
		alertDialog.setTitle(locTitle);
		}
	else {
		if (title) alertDialog.setTitle(locTitle);
		if (icon) alertDialog.setIcon(icon);
		}
	}

function MyAppAlert(msg, title, icon) {
	// 'title' and 'icon' are optional
	MyAppAlertInit(title, icon);
	alertDialog.setContent(msg);
	alertDialog.moveTo(alertX, alertY);
	alertDialog.show();
	if ((alertX == -1) || (alertY == -1)) alertDialog.moveTo(alertX, alertY);
	}
