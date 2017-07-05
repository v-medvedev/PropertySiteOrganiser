angular.module('app.controllers', [])

.controller('myCalendarCtrl', function($rootScope, $route, $window, $scope, $log, $uibModal, $http, Excel, $timeout) {
	
	$http.defaults.headers.post["Content-Type"] = "application/json";

	// Scope Defaults
	$scope.events = [];
	$scope.dbTableEvents = [];
	$scope.activeRowId = '';
	
	$scope.dayEvents_Stage1 = [];
	$scope.dayEvents_Stage2 = [];
	$scope.dayEvents_Letter1 = [];
	$scope.dayEvents_Letter2 = [];
	$scope.dayEvents_Letter3 = [];
	$scope.dayEvents_Letter4 = [];
	$scope.dayEvents_Letter5 = [];
	$scope.currentDate = new Date();

	$scope.chartObj = {};
	$scope.chartData = [];
	$scope.chartLabels = [];
	$scope.chartSeries = ['Stage1', 'Letter1', 'Letter2', 'Letter3', 'Stage2'];
	
	$scope.chartLoggedObj = {};
	$scope.chartLoggedLabels = [];
	$scope.chartLoggedData = [];
	$scope.chartLoggedSeries = ['Logged'];

	$scope.todos = [];
	
	$scope.stageCheckboxes = {
		stage1: {
			checkState: true,
			weeksNo: 1
		},
		stage2: {
			checkState: true,
			weeksNo: 2
		},
		stage3: {
			checkState: true,
			weeksNo: 3
		},
		stage4: {
			checkState: true,
			weeksNo: 4
		},
		stage5: {
			checkState: true,
			weeksNo: 5
		},
	};

	/* config object */
	$scope.uiConfig = {
		calendar:{
			editable: false,
			selectable: true,
			disableResizing: true,
			displayEventTime: false,
			eventLimit: true,
			viewRender:function(view, element) {
				$scope.currentDate = $('.calendar').fullCalendar('getDate')._d;   						
			},
			dayClick: function(date, allDay, jsEvent, view) {
				$scope.currentDate = new Date(date);
				$scope.dayEvents_Stage1 = [];
				$scope.dayEvents_Stage2 = [];
				$scope.dayEvents_Letter1 = [];
				$scope.dayEvents_Letter2 = [];
				$scope.dayEvents_Letter3 = [];
				$scope.dayEvents_Letter4 = [];
				$scope.dayEvents_Letter5 = [];
				angular.forEach($scope.events, function(value, key) {
					var eventDate = new Date(value.start);
					if (eventDate.toDateString() == $scope.currentDate.toDateString()) {
						if (value.className == 'stage1') {
							$scope.dayEvents_Stage1.push(value);
						}
						if (value.className == 'stage2') {
							$scope.dayEvents_Stage2.push(value);
						}
						if (value.className == 'letter1') {
							$scope.dayEvents_Letter1.push(value);
						}
						if (value.className == 'letter2') {
							$scope.dayEvents_Letter2.push(value);
						}
						if (value.className == 'letter3') {
							$scope.dayEvents_Letter3.push(value);
						}
						if (value.className == 'letter4') {
							$scope.dayEvents_Letter4.push(value);
						}
						if (value.className == 'letter5') {
							$scope.dayEvents_Letter5.push(value);
						}
					}
				});				
			},
			eventClick: function(event) {
				var data = {
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
					templateLetter1: event.templateLetter1,
					fileStage1: event.fileStage1,
					fileStage2: event.fileStage2,
					fileOther: event.fileOther,
					filePowerPoint: event.filePowerPoint,
					fileTitle: event.fileTitle,
					title: $scope.toTitleCase(event.className),
					stages: {
						stage1: {},
						stage2: {},
						letter1: {},
						letter2: {},
						letter3: {},
						letter4: {},
						letter5: {}
					},
					isStage2: event.isStage2
				};
				angular.forEach($scope.events, function(value, key) {
					if (value.siteName === event.siteName) {
						data.stages[value.className].checkState = true;
						data.stages[value.className].stage = value.className;
						data.stages[value.className].scheduledDate = value.start;
					}
				});
				var scope = $rootScope.$new();
	        	scope.params = data;
	        	var modalInstance = $uibModal.open({
	            	scope: scope,
	            	animation: true,
			      	templateUrl: 'EventDetails_Modal.html',
			      	controller: 'EventDetails_Ctrl',
			      	backdrop: 'static',
			      	size: 'lg',
		    		windowClass: 'my-modal'
	        	});
	        	modalInstance.result.then(function(data) {
	            	
	        	}, function () {
	            	$log.info('Modal dismissed at: ' + new Date());
	        	});
			}
		}
	};

	$scope.ExportData = function() {
		$http({
			url: './api.php',
			method: "POST",
			data: {
				"operation": "getExcel"
			}
		})
		.then(function(response) {

			loadFile('./Sites_Database.xlsx', function(error, content) {
		        if (error) { throw error };
		        var zip = new JSZip(content, {type:"uint8array"});
		        var out = zip.generate({
		            type:"blob",
		            mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		        }); //Output the document using Data-URI
		        saveAs(out, 'Sites_Database.xlsx');
		    });

		});
	};

	$scope.addNewToDo = function() {
		var modalInstance = $uibModal.open({
			animation: true,
	      	templateUrl: 'AddToDo_Modal.html',
	      	controller: 'AddToDo_Ctrl',
	      	backdrop: 'static'
  		});
  		modalInstance.result.then(function(data) {
  			$scope.todos.push({
				title: data.title,
				description: data.description,
				actual_date: data.dateActual,
				reminder_date: data.dateReminder,
				completed: 0,
				label_style: ''
			});
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
	};

	$scope.updateToDo = function(todo) {
		for (var i = 0; i < $scope.todos.length; i++) {
			if ($scope.todos[i].id == todo.id) {
				$scope.todos[i].completed = 1 - $scope.todos[i].completed;
				$scope.todos[i].label_style = $scope.todos[i].completed == 1 ? 'completed' : '';
				break;
			}
		}
		$http({
			url: './api.php',
			method: "POST",
			data: {
				"operation": "updateToDo",
				"id": todo.id,
				"completed": todo.completed
			}
		})
		.then(function(response) {
			// success
			console.log(response.data);			
		}, function(response) {
			// failed
			console.log(response.data);
		});
	};

	$scope.deleteToDo = function(todo) {
		var modalInstance = $uibModal.open({
			animation: true,
	      	templateUrl: 'RemoveToDo_Modal.html',
	      	controller: 'RemoveToDo_Ctrl',
	      	backdrop: 'static'	      	
  		});
  		modalInstance.result.then(function() {
  			/* Save to DB */
			$http({
				url: './api.php',
				method: "POST",
				data: {
					"operation": "deleteToDo",
					"id": todo.id
				}
			})
			.then(function(response) {
				// success
				console.log(response.data);
				$scope.todos = $scope.todos.filter(function(obj) {
    				return obj.id !== todo.id;
				});				
			}, function(response) {
				// failed
				console.log(response.data);
			});
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
	};

	$scope.reloadToDos = function() {
		$http({
			url: './api.php',
			method: "POST",
			data: {
				"operation": "readToDos"
			}
		})
		.then(function(response) {
			angular.forEach(response.data, function(value, key) {
				$scope.todos.push({
					id: parseInt(value.id),
					title: value.title,
					description: value.description,
					actual_date: value.actual_date,
					reminder_date: value.reminder_date,
					completed: parseInt(value.completed),
					label_style: parseInt(value.completed) == 1 ? 'completed' : ''
				});
			});
		});
	};

	$scope.filterItemsByDate =  function(item) {
  		var today = new Date();
  		var reminder_date = new Date(item.reminder_date);
  		return reminder_date < today;
	};

	$scope.reloadCalendarEvents = function() {
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
		.then(function(response) {
			// success
			angular.forEach(response.data, function(propValue, propKey) {
				var propertyObj = propValue;
				angular.forEach(propertyObj, function(value, key) {
					$scope.events.push({
						SiteLogNo: value.SiteLogNo,
						dateFound: value.dateFound,
						siteName: value.siteName,
						siteNotes: value.siteNotes,
						siteAddress: value.siteAddress,
						streetName: value.streetName,
						sitePostcode: value.sitePostcode,
						titleNumber: value.titleNumber,
						propertyType: value.propertyType,
						owners: value.owners,
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
								$scope.chartObj[cSerie][Label] += value.owners.length;
							} else {
								$scope.chartObj[cSerie][Label] = value.owners.length;
							}
						} else {
							$scope.chartObj[cSerie] = {};
							$scope.chartObj[cSerie][Label] = value.owners.length;
						}
					}					
				});				
			});
			angular.forEach($scope.chartObj, function(value, key) {
				$scope.chartLabels.push(key);
			});
			$scope.chartLabels = $scope.filterArray($scope.chartLabels);
			for (var cIndex = 0; cIndex < $scope.chartSeries.length; cIndex ++) {			
				var cSerie = $scope.chartSeries[cIndex].toString();
				var seriesData = [];
				for (var lIndex = 0; lIndex < $scope.chartLabels.length; lIndex ++) {
					var Label = $scope.chartLabels[lIndex];					
					if ($scope.chartObj[Label][cSerie]) {
						seriesData[lIndex] = $scope.chartObj[Label][cSerie];
					} else {
						seriesData[lIndex] = 0;
					}					
				}
				$scope.chartData.push(seriesData);
			}
			$('.calendar').fullCalendar('addEventSource', $scope.events);			
		}, function(response) {
			// failed
			console.log('Read operation API call failed: ' + response);
		});
	};

	$scope.reloadTableEvents = function() {
		/* Read properties from DB */
		$http({
			url: './api.php',
			method: "POST",
			data: {
				"operation": "readDB"
			}
		})
		.then(function(response) {
			// success
			angular.forEach(response.data, function(value, key) {
				$scope.dbTableEvents.push({
					id: value.id,
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
				// Date Logged Chart
				var eventDate = new Date(value.dateFound);
				var cSerie = $scope.getChartSeries(eventDate);
				if ($scope.chartLoggedObj[cSerie]) {
					$scope.chartLoggedObj[cSerie] += 1
				} else {
					$scope.chartLoggedObj[cSerie] = 1;
				}
			});	
			angular.forEach($scope.chartLoggedObj, function(value, key) {
				$scope.chartLoggedLabels.push(key);
			});
			$scope.chartLoggedLabels = $scope.filterArray($scope.chartLoggedLabels);
			for (var lIndex = 0; lIndex < $scope.chartLoggedLabels.length; lIndex ++) {
				var Label = $scope.chartLoggedLabels[lIndex];
				if ($scope.chartLoggedObj[Label]) {
					$scope.chartLoggedData.push($scope.chartLoggedObj[Label]);
				} else {
					$scope.chartLoggedData.push(0);
				}
			}			
		}, function(response) {
			// failed
			console.log('ReadDB operation API call failed: ' + response.data);
		});
	};

	$scope.disableProperty = function(event) {
		console.log(event);
		$http({
			url: './api.php',
			method: "POST",
			data: {
				"operation": "updateDisabledCalendar",
				"SiteLogNo": event.SiteLogNo,
				"siteName": event.siteName,
				"state": 1
			}
		})
		.then(function(response) {
			// success
			for (var i = 0; i < $scope.events.length; i++) {
				if (parseInt($scope.events[i].SiteLogNo) == parseInt(event.SiteLogNo) && $scope.events[i].siteName == event.siteName) {
					$scope.events.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < $scope.dayEvents_Letter1.length; i++) {
				if (parseInt($scope.dayEvents_Letter1[i].SiteLogNo) == parseInt(event.SiteLogNo) && $scope.dayEvents_Letter1[i].siteName == event.siteName) {
					$scope.dayEvents_Letter1.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < $scope.dayEvents_Letter2.length; i++) {
				if (parseInt($scope.dayEvents_Letter2[i].SiteLogNo) == parseInt(event.SiteLogNo) && $scope.dayEvents_Letter2[i].siteName == event.siteName) {
					$scope.dayEvents_Letter2.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < $scope.dayEvents_Letter3.length; i++) {
				if (parseInt($scope.dayEvents_Letter3[i].SiteLogNo) == parseInt(event.SiteLogNo) && $scope.dayEvents_Letter3[i].siteName == event.siteName) {
					$scope.dayEvents_Letter3.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < $scope.dayEvents_Letter4.length; i++) {
				if (parseInt($scope.dayEvents_Letter4[i].SiteLogNo) == parseInt(event.SiteLogNo) && $scope.dayEvents_Letter4[i].siteName == event.siteName) {
					$scope.dayEvents_Letter4.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < $scope.dayEvents_Letter5.length; i++) {
				if (parseInt($scope.dayEvents_Letter5[i].SiteLogNo) == parseInt(event.SiteLogNo) && $scope.dayEvents_Letter5[i].siteName == event.siteName) {
					$scope.dayEvents_Letter5.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < $scope.dayEvents_Stage1.length; i++) {
				if (parseInt($scope.dayEvents_Stage1[i].SiteLogNo) == parseInt(event.SiteLogNo) && $scope.dayEvents_Stage1[i].siteName == event.siteName) {
					$scope.dayEvents_Stage1.splice(i, 1);
					break;
				}
			}
			for (var i = 0; i < $scope.dayEvents_Stage2.length; i++) {
				if (parseInt($scope.dayEvents_Stage2[i].SiteLogNo) == parseInt(event.SiteLogNo) && $scope.dayEvents_Stage2[i].siteName == event.siteName) {
					$scope.dayEvents_Stage2.splice(i, 1);
					break;
				}
			}
		}, function(response) {
			// failed
			console.log(response.data);
		});
	};

	$scope.filterArray = function(arr) {
		for (var i = 0; i < arr.length; i++) {
			arr[i] = new Date('01 ' + arr[i]);
		}
		var mas = arr.sort(function(a, b) {
			if (a < b) return -1;
			if (a > b) return 1;
		});
		for (var i = 0; i < mas.length; i++) {
			mas[i] = $scope.getChartSeries(mas[i]);
		}
		return mas;
	};

	$scope.convertLabel = function(label) {
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

	$scope.getChartSeries = function(eventDate) {
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

	$scope.toTitleCase = function(str) {
    		return str.toString().replace(/(?:^|\s)\w/g, function(match) {
        	return match.toUpperCase();
    	});
	};

	$scope.toProperCase = function(str) {
  		str = str.toLowerCase().split(' ');
  		for (var i = 0; i < str.length; i++) {
    		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
  		}
  		return str.join(' ');  		
	};

	$scope.addProperty = function() {
		var modalInstance = $uibModal.open({
			animation: true,
	      	templateUrl: 'AddProperty_Modal.html',
	      	controller: 'AddProperty_Ctrl',
	      	backdrop: 'static',
	      	size: 'lg',
    		windowClass: 'my-modal'
  		});
  		modalInstance.result.then(function(data) {
  			var oldEvents = $scope.events;
  			var newEvents = data;
  			$scope.events = oldEvents.concat(newEvents);
  			$window.location.reload();
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
	};

	$scope.deleteProperty = function(event) {
		var modalInstance = $uibModal.open({
			animation: true,
	      	templateUrl: 'RemoveProperty_Modal.html',
	      	controller: 'RemoveProperty_Ctrl',
	      	backdrop: 'static'	      	
  		});
  		modalInstance.result.then(function(data) {
  			/* Save to DB */
			$http({
				url: './api.php',
				method: "POST",
				data: {
					"operation": "delete",
					"id": event.id
				}
			})
			.then(function(response) {
				// success
				console.log(response.data);
				for (var i = 0; i < $scope.displayedCollection.length; i++) {
					if ($scope.displayedCollection[i].id == response.data.id) {
						$scope.displayedCollection.splice(i, 1);
					}
				}
				// $window.location.reload();
			}, function(response) {
				// failed
				console.log(response.data);
			});
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
	};

	$scope.updateDisabled = function(event) {
		$http({
			url: './api.php',
			method: "POST",
			data: {
				"operation": "updateDisabled",
				"id": event.id,
				"state": event.disabled ? 1 : 0
			}
		})
		.then(function(response) {
			// success
			console.log(response.data);			
		}, function(response) {
			// failed
			console.log(response.data);
		});
	};

	$scope.duplicateRecord = function(event) {
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
			landInsightSite: event.landinsightSite,
			landInsightTitle: event.landinsightTitle,
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
		angular.forEach($scope.events, function(value, key) {
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
				"landInsightSite": data.landInsightSite ? data.landInsightSite : '',
				"landInsightTitle": data.landInsightTitle ? data.landInsightTitle : '',
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
		.then(function(response) {
			// success
			// $window.location.reload();
			var duplicatedRow = {};
			angular.forEach(event, function(value, key) {
				if (key.indexOf('hashKey') == -1 && key.indexOf('proto') == -1) {
					duplicatedRow[key] = value;
				}
			});
			duplicatedRow.id = response.data.id;
			for (var i=0; i<$scope.displayedCollection.length; i++) {
				if (parseInt($scope.displayedCollection[i].id) == parseInt(data.id)) {
					$scope.displayedCollection.splice(i, 0, duplicatedRow);
					break;
				}
			}
		}, function(response) {
			// failed
			console.log(response.data);
		});
	};

	$scope.editPropertyByID = function(event) {
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
				owner_type: event.owner_type,
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
	      	templateUrl: 'EditPropertyDB_Modal.html',
	      	controller: 'EditPropertyID_Ctrl',
	      	backdrop: 'static',
	      	size: 'lg',
    		windowClass: 'my-modal'
	  	});
  		modalInstance.result.then(function(data) {
	  		for (var i=0; i<$scope.displayedCollection.length; i++) {
	  			if (parseInt($scope.displayedCollection[i].id) == parseInt(data.id)) {
	  				$scope.displayedCollection[i] = data;
	  				break;
	  			}
	  		}
  		}, function () {
      		$log.info('Modal dismissed at: ' + new Date());
  		});
	};

	$scope.editProperty = function(event) {
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
			landInsightSite: event.landinsightSite,
			landInsightTitle: event.landinsightTitle,
			qualify: event.qualify,
			fileStage1: event.fileStage1,
			fileStage2: event.fileStage2,
			fileOther: event.fileOther,
			filePowerPoint: event.filePowerPoint,
			fileTitle: event.fileTitle,
			templateLetter1: event.templateLetter1,
			stages: {
				stage1: {},
				stage2: {},
				letter1: {},
				letter2: {},
				letter3: {},
				letter4: {},
				letter5: {}
			},
			isStage2: event.isStage2
		};
		if (data.owners == undefined && (event.owner_type || event.companyName || event.individualsNames || event.owner_address)) {
			data.owners = [{
				type: event.owner_type,
				companyName: event.companyName,
				individualsNames: event.individualsNames,
				address: event.owner_address
			}];			
		}		
		angular.forEach($scope.events, function(value, key) {
			if (value.siteName === event.siteName) {
				data.stages[value.className].checkState = true;
				data.stages[value.className].stage = value.className;
				data.stages[value.className].scheduledDate = value.start;
			}
		});
		var scope = $rootScope.$new();
	  	scope.params = data;
	  	var modalInstance = $uibModal.open({
	  		scope: scope,
	  		animation: true,
	      	templateUrl: 'EditProperty_Modal.html',
	      	controller: 'EditProperty_Ctrl',
	      	backdrop: 'static',
	      	size: 'lg',
    		windowClass: 'my-modal'
	  	});
  		modalInstance.result.then(function(data) {
	  		$window.location.reload(); 		
  		}, function () {
      		$log.info('Modal dismissed at: ' + new Date());
  		});
	};

	$scope.importTemplates = function() {
		var modalInstance = $uibModal.open({
	      	templateUrl: 'UploadTemplates_Modal.html',
	      	controller: 'UploadTemplates_Ctrl',
	      	backdrop: 'static'
  		});
  		modalInstance.result.then(function(data) {
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
	};

	$scope.exportAllLetters = function(fileType) {
		var templateURL = '';
		var letterIndex = '';
		var letterDate = $scope.currentDate;
		var dayEvents = [];
		switch (fileType) {
    		case 'Letter1': 
    			dayEvents = $scope.dayEvents_Letter1;
    			letterIndex = 'L1';
    			break;
    		case 'Letter2': 
    			dayEvents = $scope.dayEvents_Letter2;
    			letterIndex = 'L2';
    			break;
    		case 'Letter3': 
    			dayEvents = $scope.dayEvents_Letter3;
    			letterIndex = 'L3';
    			break;
    		case 'Letter4': 
    			dayEvents = $scope.dayEvents_Letter4;
    			letterIndex = 'L4';
    			break;
    		case 'Letter5': 
    			dayEvents = $scope.dayEvents_Letter5;
    			letterIndex = 'L5';
    			break;
    	}
    	if (dayEvents.length > 0) {
    		for (var i = 0; i < dayEvents.length; i++) {
    			var record = dayEvents[i];
    			if (record.owners.length > 0) {
    				for (var ownerCounter = 0; ownerCounter < record.owners.length; ownerCounter++) {
    					var parts = record.owners[ownerCounter].individualsNames.split(' ');
				    	var title = parts[0];
				    	if (title.toUpperCase() == 'MR' || title.toUpperCase() == 'MS' || title.toUpperCase() == 'MRS' || title.toUpperCase() == 'MISS') {    		
				    		var lastName = parts.pop();
				    		title = title + ' ' + lastName;
				    	} else {
				    		title = record.owners[ownerCounter].individualsNames;
				    	}
				    	var pre = '<w:p><w:sz w:val="11"/><w:r><w:rFonts w:ascii="Verdana" w:hAnsi="Verdana" w:cs="Verdana"/><w:t>';
						var post = '</w:t></w:r></w:p>';
						var lineBreak = '<w:br/>';

						var CC = [];
						for (var ownerCounter2 = 0; ownerCounter2 < record.owners.length; ownerCounter2++) {
							if (ownerCounter != ownerCounter2) {
								CC.push(record.owners[ownerCounter2].individualsNames);
							}
						}

				    	var owner_address = record.owners[ownerCounter].address.replace(new RegExp(', ', 'g'), ',');
						owner_address = pre + owner_address.replace(new RegExp(',', 'g'), lineBreak) + post;
						
						var companyName = record.owners[ownerCounter].companyName;
						var individualsNames = record.owners[ownerCounter].individualsNames;
						
						var site_address = record.siteAddress;
						
			    		var letter_date = $scope.currentDate;
				        letter_date = ('0' + letter_date.getDate()).slice(-2) + '/' + ('0' + (letter_date.getMonth() + 1)).slice(-2) + '/' + letter_date.getFullYear();

				        var letter1_date = new Date(record.Letter1);
		        		letter1_date = ('0' + letter1_date.getDate()).slice(-2) + '/' + ('0' + (letter1_date.getMonth() + 1)).slice(-2) + '/' + letter1_date.getFullYear();

						var word_data = {
				            companyName: companyName.toUpperCase(),
				            individualsNames: individualsNames.toUpperCase(),
				            owner_address: owner_address,
				            site_address: site_address,
				            letter_date: $scope.formatDate(letter_date),
				            letter1_date: $scope.formatDate(letter1_date),
				            title: $scope.toProperCase(title)
				        };

				        if (record.companyName == undefined) {
				        	record.companyName = '';
				        }

				        if (CC.length > 0 && record.companyName.length > 0) {
				        	word_data.CC = 'CC: ' + $scope.toProperCase(CC.join(', '));
				        }

				        var dateStamp = new Date($scope.currentDate);
			    		dateStamp = ('0' + dateStamp.getDate()).slice(-2) + '.' + ('0' + (dateStamp.getMonth() + 1)).slice(-2) + '.' + dateStamp.getFullYear().toString().substr(-2);

			    		var postCode = record.sitePostcode;
			    		var streetName = record.streetName;

			    		var doorNumber = record.siteAddress.split(' ')[0];
			    		if (!isNaN(doorNumber.substr(0, 1))) {
			    			postCode = postCode + ' ' + doorNumber.trim();
			    		}
			    		
			    		var fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + record.SiteLogNo + ".docx";
			    		fileName = fileName.replace("  "," ");
			    		
			    		if (fileType == 'Letter1') {
			    			if (record.templateLetter1 == 'Land Agent Land Assembly Approach') {
				    			templateUrl = 'templates/Land Agent Land Assembly Approach.docx';
				    		} else {
				    			templateUrl = 'templates/Land Agent Approach.docx';
				    		}
			    		} else if (fileType == 'Letter2') {
			    			templateUrl = 'templates/8 Week Land Agent Approach.docx';
			    		}

			    		$scope.exportWordTemplate(templateUrl, word_data, fileName);

    				}
    			}    			
    		}
    	}
	};

	$scope.formatDate = function(d) {
		return moment(d).format('DD MMM YYYY');
	};

	$scope.exportWordTemplate = function(templateUrl, word_data, fileName) {

		loadFile(templateUrl, function(error, content) {
	        if (error) { throw error };
	        var zip = new JSZip(content, {type:"uint8array"});
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
	            console.log(JSON.stringify({error: e}));
	            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
	            throw error;
	        }
	        var out=doc.getZip().generate({
	            type:"blob",
	            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	        }); //Output the document using Data-URI
	        saveAs(out, fileName);
	    });

	};

	$scope.setActiveLine = function(idx) {
		for (var i = 0; i < $scope.displayedCollection.length; i++) {
			$scope.displayedCollection[i].selected = '';
		}
		$scope.displayedCollection[idx].selected = 'selected';
		$scope.activeRowId = 'db-' + idx;
		// console.log($scope.displayedCollection[idx]);
	};

	$scope.exportSingleLetter = function(property, fileType) {
		var templateURL = '';
		var letterIndex = '';
		var letterDate = $scope.currentDate;
		var dayEvents = [];
		switch (fileType) {
    		case 'Letter1': 
    			if (record.templateLetter1 == 'Land Agent Land Assembly Approach') { 
    				templateUrl = 'templates/Land Agent Land Assembly Approach.docx';
    			} else {
    				templateUrl = 'templates/Land Agent Approach.docx';
    			}
    			letterIndex = 'L1';
    			break;
    		case 'Letter2': 
    			templateUrl = 'templates/8 Week Land Agent Approach.docx';
    			letterIndex = 'L2';
    			break;
    		case 'Letter3': 
    			templateUrl = 'templates/stage3.docx';
    			letterIndex = 'L3';
    			break;
    		case 'Letter4': 
    			templateUrl = 'templates/stage4.docx';
    			letterIndex = 'L4';
    			break;
    		case 'Letter5': 
    			templateUrl = 'templates/stage5.docx';
    			letterIndex = 'L5';
    			break;
    	}
    	var record = property;
		if (record.owners.length > 0) {
			for (var ownerCounter = 0; ownerCounter < record.owners.length; ownerCounter++) {
				var parts = record.owners[ownerCounter].individualsNames.split(' ');
		    	var title = parts[0];
		    	if (title.toUpperCase() == 'MR' || title.toUpperCase() == 'MS' || title.toUpperCase() == 'MRS' || title.toUpperCase() == 'MISS') {    		
		    		var lastName = parts.pop();
		    		title = title + ' ' + lastName;
		    	} else {
		    		title = record.owners[ownerCounter].individualsNames;
		    	}
		    	var pre = '<w:p><w:sz w:val="11"/><w:r><w:rFonts w:ascii="Verdana" w:hAnsi="Verdana" w:cs="Verdana"/><w:t>';
				var post = '</w:t></w:r></w:p>';
				var lineBreak = '<w:br/>';
				var CC = [];
				for (var ownerCounter2 = 0; ownerCounter2 < record.owners.length; ownerCounter2++) {
					if (ownerCounter != ownerCounter2) {
						CC.push(record.owners[ownerCounter2].individualsNames);
					}
				}
		    	var owner_address = record.owners[ownerCounter].address.replace(new RegExp(', ', 'g'), ',');
				owner_address = pre + owner_address.replace(new RegExp(',', 'g'), lineBreak) + post;
				var companyName = record.owners[ownerCounter].companyName;
				var individualsNames = record.owners[ownerCounter].individualsNames;
				var site_address = record.siteAddress;
		    	
				var letter_date = $scope.currentDate;
		        letter_date = ('0' + letter_date.getDate()).slice(-2) + '/' + ('0' + (letter_date.getMonth() + 1)).slice(-2) + '/' + letter_date.getFullYear();

		        var letter1_date = new Date(record.Letter1);
		        letter1_date = ('0' + letter1_date.getDate()).slice(-2) + '/' + ('0' + (letter1_date.getMonth() + 1)).slice(-2) + '/' + letter1_date.getFullYear();

		        var word_data = {
		            companyName: companyName.toUpperCase(),
		            individualsNames: individualsNames.toUpperCase(),
		            owner_address: owner_address,
		            site_address: site_address,
		            letter_date: letter_date,
		            letter1_date: letter1_date,
		            title: $scope.toProperCase(title)
		        };
		        if (record.companyName == undefined) {
		        	record.companyName = '';
		        }
		        if (CC.length > 0 && companyName.length > 0) {
		        	word_data.CC = 'CC: ' + $scope.toProperCase(CC.join(', '));
		        } else {
		        	word_data.CC = '';
		        }

		        var dateStamp = new Date($scope.currentDate);
	    		dateStamp = ('0' + dateStamp.getDate()).slice(-2) + '.' + ('0' + (dateStamp.getMonth() + 1)).slice(-2) + '.' + dateStamp.getFullYear().toString().substr(-2);
	    		var postCode = record.sitePostcode == undefined ? '' : record.sitePostcode;
	    		var streetName = record.streetName == undefined ? '' : record.streetName;

	    		var doorNumber = record.siteAddress.split(' ')[0];
	    		if (!isNaN(doorNumber.substr(0, 1))) {
	    			postCode = postCode + ' ' + doorNumber;
	    		}

	    		var fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + record.SiteLogNo + ".docx";
	    		fileName = fileName.replace("  "," ");

				$scope.exportWordTemplate(templateUrl, word_data, fileName);

			}
		}
	};

	$scope.processWordTemplate = function(record, fileType) {
		var templateURL = '';
		var letterDate = undefined;
		var letter1Date = '';
		var letterIndex = '';
		var letter1_date = undefined;
		console.log(record);
		switch (fileType) {
    		case 'Letter1':
    			if (record.templateLetter1 == 'Land Agent Land Assembly Approach') { 
    				templateUrl = 'templates/Land Agent Land Assembly Approach.docx';
    			} else {
    				templateUrl = 'templates/Land Agent Approach.docx';
    			}
    			letter_date = record.Letter1;
    			letterIndex = 'L1';
    			break;
    		case 'Letter2': 
    			templateUrl = 'templates/8 Week Land Agent Approach.docx';
    			letter_date = record.Letter2;
    			letter1_date = record.Letter1;
    			letterIndex = 'L2';
    			break;
    		case 'Letter3': 
    			templateUrl = 'templates/stage3.docx';
    			letter_date = record.Letter3;
    			letterIndex = 'L3';
    			break;
    		case 'Letter4': 
    			templateUrl = 'templates/stage4.docx';
    			letter_date = record.Letter4;
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

    	var CC = [];
    	for (var i = 0; i < $scope.displayedCollection.length; i ++) {
    		if (parseInt($scope.displayedCollection[i].SiteLogNo) == parseInt(record.SiteLogNo) && 
    			$scope.displayedCollection[i].siteName == record.siteName && 
    			$scope.displayedCollection[i].individualsNames != record.individualsNames) {
    			CC.push($scope.displayedCollection[i].individualsNames);
    		}
    	}

    	loadFile(templateUrl, function(error, content) {
	        if (error) { throw error };
	        var zip = new JSZip(content, {type:"uint8array"});
	        var doc = new Docxtemplater().loadZip(zip);
			var pre = '<w:p><w:sz w:val="11"/><w:r><w:rFonts w:ascii="Verdana" w:hAnsi="Verdana" w:cs="Verdana"/><w:t>';
			var post = '</w:t></w:r></w:p>';
			var lineBreak = '<w:br/>';
			var address = record.owner_address.replace(new RegExp(', ', 'g'), ',');
			address = pre + address.replace(new RegExp(',', 'g'), lineBreak) + post;
			var word_data = {
	            companyName: record.companyName.toUpperCase(),
	            individualsNames: record.individualsNames.toUpperCase(),
	            owner_address: address,
	            site_address: record.siteAddress,
	            letter_date: $scope.formatDate(letter_date),
	            letter1_date: letter1_date != undefined ? $scope.formatDate(letter1_date) : '',
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
	                properties: error.properties,
	            }
	            console.log(JSON.stringify({error: e}));
	            // The error thrown here contains additional information when logged with JSON.stringify (it contains a property object).
	            throw error;
	        }
	        var out=doc.getZip().generate({
	            type:"blob",
	            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	        }); //Output the document using Data-URI
	        var dateStamp = new Date(letter_date);
    		dateStamp = ('0' + dateStamp.getDate()).slice(-2) + '.' + ('0' + (dateStamp.getMonth() + 1)).slice(-2) + '.' + dateStamp.getFullYear().toString().substr(-2);
    		var postCode = record.sitePostcode == undefined ? '' : record.sitePostcode;
    		var streetName = record.streetName == undefined ? '' : record.streetName;
    		
    		var doorNumber = record.siteAddress.split(' ')[0];
    		if (!isNaN(doorNumber.substr(0, 1))) {
    			postCode = postCode + ' ' + doorNumber;
    		}

    		var fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + record.SiteLogNo + ".docx";
    		fileName = fileName.replace("  "," ");

	        saveAs(out, fileName);
	    });
	};

	$scope.events = [];
	$scope.reloadCalendarEvents();
	$scope.reloadTableEvents();
	$scope.reloadToDos();
	
	// $scope.eventSources = [$scope.events];

})

.controller('AddToDo_Ctrl', function($rootScope, $scope, $http, $uibModal, $uibModalInstance, $timeout) {

	$scope.openedDateReminder = false;
	$scope.openedDateActual = false;

	$scope.todo = {
		title: '',
		description: '',
		dateReminder: new Date(),
		dateActual: new Date()
	};

	$scope.openDateReminderPicker = function() {
        $timeout(function() {
            $scope.openedDateReminder = true;
        });
    };
    $scope.openDateActualPicker = function() {
        $timeout(function() {
            $scope.openedDateActual = true;
        });
    };
    $scope.Save = function() {
    	/* Save to DB */
		$http({
			url: './api.php',
			method: "POST",
			data: {
				"operation": "saveToDo",
				"title": $scope.todo.title,
				"description": $scope.todo.description,
				"date_redimnder": $scope.todo.dateReminder,
				"siteNotes": $scope.todo.dateActual,
				"completed": 0
			}
		})
		.then(function(response) {
			// success
			console.log(response.data);
		}, function(response) {
			// failed
			console.log(response.data);
		});
    	$uibModalInstance.close($scope.todo);
    };
    $scope.Cancel = function() {
    	$uibModalInstance.dismiss();
    };

})

.controller('RemoveToDo_Ctrl', function($rootScope, $scope, $http, $uibModal, $uibModalInstance, $timeout) {
	$scope.Confirm = function () {
    	$uibModalInstance.close();
 	};
 	$scope.Cancel = function () {
    	$uibModalInstance.dismiss();
 	};
})

.controller('AddProperty_Ctrl', function($rootScope, $scope, $http, $uibModal, $uibModalInstance, $timeout) {
	
	var events = [];

	$scope.siteLogNo = '';
	$scope.dateFound = new Date();
	$scope.openedDateFound = false;
	$scope.siteName = '';
	$scope.siteNotes = '';
	$scope.siteAddress = '';
	$scope.streetName = '';
	$scope.sitePostcode = '';
	$scope.titleNumber = '';
	$scope.propertyTypes = ['Freehold', 'Leasehold'];
	$scope.propertyType = 'Freehold';
	$scope.owners = [];
	$scope.activeOwner = -1;
	$scope.titleArea = '';
	$scope.landInsightSite = '';
	$scope.landInsightTitle = '';
	$scope.qualifyOptions = ['Yes', 'No'];
	$scope.qualify = 'Yes';
	$scope.dateStage1 = '';
	$scope.openedDateStage1 = false;
	$scope.dateStage2 = '';
	$scope.openedDateStage2 = false;
	$scope.dateLetter1 = '';
	$scope.openedDateLetter1 = false;
	$scope.dateLetter2 = '';
	$scope.openedDateLetter2 = false;
	$scope.dateLetter3 = '';
	$scope.openedDateLetter3 = false;
	$scope.dateLetter4 = '';
	$scope.openedDateLetter4 = false;
	$scope.dateLetter5 = '';
	$scope.openedDateLetter5 = false;
	$scope.templatesLetter1 = ['Land Agent Approach', 'Land Agent Land Assembly Approach'];
	$scope.templateLetter1 = 'Land Agent Approach';
	$scope.stage2Options = ['Yes', 'No'];
	$scope.isStage2 = 'No';

	$scope.stage1File = undefined;
	$scope.stage2File = undefined;
	$scope.otherFile = undefined;
	$scope.powerFile = undefined;
	$scope.titleFile = undefined;
	$scope.filesToUpload = {};

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
    $scope.addOwner = function() {
    	$scope.activeOwner = -1;
    	var modalInstance = $uibModal.open({
	      	templateUrl: 'AddOwner_Modal.html',
	      	controller: 'AddOwner_Ctrl',
	      	backdrop: 'static'
	  	});
  		modalInstance.result.then(function(data) {
  			$scope.owners.push(data);
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
    };
    $scope.removeOwners = function() {
    	$scope.owners = [];
    	$scope.activeOwner = -1;
    };
    $scope.removeOwner = function() {
    	$scope.owners.splice($scope.activeOwner, 1);
    	$scope.activeOwner = -1;
    };
    $scope.editOwner = function() {
    	var scope = $rootScope.$new();
	  	scope.params = $scope.owners[$scope.activeOwner];
	  	var modalInstance = $uibModal.open({
	      	scope: scope,
	      	templateUrl: 'EditOwner_Modal.html',
	      	controller: 'EditOwner_Ctrl',
	      	backdrop: 'static'
	  	});
  		modalInstance.result.then(function(data) {
  			$scope.owners[$scope.activeOwner] = data;
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
    };
    $scope.setActiveOwner = function(idx) {
    	if ($scope.owners.length > 0) {
            angular.forEach($scope.owners, function(value, key) {
                value.selected = '';
            });
            $scope.owners[idx].selected = 'selected';
            $scope.activeOwner = idx;            
        }
    };
    $scope.updateLetterDates = function() {
    	if ($scope.dateLetter1) {
    		if (($scope.dateLetter1 instanceof Date && !isNaN($scope.dateLetter1.valueOf()))) {
    			var dLetter1 = $scope.dateLetter1;
    			var dLetter2 = new Date(dLetter1.valueOf());
    			var dLetter3 = new Date(dLetter1.valueOf());
    			dLetter2.setDate(dLetter2.getDate() + (8 * 7));
    			dLetter3.setDate(dLetter3.getDate() + (16 * 7));
    			$scope.dateLetter2 = dLetter2;
    			$scope.dateLetter3 = dLetter3;
    		} else {
    			$scope.dateLetter2 = '';
    			$scope.dateLetter3 = '';
    		}
    	} else {
    		$scope.dateLetter2 = '';
    		$scope.dateLetter3 = '';
    	}
    };
    $scope.setFile = function(element, fileType) {
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
				"operation": "create",
				"siteLogNo": $scope.siteLogNo,
				"dateFound": $scope.dateFound,
				"siteName": $scope.siteName ? $scope.siteName : '',
				"siteNotes": $scope.siteNotes ? $scope.siteNotes : '',
				"siteAddress": $scope.siteAddress ? $scope.siteAddress : '',
				"streetName": $scope.streetName ? $scope.streetName : '',
				"sitePostcode": $scope.sitePostcode ? $scope.sitePostcode : '',
				"titleNumber": $scope.titleNumber ? $scope.titleNumber : '',
				"propertyType": $scope.propertyType ? $scope.propertyType : '',
				"owners": $scope.owners ? $scope.owners : [],
				"titleArea": $scope.titleArea ? $scope.titleArea : '',
				"landInsightSite": $scope.landInsightSite ? $scope.landInsightSite : '',
				"landInsightTitle": $scope.landInsightTitle ? $scope.landInsightTitle : '',
				"qualify": $scope.qualify ? $scope.qualify : '',
				"dateStage1": $scope.dateStage1 ? $scope.dateStage1 : '',
				"dateStage2": $scope.dateStage2 ? $scope.dateStage2 : '',
				"templateLetter1": $scope.templateLetter1 ? $scope.templateLetter1 : 'Land Agent Approach',
				"dateLetter1": $scope.dateLetter1 ? $scope.dateLetter1 : '',
				"dateLetter2": $scope.dateLetter2 ? $scope.dateLetter2 : '',
				"dateLetter3": $scope.dateLetter3 ? $scope.dateLetter3 : '',
				"dateLetter4": $scope.dateLetter4 ? $scope.dateLetter4 : '',
				"dateLetter5": $scope.dateLetter5 ? $scope.dateLetter5 : '',
				"stage1File": stage1FileName,
				"stage2File": stage2FileName,
				"otherFile": otherFileName,
				"powerPointFile": powerPointFileName,
				"titleFile": titleFileName,
				"isStage2": $scope.isStage2 == 'Yes' ? 1 : 0
			}
		})
		.then(function(response) {
			// success
			console.log(response.data);
		}, function(response) {
			// failed
			console.log(response.data);
		});
		$uibModalInstance.close();
	};
	$scope.Close = function() {
		$uibModalInstance.dismiss();
	};
})

.controller('AddOwner_Ctrl', function($scope, $uibModalInstance, $timeout) {
	$scope.owner = {
		type: '',
		companyName: '',
		individualsNames: '',
		address: ''
	};
	$scope.Save = function() {
		$uibModalInstance.close($scope.owner);
	};
	$scope.Cancel = function() {
		$uibModalInstance.dismiss();
	};
})

.controller('EditOwner_Ctrl', function($scope, $uibModalInstance, $timeout) {
	$scope.Save = function() {
		$uibModalInstance.close($scope.params);
	};
	$scope.Cancel = function() {
		$uibModalInstance.dismiss();
	};
})

.controller('EventDetails_Ctrl', function($scope, $uibModalInstance, $timeout) {
	$scope.Hide = function () {
		$uibModalInstance.close('ok');
	};
})

.controller('UploadTemplates_Ctrl', function($scope, $http, $uibModalInstance, $timeout){
 	console.log('UploadTemplates_Ctrl');
 	$scope.getTheFiles = function($files) {
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
		}).success(function(data) {
			console.log(data);
		}).error(function(e) {
			console.log(e);
		});
    };
    $scope.Hide = function () {
    	$uibModalInstance.close('ok');
 	};
 })

.controller('RemoveProperty_Ctrl', function($scope, $uibModalInstance, $timeout) {
	$scope.Confirm = function () {
    	$uibModalInstance.close();
 	};
 	$scope.Cancel = function () {
    	$uibModalInstance.dismiss();
 	};
})

.controller('EditProperty_Ctrl', function($scope, $rootScope, $uibModal, $uibModalInstance, $timeout, $http) {
	
	$scope.data = $scope.params;
	$scope.propertyTypes = ['Freehold', 'Leasehold'];
	$scope.qualifyOptions = ['Yes', 'No'];
	$scope.templatesLetter1 = ['Land Agent Approach', 'Land Agent Land Assembly Approach'];
	$scope.stage2Options = ['Yes', 'No'];
	$scope.activeOwner = -1;
	$scope.filesToUpload = {};
	$scope.originalSiteName = $scope.data.siteName;

	// console.log($scope.data);
	
	$scope.openedDateFound = false;
	$scope.openedDateStage1 = false;
	$scope.openedDateStage2 = false;
	$scope.openedDateLetter1 = false;
	$scope.openedDateLetter2 = false;
	$scope.openedDateLetter3 = false;
	$scope.openedDateLetter4 = false;
	$scope.openedDateLetter5 = false;

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
    $scope.addOwner = function() {
    	$scope.activeOwner = -1;
    	var modalInstance = $uibModal.open({
	      	templateUrl: 'AddOwner_Modal.html',
	      	controller: 'AddOwner_Ctrl',
	      	backdrop: 'static'
	  	});
  		modalInstance.result.then(function(owner) {
  			$scope.data.owners.push(owner);
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
    };
    $scope.removeOwners = function() {
    	$scope.data.owners = [];
    	$scope.activeOwner = -1;
    };
    $scope.removeOwner = function() {
    	$scope.data.owners.splice($scope.activeOwner, 1);
    	$scope.activeOwner = -1;
    };
    $scope.editOwner = function() {
    	var scope = $rootScope.$new();
	  	scope.params = $scope.data.owners[$scope.activeOwner];
	  	var modalInstance = $uibModal.open({
	      	scope: scope,
	      	templateUrl: 'EditOwner_Modal.html',
	      	controller: 'EditOwner_Ctrl',
	      	backdrop: 'static'
	  	});
  		modalInstance.result.then(function(owner) {
  			$scope.data.owners[$scope.activeOwner] = owner;
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
    };
    $scope.setActiveOwner = function(idx) {
    	if ($scope.data.owners.length > 0) {
            angular.forEach($scope.data.owners, function(value, key) {
                value.selected = '';
            });
            $scope.data.owners[idx].selected = 'selected';
            $scope.activeOwner = idx;            
        }
    };
    $scope.updateLetterDates = function() {
    	if ($scope.dateLetter1) {
    		if (($scope.dateLetter1 instanceof Date && !isNaN($scope.dateLetter1.valueOf()))) {
    			var dLetter1 = $scope.data.stages.letter1.scheduledDate;
    			var dLetter2 = new Date(dLetter1.valueOf());
    			var dLetter3 = new Date(dLetter1.valueOf());
    			dLetter2.setDate(dLetter2.getDate() + (8 * 7));
    			dLetter3.setDate(dLetter3.getDate() + (16 * 7));
    			$scope.data.stages.letter2.scheduledDate = dLetter2;
    			$scope.data.stages.letter3.scheduledDate = dLetter3;
    			$scope.data.templateLetter1 = 'Land Agent Approach';
    		} else {
    			$scope.data.stages.letter2.scheduledDate = '';
    			$scope.data.stages.letter3.scheduledDate = '';
    		}
    	} else {
    		$scope.data.stages.letter2.scheduledDate = '';
    		$scope.data.stages.letter3.scheduledDate = '';
    	}
    };
    $scope.setFile = function(element, fileType) {
    	var elementID = '';
    	switch (fileType) {
    		case 'Stage1': 
    			$scope.data.fileStage1 = element.name; 
    			elementID = 'stage1Btn';
    			break;
    		case 'Stage2': 
    			$scope.data.fileStage2 = element.name;
    			elementID = 'stage2Btn';
    			break;
    		case 'Other': 
    			$scope.data.fileOther = element.name;
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

		if ($scope.data.fileStage1) {
			stage1FileName = $scope.data.fileStage1;
			console.log('stage1FileName: ' + stage1FileName);
		}
		if ($scope.data.fileStage2) {
			stage2FileName = $scope.data.fileStage2;
			console.log('stage2FileName: ' + stage2FileName);
		}
		if ($scope.data.fileOther) {
			otherFileName = $scope.data.fileOther;
			console.log('otherFileName: ' + otherFileName);
		}
		if ($scope.data.filePowerPoint) {
			powerPointFileName = $scope.data.filePowerPoint;
			console.log('powerPointFileName: ' + powerPointFileName);
		}
		if ($scope.data.fileTitle) {
			titleFileName = $scope.data.fileTitle;
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
				"originalSiteName": $scope.originalSiteName,
				"siteLogNo": $scope.data.SiteLogNo,
				"dateFound": $scope.data.dateFound,
				"siteName": $scope.data.siteName ? $scope.data.siteName : '',
				"siteNotes": $scope.data.siteNotes ? $scope.data.siteNotes : '',
				"siteAddress": $scope.data.siteAddress ? $scope.data.siteAddress : '',
				"streetName": $scope.data.streetName ? $scope.data.streetName : '',
				"sitePostcode": $scope.data.sitePostcode ? $scope.data.sitePostcode : '',
				"titleNumber": $scope.data.titleNumber ? $scope.data.titleNumber : '',
				"propertyType": $scope.data.propertyType ? $scope.data.propertyType : '',
				"owners": $scope.data.owners ? $scope.data.owners : [],
				"titleArea": $scope.data.titleArea ? $scope.data.titleArea : '',
				"landInsightSite": $scope.data.landInsightSite ? $scope.data.landInsightSite : '',
				"landInsightTitle": $scope.data.landInsightTitle ? $scope.data.landInsightTitle : '',
				"qualify": $scope.data.qualify ? $scope.data.qualify : '',
				"dateStage1": $scope.data.stages.stage1.scheduledDate ? $scope.data.stages.stage1.scheduledDate : '',
				"dateStage2": $scope.data.stages.stage2.scheduledDate ? $scope.data.stages.stage2.scheduledDate : '',
				"templateLetter1": $scope.data.templateLetter1 ? $scope.data.templateLetter1 : 'Land Agent Approach',
				"dateLetter1": $scope.data.stages.letter1.scheduledDate ? $scope.data.stages.letter1.scheduledDate : '',
				"dateLetter2": $scope.data.stages.letter2.scheduledDate ? $scope.data.stages.letter2.scheduledDate : '',
				"dateLetter3": $scope.data.stages.letter3.scheduledDate ? $scope.data.stages.letter3.scheduledDate : '',
				"dateLetter4": $scope.data.stages.letter4.scheduledDate ? $scope.data.stages.letter4.scheduledDate : '',
				"dateLetter5": $scope.data.stages.letter5.scheduledDate ? $scope.data.stages.letter5.scheduledDate : '',
				"stage1File": stage1FileName,
				"stage2File": stage2FileName,
				"otherFile": otherFileName,
				"powerPointFile": powerPointFileName,
				"titleFile": titleFileName,
				"isStage2": $scope.data.isStage2
			}
		})
		.then(function(response) {
			// success
			// console.log(response.data);
		}, function(response) {
			// failed
			console.log(response.data);
		});

		/* Add events to calendar */
		$uibModalInstance.close($scope.data);
	};
	$scope.Close = function() {
		$uibModalInstance.dismiss();
	};
})

.controller('EditPropertyID_Ctrl', function($scope, $rootScope, $uibModal, $uibModalInstance, $timeout, $http) {
	
	$scope.data = $scope.params;
	$scope.propertyTypes = ['Freehold', 'Leasehold'];
	$scope.qualifyOptions = ['Yes', 'No'];
	$scope.templatesLetter1 = ['Land Agent Approach', 'Land Agent Land Assembly Approach'];
	$scope.templateLetter1 = '';
	$scope.activeOwner = -1;
	$scope.filesToUpload = {};
	$scope.stage2Options = ['Yes', 'No'];
	$scope.openedDateFound = false;
	$scope.openedDateStage1 = false;
	$scope.openedDateStage2 = false;
	$scope.openedDateLetter1 = false;
	$scope.openedDateLetter2 = false;
	$scope.openedDateLetter3 = false;
	$scope.openedDateLetter4 = false;
	$scope.openedDateLetter5 = false;

	// console.log($scope.data);

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
    $scope.addOwner = function() {
    	$scope.activeOwner = -1;
    	var modalInstance = $uibModal.open({
	      	templateUrl: 'AddOwner_Modal.html',
	      	controller: 'AddOwner_Ctrl',
	      	backdrop: 'static'
	  	});
  		modalInstance.result.then(function(owner) {
  			$scope.data.owners.push(owner);
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
    };
    $scope.removeOwners = function() {
    	$scope.data.owners = [];
    	$scope.activeOwner = -1;
    };
    $scope.removeOwner = function() {
    	$scope.data.owners.splice($scope.activeOwner, 1);
    	$scope.activeOwner = -1;
    };
    $scope.editOwner = function() {
    	var scope = $rootScope.$new();
	  	scope.params = $scope.data.owners[$scope.activeOwner];
	  	var modalInstance = $uibModal.open({
	      	scope: scope,
	      	templateUrl: 'EditOwner_Modal.html',
	      	controller: 'EditOwner_Ctrl',
	      	backdrop: 'static'
	  	});
  		modalInstance.result.then(function(owner) {
  			$scope.data.owners[$scope.activeOwner] = owner;
  		}, function() {
  			$log.info('Modal dismissed at: ' + new Date());
  		});
    };
    $scope.setActiveOwner = function(idx) {
    	if ($scope.data.owners.length > 0) {
            angular.forEach($scope.data.owners, function(value, key) {
                value.selected = '';
            });
            $scope.data.owners[idx].selected = 'selected';
            $scope.activeOwner = idx;            
        }
    };
    $scope.updateLetterDates = function() {
    	if ($scope.data.stages.letter1.scheduledDate) {
    		if (($scope.data.stages.letter1.scheduledDate instanceof Date && !isNaN($scope.data.stages.letter1.scheduledDate.valueOf()))) {
    			var dLetter1 = $scope.data.stages.letter1.scheduledDate;
    			var dLetter2 = new Date(dLetter1.valueOf());
    			var dLetter3 = new Date(dLetter1.valueOf());
    			dLetter2.setDate(dLetter2.getDate() + (8 * 7));
    			dLetter3.setDate(dLetter3.getDate() + (16 * 7));
    			$scope.data.stages.letter2.scheduledDate = dLetter2;
    			$scope.data.stages.letter3.scheduledDate = dLetter3;
    			$scope.data.templateLetter1 = 'Land Agent Approach';
    		} else {
    			$scope.data.stages.letter2.scheduledDate = '';
    			$scope.data.stages.letter3.scheduledDate = '';
    		}
    	} else {
    		$scope.data.stages.letter2.scheduledDate = '';
    		$scope.data.stages.letter3.scheduledDate = '';
    	}
    };
    $scope.setFile = function(element, fileType) {
    	var elementID = '';
    	switch (fileType) {
    		case 'Stage1': 
    			$scope.data.fileStage1 = element.name; 
    			elementID = 'stage1Btn';
    			break;
    		case 'Stage2': 
    			$scope.data.fileStage2 = element.name;
    			elementID = 'stage2Btn';
    			break;
    		case 'Other': 
    			$scope.data.fileOther = element.name;
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

		if ($scope.data.fileStage1) {
			stage1FileName = $scope.data.fileStage1;
			console.log('stage1FileName: ' + stage1FileName);
		}
		if ($scope.data.fileStage2) {
			stage2FileName = $scope.data.fileStage2;
			console.log('stage2FileName: ' + stage2FileName);
		}
		if ($scope.data.fileOther) {
			otherFileName = $scope.data.fileOther;
			console.log('otherFileName: ' + otherFileName);
		}
		if ($scope.data.filePowerPoint) {
			powerPointFileName = $scope.data.filePowerPoint;
			console.log('powerPointFileName: ' + powerPointFileName);
		}
		if ($scope.data.fileTitle) {
			titleFileName = $scope.data.fileTitle;
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
				"operation": "update_id",
				"id": $scope.data.id,
				"siteLogNo": $scope.data.SiteLogNo,
				"dateFound": $scope.data.dateFound,
				"siteName": $scope.data.siteName ? $scope.data.siteName : '',
				"siteNotes": $scope.data.siteNotes ? $scope.data.siteNotes : '',
				"siteAddress": $scope.data.siteAddress ? $scope.data.siteAddress : '',
				"streetName": $scope.data.streetName ? $scope.data.streetName : '',
				"sitePostcode": $scope.data.sitePostcode ? $scope.data.sitePostcode : '',
				"titleNumber": $scope.data.titleNumber ? $scope.data.titleNumber : '',
				"propertyType": $scope.data.propertyType ? $scope.data.propertyType : '',
				"owners": $scope.data.owners ? $scope.data.owners : '',
				"titleArea": $scope.data.titleArea ? $scope.data.titleArea : '',
				"landInsightSite": $scope.data.landInsightSite ? $scope.data.landInsightSite : '',
				"landInsightTitle": $scope.data.landInsightTitle ? $scope.data.landInsightTitle : '',
				"qualify": $scope.data.qualify ? $scope.data.qualify : '',
				"dateStage1": $scope.data.stages.stage1.scheduledDate ? $scope.data.stages.stage1.scheduledDate : '',
				"dateStage2": $scope.data.stages.stage2.scheduledDate ? $scope.data.stages.stage2.scheduledDate : '',
				"templateLetter1": $scope.data.templateLetter1 ? $scope.data.templateLetter1 : 'Land Agent Approach',
				"dateLetter1": $scope.data.stages.letter1.scheduledDate ? $scope.data.stages.letter1.scheduledDate : '',
				"dateLetter2": $scope.data.stages.letter2.scheduledDate ? $scope.data.stages.letter2.scheduledDate : '',
				"dateLetter3": $scope.data.stages.letter3.scheduledDate ? $scope.data.stages.letter3.scheduledDate : '',
				"dateLetter4": $scope.data.stages.letter4.scheduledDate ? $scope.data.stages.letter4.scheduledDate : '',
				"dateLetter5": $scope.data.stages.letter5.scheduledDate ? $scope.data.stages.letter5.scheduledDate : '',
				"stage1File": stage1FileName,
				"stage2File": stage2FileName,
				"otherFile": otherFileName,
				"powerPointFile": powerPointFileName,
				"titleFile": titleFileName,
				"isStage2": $scope.data.isStage2
			}
		})
		.then(function(response) {
			// success			
			// console.log(response.data);
		}, function(response) {
			// failed
			console.log(response.data);
		});

		/* Add events to calendar */
		var editedRow = {
			id: parseInt($scope.data.id),
			SiteLogNo: $scope.data.SiteLogNo ? $scope.data.SiteLogNo : '',
			dateFound: $scope.data.dateFound ? $scope.data.dateFound : '',
			siteName: $scope.data.siteName ? $scope.data.siteName : '',
			siteNotes: $scope.data.siteNotes ? $scope.data.siteNotes : '',
			siteAddress: $scope.data.siteAddress ? $scope.data.siteAddress : '',
			streetName: $scope.data.streetName ? $scope.data.streetName : '',
			sitePostcode: $scope.data.sitePostcode ? $scope.data.sitePostcode : '',
			titleNumber: $scope.data.titleNumber ? $scope.data.titleNumber : '',
			propertyType: $scope.data.propertyType ? $scope.data.propertyType : '',
			owner_type: $scope.data.owners.length == 1 ? $scope.data.owners[0].type : '',
			companyName: $scope.data.owners.length == 1 ? $scope.data.owners[0].companyName : '',
			individualsNames: $scope.data.owners.length == 1 ? $scope.data.owners[0].individualsNames : '',
			owner_address: $scope.data.owners.length == 1 ? $scope.data.owners[0].address : '',
			titleArea: $scope.data.titleArea,
			landinsightSite: $scope.data.landinsightSite ? $scope.data.landinsightSite : '',
			landinsightTitle: $scope.data.landinsightTitle ? $scope.data.landinsightTitle : '',
			qualify: $scope.data.qualify,
			Stage1: $scope.data.stages.stage1.scheduledDate == '0000-00-00' ? '' : $scope.data.stages.stage1.scheduledDate,
			Stage2: $scope.data.stages.stage2.scheduledDate == '0000-00-00' ? '' : $scope.data.stages.stage2.scheduledDate,
			isStage2: $scope.data.isStage2,
			templateLetter1: $scope.data.templateLetter1,
			Letter1: $scope.data.stages.letter1.scheduledDate == '0000-00-00' ? '' : $scope.data.stages.letter1.scheduledDate,
			Letter2: $scope.data.stages.letter2.scheduledDate == '0000-00-00' ? '' : $scope.data.stages.letter2.scheduledDate,
			Letter3: $scope.data.stages.letter3.scheduledDate == '0000-00-00' ? '' : $scope.data.stages.letter3.scheduledDate,
			Letter4: $scope.data.stages.letter4.scheduledDate == '0000-00-00' ? '' : $scope.data.stages.letter4.scheduledDate,
			Letter5: $scope.data.stages.letter5.scheduledDate == '0000-00-00' ? '' : $scope.data.stages.letter5.scheduledDate,
			fileStage1: stage1FileName,
			fileStage2: stage2FileName,
			fileOther: otherFileName,
			filePowerPoint: powerPointFileName,
			fileTitle: titleFileName,
			disabled: parseInt($scope.data.disabled) == 0 ? 0 : 1
		};

		$uibModalInstance.close(editedRow);
	};
	$scope.Close = function() {
		$uibModalInstance.dismiss();
	};
});