
import { build } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import fs from 'fs';

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
        plugins: [],
        build: {
            outDir: 'dist',
            emptyOutDir: false, // Don't clear what we just built
            lib: {
                entry: resolve(__dirname, '../src/content/index.ts'),
                name: 'content',
                fileName: () => 'content.js',
                formats: ['iife']
            },
            rollupOptions: {
                output: {
                    extend: true,
                }
            }
        }
    });

    console.log('Build Complete.');
}

runBuild();
