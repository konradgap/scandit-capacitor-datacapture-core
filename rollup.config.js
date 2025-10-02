import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: {
    index: './src/index.ts',
    core: 'scandit-datacapture-frameworks-core'
  },
  output: {
    dir: 'dist',
    format: 'es',
    name: 'capacitorPlugin', // TODO: change this
    globals: {
      '@capacitor/core': 'capacitorExports',
    },
    sourcemap: true,
  },
  plugins: [
    commonjs(),
    nodeResolve(),
    typescript()
  ],
};
