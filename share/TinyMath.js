

var TinyMath = {
    getRIntInc: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    getRandom:function (min, max) {
        return ff(rand() * (max - min)) + min;
    },
   getRandomIntBetween : function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    },
    componentToHex: function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }, 
    round : function(num) {
        return ((0.5 + num) | 0);
    },
    hex_rgb : function(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },

    rgb_hex: function(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);

    },

    rgb2hex : function(rgb) {
        if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

        rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }
        return "0x" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    },
    ABS : function(v) {
        var mask = v >> (INT_BITS - 1);
        return (v ^ mask) - mask;
    },
   Min : function(x, y) {
        return y ^ ((x ^ y) & -(x < y));
    },

    //Computes maximum of integers x and y
   Max :function(x, y) {
        return x ^ ((x ^ y) & -(x < y));
    },
}


module.exports = TinyMath;