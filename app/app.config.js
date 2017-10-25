

module.exports = angular.module("app")
    .config(['CacheFactoryProvider', '$cookiesProvider', '$ionicConfigProvider', '$ionicFilterBarConfigProvider', 'ionicDatePickerProvider', '$httpProvider', function (CacheFactoryProvider, $cookiesProvider, $ionicConfigProvider, $ionicFilterBarConfigProvider, ionicDatePickerProvider, $httpProvider) {
        angular.extend($cookiesProvider.defaults, {
            path: "/"
        });
        angular.extend(CacheFactoryProvider.defaults, {
            maxAge: 1
        }); //缓存10s

        $ionicConfigProvider.views.transition('ios');
        $ionicConfigProvider.views.swipeBackEnabled(true);
        $ionicConfigProvider.scrolling.jsScrolling(false);
        $ionicConfigProvider.platform.android.views.maxCache(0);
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');
        $ionicConfigProvider.navBar.alignTitle('center').positionPrimaryButtons('left');


        $ionicFilterBarConfigProvider.theme('positive');
        $ionicFilterBarConfigProvider.clear('ion-close');
        $ionicFilterBarConfigProvider.search('ion-search');
        $ionicFilterBarConfigProvider.backdrop(false);
        $ionicFilterBarConfigProvider.transition('vertical');
        $ionicFilterBarConfigProvider.placeholder('Filter');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');
        $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
        $ionicConfigProvider.platform.android.views.transition('android');
        $ionicConfigProvider.views.maxCache(0);


        var datePickerObj = {
            inputDate: new Date(),
            setLabel: '确定',
            todayLabel: '今天',
            closeLabel: '关闭',
            mondayFirst: false,
            weeksList: ["日", "一", "二", "三", "四", "五", "六"],
            monthsList: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            templateType: 'popup',
            from: new Date(1910, 1, 1),
            to: new Date(2050, 12, 31),
            showTodayButton: true,
            dateFormat: 'yyyy-MM-dd',
            closeOnSelect: false,
            disableWeekdays: []
        };
        ionicDatePickerProvider.configDatePicker(datePickerObj);

        /*http post 方法的传参格式更改--start--csk20161005*/
        // Use x-www-form-urlencoded Content-Type
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.cache = false;
        //$httpProvider.defaults.headers['Range'] = 'bytes=0-199999';
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in obj) {
                value = obj[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
        /*--end--http post 方法的传参格式更改*/


    }])
    .run(['$http', 'CacheFactory', function ($http, CacheFactory) {
        $http.defaults.cache = CacheFactory('defaultCache', {
            maxAge: 5 * 1000, // Items added to this cache expire after 15 minutes
            cacheFlushInterval: 5 * 1000, // This cache will clear itself every hour
            deleteOnExpire: 'aggressive' // Items will be deleted from this cache when they expire
        });
    }])
    .service("appConfig", ['$cookies', function ($cookies) {
        var config = {};
        config.mode = 'dev';
        //config.regionId = $cookies.get("regionId");
        //config.phone = $cookies.get("phone");
        config.providerType = "";
        config.staticServer = "";
        switch (config.mode) {
            case 'debug':
                config.applianceService = "";
                break;
            case 'dev':
                config.businessService = "";
                config.orderList = "";
                if ($cookies.get("") == null)
                    $cookies.put("", "");
                if ($cookies.get("") == null)

                    $cookies.put("", "");
                break;
            case '':
                config.apiService = "";
                config.staticServer = "";
                break;
            case '':
                config.apiService = "";
                config.staticServer = "";
                break;
        }

        return config;
    }]);

