/*jslint browser: true */
/*global define */

define([
    '../module'
], function (app) {
    'use strict';

    app.directive('comingSoon', ['MessageModal', function (MessageModal) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                var activate = function () {
                    element.on('click', function () {
                        MessageModal.show({
                            title: 'Coming soon',
                            content: 'Cette fonctionnalité sera prochainement disponible.',
                            icon: 'hourglass-half'
                        });
                    });
                };

                activate();
            }
        };
    }]);
});
