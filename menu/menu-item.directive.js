/*jslint browser: true */
/*global define */

define([
    '../module',
    'lodash'
], function (app, lodash) {
    'use strict';

    app.directive('voilabMenuItem', ['config', function (config) {
        return {
            restrict: 'E',
            require: '^voilabMenu',
            scope: {},
            bindToController: {
                item: '='
            },
            template: '<li ng-include="::voilabMenuItem.template" include-replace></li>',
            link: function (scope, element, attrs, parentController) {
                scope.voilabMenuItem.template = config.basepath + '/menu/views/menu-item-' + scope.voilabMenuItem.item.type + '.ng.html';

                scope.accessGranted = function () {
                    return scope.voilabMenuItem.item.access === undefined || lodash.intersection(parentController.access, scope.voilabMenuItem.item.access).length > 0
                };
            },
            controller: ['$scope', '$state', '$filter', function ($scope, $state, $filter) {
                var vm = this,
                    checkItemActive =  function () {
                        // first check if the state is the same
                        if (lodash.isArray(vm.item.state)) {
                            vm.item.active = lodash.filter(vm.item.state, function (state) {
                                return $state.includes(state, vm.item.params);
                            }).length > 0;
                        } else {
                            vm.item.active = $state.includes(vm.item.state, vm.item.params);
                        }

                        // if we are now the active item reset the breadcrumbs and open all parent dropdown items
                        if (vm.item.active) {
                            $scope.$emit('openParents');

                            if (vm.item.type === 'dropdown') {
                                vm.item.open = true;
                            }
                        }
                    },
                    toggleDropdownMenu = function () {
                        $scope.$parent.$parent.$broadcast('toggleDropdownMenu', vm.item, !vm.item.open);
                    },
                    openLink = function () {
                        var params = angular.isUndefined(vm.item.params) ? {} : vm.item.params,
                            state = lodash.isArray(vm.item.state) ? vm.item.state[0] : vm.item.state;
                        $state.go(state, params);
                        vm.item.active = true;
                    },
                    activate = function () {
                        vm.openLink = openLink;

                        // on init check if this is current menu
                        checkItemActive($state.current.name, $state.params);

                        $scope.$on('$stateChangeSuccess', function (event, toState, toParams) {
                            if (vm.item.type === 'dropdown') {
                                vm.item.open = false;
                            }
                            checkItemActive(toState.name, toParams);
                        });

                        if (vm.item.type === 'dropdown') {
                            // if we have kids reorder them by priority
                            vm.item.children = $filter('orderBy')(vm.item.children, 'priority');
                            vm.toggleDropdownMenu = toggleDropdownMenu;

                            // add a check for open event
                            $scope.$on('toggleDropdownMenu', function(event, item, open) {
                                // if this is the item we are looking for
                                if (vm.item === item) {
                                    vm.item.open = open;
                                } else {
                                    vm.item.open = false;
                                }
                            });


                            // this event is emitted up the tree to open parent menus
                            $scope.$on('openParents', function() {
                                // openParents event so open the parent item
                                vm.item.open = true;
                            });
                        }
                    };

                activate();
            }],
            controllerAs: 'voilabMenuItem'
        };
    }])
        .directive('includeReplace', function () {
            return {
                require: 'ngInclude',
                restrict: 'A',
                link: function (scope, el) {
                    el.replaceWith(el.children());
                }
            };
        });
});