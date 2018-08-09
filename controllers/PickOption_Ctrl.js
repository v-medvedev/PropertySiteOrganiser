app.controller('PickOption_Ctrl', function ($scope, $uibModalInstance, $timeout) {
    $scope.Confirm = function () {
        $uibModalInstance.close($scope.propertyValue);
    };
    $scope.Cancel = function () {
        $uibModalInstance.dismiss();
    };
});