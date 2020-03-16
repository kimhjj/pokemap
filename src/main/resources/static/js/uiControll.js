(function($){
	$.fn.extend({
		// 화면 중앙 배치
		center: function () {
			return this.each(function() {
				var top = ($(window).height() - $(this).outerHeight()) / 2;
				var left = ($(window).width() - $(this).outerWidth()) / 2;
			$(this).offset({top: (top > 0 ? top : 0), left: (left > 0 ? left : 0)});
			});
		},
		openPopup: function() {
			$('html, body').css({'overflow': 'hidden', 'height': '100%'});
			$(this).show();
			$('.popup-content', this).center();
		},
		closePopup: function() {
			$('html, body').css({'overflow': 'auto', 'height': 'unset'});
			$(this).hide();
			$('.popup-content input', this).val('');
		}
	});
})(jQuery);
