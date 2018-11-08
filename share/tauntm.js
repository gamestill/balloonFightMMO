var CONF = require('./gameConf.js');
var DEFAULT_STATUS = CONF.Taunt_DEF_STA;
var LZStr = require('./lz-string.js');

function checkTag_tight(base, tagLen, index) {
    var at = ('' + base).charAt(index + tagLen) === '@';
    var under = ('' + base).charAt(index - 1) === '_';
    if (at && under) {
        return true;
    }
    return false;
};

var Taunts = function () {
    var cl_taunts = LZStr.decompressFromBase64(window.store.get("tags")) || '';
    if (cl_taunts === '') {
        var dt = LZStr.compressToBase64("0*");
        window.store.set("tags", dt);
        window.store.set('tagcount',0);
    }

    this.clearTauntsLocal = function () {
        var cl_taunts = LZStr.decompressFromBase64(window.store.get("tags")) || '';
        if (cl_taunts !== '') {
            var dt = LZStr.compressToBase64("0*");
            window.store.set("tags", dt);
        }
    };
    this.addTagFromOnline = function (tag, baseTaunt) {
        newTaunts = baseTaunt + "_" + taunt + "@" + DEFAULT_STATUS;
        newTaunts = LZStr.compressToBase64(newTaunts);
        window.store.set("tags", newTaunts);
        cb(CONF.SUCCESS);
    };
    this.removeAllTags = function(){
        this.clearTauntsLocal();
    };
    
    this.addIfNotPresent_browser = function (tags) {
        if ($('.taunts-scroll').children().length > CONF.Taunt_Max) {
            cb(CONF.Taunt_CB_RES.nospace);
            return;
        }
        var baseTaunt = LZStr.decompressFromBase64(window.store.get("tags")) || '';
        if (baseTaunt !== '') {
            for (var i = 0; i < tags.length; i++) {
                var index = baseTaunt.indexOf(tags[i].name + "@");
                if (index < 0) {
                    baseTaunt = baseTaunt + "_" + tags[i].name + "@" + tags[i].status;
                }
            }
            baseTaunt = LZStr.compressToBase64(baseTaunt);
            window.store.set("tags", baseTaunt);
        }
    };
    this.getLocalTaunts = function () {
        var taunts = [],
            tauntCount = 0,
            tauntsStr = "",
            pertaunt = [],
            tuantVal = "",
            tpick = "";
        var lt = LZStr.decompressFromBase64(window.store.get("tags")) || '';
    
        if (lt === '') {
            var dt = LZStr.compressToBase64("0*");
            window.store.set("tags", dt);
            return taunts;
        }
        tauntCount = parseInt(lt.charAt(0));
        tauntsStr = (lt.split('*') || ["", ""])[1];
        if (tauntsStr.length <= 0) {
            return taunts;
        }
        pertaunt = tauntsStr.substr(1, tauntsStr.length - 1).split('_');
        tpick = "";
        for (var i = 0; i < pertaunt.length; i++) {
            tpick = pertaunt[i].split("@");
            tpick[0] = ('' + tpick[0]).replace(/#/g, " ");
            taunts.push({
                name: "" + tpick[0],
                status: "" + tpick[1]
            });
        }
//@_#*
        return taunts;
    };
    this.getLocalTaunts_server = function () {
        var taunts = {},
            tauntCount = 0,
            tauntsStr = "",
            pertaunt = [],
            tuantVal = "",
            tpick = "";
        var lt = LZStr.decompressFromBase64(window.store.get("tags")) || '';
        if (lt === '') {
            var dt = LZStr.compressToBase64("0*");
            window.store.set("tags", dt);
            return taunts;
        }
        tauntCount = parseInt(lt.charAt(0));
        tauntsStr = (lt.split('*') || ["", ""])[1];
        if (tauntsStr.length <= 0) {
            return taunts;
        }
        pertaunt = tauntsStr.substr(1, tauntsStr.length - 1).split('_');
        tpick = "";
        for (var i = 0; i < pertaunt.length; i++) {
            tpick = pertaunt[i].split("@");
            taunts['t' + (i + 1)] = ({
                tag: "" + tpick[0],
                status: "" + tpick[1]
            });
        }
        return taunts;
    };
    this.addMultiTauntSync = function (taunts) {
        if (taunts.length < 1) {
            return;
        }
        var newTaunts = "";
        var baseTaunt = LZStr.decompressFromBase64(window.store.get("tags")) || '';

        if (baseTaunt === '') {
            var dt = LZStr.compressToBase64("0*");
            window.store.set("tags", dt);
        }

        newTaunts = baseTaunt;
        var toAdd = "";
        for (var i = 0; i < taunts.length; i++) {
            if (newTaunts.indexOf("" + taunts[i].tag + "@") < 0)
                toAdd = toAdd + "_" + taunts[i].tag + "@" + taunts[i].status;
        }
        newTaunts += toAdd;
        newTaunts = LZStr.compressToBase64(newTaunts);
        window.store.set("tags", newTaunts);
    };
    this.updateCount = function (inc) {
        if (inc === '' || !inc) {
            console.log('cannot update count');
            return;
        }
        var count = +window.store.get('tagcount');

        if (count) {
            count = (parseInt(+count + inc));
            window.store.set('tagcount', count);
        } else {
            if (inc > 0) {
                window.store.set('tagcount', 1);
            } else {
                window.store.set('tagcount', 0);
            }
        }
    }
    this.addTag = function (taunt, cb) {
        taunt = taunt.trim();
        var newTaunts = "";
        taunt = ('' + taunt).replace(/ /g, "#");
        var baseTaunt = LZStr.decompressFromBase64(window.store.get("tags")) || '';
        if (baseTaunt === '') {
            var dt = LZStr.compressToBase64("0*");
            window.store.set("tags", dt);
        }
        newTaunts = baseTaunt + "_" + taunt + "@" + DEFAULT_STATUS;
        newTaunts = LZStr.compressToBase64(newTaunts);
        window.store.set("tags", newTaunts);
        this.updateCount(1);
        cb();

    };


    this.toggleTaunt = function (taunt, state, cb) {
        var newTaunts = "",
            delLeng = 0,
            i = 0,
            findexes = [],
            count = 0,
            currIndex = -1;
        var baseTaunt = LZStr.decompressFromBase64(window.store.get("tags")) || '';
        taunt = ('' + taunt.trim()).replace(/ /g, "#");
        if (taunt.length < 0 && taunt.length > 41) {
            return;
        }
        if (baseTaunt === '') {
            return;
        }
        findexes = ('').getIndicesOf(taunt + '@', '' + baseTaunt, false);
        if (findexes.length <= 0) {
            return;
        }
        for (i = 0; i < findexes.length; i++) {
            currIndex = findexes[i];
            if (checkTag_tight(baseTaunt, taunt.length, currIndex)) {
                count = currIndex + taunt.length + 1;
                if (state === "on") {
                    delLeng = state.length + 1;
                } else if (state === "off") {
                    delLeng = state.length - 1;
                }
                baseTaunt = baseTaunt.substr(0, count) + state + baseTaunt.substr(count + delLeng);
             
                newTaunts = LZStr.compressToBase64(baseTaunt);
                window.store.set("tags", newTaunts);
                return;
            }
        }
    };

    this.countTags = function () {
        var tauntsStr = "",
            pertaunt = [];
        var lt = LZStr.decompressFromBase64(window.store.get("tags")) || '';
        tauntsStr = (lt.split('*') || ["", ""])[1];
        pertaunt = tauntsStr.substr(1, tauntsStr.length - 1).split('_');
        if (tauntsStr.length <= 1) {
            pertaunt = [];
        }
        var tc = window.store.get('tagcount');
        if (tc !== pertaunt.length) {
            window.store.set('tagcount', pertaunt.length);
        }
        return pertaunt.length;
    };
    this.removeTag = function (taunt, state) {
        var baseTaunt = "",
            delLeng = 0,
            indexes = [],
            currIndex = -1,
            start = -1,
            start2 = -1,
            i = 0;
        taunt = ('' + taunt.trim()).replace(/ /g, "#");
        state = state.trim();
        if (taunt.length < 0 && taunt.length > 41) {
            return false;
        }
        baseTaunt = LZStr.decompressFromBase64(window.store.get("tags")) || '';
        if (baseTaunt === '') {
            return false;
        }
        indexes = ('').getIndicesOf(taunt + '@', '' + baseTaunt, false);
        if (indexes.length <= 0) {
            return false;
        }
        if (state !== 'on' && state !== 'off') {
            return false;
        }
        delLeng = (state === 'on' ? 3 : 4);
        for (i = 0; i < indexes.length; i++) {
            currIndex = indexes[i];
            if (checkTag_tight(baseTaunt, taunt.length, currIndex)) {
                start2 = currIndex + taunt.length + delLeng;
                start2 = Math.min(baseTaunt.length, start2);
                baseTaunt = baseTaunt.substr(0, currIndex - 1) + baseTaunt.substr(start2);
                baseTaunt = LZStr.compressToBase64(baseTaunt);
                window.store.set("tags", baseTaunt);
                return true;
            }
        }
        return false;
    };
};

module.exports = Taunts;