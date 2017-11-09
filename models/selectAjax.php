<?php 
require_once "./MAIN.php";
$Connect_Status = MAIN::CONNECT();
//error_reporting(0);
 $DB = $Connect_Status["DB"];

$_POST = json_decode(file_get_contents('php://input'), true);

$TYPES = isset($_POST["TYPES"]) ? $_POST["TYPES"] : "";

$arr["ERROR"] = true;
if($TYPES=="SELECT_PREFIX"){
	$Query = mysqli_query($DB,
		"SELECT *
		FROM prefix
		ORDER BY PREFIX_ID ASC
		");
	$DATA=[];
	while($Fetch=mysqli_fetch_assoc($Query)){
		$DATA[]=$Fetch;
	}
	$arr["ERROR"] = false;
	$arr["MSG"] = "";
	$arr["DATA"] = $DATA;
	echo json_encode($arr);
}
else if($TYPES=="SELECT_PROVINCE"){
	$Query = mysqli_query($DB,
		"SELECT PROVINCE_ID,PROVINCE_NAME
		FROM province 
		ORDER BY PROVINCE_NAME ASC
		");
	$DATA = [];
	while($Fetch=mysqli_fetch_assoc($Query)){
		$DATA[] = $Fetch;
	}
	$arr["ERROR"] = false;
	$arr["MSG"] = "";
	$arr["DATA"] = $DATA;
	echo json_encode($arr);
}
else if($TYPES=="SELECT_AMPHUR"){
	$PROVINCE_ID = isset($_POST["PROVINCE_ID"]) ? $_POST["PROVINCE_ID"] : "";
	$Query = mysqli_query($DB,
		"SELECT AMPHUR_ID,AMPHUR_NAME
		FROM amphur 
		WHERE PROVINCE_ID='{$PROVINCE_ID}'
		ORDER BY AMPHUR_NAME ASC
		");
	$DATA = [];
	while($Fetch=mysqli_fetch_assoc($Query)){
		$DATA[] = $Fetch;
	}
	$arr["ERROR"] = false;
	$arr["MSG"] = "";
	$arr["DATA"] = $DATA;
	echo json_encode($arr);
}
else if($TYPES=="SELECT_DISTRICT"){
	$PROVINCE_ID = isset($_POST["PROVINCE_ID"]) ? $_POST["PROVINCE_ID"] : "";
	$AMPHUR_ID = isset($_POST["AMPHUR_ID"]) ? $_POST["AMPHUR_ID"] : "";
	$Query = mysqli_query($DB,
		"SELECT DISTRICT_ID,DISTRICT_NAME
		FROM district 
		WHERE PROVINCE_ID='{$PROVINCE_ID}'
		AND AMPHUR_ID='{$AMPHUR_ID}'
		ORDER BY DISTRICT_NAME ASC
		");
	$DATA = [];
	while($Fetch=mysqli_fetch_assoc($Query)){
		$DATA[] = $Fetch;
	}
	$arr["ERROR"] = false;
	$arr["MSG"] = "";
	$arr["DATA"] = $DATA;
	echo json_encode($arr);
}
else{
	$arr["ERROR"] = true;
	$arr["MSG"] = "Cannot Show Database!";
	echo json_encode($arr);
}