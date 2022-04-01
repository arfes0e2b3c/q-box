exports.ids = [8,3,4,5];
exports.modules = {

/***/ 34:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(38);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(7).default
module.exports.__inject__ = function (context) {
  add("7e26872d", content, true, context)
};

/***/ }),

/***/ 35:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/shared/SendSentence.vue?vue&type=template&id=a19e4cca&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('transition',[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.getShow),expression:"getShow"}],staticClass:"sentence-box",class:{held: this.held, boxHeightInPosts: _vm.getMode === 'reply'}},[_c('h3',{directives:[{name:"show",rawName:"v-show",value:(_vm.getMode === 'question'),expression:"getMode === 'question'"}]},[_vm._v("お手伝いサークルに質問する")]),_vm._v(" "),_c('textarea',{directives:[{name:"model",rawName:"v-model",value:(_vm.sentence),expression:"sentence"}],attrs:{"placeholder":this.textareaWord[_vm.mode],"autocomplete":"off"},domProps:{"value":(_vm.sentence)},on:{"input":function($event){if($event.target.composing){ return; }_vm.sentence=$event.target.value}}}),_vm._v(" "),_c('p',{directives:[{name:"show",rawName:"v-show",value:(_vm.getMode === 'answer' || _vm.getMode === 'replyForReply'),expression:"getMode === 'answer' || getMode === 'replyForReply'"}]},[_vm._v(_vm._s(this.sentence.length))]),_vm._v(" "),_c('button',{staticClass:"button",on:{"click":_vm.sendSentence}},[_vm._v(_vm._s(this.buttonWord[_vm.mode]))])])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/shared/SendSentence.vue?vue&type=template&id=a19e4cca&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/shared/SendSentence.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var SendSentencevue_type_script_lang_js_ = ({
  props: {
    mode: '',
    contentId: '',
    replyTweetId: '',
    contentOriginId: '',
    replySentence: '',
    held: false,
    show: '',
    MICROCMS_KEY: '',
    CONSUMER_KEY: '',
    CONSUMER_KEY_SECRET: '',
    ACCESS_TOKEN_KEY: '',
    ACCESS_TOKEN_KEY_SECRET: ''
  },

  data() {
    return {
      getShow: this.show,
      getMode: this.mode,
      getContentId: this.contentId,
      getReplyTweetId: this.replyTweetId,
      getContentOriginId: this.contentOriginId,
      getReplySentence: this.replySentence,
      sentence: '',
      textareaWord: {
        question: 'お手伝いサークルへの質問を入力する',
        answer: 'この質問への回答を入力する',
        reply: 'この質問への返信を入力する',
        replyForReply: 'この返信への回答を入力する'
      },
      buttonWord: {
        question: '質問する',
        answer: '回答する',
        reply: '返信する',
        replyForReply: '回答する'
      }
    };
  },

  methods: {
    toggle() {
      this.getShow = !this.getShow;
    },

    async sendSentence() {
      if (this.sentence && this.getMode === 'question') {
        await this.$axios.$post('https://q-box.microcms.io/api/v1/q_box_posts', {
          question: this.sentence,
          held: false
        }, {
          headers: {
            "Content-Type": "application/json",
            'X-MICROCMS-API-KEY': this.MICROCMS_KEY
          }
        }).catch(error => {
          alert('通信に失敗しました。：' + error);
          console.log(error);
        }).then(() => {
          this.sentence = '';
          alert('送信しました。');
        });
      } else if (this.sentence && this.getMode === 'answer') {
        this.postTweet(this.sentence, this.getContentId, 'tweet', 'answer');
      } else if (this.sentence && this.getMode === 'reply') {
        await this.$axios.$post('https://q-box.microcms.io/api/v1/q_box_replies/', {
          replyFor: this.getContentId,
          replySentence: this.sentence,
          held: false
        }, {
          headers: {
            "Content-Type": "application/json",
            'X-MICROCMS-API-KEY': this.MICROCMS_KEY
          }
        }).catch(error => {
          alert('通信に失敗しました。：' + error);
          console.log(error);
        }).then(() => {
          this.sentence = ''; // location.reload()
        });
      } else if (this.sentence && this.getMode === 'replyForReply') {
        this.postTweet('【フォロワーの方からの情報】\n\n' + this.getReplySentence + '\n\n' + this.sentence, this.getReplyTweetId, 'reply', 'replyForReply');
        this.$emit('setReply');
      }
    },

    async postTweet(answer, id, mode, sendSentenceMode) {
      const TWEET_LIMIT_CHARS_INCLUDE_URL = 110;
      const TWEET_LIMIT_CHARS = 140;
      let slicedAnswer = [...answer];

      if (!Array.isArray(answer)) {
        slicedAnswer = [];
        slicedAnswer.push(answer.slice(0, TWEET_LIMIT_CHARS_INCLUDE_URL));

        for (let i = TWEET_LIMIT_CHARS_INCLUDE_URL; i < answer.length - 2; i += TWEET_LIMIT_CHARS) {
          slicedAnswer.push(answer.slice(i, i + TWEET_LIMIT_CHARS));
        }
      }

      const OAuth = __webpack_require__(36);

      const crypto = __webpack_require__(29);

      const oauth = OAuth({
        consumer: {
          key: this.CONSUMER_KEY,
          secret: this.CONSUMER_KEY_SECRET
        },
        signature_method: 'HMAC-SHA1',

        hash_function(base_string, key) {
          return crypto.createHmac('sha1', key).update(base_string).digest('base64');
        }

      });
      const token = {
        key: this.ACCESS_TOKEN_KEY,
        secret: this.ACCESS_TOKEN_KEY_SECRET
      };
      const request = {
        url: "https://api.twitter.com/2/tweets",
        method: 'POST'
      };
      let config = oauth.toHeader(oauth.authorize(request, token)).Authorization;
      let data = [];

      if (mode === 'tweet') {
        data = {
          text: slicedAnswer[0] + '\nhttps://immense-sea-94037.herokuapp.com/' + id
        };
      } else if (mode === 'reply') {
        data = {
          "text": slicedAnswer[0],
          "reply": {
            "in_reply_to_tweet_id": id
          }
        };
      } else {
        console.log('not fit!');
      }

      this.$axios.$post("/api/tweets", data, {
        headers: {
          authorization: config
        }
      }).then(response => {
        if (slicedAnswer.length > 1) {
          this.postTweet(slicedAnswer.slice(1), response.data.id, 'reply');
        }

        if (sendSentenceMode === 'answer') {
          this.sendSentenceModeAnswer(response.data.id);
        } else if (sendSentenceMode === 'replyForReply') {
          this.sendSentenceModeReplyForReply(response.data.id);
          this.setReplyTweetId(response.data.id);
        }
      }).catch(error => {
        alert('通信に失敗しました。：' + error);
        console.log(error);
      });
    },

    async sendSentenceModeAnswer(id) {
      await this.$axios.$patch('https://q-box.microcms.io/api/v1/q_box_posts/' + this.getContentId, {
        answer: this.sentence,
        replyTweetId: id
      }, {
        headers: {
          "Content-Type": "application/json",
          'X-MICROCMS-API-KEY': this.MICROCMS_KEY
        }
      }).catch(error => {
        alert('通信に失敗しました。：' + error);
        console.log(error);
      }).then(() => {
        this.$emit('get-posts');
        this.sentence = ''; // location.reload()
      });
    },

    async sendSentenceModeReplyForReply() {
      await this.$axios.$patch('https://q-box.microcms.io/api/v1/q_box_replies/' + this.getContentId, {
        replyAnswer: this.sentence
      }, {
        headers: {
          "Content-Type": "application/json",
          'X-MICROCMS-API-KEY': this.MICROCMS_KEY
        }
      }).then(() => {
        this.$emit('set-replies');
        this.sentence = '';
      }).catch(error => {
        alert('通信に失敗しました。：' + error);
        console.log(error);
      });
    },

    async setReplyTweetId(id) {
      await this.$axios.$patch('https://q-box.microcms.io/api/v1/q_box_posts/' + this.getContentOriginId, {
        replyTweetId: id
      }, {
        headers: {
          "Content-Type": "application/json",
          'X-MICROCMS-API-KEY': this.MICROCMS_KEY
        }
      }).catch(error => {
        alert('通信に失敗しました。：' + error);
        console.log(error);
      });
    }

  }
});
// CONCATENATED MODULE: ./components/shared/SendSentence.vue?vue&type=script&lang=js&
 /* harmony default export */ var shared_SendSentencevue_type_script_lang_js_ = (SendSentencevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/shared/SendSentence.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(37)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  shared_SendSentencevue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "a19e4cca",
  "73af7eac"
  
)

