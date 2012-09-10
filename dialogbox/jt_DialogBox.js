/**
 * jt_DialogBox.js - DHTML modal dialog box
 *
 * @version 29 Aug 2012
 * @author	Joseph Oster, wingo.com, Copyright (c) 2005-2012
 * @license http://www.wingo.com/dialogbox/license.html
 */
/************ REQUIRES: 'jt_.BodyZ' and 'jt_.Veil' from 'jt2_.js' ************/

jt_DialogBox = function(isModal, dragable) {
	// CONSTRUCTOR for 'jt_DialogBox' object
	if (arguments.length == 0) return;
	this.isModal = isModal;
	dragable = (arguments.length == 2) ? dragable : true;

	this.container = document.createElement('div');
	this.container.className = jt_DialogBox.className;
	this.container.dialogBox = this;

	var mainTable = document.createElement('table');
	mainTable.setAttribute('cellSpacing', '0');
	mainTable.setAttribute('cellPadding', '0');
	mainTable.setAttribute('border', '0');

	var tBodyM = document.createElement('tbody');
	var rowM = document.createElement('tr');
	var cellM = document.createElement('td');

	//*********** BEGIN Title TABLE ***********
	var titleTable = document.createElement('table');
	titleTable.setAttribute('cellSpacing', '0');
	titleTable.setAttribute('cellPadding', '0');
	titleTable.setAttribute('border', '0');
	titleTable.setAttribute('width', '100%');

	var tBodyT = document.createElement('tbody');
	var rowT = document.createElement('tr');
	var cellT = document.createElement('td');
	cellT.className = "tbLeft";
	rowT.appendChild(cellT);

	this.titleCell = document.createElement('td');
	this.titleCell.className = "Title";
	rowT.appendChild(this.titleCell);

	cellT = document.createElement('td');
	cellT.className = "tbRight";

	var aLink = document.createElement('A');
	aLink.setAttribute('href','#');
	aLink.setAttribute('title','Close');
	aLink.dialogBox = this;
	aLink.onclick = jt_DialogBox.closeBox;
	cellT.appendChild(aLink);
	rowT.appendChild(cellT);

	tBodyT.appendChild(rowT);
	titleTable.appendChild(tBodyT);
	//*********** END Title TABLE ***********

	cellM.appendChild(titleTable);
	rowM.appendChild(cellM);
	tBodyM.appendChild(rowM);

	rowM = document.createElement('tr');
	cellM = document.createElement('td');
	cellM.className = "MainPanel";

	this.contentArea = document.createElement('div');
	this.contentArea.className = "ContentArea";
	cellM.appendChild(this.contentArea);

	rowM.appendChild(cellM);
	tBodyM.appendChild(rowM);
	mainTable.appendChild(tBodyM);
	this.container.appendChild(mainTable);
	jt_.BodyZ.toTop(this.container);

	if (dragable) {
		Drag.init(this.titleCell, this.container, 0, null, 0);
		this.titleCell.style.cursor = "move";
	}
}


/************ BEGIN: Public Methods ************/
jt_DialogBox.prototype.show = function() {
	if (jt_.currStyle(this.container).display != "block") {
		this.container.style.display = "block";
		jt_.BodyZ.toTop(this.container);
		if (this.isModal) jt_.Veil.show(true);
	}
}

jt_DialogBox.prototype.hide = function(ok) {
	this.container.style.display = "none";
	if (this.isModal) jt_.Veil.show(false);
	if (ok) {
		if (this.callOK) {
			if (this.returnData) this.callOK(this.returnData);
			else this.callOK();
		}
	}
	else if (this.callCancel) this.callCancel();
}

jt_DialogBox.prototype.moveTo = function(x, y) {
	if (x == -1) x = Math.round((jt_.winW() - jt_.width(this.container)) / 2) + jt_.scrollLeft();
	if (y == -1) y = Math.round((jt_.winH() - jt_.height(this.container)) / 2) + jt_.scrollTop();
	this.container.style.left = x + "px";
	this.container.style.top = y + "px";
}

jt_DialogBox.prototype.setTitle = function(title) {
	this.titleCell.innerHTML = title;
}

jt_DialogBox.prototype.setWidth = function(width) {
	this.contentArea.style.width = width + "px";
}

jt_DialogBox.prototype.setUrl = function(url, height) {
	// creates one IFRAME above 'setContent()' area, updates 'url'
	if (!this._jtDialogBIF) {
		this._jtDialogBIF = document.createElement('IFRAME');
		this._jtDialogBIF.setAttribute('frameBorder', 'no');
		this._jtDialogBIF.style.width = "100%";
		if (height) this._jtDialogBIF.style.height = height;
		this.contentArea.parentNode.insertBefore(this._jtDialogBIF, this.contentArea);
	}
	this._jtDialogBIF.src = url;
}

jt_DialogBox.prototype.getUrl = function() {
	if (this._jtDialogBIF) {
		var url = this._jtDialogBIF.src;
		if (this._jtDialogBIF.contentWindow) {
			try {url = this._jtDialogBIF.contentWindow.location.href;}
			catch(e) {}
		}
		return url;
	}
}

jt_DialogBox.prototype.setContent = function(htmlContent) {
	this.contentArea.innerHTML = htmlContent;
}

jt_DialogBox.prototype.getContentNode = function() {
	// expose 'contentArea' DOM node for direct manipulation
	return this.contentArea;
}

jt_DialogBox.prototype.setCallOK = function(callOK) {
	// set by application as needed
	this.callOK = callOK;
}

jt_DialogBox.prototype.setCallCancel = function(callCancel) {
	// set by application as needed
	this.callCancel = callCancel;
}
/************ END: Public Methods ************/


/************ BEGIN: Private Methods ************/
jt_DialogBox.className = "jtDialogBox"; // CSS className
jt_DialogBox.maxDepth = 15; // optimize search of parent nodes

jt_DialogBox.closeBox = function(ev) {
	var e = jt_.fixE(ev);
	var node = e.target ? e.target : e.srcElement;
	var count = 0;
	while ((node != null) && (count < jt_DialogBox.maxDepth)) {
		if (node.dialogBox) {
			node.dialogBox.hide();
			return false;
		}
		node = node.parentNode;
		count++;
	}
	return false;
}
