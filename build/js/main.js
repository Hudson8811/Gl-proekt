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
		body.addClass('webpage--hidden');
		menu.fadeIn(DURATION);
		menuCloseBtn.on('click', closeMenu);
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

	function closeMenu() {
		body.removeClass('webpage--hidden');
		menu.fadeOut(DURATION);
		menuCloseBtn.off('click', closeMenu);
		$('.dropdown').fadeOut(DURATION);
	}
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
