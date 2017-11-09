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
		"SELECT customer.ID,customer.MASCODE,customer.AUMNO,CONCAT(COALESCE(customer.STNA,''),COALESCE(customer.NAME,''),' ',COALESCE(customer.SURNAME,'')) AS customer_NAME,customer.TEL
		FROM customer
		ORDER BY customer.MASCODE ASC
		");
	$DATA = array();
	$n=0;
	if(!$Fetch=mysqli_fetch_assoc($Query)){
		mysqli_query($DB,
		"ALTER TABLE `customer` ADD `ID` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY (`ID`)
		");
	}
	while($Fetch=mysqli_fetch_assoc($Query)){
		$DATA[] = $Fetch;		
	$n++;
	}
	$arr["ERROR"] = false;
	$arr["MSG"] = "Get Data success";
	$arr["TYPE"] = "success";
	$arr["DATA"] = $DATA;
	echo json_encode($arr);
}
else if($TYPES=="SELECT_customer_where"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$customer_ID = isset($_POST["customer_ID"]) ? $_POST["customer_ID"] : "";	
	$user_ID = $CURRENT_DATA["ID"];

	$Query = mysqli_query($DB,
		"SELECT customer.ID,customer.MASCODE,customer.AUMNO,customer.STNA,customer.NAME,customer.SURNAME,customer.TEL
		FROM customer					
		WHERE customer.ID = '{$customer_ID}'
		");
	
	$Fetch = mysqli_fetch_assoc($Query);
	$DATA = $Fetch;
	
	$arr["ERROR"] = false;
	$arr["MSG"] = "Get Data success";
	$arr["TYPE"] = "success";
	$arr["DATA"] = $DATA;
	//$arr["_POST"] = $_POST;

	echo json_encode($arr);
}
else if($TYPES=="INSERT_customer"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];

	$MASCODE = $FORM_DATA["MASCODE"];
	$AUMNO = $FORM_DATA["AUMNO"];
	$NAME = $FORM_DATA["NAME"];	
	$SURNAME = $FORM_DATA["SURNAME"];	
	$STNA = $FORM_DATA["STNA"];	
	$TEL = $FORM_DATA["TEL"];		

	if($MASCODE && $AUMNO && $NAME && $SURNAME && $STNA && $TEL){
		$Query = mysqli_query($DB,
			"SELECT NAME,SURNAME
			FROM customer
			WHERE MASCODE='{$MASCODE}'
			");
		$Fetch=mysqli_fetch_assoc($Query);
		if($Fetch){
			$arr["ERROR"] = true;
			$arr["MSG"] = "รหัสสมาชิกซ้ำ!";
			$arr["TYPE"] = "warning";
		}
		else{
			try {
				mysqli_query($DB,
					"INSERT INTO customer(MASCODE,AUMNO,NAME,SURNAME,STNA,TEL)
					VALUES ('{$MASCODE}','{$AUMNO}','{$NAME}','{$SURNAME}','{$STNA}','{$TEL}')
					");
				$arr["ERROR"] = false;
				$arr["MSG"] = "เพิ่มข้อมูลสำเร็จ..";
				$arr["TYPE"] = "success";
			} catch (Exception $e) {
				$arr["ERROR"] = true;
				$arr["MSG"] = "Mysql Error !";
				$arr["TYPE"] = "error";
			}
		}
		
	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "กรอกข้อมูลให้ครบถ้วน!";
		$arr["TYPE"] = "error";
	}
	echo json_encode($arr);
}
else if($TYPES=="UPDATE_customer"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];

	$ID = $FORM_DATA["ID"];
	$MASCODE = $FORM_DATA["MASCODE"];
	$AUMNO = $FORM_DATA["AUMNO"];
	$NAME = $FORM_DATA["NAME"];	
	$SURNAME = $FORM_DATA["SURNAME"];	
	$STNA = $FORM_DATA["STNA"];	
	$TEL = $FORM_DATA["TEL"];		

	if($MASCODE && $AUMNO && $NAME && $SURNAME && $STNA && $TEL){
		$Query = mysqli_query($DB,
			"SELECT MASCODE
			FROM customer
			WHERE ID='{$ID}'
			");
		$Fetch=mysqli_fetch_assoc($Query);
		if($Fetch["MASCODE"]!= $MASCODE){
			$Query3 = mysqli_query($DB,
				"SELECT NAME,SURNAME
				FROM customer
				WHERE MASCODE='{$MASCODE}'
				");
			$Fetch3=mysqli_fetch_assoc($Query3);
			if($Fetch3){
				$arr["ERROR"] = true;
				$arr["MSG"] = "รหัสสมาชิกซ้ำ!";
				$arr["TYPE"] = "warning";
			}
			else{
				mysqli_query($DB,
					"UPDATE customer SET MASCODE='{$MASCODE}',AUMNO='{$AUMNO}',NAME='{$NAME}',SURNAME='{$SURNAME}',STNA='{$STNA}',TEL='{$TEL}'
					WHERE ID = '{$ID}'
					");
				$arr["ERROR"] = false;
				$arr["MSG"] = "แก้ไขข้อมูลสำเร็จ..";
				$arr["TYPE"] = "success";
			}
		}
		else{
			$Query2 = mysqli_query($DB,
				"SELECT customer.ID
				FROM customer
				WHERE customer.ID='{$ID}'
				");
			$Fetch2=mysqli_fetch_assoc($Query2);
			if($Fetch2){
				mysqli_query($DB,
						"UPDATE customer SET AUMNO='{$AUMNO}',NAME='{$NAME}',SURNAME='{$SURNAME}',STNA='{$STNA}',TEL='{$TEL}'
						WHERE ID = '{$ID}'
						");
					$arr["ERROR"] = false;
					$arr["MSG"] = "แก้ไขข้อมูลสำเร็จ..";
					$arr["TYPE"] = "success";
			}
			else{

				$arr["ERROR"] = true;
				$arr["MSG"] = "ข้อมูลไม่ครบถ้วน !";
				$arr["TYPE"] = "warning";
			}
		}
	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "กรอกข้อมูลให้ครบถ้วน!";
		$arr["TYPE"] = "error";
	}
	echo json_encode($arr);
}
else if($TYPES=="DELETE_customer"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];
	$ID = isset($FORM_DATA["ID"]) ? $FORM_DATA["ID"] : null;
	if($ID){
		$Query = mysqli_query($DB,
				"SELECT NAME
				FROM customer
				WHERE ID='{$ID}'
				");
			$Fetch=mysqli_fetch_assoc($Query);
			if($Fetch){
				try {
					mysqli_query($DB,
						"DELETE FROM customer
						WHERE ID = '{$ID}'
						");
					$arr["ERROR"] = false;
					$arr["MSG"] = "ลบข้อมูลสำเร็จ..";
					$arr["TYPE"] = "success";
				} catch (Exception $e) {
					$arr["ERROR"] = true;
					$arr["MSG"] = "Mysql Delete Error !";
					$arr["TYPE"] = "error";
				}
				
			}
			else{
				$arr["ERROR"] = true;
				$arr["MSG"] = "ไม่พบข้อมูลที่ต้องการลบ !";
				$arr["TYPE"] = "warning";
			}	
	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "Error not data!";
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