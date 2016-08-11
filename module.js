/*jslint browser: true */
/*global define */

define([
    'angular',
    'module'
], function (angular, module) {
    'use strict';

    return angular.module('voilab.components', [
        'voilab.amdTranslator', 'ngAnimate', 'ui.bootstrap', 'ch.filters', 'qtip2', 'hc.marked'
    ])
        .value('config', module.config())
        /**
         * Décoration de uib-rating afin de pouvoir utiliser font-awesome et pas fucking-glyphiconnasse.
         */
        .config(['$provide', function ($provide) {
            $provide.decorator('uibRatingDirective', ['$delegate', function($delegate) {
                var directive = $delegate[0];

                directive.templateUrl = module.config().basepath + "/uib-extend/views/rating.ng.html";

                return $delegate;
            }]);
        }]);
});
