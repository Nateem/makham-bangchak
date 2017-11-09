<?php 
require_once "./MAIN.php";
$Connect_Status = MAIN::CONNECT();
//error_reporting(0);
 $DB = $Connect_Status["DB"];

$_POST = json_decode(file_get_contents('php://input'), true);

$TYPES = isset($_POST["TYPES"]) ? $_POST["TYPES"] : "";

$arr["ERROR"]=true;
if($TYPES=="INSERT_user"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";	

	$FNAME = $FORM_DATA["FNAME"];
	$LNAME = $FORM_DATA["LNAME"];
	$OFFICE = $FORM_DATA["OFFICE"];
	$TEL = $FORM_DATA["TEL"];
	$USERNAME = $FORM_DATA["USERNAME"];
	$PASSWORD = $FORM_DATA["PASSWORD"];
	$PASSWORD = md5($PASSWORD);

	if($FNAME && $LNAME && $OFFICE && $TEL && $USERNAME && $PASSWORD){

		$Query = mysqli_query($DB,
			"SELECT USERNAME
			FROM user
			WHERE USERNAME='{$USERNAME}'
			");
		$Row = mysqli_num_rows($Query);
		if($Row>0){
			$arr["ERROR"] = true;
			$arr["MSG"] = "Username นี้มีผู้ใช้งานแล้ว ไม่สามารถใช้ได้";
			$arr["TYPE"] = "error";
		}
		else{

			mysqli_query($DB,
				"INSERT INTO user(USERNAME,PASSWORD,FNAME,LNAME,OFFICE,TEL,CREATED)
				VALUES ('{$USERNAME}','{$PASSWORD}','{$FNAME}','{$LNAME}','{$OFFICE}','{$TEL}',NOW())
				");

			$arr["ERROR"] = false;
			$arr["MSG"] = "เพิ่มผู้ใช้งานสำเร็จ..";
			$arr["TYPE"] = "success";
		}
		
	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "กรุณากรอกข้อมูลให้ครบถ้วน";
		$arr["TYPE"] = "error";
	}

echo json_encode($arr);

}
else{
	$arr["ERROR"] = true;
	$arr["MSG"] = "Cannot Show Database!";
	$arr["TYPE"] = "error";
	echo json_encode($arr);
}

?>