/* harmony default export */ var SendSentence = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 36:
/***/ (function(module, exports, __webpack_require__) {

if (true) {
    module.exports = OAuth;
}

/**
 * Constructor
 * @param {Object} opts consumer key and secret
 */
function OAuth(opts) {
    if(!(this instanceof OAuth)) {
        return new OAuth(opts);
    }

    if(!opts) {
        opts = {};
    }

    if(!opts.consumer) {
        throw new Error('consumer option is required');
    }

    this.consumer            = opts.consumer;
    this.nonce_length        = opts.nonce_length || 32;
    this.version             = opts.version || '1.0';
    this.parameter_seperator = opts.parameter_seperator || ', ';
    this.realm               = opts.realm;

    if(typeof opts.last_ampersand === 'undefined') {
        this.last_ampersand = true;
    } else {
        this.last_ampersand = opts.last_ampersand;
    }

    // default signature_method is 'PLAINTEXT'
    this.signature_method = opts.signature_method || 'PLAINTEXT';

    if(this.signature_method == 'PLAINTEXT' && !opts.hash_function) {
        opts.hash_function = function(base_string, key) {
            return key;
        }
    }

    if(!opts.hash_function) {
        throw new Error('hash_function option is required');
    }

    this.hash_function = opts.hash_function;
    this.body_hash_function = opts.body_hash_function || this.hash_function;
}

/**
 * OAuth request authorize
 * @param  {Object} request data
 * {
 *     method,
 *     url,
 *     data
 * }
 * @param  {Object} key and secret token
 * @return {Object} OAuth Authorized data
 */
OAuth.prototype.authorize = function(request, token) {
    var oauth_data = {
        oauth_consumer_key: this.consumer.key,
        oauth_nonce: this.getNonce(),
        oauth_signature_method: this.signature_method,
        oauth_timestamp: this.getTimeStamp(),
        oauth_version: this.version
    };

    if(!token) {
        token = {};
    }

    if(token.key !== undefined) {
        oauth_data.oauth_token = token.key;
    }

    if(!request.data) {
        request.data = {};
    }

    if(request.includeBodyHash) {
      oauth_data.oauth_body_hash = this.getBodyHash(request, token.secret)
    }

    oauth_data.oauth_signature = this.getSignature(request, token.secret, oauth_data);

    return oauth_data;
};

/**
 * Create a OAuth Signature
 * @param  {Object} request data
 * @param  {Object} token_secret key and secret token
 * @param  {Object} oauth_data   OAuth data
 * @return {String} Signature
 */
OAuth.prototype.getSignature = function(request, token_secret, oauth_data) {
    return this.hash_function(this.getBaseString(request, oauth_data), this.getSigningKey(token_secret));
};

/**
 * Create a OAuth Body Hash
 * @param {Object} request data
 */
OAuth.prototype.getBodyHash = function(request, token_secret) {
  var body = typeof request.data === 'string' ? request.data : JSON.stringify(request.data)

  if (!this.body_hash_function) {
    throw new Error('body_hash_function option is required');
  }

  return this.body_hash_function(body, this.getSigningKey(token_secret))
};

/**
 * Base String = Method + Base Url + ParameterString
 * @param  {Object} request data
 * @param  {Object} OAuth data
 * @return {String} Base String
 */
OAuth.prototype.getBaseString = function(request, oauth_data) {
    return request.method.toUpperCase() + '&' + this.percentEncode(this.getBaseUrl(request.url)) + '&' + this.percentEncode(this.getParameterString(request, oauth_data));
};

/**
 * Get data from url
 * -> merge with oauth data
 * -> percent encode key & value
 * -> sort
 *
 * @param  {Object} request data
 * @param  {Object} OAuth data
 * @return {Object} Parameter string data
 */
OAuth.prototype.getParameterString = function(request, oauth_data) {
    var base_string_data;
    if (oauth_data.oauth_body_hash) {
        base_string_data = this.sortObject(this.percentEncodeData(this.mergeObject(oauth_data, this.deParamUrl(request.url))));
    } else {
        base_string_data = this.sortObject(this.percentEncodeData(this.mergeObject(oauth_data, this.mergeObject(request.data, this.deParamUrl(request.url)))));
    }

    var data_str = '';

    //base_string_data to string
    for(var i = 0; i < base_string_data.length; i++) {
        var key = base_string_data[i].key;
        var value = base_string_data[i].value;
        // check if the value is an array
        // this means that this key has multiple values
        if (value && Array.isArray(value)){
          // sort the array first
          value.sort();

          var valString = "";
          // serialize all values for this key: e.g. formkey=formvalue1&formkey=formvalue2
          value.forEach((function(item, i){
            valString += key + '=' + item;
            if (i < value.length){
              valString += "&";
            }
          }).bind(this));
          data_str += valString;
        } else {
          data_str += key + '=' + value + '&';
        }
    }

    //remove the last character
    data_str = data_str.substr(0, data_str.length - 1);
    return data_str;
};

/**
 * Create a Signing Key
 * @param  {String} token_secret Secret Token
 * @return {String} Signing Key
 */
OAuth.prototype.getSigningKey = function(token_secret) {
    token_secret = token_secret || '';

    if(!this.last_ampersand && !token_secret) {
        return this.percentEncode(this.consumer.secret);
    }

    return this.percentEncode(this.consumer.secret) + '&' + this.percentEncode(token_secret);
};

/**
 * Get base url
 * @param  {String} url
 * @return {String}
 */
OAuth.prototype.getBaseUrl = function(url) {
    return url.split('?')[0];
};

/**
 * Get data from String
 * @param  {String} string
 * @return {Object}
 */
OAuth.prototype.deParam = function(string) {
    var arr = string.split('&');
    var data = {};

    for(var i = 0; i < arr.length; i++) {
        var item = arr[i].split('=');

        // '' value
        item[1] = item[1] || '';

        // check if the key already exists
        // this can occur if the QS part of the url contains duplicate keys like this: ?formkey=formvalue1&formkey=formvalue2
        if (data[item[0]]){
          // the key exists already
          if (!Array.isArray(data[item[0]])) {
            // replace the value with an array containing the already present value
            data[item[0]] = [data[item[0]]];
          }
          // and add the new found value to it
          data[item[0]].push(decodeURIComponent(item[1]));
        } else {
          // it doesn't exist, just put the found value in the data object
          data[item[0]] = decodeURIComponent(item[1]);
        }
    }

    return data;
};

/**
 * Get data from url
 * @param  {String} url
 * @return {Object}
 */
OAuth.prototype.deParamUrl = function(url) {
    var tmp = url.split('?');

    if (tmp.length === 1)
        return {};

    return this.deParam(tmp[1]);
};

/**
 * Percent Encode
 * @param  {String} str
 * @return {String} percent encoded string
 */
OAuth.prototype.percentEncode = function(str) {
    return encodeURIComponent(str)
        .replace(/\!/g, "%21")
        .replace(/\*/g, "%2A")
        .replace(/\'/g, "%27")
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29");
};

/**
 * Percent Encode Object
 * @param  {Object} data
 * @return {Object} percent encoded data
 */
OAuth.prototype.percentEncodeData = function(data) {
    var result = {};

    for(var key in data) {
        var value = data[key];
        // check if the value is an array
        if (value && Array.isArray(value)){
          var newValue = [];
          // percentEncode every value
          value.forEach((function(val){
            newValue.push(this.percentEncode(val));
          }).bind(this));
          value = newValue;
        } else {
          value = this.percentEncode(value);
        }
        result[this.percentEncode(key)] = value;
    }

    return result;
};

/**
 * Get OAuth data as Header
 * @param  {Object} oauth_data
 * @return {String} Header data key - value
 */
OAuth.prototype.toHeader = function(oauth_data) {
    var sorted = this.sortObject(oauth_data);

    var header_value = 'OAuth ';

    if (this.realm) {
        header_value += 'realm="' + this.realm + '"' + this.parameter_seperator;
    }

    for(var i = 0; i < sorted.length; i++) {
        if (sorted[i].key.indexOf('oauth_') !== 0)
            continue;

        header_value += this.percentEncode(sorted[i].key) + '="' + this.percentEncode(sorted[i].value) + '"' + this.parameter_seperator;
    }

    return {
        Authorization: header_value.substr(0, header_value.length - this.parameter_seperator.length) //cut the last chars
    };
};

/**
 * Create a random word characters string with input length
 * @return {String} a random word characters string
 */
OAuth.prototype.getNonce = function() {
    var word_characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var result = '';

    for(var i = 0; i < this.nonce_length; i++) {
        result += word_characters[parseInt(Math.random() * word_characters.length, 10)];
    }

    return result;
};

/**
 * Get Current Unix TimeStamp
 * @return {Int} current unix timestamp
 */
OAuth.prototype.getTimeStamp = function() {
    return parseInt(new Date().getTime()/1000, 10);
};

////////////////////// HELPER FUNCTIONS //////////////////////

/**
 * Merge object
 * @param  {Object} obj1
 * @param  {Object} obj2
 * @return {Object}
 */
OAuth.prototype.mergeObject = function(obj1, obj2) {
    obj1 = obj1 || {};
    obj2 = obj2 || {};

    var merged_obj = obj1;
    for(var key in obj2) {
        merged_obj[key] = obj2[key];
    }
    return merged_obj;
};

/**
 * Sort object by key
 * @param  {Object} data
 * @return {Array} sorted array
 */
OAuth.prototype.sortObject = function(data) {
    var keys = Object.keys(data);
    var result = [];

    keys.sort();

    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        result.push({
            key: key,
            value: data[key],
        });
    }

    return result;
};


/***/ }),

