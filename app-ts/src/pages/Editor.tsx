import React, { useState, useEffect } from 'react';
import MarkdownEditor from '../components/MarkdownEditor';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Editor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>('');
  const [blurb, setBlurb] = useState<string>('');
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
            <p className="mt-0">Last saved at: {formatTime(lastSavedTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;