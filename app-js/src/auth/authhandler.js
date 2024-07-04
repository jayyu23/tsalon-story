import axios from "axios";
import endpoints from "./endpoints";

class AuthHandler {
  constructor() {
    this.loggedIn = false;
  }

  getWalletAddress() {
    return sessionStorage.getItem("address");
  }

  getUsername() {
    return sessionStorage.getItem("username");
  }

  getUsernameLink() {
    let username = instance.getUsername();
    if (username) {
      return username.replace(/ /g, "_").toLowerCase();
    } else {
      return "";
    }
  }

  getPostAuthData() {
    // Assume that have the Session Storage Data
    const token = sessionStorage.getItem("t");
    let body = {
      walletAddress: sessionStorage.getItem("address"),
      username: sessionStorage.getItem("username"),
    };
    let config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return { body: body, config: config };
  }

  protectRoute() {
    const token = sessionStorage.getItem("t");
    if (!token) {
      instance.redirectToError();
    } else {
      // ping the auth-checker backend
      const authCheckerAPI = endpoints.getAuthAPI();
      let authData = this.getPostAuthData();
      axios.post(authCheckerAPI, authData.body, authData.config).then(
        (acc) => {
          // All OK
          return;
        },
        (rej) => {
          instance.redirectToError();
        }
      );
    }
  }

  redirectToError() {
    window.location.href = "/error";
  }
}

const instance = new AuthHandler();

export default instance;
