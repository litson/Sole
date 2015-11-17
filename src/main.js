/**
 * @file
 * @fileoverview
 * @authors      litson.zhang@gmail.com
 * @date         2015/11/10
 * @version      0.0.1
 * @note
 */

/* global module */

'use strict';

require('./modules/sole.css');
require('./modules/agate.css');
var Vue      = require('./modules/vue.js');
var hljs     = require('./modules/highlight.js');
var toArray  = require('./modules/toArray.js');
var json2str = require('./modules/json2str.js');
var template = require('./modules/sole.html');

var win  = window;
var doc  = document;
var sole = {
    open: true
};
var originalConsole = console;
var overrideMethods = [];
var methods = [
    'assert'
    , 'clear'
    , 'count'
    , 'debug'
    , 'dir'
    , 'dirxml'
    , 'error'
    , 'exception'
    , 'group'
    , 'groupCollapsed'
    , 'groupEnd'
    , 'info'
    , 'log'
    , 'markTimeline'
    , 'profile'
    , 'profileEnd'
    , 'table'
    , 'time'
    , 'timeEnd'
    , 'timeStamp'
    , 'trace'
    , 'warn'
];

// filters
Vue.filter('preview', function (value) {

    var content = typeof value.content === 'string'
        ? value.content
        : json2str(value.content);

    content = '<span class="debugger-text-' + value.type + '">[ ' + value.type + ' ]</span>: ' + content;

    return content;
});

Vue.filter('highlight', function (value) {
    var self = this;

    setTimeout(function () {
        var hlElement = self
            .$forContext
            .cache[self.$index]
            .node.getElementsByTagName('pre')[0]
            .getElementsByTagName('code')[0];
        hljs.highlightBlock(hlElement);
    }, 1);

    return value;
});

var $messages = null;
var vm        = new Vue({
    data: {
        messages: []
    },
    methods: {
        removeMessage: function (index) {
            $messages.splice(index, 1);
        },
        removeAllMessage: function () {
            console.clear();
        }
    }
});

$messages = vm.$data.messages;

function register(type, cb) {
    overrideMethods.push(type);
    sole[type] = cb;
}

function messagePackage(arrayLike, type) {

    var messages = deepInside(arrayLike, type);
    var args     = messages.original;

    // output in dom
    if (sole.open) {
        $messages.push.apply($messages, messages.sole);
    }

    // console.log sync output
    originalConsole[type].apply(originalConsole, args);
}

function deepInside(arrayLike, type) {
    var originalData = toArray(arrayLike);
    return {
        original: originalData,
        sole: originalData.map(
            function (item) {
                return {
                    type: type,
                    content: item
                }
            }
        )
    }
}

// 
var $soleDom = doc.createElement('div');
$soleDom.innerHTML = template;
doc.body.appendChild($soleDom);
vm.$mount('#sole');

// Inject member.
['log', 'warn', 'info', 'error', 'dir'].forEach(function (item) {
    register(item, function () {
        messagePackage(arguments, item);
    });
});

register('clear', function () {
    originalConsole.clear();
    $messages.splice(0, $messages.length);
});

// Remove members that have been overloaded.
methods = methods.filter(function (item) {
    return overrideMethods.indexOf(item) === -1;
});

// Inject other members.
methods.forEach(function (type) {
    register(type, function () {
        return originalConsole[type].apply(originalConsole, arguments);
    });
});

// when error happened.
win.addEventListener('error', function (event) {
    console.error(event.message);
}, false);

// Bind in global.
win.console  = sole;
win._console = originalConsole;
