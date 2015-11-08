(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var _cmp = 'components/';
  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf(_cmp) === 0) {
        start = _cmp.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return _cmp + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var _reg = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (_reg.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  require._cache = cache;
  globals.require = require;
})();
require.register("application", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _viewsMenu = require("views/menu");

var _viewsMenu2 = _interopRequireDefault(_viewsMenu);

var _viewsMain = require("views/main");

var _viewsMain2 = _interopRequireDefault(_viewsMain);

exports["default"] = {
    initialize: function initialize() {
        this.views = {
            menu: new _viewsMenu2["default"](),
            main: new _viewsMain2["default"]()
        };
        this.views.menu.$el.appendTo("#container");
        this.views.main.$el.appendTo("#container");
    }
};
module.exports = exports["default"];
});

;require.register("initialize", function(exports, require, module) {
"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _application = require("application");

var _application2 = _interopRequireDefault(_application);

window.app = _application2["default"];

$(function () {
  return _application2["default"].initialize();
});
});

require.register("models/menu", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = Backbone.Collection.extend({
    model: Backbone.Model,
    url: "/docTypes"
});
module.exports = exports["default"];
});

require.register("views/main", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports["default"] = Backbone.View.extend({
    attributes: {
        id: "main"
    },
    collection: new Backbone.Collection(),
    emptyTemplate: '<p>Nothing to display at the moment!</p>',
    initialize: function initialize() {
        this.render();
    },
    render: function render() {
        var html = "";
        if (this.collection.length === 0) {
            html = this.emptyTemplate;
        }
        this.$el.empty().html(html);
        return this;
    }
});
module.exports = exports["default"];
});

require.register("views/menu", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsMenu = require("models/menu");

var _modelsMenu2 = _interopRequireDefault(_modelsMenu);

exports["default"] = Backbone.View.extend({
    attributes: {
        id: "menu"
    },
    collection: new _modelsMenu2["default"](),
    initialize: function initialize() {
        this.collection.fetch().done(this.render.bind(this));
    },
    itemTemplate: _.template('<li><%= doctype %> (<%= sum %>)</li>'),
    render: function render() {
        var _this = this;

        var html = "<ul>";
        this.collection.forEach(function (model) {
            html += _this.itemTemplate(model.toJSON());
        }, this);
        html += "</ul>";
        this.$el.empty().html(html);
        return this;
    }
});
module.exports = exports["default"];
});


//# sourceMappingURL=app.js.map