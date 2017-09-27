<?php
/**
 * Created by PhpStorm.
 * User: user
 * Date: 06.04.2017
 * Time: 17:22
 */

$uploaddir = getcwd().DIRECTORY_SEPARATOR.'upload'.DIRECTORY_SEPARATOR;
$uploadfile = $uploaddir.basename($_FILES['file']['name']);
move_uploaded_file($_FILES['file']['tmp_name'], $uploadfile);
echo ($_FILES['file']['tmp_name']." :: ".$uploadfile);
