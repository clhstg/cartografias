<?php
/**
 * Cartografias custom functions
 *
 * @package cartografias
 */

/**
 * Loads fonts async
 */
function cartografias_load_fonts() {
	?>
	<script>
	(function(){
	    function addFont() {
	        var style = document.createElement('style');
	        style.rel = 'stylesheet';
	        document.head.appendChild(style);
	        style.textContent = localStorage.notoSansRegular;
	    }
	    try {
	        if (localStorage.notoSansRegular) {
	            addFont();
	        } else {
	            var request = new XMLHttpRequest();
	            request.open('GET', '<?php print get_template_directory_uri(); ?>/assets/styles/noto_sans_regular.woff.css', true);

	            request.onload = function() {
	                if (request.status >= 200 && request.status < 400) {
	                    localStorage.notoSansRegular = request.responseText;
	                    addFont();
	                }
	            }

	            request.send();
	        }
	    } catch(ex) {

	    }
	}());
	</script>
	<?php
}
add_action('wp_head', 'cartografias_load_fonts');

/**
 * Enqueue scripts
 */
function cartografias_localize_vars() {
    return array(
        'stylesheet_directory' => get_stylesheet_directory_uri()
    );
}
function cartografias_scripts() {
	wp_enqueue_style( 'cartografias_theme-style', get_stylesheet_uri() );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	if ( !is_admin() ) {
		wp_enqueue_script( 'jquery' );
		wp_enqueue_script( 'customplugins', get_template_directory_uri() . '/assets/js/plugins.min.js', array('jquery'), NULL, true );
		wp_enqueue_script( 'customscripts', get_template_directory_uri() . '/assets/js/main.min.js', array('jquery'), NULL, true );
		wp_localize_script( 'customscripts', 'carto', cartografias_localize_vars() );
	}
}
add_action( 'wp_enqueue_scripts', 'cartografias_scripts' );

/**
 * Remove query strings
 */
function cartografias_remove_script_version( $src ){
	$parts = explode( '?ver', $src );
	return $parts[0];
}
add_filter( 'script_loader_src', 'cartografias_remove_script_version', 15, 1 );
add_filter( 'style_loader_src', 'cartografias_remove_script_version', 15, 1 );

	// Clean up the head
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'wlwmanifest_link' );
	remove_action( 'wp_head', 'wp_generator' );
	remove_action( 'wp_head', 'wp_shortlink_wp_head' );