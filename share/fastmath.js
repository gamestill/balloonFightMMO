
                                                                                    
// @@@@@@@@   @@@@@@    @@@@@@   @@@@@@@     @@@@@@@@@@    @@@@@@   @@@@@@@  @@@  @@@  
// @@@@@@@@  @@@@@@@@  @@@@@@@   @@@@@@@     @@@@@@@@@@@  @@@@@@@@  @@@@@@@  @@@  @@@  
// @@!       @@!  @@@  !@@         @@!       @@! @@! @@!  @@!  @@@    @@!    @@!  @@@  
// !@!       !@!  @!@  !@!         !@!       !@! !@! !@!  !@!  @!@    !@!    !@!  @!@  
// @!!!:!    @!@!@!@!  !!@@!!      @!!       @!! !!@ @!@  @!@!@!@!    @!!    @!@!@!@!  
// !!!!!:    !!!@!!!!   !!@!!!     !!!       !@!   ! !@!  !!!@!!!!    !!!    !!!@!!!!  
// !!:       !!:  !!!       !:!    !!:       !!:     !!:  !!:  !!!    !!:    !!:  !!!  
// :!:       :!:  !:!      !:!     :!:       :!:     :!:  :!:  !:!    :!:    :!:  !:!  
//  ::       ::   :::  :::: ::      ::       :::     ::   ::   :::     ::    ::   :::  
//  :         :   : :  :: : :       :         :      :     :   : :     :      :   : :  


var aabs = Math.abs;
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
    FMath.prototype.unique = function(a){
        var seen = {};
        var out = [];
        var len = a.length;
        var j = 0;
        for(var i = 0; i < len; i++) {
             var item = a[i];
             if(seen[item] !== 1) {
                   seen[item] = 1;
                   out[j++] = item;
             }
        }
        return out;
    }
   FMath.prototype.brightness =function (hex, lum) {
        // Validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, "");
        if (hex.length < 6) {
          hex = hex.replace(/(.)/g, '$1$1');
        }
        lum = lum || 0;
        // Convert to decimal and change luminosity
        var rgb = "0x",
          c;
        for (var i = 0; i < 3; ++i) {
          c = parseInt(hex.substr(i * 2, 2), 16);
          c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
          rgb += ("00" + c).substr(c.length);
        }
        return rgb;
      }
      FMath.prototype.ninjaAtan2 = function(y, x) {
        var r = 0.0,angle = 0.0,abs_y = Math.abs(y) + 1e-10;
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

    FMath.prototype.cos = function(angle) {
        angle %= PI2;
        if (angle < 0) angle += PI2;
        return this.cosTable[(angle * this.cosFactor) | 0];
    };
  
  
    FMath.prototype.sin = function(angle) {
        angle %= PI2;
        if (angle < 0) angle += PI2;
        return this.sinTable[(angle * this.sinFactor) | 0];
    };
    FMath.prototype.lerp = function(p, n, t){
        t = (Math.max(0, Math.min(1, t)));
        return (p * (1 - t) + n * t);
    };
    FMath.prototype.baseSTime = 0;
    FMath.prototype.vlerp = function(p, fp, t){
        return [this.lerp(p.px, fp.px, t), this.lerp(p.py, fp.py, t)];
    };
    FMath.prototype.getRandom = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    FMath.prototype.atan = function(tan) {
        var index = ((tan - this.params.minAtan) * this.atanFactor) | 0;
        if (index < 0) {
            return -mPI / 2;
        } else if (index >= this.params.nbAtan) {
            return mPI / 2;
        }
        return this.atanTable[index];
    };

    FMath._setDefaultValues = function(params) {
        var functionNames = ["nbSin", "nbCos", "nbAtan"],
            key;
        for (var i = functionNames.length - 1; i >= 0; i--) {
            key = functionNames[i];
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