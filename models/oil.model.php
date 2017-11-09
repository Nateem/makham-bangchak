<?php 
require_once "./MAIN.php";
$Connect_Status = MAIN::CONNECT();
//error_reporting(0);
 $DB = $Connect_Status["DB"];

$_POST = json_decode(file_get_contents('php://input'), true);

$TYPES = isset($_POST["TYPES"]) ? $_POST["TYPES"] : "";

$arr["ERROR"]=true;
if($TYPES=="INSERT_orders"){
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";

	$PRICE = $FORM_DATA["PRICE"];
	$CODE = $FORM_DATA["CODE"];	
	$CURDATE = date("Y-m-d");
	$CURTIME = date("H:i:s");
	$user_ID = $CURRENT_DATA["ID"];

	if($PRICE > 0 && $CODE != "" && $user_ID != ""){
		$Query = mysqli_query($DB,
			"SELECT MASCODE,STNA,NAME,SURNAME
			FROM customer
			WHERE GENCODE = '{$CODE}'
			");
		$Fetch = mysqli_fetch_assoc($Query);
		if($Fetch){
			mysqli_query($DB,
			"INSERT INTO orders(PRICE,customer_CODE,CURDATE,CURTIME,user_ID,CREATED)
			VALUES ('{$PRICE}','{$CODE}','{$CURDATE}','{$CURTIME}','{$user_ID}',NOW())				
			");
			$arr["ERROR"] = false;
			$arr["MSG"] = "เพิ่ม ".$Fetch["STNA"].$Fetch['NAME'].' '.$Fetch["SURNAME"]." สำเร็จ";
			$arr["TYPE"] = "success";
		}
		else{
			$arr["ERROR"] = true;
			$arr["MSG"] = "ไม่พบเลขทะเบียนสมาชิก";
			$arr["TYPE"] = "error";
		}
		
	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "กรุณากรอกข้อมูลให้ครบถ้วน";
		$arr["TYPE"] = "warning";
	}

	echo json_encode($arr);
}
else if($TYPES=="SELECT_orders"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];
	$Query = mysqli_query($DB,
		"SELECT orders.ID,orders.PRICE,orders.customer_CODE,orders.CURDATE,orders.CURTIME,customer.STNA,customer.NAME AS CUS_FNAME,customer.SURNAME AS CUS_LNAME,customer.GENCODE,customer.AUMNO
		FROM orders			
		LEFT JOIN customer
		ON orders.customer_CODE=customer.GENCODE
		WHERE DATE(orders.CURDATE)=DATE(NOW())
		AND orders.user_ID='{$user_ID}'
		ORDER BY orders.CURTIME DESC
		LIMIT 8
		");
	$DATA = array();
	$n=0;
	while($Fetch=mysqli_fetch_assoc($Query)){
		$DATA[] = $Fetch;
		$DATA[$n]+=[
			"CUS_FULLNAME" => $Fetch["STNA"].$Fetch["CUS_FNAME"].' '.$Fetch["CUS_LNAME"]
		];
	$n++;
	}
	$arr["ERROR"] = false;
	$arr["MSG"] = "Get Data success";
	$arr["TYPE"] = "success";
	$arr["DATA"] = $DATA;
	echo json_encode($arr);
}
else{
	$arr["ERROR"] = true;
	$arr["MSG"] = "Cannot Show Database!";
	$arr["TYPE"] = "error";
	echo json_encode($arr);
}

 ?>