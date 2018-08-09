app.controller('EventDetails_Ctrl', function($scope, $uibModalInstance, $timeout) {
	$scope.activeOwner = 0;	
	$scope.Hide = function () {
		$uibModalInstance.close('ok');
	};
	$scope.setActiveOwner = function (idx) {
		if ($scope.params.owners.length > 0) {
            angular.forEach($scope.params.owners, function (value, key) {
                value.state = '';
            });
            $scope.params.owners[idx].state = 'selected';
            $scope.activeOwner = idx;
        }
    };
});