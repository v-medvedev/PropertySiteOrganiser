app.controller('CalendarCtrl', function ($rootScope, $route, $window, $scope, $log, $uibModal, $http, Excel, $timeout) {

	$http.defaults.headers.post["Content-Type"] = "application/json";

	// Scope Defaults
	$scope.events = [];
	
	$scope.dayEvents_Stage1 = [];
	$scope.dayEvents_Stage2 = [];
	$scope.dayEvents_Letter1 = [];
	$scope.dayEvents_Letter2 = [];
	$scope.dayEvents_Letter3 = [];
	$scope.dayEvents_Letter4 = [];
	$scope.dayEvents_Letter5 = [];
	$scope.currentDate = new Date();

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
		calendar: {
			editable: false,
			selectable: true,
			disableResizing: true,
			displayEventTime: false,
			eventLimit: true,
			viewRender: function (view, element) {
				$scope.currentDate = $('.calendar').fullCalendar('getDate')._d;
			},
			dayClick: function (date, allDay, jsEvent, view) {
				$scope.currentDate = new Date(date);
				$scope.dayEvents_Stage1 = [];
				$scope.dayEvents_Stage2 = [];
				$scope.dayEvents_Letter1 = [];
				$scope.dayEvents_Letter2 = [];
				$scope.dayEvents_Letter3 = [];
				$scope.dayEvents_Letter4 = [];
				$scope.dayEvents_Letter5 = [];
				angular.forEach($scope.events, function (value, key) {
					var eventDate = new Date(value.start);
					if (eventDate.toDateString() == $scope.currentDate.toDateString()) {
						if (value.className == 'stage1') {
							if (!$scope.containsObj($scope.dayEvents_Stage1, value.SiteLogNo)) {
								$scope.dayEvents_Stage1.push(value);
							}							
						}
						if (value.className == 'stage2') {
							if (!$scope.containsObj($scope.dayEvents_Stage2, value.SiteLogNo)) {
								$scope.dayEvents_Stage2.push(value);
							}
						}
						if (value.className == 'letter1') {
							if (!$scope.containsObj($scope.dayEvents_Letter1, value.SiteLogNo)) {
								$scope.dayEvents_Letter1.push(value);
							}
						}
						if (value.className == 'letter2') {
							if (!$scope.containsObj($scope.dayEvents_Letter2, value.SiteLogNo)) {
								$scope.dayEvents_Letter2.push(value);
							}
						}
						if (value.className == 'letter3') {
							if (!$scope.containsObj($scope.dayEvents_Letter3, value.SiteLogNo)) {
								$scope.dayEvents_Letter3.push(value);
							}
						}
						if (value.className == 'letter4') {
							if (!$scope.containsObj($scope.dayEvents_Letter4, value.SiteLogNo)) {
								$scope.dayEvents_Letter4.push(value);
							}
						}
						if (value.className == 'letter5') {
							if (!$scope.containsObj($scope.dayEvents_Letter5, value.SiteLogNo)) {
								$scope.dayEvents_Letter5.push(value);
							}
						}
					}
				});
			},
			eventClick: function (event) {
				var data = {
					SiteLogNo: parseInt(event.SiteLogNo),
					dateFound: event.dateFound,
					siteName: event.siteName,
					sitePostcode: event.sitePostcode,
					owners: [],
					fileStage1: event.fileStage1,
					fileStage2: event.fileStage2,
					fileTitle: event.fileTitle,
					filePowerPoint: event.filePowerPoint,
					fileOther: event.fileOther
				};
				angular.forEach($scope.events, function (value, key) {
					if (value.SiteLogNo === event.SiteLogNo) {
						if (data.owners.length == 0) {
							var owner = {
								id: value.id,
								siteNotes: value.siteNotes,
								siteAddress: value.siteAddress,
								streetName: value.streetName,
								titleNumber: value.titleNumber,
								propertyType: value.propertyType,
								ownerType: value.ownerType,
								companyName: value.companyName,
								individualsNames: value.individualsNames,
								ownerAddress: value.ownerAddress,
								titleArea: value.titleArea,
								landinsightSite: value.landinsightSite,
								landinsightTitle: value.landinsightTitle,
								Stage1: value.Stage1,
								Stage2: value.Stage2,
								qualify: value.qualify,
								isStage2: value.isStage2,
								templateLetter1: value.templateLetter1,
								stages: {},
								state: 'selected'
							};
							owner.stages[value.className] = value.start;
							data.owners.push(owner);
						} else {
							var isNew = true;
							for (var i = 0; i < data.owners.length; i++) {
								if (data.owners[i].id == value.id) {
									isNew = false;
									data.owners[i].stages[value.className] = value.start;
									break;
								}
							}
							if (isNew) {
								var owner = {
									id: value.id,
									siteNotes: value.siteNotes,
									siteAddress: value.siteAddress,
									streetName: value.streetName,
									titleNumber: value.titleNumber,
									propertyType: value.propertyType,
									ownerType: value.ownerType,
									companyName: value.companyName,
									individualsNames: value.individualsNames,
									ownerAddress: value.ownerAddress,
									titleArea: value.titleArea,
									landinsightSite: value.landinsightSite,
									landinsightTitle: value.landinsightTitle,
									Stage1: value.Stage1,
									Stage2: value.Stage2,
									qualify: value.qualify,
									isStage2: value.isStage2,
									templateLetter1: value.templateLetter1,
									stages: {},
									state: ''
								};
								owner.stages[value.className] = value.start;
								data.owners.push(owner);
							}
						}
					}
				});
				console.log(data);
				var scope = $rootScope.$new();
				scope.params = data;
				var modalInstance = $uibModal.open({
					scope: scope,
					animation: true,
					templateUrl: 'views/EventDetails_Modal.html',
					controller: 'EventDetails_Ctrl',
					backdrop: 'static',
					size: 'lg',
					windowClass: 'my-modal'
				});
				modalInstance.result.then(function (data) {
				}, function () {
					$log.info('Modal dismissed at: ' + new Date());
				});
			}
		}
	};

	$scope.containsObj = function(arr, obj) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i].SiteLogNo === obj) {
				return true;
			}
		}
		return false;
	}

	$scope.ExportData = function () {
		$http({
			url: './api.php',
			method: "POST",
			data: {
				"operation": "getExcel"
			}
		})
			.then(function (response) {

				loadFile('./Sites_Database.xlsx', function (error, content) {
					if (error) { throw error };
					var zip = new JSZip(content, { type: "uint8array" });
					var out = zip.generate({
						type: "blob",
						mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
					}); //Output the document using Data-URI
					saveAs(out, 'Sites_Database.xlsx');
				});

			});
	};

	$scope.addNewToDo = function () {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/AddToDo_Modal.html',
			controller: 'AddToDo_Ctrl',
			backdrop: 'static'
		});
		modalInstance.result.then(function (data) {
			$scope.todos.push({
				title: data.title,
				description: data.description,
				actual_date: data.dateActual,
				reminder_date: data.dateReminder,
				completed: 0,
				label_style: ''
			});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.updateToDo = function (todo) {
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
			.then(function (response) {
				// success
				console.log(response.data);
			}, function (response) {
				// failed
				console.log(response.data);
			});
	};

	$scope.deleteToDo = function (todo) {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/RemoveToDo_Modal.html',
			controller: 'RemoveToDo_Ctrl',
			backdrop: 'static'
		});
		modalInstance.result.then(function () {
			/* Save to DB */
			$http({
				url: './api.php',
				method: "POST",
				data: {
					"operation": "deleteToDo",
					"id": todo.id
				}
			})
				.then(function (response) {
					// success
					console.log(response.data);
					$scope.todos = $scope.todos.filter(function (obj) {
						return obj.id !== todo.id;
					});
				}, function (response) {
					// failed
					console.log(response.data);
				});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.reloadToDos = function () {
		$http({
			url: './api.php',
			method: "POST",
			data: {
				"operation": "readToDos"
			}
		})
			.then(function (response) {
				angular.forEach(response.data, function (value, key) {
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

	$scope.filterItemsByDate = function (item) {
		var today = new Date();
		var reminder_date = new Date(item.reminder_date);
		return reminder_date < today;
	};

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
				});
				$('.calendar').fullCalendar('addEventSource', $scope.events);
			}, function (err) {
				// failed
				console.log('Read operation API call failed: ', err);
			});
	};

	$scope.disableProperty = function (event) {
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
			.then(function (response) {
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
			}, function (response) {
				// failed
				console.log(response.data);
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

	$scope.addProperty = function () {
		var modalInstance = $uibModal.open({
			animation: true,
			templateUrl: 'views/AddProperty_Modal.html',
			controller: 'AddProperty_Ctrl',
			backdrop: 'static',
			size: 'lg',
			windowClass: 'my-modal'
		});
		modalInstance.result.then(function (data) {
			$window.location.reload();
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

	$scope.editProperty = function (event) {
		var data = {
			SiteLogNo: parseInt(event.SiteLogNo),
			siteName: event.siteName,
            dateFound: event.dateFound,
            owners: [],
            fileStage1: event.fileStage1,
            fileStage2: event.fileStage2,
            fileTitle: event.fileTitle,
            filePowerPoint: event.filePowerPoint,
            fileOther: event.fileOther
        };
        angular.forEach($scope.events, function (value, key) {
            if (value.SiteLogNo === event.SiteLogNo) {
                if (data.owners.length == 0) {
                    var owner = {
                        id: value.id,
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
                        Stage1: value.Stage1,
                        Stage2: value.Stage2,
                        qualify: value.qualify,
                        isStage2: value.isStage2,
						templateLetter1: value.templateLetter1,
						dateStage1: '',
						dateStage2: '',
						dateLetter1: '',
						dateLetter2: '',
						dateLetter3: '',
						dateLetter4: '',
						dateLetter5: '',
						state: 'selected'
					};
					var className = 'date' + value.className.substr(0, 1).toUpperCase() + value.className.substr(1);					
                    owner[className] = value.start;
                    data.owners.push(owner);
                } else {
                    var isNew = true;
                    for (var i = 0; i < data.owners.length; i++) {
                        if (data.owners[i].id == value.id) {
							isNew = false;
							var className = 'date' + value.className.substr(0, 1).toUpperCase() + value.className.substr(1);
							data.owners[i][className] = value.start;
                            break;
                        }
                    }
                    if (isNew) {
                        var owner = {
                            id: value.id,
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
                            Stage1: value.Stage1,
                            Stage2: value.Stage2,
                            qualify: value.qualify,
                            isStage2: value.isStage2,
                            templateLetter1: value.templateLetter1,
                            dateStage1: '',
							dateStage2: '',
							dateLetter1: '',
							dateLetter2: '',
							dateLetter3: '',
							dateLetter4: '',
							dateLetter5: '',
                            state: ''
						};
						var className = 'date' + value.className.substr(0, 1).toUpperCase() + value.className.substr(1);
                        owner[className] = value.start;
                        data.owners.push(owner);
                    }
                }
            }
        });
		var scope = $rootScope.$new();
		scope.params = data;
		var modalInstance = $uibModal.open({
			scope: scope,
			animation: true,
			templateUrl: 'views/EditProperty_Modal.html',
			controller: 'EditProperty_Ctrl',
			backdrop: 'static',
			size: 'lg',
			windowClass: 'my-modal'
		});
		modalInstance.result.then(function (data) {
			$window.location.reload();
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.importTemplates = function () {
		var modalInstance = $uibModal.open({
			templateUrl: 'views/UploadTemplates_Modal.html',
			controller: 'UploadTemplates_Ctrl',
			backdrop: 'static'
		});
		modalInstance.result.then(function (data) {
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.showInfo = function(event, fileType) {
		var data = {
			SiteLogNo: parseInt(event.SiteLogNo),
			dateFound: event.dateFound,
			siteName: event.siteName,
			owners: [],
			fileType: fileType.toLowerCase(),
			letterDate: moment($scope.currentDate).format('YYYY-MM-DD'),
			currentDate: $scope.currentDate
		};
		angular.forEach($scope.events, function (value, key) {
			if (value.SiteLogNo === event.SiteLogNo) {
				if (data.owners.length == 0) {
					var owner = {
						id: value.id,
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
						Stage1: value.Stage1,
						Stage2: value.Stage2,
						qualify: value.qualify,
						isStage2: value.isStage2,
						templateLetter1: value.templateLetter1,
						stages: {}
					};
					owner.stages[value.className] = value.start;
					data.owners.push(owner);
				} else {
					var isNew = true;
					for (var i = 0; i < data.owners.length; i++) {
						if (data.owners[i].id == value.id) {
							isNew = false;
							data.owners[i].stages[value.className] = value.start;
							break;
						}
					}
					if (isNew) {
						var owner = {
							id: value.id,
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
							Stage1: value.Stage1,
							Stage2: value.Stage2,
							qualify: value.qualify,
							isStage2: value.isStage2,
							templateLetter1: value.templateLetter1,
							stages: {}
						};
						owner.stages[value.className] = value.start;
						data.owners.push(owner);
					}
				}
			}
		});
		var scope = $rootScope.$new();
		scope.params = data;
		var modalInstance = $uibModal.open({
			scope: scope,
			animation: true,
			templateUrl: 'views/SiteOwners_Modal.html',
			controller: 'SiteOwners_Ctrl',
			backdrop: 'static'
		});
		modalInstance.result.then(function (data) {			
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.rescheduleAllLetters = function (fileType) {
		var letterDate = $scope.currentDate;
		var dayEvents = [];
		switch (fileType) {
			case 'Letter1':
				dayEvents = $scope.dayEvents_Letter1;
				break;
			case 'Letter2':
				dayEvents = $scope.dayEvents_Letter2;
				break;
			case 'Letter3':
				dayEvents = $scope.dayEvents_Letter3;
				break;
			case 'Letter4':
				dayEvents = $scope.dayEvents_Letter4;
				break;
			case 'Letter5':
				dayEvents = $scope.dayEvents_Letter5;
				break;
		}
		var scope = $rootScope.$new();
		scope.params = {
			letterDate: letterDate
		};
		var modalInstance = $uibModal.open({
			scope: scope,
			animation: true,
			templateUrl: 'views/RescheduleLetters_Modal.html',
			controller: 'RescheduleLetters_Ctrl',
			backdrop: 'static'
		});
		modalInstance.result.then(function (data) {
			var SiteLogNos = [];
			for (var i = 0; i < dayEvents.length; i++) {
				SiteLogNos.push(dayEvents[i].SiteLogNo);
			}
			// Save to DB
			$http({
				url: './api.php',
				method: "POST",
				data: {
					"operation": "rescheduleLetters",
					"ids": SiteLogNos,
					"typeLetter": fileType,
					"dateLetter": data,
					"originalDate": letterDate
				}
			})
			.then(function (response) {
				// success
				$window.location.reload();
			}, function (response) {
				// failed
				console.log(response.data);
			});

		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.exportAllLetters = function (fileType) {
		var dayEvents = [];
		switch (fileType) {
			case 'Letter1':
				dayEvents = $scope.dayEvents_Letter1;
				break;
			case 'Letter2':
				dayEvents = $scope.dayEvents_Letter2;
				break;
			case 'Letter3':
				dayEvents = $scope.dayEvents_Letter3;
				break;
			case 'Letter4':
				dayEvents = $scope.dayEvents_Letter4;
				break;
			case 'Letter5':
				dayEvents = $scope.dayEvents_Letter5;
				break;
		}
		dayEvents.map(function(property) {
			$scope.exportSingleLetter(property, fileType);
		});
	};

	$scope.formatDate = function (d) {
		return moment(d).format('Do MMM YYYY');
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

	$scope.exportSingleLetter = function (property, fileType) {
		
		var letterDate = $scope.currentDate;
		var owners = $scope.events.filter(function(item) {
			return (item.SiteLogNo == property.SiteLogNo && item.className == fileType.toLowerCase() && item.EventDate == moment(letterDate).format('YYYY-MM-DD'));
		});

		owners.map(function(owner, index) {

			var templateURL = '';
			var templateURL_L1_Copy = '';
			var templateURL_L2_Copy = '';
			var templateURL_L3_Copy = '';
			var letterIndex = '';
			var dayEvents = [];

			switch (fileType) {
				case 'Letter1':
					if (owner.templateLetter1 == 'Land Agent Land Assembly Approach') {
						templateUrl = 'templates/Land Agent Land Assembly Approach.docx';
					} else if (owner.templateLetter1 == 'Land Agent Approach') {
						templateUrl = 'templates/Land Agent Approach.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach') {
						templateUrl = 'templates/Partnership Approach.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach Land Assembly') {
						templateUrl = 'templates/Partnership Approach Land Assembly.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach Land Title Split') {
						templateUrl = 'templates/Partnership Approach Land Title Split.docx';
					}
					letterIndex = 'L1';
					break;
				case 'Letter2':
					templateUrl = 'templates/8 Week Land Agent Approach.docx';
					// Copy Letter1
					if (owner.templateLetter1 == 'Land Agent Land Assembly Approach') {
						templateURL_L1_Copy = 'templates/Land Agent Land Assembly Approach - Copy.docx';
					} else if (owner.templateLetter1 == 'Land Agent Approach') {
						templateURL_L1_Copy = 'templates/Land Agent Approach - Copy.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach') {
						templateURL_L1_Copy = 'templates/Partnership Approach - Copy.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach Land Assembly') {
						templateURL_L1_Copy = 'templates/Partnership Approach Land Assembly - Copy.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach Land Title Split') {
						templateURL_L1_Copy = 'templates/Partnership Approach Land Title Split - Copy.docx';
					}
					letterIndex = 'L2';
					break;
				case 'Letter3':
					// Copy Letter1
					if (owner.templateLetter1 == 'Land Agent Land Assembly Approach') {
						templateURL_L1_Copy = 'templates/Land Agent Land Assembly Approach - Copy.docx';
					} else if (owner.templateLetter1 == 'Land Agent Approach') {
						templateURL_L1_Copy = 'templates/Land Agent Approach - Copy.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach') {
						templateURL_L1_Copy = 'templates/Partnership Approach - Copy.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach Land Assembly') {
						templateURL_L1_Copy = 'templates/Partnership Approach Land Assembly - Copy.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach Land Title Split') {
						templateURL_L1_Copy = 'templates/Partnership Approach Land Title Split - Copy.docx';
					}
					templateURL_L2_Copy = 'templates/8 Week Land Agent Approach - Copy.docx';
					templateUrl = 'templates/16 Week Letter 3.docx';
					letterIndex = 'L3';
					break;
				case 'Letter4':
					// Copy Letter1
					if (owner.templateLetter1 == 'Land Agent Land Assembly Approach') {
						templateURL_L1_Copy = 'templates/Land Agent Land Assembly Approach - Copy.docx';
					} else if (owner.templateLetter1 == 'Land Agent Approach') {
						templateURL_L1_Copy = 'templates/Land Agent Approach - Copy.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach') {
						templateURL_L1_Copy = 'templates/Partnership Approach - Copy.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach Land Assembly') {
						templateURL_L1_Copy = 'templates/Partnership Approach Land Assembly - Copy.docx';
					} else if (owner.templateLetter1 == 'Partnership Approach Land Title Split') {
						templateURL_L1_Copy = 'templates/Partnership Approach Land Title Split - Copy.docx';
					}
					templateURL_L2_Copy = 'templates/8 Week Land Agent Approach - Copy.docx';
					templateURL_L3_Copy = 'templates/16 Week Letter 3.docx';
					templateUrl = 'templates/1 Year Follow Up.docx';
					letterIndex = 'L4';
					break;
				case 'Letter5':
					templateUrl = 'templates/stage5.docx';
					letterIndex = 'L5';
					break;
			}

			var parts = owner.individualsNames.split(' ');
			var title = parts[0];
			if (title.toUpperCase() == 'MR' || title.toUpperCase() == 'MS' || title.toUpperCase() == 'MRS' || title.toUpperCase() == 'MISS') {
				var lastName = parts.pop();
				title = title + ' ' + lastName;
			} else {
				title = owner.individualsNames;
			}
			var pre = '<w:p><w:r><w:rPr><w:sz w:val="20"/></w:rPr><w:rFonts w:ascii="Verdana" w:hAnsi="Verdana" w:cs="Verdana"/><w:t>';
			var post = '</w:t></w:r></w:p>';
			var lineBreak = '<w:br/>';

			var CC_Owners = $scope.events.filter(function(item) {
				return (item.SiteLogNo == property.SiteLogNo && item.siteAddress == property.siteAddress && item.id != property.id);
			});
			var CC = [];
			CC_Owners.map(function(item) {
				CC.push(item.individualsNames);
			});
			
			var owner_address = owner.ownerAddress.replace(new RegExp(', ', 'g'), ',');
			owner_address = pre + owner_address.replace(new RegExp(',', 'g'), lineBreak) + post;
			var companyName = owner.companyName;
			var individualsNames = owner.individualsNames;
			var site_address = owner.siteAddress;

			var letter_date = $scope.currentDate;
			letter_date = ('0' + letter_date.getDate()).slice(-2) + '/' + ('0' + (letter_date.getMonth() + 1)).slice(-2) + '/' + letter_date.getFullYear();

			var letter1_date = new Date(owner.Letter1);
			letter1_date = ('0' + letter1_date.getDate()).slice(-2) + '/' + ('0' + (letter1_date.getMonth() + 1)).slice(-2) + '/' + letter1_date.getFullYear();

			var letter2_date = new Date(owner.Letter2);
			letter2_date = ('0' + letter2_date.getDate()).slice(-2) + '/' + ('0' + (letter2_date.getMonth() + 1)).slice(-2) + '/' + letter2_date.getFullYear();

			var word_data = {
				companyName: companyName,
				individualsNames: individualsNames,
				owner_address: owner_address,
				site_address: site_address,
				letter_date: letter_date,
				letter1_date: letter1_date,
				letter2_date: letter2_date,
				title: $scope.toProperCase(title)
			};
			if (owner.companyName == undefined) {
				owner.companyName = '';
			}
			if (CC.length > 0 && companyName.length > 0) {
				word_data.CC = 'CC: ' + $scope.toProperCase(CC.join(', '));
			} else {
				word_data.CC = '';
			}

			var dateStamp = new Date($scope.currentDate);
			dateStamp = ('0' + dateStamp.getDate()).slice(-2) + '.' + ('0' + (dateStamp.getMonth() + 1)).slice(-2) + '.' + dateStamp.getFullYear().toString().substr(-2);
			var postCode = owner.sitePostcode == undefined ? '' : owner.sitePostcode;
			var streetName = owner.streetName == undefined ? '' : owner.streetName;

			var doorNumber = owner.siteAddress.split(' ')[0];
			if (!isNaN(doorNumber.substr(0, 1))) {
				postCode = postCode + ' ' + doorNumber;
			}

			var fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + owner.SiteLogNo + ".docx";
			fileName = fileName.replace("  ", " ");

			$scope.exportWordTemplate(templateUrl, word_data, fileName);
		
			if (fileType == 'Letter4') {
				// Check if need to generate copy Letter1
				if (templateURL_L1_Copy != '') {
					letterIndex = "L1";
					var newData1 = Object.assign({}, word_data);
					newData1.letter_date = letter1_date;
					fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + owner.SiteLogNo + " - Copy.docx";
					fileName = fileName.replace("  ", " ");
					$scope.exportWordTemplate(templateURL_L1_Copy, newData1, fileName);
				}
			} else {
				// Check if need to generate copy Letter1
				if (templateURL_L1_Copy != '') {
					letterIndex = "L1";
					var newData1 = Object.assign({}, word_data);
					newData1.letter_date = letter1_date;
					fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + owner.SiteLogNo + " - Copy.docx";
					fileName = fileName.replace("  ", " ");
					$scope.exportWordTemplate(templateURL_L1_Copy, newData1, fileName);
				}
				// Check if need to generate copy Letter2
				if (templateURL_L2_Copy != '') {
					letterIndex = "L2";
					var newData2 = Object.assign({}, word_data);
					newData2.letter_date = letter2_date;
					fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + owner.SiteLogNo + " - Copy.docx";
					fileName = fileName.replace("  ", " ");
					$scope.exportWordTemplate(templateURL_L2_Copy, newData2, fileName);
				}
				// Check if need to generate copy Letter3
				if (templateURL_L3_Copy != '') {
					letterIndex = "L3";
					var newData3 = Object.assign({}, word_data);
					newData3.letter_date = letter3_date;
					fileName = dateStamp + " M.S " + postCode + " " + streetName + " " + letterIndex + " S" + owner.SiteLogNo + " - Copy.docx";
					fileName = fileName.replace("  ", " ");
					$scope.exportWordTemplate(templateURL_L3_Copy, newData3, fileName);
				}
			}
			
		});		
	};

	$scope.events = [];
	$scope.reloadCalendarEvents();
	$scope.reloadToDos();

});