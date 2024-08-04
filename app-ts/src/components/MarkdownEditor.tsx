import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaEdit, FaColumns, FaEye } from 'react-icons/fa';
import AuthWrapper from './AuthWrapper';
import './markdownEditor.css';

enum ViewMode {
  FULL_EDITOR,
  SPLIT_PANE,
  FULL_PREVIEW
}

interface MarkdownEditorProps {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  lastSavedTime: Date | null;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ markdown, setMarkdown, lastSavedTime }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT_PANE);

  const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  return (
      <div className="markdown-editor">
        <div className="buttons-row mb-5">
          <button className="btn btn-secondary view-button" onClick={() => setViewMode(ViewMode.FULL_EDITOR)}>
            <FaEdit /> Full Editor
          </button>
          <button className="btn btn-secondary view-button" onClick={() => setViewMode(ViewMode.SPLIT_PANE)}>
            <FaColumns /> Split Pane
          </button>
          <button className="btn btn-secondary view-button" onClick={() => setViewMode(ViewMode.FULL_PREVIEW)}>
            <FaEye /> Full Display
          </button>
        </div>
        {viewMode === ViewMode.FULL_EDITOR && (
          <div className="editor-pane full-view">
            <textarea
              value={markdown}
              placeholder="Write some markdown..."
              onChange={handleEditorChange}
              className="editor-textarea"
            />
            {/* <div className="autosave-status">Last saved at: {formatTime(lastSavedTime)}</div> */}
          </div>
        )}
        {viewMode === ViewMode.SPLIT_PANE && (
          <div className="split-pane">
            <div className="editor-pane">
              <textarea
                value={markdown}
                placeholder="Write some markdown..."
                onChange={handleEditorChange}
                className="editor-textarea"
              />
              {/* <div className="autosave-status">Last saved at: {formatTime(lastSavedTime)}</div> */}
            </div>
            <div className="preview-pane">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        )}
        {viewMode === ViewMode.FULL_PREVIEW && (
          <div className="preview-pane full-view">
            <ReactMarkdown>{markdown}</ReactMarkdown>
            {/* <div className="autosave-status">Last saved at: {formatTime(lastSavedTime)}</div> */}
          </div>
        )}
      </div>
  );
};

export default MarkdownEditor;