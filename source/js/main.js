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
	var dropdownLink = menu.find('.__js_dropdown-link');
	var menuLink = menu.find('.navigation__link');
	var inner = menu.find('.menu__inner');
	var dropdown = menu.find('.dropdown');
	var isMoved = false;
	var activeDropdownId;

	if (windowWidth >= mobileBreakpoint && !isMoved) {
		menu.append(dropdown);
		isMoved = true;
	}

	$(window).on('resize', function() {
		windowWidth = $(window).width();

		if (windowWidth >= mobileBreakpoint && !isMoved) {
			menu.append(dropdown);
			isMoved = true;
		} else if (windowWidth < mobileBreakpoint && isMoved) {
			dropdown.each(function() {
				var id = '#' + $(this).attr('id');
				var link = menu.find('a[data-target="' + id + '"]');
				var parrent = link.parent();
				parrent.append($(this));
			});
			isMoved = false;
		}
	});

	menuOpenBtn.on('click', function() {
		menu.fadeIn(DURATION);
		menuCloseBtn.on('click', closeMenu);
		$('.header').addClass('hidden');
		$('.header').removeClass('active');
	});

	dropdownLink.on('click', function(evt) {
		if (windowWidth < mobileBreakpoint) {
			evt.preventDefault();

			var target = $(this).attr('data-target');
			var currentDropdown = $(target);
			var backToMenuBtn = currentDropdown.find('.__js_back-to-menu');

			currentDropdown.fadeIn(DURATION);
			backToMenuBtn.on('click', closeDropdown);
		}

		function closeDropdown(target, btn) {
			currentDropdown.fadeOut(DURATION);
			backToMenuBtn.off('click', closeDropdown);
		}
	});
/*
	dropdownLink.on('mouseover focus', function() {
		if (windowWidth >= mobileBreakpoint && isMoved) {
			$('.dropdown').hide();
			var targetId = $(this).attr('data-target');
			var dropdown = $(targetId);
			dropdown.fadeIn(DURATION);
			dropdown.on('mouseover', function () {}, function (){
				$('.menu__nav').on('mouseover', function (){
					hideDropdown();
					$('.menu__nav').off();
				});
				dropdown.off();
			});
		}
		function hideDropdown() {
			dropdown.fadeOut(DURATION);
		}
	});
*/
	menuLink.on('mouseover focus', function() {
		$('.dropdown').hide();
		/*if(activeDropdownId !== '#' + $(this).attr('data-target')) {
			$('.dropdown').hide();
		}*/

		//var flag = ($(this).hasClass('__js_dropdown-link') && !$(this).hasClass('__js_active'));

		if (windowWidth >= mobileBreakpoint && isMoved /*&& flag*/) {
			//var thisLink = $(this);

			var targetId = $(this).attr('data-target');
			var dropdown = $(targetId);
			dropdown.fadeIn(DURATION);

			//activeDropdownId = targetId;

			dropdown.on('mouseover', function () {}, function (){
				$('.menu__nav').on('mouseover', function (){
					hideDropdown();
					$('.menu__nav').off();
				});
				dropdown.off();
			});

			//if (activeDropdownId === targetId) {}
		}

		function hideDropdown() {
			dropdown.fadeOut(DURATION);
			//thisLink.removeClass('__js_active');
		}
	});
	function closeMenu() {
		menu.fadeOut(DURATION);
		menuCloseBtn.off('click', closeMenu);
		//body.css('overflow', 'auto');
		$('.dropdown').fadeOut(DURATION);
		//menuLink.removeClass('__js_active');
	}
})();

/* sticky header */
/*
(function() {
	var lastScrollTop = 0;
	var header = $('#header');
	var isRemoveFixed = false;

	$(window).scroll(function(event) {
		var st = $(this).scrollTop();
		var offset = header.innerHeight();

		if (st < lastScrollTop) {
			if (st !== 0) {
				header.addClass("header--fixed").css('top', -offset + 'px');
				body.css('padding-top', offset + 'px');
				isRemoveFixed = false;
			} else {
				header.removeClass("header--fixed").removeAttr('style');
				body.css('padding-top', 0);
				isRemoveFixed = true;
			}
		} else {
			if (!isRemoveFixed) {
				header.css('transform', 'translateY(0)');

				setTimeout(function() {
					header.removeClass("header--fixed").removeAttr('style');
					body.css('padding-top', 0);
				}, DURATION);

				isRemoveFixed = true;
			}

		}

		lastScrollTop = st;
	});

	$(window).on('resize', function() {
		//offset = header.innerHeight();
	});
})();*/

/* accordion */
(function () {
	var btn = $('.__js_accordion-btn');

	btn.on('click', function() {
		var parent = $(this).parent();
		parent.siblings().find('.accordion__item-text').slideUp(DURATION);
		$(this).next().slideDown(DURATION);
	});
})();

