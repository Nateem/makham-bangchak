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
	$ChooseData = $FORM_DATA["ChooseData"];
	$PunPon = $FORM_DATA["PunPon"];

	if($DateStart && $DateEnd){

		if($ChooseData=="SOMEHAVE"){
			$Query = mysqli_query($DB,
				"SELECT SUM(orders.PRICE) AS ORIGIN_PRICE,orders.CURDATE,orders.CURTIME,customer.STNA,customer.NAME,customer.SURNAME,customer.MASCODE AS ORIGIN_MASCODE,customer.GENCODE AS ORIGIN_GENCODE,customer.AUMNO
				FROM orders
				LEFT JOIN customer
				ON orders.customer_CODE=customer.GENCODE
				WHERE DATE(orders.CURDATE) BETWEEN DATE('{$DateStart}') AND DATE('{$DateEnd}')
				GROUP BY customer.MASCODE
				ORDER BY customer.MASCODE ASC
				");
			$DATA = array();
			$SUMTOTAL = 0;
			$SUMTOTAL_PUNPON=0;
			$n=0;
			while($Fetch=mysqli_fetch_assoc($Query)){
				$DATA[] = $Fetch;
				$PUNPON_PRICE = ($PunPon/100)*$Fetch["ORIGIN_PRICE"];
				$DATA[$n]+=[
					"GENCODE" => "<code>".$Fetch["ORIGIN_GENCODE"]."</code>",
					"CUS_DATA" => $Fetch["STNA"].$Fetch["NAME"].' '.$Fetch["SURNAME"],				
					"CURDATETIME"=> "<date>".MAIN::shortDate($Fetch["CURDATE"]." ".$Fetch["CURTIME"]).'</date>',
					"PRICE" => '<code>'.number_format($Fetch["ORIGIN_PRICE"],2).'</code>',
					'PUNPON_PRICE' => $PUNPON_PRICE
				];
				$SUMTOTAL += $Fetch["ORIGIN_PRICE"];
				$SUMTOTAL_PUNPON += $PUNPON_PRICE;
			$n++;
			}
		}
		else if($ChooseData=="ALL"){
			$Query = mysqli_query($DB,
				"SELECT customer.STNA,customer.NAME,customer.SURNAME,customer.MASCODE AS ORIGIN_MASCODE,customer.GENCODE AS ORIGIN_GENCODE,customer.AUMNO
				FROM customer				
				ORDER BY customer.MASCODE ASC
				");
			$DATA = array();
			$SUMTOTAL = 0;
			$SUMTOTAL_PUNPON=0;
			$n=0;
			while($Fetch=mysqli_fetch_assoc($Query)){
				$ORIGIN_GENCODE = $Fetch["ORIGIN_GENCODE"];
				$Query2 = mysqli_query($DB,
					"SELECT SUM(PRICE) AS SUMPRICE
					FROM orders
					WHERE DATE(CURDATE) BETWEEN DATE('{$DateStart}') AND DATE('{$DateEnd}')
					AND customer_CODE='{$ORIGIN_GENCODE}'
					GROUP BY customer_CODE
					");
				$Fetch2=@mysqli_fetch_assoc($Query2);
				$SUMPRICE = isset($Fetch2["SUMPRICE"]) ? $Fetch2["SUMPRICE"] : 0;
				$DATA[]=$Fetch;
				$PUNPON_PRICE = ($PunPon/100)*$SUMPRICE;
				$DATA[$n]+=[
					"GENCODE" => "<code>".$Fetch["ORIGIN_GENCODE"]."</code>",
					"CUS_DATA" => $Fetch["STNA"].$Fetch["NAME"].' '.$Fetch["SURNAME"],
					"PRICE" => '<code>'.number_format($SUMPRICE,2).'</code>',
					'PUNPON_PRICE' => $PUNPON_PRICE
				];
				$SUMTOTAL += $SUMPRICE;
				$SUMTOTAL_PUNPON += $PUNPON_PRICE;
			$n++;
			}
			
			
		}
		$arr["ERROR"] = false;
		$arr["MSG"] = "Get Data success";
		$arr["TYPE"] = "success";
		$arr["DATA"] = $DATA;
		$arr["SUMTOTAL"] = '<code>'.number_format($SUMTOTAL,2).'</code>';
		$arr["SUMTOTAL_PUNPON"] = '<code>'.number_format($SUMTOTAL_PUNPON,2).'</code>';
	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "ข้อมูลไม่ครบถ้วน !";
		$arr["TYPE"] = "warning";
	}
	echo json_encode($arr);
}
else{
	$arr["ERROR"] = true;
	$arr["MSG"] = "Cannot Find to database!";
	$arr["TYPE"] = "error";
}
?>
