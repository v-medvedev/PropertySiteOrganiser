<?php

    if ( isset($_FILES['file']) && ($_POST['fileName']) && ($_POST['folderName']) ) {
        
        $file_name = $_FILES['file']['name'];
        $file_size =$_FILES['file']['size'];
        $file_tmp =$_FILES['file']['tmp_name'];
        $file_type=$_FILES['file']['type'];

        $fileName = $_POST['fileName'];
        $folder = strtolower($_POST['folderName']);
        
        move_uploaded_file($file_tmp, "files/" . $folder . '/' . $fileName);

        $out = [
            'file_type' => $folder,
            'file_name' => $fileName,
            'path' => "files/" . $folder . '/' . $fileName,
            'status' => 'success'
        ];
        echo json_encode($out);
    }

?>