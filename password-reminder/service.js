/*jslint browser: true */
/*global define */

define([
    'components/module',
    'config'
], function (app, config) {
    'use strict';

    app
        .service('PasswordReminderService', ['$uibModal', 'Api', function ($uibModal, Api) {
            this.openModal = function (email) {
                return $uibModal
                    .open({
                        templateUrl: 'components/password-reminder/modal.ng.html',
                        windowClass: 'password-reminder',
                        controller: 'PasswordReminderModalCtrl',
                        controllerAs: 'modal',
                        resolve: {
                            email: function () {
                                return email;
                            }
                        }
                    });
            };

            this.sendPasswordReminder = function (email) {
                return Api.post(config.VOILAB.passwordReminder.endpoint, {
                    email: email
                });
            };

            this.getByPasswordReminderHash = function (hash) {
                return Api.get(config.VOILAB.passwordReminder.endpoint + '/' + hash, {model: config.VOILAB.usermodel});
            };

            this.remindPassword = function (hash, data) {
                return Api.put(config.VOILAB.passwordReminder.endpoint + '/' + hash, data);
            };
        }])
        .controller('PasswordReminderModalCtrl', ['$uibModalInstance', 'PasswordReminderService', 'email', function ($uibModalInstance, PasswordReminderService, email) {
            var self = this;

            self.getSubscriptionPageUrl = function () {
                return config.VOILAB.passwordReminder.subscriptionPageUrl;
            };

            self.submit = function () {
                self.loading = true;
                PasswordReminderService.sendPasswordReminder(self.email)
                    .then(function () {
                        $uibModalInstance.close(self.email);
                    })
                    .catch(function (err) {
                        console.log(err);
                        self.loading = false;
                        self.error = true;
                        self.errorStatus = err.status;
                    });
            };

            self.$onInit = function () {
                self.focusEmail = true;
                if (email) {
                    self.email = email;
                }
            };
        }]);
});
