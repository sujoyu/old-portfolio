import 'script-loader!easeljs/lib/easeljs'
import animate from './main';

document.addEventListener('DOMContentLoaded', () => {

	$('#navigation').find('a').click(function() {
		var id = $(this).attr('href');
		console.log($(id).offset().top)
		$('body').animate({scrollTop:$(id).find('h2').offset().top});
	});

	// メールスパマー対策
	setTimeout(function() {
		var encoded = 'vyou}7wz|yxPxt}Dz';
		var offset = 3;
		var decoded = Array.prototype.map.call(encoded, function(c, i) {
			return String.fromCharCode(c.charCodeAt(0) - offset - i);
		}).join('');

		$('#contact').html($('<a></a>')
			.addClass('grey-text text-lighten-3')
			.attr('href', 'mailto:' + decoded)
			.text(decoded));
	}, 5000)

	animate(document, window, 'main-contents');
})