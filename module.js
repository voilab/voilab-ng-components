/*jslint browser: true */
/*global define */

define([
    'angular',
    'config'
], function (angular, config) {
    'use strict';

    return angular.module('voilab.components', [
        'voilab.amdTranslator', 'ngAnimate', 'ui.bootstrap', 'ui.router', 'ch.filters', 'qtip2', 'hc.marked'
    ])
        .value('config', config.VOILAB_NG_COMPONENTS.main)
        /**
         * Décoration de uib-rating afin de pouvoir utiliser font-awesome et pas fucking-glyphiconnasse.
         */
        .config(['$provide', function ($provide) {
            $provide.decorator('uibRatingDirective', ['$delegate', function($delegate) {
                var directive = $delegate[0];

                directive.templateUrl = config.VOILAB_NG_COMPONENTS.main.basepath + "/uib-extend/views/rating.ng.html";

                return $delegate;
            }]);
        }]);
});
