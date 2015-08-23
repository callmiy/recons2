"use strict";

Date.prototype.strftime = (function() {
  function strftime(format) {
    /* jshint validthis: true */

    var date = this;

    return (format + "").replace(/%([a-zA-Z])/g, function(m, f) {
      var formatter = Date.formats && Date.formats[f];

      if (typeof formatter === "function") {
        return formatter.call(Date.formats, date);
      } else if (typeof formatter === "string") {
        return date.strftime(formatter);
      }

      return f;
    });
  }

  // Internal helper
  function zeroPad(num) {
    return (+num < 10 ? "0" : "") + num;
  }

  Date.formats = {
    // Formatting methods
    d: function(date) {
      return zeroPad(date.getDate());
    },

    m: function(date) {
      return zeroPad(date.getMonth() + 1);
    },

    y: function(date) {
      return zeroPad(date.getYear() % 100);
    },

    Y: function(date) {
      return date.getFullYear();
    },

    b: function(date) {
      return date.toDateString().split(' ')[1];
    },

    j: function(date) {
      var jan1 = new Date(date.getFullYear(), 0, 1);
      var diff = date.getTime() - jan1.getTime();

      // 86400000 == 60 * 60 * 24 * 1000
      return Math.ceil(diff / 86400000);
    },

    // Format shorthands
    F: "%Y-%m-%d",
    D: "%m/%d/%y"
  };

  return strftime;
}());

var kanmii = {
  isObj: function(val) {
    return Object.prototype.toString.call(val) === Object.prototype.toString.call({});
  },

  isArray: function(val) {
    return Object.prototype.toString.call(val) === Object.prototype.toString.call([]);
  },

  isNumber: function(val) {
    return Object.prototype.toString.call(val) === Object.prototype.toString.call(0);
  },

  all: function(array) {
    var el, _i, _len;
    if (array.length === 0) {
      return false;
    }
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      el = array[_i];
      if (!Boolean(el)) {
        return false;
      }
    }
    return true;
  },

  any: function(array) {
    var el, _i, _len;
    if (array.length === 0) {
      return false;
    }
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      el = array[_i];
      if (Boolean(el) === true) {
        return true;
      }
    }
    return false;
  },

  sum: function(array) {
    var el, result, _i, _len;
    result = 0;
    for (_i = 0, _len = array.length; _i < _len; _i++) {
      el = array[_i];
      result += Number(el);
    }
    return result;
  },

  /**
   * Select all the texts inside an HTML control
   * @param {HTMLElement} el
   * @returns {undefined|String}
   */
  selectText: function(el) {
    var doc, range, selection, text;
    doc = document;
    text = el;

    //Internet explorer
    if (doc.body.createTextRange) {
      range = doc.body.createTextRange();
      range.moveToElementText(text);
      range.select();

      //Firefox, Chrome etc.
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = doc.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    return selection;
  },

  numberFormat: function(string) {
    var decimal, i, len, matched, mod, neg, others, stringArray, toNumber, _i, _len, _ref;
    string = String(string).replace(/,/g, "");
    toNumber = Number(string);

    if (isNaN(toNumber)) {return null;}

    matched = /^([-\+]?\d+)(\.\d*)$/.exec(toNumber.toFixed(2));

    string = matched[1].replace(/^\+/, '');

    decimal = matched[2];

    if (string.replace(/^-/, '').length < 4) {return string + decimal;}

    if (string[0] === '-') {
      string = string.slice(1);
      neg = '-';

    } else {
      neg = '';
    }

    len = string.length;

    stringArray = [];

    mod = len % 3;

    others = string.slice(mod);

    if (mod) {stringArray.push(string.slice(0, mod));}

    _ref = _.range(Math.floor(len / 3));

    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      i = _ref[_i];
      stringArray.push(others.slice(i * 3, i * 3 + 3));
    }

    return neg + stringArray.join(",") + decimal;
  },

  strip: function(string, chars) {

    if (typeof chars === "undefined") {chars = "\n\t\r ";}

    return string.replace(new RegExp("^[" + chars + "]+|[" + chars + "]+$", "g"), "");
  },

  formattedToNumber: function(val) {
    val = this.strip(String(val));
    return Number(val.replace(/,/g, ''));
  }
};

var $preLabel = $('pre[data-label-for]');

var $targetCtrl = $("#" + ($preLabel.data('label-for')));

if ($targetCtrl.val()) {
  $preLabel.hide();
}

$preLabel.css({
  position: 'absolute',
  top: 10,
  left: 25,
  margin: 0,
  padding: 0,
  color: '#ADACAC',
  display: 'block',
  border: 0,
  cursor: 'text',
  'background-color': 'initial',
  'white-space': 'pre-line',
  'border-radius': 0
}).on('click', function() {
  var $el;
  $el = $(this);
  if ($targetCtrl.val) {
    if ($targetCtrl.val()) {
      $el.hide();
    } else {
      $targetCtrl.focus();
      $el.show();
    }
  } else if ($targetCtrl.text) {
    if ($targetCtrl.text()) {
      $el.hide();
    } else {
      $el.show();
    }
  }
  $targetCtrl.focus();
})
  .next().on({
    'focusout': function() {
      var $el = $(this);
      if ($el.val) {
        if (!$el.val()) {
          return $el.prev().show();
        } else {
          return $el.prev().hide();
        }
      } else if ($el.text) {
        if (!$el.text()) {
          return $el.prev().show();
        } else {
          return $el.prev().hide();
        }
      }
    },
    'focusin': function() { $(this).prev().hide();}
  });

$.fn.checkOneAll = function(checkOneSelector, checkAllSelector) {
  $(this).on({
    'change': function() {
      return $(checkOneSelector).not('.no-check').prop('checked', $(this).prop('checked')).trigger('change');
    }
  }, checkAllSelector);
  $(this).on({
    'change': function() {
      var $checkAll, $checkOne;
      $checkOne = $(checkOneSelector);
      $checkAll = $(checkAllSelector);
      if ($(this).prop('checked') === false) {
        return $checkAll.prop('checked', false);
      } else {
        return $checkAll.prop('checked', $checkOne.filter(':checked').size() === $checkOne.size());
      }
    }
  }, checkOneSelector);
  return this;
};

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie != '') {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = jQuery.trim(cookies[i]);
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) == (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

var csrftoken = getCookie('csrftoken');

//using jquery?
$.ajaxSetup(
  {headers: {'X-CSRFToken': csrftoken}}
);

//using angular
angular
  .module('ngResource')
  .config(configureCsrf);

configureCsrf.$inject = ['$httpProvider'];

function configureCsrf($httpProvider) {
  $httpProvider.defaults.xsrfCookieName = 'csrftoken'
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
}

/**
 * angular chops off trailing url. This will fix that
 * @param url
 * @param suffix
 * @returns {string}
 */
function appendToUrl(url, suffix) {
  return url + (/\/$/.test(url) ? '' : '/') + suffix;
}
