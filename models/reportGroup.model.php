<?php 
require_once "./MAIN.php";
$Connect_Status = MAIN::CONNECT();
//error_reporting(0);
 $DB = $Connect_Status["DB"];

$_POST = json_decode(file_get_contents('php://input'), true);

$TYPES = isset($_POST["TYPES"]) ? $_POST["TYPES"] : "";

$arr["ERROR"]=true;
if($TYPES=="SELECT_control"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];

	$DateStart = $FORM_DATA["DateStart"];
	$DateEnd = $FORM_DATA["DateEnd"];

	if($DateStart && $DateEnd){
			$Query = mysqli_query($DB,
				"SELECT customer.AUMNO AS ORIGIN_AUMNO,SUM(orders.PRICE) AS SUMPRICE,COUNT(orders.customer_CODE) AS ORIGIN_COUNTCUSTOMER
				FROM customer
				LEFT JOIN orders
				ON customer.GENCODE=orders.customer_CODE
				WHERE DATE(orders.CURDATE) BETWEEN DATE('{$DateStart}') AND DATE('{$DateEnd}')				
				GROUP BY customer.AUMNO ASC
				");
			$DATA = array();
			$SUMTOTAL = 0;
			$n=0;
			while($Fetch=mysqli_fetch_assoc($Query)){				
				$SUMPRICE = isset($Fetch["SUMPRICE"]) ? $Fetch["SUMPRICE"] : 0;
				$DATA[]=$Fetch;
				$DATA[$n]+=[		
					"AUMNO" => number_format($Fetch['ORIGIN_AUMNO']),
					"COUNTCUSTOMER" => $Fetch["ORIGIN_COUNTCUSTOMER"]." คน",			
					"PRICE" => '<code>'.number_format($SUMPRICE,2).'</code> บาท'
				];
				$SUMTOTAL += $SUMPRICE;
			$n++;
			}
			$arr["ERROR"] = false;
			$arr["MSG"] = "Get Data success";
			$arr["TYPE"] = "success";
			$arr["DATA"] = $DATA;
			$arr["SUMTOTAL"] = '<code>'.number_format($SUMTOTAL,2).'</code> บาท';

	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "ข้อมูลไม่ครบถ้วน !";
		$arr["TYPE"] = "warning";
	}
	echo json_encode($arr);
}
else if($TYPES=="PRINT_data"){
	$CURRENT_DATA = isset($_POST["CURRENT_DATA"]) ? $_POST["CURRENT_DATA"] : "";
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";	
	$user_ID = $CURRENT_DATA["ID"];
	$USER_FULLNAME = $CURRENT_DATA["FULLNAME"];

	$DateStart = $FORM_DATA["DateStart"];
	$DateEnd = $FORM_DATA["DateEnd"];


	
	echo json_encode($arr);
}
else{
	$arr["ERROR"] = true;
	$arr["MSG"] = "Cannot Find to database!";
	$arr["TYPE"] = "error";
	echo json_encode($arr);
}
?>
