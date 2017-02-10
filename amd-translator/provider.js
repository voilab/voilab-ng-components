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

                var toload = lodash.map(parts, function (file) {
                        var process = function (lang) {
                            return 'json!' + lodash.replace(options.urlTemplate, /{(.*?)}/g, function (pattern, result) {
                                    if (result === 'lang') {
                                        return lang;
                                    }
                                    if (result === 'part') {
                                        return file;
                                    }
                                    return pattern;
                                });
                        };
                        if (options.fallback !== options.key) {
                            return [
                                process(options.key),
                                process(options.fallback)
                            ];
                        } else {
                            return [
                                process(options.key)
                            ];
                        }

                    });

                var loading_promises = lodash.map(toload, function (filename) {
                    var deferred = $q.defer();
                    require([filename[0]], function (mod) {
                        deferred.resolve(mod);
                    }, function (err) {
                        if (filename[1] !== undefined) {
                            require([filename[1]], function (mod) {
                                deferred.resolve(mod);
                            }, function (err) {
                                deferred.resolve({});
                            });
                        }
                    });
                    return deferred.promise;
                });

                return $q.all(loading_promises)
                    .then(function (results) {
                        return lodash.merge(results);
                    });
            };
            return service;
        }];

        
    });
});