/* Modal */
(function(){
	$(document).ready(function() {
		$(".fancybox").fancybox();

		$(".__js_service-modal").fancybox({
			maxWidth: 848,
			maxHeight: 600,
			padding: 0,
			//fitToView: false,
			width	: '90%',
			height: '90%',
			//autoSize: false,
			//closeClick: false,
			closeBtn: false,
			modal: true

		});

		$('.__js_fancybox-close').on('click', function() {
			$.fancybox.close();
		});
	});



})();

/* Plan markers */
(function(){

	setTimeout(function () {
		showPlanDetail();
	}, 700);

	addMarker();

	function addMarker() {
		$.getJSON('data/plan.json', function (data) {
			var parent = $('.plan'),
				tar = parent.find('.plan__image'),
				coords = data.coords;

			coords.forEach(function (elem, index) {
				var top = elem.top,
					left = elem.left;

				$('<svg data-index="' + index + '" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: scale(0);"><circle class="outer" cx="17" cy="17" r="17" fill="#677B83"/><circle cx="17" cy="17" r="5.1" fill="#F9F9F9"/></svg>').css({
					top: top + '%',
					left: left + '%'
				}).appendTo(tar);
			});
		});
	}

	function showPlanDetail() {
		var parent = $('.plan'),
			markers = parent.find('.plan__image svg'),
			canvas = document.querySelector('.plan__image'),
			anchor = parent.find('.plan__anchor'),
			caption = parent.find('.plan__caption'),
			bg = parent.find('.plan__wrapper');

		markers.click(function (e) {
			var that = $(this),
					tar = canvas.getBoundingClientRect(),

					newX = ($(window).width() - (((e.clientX - tar.left) - caption.outerWidth() / 2) + caption.outerWidth()) < 0) ?
						$(window).width() - caption.outerWidth() :
						((e.clientX - tar.left) - caption.outerWidth() / 2),

					newY = (canvas.clientHeight - ((e.clientY - tar.top) + caption.outerHeight()) < 0) ?
						canvas.clientHeight - caption.outerHeight() :
						e.clientY;

			$.getJSON('data/plan.json', function (data) {
				var content = data.content,
					curContent = content[that.attr('data-index')],
					card = $('.plan-card');

				card.find('img').attr('src', curContent.img);
				card.find('.plan-card__digit').text(curContent.digit);
				card.find('.plan-card__link').attr('href', curContent.href);
				card.find('.plan-card__link span').text(curContent.title);
				card.find('.plan-card__date').text(curContent.date);
			});

			markers.fadeOut(300);
			anchor.fadeOut(300);

			// Set caption position
			caption.css({
				'left': newX,
				'top': newY
			});

			setTimeout(function () {
				bg.addClass('inactive');
			}, 300);

			setTimeout(function () {
				caption.fadeIn(300);
			}, 600);
		});

		$(document).mouseup(function (e) {
			if ($('.plan .plan__caption').is(':visible')) {
				if (!caption.is(e.target) && caption.has(e.target).length === 0) {
					caption.fadeOut(300);
					bg.removeClass('inactive');
					markers.fadeIn(300);
					anchor.fadeIn(300);
				}
			}
		});
	}
})();

/* Services slider */
(function(){
	if ($('.__js_services-slider').length > 0 ) {
		var servicesSlider = new Swiper('.__js_services-slider', {
			pagination: {
				el: '.services-slider-pagi'
			},
			navigation: {
				prevEl: '.services-slider-prev',
				nextEl: '.services-slider-next'
			},
			speed: 300,
			loop: true,
			loopedSlides: 7,
			autoHeight: true
		});

		var servicesThumbs = new Swiper('.__js_services-thumbs', {
			slideToClickedSlide: true,
			loop: true,
			loopedSlides: 7,
			slidesPerView: 'auto',
			spaceBetween: 15,
			allowTouchMove: false,
			breakpoints: {
				992: {
					spaceBetween: 0
				}
			}
		});

		servicesSlider.controller.control = servicesThumbs;
		servicesThumbs.controller.control = servicesSlider;
	}
})();

/* Application section carousel */
(function() {
	var carousel = new Swiper('.__js_application-section-carousel', {
		slidesPerView: 'auto',
		spaceBetween: 15,
		speed: 300,
		loop: true,
		pagination: {
			el: '.application-section__paginate'
		},
		navigation: {
			prevEl: '.slider__btn--prev',
			nextEl: '.slider__btn--next'
		},
	});
})();

/* We use logo carousel */
(function() {
	var carousel = new Swiper('.__js_we-use-carousel', {
		slidesPerView: 'auto',
		spaceBetween: 15,
		speed: 300,
		loop: true,
		pagination: {
			el: '.we-use__paginate'
		},
		navigation: {
			prevEl: '.slider__btn--prev',
			nextEl: '.slider__btn--next'
		},
	});
})();

