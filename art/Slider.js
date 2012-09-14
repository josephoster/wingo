/**
 * Slider.js - DHTML slider control
 *
 * @version 14 Mar 2005
 * @author	Joseph Oster, wingo.com
 */

Slider = function(atX, atY, sLength, isVertical, dragFunc, txtColor, bgColor) {
	// CONSTRUCTOR for 'Slider' object
	if (arguments.length==0) return;
	this.container = document.createElement("DIV");
	this.container.className = Slider.className;
	this.container.innerHTML = "&nbsp;";
	this.container.style.left = atX + "px";
	this.container.style.top = atY + "px";
	this.container.style.color = txtColor;
	this.container.style.backgroundColor = bgColor;
	this.isVertical = isVertical;
	this.sliderLength = sLength;
	this.zeroPos = isVertical ? atY : atX;
	document.body.appendChild(this.container);
	Drag.init(this.container, null, atX, isVertical ? atX : atX + sLength, atY, isVertical ? atY + sLength : atY);
	this.container.root.onDrag = dragFunc;
	}

/************ BEGIN: Public Methods ************/
Slider.prototype.show = function(showIt) {
	this.container.style.display = (showIt) ? "block" : "none";
	}

Slider.prototype.getPosition = function() { // 0.0 - 1.0
	var pos = this.isVertical ? this.container.offsetTop : this.container.offsetLeft;
	return (pos - this.zeroPos) / this.sliderLength;
	}

Slider.prototype.setPosition = function(position) { // 0.0 - 1.0
	var newPos = (this.zeroPos + Math.round(position * this.sliderLength)) + "px";
	if (this.isVertical) this.container.style.top = newPos;
	else this.container.style.left = newPos;
	}

Slider.prototype.setTitle = function(title) {
	this.container.innerHTML = title;
	}
/************ END: Public Methods ************/

/************ BEGIN: Private Methods ************/
Slider.className = "SliderButton"; // CSS className
/************ END: Private Methods ************/
