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
    <div className="vw-100 vh-100 d-flex flex-column">
      <Navbar />
      <div className="d-flex flex-grow-1">
        <div className="d-flex flex-column">
          <Sidebar initialActiveItem="Drafts" />
        </div>
        <div className="flex-grow-1 d-flex flex-column my-0 h-100">
        <h1 className="my-5 text-center">Editor</h1>
          <MarkdownEditor
            markdown={markdown}
            setMarkdown={setMarkdown}
            lastSavedTime={lastSavedTime}
          />
          <div className="container">
            {/* <h2>Saved Content</h2>
            <p>{markdown}</p> */}
            <p>Last saved at: {formatTime(lastSavedTime)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;