/***/ 37:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SendSentence_vue_vue_type_style_index_0_id_a19e4cca_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(34);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SendSentence_vue_vue_type_style_index_0_id_a19e4cca_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SendSentence_vue_vue_type_style_index_0_id_a19e4cca_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SendSentence_vue_vue_type_style_index_0_id_a19e4cca_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SendSentence_vue_vue_type_style_index_0_id_a19e4cca_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 38:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".sentence-box[data-v-a19e4cca]{width:calc(100% - 40px);height:150px;display:flex;flex-direction:column;align-items:center;transition:.5s;padding-top:20px;overflow:hidden}.sentence-box h3[data-v-a19e4cca]{margin:10px auto}.sentence-box textarea[data-v-a19e4cca]{resize:none;width:calc(80% - 40px);height:30px;padding:20px;outline:none;border-color:rgba(0,0,0,.15);border-width:2px;border-radius:10px}.sentence-box button[data-v-a19e4cca]{width:80px;height:30px;margin-top:10px;border:1px solid rgba(0,0,0,.3);border-radius:5px;background:none;transition:.5s;cursor:pointer}.sentence-box button[data-v-a19e4cca]:hover{background-color:#77d;border:1px solid #0000c8;color:#fff}.held .button[data-v-a19e4cca]{color:#fff;border:1px solid #fff}.boxHeightInPosts[data-v-a19e4cca]{height:114px}.v-enter[data-v-a19e4cca]{opacity:0;height:0;padding-top:0}.v-enter-to[data-v-a19e4cca]{opacity:1;height:150px;padding-top:20px}.v-enter-active[data-v-a19e4cca]{transition:.5s}.v-leave[data-v-a19e4cca]{opacity:1;padding-top:20px}.v-leave-to[data-v-a19e4cca]{opacity:0;height:0;padding-top:0}.v-leave-active[data-v-a19e4cca]{transition:.5s}@media (max-width:520px){.sentence-box[data-v-a19e4cca]{width:100%;padding-top:10px}.sentence-box h3[data-v-a19e4cca]{font-size:1em}.sentence-box textarea[data-v-a19e4cca]{width:calc(90% - 40px);padding:10px}.boxHeightInPosts[data-v-a19e4cca]{height:94px}.v-enter[data-v-a19e4cca]{opacity:0;height:0;padding-top:0}.v-enter-to[data-v-a19e4cca]{opacity:1;padding-top:10px;height:150px}.v-enter-active[data-v-a19e4cca]{transition:.5s}.v-leave[data-v-a19e4cca]{opacity:1;padding-top:10px;height:150px}.v-leave-to[data-v-a19e4cca]{opacity:0;height:0;padding-top:0}.v-leave-active[data-v-a19e4cca]{transition:opacity .1s,padding-top .5s,height .5s}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 39:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(46);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(7).default
module.exports.__inject__ = function (context) {
  add("70f4ca3b", content, true, context)
};

