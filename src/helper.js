/*
 * post-web
 * https://github.com/qiu8310/post-web
 *
 * Copyright (c) 2015 Zhonglei Qiu
 * Licensed under the MIT license.
 */

var fs = require('fs-extra'),
  _ = require('lodash'),
  path = require('path');

var EOL = require('os').EOL;

function join(args) {
  return path.join.apply(path, args);
}

var helper = {

  /**
   * End of Line
   *
   * @type {String}
   */
  EOL: EOL,

  /**
   *
   * 读取 json 文件，忽略一切错误，有错误就返回一个空的 object
   *
   * @returns {Object}
   */
  safeReadJson: function () {
    try {
      return fs.readJsonFileSync(join(arguments));
    } catch (e) {
    }
    return {};
  },

  /**
   * 读取像 .gitignore 文件一样的文件列表文件，忽略一切错误
   *
   * @returns {Array}
   */
  safeReadFileList: function () {
    try {
      var content = helper.readFile(join(arguments));
      return _(content.split(/[\r]?\n/))
        .map(function (line) {
          return line.split('#').shift();
        })
        .filter(function (line) {
          return line;
        }).value();
    } catch (e) {
    }
    return [];
  },


  /**
   * 读取文件内容，默认的 fs.readFileSync 总是返回一个 Buffer，需要手动 toString 下，好烦
   *
   * @returns {String}
   */
  readFile: function () {
    return fs.readFileSync(join(arguments)).toString();
  },


  /**
   * 判断某个文件是否是个文件夹
   *
   * @returns {Boolean}
   */
  isDirectory: function () {
    try {
      return fs.statSync(join(arguments)).isDirectory();
    } catch (e) {
    }
    return false;
  },

  /**
   *
   * 用户配置的目录可能是相对于当前路径的目录，也可能是相对于 projectDir 的目录；
   * 由此程序来根据文件是否存在来判断用哪个目录，如果两个目录都不存在，则使用相对于当前路径的目录
   *
   * 最后返回相对于 projectDir 的目录
   *
   * @param {String} dir
   * @param {String} projectDir
   * @returns {String}
   */
  relativePath: function (dir, projectDir) {
    var target = path.resolve(dir),
      projectTarget = path.resolve(projectDir, dir);

    if (helper.isDirectory(projectTarget)) {
      target = projectTarget;
    }

    return path.relative(projectDir, target);
  },

  /**
   * 封装回调函数
   * @param {Function} fn
   * @param {Object} options
   */
  wrap: function(fn, options) {
    return function(next) {
      try {
        fn(options, next);
      } catch(e) { next(e); }
    };
  }
};


module.exports = helper;
