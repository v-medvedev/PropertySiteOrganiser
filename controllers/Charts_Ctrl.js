app.controller('ChartsCtrl', function ($scope, $log, $http) {
    
        $http.defaults.headers.post["Content-Type"] = "application/json";
    
        // Scope Defaults
        $scope.events = [];
        
        $scope.chartObj = {};
        $scope.chartData = [];
        $scope.chartLabels = [];
        $scope.chartSeries = ['Stage1', 'Letter1', 'Letter2', 'Letter3', 'Stage2'];
    
        $scope.chartLoggedObj = {};
        $scope.chartLoggedLabels = [];
        $scope.chartLoggedData = [];
        $scope.chartLoggedSeries = ['Logged'];
            
        $scope.reloadCalendarEvents = function () {
            /* Chart Init */
            $scope.chartData = [];
            $scope.chartLabels = [];
            $scope.chartSeries = ['Stage1', 'Letter1', 'Letter2', 'Letter3', 'Stage2'];
            $scope.chartColors = ['#e76208', '#337ab7', '#5cb85c', '#5bc0de', '#dc08e7'];
            /* Read properties from DB */
            $http({
                url: './api.php',
                method: "POST",
                data: {
                    "operation": "read"
                }
            })
                .then(function (response) {
                    // success
                    angular.forEach(response.data, function (value, key) {
                        $scope.events.push({
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
                            Letter1: value.Letter1 == '0000-00-00' ? '' : value.Letter1,
                            Letter2: value.Letter1 == '0000-00-00' ? '' : value.Letter2,
                            Letter3: value.Letter1 == '0000-00-00' ? '' : value.Letter3,
                            Letter4: value.Letter1 == '0000-00-00' ? '' : value.Letter4,
                            Letter5: value.Letter1 == '0000-00-00' ? '' : value.Letter5,
                            isStage2: value.Stage2 == '0000-00-00' ? 'No' : 'Yes',
                            EventDate: value.EventDate,
                            templateLetter1: value.templateLetter1,
                            fileStage1: value.fileStage1,
                            fileStage2: value.fileStage2,
                            fileOther: value.fileOther,
                            filePowerPoint: value.filePowerPoint,
                            fileTitle: value.fileTitle,
                            title: $scope.toTitleCase(value.className) + ' - ' + value.sitePostcode + ' (' + value.SiteLogNo + ')',
                            className: value.className,
                            stick: true,
                            start: value.EventDate
                        });
                        /* Chart Load */
                        var eventDate = new Date(value.EventDate);
                        var cSerie = $scope.getChartSeries(eventDate);
                        var Label = $scope.convertLabel(value.className);
                        if (Label) {
                            if ($scope.chartObj[cSerie]) {
                                if ($scope.chartObj[cSerie][Label]) {
                                    $scope.chartObj[cSerie][Label] += 1;
                                } else {
                                    $scope.chartObj[cSerie][Label] = 1;
                                }
                            } else {
                                $scope.chartObj[cSerie] = {};
                                $scope.chartObj[cSerie][Label] = 1;
                            }
                        }
                    });
                    angular.forEach($scope.chartObj, function (value, key) {
                        $scope.chartLabels.push(key);
                    });
                    $scope.chartLabels = $scope.filterArray($scope.chartLabels);
                    for (var cIndex = 0; cIndex < $scope.chartSeries.length; cIndex++) {
                        var cSerie = $scope.chartSeries[cIndex].toString();
                        var seriesData = [];
                        for (var lIndex = 0; lIndex < $scope.chartLabels.length; lIndex++) {
                            var Label = $scope.chartLabels[lIndex];
                            if ($scope.chartObj[Label][cSerie]) {
                                seriesData[lIndex] = $scope.chartObj[Label][cSerie];
                            } else {
                                seriesData[lIndex] = 0;
                            }
                        }
                        $scope.chartData.push(seriesData);
                    }                    
                }, function (err) {
                    // failed
                    console.log('Read operation API call failed: ', err);
                });
        };
            
        $scope.filterArray = function (arr) {
            for (var i = 0; i < arr.length; i++) {
                arr[i] = new Date('01 ' + arr[i]);
            }
            var mas = arr.sort(function (a, b) {
                if (a < b) return -1;
                if (a > b) return 1;
            });
            for (var i = 0; i < mas.length; i++) {
                mas[i] = $scope.getChartSeries(mas[i]);
            }
            return mas;
        };
    
        $scope.convertLabel = function (label) {
            if (label == 'stage1') {
                return 'Stage1';
            } else if (label == 'stage2') {
                return 'Stage2';
            } else if (label == 'letter1') {
                return 'Letter1';
            } else if (label == 'letter2') {
                return 'Letter2';
            } else if (label == 'letter3') {
                return 'Letter3';
            } else {
                return null;
            }
        };
    
        $scope.getChartSeries = function (eventDate) {
            var mNum = eventDate.getMonth() + 1;
            var monthName = '';
            if (mNum == 1) {
                monthName = 'January';
            } else if (mNum == 2) {
                monthName = 'February';
            } else if (mNum == 3) {
                monthName = 'March';
            } else if (mNum == 4) {
                monthName = 'April';
            } else if (mNum == 5) {
                monthName = 'May';
            } else if (mNum == 6) {
                monthName = 'June';
            } else if (mNum == 7) {
                monthName = 'July';
            } else if (mNum == 8) {
                monthName = 'August';
            } else if (mNum == 9) {
                monthName = 'September';
            } else if (mNum == 10) {
                monthName = 'October';
            } else if (mNum == 11) {
                monthName = 'November';
            } else if (mNum == 12) {
                monthName = 'December';
            }
            return monthName + ' ' + eventDate.getFullYear();
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
        
        $scope.events = [];
        $scope.reloadCalendarEvents();
        
    });