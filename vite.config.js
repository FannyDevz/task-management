import path from "node:path";
import { optimizeLodashImports } from "@optimize-lodash/rollup-plugin";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";
import removeConsole from "vite-plugin-remove-console";


export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css',
                'resources/js/app.jsx'
            ],
            refresh: true,
        }),
        react({ babel: { babelrc: true } }),
        optimizeLodashImports(),
        removeConsole(),
    ],
    optimizeDeps: {
        include: [ "@inertiajs/react"],
    },
    resolve: {
        alias: {
            "ziggy-js": path.resolve(__dirname, "vendor/tightenco/ziggy/dist"),
        },
    },
});


