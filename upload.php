<?php

    print_r($_FILES['file']);

    if(isset($_FILES['file'])){
        $errors= array();        
        $file_name = $_FILES['file']['name'];
        $file_size =$_FILES['file']['size'];
        $file_tmp =$_FILES['file']['tmp_name'];
        $file_type=$_FILES['file']['type'];   
        move_uploaded_file($file_tmp, "templates/" . $file_name);        
    }
?>