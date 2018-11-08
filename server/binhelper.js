var BHelper = {
    ArrayBufferToString: function(buffer) {
        return BinaryToString(String.fromCharCode.apply(null, Array.prototype.slice.apply(new Uint8Array(buffer))));
    },

    StringToArrayBuffer: function(string) {
        return StringToUint8Array(string).buffer;
    },
    StringToBinary: function(string) {
        var chars, code, i, isUCS2, len, _i;

        len = string.length;
        chars = [];
        isUCS2 = false;
        for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
            code = String.prototype.charCodeAt.call(string, i);
            if (code > 255) {
                isUCS2 = true;
                chars = null;
                break;
            } else {
                chars.push(code);
            }
        }
        if (isUCS2 === true) {
            return unescape(encodeURIComponent(string));
        } else {
            return String.fromCharCode.apply(null, Array.prototype.slice.apply(chars));
        }
    },
    BinaryToString: function(binary) {
        var error;

        try {
            return decodeURIComponent(escape(binary));
        } catch (_error) {
            error = _error;
            if (error instanceof URIError) {
                return binary;
            } else {
                throw error;
            }
        }
    },

    StringToUint8Array: function(string) {
        var binary, binLen, buffer, chars, i, _i;
        binary = StringToBinary(string);
        binLen = binary.length;
        buffer = new ArrayBuffer(binLen);
        chars = new Uint8Array(buffer);
        for (i = _i = 0; 0 <= binLen ? _i < binLen : _i > binLen; i = 0 <= binLen ? ++_i : --_i) {
            chars[i] = String.prototype.charCodeAt.call(binary, i);
        }
        return chars;
    }


};

module.exports = BHelper;