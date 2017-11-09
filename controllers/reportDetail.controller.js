angular.module('app')
    .controller('reportDetailController', function($rootScope,$timeout,$location, $filter, $scope, DTOptionsBuilder, DTColumnBuilder, $q, $http) {
        $scope.form = {};
        $scope.form.DateStart = $rootScope.GetCurrentDateTime;
        $scope.form.DateEnd = $rootScope.GetCurrentDateTime;
        $scope.dtInstance = {};
        $scope.SUMTOTAL =0;
        var pathHost = $rootScope.pathHost;
        $scope.loadReady = function() {
            $scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
                    var defer = $q.defer();
                    $http({
                            method: "POST",
                            url: 'models/reportDetail.model.php',
                            data: {
                                TYPES: 'SELECT_control',
                                CURRENT_DATA: $rootScope.globals.currentDATA,
                                FORM_DATA: $scope.form
                            },
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        })
                        .success(function(data) {
                            //console.log(data);
                            if (data.ERROR == false) {
                                $scope.SUMTOTAL=data.SUMTOTAL;
                                defer.resolve(data.DATA);
                            }
                        });
                    return defer.promise;
                })
                .withPaginationType('full_numbers')
                .withOption('responsive', true)
                .withDOM('frtip')
                .withButtons([{
                        extend: 'excel',
                        text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Excel',
                        className: "btn-success",
                    }, {
                        extend: 'print',
                        text: '<i class="fa fa-print"></i> พิมพ์',
                        className: "btn-danger",
                        message: 'ตั้งแต่วันที่ ' + $filter('date')($scope.form.DateStart, "yyyy/MM/dd") + " ถึง " + $filter('date')($scope.form.DateEnd, "yyyy/MM/dd"),
                        customize: function(win) {
                            $(win.document.body)
                                .css('font-size', '16px')
                                .prepend(
                                    '<img src="'+ pathHost +'/img/logo/logo_color.png" width="65px" style="opacity:0.4;filter:alpha(opacity=40);position:absolute; top:0; left:0;" />'
                                );
                            $(win.document.body).find('table')
                                .addClass('compact')
                                .css('font-size', 'inherit')
                                .append('<tfoot><tr><th style="text-align:right" colspan="4">รวม:</th><th>'+ $scope.SUMTOTAL +'</th></tr></tfoot>');
                        }
                    }

                ]);

            

            $scope.dtColumns = [
                DTColumnBuilder.newColumn('AUMNO').withTitle('กลุ่ม').withClass("text-center"),
                DTColumnBuilder.newColumn('GENCODE').withTitle('รหัส').withClass("text-center"),
                DTColumnBuilder.newColumn('CUS_DATA').withTitle('ชื่อ'),
                DTColumnBuilder.newColumn('CURDATETIME').withTitle('วันที่'),
                DTColumnBuilder.newColumn('PRICE').withTitle('เติมน้ำมัน').withClass("text-right")

            ];
        }
        $scope.loadReady();
        $scope.reloadData = function() {
            $scope.loadReady();
            $scope.dtInstance.reloadData();
        };
    })
