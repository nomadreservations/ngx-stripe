import sourcemaps from 'rollup-plugin-sourcemaps';
import license from 'rollup-plugin-license';
import localResolve from 'rollup-plugin-local-resolve';

const path = require('path');

export default {
    output: {
        format: 'es',
        sourcemap: true
    },
    plugins: [
        sourcemaps(),
        localResolve(),
        license({
            sourceMap: true,

            banner: {
                file: path.join(__dirname, 'license-banner.txt'),
                encoding: 'utf-8',
            }
        })
    ],
    onwarn: () => { return }
}
