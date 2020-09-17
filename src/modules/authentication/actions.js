import { http } from "@/plugins/axios";
import LocalStorageService from "@/plugins/LocalStorageService";
// LocalstorageService
const localStorageService = LocalStorageService.getService();
const jwt = require("jsonwebtoken");

export async function signIn(context, user) {
  try {
    context.commit("setLoading", true, { root: true });
    const response = await http.post(`/Login/AuthEngineV2`, user);
    localStorageService.setToken(response.token);
    const decodedToken = jwt.decode(response.token, { complete: true });
    const userData = {
      idUser: decodedToken.payload.IdUser,
      name: decodedToken.payload.name,
      email: decodedToken.payload.email,
      idAccount: decodedToken.payload.idAccount,
      idProfile: decodedToken.payload.idprofile,
      type: decodedToken.payload.idtype,
      role: decodedToken.payload.rolename,
    };
    context.commit("setUserData", userData, { root: true });
    context.commit("setUser");
  } catch (e) {
    context.commit("authError");
    context.commit("setError", e.message, { root: true });
  } finally {
    context.commit("setLoading", false, { root: true });
  }
}
