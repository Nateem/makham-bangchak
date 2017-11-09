angular.module('app')
	.controller('registerController', ['$scope','$http','$timeout','Upload','notificationService', function($scope,$http,$timeout,Upload,notificationService){
		$scope.LoadData = function(){
			$http({
	            method: "POST",
				url: 'models/selectAjax.php',         
	            data : {
	            	TYPES : 'SELECT_PREFIX',            	
	            },
	            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
			})
			.success(function(data, status, headers, config){
				//console.log(data);
				if(data.ERROR==false){
					$scope.prefixRepeat = data.DATA;
				}
				
			});		
			$http({
	            method: "POST",
				url: 'models/selectAjax.php',         
	            data : {
	            	TYPES : 'SELECT_PROVINCE',            	
	            },
	            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
			})
			.success(function(data, status, headers, config){
				//console.log(data);
				if(data.ERROR==false){
					$scope.provinceRepeat = data.DATA;
				}
				
			});
			$scope.progress = 0;
		}
		$scope.LoadData();		
		$scope.SelectProvinceChange = function(){
			$scope.user.amphurSelect = "";
			$scope.user.districtSelect = "";
			$http({
				method: "POST",
				url: 'models/selectAjax.php',         
	            data : {
	            	TYPES : 'SELECT_AMPHUR',
	            	PROVINCE_ID : $scope.user.provinceSelect,
	            },
	            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  				
			})
			.success(function(data, status, headers, config){
				//console.log(data);
				if(data.ERROR==false){
					$scope.amphurRepeat = data.DATA;
				}
			});
		}
		$scope.SelectAmphurChange = function(){
			$scope.user.districtSelect = "";
			$http({
				method: "POST",
				url: 'models/selectAjax.php',         
	            data : {
	            	TYPES : 'SELECT_DISTRICT',
	            	PROVINCE_ID : $scope.user.provinceSelect,
	            	AMPHUR_ID : $scope.user.amphurSelect
	            },
	            headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  
			})
			.success(function(data, status, headers, config){
				//console.log(data);
				if(data.ERROR==false){
					$scope.districtRepeat = data.DATA;
				}
			});
		}
		$scope.registerFormSubmit = function(){
			//console.log($scope.user);
			/*
			$http({
				  method  : 'POST',
				  url     : 'models/register.model.php',
				  data    : {
				  	TYPES : 'SAVE_REGISTER_FORM',
				  	user : $scope.user
				  },  // pass in data as strings
				  headers : { 'Content-Type': 'application/x-www-form-urlencoded' }  // set the headers so angular passing info as form data (not request payload)
				 })
				 .success(function(data) {
				    //console.log(data);				    
				    $scope.alert = data;
				    if(data.ERROR==false){
				    	 $scope.user = null;
				    	 $scope.LoadData();
				    }
				 });	*/

			var upload = Upload.upload({
		      url: 'models/register.model.php',
		      method: 'POST',
		      data: {
		      	TYPES : 'SAVE_REGISTER_FORM',
		      	FORM_DATA: $scope.user, 
		      	imgForProfile : $scope.imgForProfile
		      },
		      //headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
		    });

		    upload.then(function (response) {
		    	//console.log(response);
		    	if(response.data.ERROR==false){
			    	 $scope.user = null;
			    	 $scope.imgForProfile = null;
			    	 $scope.LoadData();
				}
		    	$scope.NotifyMassage = function(){  						
			        notificationService.notify({
						title: 'ระบบตอบรับ',
						text: response.data.MSG,
						styling: "bootstrap3",
						type: response.data.TYPE,
						icon: true
					});
				}
				$scope.NotifyMassage();
				
		      $timeout(function () {
		        $scope.result = response.data;
		      });
		    }, function (response) {
		      if (response.status > 0)
		        $scope.errorMsg = response.status + ': ' + response.data;
		    }, function (evt) {
		      // Math.min is to fix IE which reports 200% sometimes
		      $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		    });	 
		}
		$scope.SetDelay = function(dulation){
			$scope.delay = true;
		    $timeout(function(){
		    	$scope.delay = false;
		    },dulation);
		}	
		


	}]);