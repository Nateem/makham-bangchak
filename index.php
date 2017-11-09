<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>กรุณาปลดบล็อก POPUP</title>
<script>
function popupwindow(url, title, w, h) {
  var left = (screen.width/2)-(w/2);
  var top = (screen.height/2)-(h/1.5);
 var win = window.open(url, title, 'toolbar=no, location=0, directories=0, status=0, menubar=0, scrollbars=0, resizable=0, copyhistory=0, width='+w+', height='+h+', top='+top+', left='+left);
 win.focus();
  return  win;
} 
popupwindow('index.html','index','1350','770');
window.close();
</script>
</head>

<body>

</body>
</html>
