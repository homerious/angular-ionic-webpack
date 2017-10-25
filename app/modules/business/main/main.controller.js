module.exports = angular.module('app.business')
    .controller('mainCtrl', ['$scope', '$http', '$stateParams', '$state', '$rootScope', '$filter', appointmentManagementCtrl])


function appointmentManagementCtrl($scope, $http, $stateParams, $state, $rootScope, $filter) {

    $scope.eventSource = [];
    $scope.currentMonth = new Date().getMonth()+1; //日历控件参数
    $scope.morning = ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00'];
    $scope.afternoon = ['2:00', '2:30', '3:00', '3:30', "4:00", "4:30", '5:00', '5:30'];
    $scope.evening = ['7:00', '7:30', '8:00', '8:30', '9:00', '9:30', '10:00'];
    $scope.appointmentNumList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

    $scope.onTimeSelected = function (selectedTime) {
        $scope.currentDate = $filter('date')(selectedTime, 'yyyy-MM-dd');
        loadData($scope.currentDate);
    };

    $scope.onMonthChanged = function (startTime, endTime, display) {
        $scope.currentMonth = display;
        loadEvents();
        console.log('Changed month : ' + display);
    };

}



