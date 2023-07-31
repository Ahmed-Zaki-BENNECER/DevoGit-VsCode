import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        assetsInlineLimit: 0,
        rollupOptions: {
            output: {
                entryFileNames: `x.js`,
                chunkFileNames: `x.js`,
                assetFileNames: `x.js`,
            },
        },
    },
    define: {
        // In Vite, "process" is not used anymore, so we need to define it
        // for some modules that rely on it.
        "process.platform": process.platform, // To use "path" module
    },
});
