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

function getScrollbarWidth() {
	var block = $('<div>').css({'height':'50px','width':'50px'});
	var indicator = $('<div>').css({'height':'200px'});

	$('body').append(block.append(indicator));

	var w1 = $('div', block).innerWidth();
	block.css('overflow-y', 'scroll');

	var w2 = $('div', block).innerWidth();
	$(block).remove();

	return (w1 - w2);
}

$('.header').css({'width': 'calc(100vw - ' + getScrollbarWidth() + 'px)'});

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
	var isOpened = false;

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
		if ($(this).hasClass('menu-toggle--active')) {
			$(this).addClass('menu-toggle--close');
			$(this).removeClass('menu-toggle--active');

			setTimeout(function() {
				menuOpenBtn.removeClass('menu-toggle--close');
			}, 600)
		} else {
			$(this).addClass('menu-toggle--active');
		}

		if(isOpened) {
			body.removeClass('webpage--hidden');
			menu.fadeOut(DURATION);
			$('.dropdown').fadeOut(DURATION);

			$('.header').removeClass('header--menu-opened');
			isOpened = false;

		} else {
			setTimeout(function() {
				body.addClass('webpage--hidden');
			}, DURATION);


			$('.header').addClass('header--menu-opened');

			menu.fadeIn(DURATION);
			isOpened = true;
		}
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

	/*function closeMenu() {
		body.removeClass('webpage--hidden');
		menu.fadeOut(DURATION);
		menuCloseBtn.off('click', closeMenu);
		$('.dropdown').fadeOut(DURATION);
		$('.header').removeClass('header--menu-opened');
	}*/
})();

(function() {
	var lastId;
	var customersMenu = $('#customersMenu');
	var menuItems = customersMenu.find('a');
	var scrollItems = menuItems.map(function() {
		var item = $($(this).attr('href'));
		if (item.length) {
			return item;
		}
	});

	menuItems.click(function(e) {
		e.preventDefault();
		var href = $(this).attr('href'),
			offsetTop = href === '#' ? 0 : $(href).offset().top - 99;
		$('html, body').stop().animate({
			scrollTop: offsetTop
		}, 800);
		$(this).parent().addClass('customers__item--active').siblings().removeClass('customers__item--active');
	});

	$(window).on('scroll', function() {
		if (windowWidth >= 768) {
			var fromTop = $(this).scrollTop() + 100;
			var cur = scrollItems.map(function() {
				if ($(this).offset().top < fromTop)
					return this;
			});

			cur = cur[cur.length - 1];
			var id = cur && cur.length ? cur[0].id : '';

			if (lastId !== id) {
				lastId = id;
				menuItems.parent().removeClass('customers__item--active').end().filter('[href="#' + id + '"]').parent().addClass('customers__item--active');
			}
		}
	});
})();

/* sticky header */

/*(function() {
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
	var activeClass = 'accordion__item--active';
	var accordionItem = $('.accordion__item');
	var hideClass = 'accordion__item--hide';
	var moreBtn = $('.__js_faq-more')

	btn.on('click', function() {
		var parent = $(this).parent();

		if (parent.hasClass(activeClass)) {
			$(this).next().slideUp(DURATION);
			parent.removeClass(activeClass);
		} else {
			parent.addClass(activeClass).siblings().removeClass(activeClass).find('.accordion__item-text').slideUp(DURATION);
			$(this).next().slideDown(DURATION);
		}

	});

	moreBtn.on('click', function(evt) {
		evt.preventDefault();
		accordionItem.removeClass(hideClass);
		$(this).remove();
	})
})();

/* */

(function() {
	var items = $('.service-types__item');

	$(window).on('scroll', function() {
		if(windowWidth < mobileBreakpoint) {
			var scroll = $(window).scrollTop();

			items.each(function(){
				var offset = $(this).offset().top;
				var height = $(this).outerHeight();

				if (scroll + 100 >= offset && scroll < offset + height - 100) {
					$(this).addClass('hover');
				} else  {
					$(this).removeClass('hover');
				}
			});

		}
	});

	$(window).on('resize', function() {
		if(windowWidth >= mobileBreakpoint) {
			items.removeClass('hover');
		}
	})
})();