/***/ }),

/***/ 40:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (url, options) {
  if (!options) {
    // eslint-disable-next-line no-param-reassign
    options = {};
  } // eslint-disable-next-line no-underscore-dangle, no-param-reassign


  url = url && url.__esModule ? url.default : url;

  if (typeof url !== 'string') {
    return url;
  } // If url is already wrapped in quotes, remove them


  if (/^['"].*['"]$/.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = url.slice(1, -1);
  }

  if (options.hash) {
    // eslint-disable-next-line no-param-reassign
    url += options.hash;
  } // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls


  if (/["'() \t\n]/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, '\\n'), "\"");
  }

  return url;
};

/***/ }),

/***/ 41:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "fonts/azuki.8e71322.ttf";

/***/ }),

/***/ 44:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(53);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(7).default
module.exports.__inject__ = function (context) {
  add("5cdedf14", content, true, context)
};

/***/ }),

/***/ 45:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilteredPost_vue_vue_type_style_index_0_id_5a13a97d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilteredPost_vue_vue_type_style_index_0_id_5a13a97d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilteredPost_vue_vue_type_style_index_0_id_5a13a97d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilteredPost_vue_vue_type_style_index_0_id_5a13a97d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FilteredPost_vue_vue_type_style_index_0_id_5a13a97d_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 46:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
var ___CSS_LOADER_GET_URL_IMPORT___ = __webpack_require__(40);
var ___CSS_LOADER_URL_IMPORT_0___ = __webpack_require__(41);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@font-face{font-family:\"azuki\";src:url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"truetype\")}*[data-v-5a13a97d]{font-family:azuki}* #send-sentence[data-v-5a13a97d]{width:100%;margin-top:90px}* ul[data-v-5a13a97d]{width:80%;margin:0 auto}* ul li[data-v-5a13a97d]{display:flex;flex-direction:column;align-items:center;margin:30px 0;padding:5% 10%;box-shadow:0 0 5px 5px rgba(0,0,0,.1);word-wrap:break-word}* ul li .primary-post[data-v-5a13a97d]{width:80%;text-align:center;margin:5px auto}* ul li .primary-post .created-at[data-v-5a13a97d]{width:100px;padding:5px 10px;margin:10px;border:2px solid rgba(67,134,135,.7);background-color:#75b8b9;color:#fff;border-radius:5px}* ul li .primary-post .card-button[data-v-5a13a97d]{transition:.5s;cursor:pointer}* ul li .primary-post .card-button[data-v-5a13a97d]:hover{opacity:.7}* ul li canvas[data-v-5a13a97d]{width:100%;border-radius:10px}* ul li canvas div[data-v-5a13a97d]{width:90%;text-align:center;margin:5px auto}* ul li p[data-v-5a13a97d]{margin:20px 0}* ul li .secondary-post[data-v-5a13a97d]{width:60%;text-align:center}* .spinner[data-v-5a13a97d]{-webkit-animation:spinner-data-v-5a13a97d 1s ease infinite;animation:spinner-data-v-5a13a97d 1s ease infinite}@-webkit-keyframes spinner-data-v-5a13a97d{0%{opacity:1}50%{opacity:0}to{opacity:1}}@keyframes spinner-data-v-5a13a97d{0%{opacity:1}50%{opacity:0}to{opacity:1}}* .no-more[data-v-5a13a97d],* .no-results[data-v-5a13a97d],* .spinner[data-v-5a13a97d]{margin:30px auto}@media (max-width:520px){.send-sentence[data-v-5a13a97d],ul[data-v-5a13a97d]{width:100%}ul h2[data-v-5a13a97d]{font-size:1.6em;margin:20px 10px 10px}ul li[data-v-5a13a97d]{width:100%;padding:20px 0}ul li .primary-post[data-v-5a13a97d]{width:90%}ul li .secondary-post[data-v-5a13a97d]{width:75%}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 47:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/FilteredPost.vue?vue&type=template&id=5a13a97d&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"app"},[_c('SendSentence',{attrs:{"mode":_vm.modeQuestion,"id":"send-sentence","show":true}}),_vm._ssrNode(" "),_vm._ssrNode("<ul data-v-5a13a97d>","</ul>",[_vm._ssrNode("<h2 data-v-5a13a97d>"+_vm._ssrEscape("「 "+_vm._s(this.title)+" 」の検索結果")+"</h2> <p"+(_vm._ssrStyle(null,null, { display: (!_vm.posts) ? '' : 'none' }))+" data-v-5a13a97d>合致する質問は見つかりませんでした。</p> "),_vm._l((_vm.posts),function(post){return _vm._ssrNode("<li data-v-5a13a97d>","</li>",[_vm._ssrNode("<div class=\"primary-post\" data-v-5a13a97d><p class=\"created-at\" data-v-5a13a97d>"+_vm._ssrEscape(_vm._s(post.createdAt.substr(0,10)))+"</p> <div class=\"card-button\" data-v-5a13a97d><canvas"+(_vm._ssrAttr("id",post.id + '1'))+" data-v-5a13a97d></canvas></div> <p data-v-5a13a97d>"+(_vm._s(post.answer))+"</p></div> "+(_vm._ssrList((post.replies),function(reply){return ("<div class=\"secondary-post\" data-v-5a13a97d><canvas"+(_vm._ssrAttr("id",reply.id + '1'))+" data-v-5a13a97d></canvas> <p data-v-5a13a97d>"+(_vm._s(reply.replyAnswer))+"</p></div>")}))+" "),_c('SendSentence',{attrs:{"mode":_vm.modeReply,"contentId":post.id,"show":true}})],2)})],2),_vm._ssrNode(" "),_c('infinite-loading',{on:{"infinite":_vm.loadNewPost}},[_c('div',{staticClass:"spinner",attrs:{"slot":"spinner"},slot:"spinner"},[_vm._v("読み込んでいます...")]),_vm._v(" "),_c('div',{staticClass:"no-more",attrs:{"slot":"no-more"},slot:"no-more"},[_vm._v("条件に合致した質問は以上です。")]),_vm._v(" "),_c('div',{staticClass:"no-results",attrs:{"slot":"no-results"},slot:"no-results"},[_vm._v("条件に合致した質問は見つかりませんでした。")]),_vm._v(" "),_c('div',{staticClass:"no-results",attrs:{"slot":"error"},slot:"error"},[_vm._v("エラーが発生しました。")])])],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/FilteredPost.vue?vue&type=template&id=5a13a97d&scoped=true&

