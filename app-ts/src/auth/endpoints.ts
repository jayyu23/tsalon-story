import { get } from "lodash";

// One-stop-shop to handle endpoints for API calls.
class EndPoints {
    baseURL: string;
    urlMap: { [key: string]: string; };

    constructor() {
      this.baseURL = process.env.BASE_URL || "https://tsalon.io/api/";
      this.urlMap = {
        signin: "signin",
        auth: "auth",
        pubView: "publication/",
        allPub: "publications",
        drafts: "/drafts",
        createUser: "createUser",
        draftTBSN: "drafts/",
        submitDraft: "submitReview",
        draftSave: "drafts",
        getReview: "getReview",
        getPrice: "price/",
        getCollection: "profile/",
        submitVote: "submitVote",
        messages: "messages/",
        isUserHolder: "userHolder",
        getGreenTokens: "getGreenTokens",
        getNonceAPI: "getNonce",
      };
    }
    
    getNonceAPI() {
      return this.baseURL + this.urlMap.getNonceAPI;
    }

    getSignInAPI() {
      return this.baseURL + this.urlMap.signin;
    }
    getAuthAPI() {
      return this.baseURL + this.urlMap.auth;
    }
    getPublicationAPI(tbsn: string) {
      return this.baseURL + this.urlMap.pubView + tbsn;
    }
    getAllPubAPI() {
      return this.baseURL + this.urlMap.allPub;
    }
    getUserDraftAPI(usernameLink: string) {
      return this.baseURL + usernameLink + this.urlMap.drafts;
    }
    getUserCollectionAPI(username: string) {
      let u = this.getLink(username)
      return this.baseURL + this.urlMap.getCollection + u;
    }
  
    getCreateUserAPI() {
      return this.baseURL + this.urlMap.createUser;
    }
    getDraftAPI(tbsn: string) {
      return this.baseURL + this.urlMap.draftTBSN + tbsn;
    }
    getDraftSubmitAPI() {
      return this.baseURL + this.urlMap.submitDraft;
    }
    getDraftSaveAPI() {
      return this.baseURL + this.urlMap.draftSave;
    }
  
    getReviewAPI() {
      return this.baseURL + this.urlMap.getReview;
    }
    getPriceAPI(tbsn: string) {
      return this.baseURL + this.urlMap.getPrice + tbsn;
    }
  
    getsubmitVoteAPI() {
      return this.baseURL + this.urlMap.submitVote;
    }
  
    getLink(username: string) {
      return username.replace(/ /g, "_").toLowerCase();
    }
  
    getMessagesAPI(username: string) {
      return this.baseURL + this.urlMap.messages + this.getLink(username)
    }
    getUserHolderAPI() {
      return this.baseURL + this.urlMap.isUserHolder;
    }
    getGreenTokensAPI() {
      return this.baseURL + this.urlMap.getGreenTokens;
    }
  }
  
  const endpoints = new EndPoints();
  export default endpoints;
  