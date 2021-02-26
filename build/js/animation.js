var lock = 1,
	step = 0,
	planText = $('.plan__title'),
	planImage = $('.plan__image'),
	planContent = $('.plan'),
	otherContent = $('.js-content'),
	planAnchor = $('.plan__anchor'),
	_savedTextBlockHeight = 0;

$('body').addClass('blocked');
TweenMax.set(otherContent, {alpha: 0, webkitFilter:"blur(10px)"});
TweenMax.to(planText, 0.8, {opacity: 1, ease: Linear.easing});

setTimeout(function() {lock = 0; step = 1;}, 1000);


$('.plan__anchor').on('click',function (){
	event.preventDefault();
	var planIcons = $('.plan__image > svg');
	lock = 1;
	var e,
		windowHeight = window.innerHeight,
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
			lock = 0; step++;
		},
	});
});

$(window).on('wheel', function(e) {

	var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	var delta = e.originalEvent.deltaY;
	var planIcons = $('.plan__image > svg');
	if (delta > 0 && lock == 0 && scrollTop == 0) {

		switch (step) {
			case 1:
				lock = 1;
				var e,
					windowHeight = window.innerHeight,
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
						lock = 0; step++;
					},
				});

				break;
			case 2:
				lock = 1;
				TweenMax.to(planContent, 0.7,{height:0});
				TweenMax.to(otherContent, 0.9,{alpha:1, webkitFilter:"blur(0px)", onComplete: function () {
						$('body').removeClass('blocked');
						lock = 0; step++;
					}
				});
				break;
			default:
				break;
		}
	} else  if (delta < 0 && lock == 0 && scrollTop == 0){
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
						ease: Power1.easeInOut,
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

				TweenMax.to(otherContent, 0.7,{opacity:0, webkitFilter:"blur(10px)"});
				TweenMax.set(planContent, {height:"100vh"});
				TweenMax.from(planContent, 0.9,{height:0, onComplete: function () {
						lock = 0; step--;
					}
				});
				break;
			default:
				break;
		}
	}
});



$(window).scroll(function (event) {
	var top = $(window).scrollTop();
	if(top == 0 && step < 3 && !$('body').hasClass('blocked')){
		$('body').addClass('blocked');
	}
});



