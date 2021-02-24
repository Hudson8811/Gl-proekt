'use strict';

var body = $('body');
var DURATION = 300;
var mobileBreakpoint = 992;
var windowWidth = $(window).width();

function setOverlay(cb) {
	var overlay = $('<div class="overlay"></div>');
	overlay.on('click', cb);
	return overlay;
}

/* site menu */
(function () {
	var menu = $('.__js_menu');
	var menuOpenBtn = $('.__js_menu-open');
	var menuCloseBtn = menu.find('.__js_menu-close');
	var backToMenuBtn = menu.find('.__js_back-to-menu');

	var dropdownLink = menu.find('.__js_dropdown-link');

	menuOpenBtn.on('click', function() {
		menu.fadeIn(DURATION);
		menuCloseBtn.on('click', closeMenu);
	});

	dropdownLink.on('click', function(evt) {
		if (windowWidth < mobileBreakpoint) {
			evt.preventDefault();

			var target = $(this).attr('data-target');

			$(target).fadeIn(DURATION);
		}
	});

	function closeMenu() {
		menu.fadeOut(DURATION);
		menuCloseBtn.off('click', closeMenu);
	}

	function closeDropdown(target, btn) {
		target.fadeOut(DURATION);
		btn.off('click', closeDropdown);
	}
})();


/* Modal */
(function(){
	$(document).ready(function() {
		$(".fancybox").fancybox();
	});
})();
