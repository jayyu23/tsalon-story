import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AuthWrapper from '../components/AuthWrapper';

const Settings: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission, e.g., send data to the server
    console.log({ username, bio, profilePicture });
  };

  return (
    <AuthWrapper>
    <div className="vw-100 vh-100 d-flex flex-column">
      <Navbar />
      <div className="d-flex flex-grow-1">
        <div className="d-flex flex-column">
          <Sidebar initialActiveItem="Settings" />
        </div>
        <div className="flex-grow-1 d-flex flex-column my-0 h-100 px-4">
          <h1 className="my-5 text-center">Settings</h1>
          <div className="container mb-4 text-left">
            <form onSubmit={handleFormSubmit}>
              <div className="form-group row align-items-center mb-3">
                <label htmlFor="username" className="col-sm-2 col-form-label">Username</label>
                <div className="col-sm-10">
                  <input 
                    type="text" 
                    className="form-control" 
                    id="username" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                  />
                </div>
              </div>
              <div className="form-group row align-items-center mb-3">
                <label htmlFor="bio" className="col-sm-2 col-form-label">Bio</label>
                <div className="col-sm-10">
                  <textarea 
                    className="form-control" 
                    id="bio" 
                    rows={3} 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)} 
                  />
                </div>
              </div>
              <div className="form-group row align-items-center mb-3">
                <label htmlFor="profilePicture" className="col-sm-2 col-form-label">Profile Picture</label>
                <div className="col-sm-10">
                  <input 
                    type="file" 
                    className="form-control-file" 
                    id="profilePicture" 
                    onChange={handleImageUpload} 
                    style={{
                      width: 'auto',
                      padding: '0.375rem 0.75rem',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      borderRadius: '0.2rem'
                    }}
                  />
                  {profilePicturePreview && (
                    <div className="mt-3">
                      <img src={profilePicturePreview} alt="Profile Preview" className="img-thumbnail" style={{ width: '150px' }} />
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row">
                <div className="col-sm-10 offset-sm-2">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    </AuthWrapper>
  );
};

export default Settings;