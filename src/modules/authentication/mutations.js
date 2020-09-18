export function setUser(state) {
  state.isLogged = true;
  state.error = false;
  state.errorMessage = "";
}

export function logOut(state) {
  state.isLogged = false;
}

export function authError(state) {
  state.isLogged = false;
}
