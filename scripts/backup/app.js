'use strict';

// declare modules
angular.module('Authentication', []);
var menu_json = [
      {
        "name": "home",
        "url": "/",
        "templateUrl": "views/home.view.html",
        'controller': 'homeController',
        "TH_name": "หน้าแรก",
        "EN_name": "Home",
        "ICO_CLASS":'fa fa-home'
      },
      {
        "TH_name": "รับจ่าย",
        "EN_name": "Income",
        "ICO_CLASS":'fa fa-money',
        "dropdown":[
          {
            "name": "income",
            "url": "/income",
            "templateUrl": "views/income.view.html",
            'controller': 'incomeController',
            "TH_name": "รายรับ",
            "EN_name": "Income",
            "ICO_CLASS":'fa fa-arrow-circle-down'
          },
          {
            "name": "spend",
            "url": "/spend",
            "templateUrl": "views/spend.view.html",
            'controller': 'spendController',
            "TH_name": "รายจ่าย",
            "EN_name": "Spend",
            "ICO_CLASS":'fa fa-arrow-circle-up'
          }
          ,
          {
            "name": "chart",
            "url": "/chart",
            "templateUrl": "views/chart.view.html",
            'controller': 'chartController',
            "TH_name": "แผนภูมิ",
            "EN_name": "Chart",
            "ICO_CLASS":'fa fa-area-chart'
          }      
        ]
      }
      ,
      
      {
        "TH_name": "สินค้า",
        "EN_name": "Goods",
        "ICO_CLASS":'fa fa-envira',
        "dropdown":[
             {
                "name": "goodsNameAdd",
                "url": "/goodsNameAdd",
                "templateUrl": "views/goodsNameAdd.view.html",
                'controller': 'goodsNameAddController',
                "TH_name": "เพื่มชื่อผลผลิต",
                "EN_name": "Goods Add Name"
            },
            {
                "name": "goodsCreate",
                "url": "/goodsCreate",
                "templateUrl": "views/goodsCreate.view.html",
                'controller': 'goodsCreateController',
                "TH_name": "ผลิตสินค้า",
                "EN_name": "Goods"
            },
            {
                "name": "goodsList",
                "url": "/goodsList",
                "templateUrl": "views/goodsList.view.html",
                'controller': 'goodsListController',
                "TH_name": "รายการ",
                "EN_name": "List"
            },
            {
                "name": "goodsEvents",
                "url": "/goodsEvents/:goodsCode",
                "templateUrl": "views/goodsEvents.view.html",
                'controller': 'goodsEventsController',
                "TH_name": "รายละเอียด",
                "EN_name": "List"
            },
            {
                "name": "goodsAdvertise",
                "url": "/goodsAdvertise/:goodsCode",
                "templateUrl": "views/goodsAdvertise.view.html",
                'controller': 'goodsAdvertiseController',
                "TH_name": "โปรโมทสินค้า",
                "EN_name": "Advertise"
            }


        ]
      }
  ];
angular.module('app', [
    'Authentication',
    'ui.router',
    'ngCookies',
    'chart.js',
    'ui.notify',
    'ngFileUpload',
    'ngTagsInput',
    'monospaced.qrcode'
])
.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input, decimals) + '%';
  };
}]) 
.filter('thaidate',function(){
    return function(input){

        var month_name;
        var year= input.substr(0,4);
        var month=input.substr(5,2);
        var day=input.substr(8,2);

        switch(Number(month)){
          case 1:
            month_name="มกราคม";
            break;
          case 2:
            month_name="กุมภาพันธ์";
            break;
          case 3:
            month_name="มีนาคม";
            break;
          case 4:
            month_name="เมษายน";
            break;
          case 5:
            month_name="พฤษภาคม";
            break;
          case 6:
            month_name="มิถุนายน";
            break;
          case 7:
            month_name="กรกฎาคม";
            break;
          case 8:
            month_name="สิงหาคม";
            break;
          case 9:
            month_name="กันยายน";
            break;
          case 10:
            month_name="ตุลาคม";
            break;
          case 11:
            month_name="พฤศจิกายน";
            break;
          case 12:
            month_name="ธันวาคม";
            break;
        }
        var budha_year=Number(year)+543;
        return  day + " " + month_name + " " + budha_year;

    }
})
.config(['$stateProvider','$urlRouterProvider','notificationServiceProvider',function($stateProvider,$urlRouterProvider,notificationServiceProvider) {

     notificationServiceProvider.setDefaults({
        history: false,
        delay: 4000,
        styling: 'bootstrap3',
          closer: false,
          closer_hover: false
      });

    var spd = $stateProvider;
    var funcController = function($rootScope,$scope,$state){
    	$scope.stateName = $state.current.data.stateName;
        $rootScope.globals.stateName = $state.current.data.stateName;
        $scope.stateICO_CLASS = $state.current.data.stateICO_CLASS;	
    }
    
    //$rootScope.menu_json = menu_json;
    angular.forEach(menu_json,function(value1,key){

        if(!value1.name){

            angular.forEach(value1.dropdown,function(value2,key2){
                if(!value2.name){
                    angular.forEach(value2.dropdown, function(value3,key3){
                        spd.state({
                            name: value3.name,
                            url: value3.url,
                            templateUrl: value3.templateUrl,
                            data:{
                                stateName: value3.TH_name,
                                stateICO_CLASS: value3.ICO_CLASS 
                            },
                            controller: funcController
                        });
                    });
                }
                else{
                    spd.state({
                        name: value2.name,
                        url: value2.url,
                        templateUrl: value2.templateUrl,
                        data:{
                            stateName: value2.TH_name,
                            stateICO_CLASS: value2.ICO_CLASS 
                        },
                        controller: funcController
                    });
                }                 

            });

        }
        else{

            spd.state({ 
                name: value1.name,        
                url: value1.url,
                templateUrl: value1.templateUrl,
                data:{
                    stateName: value1.TH_name,
                    stateICO_CLASS: value1.ICO_CLASS 
                },
                controller: funcController
            }); 

        }
        
    });
    spd.state({ 
        name: 'register',         
        url: '/register',
        templateUrl: 'views/register.view.html',
        data:{
            stateName: 'ลงทะเบียน',
            stateICO_CLASS: 'fa fa-registered'
        },
        controller: funcController
    });
    spd.state({ 
        name: 'login',         
        url: '/login',
        templateUrl: 'modules/authentication/views/login.view.html',
        data:{
            stateName: 'เข้าสู่ระบบ',
            stateICO_CLASS: 'fa fa-sign-in'
        },
        controller: funcController
    });
    spd.state({ 
        name: 'error404',         
        url: '/error404',
        templateUrl: 'views/error404.view.html',
        data:{
            stateName: 'ไม่พบหน้าที่ร้องขอ',
            stateICO_CLASS: 'fa fa-exclamation-triangle'
        },
        controller: funcController
    }); 
    $urlRouterProvider.otherwise('/');
}])
/*
.config(['$routeProvider', function ($routeProvider) {

    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html',
            hideMenus: true
        })
 
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
 
        .otherwise({ redirectTo: '/login' });
}])
 */
.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh.    
        $rootScope.$HideNav = function(){
            $(function(){   
                var  $BODY = $('body'),$MENU_TOGGLE = $('#menu_toggle');
                $("a.link").click(function(){                       
                    if ($BODY.hasClass('nav-sm')) {
                       $MENU_TOGGLE.click();
                    } 
                });
            })
        }
        $rootScope.$HideNav();

        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        }
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser && $location.path() !== '/register') {
                $location.path('/login');
            }
        });
    }]);