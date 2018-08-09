<?php

	header('Content-type: application/json');

	//Connect to db
	$dbName = "admin_rightmove"; 		// <- Database name
	$hostname = "localhost";			// <- Localhost always
	$username = "rightmove";			// <- User Login
	$password = "1programming1";		// <- User password
	
	$link = mysql_connect($hostname,$username,$password) OR DIE("Can't establish connection with database!");
	mysql_select_db($dbName, $link) or die(mysql_error());

	$User = $_POST['user'];
	
	$sql = "SELECT * FROM display_map WHERE Username = '" . $User . "'";
	$query = mysql_query($sql, $link);

	$out = [];

	while ($row = mysql_fetch_assoc($query)) {

		$id = $row['id'];
		$PropertyAddress = $row['PropertyAddress'];
		$Postcode = $row['Postcode'];
		$District = $row['District'];
		$Distance = $row['Distance'];
		$Duration = $row['Duration'];
		$PropertyType = $row['PropertyType'];
		$Tenure = $row['Tenure'];
		$DwellingType = $row['DwellingType'];
		$Beds = $row['Beds'];
		$SQM = $row['SQM'];
		$SQF = $row['SQF'];
		$SoldPrice = $row['SoldPrice'];
		$SoldPrice_SQF = $row['SoldPrice_SQF'];
		$SoldDate = $row['SoldDate'];
		$IndexSold = $row['IndexSold'];
		$CurrentIndexDate = $row['CurrentIndexDate'];
		$CurrentIndex = $row['CurrentIndex'];
		$Indexed_PSQFT = $row['Indexed_PSQFT'];
		$SoldPrice_SQF_Index = $row['SoldPrice_SQF_Index'];
		$Index_Diff = $row['Index_Diff'];
		$ClosestTube_Station = $row['ClosestTube_Station'];
		$ClosestTube_Distance = $row['ClosestTube_Distance'];
		$ClosestTube_Route = $row['ClosestTube_Route'];
		$ClosestRail_Station = $row['ClosestRail_Station'];
		$ClosestRail_Distance = $row['ClosestRail_Distance'];
		$Color = $row['Color'];
		$Measure = $row['Measure'];

		$marker = [
			'id' => $id,
			'Address' => $PropertyAddress,
			'Postcode' => $Postcode,
			'District' => $District,
			'Distance' => $Distance,
			'Duration' => $Duration,
			'PropertyType' => $PropertyType,
			'Tenure' => $Tenure,
			'DwellingType' => $DwellingType,
			'Beds' => $Beds,
			'SQM' => $SQM,
			'SQF' => $SQF,
			'SoldPrice' => $SoldPrice,
			'SoldPrice_SQF' => $SoldPrice_SQF,
			'SoldDate' => $SoldDate,
			'IndexSold' => $IndexSold,
			'CurrentIndexDate' => $CurrentIndexDate,
			'CurrentIndex' => $CurrentIndex,
			'Indexed_PSQFT' => $Indexed_PSQFT,
			'SoldPrice_SQF_Index' => $SoldPrice_SQF_Index,
			'Index_Diff' => $Index_Diff,
			'ClosestTube_Station' => $ClosestTube_Station,
			'ClosestTube_Route' => $ClosestTube_Route,
			'ClosestTube_Distance' => $ClosestTube_Distance,
			'ClosestRail_Station' => $ClosestRail_Station,
			'ClosestRail_Distance' => $ClosestRail_Distance,
			'Color' => $Color,
			'Measure' => $Measure
		];
		$out[] = $marker;

	}

	mysql_close($link);

	echo json_encode($out);

?>