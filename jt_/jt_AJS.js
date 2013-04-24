/**
 * jt_AJS.js - JavaScript Toolkit for AngularJS
 *
 * by Joseph Oster, wingo.com - http://www.wingo.com/jt_/
 */

angular.module('jt_AJS', [])

	.directive('repeatDone', function() {
		return function(scope, element, attrs) {
			if (scope.$last) { // all are rendered
				scope.$eval(attrs.repeatDone);
			}
		}
	})

	.directive('onEnter', function() {
		return function(scope, element, attrs) {
			element.on('keydown', function(event) {
				if (event.which === 13) {
					scope.$eval(attrs.onEnter);
				}
			})
		}
	})

	.directive('jtViewScroll', function() {
		return {
			scope: true,
			controller:function() {
			}
		}
	})

	.filter('strip_http', function() {
		return function(url) {
			var http = "http://";
			return (url.indexOf(http) == 0) ? url.substr(http.length) : url;
		}
	})