// EXTERNAL MODULE: ./plugins/common.js
var common = __webpack_require__(8);

// EXTERNAL MODULE: ./components/shared/SendSentence.vue + 4 modules
var SendSentence = __webpack_require__(35);

// EXTERNAL MODULE: external "vue-infinite-loading"
var external_vue_infinite_loading_ = __webpack_require__(30);
var external_vue_infinite_loading_default = /*#__PURE__*/__webpack_require__.n(external_vue_infinite_loading_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/FilteredPost.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var FilteredPostvue_type_script_lang_js_ = ({
  components: {
    SendSentence: SendSentence["default"],
    InfiniteLoading: external_vue_infinite_loading_default.a
  },

  data() {
    return {
      MICROCMS_KEY: '',
      qWord: '',
      posts: [],
      modeQuestion: 'question',
      modeReply: 'reply',
      canvas: null,
      ctx: null,
      image: null,
      postCount: 5,
      state: null,
      title: ''
    };
  },

  methods: {
    transition(id) {
      this.$router.push({
        path: id
      });
    },

    async loadNewPost($state) {
      this.state = $state;
      const loadPostNumber = 10;
      await this.$axios.$get('https://q-box.microcms.io/api/v1/q_box_posts?filters=answer[exists][and]question[contains]' + this.qWord + '&limit=' + loadPostNumber + '&offset=' + this.postCount, {
        headers: {
          'X-MICROCMS-API-KEY': this.MICROCMS_KEY
        }
      }).then(response => {
        if (this.postCount < response.totalCount) {
          common["a" /* default */].modifyUrlInPost(response.contents, 'answer');
          this.posts = this.posts.concat(response.contents);
          common["a" /* default */].generateImage(document, response.contents, 'question', '1');
          this.setReply();
          this.postCount += response.contents.length;
          $state.loaded();
        } else if (this.postCount >= response.totalCount) {
          this.postCount = 1;
          $state.complete();
        }
      }).catch(error => {
        $state.error();
        alert('通信に失敗しました。：' + error);
        console.log(error);
      });
    },

    async getPost(word) {
      this.qWord = word;

      if (this.state) {
        this.state.reset();
      }

      this.setTitle(word);
      await this.$axios.$get('https://q-box.microcms.io/api/v1/q_box_posts?filters=answer[exists][and]question[contains]' + word + '&limit=5', {
        headers: {
          'X-MICROCMS-API-KEY': this.MICROCMS_KEY
        }
      }).then(response => {
        this.posts = response.contents;
        common["a" /* default */].generateImage(document, response.contents, 'question', '1');
        this.setReply();
        common["a" /* default */].modifyUrlInPost(this.posts, 'answer');
      });
    },

    setTitle(word) {
      this.title = word;
    },

    async setReply() {
      if (this.posts) {
        for (const post of this.posts) {
          await this.$axios.$get('https://q-box.microcms.io/api/v1/q_box_replies?filters=replyFor[equals]' + post.id + '[and]replyAnswer[exists]&orders=createdAt', {
            headers: {
              'X-MICROCMS-API-KEY': this.MICROCMS_KEY
            }
          }).then(response => {
            common["a" /* default */].generateImage(document, response.contents, 'replySentence', '1');
            this.$set(post, 'replies', response.contents);
            common["a" /* default */].modifyUrlInPost(post.replies, 'replyAnswer');
          }).catch(error => {
            // alert('通信に失敗しました。：' + error)
            console.log(error);
          });
        }
      }
    }

  },

  mounted() {
    this.MICROCMS_KEY = "f999ee3a5b064d859ee8072912dd0265ab9f";
  }

});
// CONCATENATED MODULE: ./components/FilteredPost.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FilteredPostvue_type_script_lang_js_ = (FilteredPostvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/FilteredPost.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(45)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_FilteredPostvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "5a13a97d",
  "41c31070"
  
)

