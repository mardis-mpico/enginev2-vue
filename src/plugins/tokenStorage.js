import LocalStorageService from "@/plugins/LocalStorageService";
import store from "../store";
const jwt = require("jsonwebtoken");

const localStorageService = LocalStorageService.getService();
const token = localStorageService.getAccessToken();

if (token) {
  const decodedToken = jwt.decode(token, { complete: true });

  const user = {
    idUser: decodedToken.payload.IdUser,
    name: decodedToken.payload.name,
    email: decodedToken.payload.email,
    idAccount: decodedToken.payload.idAccount,
    idProfile: decodedToken.payload.idprofile,
    type: decodedToken.payload.idtype,
    role: decodedToken.payload.rolename,
  };

  store.state.user = user;
}
