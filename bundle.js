/*jslint browser: true */
/*global define */

define([
    'marked',
    'angular-animate',
    'angular-bootstrap',
    'angular-cookies',
    'angular-filters',
    'angular-moment',
    'angular-translate',
    'angular-translate-loader-partial',
    'angular-translate-storage-cookie',
    'angular-translate-storage-local',
    'angular-marked',
    'moment',
    'moment-fr',
    'require-topmodel/angular',
    'angular-qtip2',
    'angular-ui-router',
    'angular-ui-tree',

    './module',
    './services/me',

    './amd-translator/module',
    './amd-translator/provider',

    './can/can.directive',
    './can/cannot.directive',

    './countries/countries.directive',

    './dialogs/message.modal',
    './dialogs/coming.soon',

    './menu/menu.directive',
    './menu/menu-item.directive',
    './menu/menu.provider',

    './password-reminder/component',
    './password-reminder/service',

    './tree/tree.directive',

    './util/equals.directive',
    './util/onescape.directive',
    './util/really.directive',
    './util/storage.factory'


], function () {
    'use strict';
});
