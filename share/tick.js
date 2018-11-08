var tick = function (delay) {
    var _delay = delay;
    var timer;
    if (typeof requestAnimationFrame === 'undefined') {
        timer = function (cb) {
           return setImmediate(function () {
                cb(_delay);
            }, _delay);
        };
    } else {
        timer = window.requestAnimationFrame;
    }

    return function (cb) {
        return timer(cb);
    };
};

module.exports = tick;


// var tick = function () {
//     var ticks = 0;
//     var timer;

//     if (typeof requestAnimationFrame === 'undefined') {
//         timer = function (cb) {
//           return  setTimeout(function () {
//                 cb(++ticks);
//             }, 0);
//         };
//     } else {
//         timer = window.requestAnimationFrame;
//     }

//     return function (cb) {
//         return timer(cb);
//     }
// };

// module.exports = tick();