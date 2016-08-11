/*jslint browser: true */
/*global define */

define([
    'components/module'
], function (app) {
    'use strict';

    app
        .directive('onEscape', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 27) {
                        scope.$apply(function () {
                            scope.$eval(attrs.onEscape);
                        });

                        event.preventDefault();
                    }
                });
            };
        })
        .directive('onTab', function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 9) {
                        scope.$apply(function () {
                            scope.$eval(attrs.onTab);
                        });

                        event.preventDefault();
                    }
                });
            };
        });
});
