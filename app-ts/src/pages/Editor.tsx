import React, { useState, useEffect } from 'react';
import MarkdownEditor from '../components/MarkdownEditor';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import endpoints from '../auth/endpoints';
import { useAuth } from '../auth/useSessionStorage';
import AuthWrapper from '../components/AuthWrapper';
import TBookView from '../components/TBookView';
import ImageCropper from '../components/ImageCropper';

const EditorPreview: React.FC = () => {
  const images = ["blue", "green", "orange", "purple"];
  const defaultCoverImage = `/assets/logo_square_${
    images[Math.floor(Math.random() * images.length)]
  }.png`;
  
  const location = useLocation();
  const navigate = useNavigate();
  const [markdown, setMarkdown] = useState<string>(location.state?.content || '');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>(location.state?.title || '');
  const [blurb, setBlurb] = useState<string>(location.state?.blurb || '');
  const [coverImageDataUrl, setCoverImageDataUrl] = useState<string>(location.state?.coverImage);
  const [tbsn, setTbsn] = useState<number>(location.state?.tbsn || 0);
  const [loadAPI, setLoadAPI] = useState<boolean>(location.state?.loadAPI || false);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  const { getAuthData, session } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSavedTime(new Date());
      // savePost();
    }, 50000);

    return () => clearInterval(interval);
  }, [markdown]);

  useEffect(() => {
    if (loadAPI) {
      const endpoint = endpoints.getDraftAPI(tbsn.toString());
      const authData = getAuthData();
      axios.post(endpoint, authData.body, authData.config)
        .then((response) => {
          console.log(response.data);
          const draft = response.data;
          setMarkdown(draft.content);
          setTitle(draft.title);
          setBlurb(draft.blurb);
          setCoverImageDataUrl(draft.coverImage);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      // Not load API - start new draft
      fetchDefaultCoverImage();
    }
  }
  , []);

  const fetchDefaultCoverImage = async () => {
    try {
      const response = await fetch(defaultCoverImage);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        if (!coverImageDataUrl) {
          setCoverImageDataUrl(reader.result as string);
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Failed to fetch default cover image', error);
    }
  }


  const formatTime = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString();
  };

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0];
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setCoverImageDataUrl(reader.result as string);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleImageCrop = (imageDataUrl: string) => {
    setCoverImageDataUrl(imageDataUrl);
  }

  const author = session?.address || 'Unknown';

  const savePost = () => {
    console.log('saving post');
    const endpoint = endpoints.getDraftSaveAPI();
    const authData = getAuthData();

    const body = {
      tbsn,
      title,
      blurb,
      content: markdown,
      author: authData.body.username,
      coverImage: coverImageDataUrl
    };
    console.log(body, authData);
    axios.post(endpoint, body, authData.config)
      .then((response) => {
        console.log(response.data);
        setTbsn(response.data.draft.tbsn);
        // sessionStorage.setItem('tbsn', response.data.draft.tbsn);
      })
      .catch((error) => {
        console.error(error)
      });
  };

  const generatePreview = () => {
    savePost();
    setIsPreview(true);
  };

  const handleBack = () => {
    savePost();
    setIsPreview(false);
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

  const previewData = {
    tbsn,
    author,
    title,
    content: markdown,
    blurb,
    coverImage: coverImageDataUrl || defaultCoverImage,
  };

  return (
    <AuthWrapper>
      <div className="vw-100 vh-100 d-flex flex-column">
        <Navbar />
        <div className="d-flex flex-grow-1">
          <div className="d-flex flex-column">
            <Sidebar initialActiveItem="Drafts" />
          </div>
          <div className="flex-grow-1 d-flex flex-column my-0 h-100 px-4 pb-5">
            {!isPreview ? (
              <>
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
                      {/* <input 
                        type="file" 
                        className="form-control-file" 
                        id="coverImage" 
                        onChange={handleImageUpload} 
                        style={{ fontSize: 'small' }}
                      /> */}
                      <ImageCropper onCropped={handleImageCrop}/>
                    </div>
                  </div>
                </div>
                <div className="container mt-2 mb-2 d-flex flex-grow-1">
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
              </>
            ) : (
              <>
                <h1 className="my-5 pt-5 text-center">Preview</h1>
                <div className="container mb-4 text-left">
                  <TBookView is_local={true} data={previewData} />
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
              </>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default EditorPreview;