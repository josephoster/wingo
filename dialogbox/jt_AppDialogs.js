/**
 * jt_AppDialogs.js - extends jt_DialogBox.js with 3 specific types of dialog boxes,
 * based on JavaScript equivalents: 'jt_AppAlert', 'jt_AppConfirm' and 'jt_AppPrompt'
 *
 * @version 9 Apr 2005
 * @author  Joseph Oster, wingo.com, Copyright (c) 2005-2006
 * @license http://www.wingo.com/dialogbox/license.html
 */

jt_AppAlert = function(icon) {
	// CONSTRUCTOR for 'jt_AppAlert' object - EXTENDS 'jt_DialogBox'
	if (arguments.length==0) return;
	this.base = jt_DialogBox;
	this.base(true);

	var dialogTable = document.createElement('table');
	dialogTable.setAttribute('cellSpacing', '0');
	dialogTable.setAttribute('cellPadding', '0');
	dialogTable.setAttribute('border', '0');

	var tBody = document.createElement('tbody');
	var row = document.createElement('tr');
	var cell = document.createElement('td');
	cell.setAttribute("vAlign", "top");

	this.iconImage = document.createElement('img');
	this.iconImage.style.margin = "0px 10px 0px 0px";
	this.setIcon(icon);
	cell.appendChild(this.iconImage);
	row.appendChild(cell);

	this.contentCell = document.createElement('td');
	this.contentCell.className = "ContentArea";
	row.appendChild(this.contentCell);
	tBody.appendChild(row);
	dialogTable.appendChild(tBody);
	this.contentArea.appendChild(dialogTable);

	this.buttonDIV = document.createElement('div');
	this.buttonDIV.setAttribute("align", "center");
	this.buttonDIV.style.margin = "10px 0px 0px 0px";
	this.contentArea.appendChild(this.buttonDIV);
	jt_AppAlert.addButton(this, jt_AppAlert.lblOK, 1);
}

jt_AppAlert.prototype = new jt_DialogBox();


/************ BEGIN: 'jt_AppAlert' Public Methods ************/
jt_AppAlert.Warning = "warning.gif"; // 'icon' param to 'jt_AppAlert' constructor
jt_AppAlert.Error = "error.gif";     // 'icon' param to 'jt_AppAlert' constructor
jt_AppAlert.Info = "info.gif";       // 'icon' param to 'jt_AppAlert' constructor
jt_AppAlert.lblOK = "OK"; // label for "OK" button (for i18N)
jt_AppAlert.lblCancel = "Cancel"; // label for "Cancel" button (for i18N)

jt_AppAlert.prototype.setContent = function(htmlContent) {
	this.contentCell.innerHTML = htmlContent;
}

jt_AppAlert.prototype.setIcon = function(icon) {
	this.iconImage.src = icon;
}
/************ END: 'jt_AppAlert' Public Methods ************/



jt_AppConfirm = function(icon, callOK, callCancel) {
	// CONSTRUCTOR for 'jt_AppConfirm' object - EXTENDS 'jt_AppAlert'
	if (arguments.length==0) return;
	this.base = jt_AppAlert;
	this.base(icon);
	this.callOK = callOK;
	this.callCancel = callCancel;
	jt_AppAlert.addButton(this, jt_AppAlert.lblCancel, 2);
}

jt_AppConfirm.prototype = new jt_AppAlert();


/************ BEGIN: 'jt_AppConfirm' Public Methods ************/
jt_AppConfirm.prototype.askUser = function(htmlContent) {
	this.setContent(htmlContent);
	this.show();
}
/************ END: 'jt_AppConfirm' Public Methods ************/



jt_AppPrompt = function(icon, callOK, callCancel, cssClass) {
	// CONSTRUCTOR for 'jt_AppPrompt' object - EXTENDS 'jt_AppConfirm'
	if (arguments.length==0) return;
	this.base = jt_AppConfirm;
	this.base(icon, callOK, callCancel);
	this.returnData = new Object();
	this.fInput = document.createElement('input');
	this.fInput.type = "text";
	if (cssClass) this.fInput.className = cssClass;
	this.fInput.appDialog = this;
	this.fInput.onkeypress = jt_AppPrompt.keyPress;
}

jt_AppPrompt.prototype = new jt_AppConfirm();
jt_AppPrompt.superClass = jt_AppConfirm.prototype;


/************ BEGIN: 'jt_AppPrompt' Public Methods ************/
jt_AppPrompt.prototype.askUser = function(htmlContent, stDefault) {
	this.setContent(htmlContent);
	this.fInput.value = stDefault;
	this.contentCell.appendChild(this.fInput);
	this.show();
	this.fInput.focus();
}

jt_AppPrompt.prototype.focus = function() {
	this.fInput.focus();
}

jt_AppPrompt.prototype.hide = function(ok) {
	if (ok) this.returnData.value = this.fInput.value;
	jt_AppPrompt.superClass.hide.call(this, ok);
}
/************ END: 'jt_AppPrompt' Public Methods ************/



/************ BEGIN: 'jt_AppAlert' Private Methods ************/
jt_AppAlert.addButton = function(parent, buttonText, buttonNum) {
	var button = document.createElement("button");
	button.style.fontSize = "10pt";
	button.style.width = "60px";
	button.style.margin = "0px 5px";
	button.innerHTML = buttonText;
	button.linkNum = buttonNum;
	button.appDialog = parent;
	button.onclick = jt_AppAlert.clickLink;
	parent.buttonDIV.appendChild(button);
}

jt_AppAlert.clickLink = function(e) {
	if (!e) e = window.event;
	var node = e.target ? e.target : e.srcElement;
	var linkNum = node.linkNum;
	var count = 0;
	while ((node != null) && (count < jt_DialogBox.maxDepth)) {
		if (node.appDialog) {
			switch (linkNum) {
				case 1: {
					node.appDialog.hide(true);
					break;
				}
				case 2: {
					node.appDialog.hide();
					break;
				}
			}
			return false;
		}
		node = node.parentNode;
		count++;
	}
	return false;
}

jt_AppPrompt.keyPress = function(e) {
	if (!e) e = window.event;
	var node = e.target ? e.target : e.srcElement;
	var key = e.keyCode ? e.keyCode : e.which;
	if (key == 13) node.appDialog.hide(true);
	if (key == 27) node.appDialog.hide();
}
