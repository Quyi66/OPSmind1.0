"use strict";

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _s, _e;
  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function F() {};
      return {
        s: F,
        n: function n() {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function e(_e2) {
          throw _e2;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function s() {
      it = it.call(o);
    },
    n: function n() {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function e(_e3) {
      didErr = true;
      err = _e3;
    },
    f: function f() {
      try {
        if (!normalCompletion && it["return"] != null) it["return"]();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }
  return arr2;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _typeof(obj) {
  "@babel/helpers - typeof";
  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

(function (global, factory) {
  (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? factory(exports) : typeof define === 'function' && define.amd ? define(['exports'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.OpenCC = {}));
})(void 0, function (exports) {
  'use strict';

  var variants2standard = {
    cn: ['STCharacters', 'STPhrases'],
    hk: ['HKVariantsRev', 'HKVariantsRevPhrases'],
    tw: ['TWVariantsRev', 'TWVariantsRevPhrases'],
    twp: ['TWVariantsRev', 'TWVariantsRevPhrases', 'TWPhrasesRev'],
    jp: ['JPVariantsRev', 'JPShinjitaiCharacters', 'JPShinjitaiPhrases']
  };
  var standard2variants = {
    cn: ['TSCharacters', 'TSPhrases'],
    hk: ['HKVariants'],
    tw: ['TWVariants'],
    twp: ['TWVariants', 'TWPhrasesIT', 'TWPhrasesName', 'TWPhrasesOther'],
    jp: ['JPVariants']
  };
  /**
   * Trie 樹。
   */

  var Trie = /*#__PURE__*/ function () {
    // 使用 Map 實作 Trie 樹
    // Trie 的每個節點為一個 Map 物件
    // key 為 code point，value 為子節點（也是一個 Map）。
    // 如果 Map 物件有 trie_val 屬性，則該屬性為值字串，代表替換的字詞。
    function Trie() {
      _classCallCheck(this, Trie);

      this.map = new Map();
    }
    /**
     * 將一項資料加入字典樹
     * @param {string} s 要匹配的字串
     * @param {string} v 若匹配成功，則替換為此字串
     */


    _createClass(Trie, [{
      key: "addWord",
      value: function addWord(s, v) {
        var map = this.map;

        var _iterator = _createForOfIteratorHelper(s),
          _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var c = _step.value;
            var cp = c.codePointAt(0);
            var nextMap = map.get(cp);

            if (nextMap == null) {
              var tmp = new Map();
              map.set(cp, tmp);
              map = tmp;
            } else {
              map = nextMap;
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        map.trie_val = v;
      }
      /**
       * 根據字典樹中的資料轉換字串。
       * @param {string} s 要轉換的字串
       */

    }, {
      key: "convert",
      value: function convert(s) {
        var t = this.map;
        var n = s.length,
          arr = [];
        var orig_i;

        for (var i = 0; i < n;) {
          var t_curr = t,
            k = 0,
            v = void 0;

          for (var j = i; j < n;) {
            var x = s.codePointAt(j);
            j += x > 0xffff ? 2 : 1;
            var t_next = t_curr.get(x);

            if (typeof t_next === 'undefined') {
              break;
            }

            t_curr = t_next;
            var v_curr = t_curr.trie_val;

            if (typeof v_curr !== 'undefined') {
              k = j;
              v = v_curr;
            }
          }

          if (k > 0) {
            //有替代
            if (orig_i !== null) {
              arr.push(s.slice(orig_i, i));
              orig_i = null;
            }

            arr.push(v);
            i = k;
          } else {
            //無替代
            if (orig_i === null) {
              orig_i = i;
            }

            i += s.codePointAt(i) > 0xffff ? 2 : 1;
          }
        }

        if (orig_i !== null) {
          arr.push(s.slice(orig_i, n));
        }

        return arr.join('');
      }
    }]);

    return Trie;
  }();

  function getDict(dictName) {
    return OpenCCJSData[dictName];
  }

  function loadDict(s, type) {
    var t = new Trie();

    var _iterator2 = _createForOfIteratorHelper((type === 'from' ? variants2standard : standard2variants)[s]),
      _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var dictName = _step2.value;

        var _iterator3 = _createForOfIteratorHelper(getDict(dictName).split('|')),
          _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var line = _step3.value;

            var _line$split = line.split(' '),
              _line$split2 = _slicedToArray(_line$split, 2),
              l = _line$split2[0],
              r = _line$split2[1];

            t.addWord(l, r);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    return t;
  }
  /**
   * Create a preset OpenCC converter.
   * @param {{from: string, to: string}} options Conversion options.
   * @returns The converter that performs the conversion.
   */


  function Converter(options) {
    if (options.from == null) throw new Error('Please provide the `from` option');
    if (options.to == null) throw new Error('Please provide the `to` option');
    var dictFrom = options.from === 't' ? null : loadDict(options.from, 'from');
    var dictTo = options.to === 't' ? null : loadDict(options.to, 'to');
    /**
     * The converter that performs the conversion.
     * @param {string} s The string to be converted.
     * @returns {string} The converted string.
     */

    function convert(s) {
      var res = s;
      if (options.from !== 't') res = dictFrom.convert(res);
      if (options.to !== 't') res = dictTo.convert(res);
      return res;
    }

    return convert;
  }
  /**
   * Create a custom converter.
   * @param {string[][]} dict The dictionary to be used for conversion.
   * @returns The converter that performs the conversion.
   */


  function CustomConverter(dict) {
    var t = new Trie();
    dict.forEach(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
        k = _ref2[0],
        v = _ref2[1];

      t.addWord(k, v);
    });
    /**
     * The converter that performs the conversion.
     * @param {string} s The string to be converted.
     * @returns {string} The converted string.
     */

    function convert(s) {
      return t.convert(s);
    }

    return convert;
  }
  /**
   * Create a HTML page converter.
   * @param {(s: string) => string} converter The converter that performs the conversion.
   * @param {HTMLElement} rootNode The root node for recursive conversions.
   * @param {string} fromLangTag The lang tag to be converted.
   * @param {string} toLangTag The lang tag of the conversion result.
   * @returns The HTML page converter.
   */


  function HTMLConverter(converter, rootNode, fromLangTag, toLangTag) {
    /**
     * Perform the conversion on the page.
     */
    function convert() {
      function inner(currentNode, langMatched) {
        /* class list 包含 ignore-opencc 的元素會跳過後續的轉換 */
        if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.classList.contains('ignore-opencc')) return;

        if (currentNode.lang === fromLangTag) {
          langMatched = true;
          currentNode.shouldChangeLang = true; // 記住 lang 屬性被修改了，以便恢復

          currentNode.lang = toLangTag;
        } else if (currentNode.lang && currentNode.lang.length) {
          langMatched = false;
        }

        if (langMatched) {
          /* Do not convert these elements */
          if (currentNode.tagName === 'SCRIPT') return;
          if (currentNode.tagName === 'STYLE') return;
          /* 處理特殊屬性 */

          if (currentNode.tagName === 'META' && currentNode.name === 'description') {
            if (currentNode.originalContent == null) {
              currentNode.originalContent = currentNode.content;
            }

            currentNode.content = converter(currentNode.originalContent);
          } else if (currentNode.tagName === 'META' && currentNode.name === 'keywords') {
            if (currentNode.originalContent == null) {
              currentNode.originalContent = currentNode.content;
            }

            currentNode.content = converter(currentNode.originalContent);
          } else if (currentNode.tagName === 'IMG') {
            if (currentNode.originalAlt == null) {
              currentNode.originalAlt = currentNode.alt;
            }

            currentNode.alt = converter(currentNode.originalAlt);
          } else if (currentNode.tagName === 'INPUT' && currentNode.type === 'button') {
            if (currentNode.originalValue == null) {
              currentNode.originalValue = currentNode.value;
            }

            currentNode.value = converter(currentNode.originalValue);
          }
        }

        var _iterator4 = _createForOfIteratorHelper(currentNode.childNodes),
          _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var node = _step4.value;

            if (node.nodeType === Node.TEXT_NODE && langMatched) {
              if (node.originalString == null) {
                node.originalString = node.nodeValue; // 存儲原始字串，以便恢復
              }

              node.nodeValue = converter(node.originalString);
            } else {
              inner(node, langMatched);
            }
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }

      inner(rootNode, false);
    }
    /**
     * Restore the page to the state before the conversion.
     */


    function restore() {
      function inner(currentNode) {
        /* class list 包含 ignore-opencc 的元素會跳過後續的轉換 */
        if (currentNode.nodeType === Node.ELEMENT_NODE && currentNode.classList.contains('ignore-opencc')) return;

        if (currentNode.shouldChangeLang) {
          currentNode.lang = fromLangTag;
        }

        if (currentNode.originalString !== undefined) {
          currentNode.nodeValue = currentNode.originalString;
        }
        /* 處理特殊屬性 */


        if (currentNode.tagName === 'META' && currentNode.name === 'description') {
          if (currentNode.originalContent !== undefined) {
            currentNode.content = currentNode.originalContent;
          }
        } else if (currentNode.tagName === 'META' && currentNode.name === 'keywords') {
          if (currentNode.originalContent !== undefined) {
            currentNode.content = currentNode.originalContent;
          }
        } else if (currentNode.tagName === 'IMG') {
          if (currentNode.originalAlt !== undefined) {
            currentNode.alt = currentNode.originalAlt;
          }
        } else if (currentNode.tagName === 'INPUT' && currentNode.type === 'button') {
          if (currentNode.originalValue !== undefined) {
            currentNode.value = currentNode.originalValue;
          }
        }

        var _iterator5 = _createForOfIteratorHelper(currentNode.childNodes),
          _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var node = _step5.value;
            inner(node);
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }

      inner(rootNode);
    }

    return {
      convert: convert,
      restore: restore
    };
  }

  exports.Converter = Converter;
  exports.CustomConverter = CustomConverter;
  exports.HTMLConverter = HTMLConverter;
  exports.Trie = Trie;
  Object.defineProperty(exports, '__esModule', {
    value: true
  });
});