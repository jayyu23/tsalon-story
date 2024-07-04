import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from 'html-react-parser';
// import sanitizeHTML from "sanitize-html";
import axios from "axios";
// import endpoints from "../auth/endpoints";

interface TBookViewProps {
  tbsn?: string;
  mode?: "draft" | "publication";
  draftContent?: TBookContent;
  content?: string;
}

interface TBookContent {
  author: string;
  coverImage: string;
  title: string;
  content: string;
  blurb?: string;
}

const TBookView: React.FC<TBookViewProps> = (props) => {
  const defaultSettings: TBookContent = {
    author: "",
    coverImage: "",
    title: "",
    content: "",
    blurb: ""
  };

  const [pub, setPub] = useState<TBookContent>(defaultSettings);
  let { tbsn } = useParams<{ tbsn: string }>();
  if (props.tbsn) {
    tbsn = props.tbsn;
  }

  useEffect(() => {
    const res = (acc: any) => {
      const data: TBookContent = acc.data;
      setPub(data);
    };
    const err = (rej: any) => {
      console.log(rej);
      window.location.href = "/error";
    };

    if (props.mode === "draft") {
      if (props.draftContent) {
        setPub(props.draftContent);
      }
    } else {
      // axios.get(endpoints.getPublicationAPI(tbsn)).then(res, err);
    }
  }, [props.mode, props.draftContent, tbsn]);

  const getBodyHTML = () => {
    const rawHTML = props.content || pub.content;
    // TODO: Sanitize HTML
    return rawHTML;
  };

  return (
    <div>
      <div className="justify-content-center mt-5">
        <h1 className="font-weight-bold mt-4 mb-2 mx-5 px-5 text-center">
          {pub.title}
        </h1>
        <div className="text-center">
          <img
            className="mt-3 justify-content-center mx-auto"
            src={pub.coverImage}
            alt="Cover Image for Article"
          />
          <p className="font-italic my-2">
            {props.mode === "draft" ? "" : "By: " + pub.author}
          </p>
          <p className="font-weight-light font-italic my-3 px-5 mx-5 text-muted">
            {pub.blurb}
          </p>
        </div>
        <div className="row d-flex justify-content-center mt-4">
          <div
            className="my-4 text-left mx-5 px-5 align-left"
            style={{ maxWidth: 800 }}
          >
            {parse(getBodyHTML())}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TBookView;