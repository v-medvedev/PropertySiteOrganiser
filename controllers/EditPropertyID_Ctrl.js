app.controller('EditPropertyID_Ctrl', function ($scope, $rootScope, $uibModal, $uibModalInstance, $timeout, $http, $log) {

    $scope.data = $scope.params;
    $scope.propertyTypes = ['Freehold', 'Leasehold'];
    $scope.qualifyOptions = ['Yes', 'No'];
    $scope.templatesLetter1 = ['Land Agent Approach', 'Land Agent Land Assembly Approach', 'Partnership Approach', 'Partnership Approach Land Assembly', 'Partnership Approach Land Title Split'];
    $scope.templateLetter1 = '';
    $scope.stage2Options = ['Yes', 'No'];

    $scope.activeOwnerIdx = 0;
    $scope.activeOwner = $scope.data.owners[0];

    $scope.openedDateFound = false;
    $scope.openedDateStage1 = false;
    $scope.openedDateStage2 = false;
    $scope.openedDateLetter1 = false;
    $scope.openedDateLetter2 = false;
    $scope.openedDateLetter3 = false;
    $scope.openedDateLetter4 = false;
    $scope.openedDateLetter5 = false;

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
    $scope.editOwner = function () {
        var scope = $rootScope.$new();
        var options = {
			siteAddress: [],
			sitePostcode: [],
			titleNumber: []
		};
		$scope.data.owners.map(function(item) {
			if (options.siteAddress.indexOf(item.siteAddress) == -1) {
				options.siteAddress.push(item.siteAddress);
			}
			if (options.sitePostcode.indexOf(item.sitePostcode) == -1) {
				options.sitePostcode.push(item.sitePostcode);
			}
			if (options.titleNumber.indexOf(item.titleNumber) == -1) {
				options.titleNumber.push(item.titleNumber);
			}
		});
        scope.params = $scope.data.owners[$scope.activeOwnerIdx];
        scope.options = options;
        var modalInstance = $uibModal.open({
            scope: scope,
			animation: true,
			templateUrl: 'views/EditOwner_Modal.html',
            controller: 'EditOwner_Ctrl',
			backdrop: 'static',
			size: 'lg',
			windowClass: 'my-modal'
		});
        modalInstance.result.then(function (data) {
            $scope.data.owners[$scope.activeOwnerIdx] = data;
            $scope.activeOwner = data;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.setActiveOwner = function (idx) {
        if ($scope.data.owners.length > 0) {
            angular.forEach($scope.data.owners, function (value, key) {
                value.selected = '';
            });
            $scope.data.owners[idx].selected = 'selected';
            $scope.activeOwnerIdx = idx;
            $scope.activeOwner = $scope.data.owners[$scope.activeOwnerIdx];
        }
    };
    $scope.updateLetterDates = function () {
        if ($scope.data.dateLetter1) {
            if (($scope.data.dateLetter1 instanceof Date && !isNaN($scope.data.dateLetter1.valueOf()))) {
                var dLetter1 = $scope.data.dateLetter1;
                var dLetter2 = new Date(dLetter1.valueOf());
                var dLetter3 = new Date(dLetter1.valueOf());
                dLetter2.setDate(dLetter2.getDate() + (8 * 7));
                dLetter3.setDate(dLetter3.getDate() + (16 * 7));
                $scope.data.dateLetter2 = dLetter2;
                $scope.data.dateLetter3 = dLetter3;
                $scope.data.templateLetter1 = 'Land Agent Approach';
            } else {
                $scope.data.dateLetter2 = '';
                $scope.data.dateLetter3 = '';
            }
        } else {
            $scope.data.dateLetter2 = '';
            $scope.data.dateLetter3 = '';
        }
    };
    $scope.updateLetter2Date = function () {
        if ($scope.data.dateLetter2) {
            if (($scope.data.dateLetter2 instanceof Date && !isNaN($scope.data.dateLetter2.valueOf()))) {
                var dLetter2 = $scope.data.dateLetter2;
                var dLetter3 = new Date(dLetter2.valueOf());
                dLetter3.setDate(dLetter2.getDate() + (8 * 7));
                $scope.data.dateLetter3 = dLetter3;
            } else {
                $scope.data.dateLetter3 = '';
            }
        } else {
            $scope.data.dateLetter3 = '';
        }
    };
    $scope.toTitleCase = function (str) {
        return str.toString().replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase();
        });
    };
    $scope.Save = function () {

        /* Save to DB */
        $http({
            url: './api.php',
            method: "POST",
            data: {
                "operation": "update_id",
                "id": $scope.data.id,
                "siteLogNo": $scope.data.SiteLogNo,
                "dateFound": $scope.data.dateFound,
                "siteName": $scope.data.siteName ? $scope.data.siteName : '',
                "siteNotes": $scope.data.owners[0].siteNotes ? $scope.data.owners[0].siteNotes : '',
                "siteAddress": $scope.data.owners[0].siteAddress ? $scope.data.owners[0].siteAddress : '',
                "streetName": $scope.data.owners[0].streetName ? $scope.data.owners[0].streetName : '',
                "sitePostcode": $scope.data.owners[0].sitePostcode ? $scope.data.owners[0].sitePostcode : '',
                "titleNumber": $scope.data.owners[0].titleNumber ? $scope.data.owners[0].titleNumber : '',
                "propertyType": $scope.data.owners[0].propertyType ? $scope.data.owners[0].propertyType : '',
                "ownerType": $scope.data.owners[0].ownerType ? $scope.data.owners[0].ownerType : '',
                "companyName": $scope.data.owners[0].companyName ? $scope.data.owners[0].companyName : '',
                "individualsNames": $scope.data.owners[0].individualsNames ? $scope.data.owners[0].individualsNames : '',
                "ownerAddress": $scope.data.owners[0].ownerAddress ? $scope.data.owners[0].ownerAddress : '',
                "titleArea": $scope.data.owners[0].titleArea ? $scope.data.owners[0].titleArea : '',
                "landinsightSite": $scope.data.owners[0].landinsightSite ? $scope.data.owners[0].landinsightSite : '',
                "landinsightTitle": $scope.data.owners[0].landinsightTitle ? $scope.data.owners[0].landinsightTitle : '',
                "qualify": $scope.data.owners[0].qualify ? $scope.data.owners[0].qualify : '',
                "dateStage1": $scope.data.owners[0].dateStage1 ? $scope.data.owners[0].dateStage1 : '',
                "dateStage2": $scope.data.owners[0].dateStage2 ? $scope.data.owners[0].dateStage2 : '',
                "templateLetter1": $scope.data.owners[0].templateLetter1 ? $scope.data.owners[0].templateLetter1 : 'Land Agent Approach',
                "dateLetter1": $scope.data.owners[0].dateLetter1 ? $scope.data.owners[0].dateLetter1 : '',
                "dateLetter2": $scope.data.owners[0].dateLetter2 ? $scope.data.owners[0].dateLetter2 : '',
                "dateLetter3": $scope.data.owners[0].dateLetter3 ? $scope.data.owners[0].dateLetter3 : '',
                "dateLetter4": $scope.data.owners[0].dateLetter4 ? $scope.data.owners[0].dateLetter4 : '',
                "dateLetter5": $scope.data.owners[0].dateLetter5 ? $scope.data.owners[0].dateLetter5 : '',
                "isStage2": $scope.data.owners[0].isStage2,
                "disabled": $scope.data.owners[0].disabled
            }
        })
            .then(function (response) {
                console.log(response);
                // success			
                var editedRow = {
                    id: parseInt($scope.data.id),
                    SiteLogNo: $scope.data.SiteLogNo ? $scope.data.SiteLogNo : '',
                    dateFound: $scope.data.dateFound ? $scope.data.dateFound : '',
                    siteName: $scope.data.siteName ? $scope.data.siteName : '',
                    siteNotes: $scope.data.owners[0].siteNotes ? $scope.data.owners[0].siteNotes : '',
                    siteAddress: $scope.data.owners[0].siteAddress ? $scope.data.owners[0].siteAddress : '',
                    streetName: $scope.data.owners[0].streetName ? $scope.data.owners[0].streetName : '',
                    sitePostcode: $scope.data.owners[0].sitePostcode ? $scope.data.owners[0].sitePostcode : '',
                    titleNumber: $scope.data.owners[0].titleNumber ? $scope.data.owners[0].titleNumber : '',
                    propertyType: $scope.data.owners[0].propertyType ? $scope.data.owners[0].propertyType : '',
                    ownerType: $scope.data.owners.length == 1 ? $scope.data.owners[0].ownerType : '',
                    companyName: $scope.data.owners.length == 1 ? $scope.data.owners[0].companyName : '',
                    individualsNames: $scope.data.owners.length == 1 ? $scope.data.owners[0].individualsNames : '',
                    ownerAddress: $scope.data.owners.length == 1 ? $scope.data.owners[0].ownerAddress : '',
                    titleArea: $scope.data.owners[0].titleArea,
                    landinsightSite: $scope.data.owners[0].landinsightSite ? $scope.data.owners[0].landinsightSite : '',
                    landinsightTitle: $scope.data.owners[0].landinsightTitle ? $scope.data.owners[0].landinsightTitle : '',
                    qualify: $scope.data.owners[0].qualify,
                    Stage1: $scope.data.owners[0].dateStage1 == '0000-00-00' ? '' : $scope.data.owners[0].dateStage1,
                    Stage2: $scope.data.owners[0].dateStage2 == '0000-00-00' ? '' : $scope.data.owners[0].dateStage2,
                    isStage2: $scope.data.owners[0].isStage2,
                    templateLetter1: $scope.data.owners[0].templateLetter1,
                    Letter1: $scope.data.owners[0].dateLetter1 == '0000-00-00' ? '' : $scope.data.owners[0].dateLetter1,
                    Letter2: $scope.data.owners[0].dateLetter2 == '0000-00-00' ? '' : $scope.data.owners[0].dateLetter2,
                    Letter3: $scope.data.owners[0].dateLetter3 == '0000-00-00' ? '' : $scope.data.owners[0].dateLetter3,
                    Letter4: $scope.data.owners[0].dateLetter4 == '0000-00-00' ? '' : $scope.data.owners[0].dateLetter4,
                    Letter5: $scope.data.owners[0].dateLetter5 == '0000-00-00' ? '' : $scope.data.owners[0].dateLetter5,
                    disabled: 0
                };
        
                $uibModalInstance.close(editedRow);
            }, function (response) {
                // failed
                console.log(response.data);
            });       
    };
    $scope.Close = function () {
        $uibModalInstance.dismiss();
    };
});