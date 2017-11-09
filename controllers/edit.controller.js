angular.module('app')
    .controller('editController', function($rootScope, $scope, $filter, $compile, DTOptionsBuilder, DTColumnBuilder, $http, $q, notificationService) {
        var vm = this;
        $scope.edit = {};
        $scope.detail = "เลือกรายการขวามือ";
        vm.message = '';
        vm.edit = edit;
        vm.persons = {};
        vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
                var defer = $q.defer();
                $http({
                        method: "POST",
                        url: 'models/edit.model.php',
                        data: {
                            TYPES: 'SELECT_orders',
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
            .withOption('createdRow', createdRow);


        vm.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable()
            .renderWith(actionsHtml),
            DTColumnBuilder.newColumn('CURDATETIME').withTitle('เมื่อ'),
            DTColumnBuilder.newColumn('AUMNO').withTitle('กลุ่ม'),
            DTColumnBuilder.newColumn('CUS_DATA').withTitle('สมาชิก'),
            DTColumnBuilder.newColumn('PRICE').withTitle('เติมน้ำมัน').withClass("text-right"),
            DTColumnBuilder.newColumn('OTHER').withTitle('อื่นๆ'),

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
            return '<button class="btn btn-warning" ng-click="showCase.edit(' + full.ID + ')">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>';
        }

        function edit(id) {
            //console.log(id);
            $scope.edit.ID = id;
            $http({
                    method: "POST",
                    url: 'models/edit.model.php',
                    data: {
                        TYPES: 'SELECT_orders_where',
                        CURRENT_DATA: $rootScope.globals.currentDATA,
                        ORDER_ID: id
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function(data) {
                    //console.log(data);
                    if (data.ERROR == false) {
                        $scope.edit.CUS_CODE = data.DATA.GENCODE;
                        $scope.edit.PRICE = Number(data.DATA.PRICE);
                        $scope.chkCode(data.DATA.GENCODE);
                        $(function() {
                            $("#iCODE").focus(function() {
                                $(this).select();
                            });
                        })
                    }
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
                                $scope.detail = data.DATA.STNA + data.DATA.CUS_FNAME + ' ' + data.DATA.CUS_LNAME;
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
        $scope.formEditSubmit = function(myform) {
            //console.log('test....');
            $http({
                    method: "POST",
                    url: 'models/edit.model.php',
                    data: {
                        TYPES: 'UPDATE_orders',
                        CURRENT_DATA: $rootScope.globals.currentDATA,
                        FORM_DATA: $scope.edit,
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .success(function(data) {
                    //console.log(data);
                    if (data.ERROR == false) {
                        $scope.detail = "เลือกรายการขวามือ";
                        $scope.edit = {};
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
                        url: 'models/edit.model.php',
                        data: {
                            TYPES: 'DELETE_orders',
                            CURRENT_DATA: $rootScope.globals.currentDATA,
                            FORM_DATA: $scope.edit,
                        },
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .success(function(data) {
                        console.log(data);
                        if (data.ERROR == false) {
                            $scope.detail = "เลือกรายการขวามือ";
                            $scope.edit = {};
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
