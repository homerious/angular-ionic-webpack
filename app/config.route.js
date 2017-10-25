'use strict';
module.exports = routeConfig ;


function routeConfig($stateProvider, $urlRouterProvider) {

    var routes, setRoutes;

    routes = [ {
            name: 'root',
            ctrl: 'mainCtrl',
            url: 'main',
            tpl: './modules/business/main/main'
        }
    ];
    setRoutes = function (route) {

        var config, name;
        config = {
            url: "/" + route.url,
            template: require(route.tpl + '.html'),
            controller: route.ctrl
        };
        $stateProvider.state(route.name, config);
        return $stateProvider;
    };
    routes.forEach(function (route) {
        return setRoutes(route);
    });

}

