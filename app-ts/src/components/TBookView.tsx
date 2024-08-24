import React, { useEffect, useState } from "react";
import ReactMarkdown from 'react-markdown';
import axios from "axios";
import endpoints from "../auth/endpoints";
import StoryIPComponent from "./StoryIP";


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
  const [storyData, setStoryData] = useState<any>(null);

  const getStoryIP = async (tbsn: string) => {
    const endpoint = endpoints.getRegisterStoryAPI();
    const response = await axios.post(endpoint, { tbsn, copyNumber: 0 });
    console.log(response.data);
    setStoryData(response.data.response);
  }

  const storyExplorer = "https://explorer.story.foundation/ipa/"

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
      getStoryIP(tbsn || "");
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
          <StoryIPComponent tbsn={props.tbsn || ""} />
        </div>
      </div>
    </div>
  );
};

export default TBookView;