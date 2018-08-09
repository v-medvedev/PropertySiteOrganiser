app.controller('DatabaseCtrl', function ($rootScope, $route, $window, $scope, $log, $uibModal, $http, Excel, $timeout) {

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
                        ownerType: value.ownerType,
                        companyName: value.companyName,
                        individualsNames: value.individualsNames,
                        ownerAddress: value.ownerAddress,
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
                        disabled: parseInt(value.disabled) == 0 ? false : true
                    });
                    $scope.displayedCollection = [].concat($scope.dbTableEvents);
                });
            }, function (err) {
                // failed
                console.log('ReadDB operation API call failed: ', err);
            });
    };

    $scope.toTitleCase = function (str) {
        return str.toString().replace(/(?:^|\s)\w/g, function (match) {
            return match.toUpperCase();
        });
    };

    $scope.toProperCase = function (str) {
        str = str.toLowerCase().split(' ');
        for (var i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
        }
        return str.join(' ');
    };

    $scope.addPropertyDB = function () {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'views/AddProperty_Modal.html',
            controller: 'AddProperty_Ctrl',
            backdrop: 'static',
            size: 'lg',
            windowClass: 'my-modal'
        });
        modalInstance.result.then(function (data) {
            for (var i = 0; i < data.length; i++) {
                $scope.displayedCollection.unshift(data[i]);
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
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

    $scope.ExportData = function () {
        console.log('Export Data');
        $http({
            url: './api.php',
            method: "POST",
            data: {
                "operation": "getExcel"
            }
        }).then(function (response) {
            console.log('Callback');
            loadFile('./Sites_Database.xlsx', function (error, content) {
                if (error) {
                    console.log('Error: ', error);
                    throw error;
                };
                console.log('File Downloaded');
                var zip = new JSZip(content, { type: "uint8array" });
                var out = zip.generate({
                    type: "blob",
                    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }); //Output the document using Data-URI
                saveAs(out, 'Sites_Database.xlsx');
            });
        });
    };

    $scope.updateDisabled = function (event) {
        $http({
            url: './api.php',
            method: "POST",
            data: {
                "operation": "updateDisabled",
                "id": event.id,
                "state": event.disabled ? 1 : 0
            }
        })
            .then(function (response) {
                // success
                console.log(response.data);
            }, function (response) {
                // failed
                console.log(response.data);
            });
    };

    $scope.duplicateRecord = function (data) {
        /* Save to DB */
        $http({
            url: './api.php',
            method: "POST",
            data: {
                "operation": "duplicate",
                "id": parseInt(data.id)
            }
        })
            .then(function (response) {
                // success
                // $window.location.reload();
                for (var i = 0; i < $scope.displayedCollection.length; i++) {
                    if (parseInt($scope.displayedCollection[i].id) == parseInt(data.id)) {
                        var cloneOfRow = JSON.parse(JSON.stringify($scope.displayedCollection[i]));
                        cloneOfRow.id = response.data.id;
                        cloneOfRow.selected = '';
                        delete (cloneOfRow['$$hashKey']);
                        delete (cloneOfRow['__proto__']);
                        $scope.displayedCollection.splice(i, 0, cloneOfRow);
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
            owners: [{
                siteNotes: event.siteNotes,
                siteAddress: event.siteAddress,
                streetName: event.streetName,
                sitePostcode: event.sitePostcode,
                titleNumber: event.titleNumber,
                propertyType: event.propertyType,
                ownerType: event.ownerType,
                companyName: event.companyName,
                individualsNames: event.individualsNames,
                ownerAddress: event.ownerAddress,
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
                dateStage1: event.Stage1,
                dateStage2: event.Stage2,
                dateLetter1: event.Letter1,
                dateLetter2: event.Letter2,
                dateLetter3: event.Letter3,
                dateLetter4: event.Letter4,
                dateLetter5: event.Letter5,
                state: 'selected',
                isStage2: event.isStage2,
                disabled: event.disabled
            }]
        };
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
            console.log(data);
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

    $scope.formatDate = function (d) {
        return moment(d).format('Do MMM YYYY');
    };

    $scope.setActiveLine = function (idx) {
        for (var i = 0; i < $scope.displayedCollection.length; i++) {
            $scope.displayedCollection[i].selected = '';
        }
        $scope.displayedCollection[idx].selected = 'selected';
        $scope.activeRowId = 'db-' + idx;
        console.log($scope.displayedCollection[idx]);
    };

    $scope.processWordTemplate = function (record, fileType) {
        var templateUrl = '';
        var templateURL_L1_Copy = '';
        var templateURL_L2_Copy = '';
        var templateURL_L3_Copy = '';
        var letterDate = undefined;
        var letter1Date = '';
        var letterIndex = '';
        var letter1_date = undefined;
        var letter2_date = undefined;
        var letter3_date = undefined;
        
        switch (fileType) {
            case 'Letter1':
                if (record.templateLetter1 == 'Land Agent Land Assembly Approach') {
                    templateUrl = 'templates/Land Agent Land Assembly Approach.docx';
                } else if (record.templateLetter1 == 'Land Agent Approach') {
                    templateUrl = 'templates/Land Agent Approach.docx';
                } else if (record.templateLetter1 == 'Partnership Approach') {
                    templateUrl = 'templates/Partnership Approach.docx';
                } else if (record.templateLetter1 == 'Partnership Approach Land Assembly') {
                    templateUrl = 'templates/Partnership Approach Land Assembly.docx';
                } else if (record.templateLetter1 == 'Partnership Approach Land Title Split') {
                    templateUrl = 'templates/Partnership Approach Land Title Split.docx';
                }
                letter_date = record.Letter1;
                letterIndex = 'L1';
                break;
            case 'Letter2':
                // Copy Letter1
                if (record.templateLetter1 == 'Land Agent Land Assembly Approach') {
                    templateURL_L1_Copy = 'templates/Land Agent Land Assembly Approach - Copy.docx';
                } else if (record.templateLetter1 == 'Land Agent Approach') {
                    templateURL_L1_Copy = 'templates/Land Agent Approach - Copy.docx';
                } else if (record.templateLetter1 == 'Partnership Approach') {
                    templateURL_L1_Copy = 'templates/Partnership Approach - Copy.docx';
                } else if (record.templateLetter1 == 'Partnership Approach Land Assembly') {
                    templateURL_L1_Copy = 'templates/Partnership Approach Land Assembly - Copy.docx';
                } else if (record.templateLetter1 == 'Partnership Approach Land Title Split') {
                    templateURL_L1_Copy = 'templates/Partnership Approach Land Title Split - Copy.docx';
                }
                templateUrl = 'templates/8 Week Land Agent Approach.docx';
                letter_date = record.Letter2;
                letter1_date = record.Letter1;
                letterIndex = 'L2';
                break;
            case 'Letter3':
                // Copy Letter1
                if (record.templateLetter1 == 'Land Agent Land Assembly Approach') {
                    templateURL_L1_Copy = 'templates/Land Agent Land Assembly Approach - Copy.docx';
                } else if (record.templateLetter1 == 'Land Agent Approach') {
                    templateURL_L1_Copy = 'templates/Land Agent Approach - Copy.docx';
                } else if (record.templateLetter1 == 'Partnership Approach') {
                    templateURL_L1_Copy = 'templates/Partnership Approach - Copy.docx';
                } else if (record.templateLetter1 == 'Partnership Approach Land Assembly') {
                    templateURL_L1_Copy = 'templates/Partnership Approach Land Assembly - Copy.docx';
                } else if (record.templateLetter1 == 'Partnership Approach Land Title Split') {
                    templateURL_L1_Copy = 'templates/Partnership Approach Land Title Split - Copy.docx';
                }
                templateURL_L2_Copy = 'templates/8 Week Land Agent Approach - Copy.docx';
                templateUrl = 'templates/16 Week Letter 3.docx';
                letter_date = record.Letter3;
                letter1_date = record.Letter1;
                letter2_date = record.Letter2;
                letterIndex = 'L3';
                break;
            case 'Letter4':
                // Copy Letter1
                if (record.templateLetter1 == 'Land Agent Land Assembly Approach') {
                    templateURL_L1_Copy = 'templates/Land Agent Land Assembly Approach - Copy.docx';
                } else if (record.templateLetter1 == 'Land Agent Approach') {
                    templateURL_L1_Copy = 'templates/Land Agent Approach - Copy.docx';
                } else if (record.templateLetter1 == 'Partnership Approach') {
                    templateURL_L1_Copy = 'templates/Partnership Approach - Copy.docx';
                } else if (record.templateLetter1 == 'Partnership Approach Land Assembly') {
                    templateURL_L1_Copy = 'templates/Partnership Approach Land Assembly - Copy.docx';
                } else if (record.templateLetter1 == 'Partnership Approach Land Title Split') {
                    templateURL_L1_Copy = 'templates/Partnership Approach Land Title Split - Copy.docx';
                }
                templateURL_L2_Copy = 'templates/8 Week Land Agent Approach - Copy.docx';
                templateURL_L3_Copy = 'templates/16 Week Letter 3.docx';
                templateUrl = 'templates/1 Year Follow Up.docx';
                letter_date = record.Letter4;
                letter1_date = record.Letter1;
                letter2_date = record.Letter2;
                letter3_date = record.Letter3;
                letterIndex = 'L4';
                break;
            case 'Letter5':
                templateUrl = 'templates/stage5.docx';
                letter_date = record.Letter5;
                letterIndex = 'L5';
                break;
        }
        
        var parts = record.individualsNames.split(' ');
        var title = parts[0];
        if (title.toUpperCase() == 'MR' || title.toUpperCase() == 'MS' || title.toUpperCase() == 'MRS' || title.toUpperCase() == 'MISS') {
            var lastName = parts.pop();
            title = title + ' ' + lastName;
        } else {
            title = record.individualsNames;
        }

        var CC_Owners = $scope.displayedCollection.filter(function(item) {
            return (item.SiteLogNo == record.SiteLogNo && item.siteAddress == record.siteAddress && item.id != record.id);
        });
        var CC = [];
        CC_Owners.map(function(item) {
            CC.push(item.individualsNames);
        });

        var pre = '<w:p><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:rFonts w:ascii="Verdana" w:hAnsi="Verdana" w:cs="Verdana"/><w:t>';
        var post = '</w:t></w:r></w:p>';
        var lineBreak = '<w:br/>';
        var address = record.ownerAddress.replace(new RegExp(', ', 'g'), ',');
        address = pre + address.replace(new RegExp(',', 'g'), lineBreak) + post;
        var word_data = {
            companyName: record.companyName,
            individualsNames: record.individualsNames,
            owner_address: address,
            site_address: record.siteAddress,
            letter_date: $scope.formatDate(letter_date),
            letter1_date: letter1_date != undefined ? $scope.formatDate(letter1_date) : '',
            letter2_date: letter2_date != undefined ? $scope.formatDate(letter2_date) : '',
            title: $scope.toProperCase(title)
        };
        if (record.companyName == undefined) {
            record.companyName = '';
        }
        if (CC.length > 0 && record.companyName.length > 0) {
            word_data.CC = 'CC: ' + $scope.toProperCase(CC.join(', '));
        } else {
            word_data.CC = '';
        }

        var dateStamp = new Date(letter_date);
        dateStamp = ('0' + dateStamp.getDate()).slice(-2) + '.' + ('0' + (dateStamp.getMonth() + 1)).slice(-2) + '.' + dateStamp.getFullYear().toString().substr(-2);
        var postCode = record.sitePostcode == undefined ? '' : record.sitePostcode;
        var streetName = record.streetName == undefined ? '' : record.streetName;

        var doorNumber = record.siteAddress.split(' ')[0];
        if (!isNaN(doorNumber.substr(0, 1))) {
            postCode = postCode + ' ' + doorNumber;
        }

        var fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + record.SiteLogNo + ".docx";
        fileName = fileName.replace("  ", " ");

        if (templateUrl != '') {
            $scope.exportWordTemplate(templateUrl, word_data, fileName);
        } else {
            alert('Missing Letter1 Template');
        }

        if (fileType == 'Letter4') {
            // Check if need to generate copy Letter1
            if (templateURL_L1_Copy != '') {
                letterIndex = "L1";
                var newData1 = Object.assign({}, word_data);
                newData1.letter_date = $scope.formatDate(letter1_date);
                fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + record.SiteLogNo + " - Copy.docx";
                fileName = fileName.replace("  ", " ");
                $scope.exportWordTemplate(templateURL_L1_Copy, newData1, fileName);
            }
        } else {
            // Check if need to generate copy Letter1
            if (templateURL_L1_Copy != '') {
                letterIndex = "L1";
                var newData1 = Object.assign({}, word_data);
                newData1.letter_date = $scope.formatDate(letter1_date);
                fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + record.SiteLogNo + " - Copy.docx";
                fileName = fileName.replace("  ", " ");
                $scope.exportWordTemplate(templateURL_L1_Copy, newData1, fileName);
            }
            // Check if need to generate copy Letter2
            if (templateURL_L2_Copy != '') {
                letterIndex = "L2";
                var newData2 = Object.assign({}, word_data);
                newData2.letter_date = $scope.formatDate(letter2_date);
                fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + record.SiteLogNo + " - Copy.docx";
                fileName = fileName.replace("  ", " ");
                $scope.exportWordTemplate(templateURL_L2_Copy, newData2, fileName);
            }

            // Check if need to generate copy Letter3
            if (templateURL_L3_Copy != '') {
                letterIndex = "L3";
                var newData3 = Object.assign({}, word_data);
                newData3.letter_date = $scope.formatDate(letter3_date);
                fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + record.SiteLogNo + " - Copy.docx";
                fileName = fileName.replace("  ", " ");
                $scope.exportWordTemplate(templateURL_L3_Copy, newData3, fileName);
            }
        }
        
    };

    $scope.exportWordTemplate = function (templateUrl, word_data, fileName) {
        
        loadFile(templateUrl, function (error, content) {
            if (error) { throw error };
            var zip = new JSZip(content, { type: "uint8array" });
            var doc = new Docxtemplater().loadZip(zip);
            doc.setData(word_data);
            try {
                // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
                doc.render()
            }
            catch (error) {
                var e = {
                    message: error.message,
                    name: error.name,
                    stack: error.stack,
                    properties: error.properties
                }
                console.log(JSON.stringify({ error: e }));
                // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
                throw error;
            }
            var out = doc.getZip().generate({
                type: "blob",
                mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            }); //Output the document using Data-URI
            saveAs(out, fileName);
        });

    };

    $scope.reloadTableEvents();

});