requirejs.config({
    paths: {
        angular: 'vendors/angular/angular',
        jquery: 'vendors/jquery/dist/jquery',
        lodash: 'vendors/lodash/lodash',
        marked: 'vendors/marked/lib/marked',
        moment: 'vendors/moment/moment',
        'moment-fr': 'vendors/moment/locale/fr',
        q: 'vendors/q/q',
        'require-topmodel': 'vendors/require-topmodel/lib',
        qtip2: 'vendors/qtip2/jquery.qtip.min',
        'angular-qtip2': 'vendors/angular-qtip2/lib/voilab-angular-qtip',

        'angular-animate': 'vendors/angular-animate/angular-animate',
        'angular-bootstrap': 'vendors/angular-bootstrap/ui-bootstrap-tpls',
        'angular-cookies': 'vendors/angular-cookies/angular-cookies',
        'angular-filters': 'vendors/angularjs-filters/filters',
        'angular-marked': 'vendors/angular-marked/dist/angular-marked',
        'angular-moment': 'vendors/angular-moment/angular-moment',
        'angular-translate': 'vendors/angular-translate/angular-translate',
        'angular-translate-loader-partial': 'vendors/angular-translate-loader-partial/angular-translate-loader-partial',
        'angular-translate-storage-cookie': 'vendors/angular-translate-storage-cookie/angular-translate-storage-cookie',
        'angular-translate-storage-local': 'vendors/angular-translate-storage-local/angular-translate-storage-local',

        'angular-ui-router': 'vendors/angular-ui-router/release/angular-ui-router',
        'angular-ui-tree': 'vendors/angular-ui-tree/dist/angular-ui-tree',

        text: 'vendors/requirejs-plugins/lib/text',
        json: 'vendors/requirejs-plugins/src/json'
    },
    shim: {
        angular: {
            exports: 'angular',
            deps: ['jquery']
        },
        'angular-animate': ['angular'],
        'angular-bootstrap': ['angular'],
        'angular-cookies': ['angular'],
        'angular-filters': ['angular'],
        'angular-google-maps': ['angular'],
        'angular-marked': ['angular', 'marked'],
        'angular-translate': ['angular'],
        'angular-translate-loader-partial': ['angular-translate'],
        'angular-translate-storage-cookie': ['angular-translate'],
        'angular-translate-storage-local': ['angular-translate'],
        'angular-ui-router': ['angular'],
        'angular-ui-tree': ['angular']
    }
});

define([
    './module',
    'jquery',
    'qtip2',
    './bundle',
    'domReady!'
], function (app, jQuery) {
    'use strict';

    jQuery.fn.qtip.defaults.style.classes = 'qtip qtip-dark qtip-shadow qtip-rounded';

    return app;

});
