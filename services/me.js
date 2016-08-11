/*jslint browser: true */
/*global define */
define([
    'components/module',
    'lodash',
    'config'
], function (app, lodash, config) {
    'use strict';

    app.service('MeService', ['Api', 'store', '$q', '$injector', '$timeout', function (Api, store, $q, $injector, $timeout) {
        // initialisation des permissions spéciales
        var special_permissions;
        $timeout(function () {
            special_permissions = $injector.get(config.VOILAB.permissionService).getSpecialPermissions();
        });


        /**
         * Authenticate against the API
         *
         * @param {Object} user
         * @returns {Promise}
         */
        this.login = function (user) {
            return Api.post('/session', user, {model: config.VOILAB.usermodel, silently: true});
        };

        /**
         * Disconnect (kill your session)
         *
         * @returns {Promise}
         */
        this.logout = function () {
            return Api.delete('/session');
        };

        /**
         * Ping session to check if user is still authentified
         *
         * @param silently
         * @returns {Promise}
         */
        this.ping = function (silently) {
            return Api.get('/session', {model: config.VOILAB.usermodel, silently: silently || false});
        };

        /**
         * Retrieve connected user
         *
         * @returns {Object}
         */
        this.getConnectedUser = function () {
            return store.getSession(config.VOILAB.storageUserName);
        };

        /**
         * Check if at least one permission among given permissions matches the user permissions
         *
         * @param {Array|String} permissions One or more permissions
         * @param {Object} [options] Some options that could be usefull for more complex permissions
         * @returns {Boolean}
         */
        this.can = function (permissions, options) {
            var ok_permissions;
            if (!lodash.isArray(permissions)) {
                permissions = [permissions];
            }
            ok_permissions = lodash.intersection(permissions, this.getConnectedUser().permissions);

            return !(ok_permissions.length === 0 || lodash.compact(lodash.map(ok_permissions, function (perm) {
                // attention, en l'état, les permissions spéciales ne fonctionnent pas à l'initialisation de l'app (genre dans ui-router)
                if (special_permissions && special_permissions[perm] !== undefined) {
                    return special_permissions[perm](options);
                }
                return true;
            })).length === 0);
        };

        /**
         * Check if at least one permission among given permissions matches the user permissions
         * or if one provided promises resolves
         *
         * @param {Array|String} permissions Permission or list of permissions
         * @param {Object} [options] Some options that could be usefull for more complex permissions
         * @param {Array|Function} [callbacks] Function or list of functions. Totally custom way to define if connected user shall pass...
         * @returns {Promise}
         */
        this.shallPass = function (permissions, options, callbacks) {
            var defer = $q.defer();

            // handle permissions
            if (this.can(permissions, options)) {
                defer.resolve(true);
                return defer.promise;
            }

            // handle promises
            if (callbacks !== undefined) {
                if (!lodash.isArray(callbacks)) {
                    callbacks = [callbacks];
                }

                if (lodash.compact(lodash.map(callbacks, function (cb) { return cb(); })).length > 0) {
                    defer.resolve(true);
                    return defer.promise;
                }
            }

            defer.reject({
                error: 403,
                message: 'You shall not pass !'
            });
            return defer.promise;
        };

        /**
         * Get my own session back, after impersonate another user
         *
         * @returns {Promise}
         */
        this.repersonate = function () {
            return Api.post('/session/repersonate');
        };
    }]);
});

