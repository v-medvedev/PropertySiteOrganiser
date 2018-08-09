app.controller('RescheduleLetters_Ctrl', function ($rootScope, $scope, $uibModal, $uibModalInstance, $timeout) {

    $scope.data = $scope.params;
    $scope.scheduledDate = $scope.data.letterDate;
    $scope.openedDateLetter = false;

    $scope.openDatePicker = function () {
        $timeout(function () {
            $scope.openedDateLetter = true;
        });
    };

    $scope.Confirm = function () {
        $uibModalInstance.close($scope.scheduledDate);
    };

    $scope.Cancel = function () {
        $uibModalInstance.dismiss();
    };

});