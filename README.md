# Cartografias
This project manages and overlays maps (transparent png images) using Wordpress.

## Installation
`git clone --recursive git@github.com:cleocleo/cartografias.git`

Rename local-config-sample.php to local-config.php and set the url on line 15.

Browse to the cloned path and install Wordpress.

Login to Wordpress and activate Simple Fields plugin. Go to Settings > Simple Fields > Import & Export and import `simple-fields-maps.json`.

Create the path `shared/content/uploads` in the root of the repository (only for local development).

## Front end development
Inside `content/themes/cartografias`, update gulpfile.js on line 21 to match the url and run:

`npm install` (only required once)

`gulp` (each time you start coding)

### Considerations
- Uses sqlite but should not use it in production (just remove `content/db.php`, `content/database` and `content/plugins/sqlite-integration`).

- [npmjs](https://www.npmjs.com) is used to install gulp and gulp packages.
