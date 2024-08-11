import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from 'html-react-parser';
import ReactMarkdown from 'react-markdown';
import axios from "axios";
import endpoints from "../auth/endpoints";


interface TBookViewProps {
  tbsn?: string;
  is_local: boolean; // If local, then read from content. If not, then read from API
  data?: TBookContent;
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

  const [data, setData] = useState<TBookContent>(defaultSettings);

  useEffect(() => {
    if (props.is_local) {
      setData(props.data || defaultSettings);
    } else {
      // Fetch from API
      const tbsn = props.tbsn;
      const endpoint = endpoints.getPublicationAPI(tbsn || "");
      axios.get(endpoint).then((res) => {
        setData(res.data);
      });
    }
  
  }, [props.is_local, props.data]);

  return (
    <div>
      <div className="justify-content-center mt-5">
        <h1 className="font-weight-bold mt-4 mb-2 mx-5 px-5 text-center">
          {data.title}
        </h1>
        <div className="text-center">
          <img
            className="mt-3 justify-content-center mx-auto"
            src={data.coverImage}
            alt="Cover Image for Article"
          />
          <p className="font-italic my-2">
            By: {data.author}
          </p>
          <p className="font-weight-light font-italic my-3 px-5 mx-5 text-muted">
            {data.blurb}
          </p>
        </div>
        <div className="row d-flex justify-content-center mt-4">
          <div
            className="my-4 text-left mx-5 px-5 align-left"
            style={{ maxWidth: 800 }}
          >
            <ReactMarkdown>{data.content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TBookView;



  // useEffect(() => {
  //   const res = (acc: any) => {
  //     const data: TBookContent = acc.data;
  //     setPub(data);
  //   };
  //   const err = (rej: any) => {
  //     console.log(rej);
  //     window.location.href = "/error";
  //   };

  //   if (props.mode === "draft") {
  //     if (props.draftContent) {
  //       setPub(props.draftContent);
  //     }
  //   } else {
  //     // axios.get(endpoints.getPublicationAPI(tbsn)).then(res, err);
  //   }
  // }, [props.mode, props.draftContent, tbsn]);