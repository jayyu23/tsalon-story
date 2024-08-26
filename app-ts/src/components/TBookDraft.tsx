import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import endpoints from "../auth/endpoints";
import { useAuth } from "../auth/useAuth";

interface TBookDraftProps {
  tbsn: number;
  imageCover: string;
  title: string;
  editable: boolean;
  author: string;
}

const TBookDraft: React.FC<TBookDraftProps> = (props) => {
  const tbsn = props.tbsn || 0;
  const images = ["blue", "green", "orange", "purple"];
  const defaultImageCover = `/assets/logo_square_${
    images[Math.floor(Math.random() * images.length)]
  }.png`;
  const navigate = useNavigate();
  const { getAuthData } = useAuth();

  const handleContinue = () => {
    console.log('loading API');
    // const endpoint = endpoints.getDraftAPI(tbsn.toString());
    // const authData = getAuthData();
    // console.log(endpoint, authData);
    // axios.get(endpoint, authData.config)
    //   .then((response) => {
    //     console.log(response.data);
    //     const draft = response.data;
        
    //     // setMarkdown(draft.content);
    //     // setTitle(draft.title);
    //     // setBlurb(draft.blurb);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    navigate('/editor', { state: { tbsn: tbsn.toString(), loadAPI: true } });
  };

  const deleteDraft = () => {
    if (tbsn !== 0) {
      const authData = getAuthData();
      axios.delete(endpoints.getDraftAPI(tbsn.toString()), { ...authData.config,  data: authData.body}).then(
        (acc) => {
          window.location.reload();
        },
        (rej) => console.log(rej)
      );
    }
  };

  const editableHTML = props.editable ? "inline" : "none";

  return (
    <div className="card mx-3" style={{ width: "25rem" }}>
      <img
        className="card-img-top"
        src={props.imageCover || defaultImageCover}
        alt="TBook Draft Image Cap"
      ></img>

      <div className="card-body w-100 justify-content-center">
        <h5 className="card-title" style={{ fontSize: 25 }}>
          {tbsn ? `#${tbsn}` : ""}
        </h5>
        <h5 className="card-title">{props.title || "Untitled TBook Draft"}</h5>
      </div>
      <span className="mt-auto w-100 text-center mb-4">
        <a
          href="#"
          className={"btn btn-primary m-2 text-center col-5"}
          onClick={handleContinue}
          style={{ borderRadius: 30, display: editableHTML }}
        >
          <i className="fa fa-pencil mx-1"></i>Continue
        </a>
        <a
          href="#"
          className="btn btn-danger px-0 col-4"
          style={{ borderRadius: 50 }}
          onClick={deleteDraft}
        >
          <i className="fa fa-trash my-auto"></i> Delete
        </a>
      </span>
    </div>
  );
};

export default TBookDraft;