import axios from "axios";
import endpoints from "./endpoints";

// Tracks the session storage and the auth state of the user.
class AuthHandler {
    loggedIn: boolean;
    accountAddress: string | undefined;
    nonce: string;

    constructor() {
        this.loggedIn = false;
        this.accountAddress = undefined;
        this.nonce = "";
    }

    getNonce() {
        return this.nonce;
    }

    async requestSession(address: string) {
        console.log("Login called");
        // assume connect called. this can be a wallet switch. Requests the nonce ONLY.
        if (this.loggedIn) {
            this.logout();
        }

        this.loggedIn = true;
        this.accountAddress = address;
        // Send request to server endpoint to get nonce. Write SessionStorage
        const response = await axios.post(endpoints.getNonceAPI(), { address });
        const nonce = response.data.nonce;
        this.nonce = nonce;
        console.log("Nonce: ", nonce);

        // // Verify signature on server and get auth token
        // const verifyResponse = await axios.post(endpoints.getSignInAPI(), {
        //     address,
        //     nonce,
        //     signature
        // });

        // const { token, username } = verifyResponse.data;

        // // Store auth data in session storage
        // sessionStorage.setItem("address", address);
        // sessionStorage.setItem("username", username);
        // sessionStorage.setItem("t", token);

        this.loggedIn = true;
        this.accountAddress = address;
    }

    logout() {
        // Assume that disconnect already called.
        sessionStorage.clear();
        this.loggedIn = false;
        this.accountAddress = undefined;
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
