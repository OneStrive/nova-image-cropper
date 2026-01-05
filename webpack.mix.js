let mix = require("laravel-mix");
let path = require("path");

require("./mix");

// Nova is in YOUR package's vendor directory
const novaPath = path.resolve(__dirname, 'vendor/laravel/nova')

mix
    .setPublicPath("dist")
    .js("resources/js/field.js", "dist/js/image-cropper.js")
    .vue({ version: 3 })
    .webpackConfig({
        externals: {
            vue: 'Vue'
        },
        resolve: {
            alias: {
                'laravel-nova': path.join(novaPath, 'resources/js/mixins/packages.js'),
                '@': path.join(__dirname, 'resources/js'),
            },
            extensions: ['.*', '.wasm', '.mjs', '.js', '.jsx', '.json', '.vue'],
            symlinks: false,
        },
        output: {
            uniqueName: 'onestrive/nova-image-cropper',
        }
    })
