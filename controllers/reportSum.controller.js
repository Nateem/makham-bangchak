angular.module('app')
	.controller('reportSumController', function($rootScope,$filter,$scope,DTOptionsBuilder,DTColumnBuilder,$q,$http){
		$scope.form = {};
		$scope.form.DateStart = $rootScope.GetCurrentDateTime;
		$scope.form.DateEnd = $rootScope.GetCurrentDateTime;
		$scope.form.ChooseData = "SOMEHAVE";
        $scope.form.PunPon = 0;
        $scope.SUMTOTAL = 0;
		$scope.dtInstance = {};
         var pathHost = $rootScope.pathHost;
		$scope.loadReady = function(){
		$scope.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
                var defer = $q.defer();
                $http({
                        method: "POST",
                        url: 'models/reportSum.model.php',
                        data: {
                            TYPES: 'SELECT_control',
                            CURRENT_DATA: $rootScope.globals.currentDATA,
                            FORM_DATA:$scope.form
                        },
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .success(function(data) {
                        //console.log(data.SUMTOTAL);
                        if (data.ERROR == false) {
                            $scope.SUMTOTAL = data.SUMTOTAL;
                            $scope.SUMTOTAL_PUNPON = data.SUMTOTAL_PUNPON;
                            defer.resolve(data.DATA);
                        }
                    });
                return defer.promise;
            })
            .withPaginationType('full')
            .withOption('responsive', true)
            .withDOM('frtip')
            .withButtons([{
                    extend: 'excel',
                    text: '<i class="fa fa-file-excel-o" aria-hidden="true"></i> Excel',
                    className:"btn-success", 
                }, {
                    extend: 'print',
                    text: '<i class="fa fa-print"></i> พิมพ์', 
                    className:"btn-danger",                   
                    message: 'ตั้งแต่วันที่ ' + $filter('date')($scope.form.DateStart, "yyyy/MM/dd") + " ถึง " + $filter('date')($scope.form.DateEnd, "yyyy/MM/dd") + '<br> ปัญผล : ' + $scope.form.PunPon + '%',
                    customize: function(win) {
                        $(win.document.body)
                            .css('font-size', '16px')
                            .prepend(
                                '<img src="' + pathHost + '/img/logo/logo_color.png" width="65px" style="opacity:0.4;filter:alpha(opacity=40);position:absolute; top:0; left:0;" />'
                            );
                        $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit')
                            .append('<tfoot><tr><th style="text-align:right" colspan="3">รวม:</th><th>'+ $scope.SUMTOTAL +'</th><th>'+ $scope.SUMTOTAL_PUNPON +'</th></tr></tfoot>');
                    }
                }

            ]);


        $scope.dtColumns = [           
        	DTColumnBuilder.newColumn('AUMNO').withTitle('กลุ่ม').withClass("text-center"), 
        	DTColumnBuilder.newColumn('GENCODE').withTitle('รหัส').withClass("text-center"), 
            DTColumnBuilder.newColumn('CUS_DATA').withTitle('ชื่อ'),
            DTColumnBuilder.newColumn('PRICE').withTitle('ยอดรวม').withClass("text-right"),
            DTColumnBuilder.newColumn('PUNPON_PRICE').withTitle('ปัญผล').withClass("text-right")

        ];        
    }
    $scope.loadReady();
        $scope.reloadData = function () {
        	$scope.loadReady();
            $scope.dtInstance.reloadData();
        };
	})