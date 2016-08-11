/*jslint browser: true */
/*global define */

define([
    '../module'
], function (app) {
    'use strict';

    app.directive('voilabMenu', ['config', function (config) {

        return {
            restrict: 'E',
            templateUrl: config.basepath + '/menu/views/menu.ng.html',
            scope: {},
            bindToController: {
                access: '='
            },
            controller: ['menu', function (menu) {
                var vm = this;
                // get the menu and order it
                vm.menu = menu.menu;
            }],
            controllerAs: 'menuController'
        };
    }]);
});
