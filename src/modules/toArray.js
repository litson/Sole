/**
 * @file
 * @fileoverview
 * @authors      zhangtao23
 * @date         2015/11/13
 * @version      1.0.0
 * @note
 */

/* global module */

'use strict';
module.exports = function (arrayLike, items) {
    return [].concat.apply(
        Array.prototype.slice.call(arrayLike)
        , items || []
    );
};
