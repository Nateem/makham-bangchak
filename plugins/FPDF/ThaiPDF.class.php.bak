<?php

/**********************************************************
ThaiPDF
โดย: บัญชา  ปะสีละเตสัง <banchar_pa@yahoo.com>

Credits:
- Olivier Plathey
- Clement Lavoillotte
- Rick van Buuren
**********************************************************/

require('fpdf.php');

class ThaiPDF extends FPDF {

//---------------------------------  Features for ThaiPDF --------------------------------

function AddThaiFont($font="") {
	$thaifonts = array(
						"angsana"=>"angsa",
						"browallia"=>"browa",
						"cordia"=>"cordia",
						"dillenia"=>"dill",
						"eucrosia"=>"eucro",
						"freesia"=>"free",
						"iris"=>"iris",
						"jasmine"=>"jasm",
						"kodchiang"=>"kodc",
						"lily"=>"lily",
						"tahoma"=>"tahoma"		
					);
					
	if(!empty($font)) {
		if(array_key_exists($font, $thaifonts)) {
			$thaifonts = array("$font"=>"{$thaifonts[$font]}");
		}
		else {
			echo "<div style=\"width:350px;background-color:#ffffcc;color:green;border:solid 1px red;padding:5px;\">";
			echo "<font size=\"+1\" color=red>การกำหนดฟอนต์ผิดพลาด</font><br />ชื่อฟอนต์ไทยที่สามารถกำหนดได้:<br />";
			$keys = array_keys($thaifonts);
			for($i=0; $i<count($keys);$i++) {
				echo "- {$keys[$i]} <br />";
			}
			echo "<br />[หรือไม่ระบุชนิดฟอนต์ ถ้าต้องการเพิ่มทั้งหมด]";
			echo "</div>";
			exit;
		}
	}
	
	$fontnames = array_keys($thaifonts);
	$fontvalues = array_values($thaifonts);
	for($j=0; $j<count($fontnames); $j++) {
		$n  = $fontvalues[$j] . ".php";
		$b = $fontvalues[$j] . "b.php";
		$i = $fontvalues[$j] . "i.php";
		$this->AddFont($fontnames[$j], '', $n);
		$this->AddFont($fontnames[$j], 'B', $b);
		if($fontnames[$j]!="tahoma") {						// Tahoma ไม่มีตัวเอียง
			$this->AddFont($fontnames[$j], 'I', $i);			
		}
	}		
}

function AddPageNo() {
	$this->AliasNbPages();
}

function WriteLn($h, $text) {
	$this->Write($h, "$text\n");
}

function Header() { }

//Page No. settings
private $pn_align = "center";		//การจัดวางหมายเลขหน้า
private $pn_prefix = "Page";	  	//คำที่อยู่ก่อนหมายเลขหน้า เช่น "หน้า", "Page"
private $pn_sep = "/";				//ตัวแบ่งระหว่างหมายเลขหน้าปัจจุบันกับจำนวนหน้าทั้งหมด เช่น 1/5
private $pn_ffamily = "arial";
private $pn_fstyle = "I";
private $pn_fsize = "10";
private $pn_show = false;

function SetPageNo($align, $prefix_str, $separator,$font_family, $font_style, $font_size) {
	$this->pn_prefix = $prefix_str;
	$this->pn_sep = $separator;
	$this->pn_align = strtolower($align);
	$this->pn_ffamily = strtolower($font_family);
	$this->pn_fstyle = strtoupper($font_style);
	$this->pn_fsize = $font_size;
	$this->pn_show = true;
}

function Footer() {
	if(!$this->pn_show) {		//ถ้้าไม่ได้เซตค่าให้เมธอด setPageNo() ไม่ต้องแสดงหมายเลขหน้า
		return;					
	}
	$this->SetAutoPageBreak(true, 20);
	$this->SetFont($this->pn_ffamily, $this->pn_fstyle, $this->pn_fsize);
	switch($this->pn_align) {
		case 'left':
			$this->SetY(-15);
			$this->Cell(0,10, $this->pn_prefix . $this->PageNo() . $this->pn_sep . '{nb}', 0, 0, 'L');
			break;
		case 'right':
			$this->SetY(-15);
			$this->Cell(0,10, $this->pn_prefix . $this->PageNo() . $this->pn_sep . '{nb}', 0, 0, 'R');
			break;
		case 'center': 
		default:
			$this->SetY(-15);
			$this->Cell(0,10, $this->pn_prefix . $this->PageNo() . $this->pn_sep . '{nb}', 0, 0, 'C');
			break;
	}
}

function LineHr($start_x, $start_y, $length) {
	$this->Line($start_x, $start_y, ($start_x + $length), $start_y);
}

function LineVr($start_x, $start_y, $length) {
	$this->Line($start_x, $start_y, $start_x, ($start_y + $length));
}

//---------------------------------  End of ThaiPDF Features --------------------------------


//variables of html parser
private $B;
private $I;
private $U;
private $HREF;
private $fontList;
private $issetfont;
private $issetcolor;

//function hex2dec
//returns an associative array (keys: R,G,B) from
//a hex html code (e.g. #3FE5AA)
private function hex2dec($couleur = "#000000") {
    $R = substr($couleur, 1, 2);
    $rouge = hexdec($R);
    $V = substr($couleur, 3, 2);
    $vert = hexdec($V);
    $B = substr($couleur, 5, 2);
    $bleu = hexdec($B);
    $tbl_couleur = array();
    $tbl_couleur['R']=$rouge;
    $tbl_couleur['G']=$vert;
    $tbl_couleur['B']=$bleu;
    return $tbl_couleur;
}

//conversion pixel -> millimeter in 72 dpi
private function px2mm($px) {
    return $px*25.4/72;
}

private function txtentities($html) {
    $trans = get_html_translation_table(HTML_ENTITIES);
    $trans = array_flip($trans);
    return strtr($html, $trans);
}

function PDF($orientation='P', $unit='mm', $format='A4') {
    //Call parent constructor
    $this->FPDF($orientation,$unit,$format);
    //Initialization
    $this->B=0;
    $this->I=0;
    $this->U=0;
    $this->HREF='';

    $this->tableborder=0;
    $this->tdbegin=false;
    $this->tdwidth=0;
    $this->tdheight=0;
    $this->tdalign="L";
    $this->tdbgcolor=false;

    $this->oldx=0;
    $this->oldy=0;

    $this->fontlist=array("arial","times","courier","helvetica","symbol");
    $this->issetfont=false;
    $this->issetcolor=false;
}

//////////////////////////////////////
//html parser

function writeHTML($html) {
	$pat = ">[[:space:]]{1,}<";							// <-- แก้ไข Bug
	$html = eregi_replace($pat, "><", $html);		// <-- แก้ไข Bug
	
    $html=strip_tags($html,"<b><u><i><a><img><p><br><strong><em><font><tr><blockquote><hr><td><tr><table><sup>"); //remove all unsupported tags
    $html=str_replace("\n",'',$html); //replace carriage returns by spaces
    $html=str_replace("\t",'',$html); //replace carriage returns by spaces
    $a=preg_split('/<(.*)>/U',$html,-1,PREG_SPLIT_DELIM_CAPTURE); //explodes the string
    foreach($a as $i=>$e) {
        if($i%2==0) {
            //Text
            if($this->HREF) {
                $this->PutLink($this->HREF,$e);
			}
            else if($this->tdbegin) {
                if(trim($e)!='' && $e!="&nbsp;") {
                    $this->Cell($this->tdwidth,$this->tdheight,$e,$this->tableborder,'',$this->tdalign,$this->tdbgcolor);
                }
                elseif($e=="&nbsp;") {
                    $this->Cell($this->tdwidth,$this->tdheight,'',$this->tableborder,'',$this->tdalign,$this->tdbgcolor);
                }
            }
            else {
                $this->Write(5,stripslashes(ThaiPDF::txtentities($e)));
			}
        }
        else {
            //Tag
            if($e[0]=='/') {
                $this->CloseTag(strtoupper(substr($e,1)));
			}
            else {
                //Extract attributes
                $a2=explode(' ',$e);
                $tag=strtoupper(array_shift($a2));
                $attr=array();
                foreach($a2 as $v) {
                    if(preg_match('/([^=]*)=["\']?([^"\']*)/',$v,$a3)) {
                        $attr[strtoupper($a3[1])]=$a3[2];
					}
                }
                $this->OpenTag($tag,$attr);
            }
        }
    }
}

function OpenTag($tag, $attr) {
    //Opening tag
    switch($tag) {

        case 'SUP':
            if(!empty($attr['SUP'])) {    
                //Set current font to 6pt     
                $this->SetFont('','',6);
                //Start 125cm plus width of cell to the right of left margin         
                //Superscript "1" 
                $this->Cell(2,2,$attr['SUP'],0,0,'L');
            }
            break;

        case 'TABLE': // TABLE-BEGIN
            if(!empty($attr['BORDER'])) {
				$this->tableborder=$attr['BORDER'];
			}
            else {
				$this->tableborder=0;
			}
            break;
			
        case 'TR': //TR-BEGIN
            break;
			
        case 'TD': // TD-BEGIN
            if(!empty($attr['WIDTH'])) {
				$this->tdwidth=($attr['WIDTH']/4);
			}
            else {
				$this->tdwidth=50; // Set to your own width if you need bigger fixed cells (old value  is 40)
			}
            if(!empty($attr['HEIGHT'])) {
				$this->tdheight=($attr['HEIGHT']/6);
			}
            else {
				$this->tdheight=8; // Set to your own height if you need bigger fixed cells (old value is 6)
			}
            if(!empty($attr['ALIGN'])) {
                $align=strtoupper($attr['ALIGN']);   	// <-- แก้ไข Bug
                if($align=='LEFT')  {
					$this->tdalign='L';
				}
                if($align=='CENTER')  {
					$this->tdalign='C';
				}
                if($align=='RIGHT')  {
					$this->tdalign='R';
				}
            }
            else {
				$this->tdalign='L'; // Set to your own
			}
            if(!empty($attr['BGCOLOR'])) {
 				$coul=ThaiPDF::hex2dec($attr['BGCOLOR']);
                $this->SetFillColor($coul['R'],$coul['G'],$coul['B']);
  				$this->tdbgcolor=true;
           }
           $this->tdbegin=true;
           break;

        case 'HR':
            if(!empty($attr['WIDTH'])) {
                $Width = $attr['WIDTH'];
			}
            else {
                $Width = $this->w - $this->lMargin-$this->rMargin;
			}
			
            $x = $this->GetX();
            $y = $this->GetY();
            $this->SetLineWidth(0.2);
            $this->Line($x,$y,$x+$Width,$y);
            $this->SetLineWidth(0.2);
            $this->Ln(1);
            break;
        case 'STRONG':
            $this->SetStyle('B',true);
            break;
        case 'EM':
            $this->SetStyle('I',true);
            break;
        case 'B':
        case 'I':
        case 'U':
            $this->SetStyle($tag,true);
            break;
        case 'A':
            $this->HREF=$attr['HREF'];
            break;
        case 'IMG':
            if(isset($attr['SRC'])) {															// <-- แก้ไข Bug
				//if((isset($attr['WIDTH']) || isset($attr['HEIGHT']))) {
               	 	if(!isset($attr['WIDTH'])) {
                    	$attr['WIDTH'] = 0;
					}
                	if(!isset($attr['HEIGHT'])) {
                    	$attr['HEIGHT'] = 0;
					}
				//}
                $this->Image($attr['SRC'], $this->GetX(), $this->GetY(),ThaiPDF::px2mm($attr['WIDTH']),ThaiPDF::px2mm($attr['HEIGHT']));
            }
            break;
        case 'BLOCKQUOTE':
        case 'BR':
            $this->Ln(5);
            break;
        case 'P':
            $this->Ln(10);
            break;
        case 'FONT':
            if(isset($attr['COLOR']) && $attr['COLOR']!='') {
                $coul=ThaiPDF::hex2dec($attr['COLOR']);
                $this->SetTextColor($coul['R'],$coul['G'],$coul['B']);
                $this->issetcolor=true;
            }
            if(isset($attr['FACE']) && in_array(strtolower($attr['FACE']), $this->fontlist)) {
                $this->SetFont(strtolower($attr['FACE']));
                $this->issetfont=true;
            }
            if(isset($attr['FACE']) && in_array(strtolower($attr['FACE']), $this->fontlist) && isset($attr['SIZE']) && $attr['SIZE']!='') {
                $this->SetFont(strtolower($attr['FACE']),'',$attr['SIZE']);
                $this->issetfont=true;
            }
            break;
    }
}

function CloseTag($tag) {
    //Closing tag
    if($tag=='SUP') {
	
    }

    if($tag=='TD') { // TD-END
        $this->tdbegin=false;
        $this->tdwidth=0;
        $this->tdheight=0;
        $this->tdalign="L";
        $this->tdbgcolor=false;
    }
    if($tag=='TR') { // TR-END
        $this->Ln();
    }
    if($tag=='TABLE') { // TABLE-END
        //$this->Ln();
        $this->tableborder=0;
    }

    if($tag=='STRONG') {
        $tag='B';
	}
    if($tag=='EM') {
        $tag='I';
	}
    if($tag=='B' || $tag=='I' || $tag=='U') {
        $this->SetStyle($tag,false);
	}
    if($tag=='A') {
        $this->HREF='';
	}
    if($tag=='FONT') {
        if($this->issetcolor==true) {
            $this->SetTextColor(0);
        }
        if($this->issetfont) {
            $this->SetFont('arial');
            $this->issetfont=false;
        }
    }
}

function SetStyle($tag, $enable) {
    //Modify style and select corresponding font
    $this->$tag+=($enable ? 1 : -1);
    $style='';
    foreach(array('B','I','U') as $s) {
        if($this->$s>0) {
            $style.=$s;
		}
    }
    $this->SetFont('',$style);
}

function PutLink($URL, $txt) {
    //Put a hyperlink
    $this->SetTextColor(0,0,255);
    $this->SetStyle('U',true);
    $this->Write(5,$txt,$URL);
    $this->SetStyle('U',false);
    $this->SetTextColor(0);
}

}//end class

?>