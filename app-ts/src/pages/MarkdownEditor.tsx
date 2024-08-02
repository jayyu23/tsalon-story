import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaEdit, FaColumns, FaEye } from 'react-icons/fa';
import AuthWrapper from '../components/AuthWrapper';
import './MarkdownEditor.css';

enum ViewMode {
  FULL_EDITOR,
  SPLIT_PANE,
  FULL_PREVIEW
}

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT_PANE);

  const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
  };

  return (
    <AuthWrapper>
      <div className="markdown-editor">
        <div className="buttons-row">
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
            </div>
            <div className="preview-pane">
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </div>
          </div>
        )}
        {viewMode === ViewMode.FULL_PREVIEW && (
          <div className="preview-pane full-view">
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        )}
      </div>
    </AuthWrapper>
  );
};

export default MarkdownEditor;