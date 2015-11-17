/**
 * @file
 * @fileoverview
 * @authors      zhangtao23
 * @date         2015/10/26
 * @version      1.0.0
 * @note
 */

/* global module */
/* global __dirname */

var path = require('path');
var glob = require('glob');

// 得到一颗文件目录的树
var modulesMap = dirResolver('./src/*');

var aliasMap = alias(modulesMap);

function dirResolver(pathPartPattern) {

    // 分析出路径
    var $paths = glob.sync(pathPartPattern);
    var args = arguments; // 不能在严格模式下跑
    var result = {};

    if (!$paths.length) {
        return null;
    }

    $paths.forEach(
        function (name) {

            // dirResolver的名字有点low..
            var childPath = args.callee(
                [name, '*'].join(path.sep)
            );

            var dirs = name.match(/[^/]+/g);
            var n = dirs[dirs.length - 1];

            result[n] = childPath ? childPath : false;
        }
    );

    return result;
}

function type(object) {
    return Object.prototype.toString.call(object).replace(/\[\object|\]|\s/gi, '').toLowerCase();
}

function forEach(elements, callBack) {
    if (!elements) {
        return;
    }

    if (elements.forEach) {
        return elements.forEach(callBack);
    }

    for (var key in elements) {
        if (elements.hasOwnProperty(key) && callBack(elements[key], key, elements) === false) {
            break;
        }
    }

}

function alias(elements, traditional) {

    var result = {};

    result.add = function (item, key) {
        result[getFileName(key)] = path.resolve.apply(path, [__dirname, 'src'].concat(key.split(':')));
    };

    _buildAlias(result, elements, traditional);

    return result;
}

function _buildAlias(params, elements, traditional, prefix) {

    var isPlainObject = 'object' === type(elements);

    forEach(elements, function (item, key) {

        var _type = type(item);
        var _isPlainObject = 'object' === _type;

        if (prefix) {

            if (traditional) {
                key = prefix;
            } else {
                key = [

                    prefix
                    , ':'
                    , (isPlainObject || _isPlainObject) ? key : ''

                ].join('');
            }
        }

        if (!traditional && _isPlainObject) {
            _buildAlias(params, item, traditional, key);
        } else {
            params.add(item, key);
        }
    });
}

function getFileName(fileFullName) {
    return fileFullName.split('.')[0];
}

function extend(d, s) {
    for (var key in s) {
        d[key] = s[key];
    }
    return d;
}

module.exports = {

    context: __dirname,
    entry: './src/main.js',

    output: {
        path: './build/',
        filename: 'sole.js',
        jsonpFunction: 'soleJsonp'
    },

    resolve: {
        root: __dirname,
        extensions: ['', '.js', '.es6', '.css', '.tpl'],
        alias: aliasMap
    },

    module: {
        loaders: [
            {
                test: /\.es6?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel'
            }
            , {
                test: /\.html?$/,
                loader: 'html-loader'
            }
            , {
                test: /\.css$/
                , loader: 'style-loader!css-loader?minimize'
            }
        ]
    },

    resolveLoader: {
        root: path.resolve(__dirname, '../node_modules/')
    },

    debug: true,
    devtool: 'source-map'
};
