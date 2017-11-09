angular.module('app')
	.controller('menu_navbar', ['$scope', '$location', function ($scope, $location) {
		$scope.menu = menu_json;
		//$scope.urlName = $stateProvider.state.name;

	}])
	.controller('sidebar-footer', ['$scope', function ($scope) {
		$scope.toggleFullScreen = function () {
			if ((document.fullScreenElement && document.fullScreenElement !== null) ||
				(!document.mozFullScreen && !document.webkitIsFullScreen)) {
				if (document.documentElement.requestFullScreen) {
					document.documentElement.requestFullScreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullScreen) {
					document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			} else {
				if (document.cancelFullScreen) {
					document.cancelFullScreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
			}
		};

	}]);