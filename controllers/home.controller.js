angular.module('app')
	.controller('homeController', ['$rootScope','$scope', function($rootScope,$scope){
		$scope.controllerName = 'homeController';
		$scope.menu = menu_json;

	}])