<?php
/*
Plugin Name: Maps post type for Cartografias
Description: Creates custom post type "Maps" for Cartografias project
*/

function create_posttype() {
	register_post_type( 'maps',
		array(
			'labels' => array(
				'name' => __( 'Maps' ),
				'singular_name' => __( 'Map' )
			),
			'public' => true,
			'has_archive' => true,
			'rewrite' => array('slug' => 'maps'),
		)
	);
}
add_action( 'init', 'create_posttype' );

?>