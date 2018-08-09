app.controller('RemoveToDo_Ctrl', function($rootScope, $scope, $http, $uibModal, $uibModalInstance, $timeout) {
	$scope.Confirm = function () {
    	$uibModalInstance.close();
 	};
 	$scope.Cancel = function () {
    	$uibModalInstance.dismiss();
 	};
});