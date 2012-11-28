var jt_FlingScroll = {
	init: function() {
		if (jt_FlingScroll.history === null) {
			jt_FlingScroll.history = [jt_FlingScroll.maxH-1];
			for (var i=0; i<jt_FlingScroll.maxH; i++) jt_FlingScroll.history[i] = {};
			}
		jt_.addListener(window, 'mousedown', jt_FlingScroll.start);
		jt_.addListener(window, 'mouseup', jt_FlingScroll.up);
		jt_.addListener(window, 'scroll', jt_FlingScroll.onDrag);
		},
	start: function() {
		if (typeof jt_FlingScroll.timer !== "undefined") clearInterval(jt_FlingScroll.timer);
		jt_FlingScroll.a = true;
		jt_FlingScroll.history[0].x = jt_.scrollLeft();
		jt_FlingScroll.history[0].y = jt_.scrollTop();
		jt_FlingScroll.idx = 1;
		jt_FlingScroll.w = false;
		jt_FlingScroll.ld = new Date();
		},
	onDrag: function() {
		jt_FlingScroll.history[jt_FlingScroll.idx].x = jt_.scrollLeft();
		jt_FlingScroll.history[jt_FlingScroll.idx].y = jt_.scrollTop();
		var now = new Date();
		jt_FlingScroll.history[jt_FlingScroll.idx].t = now - jt_FlingScroll.ld;
		jt_FlingScroll.ld = now;
		jt_FlingScroll.idx++;
		if (jt_FlingScroll.idx >= jt_FlingScroll.maxH) {
			jt_FlingScroll.idx = 0;
			jt_FlingScroll.w = true;
			}
		},
	up: function(ev) {
		var targ = ev.srcElement ? ev.srcElement : ((ev.type == "scroll") ? ev.currentTarget : ev.target); // fix for FF 2.0 event bug
		jt_.Trace.msg("targ.nodeName=" + targ.nodeName);
		if ( (targ.nodeName != 'A') && (targ.nodeName != 'BUTTON') ) {
			if (jt_FlingScroll.a) jt_FlingScroll.fling();
			jt_FlingScroll.a = false;
			}
		},
	fling: function() {
		var now = new Date();
		var tT = now - jt_FlingScroll.ld;
		var dX = 0;
		var dY = 0;
		var j = jt_FlingScroll.w ? jt_FlingScroll.idx : 0;
		for (var i=0; i<(jt_FlingScroll.w ? jt_FlingScroll.maxH : jt_FlingScroll.idx); i++) {
			if (i > 0) {
				var prevH = (j > 0) ? jt_FlingScroll.history[j-1] : jt_FlingScroll.history[jt_FlingScroll.maxH-1];
				var diffX = jt_FlingScroll.history[j].x - prevH.x;
				var diffY = jt_FlingScroll.history[j].y - prevH.y;
				dX += diffX;
				dY += diffY;
				tT += jt_FlingScroll.history[j].t;
				}
			j++;
			if (j >= jt_FlingScroll.maxH) j = 0;
			}
		if (tT > 0) {
			var decay = 0.8;
			var totX = 0;
			var totY = 0;
			var rX = dX/tT * 33;
			var rY = dY/tT * 33;
			var oX = jt_.scrollLeft();
			var oY = jt_.scrollTop();
			var lastX = null;
			var lastY = null;
			jt_FlingScroll.timer = setInterval(function() {
					totX += rX;
					totY += rY;
					var x = Math.round(oX + totX);
					var y = Math.round(oY + totY);
					if ((x <= 0) && (rX < 0)) {
						x = 0;
						rX = 0 - rX;
						}
					else if ((x + jt_.winW() >= document.body.scrollWidth) && (rX > 0)) {
						x = document.body.scrollWidth - jt_.winW();
						rX = 0 - rX;
						}
					if ((y <= 0) && (rY < 0)) {
						y = 0;
						rY = 0 - rY;
						}
					else if ((y + jt_.winH() >= document.body.scrollHeight) && (rY > 0)) {
						y = document.body.scrollHeight - jt_.winH();
						rY = 0 - rY;
						}
					window.scrollTo(x, y);
					if ((x == lastX) && (y == lastY)) clearInterval(jt_FlingScroll.timer);
					lastX = x;
					lastY = y;
					rX = decay * rX;
					rY = decay * rY;
					},
					33);
			}
		},
	idx: 0,
	ld: null,
	maxH: 5,
	w: false,
	a: false,
	history: null
}
