if (!mobileCheck() && $('.plan').length > 0) {
	var lock = 1,
		step = 0,
		planText = $('.plan__title'),
		planImage = $('.plan__image'),
		planContent = $('.plan'),
		otherContent = $('.js-content'),
		planAnchor = $('.plan__anchor'),
		header = $('.header'),
		_savedTextBlockHeight = 0;

	$('body').addClass('blocked');
	TweenMax.set(otherContent, {y:window.innerHeight});
	TweenMax.to(planText, 0.8, {opacity: 1, ease: Linear.easing});

	setTimeout(function() {lock = 0; step = 1;}, 1000);


	$('.plan__anchor').on('click',function (){
		event.preventDefault();
		var planIcons = $('.plan__image > svg');
		lock = 1;
		var e,
			windowHeight = window.innerHeight - header.outerHeight(),
			planTextHeight = planText.outerHeight(),
			planImageHeight = planImage.outerHeight(),
			planTextMargin = parseInt(planText.css("margin-top"), 10),
			planImageMargin = parseInt(planImage.css("margin-top"), 10);

		e = planImageHeight > windowHeight ? planTextHeight + planTextMargin : planTextHeight + planTextMargin - (windowHeight - (planImageHeight + planImageMargin)) / 2;
		_savedTextBlockHeight = e;


		TweenMax.to(planAnchor, 0.5, { alpha: 0, scale: 0 });
		TweenMax.to(planText, 0.2, { alpha: 0 }),
		TweenMax.to(planText, 0.4, { y: "-100%" }),
		TweenMax.to(planImage, 0.6, {
			y: "-".concat(e),
			clearProps: "all",
			ease: Power1.easeInOut,
			onComplete: function () {
				planText.hide();
				TweenMax.staggerFromTo(planIcons, 0.4, { alpha: 0, scale: 0.5 }, { alpha: 1, scale: 1, delay: 0.1, overwrite: !0, ease: Back.easeOut }, 0.05);
				setTimeout(function() {lock = 0; step++;}, 500);
			},
		});
	});



	eventDelay(window, 'mousewheel', function (down, up) {
		var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		var planIcons = $('.plan__image > svg');
		if (down && lock == 0 && scrollTop == 0){
			switch (step) {
				case 1:
					lock = 1;
					var e,
						windowHeight = window.innerHeight - header.outerHeight(),
						planTextHeight = planText.outerHeight(),
						planImageHeight = planImage.outerHeight(),
						planTextMargin = parseInt(planText.css("margin-top"), 10),
						planImageMargin = parseInt(planImage.css("margin-top"), 10);

					e = planImageHeight > windowHeight ? planTextHeight + planTextMargin : planTextHeight + planTextMargin - (windowHeight - (planImageHeight + planImageMargin)) / 2;
					_savedTextBlockHeight = e;


					TweenMax.to(planAnchor, 0.5, { alpha: 0, scale: 0 });
					TweenMax.to(planText, 0.2, { alpha: 0 }),
						TweenMax.to(planText, 0.4, { y: "-100%" }),
						TweenMax.to(planImage, 0.6, {
							y: "-".concat(e),
							clearProps: "all",
							ease: Power1.easeInOut,
							onComplete: function () {
								planText.hide();
								TweenMax.staggerFromTo(planIcons, 0.4, { alpha: 0, scale: 0.5 }, { alpha: 1, scale: 1, delay: 0.1, overwrite: !0, ease: Back.easeOut }, 0.05);
								setTimeout(function() {lock = 0; step++;}, 400);
							},
						});

					break;
				case 2:
					lock = 1;
					TweenMax.to(planContent, 0.8, {y: -1 * window.innerHeight, ease: Power1.easeOut,
						 onComplete: function () {
							planContent.hide();
						}
					});
					TweenMax.to(otherContent, 0.8,{y:0,  ease: Power1.easeOut, onComplete: function () {
							$('body').removeClass('blocked');
							lock = 0; step++;
						}
					});
					break;
				default:
					break;
			}
		} else  if (up && lock == 0 && scrollTop == 0){
			switch (step) {
				case 2:
					lock = 1;
					var e = _savedTextBlockHeight;
					TweenMax.fromTo(
						planImage,
						0.6,
						{ y: "-".concat(e) },
						{
							y: 0,
							clearProps: "all",
							onStart: function () {
								planText.show();
								TweenMax.fromTo(
									planText,
									0.4,
									{ y: "-200%", alpha: 0 },
									{
										y: "0%",
										alpha: 1,
										delay: 0.2,
										clearProps: "all",
										onComplete: function () {
											TweenMax.to(planAnchor, 0.5, { alpha: 1, scale: 1 });
											lock = 0; step--;
										},
									}
								);
								TweenMax.to(planIcons, 0.2, { alpha: 0, overwrite: !0 });
							},
						}
					);
					break;
				case 3:
					lock = 1;
					$('body').addClass('blocked');

					planContent.show();
					TweenMax.to(otherContent, 0.8,{y:window.innerHeight,  ease: Power1.easeOut,});
					TweenMax.to(planContent, 0.8,{y:0,  ease: Power1.easeOut, onComplete: function () {
							lock = 0; step--;
						}
					});
					break;
				default:
					break;
			}
		}

	}, 500);


	$(window).scroll(function (event) {
		var top = $(window).scrollTop();
		if(top == 0 && step < 3 && !$('body').hasClass('blocked')){
			$('body').addClass('blocked');
		}
	});




	function normalizeWheelSpeed(event) {
		var normalized;
		if (event.wheelDelta) {
			normalized = (event.wheelDelta % 120 - 0) == -0 ? event.wheelDelta / 120 : event.wheelDelta / 12;
		} else {
			var rawAmmount = event.deltaY ? event.deltaY : event.detail;
			normalized = -(rawAmmount % 3 ? rawAmmount * 10 : rawAmmount / 3);
		}
		return normalized;
	}

	function eventDelay(el, eventName, callback, delay) {
		var currentTime = (new Date()).getTime();
		var container = typeof el == 'object' ? $(el) : $(el);
		delay = delay || 1000;
		eventName = eventName || 'mousewheel';
		var block = false;
		if (eventName === 'mousewheel') {
			var indicator = new WheelIndicator({
				elem: document.querySelector('body'),
				preventMouse: false,
				callback: function(e){
					var nowTime = (new Date()).getTime();
					var diff = Math.abs((nowTime - currentTime) / delay);
					if (diff < 1) {
					} else {
						var up = e.direction == 'up';
						var down = e.direction == 'down';
						callback(down, up);
						currentTime = nowTime;
					}
				}
			});
		} else {
			container.on(eventName, function (event) {
				var nowTime = (new Date()).getTime();
				var diff = Math.abs((nowTime - currentTime) / delay);
				if (diff < 1.3) return;
				currentTime = nowTime;
				if (eventName == 'mousewheel') {
					var normalized = normalizeWheelSpeed(event)
					var down = normalized > 0;
					var up = normalized < 0;
					callback(down, up);
				} else if (eventName == 'keyup') {
					var normalized = event.keyCode
					var down = normalized == 40 || normalized == 39;
					var up = normalized == 38 || normalized == 37;
					callback(down, up);
				} else {
					callback();
				}
			});
		}

	}
}

function mobileCheck() {
	if (navigator.userAgent.match(/Android/i) ||
		navigator.userAgent.match(/webOS/i) ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i) ||
		navigator.userAgent.match(/iPod/i) ||
		navigator.userAgent.match(/BlackBerry/i) ||
		navigator.userAgent.match(/Windows Phone/i) ||
		navigator.userAgent.match(/Trident/i) ||
		$(window).width() < 992
	) {
		return true;
	} else {
		return false;
	}
}
