/*jslint browser: true */
/*global define */
define([
    'components/module',
    'lodash'
], function (app, lodash) {
    'use strict';
    return app.factory('store', ['$window', function ($window) {
            var retrieveValue = function (str) {
                try {
                    return JSON.parse(str);
                } catch (e) {
                    return str;
                }
            };
            return {
                setLocal: function (key, value) {
                    try {
                        if ($window.Storage) {
                            $window.localStorage.setItem(key, value);
                            return true;
                        }
                        return false;
                    } catch (error) {
                        console.error(error, error.message);
                    }
                },
                getLocal: function (key) {
                    try {
                        if ($window.Storage) {
                            return $window.localStorage.getItem(key);
                        }
                        return false;
                    } catch (error) {
                        console.error(error, error.message);
                    }
                },
                setSession: function (key, value) {
                    try {
                        if ($window.Storage) {
                            if (lodash.isObject(value)) {
                                value = JSON.stringify(value);
                            }
                            $window.sessionStorage.setItem(key, value);
                            return true;
                        }
                        return false;
                    } catch (error) {
                        console.error(error, error.message);
                    }
                },
                getSession: function (key) {
                    var result;
                    try {
                        if ($window.Storage) {
                            result = $window.sessionStorage.getItem(key);
                            return retrieveValue(result);
                        }
                        return false;
                    } catch (error) {
                        console.error(error, error.message);
                    }
                }
            };
        }]);
});