<?php
  
  ini_set('max_execution_time', 999);
  date_default_timezone_set('Europe/London');
  error_reporting(E_ALL);
  ini_set('display_errors', '1');

  $backup_file = 'db-backup-'.date('Y-m-d H-i').'.sql';
  $mybackup = backup_tables("localhost","rightmove","1programming1","admin_rightmove","organiser");

  $handle = fopen('httpdocs/CalendarJS/backups/'.$backup_file, 'w+');
  fwrite($handle, $mybackup);
  fclose($handle);

  function backup_tables($host, $user, $pass, $name, $tables = '*') {
    
    $data = "\n/*---------------------------------------------------------------".
            "\n  SQL DB BACKUP ".date("d.m.Y H:i")." ".
            "\n  HOST: {$host}".
            "\n  DATABASE: {$name}".
            "\n  TABLES: {$tables}".
            "\n  ---------------------------------------------------------------*/\n";
    
    $link = mysql_connect($host, $user, $pass);
    mysql_select_db($name, $link);
    mysql_query("SET NAMES `utf8` COLLATE `utf8_general_ci`", $link);

    if ($tables == '*') {
      $tables = array();
      $result = mysql_query("SHOW TABLES");
      while ($row = mysql_fetch_row($result)) {
        $tables[] = $row[0];
      }
    } else {
      $tables = is_array($tables) ? $tables : explode(',',$tables);
    }

    foreach ($tables as $table) {
      
      $data.= "\n/*---------------------------------------------------------------".
              "\n  TABLE: `{$table}`".
              "\n  ---------------------------------------------------------------*/\n";           
      
      $data.= "DROP TABLE IF EXISTS `{$table}`;\n";
      $res = mysql_query("SHOW CREATE TABLE `{$table}`", $link);
      $row = mysql_fetch_row($res);
      $data.= $row[1].";\n";

      $result = mysql_query("SELECT * FROM `{$table}`", $link);
      $num_rows = mysql_num_rows($result);    

      if ($num_rows>0) {
        $vals = Array(); $z=0;
        for ($i=0; $i<$num_rows; $i++) {
          $items = mysql_fetch_row($result);
          $vals[$z]="(";
          for ($j=0; $j<count($items); $j++) {
            if (isset($items[$j])) { 
              $vals[$z].= "'".mysql_real_escape_string( $items[$j], $link )."'"; 
            } else { 
              $vals[$z].= "NULL"; 
            }
            if ($j<(count($items)-1)) { 
              $vals[$z].= ",";
            }
          }
          $vals[$z].= ")"; $z++;
        }
        $data.= "INSERT INTO `{$table}` VALUES ";      
        $data .= "  ".implode(";\nINSERT INTO `{$table}` VALUES ", $vals).";\n";
      }

    }

    mysql_close($link);
    return $data;

  }

?>