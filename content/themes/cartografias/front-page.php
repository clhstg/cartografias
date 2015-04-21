<?php
/**
 * The main template file.
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 * Learn more: http://codex.wordpress.org/Template_Hierarchy
 *
 * @package cartografias
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<nav id="maps_nav">
			<ul id="maps_nav_ul">
		<?php
			$args = array( 'post_type' => 'maps' );
			$the_query = new WP_Query( $args );

			if ( $the_query->have_posts() ) {
				$render_params = array('output'=>'raw', 'separator'=>'|');
				while ( $the_query->have_posts() ) {
					$the_query->the_post();
					$metadata = simple_fields_value('fonte, elaboracao, base_cartografica, descricao, mapa');
					$metadata['legendas'] = simple_fields_values('legendas');
					$metadata['arquivos_relacionados'] = simple_fields_values('arquivos_relacionados');
					$metadata['titulo'] = get_the_title();
					$metadata['mapa'] = $metadata['mapa']['url'];
					if( isset($metadata['arquivos_relacionados']) && count($metadata['arquivos_relacionados']) ){
						$relacionados = array();
						foreach($metadata['arquivos_relacionados'] as $file){
							$relacionados[] = array(
												'title'	=> get_the_title($file['id']),
												'url'	=> wp_get_attachment_url($file['id'])
												);
						}
						$metadata['arquivos_relacionados'] = $relacionados;
					}
					else{
						$metadata['arquivos_relacionados'] = array();
					}
					$metadata['legendas'] = isset( $metadata['legendas'] ) ? $metadata['legendas'] : '';
					wp_reset_postdata();
		?>
					<li
						data-titulo="<?php print $metadata['titulo']; ?>"
						data-fonte="<?php print $metadata['fonte']; ?>"
						data-elaboracao="<?php print $metadata['elaboracao']; ?>"
						data-base="<?php print $metadata['base_cartografica']; ?>"
						data-descricao="<?php print htmlspecialchars($metadata['descricao']); ?>"
						data-mapa="<?php print $metadata['mapa']; ?>"
						data-legendas="<?php print htmlspecialchars(json_encode($metadata['legendas']), ENT_QUOTES, 'UTF-8'); ?>"
						data-relacionados="<?php print htmlspecialchars(json_encode($metadata['arquivos_relacionados']), ENT_QUOTES, 'UTF-8'); ?>"
						class="cleafix">
						<div class="wrapper">
							<span class="handle">⬍</span>
							<span class="handle_more">+</span>
							<input type="checkbox">
							<img src="<?php print $metadata['mapa']; ?>">
							<span>
								<?php
								if( isset($metadata['titulo']) && !empty($metadata['titulo']) ){
								?>
									<span class="text"><?php print $metadata['titulo']; ?></span>
								<?php
								}
								?>
								<?php
									if( isset($metadata['fonte']) && !empty($metadata['fonte']) ){
								?>
									<small>Fonte: <?php print $metadata['fonte']; ?>. </small>
								<?php
								}
								?>
								<?php
									if( isset($metadata['elaboracao']) && !empty($metadata['elaboracao']) ){
								?>
									<small>Elaboração: <?php print $metadata['elaboracao']; ?></small>
								<?php
								}
								?>
							</span>
						</div>
						<div class="more_info">
							<div class="mapa"></div>
							<div class="col_one">
								<div class="titulo"></div>
								<div class="legendas"></div>
								<div class="escala"><img src="<?php print get_stylesheet_directory_uri(); ?>/assets/images/escala.jpg" class="escala"></div>
								<div class="fonte">Fonte: </div>
								<div class="elaboracao">Elaboração: </div>
								<div class="base">Base cartográfica: </div>
							</div>
							<div class="col_two">
								<div class="descricao"></div>
							</div>
							<div class="clearfix"></div>
						</div>
					</li>
				<?php
				} /* end while ( $the_query->have_posts() ) { */
				?>
				</ul>
				<div class="submit" id="filter">
					<span class="filter_text">Filtrar</span>
				</div>
				<div class="submit" id="preview">
					<span class="save_text">Gerar mapa</span>
				</div>
				<div class="toggle">≣</div>
		<?php
			}/*end if $the_query->have_posts()*/
			else {
				var_dump('no posts');
				print '<p>_e( "Sorry, no posts matched your criteria." )</p>';
			}
		?>
		</nav>
		<div class="heading">
			<div id="titulo" class="titulo"></div>
			<div class="download">
				<span class="download_anchor" data-width="1920" data-height="1440">Baixar mapa (0000px x 0000px)</span>
				 |
				<span class="sizes_anchor">Selecionar outro tamanho</span>
				<div class="more_sizes">
					<ul>
						<li><span class="download_anchor" data-width="1024" data-height="768">Tamanho 1</span></li>
						<li><span class="download_anchor" data-width="1024" data-height="768">Tamanho 2</span></li>
						<li><span class="download_anchor" data-width="1024" data-height="768">Tamanho 3</span></li>
						<li><span class="download_anchor" data-width="1024" data-height="768">Tamanho 4</span></li>
						<li><span class="download_anchor" data-width="1024" data-height="768">Tamanho 5</span></li>
						<li><span class="download_anchor" data-width="1024" data-height="768">Tamanho 6</span></li>
						<li><span class="download_anchor" data-width="1024" data-height="768">Tamanho 7</span></li>
						<li><span class="download_anchor" data-width="1024" data-height="768">Tamanho 8</span></li>
					</ul>
				</div>
			</div>
		</div>
		<main id="main" class="site-main" role="main">
			<div class="mapa"></div>
			<div id="info">
				<div class="col_one">
					<div class="titulo"></div>
					<div class="legendas"></div>
					<div class="escala"><img src="<?php print get_stylesheet_directory_uri(); ?>/assets/images/escala.jpg" class="escala"></div>
					<div class="fonte">Fonte: </div>
					<div class="elaboracao">Elaboração: </div>
					<div class="base">Base cartográfica: </div>
				</div>
				<div class="col_two">
					<div class="descricao"></div>
				</div>
				<div class="clearfix"></div>
			</div>
		</main><!-- #main -->
		<div class="footer">
			<div class="relacionados">
				<h2>Arquivos relacionados</h2>
			</div>
		</div>
	</div><!-- #primary -->

<?php //get_sidebar(); ?>
<?php get_footer(); ?>
