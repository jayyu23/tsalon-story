import React, { useState, useEffect } from 'react';
import MarkdownEditor from '../components/MarkdownEditor';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useLocation, useNavigate } from "react-router-dom";

const Editor: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState<string>(location.state?.previewData?.markdown || '');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>(location.state?.previewData?.title || '');
  const [blurb, setBlurb] = useState<string>(location.state?.previewData?.blurb || '');
  const [coverImage, setCoverImage] = useState<File | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSavedTime(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, [markdown]);

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCoverImage(event.target.files[0]);
    }
  };

  const savePost = () => { };

  const generatePreview = () => {
    const previewData = {
      title,
      blurb,
      markdown,
      coverImage: coverImage ? URL.createObjectURL(coverImage) : null,
    };
    navigate('/preview', { state: { previewData } });
  };

  return (
    <div className="vw-100 vh-100 d-flex flex-column">
      <Navbar />
      <div className="d-flex flex-grow-1">
        <div className="d-flex flex-column">
          <Sidebar initialActiveItem="Drafts" />
        </div>
        <div className="flex-grow-1 d-flex flex-column my-0 h-100 px-4 pb-5">
          <h1 className="my-5 text-center">Draft Editor</h1>
          <div className="container mb-4 text-left">
            <div className="form-group row align-items-center mb-3">
              <label htmlFor="title" className="col-sm-2 col-form-label">Title</label>
              <div className="col-sm-10">
                <input 
                  type="text" 
                  className="form-control" 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
            </div>
            <div className="form-group row align-items-center mb-3">
              <label htmlFor="blurb" className="col-sm-2 col-form-label">Blurb</label>
              <div className="col-sm-10">
                <textarea 
                  className="form-control" 
                  id="blurb" 
                  rows={3} 
                  value={blurb} 
                  onChange={(e) => setBlurb(e.target.value)} 
                />
              </div>
            </div>
            <div className="form-group row align-items-center mb-3">
              <label htmlFor="coverImage" className="col-sm-2 col-form-label">Cover Image</label>
              <div className="col-sm-10">
                <input 
                  type="file" 
                  className="form-control-file" 
                  id="coverImage" 
                  onChange={handleImageUpload} 
                  style={{ fontSize: 'small' }}
                />
              </div>
            </div>
          </div>
          <div className="container mt-2 mb-2">
            <MarkdownEditor
              markdown={markdown}
              setMarkdown={setMarkdown}
              lastSavedTime={lastSavedTime}
            />
          </div>
          <div className="row justify-content-center my-5">
              <button
                className="btn btn-primary col-3 mx-3"
                onClick={savePost}
                style={{ borderRadius: 25 }}
              >
                Save Draft
              </button>
              <button
                onClick={generatePreview}
                className="btn btn-warning col-3 mx-3"
                style={{ borderRadius: 25 }}
              >
                Preview
              </button>
            </div>
            <div>
              <p className="mt-0">Last saved at: {formatTime(lastSavedTime)}</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;