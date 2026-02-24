import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

const novaPath = path.resolve(__dirname, "vendor/laravel/nova");

export default defineConfig({
    plugins: [vue()],
    build: {
        outDir: "dist",
        lib: {
            entry: path.resolve(__dirname, "resources/js/field.js"),
            name: "NovaImageCropper",
            formats: ["iife"],
            fileName: () => "js/nova-image-cropper.js",
            cssFileName: "nova-image-cropper",
        },
        rollupOptions: {
            external: ["vue", "axios", "vuex"],
            output: {
                globals: {
                    vue: "Vue",
                    axios: "axios",
                    vuex: "Vuex",
                },
                assetFileNames: "css/[name].[ext]",
            },
        },
    },
    resolve: {
        extensions: [".mjs", ".js", ".jsx", ".json", ".vue"],
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
            "laravel-nova": path.join(
                novaPath,
                "resources/js/mixins/packages.js"
            ),
        },
    },
});