/* harmony default export */ var FilteredPost = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 52:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewPost_vue_vue_type_style_index_0_id_1429837f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewPost_vue_vue_type_style_index_0_id_1429837f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewPost_vue_vue_type_style_index_0_id_1429837f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewPost_vue_vue_type_style_index_0_id_1429837f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_NewPost_vue_vue_type_style_index_0_id_1429837f_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 53:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, ".send-sentence[data-v-1429837f]{margin:70px auto 0;width:60%;transition:0s}h2[data-v-1429837f]{margin:30px 0;font-size:2.2em}ul[data-v-1429837f]{width:60%;margin:0 auto}ul li[data-v-1429837f]{display:flex;flex-direction:column;align-items:center;margin-bottom:30px;padding:5%;box-shadow:0 0 5px 5px rgba(0,0,0,.1)}ul li canvas[data-v-1429837f]{width:100%;border-radius:10px}ul li p[data-v-1429837f]{white-space:pre-line;word-wrap:break-word}ul li .primary-post[data-v-1429837f]{width:80%;text-align:center;margin:5px auto}ul li .primary-post .card-button[data-v-1429837f]{transition:.5s;cursor:pointer}ul li .primary-post .card-button[data-v-1429837f]:hover{opacity:.7}ul li .primary-post .answer[data-v-1429837f]{width:80%;margin:10px auto}ul li .primary-post .created-at[data-v-1429837f]{width:100px;padding:5px 10px;margin:10px;border-radius:5px;border:2px solid rgba(67,134,135,.7);background-color:#75b8b9;color:#fff}ul li .secondary-post[data-v-1429837f]{width:60%;text-align:center;margin:5px auto}ul li .secondary-post p[data-v-1429837f]{width:80%;margin:10px auto}.spinner[data-v-1429837f]{-webkit-animation:spinner-data-v-1429837f 1s ease infinite;animation:spinner-data-v-1429837f 1s ease infinite}@-webkit-keyframes spinner-data-v-1429837f{0%{opacity:1}50%{opacity:0}to{opacity:1}}@keyframes spinner-data-v-1429837f{0%{opacity:1}50%{opacity:0}to{opacity:1}}.no-more[data-v-1429837f],.no-results[data-v-1429837f],.spinner[data-v-1429837f]{margin:30px auto}@media (max-width:1024px){ul[data-v-1429837f]{width:100%}}@media (max-width:520px){.send-sentence[data-v-1429837f]{width:100%;margin:0!important}ul[data-v-1429837f]{width:100%}ul h2[data-v-1429837f]{font-size:1.6em;margin:0 10px 10px}ul li[data-v-1429837f]{width:100%;padding:20px 0}ul li .primary-post[data-v-1429837f]{width:90%}ul li .secondary-post[data-v-1429837f]{width:75%}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 56:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/NewPost.vue?vue&type=template&id=1429837f&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"app"},[_c('SendSentence',{staticClass:"send-sentence",attrs:{"mode":_vm.modeQuestion,"show":true,"MICROCMS_KEY":_vm.MICROCMS_KEY}}),_vm._ssrNode(" "),_vm._ssrNode("<ul data-v-1429837f>","</ul>",[_vm._ssrNode("<h2 data-v-1429837f>最新の質問</h2> <p"+(_vm._ssrStyle(null,null, { display: (!_vm.posts[0]) ? '' : 'none' }))+" data-v-1429837f>質問はありません</p> "),_vm._l((_vm.posts),function(post){return _vm._ssrNode("<li data-v-1429837f>","</li>",[_vm._ssrNode("<div class=\"primary-post\" data-v-1429837f><p class=\"created-at\" data-v-1429837f>"+_vm._ssrEscape(_vm._s(post.createdAt.substr(0,10)))+"</p> <div class=\"card-button\" data-v-1429837f><canvas"+(_vm._ssrAttr("id",post.id))+" data-v-1429837f></canvas></div> <p class=\"answer\" data-v-1429837f>"+(_vm._s(post.answer))+"</p></div> "+(_vm._ssrList((post.replies),function(reply){return ("<div class=\"secondary-post\" data-v-1429837f><canvas"+(_vm._ssrAttr("id",reply.id))+" data-v-1429837f></canvas> <p data-v-1429837f>"+(_vm._s(reply.replyAnswer))+"</p></div>")}))+" "),_c('SendSentence',{attrs:{"mode":_vm.modeReply,"contentId":post.id,"show":true,"MICROCMS_KEY":_vm.MICROCMS_KEY}})],2)})],2),_vm._ssrNode(" "),_c('infinite-loading',{on:{"infinite":_vm.loadNewPost}},[_c('div',{staticClass:"spinner",attrs:{"slot":"spinner"},slot:"spinner"},[_vm._v("読み込んでいます...")]),_vm._v(" "),_c('div',{staticClass:"no-more",attrs:{"slot":"no-more"},slot:"no-more"},[_vm._v("条件に合致した質問は以上です。")]),_vm._v(" "),_c('div',{staticClass:"no-results",attrs:{"slot":"no-results"},slot:"no-results"},[_vm._v("条件に合致した質問は見つかりませんでした。")]),_vm._v(" "),_c('div',{staticClass:"no-results",attrs:{"slot":"error"},slot:"error"},[_vm._v("エラーが発生しました。")])])],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./components/NewPost.vue?vue&type=template&id=1429837f&scoped=true&

// EXTERNAL MODULE: ./components/shared/SendSentence.vue + 4 modules
var SendSentence = __webpack_require__(35);

// EXTERNAL MODULE: ./plugins/common.js
var common = __webpack_require__(8);