/* 16. Animation of statistics */
(function() {
	var facts = $('.facts');
	var numbers = $('.__js_number');
	var animationIsDone = false;
	var scroll = $(window).scrollTop() + $(window).height();

	if ($('*').is('.facts')) {
		var offset = facts.offset().top;

		if (!animationIsDone && scroll >= offset + 200) {
			animateNumbers();
		}

		$(window).on('scroll', function() {
			scroll = $(window).scrollTop() + $(window).height();

			if (!animationIsDone && scroll >= offset + 200) {
				animateNumbers();
			}
		});
	}

	function animateNumbers() {
		numbers.each(function() {
			var endValue = parseInt($(this).attr('data-end-value'), 10);

			$(this).easy_number_animate({
				start_value: 0,
				end_value: endValue,
				duration: 1500
			});

		});

		animationIsDone = true;
	}
})();

/* show bubble */
(function() {
	var showBubbleBtn = $('.__js_show-bubble');
	var bubbleClass = 'bubble--active';

	showBubbleBtn.on('click', function(evt) {
		evt.stopPropagation();
		var target = $(this).attr('data-target');

		$(target).fadeIn(DURATION).addClass(bubbleClass);

		body.one('click', function() {
			$(target).fadeOut(DURATION);
		});
	});

})();

/* Modal */
(function(){
	$(document).ready(function() {
		$(".fancybox").fancybox();

		$(".__js_service-modal").fancybox({
			smallBtn: false,
			toolbar: false

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
	}, 400);

	addMarker();

	function addMarker() {
		$.getJSON('data/plan.json', function (data) {
			var parent = $('.plan'),
				tar = parent.find('.plan__dots'),
				coords = data.coords;

			coords.forEach(function (elem, index) {
				var top = elem.top,
					left = elem.left;
				$('<svg data-index="' + index + '" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: scale(0);"><circle class="outer" cx="17" cy="17" r="17" fill="#677B83"/><circle cx="17" cy="17" r="5.1" fill="#F9F9F9"/></svg>').css({
					'margin-top': top+'%',
					'margin-left': left+'%'
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
		watchSlidesVisibility: true,
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

/* Suppliers logotips carousel */
(function (){
	var suppliersSection = $('.suppliers__section');

	suppliersSection.each(function(){
		var id = $(this).attr('id');
		var suppliersCarousel =  new Swiper('#' + id + ' .__js_suppliers-carousel', {
			slidesPerView: 2,
			spaceBetween: 14,
			speed: 300,
			loop: true,
			pagination: {
				el: '#' + id + ' .suppliers__paginate'
			},
			navigation: {
				prevEl: '#' + id + ' .slider__btn--prev',
				nextEl: '#' + id + ' .slider__btn--next'
			},
			breakpoints: {
					768: {
						slidesPerView: 3,
					},
					992: {
						slidesPerView: 4
					}
				}
		});
	});
})();

/* Advantages slider */
(function(){
	var advantagesSlider = undefined;

	if ($('.__js_advantages-slider').length > 0) {
		initAdvantagesSlider();

		$(window).resize(function () {
			initAdvantagesSlider();
		});
	}

	function initAdvantagesSlider() {
		if (window.matchMedia('(max-width: 991px)').matches && advantagesSlider == undefined) {
			advantagesSlider = new Swiper('.__js_advantages-slider', {
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
			parent.find('.form__field[data-disabled] .select2-selection--single').addClass('form__field--disabled');
			$('.select2-selection__rendered').text('Услуга:');
			$('#select_service').val(null);
		} else {
			parent.find('.form__field[data-disabled] .select2-selection--single').removeClass('form__field--disabled');
		}
	});
})();

/* Select */
(function(){
	var scrollOpt = {
		autohidemode: false,
		horizrailenabled:false,
		cursorcolor: "#01A5E4",
		cursorborder: "1px solid #01A5E4",
		cursorborderradius: "8px",
		cursorwidth: "2px"
	};

	$('#select_service').select2({
		dropdownPosition: 'below'
	}).on('select2:open', function () {
		$('.select2-results__options').niceScroll(scrollOpt);
		$('.select2-selection__rendered').text('Услуга:');
		$('.select2-selection__arrow b').addClass('rotate');
	}).on('select2:close', function () {
		$('.select2-selection__arrow b').removeClass('rotate');
	});
})();

(function() {
	var sections = $('.customers__section');

	var scrollOpt = {
		autohidemode: false,
		horizrailenabled:false,
		cursorcolor: "#01A5E4",
		cursorborder: "1px solid #01A5E4",
		cursorborderradius: "8px",
		cursorwidth: "2px"
	};

	$('.customers__select').select2({
		dropdownPosition: 'below',
		search: false
	}).on('select2:open', function () {
		$('.select2-results__options').niceScroll(scrollOpt);
		$('.select2-selection__arrow b').addClass('rotate');
	}).on('select2:close', function () {
		$('.select2-selection__arrow b').removeClass('rotate');
	});

	$('.customers__select').on('change', function() {
		var val = $(this).val();

		if (val === 'all') {
			sections.removeClass('hide');
		} else {
			sections.filter('#' + val).removeClass('hide').siblings().addClass('hide');
		}

	})

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
var lastScrollTopMargin = 300;
var lastSaved = 0;

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
			lastSaved = st - lastScrollTopMargin;
			$('.menu-toggle').blur();
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
			if (lastSaved >= st) {
				$('.header').addClass("active");
				$('.header').css('z-index', '9999');
				$('.header').removeClass("hidden");
			}
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

			if (current.$content){
				var currentH = $(current.$content).height();
				var totalH = $(current.$content).parent().height();
				if ((currentH+21+44) > (totalH + 44)){
					var top = ($(current.$content).parent().css('padding-top'));
					$('.fancy-button-close').css('top','-'+top);
				}

				var currentW = $(current.$content).width();
				var totalW = $(current.$content).parent().width();
				if ((currentW+65+65) > (totalW)){
					var right = (totalW-currentW)/2;
					$('.fancy-button-close').css('right','-'+right+'px');
				}
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
		//modal: true
		toolbar: false,
		smallBtn: false
	});
})();


/* Review */
(function(){
	$('.reviews__item img[data-bigimg]').on('click',function (){
		var bigimage = $(this).data('bigimg');
		var bigimage2x = $(this).data('bigimg-2x');

		if ($(window).width() >= 768){
			$('.reviews__right img').prop('src', bigimage).prop('srcset', bigimage2x);
		} else {
			$.fancybox.open([
				{
					src  : bigimage
				}
			]);
		}
	});

	$('.certificates__cats a').on('click',function (event){
		event.preventDefault();
		$(this).parent().toggleClass('cats-row-item--active');
		var types = [];
		$('.certificates__cats').find('.cats-row-item--active a').each(function (){
			var type = $(this).data('type');
			types.push(type);
		});

		//console.log($.inArray(1,types));
		//console.log($.inArray(2,types));
		//console.log($.inArray(3,types));

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

/* Production */
(function(){
	if ($('.__js_staff-slider').length){
		var staffSlider = new Swiper('.__js_staff-slider', {
			pagination: {
				el: '.production-staff__pagi'
			},
			navigation: {
				prevEl: '.production-staff__prev',
				nextEl: '.production-staff__next'
			},
			speed: 300,
			slidesPerView: 1,
			spaceBetween: 18,
			watchSlidesVisibility: true,
			loop: true,
			autoHeight: true,
			breakpoints: {
				992: {
					spaceBetween: 10,
				}
			}
		});
	}
	if ($('.__js_supp-slider').length){
		var suppSlider = new Swiper('.__js_supp-slider', {
			speed: 300,
			slidesPerView: 3,
			watchSlidesVisibility: true,
			spaceBetween: 0,
			breakpoints: {
				992: {
					slidesPerView: 4,
				}
			}
		});
	}
})();

(function () {

})();

/* Packery init */
(function(){
	$(window).on('load', function() {
		var select = $('.__js_filter-select');
		var filterItem = $('.filter__item');
		var filterItemAll = $('.filter__item[data-filter="*"]');
		var filterActiveClass = 'filter__item--active';

		var newsFilter = $('.__js_news-filter').isotope({
			itemSelector: '.news-page__item',
			layoutMode: 'packery',
			packery: {
				gutter: 0
			},
		});
		var projectsFilter = $('.__js_projects-filter').isotope({
			itemSelector: '.projects-page__item',
			layoutMode: 'packery',
			packery: {
				gutter: 10
			},
		});

		select.on('change', function () {
			var value = select.val();
			var filterValue = value !== '*' ? '.__js_' + value : value;

			if (value !== '*') {
				var filterValue = '.__js_' + value;
				filterItem.removeClass(filterActiveClass);
			} else {
				filterItemAll.addClass(filterActiveClass);
				var filterValue = value;
			}

			grid.isotope({ filter: filterValue });
		});

		filterItem.on('click', function() {
			var filterValue = $(this).attr('data-filter');

			$(this).addClass(filterActiveClass).siblings().removeClass(filterActiveClass);
			newsFilter.isotope({ filter: filterValue });
			projectsFilter.isotope({ filter: filterValue });
		});

		$('.__js_news-tag').on('click', function(evt) {
			evt.preventDefault();
			var filterValue = $(this).attr('data-filter');
			$('.filter__item[data-filter="' + filterValue + '"]').addClass(filterActiveClass).siblings().removeClass(filterActiveClass);
			newsFilter.isotope({ filter: filterValue });
		});


		var subPageURL = decodeURIComponent(window.location.search.substring(1));

		if (subPageURL.indexOf('filter') !== -1) {
			var num = subPageURL.slice(subPageURL.indexOf('=') + 1);
			$('.filter__item[data-filter=".__js_' + num + '"]').addClass(filterActiveClass).siblings().removeClass(filterActiveClass);
			newsFilter.isotope({ filter: '.__js_' + num });
		}
	});

})();


(function() {
	let words = document.querySelectorAll('.__js_word');

	let abc = {
		'A': 0,
		'B': 184/1462,
		'C': 119/1503,
		'D': 184/1462,
		'E': 184/1462,
		'F': 184/1462,
		'G': 119/1503,
		'H': 184/1462,
		'I': 184/1462,
		'J': -152/1892,
		'K': 184/1462,
		'L': 184/1462,
		'M': 184/1462,
		'N': 184/1462,
		'O': 119/1505,
		'P': 184/1462,
		'Q': 119/1833,
		'R': 184/1462,
		'S': 94/1503,
		'T': 41/1462,
		'U': 174/1462,
		'V': 0,
		'W': 0,
		'X': 0,
		'Y': 0,
		'Z': 49/1462,
		'a': 86/1161,
		'b': 160/1576,
		'c': 92/1159,
		'd': 92/1576,
		'e': 92/1159,
		'f': 41/1567,
		'g': 6/1631,
		'h': 160/1556,
		'i': 147/1556,
		'j': -131/2048,
		'k': 160/1556,
		'l': 160/1556,
		'm': 160/1139,
		'n': 160/1139,
		'o': 92/1159,
		'p': 160/1631,
		'q': 92/1631,
		'r': 160/1139,
		's': 92/1159,
		't': 47/1376,
		'u': 154/1138,
		'v': 0,
		'w': 20/1118,
		'x': 10/1118,
		'y': 0,
		'z': 55/1118,
		'0': 74/1505,
		'1': 121/1462,
		'2': 78/1483,
		'3': 78/1503,
		'4': 35/1462,
		'5': 100/1482,
		'6': 72/1499,
		'7': 50/1460,
		'8': 72/1501,
		'9': 66/1499,
		'А': 0,
 'Б': 184/1462,
 'В': 184/1462,
 'Г': 184/1462,
 'Д': 10/1462,
 'Е': 184/1462,
 'Ё': 184/1878,
 'Ж': 0,
 'З': 94/1503,
 'И': 184/1462,
 'Й': 184/1462,
 'К': 184/1462,
 'Л': 16/1482,
 'М': 184/1462,
 'Н': 184/1462,
 'О': 119/1505,
 'П': 184/1462,
 'Р': 184/1462,
 'С': 119/1503,
 'Т': 41/1462,
 'У': 0,
 'Ф': 92/1503,
 'Х': 0,
 'Ц': 184/1888,
 'Ч': 109/1462,
 'Ш': 184/1462,
 'Щ': 184/1888,
 'Ъ': 0,
 'Ы': 184/1462,
 'Ь': 184/1462,
 'Э': 72/1503,
 'Ю': 184/1505,
 'Я': -10/1462,
 'а': 86/1161,
 'б': 92/1593,
 'в': 160/1118,
 'г': 160/1118,
 'д': 29/1519,
 'е': 92/1159,
 'ё': 92/1560,
 'ж': 0,
 'з': 78/1159,
 'и': 160/1118,
 'й': 160/1118,
 'к': 160/1118,
 'л': 0,
 'м': 160/1118,
 'н': 160/1118,
 'о': 92/1159,
 'п': 160/1118,
 'р': 160/1613,
 'с': 92/1159,
 'т': 47/1118,
 'у': 0,
 'ф': 92/2048,
 'х': 10/1118,
 'ц': 160/1519,
 'ч': 123/1118,
 'ш': 160/1118,
 'щ': 160/1519,
 'ъ': 0,
 'ы': 160/1118,
 'ь': 160/1118,
 'э': 74/1159,
 'ю': 160/1159,
 'я': 0
 };

	if (words && windowWidth >= 768) {
		setIndent()
	}

	$(window).on('resize', function() {
		if (words.length && windowWidth >= 768) {
			setIndent();
		} else {
			words.forEach(function(item) {
				item.removeAttribute('style')
				item.innerHTML = item.getAttribute('data-content');
			});
		}
	})

	function setIndent() {
		words.forEach(function(item) {
			let itemStyles = window.getComputedStyle(item, null);
			let lh = Math.round(parseFloat(itemStyles.getPropertyValue('line-height')));
			let height = item.clientHeight - parseInt(itemStyles.getPropertyValue('padding-top'), 10) - parseInt(itemStyles.getPropertyValue('padding-bottom'), 10);

			item.setAttribute('data-content', item.textContent);

			if (height / lh < 2) {
				qqq(item);
			} else {
				magic(item);
			}
		})

		function qqq(it) {
			let fz = parseInt(window.getComputedStyle(it, null).getPropertyValue('font-size'), 10);
			let realSize = fz - ((fz / 100) * 28);
			let key = it.textContent[0];

			if(abc[key]) {
				let indent = realSize * abc[key];
				it.style.textIndent =  -indent + 'px';
			}
		}

		function magic(el) {
			let tmp = document.createElement('p');
			tmp = el.cloneNode(true);
			tmp.style.width = el.offsetWidth + 'px';
			tmp.style.position = 'absolute';
			tmp.style.left = '-2000px';
			tmp.innerHTML = 'foo';
			document.body.appendChild(tmp);

			let content = el.textContent.split(''),
					oneLineHeight = tmp.scrollHeight,
					lines = [],
					i = 0;

					let fz2 = parseInt(window.getComputedStyle(el, null).getPropertyValue('font-size'), 10);

			while (i < content.length) {
				let line = tmp.innerHTML = '';

				while (i < content.length && tmp.scrollHeight <= oneLineHeight) {
					tmp.innerHTML = line += content[i++];
				}

				let lineEndIndex = i === content.length ? i : line.lastIndexOf(' ') + 1;
				lines.push( content.splice(0, lineEndIndex).join('') );
				i = 0;
			}
			tmp.remove();
			el.innerHTML = lines.map(function(line) {
				let fz2 = parseInt(window.getComputedStyle(el, null).getPropertyValue('font-size'), 10);

				let realSize = fz2 - ((fz2 / 100) * 28);
				let key = line[0];

				return abc[key] ? '<span style="display: inline-block; transform: translateX(' + -(realSize * abc[key]) + 'px)">' + line + '</span>' : '<span>' + line + '</span>';

			}).join('');
		}
	}



	//console.log(abc[key]);
})();
