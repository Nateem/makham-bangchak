<?php 
require_once "./MAIN.php";
$Connect_Status = MAIN::CONNECT();
//error_reporting(0);
 $DB = $Connect_Status["DB"];

//$_POST = json_decode(file_get_contents('php://input'), true);

$TYPES = isset($_POST["TYPES"]) ? $_POST["TYPES"] : "";

$arr["ERROR"] = true;
if($TYPES=="SAVE_REGISTER_FORM"){
	$FORM_DATA = isset($_POST["FORM_DATA"]) ? $_POST["FORM_DATA"] : "";

	if($FORM_DATA["inpUsername"]!="" && strlen($FORM_DATA["inpUsername"]) >= 4 && $FORM_DATA["inpPassword"] != "" ){
		$ID_PGS = $FORM_DATA['idPGS'];
		$USERNAME = $FORM_DATA['inpUsername'];
		$PASSWORD = md5($FORM_DATA['inpPassword']);
		$PREFIX_ID = $FORM_DATA['prefixSelect'];
		$FNAME = $FORM_DATA['fname'];
		$LNAME = $FORM_DATA['lname'];
		$IDCARD13 = $FORM_DATA['id13'];
		$TEL = $FORM_DATA['TEL'];
		$PROVINCE_ID = $FORM_DATA['provinceSelect'];
		$AMPHUR_ID = $FORM_DATA['amphurSelect'];
		$DISTRICT_ID = $FORM_DATA['districtSelect'];
		$CAREER = $FORM_DATA['career1'];
		$CAREER2 = $FORM_DATA['career2'];
		$imgForProfile = $_FILES["imgForProfile"];
		$Query = mysqli_query($DB,
			"SELECT USERNAME 
			FROM customer_app
			WHERE USERNAME='{$USERNAME}'
			");
		$row = mysqli_num_rows($Query);
		if($row==0){

			if($imgForProfile){
		        $target_dir = "../img/profiles/";
		        $target_file = $target_dir . basename($imgForProfile["name"]);
		        $FileType = pathinfo($target_file,PATHINFO_EXTENSION);
		        $FileName = pathinfo($target_file,PATHINFO_FILENAME);
		        $FileNameAndType = pathinfo($target_file,PATHINFO_BASENAME);
		        if($FileType!='jpg'&&$FileType!='gif'&&$FileType!='png'&&$FileType!='JPG'&&$FileType!='GIF'&&$FileType!='PNG'&&$FileType!='jpeg'&&$FileType!='JPEG'){
		        	$arr["ERROR"] = true;
		        	$arr["type"] = "error";
		        	$arr["MSG"] = $FileType.":ไฟล์ที่ท่านเลือกไม่รองรับ(ไฟล์ที่รองรับ:jpeg,jpg,gif,png)";          
		        }
		        else{
		        	$filenamesShort = base64_encode($USERNAME).date("Ymd").date("His").'.'.$FileType;
		            $filenames = $target_dir.$filenamesShort;
		            if(move_uploaded_file($imgForProfile["tmp_name"],iconv('UTF-8','windows-874',$filenames))){			                
							
							mysqli_query($DB,
								"INSERT INTO customer_app(PIC,ID_PGS,USERNAME,PASSWORD,PREFIX_ID,FNAME,LNAME,IDCARD13,CAREER,CAREER2,DISTRICT_ID,AMPHUR_ID,PROVINCE_ID,TEL,CREATED)
								VALUES ('{$filenamesShort}','{$ID_PGS}','{$USERNAME}','{$PASSWORD}','{$PREFIX_ID}','{$FNAME}','{$LNAME}','{$IDCARD13}','{$CAREER}','{$CAREER2}','{$DISTRICT_ID}','{$AMPHUR_ID}','{$PROVINCE_ID}','{$TEL}',NOW())
								");

							$arr["ERROR"] = false;
							$arr["MSG"] = "อัพโหลดไฟล์&ลงทะเบียนสำเร็จ...";
							$arr["TYPE"] = "success";
							$arr["CLASS"] = "alert alert-success";

							
		            }
		            else{
		            	$arr["ERROR"] = true;
						$arr["MSG"] = "อัพโหลดไฟล์ไม่ผ่าน!";
						$arr["TYPE"] = "warning";
						$arr["CLASS"] = "alert alert-warning";
		            }
		        }       

		    }
		    else{
		    	mysqli_query($DB,
					"INSERT INTO customer_app(ID_PGS,USERNAME,PASSWORD,PREFIX_ID,FNAME,LNAME,IDCARD13,CAREER,CAREER2,DISTRICT_ID,AMPHUR_ID,PROVINCE_ID,TEL,CREATED)
					VALUES ('{$ID_PGS}','{$USERNAME}','{$PASSWORD}','{$PREFIX_ID}','{$FNAME}','{$LNAME}','{$IDCARD13}','{$CAREER}','{$CAREER2}','{$DISTRICT_ID}','{$AMPHUR_ID}','{$PROVINCE_ID}','{$TEL}',NOW())
					");

				$arr["ERROR"] = false;
				$arr["MSG"] = "ลงทะเบียนหสำเร็จ...";
				$arr["TYPE"] = "success";
				$arr["CLASS"] = "alert alert-success";
		    }

			
 		}
		else{
			$arr["ERROR"] = true;
			$arr["MSG"] = "Username นี้มีผู้ใช้แล้ว!";
			$arr["CLASS"] = "alert alert-danger"; 
		}
		
	}
	else{
		$arr["ERROR"] = true;
		$arr["MSG"] = "กรุณาทำตามเงื่อนไขให้ครบถ้วน";
		$arr["CLASS"] = "alert alert-warning"; 
	}

	echo json_encode($arr);
	
}
else{
	$arr["ERROR"] = true;
	$arr["MSG"] = "Cannot Show Database!";
	echo json_encode($arr);
}
 ?>