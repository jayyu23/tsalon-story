import React, { useState, useEffect } from 'react';
import MarkdownEditor from '../components/MarkdownEditor';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Editor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

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

  return (
    <div className="editor-container vh-100">
      <Navbar />
      <div className="row h-100">

        <div className="col-md-3 col-xs-12" style={{display: "flex", flexDirection: "column", height: "100%"}}>
          <Sidebar initialActiveItem="Drafts" />
        </div>
        <div className="col-xs-12 col-md-9 p-0">
          <MarkdownEditor
            markdown={markdown}
            setMarkdown={setMarkdown}
            lastSavedTime={lastSavedTime}
          />
          <div className="container">
            <h2>Saved Content</h2>
            <p>{markdown}</p>
            <p>Last saved at: {formatTime(lastSavedTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;