/*jslint browser: true */
/*global define */

define([
    'components/module'
], function (app) {
    'use strict';

    app.directive('can', ['MeService', function (MeService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (!MeService.can(scope.$eval(attrs.can), scope.$eval(attrs.canOptions))) {
                    element.remove();
                }
            }
        };
    }]);
});
