'use strict';

// declare modules
angular.module('Authentication', []);
var menu_json = [{
        "name": "home",
        "url": "/",
        "templateUrl": "views/home.view.html",
        'controller': 'homeController',
        "TH_name": "หน้าแรก",
        "EN_name": "Home",
        "menu_hide": false,
        "ICO_CLASS": './img/icon/Home.png'
    },{
        "name": "searchCustomer",
        "url": "/searchCustomer/:inpId",
        "templateUrl": "views/searchCustomer.view.html",
        'controller': 'searchCustomerController',
        "TH_name": "ค้นหาสมาชิก",
        "EN_name": "Search Customer",
        "menu_hide": true
    },{
        "TH_name": "ข้อมูล",
        "EN_name": "Oil Data",
        "ICO_CLASS": './img/icon/Gas Station.png',
        "dropdown": [{
            "name": "oil",
            "url": "/oil",
            "templateUrl": "views/oil.view.html",
            'controller': 'oilController',
            "TH_name": "บันทึกข้อมูล",
            "EN_name": "Oil Save Data",
            "menu_hide": false,
            "ICO_CLASS": 'fa fa-arrow-circle-down'
        },{
            "name": "edit",
            "url": "/edit",
            "templateUrl": "views/edit.view.html",
            'controller': 'editController',
            "TH_name": "แก้ไข/ยกเลิก",
            "EN_name": "Edit Data",
            "menu_hide": false,
            "ICO_CLASS": 'fa fa-pencil-square-o'
        }]
    },{
        "TH_name": "รายงาน",
        "EN_name": "Report Oil Data",
        "ICO_CLASS": './img/icon/Area Chart-96.png',
        "dropdown": [{
            "name": "reportSum",
            "url": "/reportSum",
            "templateUrl": "views/reportSum.view.html",
            'controller': 'reportSumController',
            "TH_name": "รายงานยอดรวม",
            "EN_name": "Report Sum",
            "menu_hide": false,
            "ICO_CLASS": 'fa fa-bar-chart'
        },{
            "name": "reportDetail",
            "url": "/reportDetail",
            "templateUrl": "views/reportDetail.view.html",
            'controller': 'reportDetailController',
            "TH_name": "รายงานรายละเอียด",
            "EN_name": "Report Detail",
            "menu_hide": false,
            "ICO_CLASS": 'fa fa-bar-chart-o'
        },{
            "name": "reportGroup",
            "url": "/reportGroup",
            "templateUrl": "views/reportGroup.view.html",
            'controller': 'reportGroupController',
            "TH_name": "รายงานรายกลุ่ม",
            "EN_name": "Report Group",
            "menu_hide": false,
            "ICO_CLASS": 'fa fa-users'
        }]
    },{
        "TH_name": "ตั้งค่า",
        "EN_name": "Setting",
        "ICO_CLASS": './img/icon/Settings-100.png',
        "dropdown": [{
            "name": "addUser",
            "url": "/addUser",
            "templateUrl": "views/addUser.view.html",
            'controller': 'addUserController',
            "TH_name": "เพิ่มผู้ใช้งาน",
            "EN_name": "User Add",
            "menu_hide": false,
            "ICO_CLASS": 'fa fa-user-plus'
        },
        {
            "name": "setCustomer",
            "url": "/setCustomer",
            "templateUrl": "views/setCustomer.view.html",
            'controller': 'setCustomerController',
            "TH_name": "จัดการสมาชิก",
            "EN_name": "Customer Control",
            "menu_hide": false,
            "ICO_CLASS": 'fa fa-users'
        }]
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
        'monospaced.qrcode',
        'ngLoadingSpinner',
        'ckeditor',
        'datatables',
        'datatables.buttons'
    ])
    .config(['$stateProvider', '$urlRouterProvider', 'notificationServiceProvider', function($stateProvider, $urlRouterProvider, notificationServiceProvider) {

        notificationServiceProvider.setDefaults({
            history: false,
            delay: 4000,
            styling: 'bootstrap3',
            closer: false,
            closer_hover: false
        });

        var spd = $stateProvider;
        var funcController = function($rootScope, $scope, $state) {
            $scope.stateName = $state.current.data.stateName;
            $rootScope.globals.stateName = $state.current.data.stateName;
            $scope.stateICO_CLASS = $state.current.data.stateICO_CLASS;
        }

        //$rootScope.menu_json = menu_json;
        angular.forEach(menu_json, function(value1, key) {

            if (!value1.name) {

                angular.forEach(value1.dropdown, function(value2, key2) {
                    if (!value2.name) {
                        angular.forEach(value2.dropdown, function(value3, key3) {
                            spd.state({
                                name: value3.name,
                                url: value3.url,
                                templateUrl: value3.templateUrl,
                                data: {
                                    stateName: value3.TH_name,
                                    stateICO_CLASS: value3.ICO_CLASS
                                },
                                controller: funcController
                            });
                        });
                    } else {
                        spd.state({
                            name: value2.name,
                            url: value2.url,
                            templateUrl: value2.templateUrl,
                            data: {
                                stateName: value2.TH_name,
                                stateICO_CLASS: value2.ICO_CLASS
                            },
                            controller: funcController
                        });
                    }

                });

            } else {

                spd.state({
                    name: value1.name,
                    url: value1.url,
                    templateUrl: value1.templateUrl,
                    data: {
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
            data: {
                stateName: 'ลงทะเบียน',
                stateICO_CLASS: 'fa fa-registered'
            },
            controller: funcController
        });
        spd.state({
            name: 'login',
            url: '/login',
            templateUrl: 'modules/authentication/views/login.view.html',
            data: {
                stateName: 'เข้าสู่ระบบ',
                stateICO_CLASS: 'fa fa-sign-in'
            },
            controller: funcController
        });
        spd.state({
            name: 'error404',
            url: '/error404',
            templateUrl: 'views/error404.view.html',
            data: {
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
    .directive('myEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .run(function($rootScope, $cookieStore, $http, $location, notificationService, $state) {
        //$rootScope.pathHost = $location.protocol()+ '://' + location.host + "/makham_bangchak";
        $rootScope.pathHost = $location.protocol()+ '://' + location.host;
        // keep user logged in after page refresh.    
        $rootScope.$HideNav = function() {
            $(function() {
                var $BODY = $('body'),
                    $MENU_TOGGLE = $('#menu_toggle');
                $("a.link").click(function() {
                    if ($BODY.hasClass('nav-sm')) {
                        $MENU_TOGGLE.click();
                    }
                });
            })
        }
        var offset = 7;//bangkok thailand +7
        $rootScope.GetCurrentDateTime =  new Date( new Date().getTime() + offset * 3600 * 1000);
        $rootScope.$HideNav();

        var globals = $cookieStore.get('globals') || {};
        $rootScope.globals = globals;
        if (globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + globals.currentUser.authdata; // jshint ignore:line
        }
        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            // redirect to login page if not logged in

            if ($state.current.name !== 'login' && !$rootScope.globals.currentUser && $state.current.name !== 'register') {
                event.preventDefault();
                $state.go('login');
                notificationService.notify({
                    title: 'คำเตือน',
                    text: 'Please login! | กรุณาเข้าสู่ระบบ',
                    styling: "bootstrap3",
                    type: "warning",
                    icon: true
                });
            }
            // console.log($state.current.name);
        });

    });
