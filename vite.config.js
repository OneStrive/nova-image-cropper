import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
    plugins: [vue()],
    define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
    },
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
            external: ["vue", "axios", "laravel-nova"],
            output: {
                globals: {
                    vue: "Vue",
                    axios: "axios",
                    "laravel-nova": "LaravelNova",
                },
                assetFileNames: "css/[name].[ext]",
            },
        },
    },
    resolve: {
        extensions: [".mjs", ".js", ".jsx", ".json", ".vue"],
        alias: {
            "@": path.resolve(__dirname, "resources/js"),
        },
    },
});
