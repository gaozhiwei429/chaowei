export function padding(num, length) {    //填补空缺不足位
    for(var len = (num + "").length; len < length; len = num.length) {
        num = "0" + num;
    }
    return num;
}

//BLE搜索值变为16进制

var base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

export function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;
    if(str != null){
        len = str.length;
        i = 0;
        out = "";
        while(i < len) {
            /* c1 */
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c1 == -1);
            if(c1 == -1)
                break;
            /* c2 */
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while(i < len && c2 == -1);
            if(c2 == -1)
                break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            /* c3 */
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if(c3 == 61)
                    return out;
                c3 = base64DecodeChars[c3];
            } while(i < len && c3 == -1);
            if(c3 == -1)
                break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            /* c4 */
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if(c4 == 61)
                    return out;
                c4 = base64DecodeChars[c4];
            } while(i < len && c4 == -1);
            if(c4 == -1)
                break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
    }
    return out;
}

export function CharToHex(str) {
    var out, i, len, c, h;
    out = "";
    if(str != null){
        len = str.length;
        i = 0;
        while(i < len) {
            c = str.charCodeAt(i++);
            h = c.toString(16);
            if(h.length < 2)
                h = "0" + h;
            out += "\\x" + h + " ";
            if(i > 0 && i % 8 == 0)
                out += "\r\n";
        }
    }
    return out;
}

export function pad(num, n) {
    return Array(n>num?(n-(''+num).length+1):0).join(0)+num;
}


export function replaceTime(txt){
        // var txt='2013-01-31 20:20';
        var re2='.*?((?:(?:[0-1][0-9])|(?:[2][0-3])|(?:[0-9])):(?:[0-5][0-9])?(?:\\s?(?:am|AM|pm|PM))?)';	// HourMinuteSec 1
        var p = new RegExp(re2,["i"]);
        var m = p.exec(txt);
        if (m != null){
            var time1=m[1].replace(/</,"&lt;")+"\n";
        }
        return time1;
}

//json 去重

    function obj2key(obj, keys){    
        var n = keys.length,       
        key = [];    
        while(n--){       
        key.push(obj[keys[n]]);   
        }    
        return key.join('|')
    }
    
    
    /**
     * 去重操作
     * @param {object} array 待去重的数组
     * @param  {object} keys 包含key值字符串的数组
     * @return {object} 返回去重后的数组
     */
export function uniqeByKeys(array,keys){    
        var arr = [];   
        var hash = {};    
        for (var i = 0, j = array.length; i < j; i++) {       
        var k = obj2key(array[i], keys);       
        if (!(k in hash)) {           
        hash[k] = true;           
        arr.push(array[i]);       
     } 
       }   
        return arr ;
    }