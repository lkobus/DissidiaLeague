import { join } from 'path';
import { SeedConfig } from './seed.config';
import { ExtendPackages } from './seed.config.interfaces';

/**
 * This class extends the basic seed configuration, allowing for project specific overrides. A few examples can be found
 * below.
 */
export class ProjectConfig extends SeedConfig {

  PROJECT_TASKS_DIR = join(process.cwd(), this.TOOLS_DIR, 'tasks', 'project');

  constructor() {
    super();
    // this.APP_TITLE = 'Put name of your app here';
    // this.GOOGLE_ANALYTICS_ID = 'Your site's ID';

    /* Enable typeless compiler runs (faster) between typed compiler runs. */
    // this.TYPED_COMPILE_INTERVAL = 5;

    // Add `NPM` third-party libraries to be injected/bundled.
    this.NPM_DEPENDENCIES = [
      ...this.NPM_DEPENDENCIES,
      // {src: 'jquery/dist/jquery.min.js', inject: 'libs'},
      // {src: 'lodash/lodash.min.js', inject: 'libs'},
      //{src: 'echarts-liquidfill/dist/echarts-liquidfill.min.js', inject: 'true'},
    ];

    // Add `local` third-party libraries to be injected/bundled.
    this.APP_ASSETS = [
      // {src: `${this.APP_SRC}/your-path-to-lib/libs/jquery-ui.js`, inject: true, vendor: false}
      // {src: `${this.CSS_SRC}/path-to-lib/test-lib.css`, inject: true, vendor: false},
      // {src: `${this.APP_SRC}/assets/js/echarts-liquidfill.min.js`, inject: true, vendor: false}
    ];

    this.ROLLUP_INCLUDE_DIR = [
      ...this.ROLLUP_INCLUDE_DIR,
      //'node_modules/moment/**'
    ];

    this.ROLLUP_NAMED_EXPORTS = [
      ...this.ROLLUP_NAMED_EXPORTS,
      //{'node_modules/immutable/dist/immutable.js': [ 'Map' ]},
    ];

    this.ENABLE_SCSS = true;
    this.SYSTEM_CONFIG_DEV.paths['lodash'] = `${this.APP_BASE}node_modules/lodash/`;
    this.SYSTEM_BUILDER_CONFIG.packages['lodash'] = { main: 'lodash.js', defaultExtension: 'js' };
    // Add packages (e.g. ng2-translate)
    // let additionalPackages: ExtendPackages[] = [{
    //   name: 'ng2-translate',
    //   // Path to the package's bundle
    //   path: 'node_modules/ng2-translate/bundles/ng2-translate.umd.js'
    // }];
    //
    // this.addPackagesBundles(additionalPackages);

    // Add packages (e.g. ngx-pagination)
    let additionalPackages: ExtendPackages[] = [{
     name: 'ngx-pagination',
      // Path to the package's bundle
      path: 'node_modules/ngx-pagination/dist/ngx-pagination.umd.js'
    },
    {
      name: 'moment',
      path: 'node_modules/moment/moment.js'
    },
    {
      name: 'tslib',
      path: 'node_modules/tslib'
    },
    {
      name: 'file-saver',
      path: 'node_modules/file-saver/FileSaver.js'
    },
    {
      name: 'ngx-modal',
      path: 'node_modules/ngx-modal'
    },
    {
      name: 'ng2-dragula',
      path: 'node_modules/ng2-dragula/bundles/ng2-dragula.umd.js'
    },
    {
      name: 'angular2-busy',
      path: 'node_modules/angular2-busy'
    },
    {
      name: 'ng2-currency-mask',
      path: 'node_modules/ng2-currency-mask'
    },
    {
      name: 'ngx-filesaver',
      path: 'node_modules/ngx-filesaver/bundles'
    },{
      name: 'url-search-params-polyfill',
      // Path to the package's bundle
      path: 'node_modules/url-search-params-polyfill',
      packageMeta: {
        defaultExtension: 'js'
      }
      },
      {
        name:'@angular/material',
        path:'node_modules/@angular/material/bundles/material.umd.js',
        packageMeta:{
          defaultExtension: 'js'
        }
      },
      {
        name: '@angular/cdk',
        path: 'node_modules/@angular/cdk/bundles/cdk.umd.js'
      },
      {
        name: '@angular/cdk/a11y',
        path: 'node_modules/@angular/cdk/bundles/cdk-a11y.umd.js'
      },
      {
        name: '@angular/cdk/bidi',
        path: 'node_modules/@angular/cdk/bundles/cdk-bidi.umd.js'
      },
      {
        name: '@angular/cdk/coercion',
        path: 'node_modules/@angular/cdk/bundles/cdk-coercion.umd.js'
      },
      {
        name: '@angular/cdk/collections',
        path: 'node_modules/@angular/cdk/bundles/cdk-collections.umd.js'
      },
      {
        name: '@angular/cdk/keycodes',
        path: 'node_modules/@angular/cdk/bundles/cdk-keycodes.umd.js'
      },
      {
        name: '@angular/cdk/observers',
        path: 'node_modules/@angular/cdk/bundles/cdk-observers.umd.js'
      },
      {
        name: '@angular/cdk/overlay',
        path: 'node_modules/@angular/cdk/bundles/cdk-overlay.umd.js'
      },
      {
        name: '@angular/cdk/platform',
        path: 'node_modules/@angular/cdk/bundles/cdk-platform.umd.js'
      },
      {
        name: '@angular/cdk/portal',
        path: 'node_modules/@angular/cdk/bundles/cdk-portal.umd.js'
      },
      {
        name: '@angular/cdk/rxjs',
        path: 'node_modules/@angular/cdk/bundles/cdk-rxjs.umd.js'
      },
      {
        name: '@angular/cdk/scrolling',
        path: 'node_modules/@angular/cdk/bundles/cdk-scrolling.umd.js'
      },
      {
        name: '@angular/cdk/stepper',
        path: 'node_modules/@angular/cdk/bundles/cdk-stepper.umd.js'
      },
      {
        name: '@angular/cdk/table',
        path: 'node_modules/@angular/cdk/bundles/cdk-table.umd.js'
      },
      {
        name: '@ngui/map',
        path: 'node_modules/@ngui/map/dist/map.umd.js'
      },
      {
        name: 'ngx-echarts',
        path: 'node_modules/ngx-echarts'
      },
      {
        name: 'angulartics2',
        path: 'node_modules/angulartics2/dist'
      },
      {
        name: 'linqts',
        path: 'node_modules/linqts/dist'
      }
  ];

    this.addPackagesBundles(additionalPackages);

    /* Add proxy middleware */
    // this.PROXY_MIDDLEWARE = [
    //   require('http-proxy-middleware')('/api', { ws: false, target: 'http://localhost:3003' })
    // ];

    /* Add to or override NPM module configurations: */
    // this.PLUGIN_CONFIGS['browser-sync'] = { ghostMode: false };
  }

}
