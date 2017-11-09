angular.module("app")
.filter('thaidate', function () {
        return function (input, format) {

            var month_name, dateReturn;
            var year = input.substr(0, 4);
            var month = input.substr(5, 2);
            var day = input.substr(8, 2);
            var time_ = input.substr(11, 8);

            switch (Number(month)) {
                case 1:
                    month_name = "มกราคม";
                    break;
                case 2:
                    month_name = "กุมภาพันธ์";
                    break;
                case 3:
                    month_name = "มีนาคม";
                    break;
                case 4:
                    month_name = "เมษายน";
                    break;
                case 5:
                    month_name = "พฤษภาคม";
                    break;
                case 6:
                    month_name = "มิถุนายน";
                    break;
                case 7:
                    month_name = "กรกฎาคม";
                    break;
                case 8:
                    month_name = "สิงหาคม";
                    break;
                case 9:
                    month_name = "กันยายน";
                    break;
                case 10:
                    month_name = "ตุลาคม";
                    break;
                case 11:
                    month_name = "พฤศจิกายน";
                    break;
                case 12:
                    month_name = "ธันวาคม";
                    break;
            }
            //var budha_year = Number(year) + 543;
            var budha_year = Number(year);
            switch (format) {
                case "getMonth":
                    dateReturn = month_name + " " + budha_year;
                    break;
                case "getYear":
                    dateReturn = budha_year;
                    break;
                case "short":
                    dateReturn = day + "/" + month + "/" + budha_year;
                    break;
                default:
                    dateReturn = Number(day) + " " + month_name + " " + budha_year;
                    break;
            }
            if (time_) {
                return dateReturn +" เวลา "+ time_ +" น.";
            }
            else {
                return dateReturn;
            }


        }
    });