/* Advantages slider */
(function(){
	var advantagesSlider = undefined;

	if ($('.__js_advantages-slider').length > 0) {
		$(window).resize(function () {
			initAdvantagesSlider();
		});
	}

	function initAdvantagesSlider() {
		if (window.matchMedia('(max-width: 991px)').matches && advantagesSlider == undefined) {
			var advantagesSlider = new Swiper('.__js_advantages-slider', {
				pagination: {
					el: '.advantages-pagi'
				},
				navigation: {
					prevEl: '.advantages-prev',
					nextEl: '.advantages-next'
				},
				speed: 300,
				slidesPerView: 'auto',
				spaceBetween: 40,
				loop: true
			});
		} else if (window.matchMedia('(min-width: 992px)').matches && advantagesSlider != undefined) {
			advantagesSlider.destroy();
			advantagesSlider = undefined;
		}
	}
})();

/* Projects slider */
(function(){
	var projectsSlider = new Swiper('.__js_projects-slider', {
		pagination: {
			el: '.projects-pagi'
		},
		navigation: {
			prevEl: '.projects-prev',
			nextEl: '.projects-next'
		},
		speed: 300,
		slidesPerView: 'auto',
		watchSlidesVisibility: true,
		spaceBetween: 15,
		loop: true,
		breakpoints: {
			992: {
				spaceBetween: 10,
			}
		}
	});
})();

/* Clients slider */
(function(){
	var projectsSlider = new Swiper('.__js_clients-slider', {
		pagination: {
			el: '.clients-pagi'
		},
		navigation: {
			prevEl: '.clients-prev',
			nextEl: '.clients-next'
		},
		speed: 300,
		slidesPerView: 'auto',
		slidesPerColumn: 2,
		watchSlidesVisibility: true,
		spaceBetween: 15,
		slidesPerColumnFill: 'column',
		breakpoints: {
			992: {
				slidesPerColumn: 3,
			}
		}
	});
})();

/* News slider */
(function(){
	var projectsSlider = new Swiper('.__js_news-slider', {
		pagination: {
			el: '.news-pagi'
		},
		navigation: {
			prevEl: '.news-prev',
			nextEl: '.news-next'
		},
		speed: 300,
		slidesPerView: 'auto',
		spaceBetween: 18,
		watchSlidesVisibility: true,
		loop: true,
		breakpoints: {
			992: {
				spaceBetween: 10,
			}
		}
	});
})();

/* Form */
(function(){
	var parent = $('.form'),
			changedField = parent.find('.form__field[data-change]');

	parent.find('.form__type input').change(function () {
		if ($(this).val() === '2' && $(this).prop('checked')) {
			changedField.find('input').prop('disabled',true);
			TweenMax.to(changedField, 0.2, { width: 0, opacity: 0,  clearProps: "all",  onComplete: function () {
					changedField.hide();
					parent.find('.form__field--change').addClass('form__field--full');
				}
			});
		} else {
			parent.find('.form__field--change').removeClass('form__field--full');
			changedField.show();
			TweenMax.from(changedField, 0.2, {width: 0, opacity: 0,onComplete: function () {
					changedField.find('input').prop('disabled',false);
				}
			});
		}
	});

	parent.find('.field--switch input').change(function () {
		if ($(this).prop('checked')) {
			parent.find('.form__field[data-disabled] .chosen-container').addClass('form__field--disabled');
		} else {
			parent.find('.form__field[data-disabled] .chosen-container').removeClass('form__field--disabled');
		}
	});
})();

/* Select */
(function(){
	$('.select').chosen({
		width: '100%',
		no_results_text: 'Совпадений не найдено',
		placeholder_text_single: 'Услуга: ',
	}).on('chosen:showing_dropdown', function (evt, params) {
		$('.chosen-single span').text('Услуга:');
		$('.chosen-single div').addClass('rotate');
	}).on('chosen:hiding_dropdown', function (evt, params) {
		$('.chosen-single div').removeClass('rotate');
	});

	var scrollOpt = {
		autohidemode: false,
		horizrailenabled:false,
		cursorcolor: "#01A5E4",
		cursorborder: "1px solid #01A5E4",
		cursorborderradius: "8px",
		cursorwidth: "2px"
	};

	$('.chosen-results').niceScroll(scrollOpt);
})();

/* Services accordion */
(function(){
	var parent = $('.service-section');

	if (window.matchMedia('(max-width: 991px)').matches) {
		parent.find('.service-section__title').click(function (e) {
			e.preventDefault();
			$(this).toggleClass('open').next().slideToggle(300);
		});
	}
})();


