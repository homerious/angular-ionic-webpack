'use strict';

module.exports = ['$state', '$scope', '$rootScope',  function ($state, $scope, $rootScope) {
        $rootScope.rows = 8;
        $scope.tt = "";

        $scope.$watch("tt", function (o, n) {
            if (o != n) {
                $rootScope.signImageUrl = o;
            }
        });

        $rootScope.platform_context_path = '/';

    }]

