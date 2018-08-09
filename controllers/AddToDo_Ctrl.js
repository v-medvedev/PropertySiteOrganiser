app.controller('AddToDo_Ctrl', function ($rootScope, $scope, $http, $uibModal, $uibModalInstance, $timeout) {

    $scope.openedDateReminder = false;
    $scope.openedDateActual = false;

    $scope.todo = {
        title: '',
        description: '',
        dateReminder: new Date(),
        dateActual: new Date()
    };

    $scope.openDateReminderPicker = function () {
        $timeout(function () {
            $scope.openedDateReminder = true;
        });
    };
    $scope.openDateActualPicker = function () {
        $timeout(function () {
            $scope.openedDateActual = true;
        });
    };
    $scope.Save = function () {
        /* Save to DB */
        $http({
            url: './api.php',
            method: "POST",
            data: {
                "operation": "saveToDo",
                "title": $scope.todo.title,
                "description": $scope.todo.description,
                "date_redimnder": $scope.todo.dateReminder,
                "date_actual": $scope.todo.dateActual,
                "completed": 0
            }
        })
            .then(function (response) {
                // success
                // console.log(response.data);
            }, function (response) {
                // failed
                console.log(response.data);
            });
        $uibModalInstance.close($scope.todo);
    };
    $scope.Cancel = function () {
        $uibModalInstance.dismiss();
    };

});