// EXTERNAL MODULE: external "vue-infinite-loading"
var external_vue_infinite_loading_ = __webpack_require__(30);
var external_vue_infinite_loading_default = /*#__PURE__*/__webpack_require__.n(external_vue_infinite_loading_);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./components/NewPost.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var NewPostvue_type_script_lang_js_ = ({
  components: {
    SendSentence: SendSentence["default"],
    InfiniteLoading: external_vue_infinite_loading_default.a
  },

  data() {
    return {
      MICROCMS_KEY: '',
      posts: [],
      modeQuestion: 'question',
      modeReply: 'reply',
      postCount: 0
    };
  },

  methods: {
    transition(id) {
      this.$router.push({
        path: id
      });
    },

    async setReply() {
      if (this.posts) {
        for (const post of this.posts) {
          await this.$axios.$get('https://q-box.microcms.io/api/v1/q_box_replies?filters=replyFor[equals]' + post.id + '[and]replyAnswer[exists]&orders=createdAt', {
            headers: {
              'X-MICROCMS-API-KEY': this.MICROCMS_KEY
            }
          }).then(response => {
            common["a" /* default */].generateImage(document, response.contents, 'replySentence', '');
            this.$set(post, 'replies', response.contents);
            common["a" /* default */].modifyUrlInPost(post.replies, 'replyAnswer');
          }).catch(error => {
            // alert('通信に失敗しました。：' + error)
            console.log(error);
          });
        }
      }
    },

    async loadNewPost($state) {
      const loadPostNumber = 10;
      await this.$axios.$get('https://q-box.microcms.io/api/v1/q_box_posts?filters=answer[exists]&limit=' + loadPostNumber + '&offset=' + this.postCount, {
        headers: {
          'X-MICROCMS-API-KEY': this.MICROCMS_KEY
        }
      }).then(response => {
        if (this.postCount < response.totalCount) {
          common["a" /* default */].modifyUrlInPost(response.contents, 'answer');
          this.posts = this.posts.concat(response.contents);
          common["a" /* default */].generateImage(document, response.contents, 'question', '');
          this.setReply();
          this.postCount += response.contents.length;
          $state.loaded();
        } else {
          $state.complete();
        }
      }).catch(error => {
        $state.error();
        alert('通信に失敗しました。：' + error);
        console.log(error);
      });
    }

  },

  async created() {
    this.MICROCMS_KEY = "f999ee3a5b064d859ee8072912dd0265ab9f";
  }

});
// CONCATENATED MODULE: ./components/NewPost.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_NewPostvue_type_script_lang_js_ = (NewPostvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./components/NewPost.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(52)
if (style0.__inject__) style0.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  components_NewPostvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "1429837f",
  "4d870e57"
  
)

/* harmony default export */ var NewPost = __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ 58:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(64);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(7).default
module.exports.__inject__ = function (context) {
  add("1b7833da", content, true, context)
};

/***/ }),

/***/ 59:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(66);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add CSS to SSR context
var add = __webpack_require__(7).default
module.exports.__inject__ = function (context) {
  add("e4e622fe", content, true, context)
};

/***/ }),

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(58);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_3_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_3_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_3_oneOf_1_2_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
var ___CSS_LOADER_GET_URL_IMPORT___ = __webpack_require__(40);
var ___CSS_LOADER_URL_IMPORT_0___ = __webpack_require__(41);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = ___CSS_LOADER_GET_URL_IMPORT___(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "@font-face{font-family:\"azuki\";src:url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") format(\"truetype\")}*{font-family:azuki;margin:0;padding:0}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 65:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_f78bd6dc_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(59);
/* harmony import */ var _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_f78bd6dc_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_f78bd6dc_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_f78bd6dc_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__) if(["default"].indexOf(__WEBPACK_IMPORT_KEY__) < 0) (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_vue_style_loader_index_js_ref_7_oneOf_1_0_node_modules_css_loader_dist_cjs_js_ref_7_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_oneOf_1_2_node_modules_sass_loader_dist_cjs_js_ref_7_oneOf_1_3_node_modules_nuxt_components_dist_loader_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_1_id_f78bd6dc_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));


/***/ }),

/***/ 66:
/***/ (function(module, exports, __webpack_require__) {

// Imports
var ___CSS_LOADER_API_IMPORT___ = __webpack_require__(6);
var ___CSS_LOADER_EXPORT___ = ___CSS_LOADER_API_IMPORT___(false);
// Module
___CSS_LOADER_EXPORT___.push([module.i, "header[data-v-f78bd6dc]{width:100%;height:70px;position:fixed;top:0;display:flex;justify-content:space-between;align-items:center;box-shadow:0 0 10px 5px rgba(0,0,0,.2);background-color:#fff;z-index:1000}header h1[data-v-f78bd6dc]{z-index:100;cursor:pointer}header .nuxt-link[data-v-f78bd6dc]{z-index:100;width:20%;height:100%;background-color:rgba(0,0,0,.1);display:flex;align-items:center;justify-content:center;color:#333;text-decoration:none;text-align:center;transition:.5s}header .nuxt-link[data-v-f78bd6dc]:hover{background-color:#303030;color:#fff}header input[data-v-f78bd6dc]{z-index:100;padding-left:10px;width:calc(20% - 10px);height:100%;background-color:rgba(0,0,0,.1);border:none;outline:none;font-size:1.2em;transition:.5s}header input[data-v-f78bd6dc]:focus{background-color:#303030;color:#fff}header .often-search-word-box[data-v-f78bd6dc]{transform-origin:center center;position:absolute;z-index:0;background-color:rgba(0,0,0,.8);top:100%;left:0;width:100%;max-height:200px;padding:10px;overflow:scroll;box-shadow:0 10px 10px 1px rgba(0,0,0,.2)}header .often-search-word-box h3[data-v-f78bd6dc]{margin:10px;color:#fff}header .often-search-word-box ul[data-v-f78bd6dc]{display:flex;flex-wrap:wrap;width:100%}header .often-search-word-box ul li[data-v-f78bd6dc]{list-style:none;width:11%;height:40px;display:flex;justify-content:center;align-items:center;border:1px solid #fff;color:#fff;border-radius:5px;margin:0 calc(.75% - 2.25px) 10px;cursor:pointer;transition:.5s;overflow:hidden}header .often-search-word-box ul li[data-v-f78bd6dc]:hover{background-color:#303030;color:#fff}.filtered-post[data-v-f78bd6dc],.new-post[data-v-f78bd6dc]{margin-top:70px}.v-enter[data-v-f78bd6dc]{opacity:0;transform:scale(90%)}.v-enter-to[data-v-f78bd6dc]{opacity:1;transform:scale(100%)}.v-enter-active[data-v-f78bd6dc]{transition:.2s}.v-leave[data-v-f78bd6dc]{opacity:1;transform:scale(100%)}.v-leave-to[data-v-f78bd6dc]{opacity:0;transform:scale(90%)}.v-leave-active[data-v-f78bd6dc]{transition:.2s}.chevron-up[data-v-f78bd6dc]{display:none}@media (max-width:520px){header[data-v-f78bd6dc]{height:60px}header h1[data-v-f78bd6dc]{display:none}header .nuxt-link[data-v-f78bd6dc]{width:50%}header input[data-v-f78bd6dc]{border-left:1px solid #303030;width:50%;padding-left:0;text-align:center}header .often-search-word-box[data-v-f78bd6dc]{padding:10px 5px 0}header .often-search-word-box ul li[data-v-f78bd6dc]{width:30%;margin:0 calc(1.66667% - 2.66667px) 10px}.chevron-up[data-v-f78bd6dc]{position:fixed;bottom:40px;right:30px;width:70px;height:70px;display:flex;justify-content:center;align-items:center;border-radius:50%;border:2px solid #fff;background-color:rgba(0,0,0,.6);color:#fff;font-size:2.2em}}", ""]);
// Exports
module.exports = ___CSS_LOADER_EXPORT___;


/***/ }),

