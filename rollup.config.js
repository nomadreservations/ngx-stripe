import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';

// Add here external dependencies that actually you use.
const globals = {
  '@angular/core': 'ng.core',
  '@angular/common': 'ng.common',

  'rxjs/BehaviorSubject': 'Rx',
  'rxjs/Observable': 'Rx',
  'rxjs/Subject': 'Rx',
  'rxjs/Subscription': 'Rx',
  'rxjs/Observer': 'Rx',
  'rxjs/Subscriber': 'Rx',
  'rxjs/Scheduler': 'Rx',
  'rxjs/ReplaySubject': 'Rx',

  'rxjs/add/observable/combineLatest': 'Rx.Observable',
  'rxjs/add/observable/fromPromise': 'Rx.Observable',
  'rxjs/add/operator/map': 'Rx.Observable.prototype',
  'rxjs/add/operator/filter': 'Rx.Observable.prototype',
  'rxjs/add/operator/take': 'Rx.Observable.prototype',
  'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/switchMap': 'Rx.Observable.prototype',
  'rxjs/add/operator/publishLast': 'Rx.Observable.prototype',
  'rxjs/add/operator/refCount': 'Rx.Observable.prototype',

};

export default {
  external: Object.keys(globals),
  plugins: [
    resolve({
      preferBuiltins: true
    }),
    commonjs({
      include: 'node_modules/**'
    }),
    json(),
    sourcemaps(),
  ],
  onwarn: () => { return },
  output: {
    format: 'umd',
    name: 'nomadreservations.ngxstripe',
    globals: globals,
    sourcemap: true,
    exports: 'named'
  }
}
