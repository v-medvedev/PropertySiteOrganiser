app.controller('AddOwner_Ctrl', function ($scope, $rootScope, $uibModal, $uibModalInstance, $timeout, $log) {
    
    $scope.propertyTypes = ['Freehold', 'Leasehold'];
    $scope.qualifyOptions = ['Yes', 'No'];
    $scope.openedDateStage1 = false;
    $scope.openedDateStage2 = false;
    $scope.openedDateLetter1 = false;
    $scope.openedDateLetter2 = false;
    $scope.openedDateLetter3 = false;
    $scope.openedDateLetter4 = false;
    $scope.openedDateLetter5 = false;
    $scope.templatesLetter1 = ['Land Agent Approach', 'Land Agent Land Assembly Approach', 'Partnership Approach', 'Partnership Approach Land Assembly', 'Partnership Approach Land Title Split'];
    $scope.templateLetter1 = 'Land Agent Approach';
    $scope.stage2Options = ['Yes', 'No'];

    $scope.owner = {
        siteNotes: '',
        siteAddress: '',
        sitePostcode: '',
        titleNumber: '',
        streetName: '',
        propertyType: 'Freehold',
        ownerType: '',
        companyName: '',
        individualsNames: '',
        ownerAddress: '',
        titleArea: '',
        landinsightSite: '',
        landinsightTitle: '',
        qualify: '',
        templateLetter1: 'Land Agent Approach',
        dateLetter1: '',
        dateLetter2: '',
        dateLetter3: '',
        dateLetter4: '',
        dateLetter5: '',
        dateStage1: '',
        dateStage2: '',
        isStage2: 'No'
    };

    $scope.openDateFoundDatePicker = function () {
        $timeout(function () {
            $scope.openedDateFound = true;
        });
    };
    $scope.openDateStage1DatePicker = function () {
        $timeout(function () {
            $scope.openedDateStage1 = true;
        });
    };
    $scope.openDateStage2DatePicker = function () {
        $timeout(function () {
            $scope.openedDateStage2 = true;
        });
    };
    $scope.openDateLetter1DatePicker = function () {
        $timeout(function () {
            $scope.openedDateLetter1 = true;
        });
    };
    $scope.openDateLetter2DatePicker = function () {
        $timeout(function () {
            $scope.openedDateLetter2 = true;
        });
    };
    $scope.openDateLetter3DatePicker = function () {
        $timeout(function () {
            $scope.openedDateLetter3 = true;
        });
    };
    $scope.openDateLetter4DatePicker = function () {
        $timeout(function () {
            $scope.openedDateLetter4 = true;
        });
    };
    $scope.openDateLetter5DatePicker = function () {
        $timeout(function () {
            $scope.openedDateLetter5 = true;
        });
    };
    $scope.updateLetterDates = function () {
        if ($scope.owner.dateLetter1) {
            if (($scope.owner.dateLetter1 instanceof Date && !isNaN($scope.owner.dateLetter1.valueOf()))) {
                var dLetter1 = $scope.owner.dateLetter1;
                var dLetter2 = new Date(dLetter1.valueOf());
                var dLetter3 = new Date(dLetter1.valueOf());
                dLetter2.setDate(dLetter2.getDate() + (8 * 7));
                dLetter3.setDate(dLetter3.getDate() + (16 * 7));
                $scope.owner.dateLetter2 = dLetter2;
                $scope.owner.dateLetter3 = dLetter3;
            } else {
                $scope.owner.dateLetter2 = '';
                $scope.owner.dateLetter3 = '';
            }
        } else {
            $scope.owner.dateLetter2 = '';
            $scope.owner.dateLetter3 = '';
        }
    };
    $scope.updateLetter2Date = function () {
        if ($scope.owner.dateLetter2) {
            if (($scope.owner.dateLetter2 instanceof Date && !isNaN($scope.owner.dateLetter2.valueOf()))) {
                var dLetter2 = $scope.owner.dateLetter2;
                var dLetter3 = new Date(dLetter2.valueOf());
                dLetter3.setDate(dLetter3.getDate() + (8 * 7));
                $scope.owner.dateLetter3 = dLetter3;
            } else {
                $scope.owner.dateLetter3 = '';
            }
        } else {
            $scope.owner.dateLetter3 = '';
        }
    };
    $scope.listAvailableOptions = function(prop) {
        var scope = $rootScope.$new();
        var propertyName;
        if (prop == 'siteAddress') {
            propertyName = 'Site Address';
        } else if (prop == 'sitePostcode') {
            propertyName = 'Site Postcode';
        } else if (prop == 'titleNumber') {
            propertyName = 'Title Number';
        }
		scope.data = {
            propertyName: propertyName,
            propertyValues: $scope.options ? $scope.options[prop] : []
        };
        var modalInstance = $uibModal.open({
			scope: scope,
			animation: true,
			templateUrl: 'views/PickOption_Modal.html',
            controller: 'PickOption_Ctrl',
			backdrop: 'static'			
		});
        modalInstance.result.then(function (data) {
			$scope.owner[prop] = data;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.Save = function () {
        $uibModalInstance.close($scope.owner);
    };

    $scope.Cancel = function () {
        $uibModalInstance.dismiss();
    };

});