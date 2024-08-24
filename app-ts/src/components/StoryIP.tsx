import React, { useEffect, useState } from "react";
import axios from "axios";
import endpoints from "../auth/endpoints";

interface StoryIPComponentProps {
  tbsn: string;
}

const StoryIPComponent: React.FC<StoryIPComponentProps> = (props) => {
  const [storyData, setStoryData] = useState<any>(null);
  const storyExplorer = "https://explorer.story.foundation/ipa/";
  const getStoryIP = async () => {
    const endpoint = endpoints.getRegisterStoryAPI();
    const response = await axios.post(endpoint, { tbsn: props.tbsn, copyNumber: 0 });
    console.log(response.data);
    setStoryData(response.data.response);
  };

  useEffect(() => {
    if (props.tbsn) {
        getStoryIP();
    }
  }, []);

  return (
    <>
      {storyData && (
        <div className="text-secondary mb-5">
          Registered as Story IP Asset: <br />
          <a className="link-secondary" href={storyExplorer + storyData.ipId}>
            {storyData.ipId}
          </a>
        </div>
      )}
    </>
  );
};

export default StoryIPComponent;