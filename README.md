# Cartografias
This project manages and overlays maps (transparent png images) using Wordpress.

## Installation
`git clone --recursive git@github.com:cleocleo/cartografias.git`

Browse to the cloned path and install Wordpress.

## Front end development
Inside `content/themes/cartografias`, run:

`npm install` (only required once)

`gulp` (each time you start coding)

### Considerations
- Uses sqlite but should not use it in production (just remove `content/db.php`, `content/database` and `content/plugins/sqlite-integration`).

- [npmjs](https://www.npmjs.com) is being used to install gulp and gulp packages.
