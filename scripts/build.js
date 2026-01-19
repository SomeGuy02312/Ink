
import { build } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper plugin to copy manifest
const copyManifest = () => ({
    name: 'copy-manifest',
    closeBundle() {
        if (fs.existsSync('manifest.json')) {
            fs.copyFileSync('manifest.json', 'dist/manifest.json');
            console.log('manifest.json copied to dist/');
        }
    }
});

async function runBuild() {
    console.log('Building Extension...');

    // 1. Build Background and Side Panel (ESM is fine for these)
    await build({
        configFile: false,
        plugins: [react(), copyManifest()],
        build: {
            outDir: 'dist',
            emptyOutDir: true, // Clear first
            rollupOptions: {
                input: {
                    main: resolve(__dirname, '../index.html'),
                    background: resolve(__dirname, '../src/background/index.ts'),
                },
                output: {
                    entryFileNames: (chunkInfo) => {
                        if (chunkInfo.name === 'background') return 'background.js';
                        return 'assets/[name]-[hash].js';
                    }
                }
            }
        }
    });

    // 2. Build Content Script (MUST be IIFE to bundle everything and avoid imports)
    await build({
        configFile: false,
        plugins: [react()], // React plugin needed for JSX in content script

        define: {
            'process.env.NODE_ENV': '"production"'
        },
        build: {
            outDir: 'dist',
            emptyOutDir: false, // Don't clear what we just built
            sourcemap: false, // content scripts are seemingly cleaner without them
            lib: {
                entry: resolve(__dirname, '../src/content/index.tsx'),
                name: 'content',
                fileName: () => 'content.js',
                formats: ['iife']
            },
            minify: false,
            rollupOptions: {
                output: {
                    extend: true,
                    inlineDynamicImports: true,
                    intro: 'var process = { env: { NODE_ENV: "production" } };',
                }
            }
        }
    });

    console.log('Build Complete.');
}

runBuild();
