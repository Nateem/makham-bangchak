'use strict';
 
angular.module('Authentication')
 
.controller('LoginController',
    ['$scope', '$rootScope', '$location', 'AuthenticationService','notificationService',
    function ($scope, $rootScope, $location, AuthenticationService,notificationService) {
        AuthenticationService.ClearCredentials($rootScope.globals);
        $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
                $scope.NotifyMassage = function(){                          
                    notificationService.notify({
                        title: 'ระบบตอบรับ',
                        text: response.message,
                        styling: "bootstrap3",
                        type: response.type,
                        icon: true
                    });
                }
                $scope.NotifyMassage();
                if(response.success) {
                    AuthenticationService.SetCredentials($scope.username,response.DATA);                    
                    $location.path('/');
                } else {               
                    $scope.dataLoading = false;
                }
            });
        };       
}]);