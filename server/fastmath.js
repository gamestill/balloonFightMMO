var INT_BITS = 32;
var INT_MAX = 0x7fffffff;
var INT_MIN = -1 << (INT_BITS - 1);
var ABS = Math.abs;
var mPI = Math.PI;
var mPI4 = Math.PI / 4;
var mPI2 = Math.PI / 2;
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return (root.FMath = factory());
        });
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.FMath = factory();
    }
}(this, function() {
    var PI2 = Math.PI * 2;
    FMath.DEFAULT_PARAMS = {
        resolution: 360,
        minAtan: -40,
        maxAtan: 40
    };

    /**
     * FMath constructor
     * @param {Object} params - passed to the constructor
     * @param {number} [params.resolution] - # of cached values for any function. Is overriden by optional specific values
     * @param {number} [params.nbSin] - # of cached values for FMath#sin (defaults to the resolution)
     * @param {number} [params.nbCos] - # of cached values for FMath#cos (defaults to the resolution)
     * @param {number} [params.nbAtan] - # of caches values for FMath#atan (defaults to the resolution)
     * @param {number} [params.minAtan] - Minimal value for the caching of atan (default: -20) - If asking a lower value, will return the lowest known
     * @param {number} [params.maxAtan] - Maximal value for the caching of atan (default: 20) - If asking ahigher value, will return the highest known
     */
    function FMath(params) {
        this.params = FMath._assign(null, FMath.DEFAULT_PARAMS, params);
        FMath._setDefaultValues(this.params);

        this.cosTable = new Float32Array(this.params.nbCos);
        this.cosFactor = this.params.nbCos / PI2;
        FMath._fillCache(this.cosTable, this.cosFactor, Math.cos);

        this.sinTable = new Float32Array(this.params.nbSin);
        this.sinFactor = this.params.nbSin / PI2;
        FMath._fillCache(this.sinTable, this.sinFactor, Math.sin);

        this.atanTable = new Float32Array(this.params.nbAtan);
        this.atanFactor = this.params.nbAtan / (this.params.maxAtan - this.params.minAtan)
        FMath._fillAtanCache(this.atanTable, this.atanFactor, this.params.minAtan);
    };
    FMath.prototype.guid = function() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + s4()  + s4();
      }
    FMath.prototype.getBitAt = function(r,pos){
        return ((r >> pos) & 1);
    }
    FMath.prototype.setBit = function(r,bit){
     var p  = r | (1 << bit);
        return p;
    };
    FMath.prototype.clearBit = function(r,bit){
       var p = r & ~(1 << bit);
        return p;
    }
    FMath.prototype.convertByteTo8BitBinary = function (fl) {
        var ffl = fl.toString(2);
        while (ffl.length < 8) {
            ffl = "0" + ffl;
        }
        return ffl;
    }
   FMath.prototype.arraysIdentical = function (a, b) {
        var i = a.length;
        if (i != b.length) return false;
        while (i--) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };
    FMath.prototype.sort =function (obj) {
        var f = Object.keys(obj);
        if (+f.length === 1) {
            return [f[0]];
        } else if (f.length <= 0) {
            return [];
        }
        return Object.keys(obj).sort(function (a, b) {
            var q = obj[b][0] - obj[a][0];
            if (q !== 0) {
                return q;
            }
        
            return  obj[a][1] - obj[b][1];
        });
    }
    FMath.prototype.replaceUni = function(str){
        str = str.replace(/[\u00A0\u1680​\u180e\u2000-\u2009\u200a​\u200b​\u202f\u205f​\u3000]/g,'');
        return str;
    }
    FMath.prototype.isort =  function (arr,indexArr,col) {
        var curEntryBySort = 0, j;
        var p = 0;
        var curRow = 0;
        for (var i=1;i<arr.length;i++){
            curEntryBySort=arr[i][col];
            curRow=arr[i];
            j=i-1;
            while((j>=0)&&(arr[j][col]>curEntryBySort)){
                arr[j+1]=arr[j];
                indexArr[j+1] = indexArr[j];
                j--;
            }   
            indexArr[j+1] = curRow[0];
            arr[j+1] = curRow;
        }
        return [arr,indexArr];
      }

      FMath.prototype.firstPackSuffix =  function () {
        var min = 1000;
        var no = min + Math.floor(Math.random()*1000) + Math.floor(Math.random()*1000) + Math.floor(Math.random()*1000);
        return no;
    }

    FMath.prototype.cos = function(angle) {
        angle %= PI2;
        if (angle < 0) angle += PI2;
        return this.cosTable[(angle * this.cosFactor) | 0];
    };
    FMath.prototype.getRandom = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    FMath.prototype.sin = function(angle) {
        angle %= PI2;
        if (angle < 0) angle += PI2;
        return this.sinTable[(angle * this.sinFactor) | 0];
    };
    FMath.prototype.prob = function(a,b){
        var rand = Math.random()*b;
        if(rand<=(a+1)){
            return true;
        }
        return false;
    };
    FMath.prototype.baseClock = 0;
    FMath.prototype.delClock = function(){
        var end = process.hrtime(this.baseClock);
        return Math.round((end[0] * 1000) + (end[1] / 1000000));
    }
    FMath.prototype.clockMilli = function(start) {
        if (!start) return process.hrtime();
        var end = process.hrtime(start);
        return Math.round((end[0] * 1000) + (end[1] / 1000000));
    }
    
    FMath.prototype.atan = function(tan) {
        var index = ((tan - this.params.minAtan) * this.atanFactor) | 0;
        if (index < 0) {
            return -Math.PI / 2;
        } else if (index >= this.params.nbAtan) {
            return Math.PI / 2;
        }
        return this.atanTable[index];
    };
    FMath.prototype.ninjaAtan2 = function(y, x) {
        var r = 0.0,angle = 0.0,abs_y = ABS(y) + 1e-10;
        if (x < 0) {
            r = (x + abs_y) / (abs_y - x);
            angle = 3 * mPI4;
        } else {
            r = (x - abs_y) / (x + abs_y);
            angle = mPI4;
        }
        angle += (0.1963 * r * r - 0.9817) * r;
        if (y < 0) {
            return -angle;
        }
        return angle;
    };
    FMath._setDefaultValues = function(params) {
        var functionNames = ["nbSin", "nbCos", "nbAtan"];
        for (var i = functionNames.length - 1; i >= 0; i--) {
            var key = functionNames[i];
            params[key] = params[key] || params.resolution;
        }
    };



    FMath._fillAtanCache = function(array, factor, min) {
        for (var i = 0; i < array.length; i++) {
            var tan = min + i / factor;
            array[i] = Math.atan(tan);
        }
    };

    FMath._fillCache = function(array, factor, mathFunction) {
        var length = array.length;
        for (var i = 0; i < length; i++) {
            array[i] = mathFunction(i / factor);
        }
    };

    FMath._assign = function(dst, src1, src2, etc) {
        return [].reduce.call(arguments, function(dst, src) {
            src = src || {};
            for (var k in src) {
                if (src.hasOwnProperty(k)) {
                    dst[k] = src[k];
                }
            }
            return dst;
        }, dst || {});
    };

    return FMath;
}));