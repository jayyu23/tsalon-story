import React, { useEffect, useState } from "react";
import axios from "axios";
import endpoints from "../auth/endpoints";

interface StoryIPComponentProps {
  tbsn: string;
  copyNumber?: number;
}

const StoryIPComponent: React.FC<StoryIPComponentProps> = ({
  tbsn,
  copyNumber = 0,
}) => {
  const [storyData, setStoryData] = useState<any>(null);
  const storyExplorer = "https://explorer.story.foundation/ipa/";
  const getStoryIP = async () => {
    try {
      const endpoint = endpoints.getRegisterStoryAPI();
      const response = await axios.post(endpoint, { tbsn: tbsn, copyNumber: copyNumber });
      console.log(response.data);
      setStoryData(response.data.response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (tbsn) {
        getStoryIP();
    }
  }, []);

  return (
    <>
      {storyData && (
        <div className="text-secondary my-3">
          {copyNumber === 0 ? "Story IP Asset:" : "Story IP Derivative"} <br />
          <a className="link-secondary" href={storyExplorer + storyData.ipId}>
            {storyData.ipId}
          </a>
        </div>
      )}
    </>
  );
};

export default StoryIPComponent;