/*jslint browser: true */
/*global define */

define([
    '../module',
    'lodash'
], function (app, lodash) {
    'use strict';
    app.service('MessageModal', ['$uibModal', '$filter', 'config', function ($uibModal, $filter, config) {

        var self = this;

        /**
         * Show a configurable popup
         *
         * @param modalConfig
         *  - templateUrl
         *  - title
         *  - content
         *  - icon
         *  - closable
         *  - buttons [{
         *      icon: 'check', // any font-awesome icon
         *      label: 'Yes', // text inside your button
         *      callback: 'close' || 'dismiss' || function (modalInstance, modalPromise, modalControllerScope) { your own code }
         *  }]
         * @returns {*}
         */
        this.show = function (modalConfig) {
            var instance = $uibModal.open({
                templateUrl: config.basepath + '/dialogs/views/show.ng.html',
                controller: ['$sce', '$uibModalInstance', function ($sce, $uibModalInstance) {
                    var vm = this;


                    vm.templateUrl = modalConfig.templateUrl || config.basepath + '/dialogs/views/content.default.ng.html';

                    if (lodash.isString(modalConfig.content)) {
                        vm.content = $sce.trustAsHtml(modalConfig.content || "No content");
                    } else {
                        vm.content = modalConfig.content;
                    }

                    vm.title = modalConfig.title || 'Information';
                    vm.icon = modalConfig.icon || 'info-circle';
                    vm.closable = modalConfig.closable !== undefined ? modalConfig.closable : true;
                    vm.titleClass = modalConfig.titleClass ? ' ' + modalConfig.titleClass : '';
                    vm.contentClass = modalConfig.contentClass ? ' ' + modalConfig.contentClass : '';

                    vm.buttons = modalConfig.buttons || [{
                            label: 'Ok',
                            callback: 'dismiss'
                        }];

                    vm.close = function () {
                        $uibModalInstance.dismiss();
                    };

                    vm.buttonCallback = function (callback) {
                        if (callback === 'close') {
                            return $uibModalInstance.close();
                        }
                        if (callback === 'dismiss') {
                            return $uibModalInstance.dismiss();
                        }
                        if (lodash.isFunction(callback)) {
                            return callback($uibModalInstance, instance.result, vm);
                        }
                    };

                    // tout les champs non réservés par la config sont passés immédiatement
                    // au scope de la modale
                    vm = lodash.merge(vm, lodash.omit(modalConfig, [
                        'templateUrl',
                        'content',
                        'title',
                        'icon',
                        'closable',
                        'titleClass',
                        'contentClass',
                        'buttons',
                        'close',
                        'buttonCallback'
                    ]));
                }],
                controllerAs: 'ctrl'
            });

            return instance.result;
        };

        this.alert = function (message, type, title) {
            var modalconfig,
                types = {
                    info: 'info-circle',
                    danger: 'minus-circle',
                    warning: 'warning',
                    success: 'check'
                };

            if (!types[type]) {
                type = 'info';
            }


            modalconfig = {
                icon: types[type] + ' text-' + (type || 'info'),
                titleClass: 'text-' + (type || 'info'),
                contentClass: 'text-' + (type || 'info'),
                title: title,
                content: message
            };

            return self.show(modalconfig);
        };

        this.error = function (rejection) {
            var modalconfig = {
                icon: 'minus-circle text-danger',
                titleClass: 'text-danger',
                contentClass: 'text-danger'
            };
            if (['dev', 'development'].indexOf(config.env) > -1 && rejection.data && rejection.data.stack) {
                modalconfig.title = rejection.status + ' - ' + rejection.statusText;
                modalconfig.content = $filter('replace')(rejection.data.stack, "\n", "<br>");
            } else {
                modalconfig.title = "Erreur";
                if (rejection.data && rejection.data.message) {
                    modalconfig.content = rejection.data.message;
                } else {
                    modalconfig.content = rejection;
                }
            }
            return self.show(modalconfig);
        };

        this.confirm = function (message, title) {
            return self.show({
                content: message,
                title: title || 'Confirmation',
                icon: 'check-square-o',
                buttons: [{
                    label: 'Oui',
                    callback: 'close'
                }, {
                    label: 'Non',
                    callback: 'dismiss'
                }]
            });
        };

    }]);
});