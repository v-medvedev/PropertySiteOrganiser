app.controller('EditProperty_Ctrl', function($scope, $rootScope, $uibModal, $uibModalInstance, $timeout, $http, $log) {
	
	$scope.propertyTypes = ['Freehold', 'Leasehold'];
	$scope.qualifyOptions = ['Yes', 'No'];
	$scope.templatesLetter1 = ['Land Agent Approach', 'Land Agent Land Assembly Approach', 'Partnership Approach', 'Partnership Approach Land Assembly', 'Partnership Approach Land Title Split'];
	$scope.stage2Options = ['Yes', 'No'];
	$scope.stage1File = undefined;
    $scope.stage2File = undefined;
    $scope.otherFile = undefined;
    $scope.powerFile = undefined;
    $scope.titleFile = undefined;
    $scope.filesToUpload = {};
		
	$scope.openedDateFound = false;
	$scope.openedDateStage1 = false;
	$scope.openedDateStage2 = false;
	$scope.openedDateLetter1 = false;
	$scope.openedDateLetter2 = false;
	$scope.openedDateLetter3 = false;
	$scope.openedDateLetter4 = false;
	$scope.openedDateLetter5 = false;

	if ($scope.params.owners.length > 0) {
		$scope.activeOwnerIdx = 0;
		$scope.activeOwner = $scope.params.owners[$scope.activeOwnerIdx];
	} else {
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
	}

	$scope.openDateFoundDatePicker = function() {
        $timeout(function() {
            $scope.openedDateFound = true;
        });
    };
    $scope.openDateStage1DatePicker = function() {
    	$timeout(function() {
            $scope.openedDateStage1 = true;
        });
    };
    $scope.openDateStage2DatePicker = function() {
    	$timeout(function() {
            $scope.openedDateStage2 = true;
        });
    };
    $scope.openDateLetter1DatePicker = function() {
    	$timeout(function() {
            $scope.openedDateLetter1 = true;
        });
    };
    $scope.openDateLetter2DatePicker = function() {
    	$timeout(function() {
            $scope.openedDateLetter2 = true;
        });
    };
    $scope.openDateLetter3DatePicker = function() {
    	$timeout(function() {
            $scope.openedDateLetter3 = true;
        });
    };
    $scope.openDateLetter4DatePicker = function() {
    	$timeout(function() {
            $scope.openedDateLetter4 = true;
        });
    };
    $scope.openDateLetter5DatePicker = function() {
    	$timeout(function() {
            $scope.openedDateLetter5 = true;
        });
    };
    $scope.addOwner = function () {
		var options = {
			siteAddress: [],
			sitePostcode: [],
			titleNumber: []
		};
		$scope.params.owners.map(function(item) {
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
			console.log(data);
            $scope.params.owners.push(data);
            for (var i=0; i < $scope.params.owners.length; i++) {
                $scope.params.owners[i].state = '';
            }
            $scope.activeOwnerIdx = $scope.params.owners.length-1;
            $scope.params.owners[$scope.activeOwnerIdx].state = 'selected';
            $scope.activeOwner = data;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.removeOwners = function () {
        $scope.params.owners = [];
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
        $scope.params.owners.splice($scope.activeOwnerIdx, 1);
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
		$scope.params.owners.map(function(item) {
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
		scope.params = $scope.params.owners[$scope.activeOwnerIdx];
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
			console.log(data);
            $scope.params.owners[$scope.activeOwnerIdx] = data;
            $scope.activeOwner = data;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    $scope.setActiveOwner = function (idx) {
        if ($scope.params.owners.length > 0) {
            angular.forEach($scope.params.owners, function (value, key) {
                value.state = '';
            });
            $scope.params.owners[idx].state = 'selected';
            $scope.activeOwnerIdx = idx;
            $scope.activeOwner = $scope.params.owners[idx];
        }
    };
    $scope.setFile = function(element, fileType) {
    	var elementID = '';
    	switch (fileType) {
    		case 'Stage1': 
    			$scope.fileStage1 = element.name; 
    			elementID = 'stage1Btn';
    			break;
    		case 'Stage2': 
    			$scope.fileStage2 = element.name;
    			elementID = 'stage2Btn';
    			break;
    		case 'Other': 
    			$scope.fileOther = element.name;
    			elementID = 'otherBtn';
    			break;
    		case 'PowerPoint': 
    			$scope.filePowerPoint = element.name;
    			elementID = 'powerBtn';
    			break;
    		case 'Title': 
    			$scope.fileTitle = element.name;
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
	$scope.importFile = function(inputID) {
		$('#' + inputID).click();
	};
	$scope.toTitleCase = function(str) {
    	return str.toString().replace(/(?:^|\s)\w/g, function(match) {
        	return match.toUpperCase();
    	});
	};
	$scope.Save = function() {
		
		/* Upload Files */
		var stage1FileName = '';
		var stage2FileName = '';
		var otherFileName = '';
		var powerPointFileName = '';
		var titleFileName = '';

		if ($scope.fileStage1) {
			stage1FileName = $scope.fileStage1;
			console.log('stage1FileName: ' + stage1FileName);
		}
		if ($scope.fileStage2) {
			stage2FileName = $scope.fileStage2;
			console.log('stage2FileName: ' + stage2FileName);
		}
		if ($scope.fileOther) {
			otherFileName = $scope.fileOther;
			console.log('otherFileName: ' + otherFileName);
		}
		if ($scope.filePowerPoint) {
			powerPointFileName = $scope.filePowerPoint;
			console.log('powerPointFileName: ' + powerPointFileName);
		}
		if ($scope.fileTitle) {
			titleFileName = $scope.fileTitle;
			console.log('titleFileName: ' + titleFileName);
		}

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
	 			console.log('Uploading new file: ' + fileName + ' to a folder: ' + f);
	 			console.log(f);
				fd.append('fileName', fileName);
				fd.append('folderName', f);
				fd.append('file', $scope.filesToUpload[f]);
				$http.post(uploadUrl, fd, {
	    			transformRequest: angular.identity,
	    			headers: {
	    				'Content-Type': undefined
	    			}
				}).success(function(data) {
					console.log('Uploading status: ' + data);
				}).error(function(e) {
					console.log(e);
				});
    		}
		}

		/* Save to DB */
		$http({
            url: './api.php',
            method: "POST",
            data: {
                "operation": "update",
                "SiteLogNo": $scope.params.SiteLogNo,
                "dateFound": $scope.params.dateFound,
                "siteName": $scope.params.siteName ? $scope.params.siteName : '',
                "owners": $scope.params.owners ? $scope.params.owners : [],
                "stage1File": stage1FileName,
                "stage2File": stage2FileName,
                "otherFile": otherFileName,
                "powerPointFile": powerPointFileName,
                "titleFile": titleFileName
            }
        })
		.then(function (response) {
			// success
			$uibModalInstance.close();
		}, function (err) {
			// failed
			console.log("Error:", err);
		});

	};
	$scope.Close = function() {
		$uibModalInstance.dismiss();
	};
});