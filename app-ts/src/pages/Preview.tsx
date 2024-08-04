import React from "react";
import AuthWrapper from "../components/AuthWrapper";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TBookView from "../components/TBookView";
import { useLocation, useNavigate } from "react-router-dom";

const tbookData = {
  author: "F. Scott Fitzgerald",
  title: "The Great Gatsby",
  content:
    "# The Great Gatsby \n## Chapter 1\n\nIn my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since.\n\n> “Whenever you feel like criticizing any one,” he told me, “just remember that all the people in this world haven't had the advantages that you've had.”\n\nHe didn’t say any more but we’ve always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that. In consequence I’m inclined to reserve all judgments, a habit that has opened up many curious natures to me and also made me the victim of not a few veteran bores. ",
  coverImage:
    "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
};

const Preview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { previewData } = location.state as any;

  const data = {
    tbsn: previewData.tbsn,
    author: previewData.author,
    title: previewData.title,
    content: previewData.markdown,
    blurb: previewData?.blurb,
    coverImage: previewData.coverImage,
  };

  const handleBack = () => {
    navigate("/editor", { state: {
        tbsn: previewData.tbsn,
        title: previewData.title,
        content: previewData.markdown, 
        blurb: previewData.blurb} });
  };

  const handlePublish = () => {
    // Publish the post
    // axios.post(endpoints.publishAPI(), {
    //   title,
    //   blurb,
    //   markdown,
    //   coverImage,
    // });
    navigate("/");
  };

  return (
    <AuthWrapper>
      <div className="vw-100 vh-100 d-flex flex-column">
        <Navbar />
        <div className="d-flex flex-grow-1">
          <div className="d-flex flex-column">
            <Sidebar initialActiveItem="Drafts" />
          </div>
          <div className="flex-grow-1 d-flex flex-column my-0 h-100">
            <h1 className="my-5 pt-5 text-center">Preview</h1>
            <div className="container mb-4 text-left">
              <TBookView is_local={true} data={data || tbookData} />
            </div>
            <div className="d-flex justify-content-center my-4">
              <button
                className="btn btn-primary mx-2"
                onClick={handleBack}
                style={{ borderRadius: 25 }}
              >
                Back
              </button>
              <button
                className="btn btn-success mx-2"
                onClick={handlePublish}
                style={{ borderRadius: 25 }}
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default Preview;
