import axios from "axios";
import LocalStorageService from "./LocalStorageService";
//import router from "../router";
import qs from "qs";

// LocalstorageService
const localStorageService = LocalStorageService.getService();
//let BASE_URL = `https://dyvenpro.azurewebsites.net/api`;
let BASE_URL = `http://localhost:15953/api`;
//let BASE_URL = `https://mardisservice.azurewebsites.net/api`;
//let BASE_URL = `https://odkdyvenpro.azurewebsites.net/api`;

let instance = axios.create({
  baseURL: BASE_URL,
  paramsSerializer: function(params) {
    return qs.stringify(params, { indices: false });
  },
});

/**
 *
 * parse error response
 */
function parseError(messages) {
  // error
  if (messages) {
    if (messages instanceof Array) {
      return Promise.reject({ messages: messages });
    } else {
      return Promise.reject({ messages: [messages] });
    }
  } else {
    return Promise.reject({ messages: ["No se puedo completar la peticion"] });
  }
}

/**
 * parse response
 */
function parseBody(response) {
  //  if (response.status === 200 && response.data.status.code === 200) { // - if use custom status code
  if (response.status === 200) {
    return response.data;
  } else {
    return this.parseError(response.data.messages);
  }
}

// request header
instance.interceptors.request.use(
  (config) => {
    const token = localStorageService.getAccessToken();

    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response parse
instance.interceptors.response.use(
  (response) => {
    return parseBody(response);
  },
  (error) => {
    // return Promise.reject(error)
    if (error.response.status === 401) {
      localStorageService.clearToken();
      window.location.reload();
      return parseError(error.response.data);
    } else if (error.response) {
      return parseError(error.response.data);
    } else {
      return Promise.reject(error);
    }
  }
);

export const http = instance;
