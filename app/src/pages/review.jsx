import React, { useState, useEffect } from "react";
import axios from "axios";
import auth from "../auth/authhandler";
import NavBar from "../components/navbar";
import Sidebar from "../components/sidebar";
import TBookView from "../components/tbookview";
import endpoints from "../auth/endpoints";
import { extend } from "lodash";
import MemberOnly from "../components/memberonly";

function ReviewPage(props) {
  auth.protectRoute();

  const emptyReviewHTML = (
    <div
      className="card mx-3 w-100 h-auto px-4 py-auto mx-4"
      style={{ minHeight: window.innerHeight }}
    >
      <div
        className="text-center justify-content-center h3"
        style={{ marginTop: "30%" }}
      >
        Nothing to Review!
      </div>
    </div>
  );

  const [reviewDraft, setReviewDraft] = useState(null);
  const [votesLeft, setVotesLeft] = useState(0);
  const [reviewHTML, setReviewHTML] = useState(emptyReviewHTML);
  const [voteThreshold, setVoteThreshold] = useState("");
  const [isSalonite, setIsSalonite] = useState(false);

  useEffect(() => {
    let authData = auth.getPostAuthData();
    axios
      .post(endpoints.getUserHolderAPI(), authData.body, authData.config)
      .then(
        (acc) => {
          let data = acc.data;
          setIsSalonite(data.salonite);
          getReview();
        },
        (rej) => {
          console.log(rej);
        }
      );
  }, []);

  const submitVote = () => {
    let votes = document.getElementById("voteCount").value;
    let comments = document.getElementById("comments").value;
    let submitVoteAPI = endpoints.getsubmitVoteAPI();
    let authData = auth.getPostAuthData();
    let postBody = {
      votes: votes,
      comments: comments,
      username: auth.getUsername(),
      wallet: auth.getWalletAddress(),
      tbsn: reviewDraft.tbsn,
    };

    extend(postBody, authData.body);
    axios.post(submitVoteAPI, postBody, authData.config).then(
      (acc) => {
        console.log(acc.data);
        window.location.reload();
      },
      (rej) => {
        console.log(rej);
      }
    );
  };

  const getReview = () => {
    // On load make request to server
    setReviewHTML(emptyReviewHTML);
    let authData = auth.getPostAuthData();
    axios.post(endpoints.getReviewAPI(), authData.body, authData.config).then(
      (acc) => {
        let data = acc.data;
        setReviewDraft(data.reviewDraft);
        setVotesLeft(data.currentVotes);
        setVoteThreshold(data.voteThreshold);
        window.scrollTo(0, 0);
      },
      (rej) => {
        console.log(rej);
      }
    );
  };

  useEffect(() => {
    if (reviewDraft && votesLeft) {
      setReviewHTML(
        <div className="card mx-3 w-100 h-auto px-4 py-auto mx-4">
          <TBookView
            mode="draft"
            tbsn={reviewDraft}
            draftContent={reviewDraft}
          />
          <p className="mx-4 text-left mt-0" style={{ fontSize: 25 }}>
            Reviewer Comments
          </p>

          <div className="py-auto justify-content-center text-center mx-4">
            <textarea
              name="comments"
              id="comments"
              className="w-100 p-3"
              rows={5}
              maxLength={300}
              style={{ borderRadius: 20 }}
            ></textarea>
          </div>
          <p className="my-0 mx-4 text-muted">Max 300 characters</p>
          <span className="container row d-flex mt-4">
            <p className="mx-auto col-lg-4" style={{ fontSize: 25 }}>
              Votes Remaining: {votesLeft}
            </p>
            <div className="col-lg-4 py-auto mx-auto">
              <input
                id="voteCount"
                type="number"
                max={votesLeft}
                min={0}
                defaultValue={0}
                className="input form-control m-auto p-auto"
                style={{
                  borderRadius: 25,
                }}
              />
            </div>
            <div className="col-lg-4">
              <a
                className="btn btn-success px-4 mx-3 py-auto mb-5 mt-0"
                style={{ borderRadius: 25 }}
                onClick={submitVote}
              >
                Submit Votes
                <i className="fa fa-arrow-right mx-2"></i>
              </a>
            </div>
          </span>
          <p
            className="mx-4 text-left mt-0 text-muted"
            style={{ fontSize: 25 }}
          >
            {voteThreshold
              ? "Publication threshold is " + voteThreshold + " votes"
              : ""}
          </p>
        </div>
      );
    } else {
      setReviewHTML(emptyReviewHTML);
    }
  }, [reviewDraft]);

  const pageHTML = (
    <div
      className="container h-100 mx-0 px-0 mt-3 w-100"
      style={{ minHeight: 800 }}
    >
      <NavBar />
      <div className="row h-100 w-100">
        <div className="col-md-3 col-xs-12">
          <Sidebar active={3} />
        </div>
        <div className="col-xs-12 col-md-9 my-0 " style={{ minHeight: 500 }}>
          <h1 className="my-5 pt-5 text-center">Review TBook Drafts</h1>
          <p className="mx-3" style={{ fontSize: 25 }}>
            Votes Remaining Today: {votesLeft}
          </p>
          <div id="content">{reviewHTML}</div>
        </div>
      </div>
    </div>
  );

  return <div>{isSalonite ? pageHTML : <MemberOnly active={3} />}</div>;
}

export default ReviewPage;
