/*jslint browser: true */
/*global define */

define([
    'angular',
    'lodash',
    'config'
], function (angular, lodash, config) {
    'use strict';

    return angular.module('voilab.amdTranslator', [
        'ngCookies', 'angularMoment', 'pascalprecht.translate', 'RestTopModel'
    ])
        .config(['amdTranslatorProvider', function (amdTranslatorProvider) {
            amdTranslatorProvider.addPart('components/countries');
            amdTranslatorProvider.addPart('components/dialogs');
        }])
        .config(['ApiProvider', function (ApiProvider) {
            var api_uri = lodash.get(config, config.LANGS.translatableEndpoint) || config.LANGS.translatableEndpoint;
            ApiProvider.setApiUrl(api_uri.replace('[lang]', config.LANGS.fallback));
        }])
        .config(['$translateProvider', function ($translateProvider) {

            $translateProvider.useLoader('amdTranslator', {
                urlTemplate: config.LANGS.filePattern
            });

            // make sure all values used in translate are sanitized for security
            $translateProvider.useSanitizeValueStrategy('escapeParameters');

            // cache translation files to save load on server
            $translateProvider.useLoaderCache(true);

            $translateProvider
                .registerAvailableLanguageKeys(lodash.map(config.LANGS.available, 'key'), lodash.reduce(lodash.map(config.LANGS.available, 'key'), function (acc, curr) {
                    acc[curr + '_*'] = curr;
                    return acc;
                }, {}));

            $translateProvider.determinePreferredLanguage();

            $translateProvider.fallbackLanguage(config.LANGS.fallback);

            // store the users language preference in a cookie
            $translateProvider.useLocalStorage();
        }])

        .run(['amMoment', '$translate', function (amMoment, $translate) {
            var lang = $translate.use();
            amMoment.changeLocale(lang);
        }])
        .run(['$rootScope', '$translate', 'Api', function ($rootScope, $translate, Api) {
            $rootScope.$on('$translateChangeSuccess', function (a, b) {
                Api.setApiUrl(lodash.get(config, config.LANGS.translatableEndpoint).replace('[lang]', $translate.use()));
            });
        }]);
});