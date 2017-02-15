/*jslint browser: true */
/*global define */

define([
    'angular',
    'lodash',
    'config'
], function (angular, lodash, appConfig) {
    'use strict';

    var config = appConfig.VOILAB_NG_COMPONENTS.amdTranslator;

    return angular.module('voilab.amdTranslator', [
        'ngCookies', 'angularMoment', 'pascalprecht.translate', 'RestTopModel'
    ])
        .config(['amdTranslatorProvider', function (amdTranslatorProvider) {
            amdTranslatorProvider.addPart('components/countries');
            amdTranslatorProvider.addPart('components/dialogs');
        }])
        .config(['ApiProvider', function (ApiProvider) {
            ApiProvider.setApiUrl(config.translatableEndpoint.replace('[lang]', config.fallback));
        }])
        .config(['$translateProvider', function ($translateProvider) {

            $translateProvider.useLoader('amdTranslator', {
                urlTemplate: config.filePattern
            });

            // make sure all values used in translate are sanitized for security
            $translateProvider.useSanitizeValueStrategy('escapeParameters');

            // cache translation files to save load on server
            $translateProvider.useLoaderCache(true);

            $translateProvider
                .registerAvailableLanguageKeys(lodash.map(config.available, 'key'), lodash.reduce(lodash.map(config.available, 'key'), function (acc, curr) {
                    acc[curr + '_*'] = curr;
                    return acc;
                }, {}));

            $translateProvider.determinePreferredLanguage(function () {
                // set from browser
                $translateProvider.determinePreferredLanguage();
                // if language found is not available, set to fallback
                var preferred = $translateProvider.preferredLanguage(),
                    found = lodash.find(config.available, function (ln) {
                        return ln.key.toLowerCase() === (preferred && preferred.toLowerCase());
                    });

                if (!found) {
                    preferred = config.fallback;
                }
                return preferred;
            });

            $translateProvider.fallbackLanguage(config.fallback);

            // store the users language preference in a cookie
            $translateProvider.useLocalStorage();
        }])

        .service('VoilabAmdTranslator', ['$translate', function ($translate) {

            this.getLanguages = function () {
                return lodash.map(config.available, 'key');
            };

            this.setActiveLanguage = function (lang) {
                return $translate.use(lang);
            };
        }])

        .run(['amMoment', '$translate', function (amMoment, $translate) {
            var lang = $translate.use();
            amMoment.changeLocale(lang);
        }])
        .run(['$rootScope', '$translate', 'Api', 'amMoment', function ($rootScope, $translate, Api, amMoment) {
            $rootScope.$on('$translateChangeSuccess', function () {
                Api.setApiUrl(config.translatableEndpoint.replace('[lang]', $translate.use()));
                amMoment.changeLocale($translate.use());
            });
        }]);
});
