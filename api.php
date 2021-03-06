<?php
	
	ini_set('max_execution_time', 999);
	date_default_timezone_set('Europe/London');
	error_reporting(E_ALL);
	ini_set('display_errors', '1');

	require_once './Classes/PHPExcel/IOFactory.php';

	$params = json_decode(file_get_contents('php://input'),true);
	
	if (isset($params['operation'])) {

		$CRUD = $params['operation'];

		//Connect to db
		$dbName = "admin_rightmove"; 		// <- Database name
		$tableName = "organiser";			// <- Table name
		$hostname = "localhost";			// <- Localhost always
		$username = "rightmove";			// <- User Login
		$password = "1programming1";		// <- User password

		$link = mysql_connect($hostname,$username,$password) OR die("Can't establish connection with database!");
		mysql_select_db($dbName, $link) or die(mysql_error());

		if ($CRUD == 'read') {

			$sql = "SELECT * FROM $tableName WHERE disabled = 0 ORDER BY SiteLogNo ASC";
			$query = mysql_query($sql, $link) or die('Error');

			$records = [];
			$fields = ['dateStage1', 'dateStage2', 'dateLetter1', 'dateLetter2', 'dateLetter3', 'dateLetter4', 'dateLetter5'];

			while ($row = mysql_fetch_assoc($query)) {

				foreach ($fields as $field) {

					if ($row[$field] != '0000-00-00') {
						
						if ($row['isStage2'] == 1) {
							$isStage2 = 'Yes';
						} else {
							$isStage2 = 'No';
						}
						
						$records[] = [
							'id' => intval($row['id']),
							'SiteLogNo' => intval($row['SiteLogNo']),
							'dateFound' => $row['dateFound'],
							'siteName' => $row['siteName'],
							'siteNotes' => $row['siteNotes'],
							'siteAddress' => $row['siteAddress'],
							'streetName' => $row['streetName'],
							'sitePostcode' => $row['sitePostcode'],
							'titleNumber' => $row['titleNumber'],
							'propertyType' => $row['propertyType'],
							'ownerType' => $row['ownerType'],
							'companyName' => $row['companyName'],
							'individualsNames' => $row['individualsNames'],
							'ownerAddress' => $row['ownerAddress'],
							'titleArea' => $row['titleArea'],
							'landinsightSite' => $row['landinsightSite'],
							'landinsightTitle' => $row['landinsightTitle'],
							'qualify' => $row['qualify'],
							'Stage1' => $row['dateStage1'],
							'Stage2' => $row['dateStage2'],
							'templateLetter1' => $row['templateLetter1'],
							'Letter1' => $row['dateLetter1'],
							'Letter2' => $row['dateLetter2'],
							'Letter3' => $row['dateLetter3'],
							'Letter4' => $row['dateLetter4'],
							'Letter5' => $row['dateLetter5'],
							'fileStage1' => $row['fileStage1'],
							'fileStage2' => $row['fileStage2'],
							'fileOther' => $row['fileOther'],
							'filePowerPoint' => $row['filePowerPoint'],
							'fileTitle' => $row['fileTitle'],
							'disabled' => $row['disabled'],
							'isStage2' => $isStage2,
							'EventDate' => $row[$field],
							'className' => strtolower(str_replace('date', '', $field)),
							'start' => strtotime($row[$field])								
						];
					}
				}
			}

			echo json_encode($records);

		} elseif ($CRUD == 'readDB') {

			$sql = "SELECT * FROM $tableName ORDER BY SiteLogNo DESC";
			$query = mysql_query($sql, $link) or die('Error');

			while ($row = mysql_fetch_assoc($query)) {

				if ($row['isStage2'] == 1) {
					$isStage2 = 'Yes';
				} else {
					$isStage2 = 'No';
				}

				$records[] = [
					'id' => $row['id'],
					'SiteLogNo' => intval($row['SiteLogNo']),
					'dateFound' => $row['dateFound'],
					'siteName' => $row['siteName'],
					'siteNotes' => $row['siteNotes'],
					'siteAddress' => $row['siteAddress'],
					'streetName' => $row['streetName'],
					'sitePostcode' => $row['sitePostcode'],
					'titleNumber' => $row['titleNumber'],
					'propertyType' => $row['propertyType'],
					'ownerType' => $row['ownerType'],
					'companyName' => $row['companyName'],
					'individualsNames' => $row['individualsNames'],
					'ownerAddress' => $row['ownerAddress'],
					'titleArea' => $row['titleArea'],
					'landinsightSite' => $row['landinsightSite'],
					'landinsightTitle' => $row['landinsightTitle'],
					'qualify' => $row['qualify'],
					'Stage1' => $row['dateStage1'],
					'Stage2' => $row['dateStage2'],
					'templateLetter1' => $row['templateLetter1'],
					'Letter1' => $row['dateLetter1'],
					'Letter2' => $row['dateLetter2'],
					'Letter3' => $row['dateLetter3'],
					'Letter4' => $row['dateLetter4'],
					'Letter5' => $row['dateLetter5'],
					'fileStage1' => $row['fileStage1'],
					'fileStage2' => $row['fileStage2'],
					'fileOther' => $row['fileOther'],
					'filePowerPoint' => $row['filePowerPoint'],
					'fileTitle' => $row['fileTitle'],
					'disabled' => $row['disabled'],
					'isStage2' => $isStage2
				];
			}

			echo json_encode($records);

		} elseif ($CRUD == 'readToDos') {

			$sql = "SELECT * FROM todos ORDER BY reminder_date DESC, actual_date DESC";
			$query = mysql_query($sql, $link) or die('Error');

			while ($row = mysql_fetch_assoc($query)) {

				$records[] = [
					'id' => $row['id'],
					'title' => $row['title'],
					'description' => $row['description'],
					'actual_date' => $row['actual_date'],
					'reminder_date' => $row['reminder_date'],
					'completed' => $row['completed']
				];
			}

			echo json_encode($records);

		} elseif ($CRUD == 'saveToDo') {

			$actual_date = strtotime($params['date_actual']);
			$actual_date = date('Y-m-d', $actual_date);

			$reminder_date = strtotime($params['date_redimnder']);
			$reminder_date = date('Y-m-d', $reminder_date);

			$sql = "INSERT INTO todos 
				    (title, description, actual_date, reminder_date, completed) VALUES ( 
				    '".str_replace("'", "''", $params['title'])."', 
				    '".str_replace("'", "''", $params['description'])."',
				    '".$actual_date."',
				    '".$reminder_date."',0)";

			$query = mysql_query($sql, $link) or die('Error');
			
			$out = [
				'records_added' => 1,
				'status' => 'success'
			];
			echo json_encode($out);

		} elseif ($CRUD == 'deleteToDo') {
			
			$sql = "DELETE FROM todos WHERE id = " . $params['id'];

			$query = mysql_query($sql, $link) or die('Error: ' . $sql);
			
			$out = [
				'records_removed' => 1,
				'status' => 'success'
			];
			echo json_encode($out);
		
		} elseif ($CRUD == 'updateToDo') {
			
			$sql = "UPDATE todos SET completed = " . $params['completed'] . " WHERE id = " . $params['id'];

			$query = mysql_query($sql, $link) or die('Error');
			
			$out = [
				'records_updated' => 1,
				'status' => 'success'
			];
			echo json_encode($out);

		} elseif ($CRUD == 'rescheduleLetters') {

			$field = "date" . $params["typeLetter"];

			$dateLetter = strtotime($params['dateLetter']);
			$strDateLetter = date('Y-m-d', $dateLetter);

			$originalDate = strtotime($params['originalDate']);
			$strOriginalDate = date('Y-m-d', $originalDate);

			$ids = $params["ids"];

			if ($field == 'dateLetter1') {

				$strDateLetter2 = date('Y-m-d', strtotime('+8 weeks', $dateLetter));
				$strDateLetter3 = date('Y-m-d', strtotime('+16 weeks', $dateLetter));

				$sql = "UPDATE $tableName SET dateLetter1 = '" . $strDateLetter . "', dateLetter2 = '" . $strDateLetter2 . "', dateLetter3 = '" . $strDateLetter3 . "' WHERE dateLetter1 = '" . $strOriginalDate . "' AND SiteLogNo IN (" . implode(",", $ids) . ")";
				
			} elseif ($field == 'dateLetter2') {

				$strDateLetter3 = date('Y-m-d', strtotime('+8 weeks', $dateLetter));

				$sql = "UPDATE $tableName SET dateLetter2 = '" . $strDateLetter . "', dateLetter3 = '" . $strDateLetter3 . "' WHERE dateLetter2 = '" . $strOriginalDate . "' AND SiteLogNo IN (" . implode(",", $ids) . ")";				

			} elseif ($field == 'dateLetter3') {

				$sql = "UPDATE $tableName SET dateLetter3 = '" . $strDateLetter . "' WHERE dateLetter3 = '" . $strOriginalDate . "' AND SiteLogNo IN (" . implode(",", $ids) . ")";
				
			} elseif ($field == 'dateLetter4') {

				$sql = "UPDATE $tableName SET dateLetter4 = '" . $strDateLetter . "' WHERE dateLetter4 = '" . $strOriginalDate . "' AND SiteLogNo IN (" . implode(",", $ids) . ")";
				
			}

			$query = mysql_query($sql, $link) or die('Error');

			$out = [
				'sql' => $sql,
				'status' => 'success'
			];
			echo json_encode($out);

		} elseif ($CRUD == 'create') {

			// No owners
			if (count($params["owners"]) == 0) {				
				$params["owners"][] = [
					"siteNotes" => "",
					"siteAddress" => "",
					"sitePostcode" => "",
					"titleNumber" => "",
					"streetName" => "",
					"propertyType" => "Freehold",
					"ownerType" => "",
					"companyName" => "",
					"individualsNames" => "",
					"ownerAddress" => "",
					"titleArea" => "",
					"landinsightSite" => "",
					"landinsightTitle" => "",
					"qualify" => "",
					"templateLetter1" => "Land Agent Approach",
					"dateLetter1" => "",
					"dateLetter2" => "",
					"dateLetter3" => "",
					"dateLetter4" => "",
					"dateLetter5" => "",
					"dateStage1" => "",
					"dateStage2" => "",
					"isStage2" => 0
				];
			}

			$values = [];
			$ids = [];

			if ($params['dateFound'] != '') {
				$dateFound = strtotime($params['dateFound']);
				$dateFound = date('Y-m-d', $dateFound);
			} else {
				$dateFound = '';
			}

			foreach ($params["owners"] as $owner) {
				
				if ($owner['dateStage1'] != '') {
					$dateStage1 = strtotime($owner['dateStage1']);
					$dateStage1 = date('Y-m-d', $dateStage1);
				} else {
					$dateStage1 = '';
				}
				if ($owner['dateStage2'] != '') {
					$dateStage2 = strtotime($owner['dateStage2']);
					$dateStage2 = date('Y-m-d', $dateStage2);
				} else {
					$dateStage2 = '';
				}
				if ($owner['dateLetter1'] != '') {
					$dateLetter1 = strtotime($owner['dateLetter1']);
					$dateLetter1 = date('Y-m-d', $dateLetter1);
				} else {
					$dateLetter1 = '';
				}
				if ($owner['dateLetter2'] != '') {
					$dateLetter2 = strtotime($owner['dateLetter2']);
					$dateLetter2 = date('Y-m-d', $dateLetter2);
				} else {
					$dateLetter2 = '';
				}
				if ($owner['dateLetter3'] != '') {
					$dateLetter3 = strtotime($owner['dateLetter3']);
					$dateLetter3 = date('Y-m-d', $dateLetter3);
				} else {
					$dateLetter3 = '';
				}
				if ($owner['dateLetter4'] != '') {
					$dateLetter4 = strtotime($owner['dateLetter4']);
					$dateLetter4 = date('Y-m-d', $dateLetter4);
				} else {
					$dateLetter4 = '';
				}
				if ($owner['dateLetter5'] != '') {
					$dateLetter5 = strtotime($owner['dateLetter5']);
					$dateLetter5 = date('Y-m-d', $dateLetter5);
				} else {
					$dateLetter5 = '';
				}

				if ($owner['isStage2'] == 'Yes') {
					$isStage2 = 1;
				} elseif ($owner['isStage2'] == 'No') {
					$isStage2 = 0;
				} elseif (is_numeric($owner['isStage2'])) {
					$isStage2 = $owner['isStage2'];
				} else {
					$isStage2 = 0;
				}
				
				$values = "(".$params['siteLogNo'].",
						    '".$dateFound."',
						    '".str_replace("'", "''", $params['siteName'])."',
						    '".str_replace("'", "''", $owner['siteNotes'])."',
						    '".str_replace("'", "''", $owner['siteAddress'])."',
						    '".str_replace("'", "''", $owner['streetName'])."',						    
						    '".str_replace("'", "''", $owner['sitePostcode'])."',
						    '".str_replace("'", "''", $owner['titleNumber'])."',
						    '".str_replace("'", "''", $owner['propertyType'])."',
						    '".str_replace("'", "''", $owner['ownerType'])."',
						    '".str_replace("'", "''", $owner['companyName'])."',
						    '".str_replace("'", "''", $owner['individualsNames'])."',
						    '".str_replace("'", "''", $owner['ownerAddress'])."',
						    '".str_replace("'", "''", $owner['titleArea'])."',
						    '".str_replace("'", "''", $owner['landinsightSite'])."',
						    '".str_replace("'", "''", $owner['landinsightTitle'])."',
						    '".str_replace("'", "''", $owner['qualify'])."',
						    '".$dateStage1."',
						    '".$dateStage2."',
						    '".str_replace("'", "''", $owner['templateLetter1'])."',
						    '".$dateLetter1."',
						    '".$dateLetter2."',
						    '".$dateLetter3."',
						    '".$dateLetter4."',
						    '".$dateLetter5."',
						    ".$isStage2.",
						    '".str_replace("'", "''", $params['stage1File'])."',
						    '".str_replace("'", "''", $params['stage2File'])."',
						    '".str_replace("'", "''", $params['otherFile'])."',
						    '".str_replace("'", "''", $params['powerPointFile'])."',
						    '".str_replace("'", "''", $params['titleFile'])."')";

				$sql = "INSERT INTO $tableName 
					    (SiteLogNo, dateFound, siteName, siteNotes, siteAddress, streetName, sitePostcode, titleNumber, propertyType, 
					    ownerType, companyName, individualsNames, ownerAddress, 
					    titleArea, landinsightSite, landinsightTitle, qualify, 
					    dateStage1, dateStage2, templateLetter1, dateLetter1, dateLetter2, dateLetter3, dateLetter4, dateLetter5, isStage2,
					    fileStage1, fileStage2, fileOther, filePowerPoint, fileTitle) VALUES " . $values;

				$query = mysql_query($sql, $link) or die(mysql_error());

				$ids[] = mysql_insert_id();

			}			
			
			$out = [
				'id' => implode(",", $ids),
				'status' => 'success'
			];
			echo json_encode($out);

		} elseif ($CRUD == 'update') {

			$sql = "DELETE FROM $tableName WHERE SiteLogNo = ".$params['SiteLogNo']." AND (dateStage1 <> '0000-00-00' OR dateStage2 <> '0000-00-00' OR dateLetter1 <> '0000-00-00' OR dateLetter2 <> '0000-00-00' OR dateLetter3 <> '0000-00-00' OR dateLetter4 <> '0000-00-00' OR dateLetter5 <> '0000-00-00')";
			$query = mysql_query($sql, $link) or die(mysql_error());
			
			// No owners
			if (count($params["owners"]) == 0) {				
				$params["owners"][] = [
					"siteNotes" => "",
					"siteAddress" => "",
					"sitePostcode" => "",
					"titleNumber" => "",
					"streetName" => "",
					"propertyType" => "Freehold",
					"ownerType" => "",
					"companyName" => "",
					"individualsNames" => "",
					"ownerAddress" => "",
					"titleArea" => "",
					"landinsightSite" => "",
					"landinsightTitle" => "",
					"qualify" => "",
					"templateLetter1" => "Land Agent Approach",
					"dateLetter1" => "",
					"dateLetter2" => "",
					"dateLetter3" => "",
					"dateLetter4" => "",
					"dateLetter5" => "",
					"dateStage1" => "",
					"dateStage2" => "",
					"isStage2" => 0
				];
			}

			$values = [];
			$ids = [];

			if ($params['dateFound'] != '') {
				$dateFound = strtotime($params['dateFound']);
				$dateFound = date('Y-m-d', $dateFound);
			} else {
				$dateFound = '';
			}

			foreach ($params["owners"] as $owner) {

				if ($owner['dateStage1'] != '') {
					$dateStage1 = strtotime($owner['dateStage1']);
					$dateStage1 = date('Y-m-d', $dateStage1);
				} else {
					$dateStage1 = '';
				}
				if ($owner['dateStage2'] != '') {
					$dateStage2 = strtotime($owner['dateStage2']);
					$dateStage2 = date('Y-m-d', $dateStage2);
				} else {
					$dateStage2 = '';
				}
				if ($owner['dateLetter1'] != '') {
					$dateLetter1 = strtotime($owner['dateLetter1']);
					$dateLetter1 = date('Y-m-d', $dateLetter1);
				} else {
					$dateLetter1 = '';
				}
				if ($owner['dateLetter2'] != '') {
					$dateLetter2 = strtotime($owner['dateLetter2']);
					$dateLetter2 = date('Y-m-d', $dateLetter2);
				} else {
					$dateLetter2 = '';
				}
				if ($owner['dateLetter3'] != '') {
					$dateLetter3 = strtotime($owner['dateLetter3']);
					$dateLetter3 = date('Y-m-d', $dateLetter3);
				} else {
					$dateLetter3 = '';
				}
				if ($owner['dateLetter4'] != '') {
					$dateLetter4 = strtotime($owner['dateLetter4']);
					$dateLetter4 = date('Y-m-d', $dateLetter4);
				} else {
					$dateLetter4 = '';
				}
				if ($owner['dateLetter5'] != '') {
					$dateLetter5 = strtotime($owner['dateLetter5']);
					$dateLetter5 = date('Y-m-d', $dateLetter5);
				} else {
					$dateLetter5 = '';
				}

				if ($owner['isStage2'] == 'Yes') {
					$isStage2 = 1;
				} elseif ($owner['isStage2'] == 'No') {
					$isStage2 = 0;
				} elseif (is_numeric($owner['isStage2'])) {
					$isStage2 = $owner['isStage2'];
				} else {
					$isStage2 = 0;
				}
				
				$values = "(".$params['SiteLogNo'].",
						    '".$dateFound."',
						    '".str_replace("'", "''", $params['siteName'])."',
						    '".str_replace("'", "''", $owner['siteNotes'])."',
						    '".str_replace("'", "''", $owner['siteAddress'])."',
						    '".str_replace("'", "''", $owner['streetName'])."',						    
						    '".str_replace("'", "''", $owner['sitePostcode'])."',
						    '".str_replace("'", "''", $owner['titleNumber'])."',
						    '".str_replace("'", "''", $owner['propertyType'])."',
						    '".str_replace("'", "''", $owner['ownerType'])."',
						    '".str_replace("'", "''", $owner['companyName'])."',
						    '".str_replace("'", "''", $owner['individualsNames'])."',
						    '".str_replace("'", "''", $owner['ownerAddress'])."',
						    '".str_replace("'", "''", $owner['titleArea'])."',
						    '".str_replace("'", "''", $owner['landinsightSite'])."',
						    '".str_replace("'", "''", $owner['landinsightTitle'])."',
						    '".str_replace("'", "''", $owner['qualify'])."',
						    '".$dateStage1."',
						    '".$dateStage2."',
						    '".str_replace("'", "''", $owner['templateLetter1'])."',
						    '".$dateLetter1."',
						    '".$dateLetter2."',
						    '".$dateLetter3."',
						    '".$dateLetter4."',
						    '".$dateLetter5."',
						    ".$isStage2.",
						    '".str_replace("'", "''", $params['stage1File'])."',
						    '".str_replace("'", "''", $params['stage2File'])."',
						    '".str_replace("'", "''", $params['otherFile'])."',
						    '".str_replace("'", "''", $params['powerPointFile'])."',
						    '".str_replace("'", "''", $params['titleFile'])."')";

				$sql = "INSERT INTO $tableName 
					    (SiteLogNo, dateFound, siteName, siteNotes, siteAddress, streetName, sitePostcode, titleNumber, propertyType, 
					    ownerType, companyName, individualsNames, ownerAddress, 
					    titleArea, landinsightSite, landinsightTitle, qualify, 
					    dateStage1, dateStage2, templateLetter1, dateLetter1, dateLetter2, dateLetter3, dateLetter4, dateLetter5, isStage2,
						fileStage1, fileStage2, fileOther, filePowerPoint, fileTitle) VALUES " . $values;
				
				$query = mysql_query($sql, $link) or die(mysql_error());

				$ids[] = mysql_insert_id();

			}			
			
			$out = [
				'id' => implode(",", $ids),
				'status' => 'success'
			];
			echo json_encode($out);

		} elseif ($CRUD == 'update_id') {

			if ($params['dateFound'] != '') {
				$dateFound = strtotime($params['dateFound']);
				$dateFound = date('Y-m-d', $dateFound);
			} else {
				$dateFound = '';
			}
			if ($params['dateStage1'] != '') {
				$dateStage1 = strtotime($params['dateStage1']);
				$dateStage1 = date('Y-m-d', $dateStage1);
			} else {
				$dateStage1 = '';
			}
			if ($params['dateStage2'] != '') {
				$dateStage2 = strtotime($params['dateStage2']);
				$dateStage2 = date('Y-m-d', $dateStage2);
			} else {
				$dateStage2 = '';
			}
			if ($params['dateLetter1'] != '') {
				$dateLetter1 = strtotime($params['dateLetter1']);
				$dateLetter1 = date('Y-m-d', $dateLetter1);
			} else {
				$dateLetter1 = '';
			}
			if ($params['dateLetter2'] != '') {
				$dateLetter2 = strtotime($params['dateLetter2']);
				$dateLetter2 = date('Y-m-d', $dateLetter2);
			} else {
				$dateLetter2 = '';
			}
			if ($params['dateLetter3'] != '') {
				$dateLetter3 = strtotime($params['dateLetter3']);
				$dateLetter3 = date('Y-m-d', $dateLetter3);
			} else {
				$dateLetter3 = '';
			}
			if ($params['dateLetter4'] != '') {
				$dateLetter4 = strtotime($params['dateLetter4']);
				$dateLetter4 = date('Y-m-d', $dateLetter4);
			} else {
				$dateLetter4 = '';
			}
			if ($params['dateLetter5'] != '') {
				$dateLetter5 = strtotime($params['dateLetter5']);
				$dateLetter5 = date('Y-m-d', $dateLetter5);
			} else {
				$dateLetter5 = '';
			}

			if ($params['isStage2'] == 'Yes') {
				$isStage2 = 1;
			} else {
				$isStage2 = 0;
			}

			$sql = "UPDATE $tableName 
					SET SiteLogNo = ".$params['siteLogNo'].",
						dateFound = '".$dateFound."',
						siteName = '".str_replace("'", "''", $params['siteName'])."',
						siteNotes = '".str_replace("'", "''", $params['siteNotes'])."',
						siteAddress = '".str_replace("'", "''", $params['siteAddress'])."',
						streetName = '".str_replace("'", "''", $params['streetName'])."',
						sitePostcode = '".str_replace("'", "''", $params['sitePostcode'])."',
						titleNumber = '".str_replace("'", "''", $params['titleNumber'])."',
						propertyType = '".str_replace("'", "''", $params['propertyType'])."',
						ownerType = '".str_replace("'", "''", $params['ownerType'])."',
						companyName = '".str_replace("'", "''", $params['companyName'])."',
						individualsNames = '".str_replace("'", "''", $params['individualsNames'])."',
						ownerAddress = '".str_replace("'", "''", $params['ownerAddress'])."',
						titleArea = '".str_replace("'", "''", $params['titleArea'])."',
						landinsightSite = '".str_replace("'", "''", $params['landinsightSite'])."',
						landinsightTitle = '".str_replace("'", "''", $params['landinsightTitle'])."',
						qualify = '".str_replace("'", "''", $params['qualify'])."',
						dateStage1 = '".$dateStage1."',
						dateStage2 = '".$dateStage2."',
						templateLetter1 = '".str_replace("'", "''", $params['templateLetter1'])."',
						dateLetter1 = '".$dateLetter1."',
						dateLetter2 = '".$dateLetter2."',
						dateLetter3 = '".$dateLetter3."',
						dateLetter4 = '".$dateLetter4."',
						dateLetter5 = '".$dateLetter5."',
						isStage2 = '".$isStage2."',
						disabled = '".$params['disabled']."' 
			        WHERE id = ".$params['id'];

			$query = mysql_query($sql, $link) or die('Error');
			
			$out = [
				'updated_id' => $params['id'],
				'status' => 'success'
			];
			echo json_encode($out);	

		} elseif ($CRUD == 'duplicate') {

			$sql = "INSERT INTO $tableName 
				    (SiteLogNo, dateFound, siteName, siteNotes, siteAddress, streetName, sitePostcode, titleNumber, propertyType, 
				    ownerType, companyName, individualsNames, ownerAddress, 
				    titleArea, landinsightSite, landinsightTitle, qualify, 
				    dateStage1, dateStage2, templateLetter1, dateLetter1, dateLetter2, dateLetter3, dateLetter4, dateLetter5, isStage2,
				    fileStage1, fileStage2, fileOther, filePowerPoint, fileTitle) 
					SELECT SiteLogNo, dateFound, siteName, siteNotes, siteAddress, streetName, sitePostcode, titleNumber, propertyType, 
				    ownerType, companyName, individualsNames, ownerAddress, 
				    titleArea, landinsightSite, landinsightTitle, qualify, 
				    dateStage1, dateStage2, templateLetter1, dateLetter1, dateLetter2, dateLetter3, dateLetter4, dateLetter5, isStage2,
				    fileStage1, fileStage2, fileOther, filePowerPoint, fileTitle FROM $tableName WHERE id = " . $params["id"];

			$query = mysql_query($sql, $link) or die('Error');

			$out = [
				'id' => mysql_insert_id(),
				'status' => 'success'
			];
			echo json_encode($out);	

		} elseif ($CRUD == 'delete') {

			$sql = "DELETE FROM $tableName 
			        WHERE id = ".$params['id'];

			$query = mysql_query($sql, $link) or die('Error');

			$out = [
				'id' => $params['id'],
				'status' => 'success'
			];
			echo json_encode($out);	

		} elseif ($CRUD == 'updateDisabled') {

			$sql = "UPDATE $tableName 
					SET disabled = ".$params['state']." 
			        WHERE id = ".$params['id'];

			$query = mysql_query($sql, $link) or die('Error');

			$out = [
				'record_updated' => $params['id'],
				'status' => 'success'
			];
			echo json_encode($out);	

		} elseif ($CRUD == 'updateDisabledCalendar') {

			$sql = "UPDATE $tableName 
					SET disabled = ".$params['state']." 
			        WHERE SiteLogNo = ".$params['SiteLogNo']." 
			        AND siteName = '".str_replace("'", "''", $params['siteName'])."'";

			$query = mysql_query($sql, $link) or die('Error');

			$out = [
				'record_updated' => $params['SiteLogNo'],
				'status' => 'success'
			];
			echo json_encode($out);	

		} elseif ($CRUD == 'getExcel') {

			$xlFile = 'Template.xlsx';
			$aRow = 1;

			$inputFileType = PHPExcel_IOFactory::identify($xlFile);
			$objReader = PHPExcel_IOFactory::createReader($inputFileType);
			$objReader->setReadDataOnly(false);
		  	$objPHPExcel = $objReader->load($xlFile);
		  	$objPHPExcel->setActiveSheetIndex(0);

		  	$sql = "SELECT * FROM $tableName ORDER BY SiteLogNo ASC";
			$query = mysql_query($sql, $link) or die('Error');

			while ($row = mysql_fetch_assoc($query)) {

				echo($aRow);
				$aRow = $aRow + 1;

				$objPHPExcel->getActiveSheet()->setCellValue('A'.$aRow, intval($row['SiteLogNo']));
			  	$objPHPExcel->getActiveSheet()->setCellValue('B'.$aRow, $row['dateFound']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('C'.$aRow, $row['siteName']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('D'.$aRow, $row['siteNotes']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('E'.$aRow, $row['siteAddress']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('F'.$aRow, $row['sitePostcode']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('G'.$aRow, $row['titleNumber']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('H'.$aRow, $row['propertyType']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('I'.$aRow, $row['ownerType']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('J'.$aRow, $row['companyName']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('K'.$aRow, $row['individualsNames']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('L'.$aRow, $row['ownerAddress']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('M'.$aRow, $row['titleArea']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('N'.$aRow, $row['landinsightSite']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('O'.$aRow, $row['landinsightTitle']);
				if ($row['dateStage1'] != '0000-00-00') {
			  		$objPHPExcel->getActiveSheet()->setCellValue('P'.$aRow, $row['dateStage1']);
			  	}
			  	$objPHPExcel->getActiveSheet()->setCellValue('Q'.$aRow, $row['qualify']);
			  	if ($row['dateLetter1'] != '0000-00-00') {
			  		$objPHPExcel->getActiveSheet()->setCellValue('R'.$aRow, $row['dateLetter1']);
			  	}
			  	if ($row['dateLetter2'] != '0000-00-00') {
			  		$objPHPExcel->getActiveSheet()->setCellValue('S'.$aRow, $row['dateLetter2']);
			  	}
			  	if ($row['dateLetter3'] != '0000-00-00') {
			  		$objPHPExcel->getActiveSheet()->setCellValue('T'.$aRow, $row['dateLetter3']);
			  	}
			  	if ($row['dateLetter4'] != '0000-00-00') {
			  		$objPHPExcel->getActiveSheet()->setCellValue('U'.$aRow, $row['dateLetter4']);
			  	}
			  	if ($row['dateLetter5'] != '0000-00-00') {
			  		$objPHPExcel->getActiveSheet()->setCellValue('V'.$aRow, $row['dateLetter5']);
			  	}
			  	if ($row['dateStage2'] != '0000-00-00') {
			  		$objPHPExcel->getActiveSheet()->setCellValue('W'.$aRow, $row['dateStage2']);
			  	}
			  	$objPHPExcel->getActiveSheet()->setCellValue('X'.$aRow, $row['fileStage1']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('Y'.$aRow, $row['fileStage2']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('Z'.$aRow, $row['fileOther']);
			  	$objPHPExcel->getActiveSheet()->setCellValue('AA'.$aRow, $row['filePowerPoint']);
				$objPHPExcel->getActiveSheet()->setCellValue('AB'.$aRow, $row['fileTitle']);
				
			}

			$objPHPExcel->getActiveSheet()->getStyle('B2:B'.$aRow)->getNumberFormat()->setFormatCode('dd/MM/yyyy');
			$objPHPExcel->getActiveSheet()->getStyle("A1:AB".$aRow)->getFont()->setName('Calibri')
		                           								   ->setSize(10);

		    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $inputFileType);
			$objWriter->setPreCalculateFormulas(true);
			$objWriter->save('Sites_Database.xlsx');

			$out = [
				'status' => 'success'
			];
			echo json_encode($out);	
			
		}

		mysql_close($link);

	}

?>