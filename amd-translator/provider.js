/*jslint browser: true */
    /*global define */

    define([
        './module',
        'lodash'
    ], function (app, lodash) {
        'use strict';

    app.provider('amdTranslator', function () {
        
        var parts = [],
            isStringValid = function (str) {
                return lodash.isString(str) && str !== '';
            };

        // configuration
        this.addPart = function (name) {
            parts.push(name);
        };

        this.$get = ['$q', function ($q) {
            
            var service = function (options) {
                if (!isStringValid(options.key)) {
                    throw new TypeError('Unable to load data, a key is not a non-empty string.');
                }

                if (!isStringValid(options.urlTemplate) && !angular.isFunction(options.urlTemplate)) {
                    throw new TypeError('Unable to load data, a urlTemplate is not a non-empty string or not a function.');
                }

                var deferred = $q.defer(),
                    toload = lodash.map(parts, function (file) {
                        return 'json!' + lodash.replace(options.urlTemplate, /{(.*?)}/g, function (pattern, result) {
                            if (result === 'lang') {
                                return options.key;
                            }
                            if (result === 'part') {
                                return file;
                            }
                            return pattern;
                        });
                    });

                require(toload, function () {
                    var args = Array.prototype.slice.call(arguments);
                    return deferred.resolve(lodash.merge(args));
                });

                return deferred.promise;
            };
            return service;
        }];

        
    });
});
