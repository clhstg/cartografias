(function($) {
	'use strict';
	var CARTO = {
		nav: {
			sortable: function(){
				$('#maps_nav ul')
					.on('mousedown', 'li', function() {
						var width = $(this).outerWidth();
						$(this).parent().css({
							width: width
						});
					})
					.on('mouseup', 'li', function() {
						$(this).parent().css({
							width: 'auto'
						});
					})
					.sortable({
						handle: '.handle'
					});
			},
			select: function(){
				$('#maps_nav input').on('click', function(e){
					$(e.currentTarget).parent().parent().toggleClass('active');
					e.stopPropagation();
				});
			},
			filter: function() {
				$('#filter').on('click', function(el) {
					if (CARTO.nav.anySelected()) {
						$('#maps_nav').toggleClass('filtered');
						var new_text = $(el.currentTarget).find('span').text() === 'Filtrar' ? 'Ver todos' : 'Filtrar';
						$(el.currentTarget).find('span').text(new_text);
					} else {
						CARTO.nav.errorButton( $(e.currentTarget) );
					}
				});
			},
			append: function(target, appendTo) {
				var data = $(target).data(),
					json,
					html,
					i,
					separator;

				for (var key in data) {
					if( key === 'mapa' ){
						if( CARTO.preview.isAppended(key, data[key]) === false){
							$(appendTo).find('.'+key).append('<img src="'+data[key]+'">');
						}
					}
					else if( key === 'legendas' || key === 'relacionados' ){
						html = '';
						i = 0;
						if(key === 'legendas'){
							for (i in data[key]) {
								if( CARTO.preview.isAppended(key, data[key][i].url) === false){
									html += '<img src="' + data[key][i].url + '">';
								}
							}
						}
						else if(key === 'relacionados'){
							for (i in data[key]) {
								separator = '';
								if (i > 0) {
									separator = '<span> | </span>';
								}
								if( CARTO.preview.isAppended(key, data[key][i].url) === false){
									html += separator + '<a href="' + data[key][i].url + '">' + data[key][i].title + '</a>';
								}
							}
						}
						$(appendTo).find('.'+key).append(html);
					}
					else{
						if( CARTO.preview.isAppended(key, data[key]) === false){
							separator = $(appendTo).find('.'+key+' span').length > 0 ? '<span>, </span>' : '';
							$(appendTo).find('.'+key).append(separator+'<span>'+data[key]+'</span>');
						}
					}
				}

				if( $(appendTo).attr('id') === 'main' ){
					$('.heading .titulo').html( $('#main .titulo').text() );
				}
				CARTO.nav.scaleScale(appendTo);
			},
			scaleScale: function(target){
				var imgEl = target.find('.mapa img').eq(0)[0],
					imgNaturalWidth = imgEl.naturalWidth,
					imgClientWidth = imgEl.clientWidth,
					imgScaledTo = ((100 * imgClientWidth) / imgNaturalWidth) / 100,
					scaleEl = target.find('.escala')[0],
					scaleNaturalWidth = scaleEl.naturalWidth,
					scaleScale = parseInt(scaleNaturalWidth * imgScaledTo, 10);
				$(scaleEl).css({
					width: scaleScale + 'px'
				});
			},
			checkEmptyInfos: function() {
				$('.fonte, .elaboracao, .base').each(function(i, el) {
					if ($(el).find('a').length === 0 && $(el).find('span').length === 0) {
						$(el).addClass('hidden');
					} else {
						$(el).removeClass('hidden');
					}
				});
				if( $.trim( $('.relacionados').text() ) === 'Arquivos relacionados' ){
					$('.relacionados').addClass('hidden');
				} else {
					$('.relacionados').removeClass('hidden');
				}

			},
			showNav: function() {
				$('#maps_nav .toggle').on('click', function(el) {
					if ($('body').hasClass('show_map')) {
						$('.show_map').removeClass('show_map');
					}
				});
			},
			expand: {
				bind: function() {
					$('li').on('click', function(e) {
						var $target = $(e.currentTarget);
						$target.toggleClass('expanded');
						if (!$target.hasClass('injected')) {
							var $appendTo 	= $target.find('.more_info');
							CARTO.nav.append($target, $appendTo);
							$target.addClass('injected');
						}
					});
				}
			},
			anySelected: function() {
				return $('input:checked').length > 0;
			},
			errorButton: function(target){
				target.addClass('error');
				window.setTimeout(function() {
					$('#save').removeClass('error');
				}, 800);
			}
		},
		preview: {
			bind: function() {
				$('#preview').on('click', function(e) {
					if (CARTO.nav.anySelected()) {
						CARTO.preview.createMap();
						$('body').addClass('show_map');
						$('.expanded').removeClass('expanded');
						$('html, body').css({
							scrollTop: 0
						});
					} else {
						CARTO.nav.errorButton( $(e.currentTarget) );
					}
				});
			},
			createMap: function(){
				$('#main').find('img, span, a').remove();
				$('#maps_nav li.active').each(function(i, el){
					var dataTitulo = $(el).attr('data-titulo');
					CARTO.nav.append(el, $('#main'));
					$('#main .mapa img[data-titulo="'+dataTitulo+'"]').css({zIndex:-i});
				});
				CARTO.nav.checkEmptyInfos();
			},
			isAppended: function(key, data){
				var isAppended = false;
				if(key === 'mapa' || key === 'legendas'){
					isAppended = $('#main img[src="'+data+'"]').length !== 0;
				}
				else if(key === 'relacionados'){
					isAppended = $('#main a[href="'+data+'"]').length !== 0;
				}
				else{
					isAppended = $('#main span:contains("'+data+'")').length !== 0;
				}
				return isAppended;
			},
		},
		save: {
			bind: function() {
				$('.download .download_anchor').on('click', function(el) {
					var width = $(el.currentTarget).attr('data-width'),
						height = $(el.currentTarget).attr('data-height');
					CARTO.save.setup(width, height);
					var render = $('#print'),
						filename = CARTO.save.getFilename();

					html2canvas(render, {
						allowTaint: true,
						logging: true,
						width: width,
						height: height,
						onrendered: function(canvas) {
							var img = canvas.toDataURL('image/png');
							img = img.substr(img.indexOf(',') + 1).toString();
							$('<form id="save_file" method="post" action="' + carto.stylesheet_directory + '/lib/save_canvas.php"><input type="hidden" value="' + img + '" name="canvas"><input type="hidden" name="filename" value="' + filename + '"><input type="submit"></form>').appendTo('body');
							$('#save_file').submit();
							CARTO.save.cleanup();
						}
					});
					return false;
				});
			},
			setup: function(width, height) {
				$('<div id="print"></div>').appendTo('body');
				$('#main').clone().appendTo('#print');
				$('#print').css({
					width: width + 'px',
					height: height + 'px'
				});
				$('body').css({
					overflow: 'hidden'
				});
			},
			cleanup: function() {
				$('#print').remove();
				$('body').css({
					overflow: 'auto'
				});
				$('#save_file').remove();
			},
			getFilename: function() {
				var filename = '';
				$('#maps_nav li.active .text').each(function(i, el) {
					if (i !== 0) {
						filename += '-';
					}
					filename += $(el).text();
				});
				filename = filename.toLowerCase();
				filename = S(filename).latinise().s;
				return filename;
			}
		}
	};

	CARTO.nav.select();
	CARTO.nav.sortable();
	CARTO.nav.showNav();
	CARTO.nav.expand.bind();
	CARTO.preview.bind();
	CARTO.nav.filter();
	CARTO.save.bind();

})(jQuery);
