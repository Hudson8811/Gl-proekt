'use strict';

var body = $('body');
var DURATION = 300;
var mobileBreakpoint = 992;

function setOverlay(cb) {
	var overlay = $('<div class="overlay"></div>');
	overlay.on('click', cb);
	return overlay;
}


/* Modal */
(function(){
	$(document).ready(function() {
		$(".fancybox").fancybox();
	});
})();
