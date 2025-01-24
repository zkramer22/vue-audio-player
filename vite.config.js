import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
    const isDev = mode === 'development'
    const isApp = mode === 'app'
    const outDir = isApp 
        ? path.resolve(__dirname, 'gh-pages-dist')
        : path.resolve(__dirname, 'dist')

    return {
        plugins: [vue()],
        root: isDev || isApp ? 'dev' : '', // Use 'dev/' as the root directory for development
        base: isApp ? '/vue-audio-player/' : '/',
        build: {
            outDir,
            lib: !isApp 
                ? {
                    entry: path.resolve(__dirname, 'src/main.js'), // Entry point for the library build
                    name: 'VueAudioPlayer',
                    fileName: 'vue-audio-player', // Base name for the files
                } 
                : undefined,
            rollupOptions: !isApp 
                ? {
                    external: ['vue'], // Do not bundle Vue
                    output: [
                        {
                            format: 'umd', // UMD format for general compatibility
                            dir: outDir, // Directory for the output files
                            entryFileNames: 'vue-audio-player.umd.js',
                            name: 'VueAudioPlayer',
                            globals: {
                                vue: 'Vue',
                            },
                        },
                        {
                            format: 'esm', // ESM format for modern JavaScript users
                            dir: outDir,
                            entryFileNames: 'vue-audio-player.esm.js',
                            globals: {
                                vue: 'Vue',
                            },
                        },
                        {
                            format: 'cjs', // CommonJS format for Node.js users
                            dir: outDir,
                            entryFileNames: 'vue-audio-player.cjs.js',
                            globals: {
                                vue: 'Vue',
                            },
                        },
                    ],
                }
                : undefined,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, isDev ? 'dev' : 'src'), // Use 'dev' aliases for development
            },
        },
    }
})
