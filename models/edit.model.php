<?php 
require_once "./MAIN.php";
$Connect_Status = MAIN::CONNECT();
//error_reporting(0);
 $DB = $Connect_Status["DB"];

$_POST = json_decode(file_get_contents('php://input'), true);

$TYPES = isset($_POST["TYPES"]) ? $_POST["TYPES"] : "";

$arr["ERROR"]=true;
if($TYPES=="SELECT_orders"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];
	$Query = mysqli_query($DB,
		"SELECT orders.ID,orders.PRICE AS ORIGIN_PRICE,orders.customer_CODE,orders.CURDATE,orders.CURTIME,user.FNAME,user.LNAME,customer.STNA,customer.NAME AS CUS_FNAME,customer.SURNAME AS CUS_LNAME,customer.GENCODE,customer.AUMNO
		FROM orders
		LEFT JOIN user
		ON orders.user_ID=user.ID		
		LEFT JOIN customer
		ON orders.customer_CODE=customer.GENCODE
		ORDER BY orders.CREATED DESC
		");
	$DATA = array();
	$n=0;
	while($Fetch=mysqli_fetch_assoc($Query)){
		$DATA[] = $Fetch;
		$DATA[$n]+=[
			"CUS_DATA" => '<code>'.$Fetch["GENCODE"]."</code> ".$Fetch["STNA"].$Fetch["CUS_FNAME"].' '.$Fetch["CUS_LNAME"],
			"OTHER"=> "โดย ".$Fetch["FNAME"]." ".$Fetch["LNAME"],
			"CURDATETIME"=> "<date>".MAIN::shortDate($Fetch["CURDATE"]." ".$Fetch["CURTIME"]).'</date>',
			"PRICE"=> '<code>'.number_format($Fetch["ORIGIN_PRICE"],2).'</code>'
		];
	$n++;
	}
	$arr["ERROR"] = false;
	$arr["MSG"] = "Get Data success";
	$arr["TYPE"] = "success";
	$arr["DATA"] = $DATA;
	echo json_encode($arr);
}
else if($TYPES=="SELECT_orders_where"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$ORDER_ID = isset($_POST["ORDER_ID"]) ? $_POST["ORDER_ID"] : "";	
	$user_ID = $CURRENT_DATA["ID"];

	$Query = mysqli_query($DB,
		"SELECT orders.ID,orders.PRICE,orders.customer_CODE,orders.CURDATE,orders.CURTIME,customer.STNA,customer.NAME AS CUS_FNAME,customer.SURNAME AS CUS_LNAME,customer.GENCODE,customer.AUMNO
		FROM orders			
		LEFT JOIN customer
		ON orders.customer_CODE=customer.GENCODE
		WHERE orders.ID = '{$ORDER_ID}'
		");
	
	$Fetch = mysqli_fetch_assoc($Query);
	$DATA = $Fetch;
	
	$arr["ERROR"] = false;
	$arr["MSG"] = "Get Data success";
	$arr["TYPE"] = "success";
	$arr["DATA"] = $DATA;

	echo json_encode($arr);
}
else if($TYPES=="SELECT_orders_code"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$CUS_CODE = isset($_POST["CUS_CODE"]) ? $_POST["CUS_CODE"] : "";	
	$user_ID = $CURRENT_DATA["ID"];

	$Query = mysqli_query($DB,
		"SELECT customer.STNA,customer.NAME AS CUS_FNAME,customer.SURNAME AS CUS_LNAME,customer.GENCODE,customer.AUMNO
		FROM customer
		WHERE customer.GENCODE = '{$CUS_CODE}'
		");
	
	$Fetch = mysqli_fetch_assoc($Query);
	if($Fetch){
		$DATA = $Fetch;
	
		$arr["ERROR"] = false;
		$arr["MSG"] = "Get Data success";
		$arr["TYPE"] = "success";
		$arr["DATA"] = $DATA;
	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "ไม่พบเลขสมาชิกนี้";
		$arr["TYPE"] = "error";
	}
	

	echo json_encode($arr);
}
else if($TYPES=="UPDATE_orders"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];

	$ORDER_ID = $FORM_DATA["ID"];
	$CUS_CODE = $FORM_DATA["CUS_CODE"];
	$PRICE = $FORM_DATA["PRICE"];

	if($CUS_CODE != "" && $PRICE != "" && $ORDER_ID != ""){
		$Query = mysqli_query($DB,
			"SELECT customer.MASCODE
			FROM customer
			WHERE customer.GENCODE = '{$CUS_CODE}'
			");		
		$Fetch = mysqli_fetch_assoc($Query);
		if($Fetch){
			$Query2 = mysqli_query($DB,
				"SELECT customer_CODE
				FROM orders
				WHERE ID='{$ORDER_ID}'
				");
			$Fetch2=mysqli_fetch_assoc($Query2);
			if($Fetch2){

				mysqli_query($DB,
					"UPDATE orders SET customer_CODE='{$CUS_CODE}',PRICE='{$PRICE}',user_ID='{$user_ID}'
					WHERE ID = '{$ORDER_ID}'
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
		else{
			$arr["ERROR"] = true;
			$arr["MSG"] = "ไม่พบเลขสมาชิกนี้";
			$arr["TYPE"] = "error";
		}

	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "กรอกข้อมูลให้ครบถ้วน!";
		$arr["TYPE"] = "error";
	}
	echo json_encode($arr);
}
else if($TYPES=="DELETE_orders"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];
	$ORDER_ID = isset($FORM_DATA["ID"]) ? $FORM_DATA["ID"] : null;
	if($ORDER_ID){
		$Query = mysqli_query($DB,
				"SELECT customer_CODE
				FROM orders
				WHERE ID='{$ORDER_ID}'
				");
			$Fetch=mysqli_fetch_assoc($Query);
			if($Fetch){

				mysqli_query($DB,
					"DELETE FROM orders
					WHERE ID = '{$ORDER_ID}'
					");
				$arr["ERROR"] = false;
				$arr["MSG"] = "ลบข้อมูลสำเร็จ..";
				$arr["TYPE"] = "success";
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