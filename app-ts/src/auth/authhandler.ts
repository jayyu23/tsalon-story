import axios from "axios";
import endpoints from "./endpoints";

// Tracks the session storage and the auth state of the user.
class AuthHandler {
    nonce: string;

    constructor() {
        this.nonce = "";
    }

    getNonce() {
        return this.nonce;
    }

    async login(address: string, signedMessage: string) {
        console.log("Login called");
        // assume connect called. this can be a wallet switch. Requests the nonce ONLY.
        if (this.isLoggedIn()) {
            this.logout();
        }

        try {
            // // Send request to server endpoint to get nonce. Write SessionStorage
            // const response = await axios.post(endpoints.getNonceAPI(), { address });
            // const nonce = response.data.nonce;
            // this.nonce = nonce;
            // console.log("Nonce: ", nonce);

            // const signMessageVariables = { message: this.nonce };
            // const signMessageOptions = {
            //   onSettled: (data: string, error: Error) => {
            //     if (error) {
            //       console.error('Sign message settled with error:', error);
            //       throw error;
            //     }
            //   },
            // };
            // const signedMessage = await signMessageAsync(signMessageVariables, signMessageOptions);
            await axios.post(endpoints.getSignInAPI(), { address, signature: signedMessage }).then(
                (acc) => {
                    console.log("Authhandler Login successful");
                    sessionStorage.setItem("address", address);
                    sessionStorage.setItem("t", acc.data.token); // JWT Session Token
                },
                (rej) => {
                    throw rej;
                }
            );

        } catch (error) {
            this.logout();
            console.log("Login failed:", error);
            throw error;
        }
    }

    logout() {
        // Assume that disconnect already called.
        console.log("Logout called");
        sessionStorage.clear();
    }

    isLoggedIn() {
        return sessionStorage.getItem("t") ? true : false;
    }

    getWalletAddress() {
        return sessionStorage.getItem("address") ? sessionStorage.getItem("address") : "";
    }

    // getUsernameLink() {
    //     let username = instance.getUsername();
    //     if (username) {
    //         return username.replace(/ /g, "_").toLowerCase();
    //     } else {
    //         return "";
    //     }
    // }

    getPostAuthData() {
        // Assume that have the Session Storage Data
        const token = sessionStorage.getItem("t");
        let body = {
            walletAddress: sessionStorage.getItem("address"),
            // username: sessionStorage.getItem("username"),
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
                    // this.logout();
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
