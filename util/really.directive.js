/*jslint browser: true */
/*global define */

define([
    'components/module'
], function (app) {
    'use strict';

    app.directive('ngReallyClick', ['MessageModal', '$timeout', function (MessageModal, $timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                if (attrs.ngReallyEnabled !== undefined && attrs.ngReallyEnabled === 'false') {
                    return;
                }
                element.bind('click', function () {
                    MessageModal.confirm(attrs.ngReallyMessage).then(function () {
                        $timeout(function () {
                            scope.$apply(attrs.ngReallyClick);
                        }, 0);
                    });
                });
            }
        }
    }]);
});