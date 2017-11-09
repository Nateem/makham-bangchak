angular.module('app')
    .controller('oilController', function($rootScope,$interval,$filter,$state, $scope, $http, notificationService) {
        var LoadInit = function(){
        	$scope.form = {};
        	$scope.form.PRICE = 0;
            $scope.detail = "กรอกเลขสมาชิก";
        	$(function() {
                $("#PRICE").focus();
            })
        }
        LoadInit();
        $scope.dateConvert = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss', '+0700');
        $interval(function(){
        	//console.log("setInterval");
        	$scope.dateConvert = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss', '+0700');
        },1000);
        
        $scope.addBank = function(bank) {
            //console.log("click...");
            $scope.form.PRICE += bank;
            $(function() {
                $("#CUS_CODE").focus();
            })
        }
        $scope.selectEventLast = function(){
        	$http({
                    method: "POST",
                    url: 'models/oil.model.php',
                    data: {
                        TYPES: 'SELECT_orders',                        
                        CURRENT_DATA: $rootScope.globals.currentDATA
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function(data) {
                    //console.log(data);
                    if (data.ERROR == false) {
                    	$scope.dataRepeat = data.DATA;
                    }                   
                });
        }
        $scope.selectEventLast();
        $scope.formSave = function(formName) {
            //console.log("formSave...");
            $http({
                    method: "POST",
                    url: 'models/oil.model.php',
                    data: {
                        TYPES: 'INSERT_orders',
                        FORM_DATA: $scope.form,
                        CURRENT_DATA: $rootScope.globals.currentDATA
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function(data) {
                    //console.log(data);

                    if (data.ERROR == false) {
                        formName.$setPristine();                        
                        $scope.selectEventLast();
                        LoadInit();
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
        $scope.chkCode = function(code) {
            if (code) {
                if (code.length == 5) {
                    $http({
                            method: "POST",
                            url: 'models/edit.model.php',
                            data: {
                                TYPES: 'SELECT_orders_code',
                                CURRENT_DATA: $rootScope.globals.currentDATA,
                                CUS_CODE: code
                            },
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        })
                        .success(function(data) {
                            //console.log(data);
                            if (data.ERROR == false) {
                                $scope.detail = code + ' | ' + data.DATA.STNA + data.DATA.CUS_FNAME + ' ' + data.DATA.CUS_LNAME;
                            } else {
                                $scope.detail = data.MSG;
                            }
                        });
                } else {
                    $scope.detail = "เลขสมาชิกมีจำนวน 5 หลัก";
                }
            } else {
                $scope.detail = "กรอกเลขสมาชิก";
            }

        }
        $scope.goSearch = function(inpId,title,w,h){
            //console.log(inpId);
            var url = $state.href("searchCustomer",{inpId:inpId});
            var left = (screen.width/2)-(w/2);
            var top = (screen.height/2)-(h/1.5);
            var win = window.open(url, title, 'toolbar=no, location=0, directories=0, status=0, menubar=0, scrollbars=0, resizable=0, copyhistory=0, width='+w+', height='+h+', top='+top+', left='+left);
            win.focus();
        }
    })
