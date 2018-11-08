var CommonFn = {
    byte2String : function(n) {
        if (n < 0 || n > 65555 || n % 1 !== 0) {
           console.log(n + " does not fit in 2 byte");
        }
        return ("0000000000000000" + n.toString(2)).substr(-16)
    },
    isMobileCheck :function() {
        if (/Mobi/.test(navigator.userAgent))
            return true;
    },
    localStorageCheck : function() {
        var test = 'game';
        if (window !== null) {
            try {
                window.localStorage.setItem(test, test);
                window.localStorage.removeItem(test);
                return true;
            } catch (e) {
                return false;
            }
        } else
            return false;
        return false;
    }
};


module.exports = CommonFn;