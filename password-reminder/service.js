/*jslint browser: true */
/*global define */

define([
    '../module'
], function (app) {
    'use strict';

    app
        .service('PasswordReminderService', ['$uibModal', 'Api', 'config', function ($uibModal, Api, config) {
            this.openModal = function (email, from) {
                return $uibModal
                    .open({
                        templateUrl: config.basepath + '/password-reminder/modal.ng.html',
                        windowClass: 'password-reminder',
                        controller: 'PasswordReminderModalCtrl',
                        controllerAs: 'modal',
                        resolve: {
                            email: function () {
                                return email;
                            },
                            from : function () {
                                return from;
                            }
                        }
                    });
            };

            this.sendPasswordReminder = function (email, from) {
                return Api.post(config.passwordReminder.endpoint, {
                    email: email,
                    from: from
                });
            };

            this.getByPasswordReminderHash = function (hash) {
                return Api.get(config.passwordReminder.endpoint + '/' + hash, {model: config.usermodel});
            };

            this.remindPassword = function (hash, data) {
                return Api.put(config.passwordReminder.endpoint + '/' + hash, data);
            };
        }])
        .controller('PasswordReminderModalCtrl', ['$uibModalInstance', 'PasswordReminderService', 'email', 'from', 'config', function ($uibModalInstance, PasswordReminderService, email, from, config) {
            var self = this;

            self.getSubscriptionPageUrl = function () {
                return config.passwordReminder.subscriptionPageUrl;
            };

            self.submit = function () {
                self.loading = true;
                PasswordReminderService.sendPasswordReminder(self.email, from)
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

