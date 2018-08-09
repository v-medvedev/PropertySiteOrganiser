app.controller('UploadTemplates_Ctrl', function ($scope, $http, $uibModalInstance, $timeout) {
    console.log('UploadTemplates_Ctrl');
    $scope.getTheFiles = function ($files) {
        console.log('getTheFiles');
        var file = $files[0];
        console.log('uploading file: ' + file.name);
        var uploadUrl = "./upload.php";
        var fd = new FormData();
        fd.append('fname', file.name);
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function (data) {
            console.log(data);
        }).error(function (e) {
            console.log(e);
        });
    };
    $scope.Hide = function () {
        $uibModalInstance.close('ok');
    };
});