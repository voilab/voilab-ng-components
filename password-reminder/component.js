/*jslint browser: true */
/*global define */

define([
    'components/module',
    'config'
], function (app, config) {
    'use strict';

    app
        .component('passwordReminder', {
            templateUrl: 'components/password-reminder/component.ng.html',
            controller: 'PasswordReminderCtrl',
            bindings: {
                hash: '@'
            }
        })
        .controller('PasswordReminderCtrl', ['PasswordReminderService', '$timeout', 'LoginModal', function (PasswordReminderService, $timeout, LoginModal) {
            var self = this;

            this.submit = function () {
                this.loading = true;
                self.success = false;
                self.error = false;
                PasswordReminderService.remindPassword(this.hash, this.data)
                    .then(function () {
                        self.success = true;
                        $timeout(function () {
                            window.location.href = self.getNextUrl();
                        }, 5000);
                    })
                    .catch(function (err) {
                        console.log(err);
                        self.error = true;
                    })
                    .finally(function () {
                        self.loading = false;
                    })
            };

            this.getNextUrl = function () {
                return config.VOILAB.passwordReminder.finishUrl;
            };

            this.showLogin = function () {
                LoginModal();
            };

            this.$onInit = function () {
                this.focusPass = true;
                PasswordReminderService.getByPasswordReminderHash(this.hash)
                    .then(function (user) {
                        self.user = user;
                    })
                    .catch(function (err) {
                        console.log(err);
                        self.error = true;
                    });
            };
        }]);
});
