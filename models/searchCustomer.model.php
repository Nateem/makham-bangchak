<?php 
require_once "./MAIN.php";
$Connect_Status = MAIN::CONNECT();
//error_reporting(0);
 $DB = $Connect_Status["DB"];

$_POST = json_decode(file_get_contents('php://input'), true);

$TYPES = isset($_POST["TYPES"]) ? $_POST["TYPES"] : "";

$arr["ERROR"]=true;
if($TYPES=="SELECT_customer"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$user_ID = $CURRENT_DATA["ID"];

	$Query = mysqli_query($DB,
		"SELECT AUMNO,GENCODE,MASCODE,STNA,NAME,SURNAME
		FROM customer
		ORDER BY MASCODE ASC
		");
	$DATA = array();
	$n=0;
	while ($Fetch = mysqli_fetch_assoc($Query)) {
		$DATA[]=$Fetch;
		$DATA[$n]+=[
			"FULLNAME"=> $Fetch["STNA"].$Fetch["NAME"]." ".$Fetch["SURNAME"],
		];
		$n++;
	}
	$arr["ERROR"] = false;
	$arr["MSG"] = "select database success.";
	$arr["TYPE"] = "success";
	$arr["DATA"] = $DATA;
	echo json_encode($arr);
}
else{
	$arr["ERROR"] = true;
	$arr["MSG"] = "Cannot Find to database!";
	$arr["TYPE"] = "error";
	echo json_encode($arr);
}
?>