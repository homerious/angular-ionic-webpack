'use strict';
module.exports = angular.module('app')
    .directive('focusInput', ['$ionicScrollDelegate', '$window', '$timeout', '$ionicPosition', function ($ionicScrollDelegate, $window, $timeout, $ionicPosition) {
        return {
            restrict: 'C',
            scope: false,
            link: function ($scope, iElm, iAttrs, controller) {
                if (ionic.Platform.isIOS()) {
                    iElm.on('focus', function () {
                        var top = $ionicScrollDelegate.getScrollPosition().top;
                        var eleTop = ($ionicPosition.offset(iElm).top) / 2;
                        var realTop = eleTop + top;
                        $ionicScrollDelegate.scrollTo(0, realTop);
                    })
                }

            }
        }
    }]);




