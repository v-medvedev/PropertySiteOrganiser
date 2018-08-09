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

	$sql = "SELECT * FROM map_legend WHERE Username = '" . $User . "' ORDER BY price_min ASC";
	$query = mysql_query($sql, $link);

	$out = [];

	while ($row = mysql_fetch_assoc($query)) {

		$price_min = $row['price_min'];
		$price_max = $row['price_max'];
		$color = $row['color'];

		$marker = ['price_min' => $price_min, 'price_max' => $price_max, 'color' => $color];
		$out[] = $marker;

	}

	mysql_close($link);

	echo json_encode($out);

?>