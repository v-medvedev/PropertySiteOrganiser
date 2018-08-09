app.controller('RemoveProperty_Ctrl', function ($scope, $uibModalInstance, $timeout) {
    $scope.Confirm = function () {
        $uibModalInstance.close();
    };
    $scope.Cancel = function () {
        $uibModalInstance.dismiss();
    };
});