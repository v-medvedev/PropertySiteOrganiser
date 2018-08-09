app.controller('AddProperty_Ctrl', function ($rootScope, $scope, $http, $uibModal, $uibModalInstance, $timeout, $log) {

    var events = [];

    $scope.siteLogNo = '';
    $scope.dateFound = new Date();
    $scope.openedDateFound = false;
    $scope.siteName = '';
    $scope.owners = [];
    $scope.stage1File = undefined;
    $scope.stage2File = undefined;
    $scope.otherFile = undefined;
    $scope.powerFile = undefined;
    $scope.titleFile = undefined;
    $scope.filesToUpload = {};

    $scope.activeOwnerIdx = -1;
    $scope.activeOwner = {
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

    $scope.addOwner = function () {
        var options = {
			siteAddress: [],
			sitePostcode: [],
			titleNumber: []
		};
		$scope.owners.map(function(item) {
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
		var scope = $rootScope.$new();
		scope.options = options;
        var modalInstance = $uibModal.open({
            scope: scope,
			animation: true,
			templateUrl: 'views/AddOwner_Modal.html',
            controller: 'AddOwner_Ctrl',
			backdrop: 'static',
			size: 'lg',
			windowClass: 'my-modal'
		});
        modalInstance.result.then(function (data) {
            $scope.owners.push(data);
            for (var i=0; i < $scope.owners.length; i++) {
                $scope.owners[i].state = '';
            }
            $scope.activeOwnerIdx = $scope.owners.length-1;
            $scope.owners[$scope.activeOwnerIdx].state = 'selected';
            $scope.activeOwner = data;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.removeOwners = function () {
        $scope.owners = [];
        $scope.activeOwnerIdx = -1;
        $scope.activeOwner = {
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
    };
    $scope.removeOwner = function () {
        $scope.owners.splice($scope.activeOwnerIdx, 1);
        $scope.activeOwnerIdx = -1;
        $scope.activeOwner = {
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
    };
    $scope.editOwner = function () {
        var scope = $rootScope.$new();
        var options = {
			siteAddress: [],
			sitePostcode: [],
			titleNumber: []
		};
		$scope.owners.map(function(item) {
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
		scope.options = options;
        scope.params = $scope.owners[$scope.activeOwnerIdx];
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
            $scope.owners[$scope.activeOwnerIdx] = data;
            $scope.activeOwner = data;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.setActiveOwner = function (idx) {
        if ($scope.owners.length > 0) {
            angular.forEach($scope.owners, function (value, key) {
                value.state = '';
            });
            $scope.owners[idx].state = 'selected';
            $scope.activeOwnerIdx = idx;
            $scope.activeOwner = $scope.owners[idx];
        }
    };
    $scope.setFile = function (element, fileType) {
        var elementID = '';
        switch (fileType) {
            case 'Stage1':
                $scope.stage1File = element;
                elementID = 'stage1Btn';
                break;
            case 'Stage2':
                $scope.stage2File = element;
                elementID = 'stage2Btn';
                break;
            case 'Other':
                $scope.otherFile = element;
                elementID = 'otherBtn';
                break;
            case 'PowerPoint':
                $scope.powerFile = element;
                elementID = 'powerBtn';
                break;
            case 'Title':
                $scope.titleFile = element;
                elementID = 'titleBtn';
                break;
        }
        $scope.$apply();
        /* Change button state */
        if (element) {
            console.log(fileType + ' file imported: ' + element.name);
            $scope.filesToUpload[fileType] = element;
            $('#' + elementID).removeClass('btn-primary');
            $('#' + elementID).addClass('btn-default');
        } else {
            console.log(fileType + ' file import failed');
            delete $scope.filesToUpload[fileType];
            $('#' + elementID).removeClass('btn-default');
            $('#' + elementID).addClass('btn-primary');
        }
    };
    $scope.importFile = function (inputID) {
        $('#' + inputID).click();
    };
    $scope.toTitleCase = function (str) {
        return str.toString().replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase();
        });
    };
    $scope.Save = function () {

        /* Upload Files */
        var stage1FileName = '';
        var stage2FileName = '';
        var otherFileName = '';
        var powerPointFileName = '';
        var titleFileName = '';

        for (var f in $scope.filesToUpload) {
            if ($scope.filesToUpload.hasOwnProperty(f)) {
                /* Update FileName */
                var cTime = new Date();
                var fileName = $scope.filesToUpload[f].name;
                var ext = fileName.substr(fileName.lastIndexOf('.'));
                fileName = fileName.replace(ext, '_' + cTime.getTime().toString() + ext);
                switch (f) {
                    case 'Stage1':
                        stage1FileName = fileName;
                        break;
                    case 'Stage2':
                        stage2FileName = fileName;
                        break;
                    case 'Other':
                        otherFileName = fileName;
                        break;
                    case 'PowerPoint':
                        powerPointFileName = fileName;
                        break;
                    case 'Title':
                        titleFileName = fileName;
                        break;
                }
                /* Upload File */
                var uploadUrl = "./uploadFile.php";
                var fd = new FormData();
                fd.append('fileName', fileName);
                fd.append('folderName', f);
                fd.append('file', $scope.filesToUpload[f]);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function (data) {
                    console.log('Uploading status: ' + data);
                }).error(function (e) {
                    console.log(e);
                });
            }
        }

        /* Save to DB */
        $http({
            url: './api.php',
            method: "POST",
            data: {
                "operation": "create",
                "siteLogNo": $scope.siteLogNo,
                "dateFound": $scope.dateFound,
                "siteName": $scope.siteName ? $scope.siteName : '',
                "owners": $scope.owners ? $scope.owners : [],
                "stage1File": stage1FileName,
                "stage2File": stage2FileName,
                "otherFile": otherFileName,
                "powerPointFile": powerPointFileName,
                "titleFile": titleFileName
            }
        })
            .then(function (response) {
                // success
                console.log("Property Creation Details: ", response.data);
                var ids = response.data.id.split(',');
                var newProperties = [];
                for (var i = 0; i < ids.length; i++) {
                    var isStage2;
                    if ($scope.owners) {
                        if ($scope.owners[i].hasOwnProperty(isStage2)) {
                            if ($scope.owners[i].isStage2 == 1) {
                                isStage2 = 'Yes';
                            } else {
                                isStage2 = 'No';
                            }                        
                        } else {
                            isStage2 = 'No';
                        }
                    } else {
                        isStage2 = 'No';
                    }                    
                    newProperties.push({
                        id: parseInt(ids[i]),
                        SiteLogNo: $scope.siteLogNo ? $scope.siteLogNo : '',
                        dateFound: $scope.dateFound ? $scope.dateFound : '',
                        siteName: $scope.siteName ? $scope.siteName : '',
                        siteNotes: $scope.owners[i].siteNotes ? $scope.owners[i].siteNotes : '',
                        siteAddress: $scope.owners[i].siteAddress ? $scope.owners[i].siteAddress : '',
                        streetName: $scope.owners[i].streetName ? $scope.owners[i].streetName : '',
                        sitePostcode: $scope.owners[i].sitePostcode ? $scope.owners[i].sitePostcode : '',
                        titleNumber: $scope.owners[i].titleNumber ? $scope.owners[i].titleNumber : '',
                        propertyType: $scope.owners[i].propertyType ? $scope.owners[i].propertyType : '',
                        ownerType: $scope.owners[i].ownerType ? $scope.owners[i].ownerType : '',
                        companyName: $scope.owners[i].companyName ? $scope.owners[i].companyName : '',
                        individualsNames: $scope.owners[i].individualsNames ? $scope.owners[i].individualsNames : '',
                        ownerAddress: $scope.owners[i].ownerAddress ? $scope.owners[i].ownerAddress : '',
                        titleArea: $scope.owners[i].titleArea ? $scope.owners[i].titleArea : '',
                        landinsightSite: $scope.owners[i].landinsightSite ? $scope.owners[i].landinsightSite : '',
                        landinsightTitle: $scope.owners[i].landinsightTitle ? $scope.owners[i].landinsightTitle : '',
                        qualify: $scope.owners[i].qualify ? $scope.owners[i].qualify : '',
                        Stage1: $scope.owners[i].dateStage1 ? $scope.owners[i].dateStage1 : '',
                        Stage2: $scope.owners[i].dateStage2 ? $scope.owners[i].dateStage2 : '',
                        isStage2: isStage2,
                        templateLetter1: $scope.owners[i].templateLetter1 ? $scope.owners[i].templateLetter1 : '',
                        Letter1: $scope.owners[i].dateLetter1 ? $scope.owners[i].dateLetter1 : '',
                        Letter2: $scope.owners[i].dateLetter2 ? $scope.owners[i].dateLetter2 : '',
                        Letter3: $scope.owners[i].dateLetter3 ? $scope.owners[i].dateLetter3 : '',
                        Letter4: $scope.owners[i].dateLetter4 ? $scope.owners[i].dateLetter4 : '',
                        Letter5: $scope.owners[i].dateLetter5 ? $scope.owners[i].dateLetter5 : '',
                        fileStage1: stage1FileName,
                        fileStage2: stage2FileName,
                        fileOther: otherFileName,
                        filePowerPoint: powerPointFileName,
                        fileTitle: titleFileName,
                        disabled: 0
                    });
                }
                $uibModalInstance.close(newProperties);
            }, function (err) {
                // failed
                console.log("Property Creation Error:", err);
            });
    };
    $scope.Close = function () {
        $uibModalInstance.dismiss();
    };
});