/***/ 70:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=template&id=f78bd6dc&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"app"}},[_vm._ssrNode("<header data-v-f78bd6dc>","</header>",[_c('nuxt-link',{staticClass:"nuxt-link",attrs:{"to":"/answer"}},[_vm._v("管理者画面に移動する")]),_vm._ssrNode(" "),_c('h1',{directives:[{name:"scroll-to",rawName:"v-scroll-to",value:({
      element: '#app',
      offset: -200,
      duration: 500
    }),expression:"{\n      element: '#app',\n      offset: -200,\n      duration: 500\n    }"}]},[_vm._ssrNode("お手サーの質問箱")]),_vm._ssrNode(" <input id=\"search-input\" type=\"text\" autocomplete=\"off\" placeholder=\"語句で検索\""+(_vm._ssrAttr("value",(_vm.qWord)))+" data-v-f78bd6dc> "),_c('transition',[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.showSearchWord && !_vm.qWord),expression:"showSearchWord && !qWord"}],staticClass:"often-search-word-box"},[_c('h3',[_vm._v("良く検索されるワード")]),_vm._v(" "),_c('ul',_vm._l((this.searchWords),function(word){return _c('li',{key:word,on:{"click":function($event){return _vm.inputSearchWord(word)}}},[_vm._v("\n            "+_vm._s(word)+"\n          ")])}),0)])])],2),_vm._ssrNode(" "),_vm._ssrNode("<div data-v-f78bd6dc>","</div>",[_c('NewPost',{directives:[{name:"show",rawName:"v-show",value:(_vm.showNewPost),expression:"showNewPost"}],staticClass:"new-post"}),_vm._ssrNode(" "),_c('FilteredPost',{directives:[{name:"show",rawName:"v-show",value:(_vm.showFilteredPost),expression:"showFilteredPost"}],ref:"FilteredPost",staticClass:"filtered-post"}),_vm._ssrNode(" "),_c('div',{directives:[{name:"scroll-to",rawName:"v-scroll-to",value:({
      element: '#app',
      offset: -200,
      duration: 500
      }),expression:"{\n      element: '#app',\n      offset: -200,\n      duration: 500\n      }"}],staticClass:"chevron-up"},[_c('fa',{attrs:{"icon":_vm.faChevronUp}})],1)],2)],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./pages/index.vue?vue&type=template&id=f78bd6dc&scoped=true&

// EXTERNAL MODULE: ./components/NewPost.vue + 4 modules
var NewPost = __webpack_require__(56);

// EXTERNAL MODULE: ./components/FilteredPost.vue + 4 modules
var FilteredPost = __webpack_require__(47);

// EXTERNAL MODULE: external "@fortawesome/free-solid-svg-icons"
var free_solid_svg_icons_ = __webpack_require__(31);

// EXTERNAL MODULE: external "@fortawesome/free-brands-svg-icons"
var free_brands_svg_icons_ = __webpack_require__(32);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib??ref--2-0!./node_modules/@nuxt/components/dist/loader.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./pages/index.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var lib_vue_loader_options_pagesvue_type_script_lang_js_ = ({
  components: {
    NewPost: NewPost["default"],
    FilteredPost: FilteredPost["default"]
  },

  data() {
    return {
      showNewPost: true,
      showFilteredPost: false,
      qWord: '',
      showSearchWord: false,
      searchWords: ['TOEFL', 'サークル', '般教', '一般教養１', 'バイト', 1, 2, 3, 4, 5, 'アイウエオかきくけこさしすせそたちつてとなにぬねの']
    };
  },

  computed: {
    faChevronUp() {
      return free_solid_svg_icons_["faChevronUp"];
    },

    faTwitter() {
      return free_brands_svg_icons_["faTwitter"];
    }

  },
  methods: {
    searchPost(word) {
      if (word) {
        this.$refs.FilteredPost.getPost(word);
        this.changeShowMode();
      }
    },

    changeShowMode() {
      this.showNewPost = false;
      this.showFilteredPost = true;
    },

    toggleSearchWord(boolean) {
      this.showSearchWord = boolean;
    },

    inputSearchWord(word) {
      this.searchPost(word);
      this.toggleSearchWord(false);
    }

  }
});
// CONCATENATED MODULE: ./pages/index.vue?vue&type=script&lang=js&
 /* harmony default export */ var pagesvue_type_script_lang_js_ = (lib_vue_loader_options_pagesvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(2);

// CONCATENATED MODULE: ./pages/index.vue



function injectStyles (context) {
  
  var style0 = __webpack_require__(63)
if (style0.__inject__) style0.__inject__(context)
var style1 = __webpack_require__(65)
if (style1.__inject__) style1.__inject__(context)

}

/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  pagesvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  injectStyles,
  "f78bd6dc",
  "245b6c32"
  
)

/* harmony default export */ var pages = __webpack_exports__["default"] = (component.exports);

/* nuxt-component-imports */
installComponents(component, {NewPost: __webpack_require__(56).default,FilteredPost: __webpack_require__(47).default})


/***/ })

};;
//# sourceMappingURL=index.js.map