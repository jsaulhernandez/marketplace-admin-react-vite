import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@root': resolve(__dirname, './src'),
            '@components': resolve(__dirname, './src/components'),
            '@pages': resolve(__dirname, './src/pages'),
            '@helpers': resolve(__dirname, './src/helpers'),
            '@contexts': resolve(__dirname, './src/context'),
            '@hooks': resolve(__dirname, './src/hooks'),
            '@layout': resolve(__dirname, './src/layout'),
            '@interfaces': resolve(__dirname, './src/interfaces'),
            '@utils': resolve(__dirname, './src/utils'),
            '@reducers': resolve(__dirname, './src/reducers'),
            '@constants': resolve(__dirname, './src/constants'),
        },
    },
    plugins: [
        react(),
        {
            name: 'singleHMR',
            handleHotUpdate({ modules }) {
                modules.map((m) => {
                    m.importedModules = new Set();
                    m.importers = new Set();
                });

                return modules;
            },
        },
    ],
});
