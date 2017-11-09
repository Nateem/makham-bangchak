angular.module('app')
    .controller('setCustomerController', function($rootScope, $scope, $filter, $compile, DTOptionsBuilder, DTColumnBuilder, $http, $q, notificationService) {
        var loadInit = function() {
            $scope.form = {};
            $scope.detail = "เลือกรายการขวามือ";
        }
        loadInit();
        var vm = this;
        vm.message = '';
        
        vm.form = setCustomer;
        vm.persons = {};
        vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
                var defer = $q.defer();
                $http({
                        method: "POST",
                        url: 'models/setCustomer.model.php',
                        data: {
                            TYPES: 'SELECT_customer',
                            CURRENT_DATA: $rootScope.globals.currentDATA
                        },
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .success(function(data) {
                        //console.log(data);
                        if (data.ERROR == false) {
                            defer.resolve(data.DATA);
                        }
                    });
                return defer.promise;
            })
            .withPaginationType('full_numbers')
            .withOption('responsive', true)
            .withOption('createdRow', createdRow)
            .withButtons([{
                    extend: 'excel',
                    text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Excel',
                    className:"btn-success", 
                }, {
                    extend: 'print',
                    text: '<i class="fa fa-print"></i> พิมพ์', 
                    className:"btn-danger"
                }
            ]);


        vm.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('').notSortable()
            .renderWith(actionsHtml),
            DTColumnBuilder.newColumn('MASCODE').withTitle('รหัสสมาชิก'), 
            DTColumnBuilder.newColumn('AUMNO').withTitle('กลุ่ม'), 
            DTColumnBuilder.newColumn('customer_NAME').withTitle('ชื่อ'),         
            DTColumnBuilder.newColumn('TEL').withTitle('เบอร์โทรศัพท์'),           
        ];
        vm.dtInstance = {};
        vm.reloadData = reloadData;

        function reloadData() {
            vm.dtInstance.reloadData();
        };

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            $compile(angular.element(row).contents())($scope);
        }

        function actionsHtml(data, type, full, meta) {
            return '<button class="btn btn-warning" ng-click="showCase.form(' + full.ID + ')">' +
                ' <i class="fa fa-hand-o-left" aria-hidden="true"></i>' +
                '</button>';
        }

        function setCustomer(id) {
            //console.log(id);
            $scope.form.ID = id;
            $http({
                    method: "POST",
                    url: 'models/setCustomer.model.php',
                    data: {
                        TYPES: 'SELECT_customer_where',
                        CURRENT_DATA: $rootScope.globals.currentDATA,
                        customer_ID: id
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function(data) {
                    //console.log(data);
                    if (data.ERROR == false) {
                        $scope.form.ID = data.DATA.ID;
                        $scope.form.MASCODE = data.DATA.MASCODE;
                        $scope.form.AUMNO = data.DATA.AUMNO;
                        $scope.form.STNA = data.DATA.STNA;
                        $scope.form.NAME = data.DATA.NAME;
                        $scope.form.SURNAME = data.DATA.SURNAME;
                        $scope.form.TEL = data.DATA.TEL;
                        
                    }
                });
        }

        
        $scope.formSettingSubmit = function(myform,submitType) {
            if(submitType=="INSERT"){
                $http({
                    method: "POST",
                    url: 'models/setCustomer.model.php',
                    data: {
                        TYPES: 'INSERT_customer',
                        CURRENT_DATA: $rootScope.globals.currentDATA,
                        FORM_DATA: $scope.form,
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function(data) {
                    //console.log(data);
                    if (data.ERROR == false) {
                        loadInit();
                        myform.$setPristine();
                        vm.dtInstance.reloadData();
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
            else if(submitType=="UPDATE"){
                $http({
                    method: "POST",
                    url: 'models/setCustomer.model.php',
                    data: {
                        TYPES: 'UPDATE_customer',
                        CURRENT_DATA: $rootScope.globals.currentDATA,
                        FORM_DATA: $scope.form,
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function(data) {
                    //console.log(data);
                    if (data.ERROR == false) {
                        loadInit();
                        myform.$setPristine();
                        vm.dtInstance.reloadData();
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
            

        }
        $scope.deleteData = function(myform, ID) {
            notificationService.notify({
                title: 'ยืนยัน',
                text: 'คุณต้องการลบรายการนี้ใช่หรือไม่?',
                hide: false,
                styling: "bootstrap3",
                animate: {
                    animate: true,
                    in_class: 'bounceInLeft',
                    out_class: 'bounceOutRight'
                },
                confirm: {
                    confirm: true,
                },
                buttons: {
                    closer: false,
                    sticker: false
                },
                history: {
                    history: false
                }
            }).get().on('pnotify.confirm', function() {
                $http({
                        method: "POST",
                        url: 'models/setCustomer.model.php',
                        data: {
                            TYPES: 'DELETE_customer',
                            CURRENT_DATA: $rootScope.globals.currentDATA,
                            FORM_DATA: $scope.form,
                        },
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .success(function(data) {
                        //console.log(data);
                        if (data.ERROR == false) {
                            loadInit();
                            myform.$setPristine();
                            vm.dtInstance.reloadData();
                        }
                        notificationService.notify({
                            title: 'ระบบตอบรับ',
                            text: data.MSG,
                            styling: "bootstrap3",
                            type: data.TYPE,
                            icon: true
                        });
                    });
            }).on('pnotify.cancel', function() {
                //event
            });

        }



    })