/* Header */
var lastScrollTop = 0;
$(window).scroll(function(event) {
	var offset = $('.header').outerHeight();
	var st = $(this).scrollTop();
	if(st == 0) {
		$('.header').removeClass("active");
		$('.header').css('z-index', '9999');
		$('.header').removeClass("hidden");
	}
	else {
		if(st > lastScrollTop) {
			if($(window).scrollTop() > offset && !$(body).hasClass('blocked')) {
				if($('.header').hasClass("active")) {
					$('.header').addClass("active");
					$('.header').css('z-index', '9999');
					$('.header').addClass("hidden");
				}
				else {
					$('.header').addClass("hidden");
				}
			}
			else {
				$('.header').removeClass("active");
				$('.header').css('z-index', '9999');
				if ($('.plan').length > 0) {
					$('.header').addClass("hidden");
				} else {
					$('.header').removeClass("hidden");
				}
			}
		}
		else {
			$('.header').addClass("active");
			$('.header').css('z-index', '9999');
			$('.header').removeClass("hidden");
		}
	}
	lastScrollTop = st;
});

/* Gallery */
(function(){
	if (!$.fancybox.isMobile ){
		var updatefc  = function(instance, current) {
			var $fc = current.$fc;
			if ($fc && $fc.length) {
				current.$slide.css('display', 'block');
				$.fancybox.setTranslate(current.$content, instance.getFitPos(current));
				var fcHeight = $fc.outerHeight(true);
				if (fcHeight) {
					current.$slide.css('padding-bottom', fcHeight);
					$.fancybox.setTranslate(current.$content, instance.getFitPos(current));
				}
				current.$slide.css('display', '');
			}
		}

		$('[data-fancybox="project"]').fancybox({
			infobar : false,
			toolbar : false,
			buttons : false,
			arrows : false,
			loop : true,
			caption: $.noop,
			afterLoad : function(instance, current) {
				if ( instance.group.length > 1 && current.$content ) {
					current.$content.append('<a data-fancybox-next class="fancy-button-next" href="javascript:;"><svg width="16" height="29"><use xlink:href="#fancy-arrow-r"></use></svg></a><a data-fancybox-prev class="fancy-button-previous" href="javascript:;"><svg width="16" height="29"><use xlink:href="#fancy-arrow"></use></svg></a>');
				}
				current.$content.append('<a data-fancybox-close class="fancy-button-close" href="javascript:;"><svg width="27" height="27"><use xlink:href="#close"></use></svg></a>');

				current.$fc = $('<div class="fc-caption"><span>' + current.opts.$orig.data('caption') + '<span></div>').appendTo(current.$content);
				updatefc(instance, current);
			},
			onUpdate(instance, current) {
				updatefc(instance, current);
			}
		});
	}
})();


/* Contacts */
(function(){
	$('input[name="contact_type"]').on('change',function (){
		var id = $(this).val();
		$('.contacts__bottom').removeClass('contacts__bottom--active');
		$('.contacts__bottom[data-id="'+id+'"]').addClass('contacts__bottom--active');
	});
})();


/* Office */
(function(){
	var updatefc  = function(instance, current) {
		var $fc = current.$fc;
		if ($fc && $fc.length) {
			current.$slide.css('display', 'block');
			$.fancybox.setTranslate(current.$content, instance.getFitPos(current));
			var fcHeight = $fc.outerHeight(true);
			if (fcHeight) {
				current.$slide.css('padding-bottom', fcHeight);
				$.fancybox.setTranslate(current.$content, instance.getFitPos(current));
			}
			current.$slide.css('display', '');
		}
	}
	$('.office-staf [data-fancybox]').fancybox({
		modal: true
	});
})();


/* Review */
(function(){
	$('.reviews__item img[data-bigimg]').on('click',function (){
		var bigimage = $(this).data('bigimg');
		if ($(window).width() >= 768){
			$('.reviews__right img').prop('src',bigimage);
		} else {
			$.fancybox.open([
				{
					src  : bigimage
				}
			]);
		}
	});

	$('.certificates__cats a').on('click',function (){
		event.preventDefault();
		$(this).parent().toggleClass('cats-row-item--active');
		var types = [];
		$('.certificates__cats').find('.cats-row-item--active a').each(function (){
			var type = $(this).data('type');
			types.push(type);
		});

		console.log($.inArray(1,types));
		console.log($.inArray(2,types));
		console.log($.inArray(3,types));
		if (types.length){
			$('.reviews__item').each(function (){
				if ($.inArray($(this).data('type'),types) === -1){
					$(this).addClass('reviews__item--hide');
				} else {
					$(this).removeClass('reviews__item--hide');
				}
			});
		} else {
			$('.reviews__item').removeClass('reviews__item--hide');
		}
	});



})();
