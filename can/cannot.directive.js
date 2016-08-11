/*jslint browser: true */
/*global define */

define([
    'components/module'
], function (app) {
    'use strict';

    app.directive('cannot', ['MeService', function (MeService) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (MeService.can(scope.$eval(attrs.cannot), scope.$eval(attrs.cannotOptions))) {
                    element.remove();
                }
            }
        };
    }]);
});
