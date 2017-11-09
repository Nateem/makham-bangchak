<?php 
require_once "./MAIN.php";
$Connect_Status = MAIN::CONNECT();
//error_reporting(0);
 $DB = $Connect_Status["DB"];

$_POST = json_decode(file_get_contents('php://input'), true);

$TYPES = isset($_POST["TYPES"]) ? $_POST["TYPES"] : "";

$arr["ERROR"]=true;
if($TYPES==""){
	
}
else{
	$arr["ERROR"] = true;
	$arr["MSG"] = "Cannot Find to database!";
	$arr["TYPE"] = "error";
}
?>
