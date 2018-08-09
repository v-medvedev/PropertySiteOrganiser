<?php
	
	ini_set('max_execution_time', 999);
	date_default_timezone_set('Europe/London');
	error_reporting(E_ALL);
	ini_set('display_errors', '1');

	$time_start = microtime(true);

	require_once './Classes/PHPExcel/IOFactory.php';

	$xlFile = 'Template.xlsx';
	$aRow = 1;

	$inputFileType = PHPExcel_IOFactory::identify($xlFile);
	$objReader = PHPExcel_IOFactory::createReader($inputFileType);
	$objReader->setReadDataOnly(false);
  	$objPHPExcel = $objReader->load($xlFile);
  	$objPHPExcel->setActiveSheetIndex(0);

	//Connect to db
	$dbName = "admin_rightmove"; 		// <- Database name
	$tableName = "organiser";			// <- Table name
	$hostname = "localhost";			// <- Localhost always
	$username = "rightmove";			// <- User Login
	$password = "1programming1";		// <- User password

	$link = mysql_connect($hostname,$username,$password) OR die("Can't establish connection with database!");
	mysql_select_db($dbName, $link) or die(mysql_error());

  	$sql = "SELECT * FROM $tableName ORDER BY SiteLogNo ASC";
	$query = mysql_query($sql, $link) or die('Error');

	while ($row = mysql_fetch_assoc($query)) {

		echo('Site Log No:' . intval($row['SiteLogNo']) . "<br>");
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
		
		$time_end = microtime(true);
    	$time = intval($time_end - $time_start);
    	echo "Process Time: {$time}sec<hr>";
	}

	echo("Formatting<br>");

	$objPHPExcel->getActiveSheet()->getStyle('B2:B'.$aRow)->getNumberFormat()->setFormatCode('d/m/y');
	$objPHPExcel->getActiveSheet()->getStyle("A1:AB".$aRow)->getFont()->setName('Calibri')
                           								   ->setSize(10);
	
	$time_end = microtime(true);
	$time = $time_end - $time_start;
	echo "Process Time: {$time}sec<hr>";

	echo("Saving<br>");

    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, $inputFileType);
	$objWriter->setPreCalculateFormulas(true);
  	$objWriter->save('./Sites_Database.xlsx');

  	$attachment_location = './Sites_Database.xlsx';

	$time_end = microtime(true);
	$time = $time_end - $time_start;
	echo "Process Time: {$time}sec<hr>";

	echo("Export<br>");
	  
	if (file_exists($attachment_location)) {
        header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
        header("Cache-Control: public"); // needed for internet explorer
        header("Content-Type: application/zip");
        header("Content-Transfer-Encoding: Binary");
        header("Content-Length:".filesize($attachment_location));
        header("Content-Disposition: attachment; filename=file.zip");
        readfile($attachment_location);
        die();        
    } else {
        die("Error: File not found.");
    }

?>