/*jslint browser: true */
/*global define */

define([
    'components/module'
], function (app) {
    'use strict';

    app.directive('voilabMenu', function () {
        return {
            restrict: 'E',
            templateUrl: 'components/menu/views/menu.ng.html',
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
    });
});
