var intervalDays = 20;
export default {
    //是否过期
    isOutTime: function (accessTime) {
        if (accessTime === "永久") {
            return true;
        }
        if (accessTime) {
            var act = new Date(accessTime);
            var curTime = new Date();
            var interval = (curTime - act) / (24 * 60 * 60 * 1000);
            return interval < intervalDays;
        } else {
            return false;
        }
    }
}
