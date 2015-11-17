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

var toArray = require('./toArray.js');

function type(object) {
    return Object.prototype.toString.call(object).replace(/\[\object|\]|\s/gi, '').toLowerCase();
}

function dataNormalize(object) {
    return (type(object) === 'arguments') ? toArray(object) : object;
}

module.exports = function (object) {

    var result = '';

    try {
        result = JSON.stringify(
            dataNormalize(object)
            , function (key, value) {

                var dataType = type(value);
                var nodeType = value.nodeType;

                if (nodeType !== undefined && nodeType != 9) {

                    value = value.outerHTML
                        ? value.outerHTML.replace(/\</gim, '&lt;').replace(/\>/gim, '&gt;')
                        : value;
                }

                if (dataType === 'function') {
                    value = value.toString().replace(/^"|"$/g, '');
                }

                return typeof value === 'string' ? value.replace(/\n|\r/gim, '<br>').replace(/\t/gim, '  ') : value;
            }
            , 4);
    } catch (e) {

        console.warn(
            '\n[ ERROR HAPPENED! ]: Please send the following message to litson.zhang@gmail.com\'s email!Thank you!\n[ MESSAGE ]:'
            + e.message
        );

        console.warn(
            '\n[ NOTE! ]: Often occurs in trying to output top-level objects ' +
            '"window" or "circular reference" etc.NOT YOUR BUGS!'
        );

        result = object;
    }

    return result;
};