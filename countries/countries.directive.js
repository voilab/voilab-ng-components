/*jslint browser: true */
/*global define */

define([
    'components/module',
    'lodash',
    'json!components/countries/i18n/fr.json'
], function (app, lodash, countries) {
    'use strict';

    /**
     * Directive qui gère l'affichage d'une combobox avec la liste des ventes
     */
    app.directive('countries', ['$filter', '$timeout', function ($filter, $timeout) {

        return {
            restrict: 'E',
            replace: true,
            scope: {
                country: '=',
                required: '@'
            },
            template: function (element, attrs) {
                if (attrs.readmode && attrs.readmode === 'true') {
                    return '<span>{{country_label}}</span>';
                }
                return '<select ng-options="coun.key as coun.value for coun in countries" ng-model="country" ng-required="required" autocomplete="shipping country"></select>';
            },
            link: function (scope, element, attrs) {
                if (attrs.readmode && attrs.readmode === 'true') {
                    scope.$watch('country', function (value) {
                        scope.country_label = $filter('translate')(value);
                    });
                } else {
                    $timeout(function () {
                        scope.countries = lodash.map(lodash.keys(countries), function (key) {
                            return {
                                key: key,
                                value: $filter('translate')(key)
                            };
                        }).sort(function (a, b) {
                            return a.value.localeCompare(b.value);
                        });
                    }, 1000); // pas trouvé de meilleur moyen pour l'instant... sans ça la traduction est pas encore en place...
                }
            }
        };
    }]);
});
