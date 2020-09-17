import SecureStorage from 'secure-web-storage';

const CryptoJS = require("crypto-js");

let READ_SECRET_KEY="key-to-read-local4528200995";

const secureStorage = new SecureStorage(localStorage, {
  hash: function hash(key) {
    key = CryptoJS.SHA256(key, READ_SECRET_KEY);

    return key.toString();
  },
  encrypt: function encrypt(data) {
    data = CryptoJS.AES.encrypt(data, READ_SECRET_KEY);

    data = data.toString();

    return data;
  },
  decrypt: function decrypt(data) {
    data = CryptoJS.AES.decrypt(data, READ_SECRET_KEY);

    data = data.toString(CryptoJS.enc.Utf8);

    return data;
  },
});

const LocalStorageService = (function() {
  var _service;
  function _getService() {
    if (!_service) {
      _service = this;
      return _service;
    }
    return _service;
  }
  function _setToken(tokenObj) {
    secureStorage.setItem("access_token", tokenObj);
  }
  function _getAccessToken() {
    return secureStorage.getItem("access_token");
  }
  function _clearToken() {
    secureStorage.clear();
  }
  return {
    getService: _getService,
    setToken: _setToken,
    getAccessToken: _getAccessToken,
    clearToken: _clearToken,
  };
})();

export default LocalStorageService;
