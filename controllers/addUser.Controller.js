angular.module('app')
    .controller('addUserController', function($rootScope, $scope, $http,notificationService) {
        $scope.loadInit = function() {
            $scope.form = {};
            $scope.pattern = /^[a-zA-Z0-9]*$/;
            $scope.minlength = 5;
        }
        $scope.loadInit();
        $scope.formAddUserSubmit = function(formname) {
            $http({
                    method: "POST",
                    url: 'models/addUser.model.php',
                    data: {
                        TYPES: 'INSERT_user',
                        CURRENT_DATA: $rootScope.globals.currentDATA,
                        FORM_DATA:$scope.form
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function(data) {
                    console.log(data);
                    if (data.ERROR == false) {
                        formname.$setPristine();
                        $scope.loadInit();
                    }
                    notificationService.notify({
                        title: 'ระบบตอบรับ',
                        text: data.MSG,
                        styling: "bootstrap3",
                        type: data.TYPE,
                        icon: true
                    });
                });
        }
    })
