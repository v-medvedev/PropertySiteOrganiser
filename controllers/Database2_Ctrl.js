app.controller('Database2Ctrl', function ($rootScope, $route, $window, $scope, $log, $uibModal, $http, Excel, $timeout) {
    
        $http.defaults.headers.post["Content-Type"] = "application/json";
    
        // Scope Defaults
        $scope.dbTableEvents = [];
        $scope.activeRowId = '';
    
        $scope.reloadTableEvents = function () {
            /* Read properties from DB */
            $http({
                url: './api.php',
                method: "POST",
                data: {
                    "operation": "readDB"
                }
            })
                .then(function (response) {
                    // success
                    angular.forEach(response.data, function (value, key) {
                        $scope.dbTableEvents.push({
                            id: parseInt(value.id),
                            SiteLogNo: value.SiteLogNo,
                            dateFound: value.dateFound,
                            siteName: value.siteName,
                            siteNotes: value.siteNotes,
                            siteAddress: value.siteAddress,
                            streetName: value.streetName,
                            sitePostcode: value.sitePostcode,
                            titleNumber: value.titleNumber,
                            propertyType: value.propertyType,
                            owner_type: value.owner_type,
                            companyName: value.companyName,
                            individualsNames: value.individualsNames,
                            owner_address: value.owner_address,
                            titleArea: value.titleArea,
                            landinsightSite: value.landinsightSite,
                            landinsightTitle: value.landinsightTitle,
                            qualify: value.qualify,
                            Stage1: value.Stage1 == '0000-00-00' ? '' : value.Stage1,
                            Stage2: value.Stage2 == '0000-00-00' ? '' : value.Stage2,
                            isStage2: value.Stage2 == '0000-00-00' ? 'No' : 'Yes',
                            templateLetter1: value.templateLetter1,
                            Letter1: value.Letter1 == '0000-00-00' ? '' : value.Letter1,
                            Letter2: value.Letter2 == '0000-00-00' ? '' : value.Letter2,
                            Letter3: value.Letter3 == '0000-00-00' ? '' : value.Letter3,
                            Letter4: value.Letter4 == '0000-00-00' ? '' : value.Letter4,
                            Letter5: value.Letter5 == '0000-00-00' ? '' : value.Letter5,
                            fileStage1: value.fileStage1,
                            fileStage2: value.fileStage2,
                            fileOther: value.fileOther,
                            filePowerPoint: value.filePowerPoint,
                            fileTitle: value.fileTitle,
                            disabled: parseInt(value.disabled) == 0 ? 0 : 1
                        });
                        $scope.displayedCollection = [].concat($scope.dbTableEvents);                        
                    });
                }, function (err) {
                    // failed
                    console.log('ReadDB operation API call failed: ', err);
                });
        };
        
        $scope.deleteProperty = function (event) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'views/RemoveProperty_Modal.html',
                controller: 'RemoveProperty_Ctrl',
                backdrop: 'static'
            });
            modalInstance.result.then(function (data) {
                /* Save to DB */
                $http({
                    url: './api.php',
                    method: "POST",
                    data: {
                        "operation": "delete",
                        "id": event.id
                    }
                })
                    .then(function (response) {
                        // success
                        console.log(response.data);
                        for (var i = 0; i < $scope.displayedCollection.length; i++) {
                            if ($scope.displayedCollection[i].id == response.data.id) {
                                $scope.displayedCollection.splice(i, 1);
                            }
                        }
                        // $window.location.reload();
                    }, function (response) {
                        // failed
                        console.log(response.data);
                    });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        
        $scope.duplicateRecord = function (event) {
            console.log(event);
            var data = {
                id: parseInt(event.id),
                SiteLogNo: parseInt(event.SiteLogNo),
                dateFound: event.dateFound,
                siteName: event.siteName,
                siteNotes: event.siteNotes,
                siteAddress: event.siteAddress,
                streetName: event.streetName,
                sitePostcode: event.sitePostcode,
                titleNumber: event.titleNumber,
                propertyType: event.propertyType,
                owners: event.owners,
                titleArea: event.titleArea,
                landinsightSite: event.landinsightSite,
                landinsightTitle: event.landinsightTitle,
                qualify: event.qualify,
                fileStage1: event.fileStage1,
                fileStage2: event.fileStage2,
                fileOther: event.fileOther,
                filePowerPoint: event.filePowerPoint,
                fileTitle: event.fileTitle,
                stages: {
                    stage1: {},
                    stage2: {},
                    letter1: {},
                    letter2: {},
                    letter3: {},
                    letter4: {},
                    letter5: {}
                },
                isStage2: event.isStage2,
                templateLetter1: event.templateLetter1
            };
            if (data.owners == undefined && (event.owner_type || event.companyName || event.individualsNames || event.owner_address)) {
                data.owners = [{
                    type: event.owner_type,
                    companyName: event.companyName,
                    individualsNames: event.individualsNames,
                    address: event.owner_address
                }];
            }
            angular.forEach($scope.events, function (value, key) {
                if (value.siteName === event.siteName) {
                    data.stages[value.className].checkState = true;
                    data.stages[value.className].stage = value.className;
                    data.stages[value.className].scheduledDate = value.start;
                }
            });
            /* Save to DB */
            $http({
                url: './api.php',
                method: "POST",
                data: {
                    "operation": "duplicate",
                    "id": data.id,
                    "siteLogNo": data.SiteLogNo,
                    "dateFound": data.dateFound,
                    "siteName": data.siteName ? data.siteName : '',
                    "siteNotes": data.siteNotes ? data.siteNotes : '',
                    "siteAddress": data.siteAddress ? data.siteAddress : '',
                    "streetName": data.streetName ? data.streetName : '',
                    "sitePostcode": data.sitePostcode ? data.sitePostcode : '',
                    "titleNumber": data.titleNumber ? data.titleNumber : '',
                    "propertyType": data.propertyType ? data.propertyType : '',
                    "owners": data.owners ? data.owners : [],
                    "titleArea": data.titleArea ? data.titleArea : '',
                    "landinsightSite": data.landinsightSite ? data.landinsightSite : '',
                    "landinsightTitle": data.landinsightTitle ? data.landinsightTitle : '',
                    "qualify": data.qualify ? data.qualify : '',
                    "dateStage1": data.stages.stage1.scheduledDate ? data.stages.stage1.scheduledDate : '',
                    "dateStage2": data.stages.stage2.scheduledDate ? data.stages.stage2.scheduledDate : '',
                    "dateLetter1": data.stages.letter1.scheduledDate ? data.stages.letter1.scheduledDate : '',
                    "dateLetter2": data.stages.letter2.scheduledDate ? data.stages.letter2.scheduledDate : '',
                    "dateLetter3": data.stages.letter3.scheduledDate ? data.stages.letter3.scheduledDate : '',
                    "dateLetter4": data.stages.letter4.scheduledDate ? data.stages.letter4.scheduledDate : '',
                    "dateLetter5": data.stages.letter5.scheduledDate ? data.stages.letter5.scheduledDate : '',
                    "stage1File": data.fileStage1 ? data.fileStage1 : '',
                    "stage2File": data.fileStage2 ? data.fileStage2 : '',
                    "otherFile": data.fileOther ? data.fileOther : '',
                    "powerPointFile": data.filePowerPoint ? data.filePowerPoint : '',
                    "titleFile": data.fileTitle ? data.fileTitle : '',
                    "isStage2": data.isStage2,
                    "templateLetter1": data.templateLetter1
                }
            })
                .then(function (response) {
                    // success
                    // $window.location.reload();
                    var duplicatedRow = {};
                    angular.forEach(event, function (value, key) {
                        if (key.indexOf('hashKey') == -1 && key.indexOf('proto') == -1) {
                            duplicatedRow[key] = value;
                        }
                    });
                    duplicatedRow.id = response.data.id;
                    for (var i = 0; i < $scope.displayedCollection.length; i++) {
                        if (parseInt($scope.displayedCollection[i].id) == parseInt(data.id)) {
                            $scope.displayedCollection.splice(i, 0, duplicatedRow);
                            break;
                        }
                    }
                }, function (response) {
                    // failed
                    console.log(response.data);
                });
        };
    
        $scope.editPropertyByID = function (event) {
            var data = {
                id: parseInt(event.id),
                SiteLogNo: parseInt(event.SiteLogNo),
                dateFound: event.dateFound,
                siteName: event.siteName,
                siteNotes: event.siteNotes,
                siteAddress: event.siteAddress,
                streetName: event.streetName,
                sitePostcode: event.sitePostcode,
                titleNumber: event.titleNumber,
                propertyType: event.propertyType,
                owners: [{
                    type: event.owner_type,
                    companyName: event.companyName,
                    individualsNames: event.individualsNames,
                    address: event.owner_address,
                }],
                titleArea: event.titleArea,
                landinsightSite: event.landinsightSite,
                landinsightTitle: event.landinsightTitle,
                qualify: event.qualify,
                fileStage1: event.fileStage1,
                fileStage2: event.fileStage2,
                fileOther: event.fileOther,
                filePowerPoint: event.filePowerPoint,
                fileTitle: event.fileTitle,
                templateLetter1: event.templateLetter1,
                stages: {
                    stage1: {
                        scheduledDate: event.Stage1
                    },
                    stage2: {
                        scheduledDate: event.Stage2
                    },
                    letter1: {
                        scheduledDate: event.Letter1
                    },
                    letter2: {
                        scheduledDate: event.Letter2
                    },
                    letter3: {
                        scheduledDate: event.Letter3
                    },
                    letter4: {
                        scheduledDate: event.Letter4
                    },
                    letter5: {
                        scheduledDate: event.Letter5
                    }
                },
                isStage2: event.isStage2,
                disabled: event.disabled
            };
            // angular.forEach($scope.events, function(value, key) {
            // 	if (value.siteName === event.siteName) {
            // 		data.stages[value.className].checkState = true;
            // 		data.stages[value.className].stage = value.className;
            // 		data.stages[value.className].scheduledDate = value.start;
            // 	}
            // });
            var scope = $rootScope.$new();
            scope.params = data;
            var modalInstance = $uibModal.open({
                scope: scope,
                animation: true,
                templateUrl: 'views/EditPropertyDB_Modal.html',
                controller: 'EditPropertyID_Ctrl',
                backdrop: 'static',
                size: 'lg',
                windowClass: 'my-modal'
            });
            modalInstance.result.then(function (data) {
                for (var i = 0; i < $scope.displayedCollection.length; i++) {
                    if (parseInt($scope.displayedCollection[i].id) == parseInt(data.id)) {
                        $scope.displayedCollection[i] = data;
                        break;
                    }
                }
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
            
        $scope.setActiveLine = function (idx) {
            for (var i = 0; i < $scope.displayedCollection.length; i++) {
                $scope.displayedCollection[i].selected = '';
            }
            $scope.displayedCollection[idx].selected = 'selected';
            $scope.activeRowId = 'db-' + idx;
            console.log($scope.displayedCollection[idx]);
        };
        
        $scope.reloadTableEvents();
            
    });