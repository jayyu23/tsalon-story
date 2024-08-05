import React, { useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { Area } from 'react-easy-crop/types';

interface ImageCropperProps {
  onCropped: (imageUrl: string) => void;
  initialImageUrl?: string; // Optional prop for initial image data URL
}

const ImageCropper: React.FC<ImageCropperProps> = ({ onCropped, initialImageUrl }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [isCropping, setIsCropping] = useState<boolean>(false);

  const height = 500;
  const width = 500;

  useEffect(() => {
    if (initialImageUrl && !imageSrc) {
      setImageSrc(initialImageUrl);
      setCroppedImage(initialImageUrl);
    }
  }, [initialImageUrl]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string | null> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      width,
      height
    );

    return new Promise<string>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
      }, 'image/jpeg');
    });
  };

  const handleCropSave = async () => {
    if (imageSrc && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImage);
      setIsCropping(false);
      if (croppedImage) {
        onCropped(croppedImage);
      }
    }
  };

  const handleEdit = () => {
    setIsCropping(true);
  };

  return (
    <div className='my-3'>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {isCropping && imageSrc && (
        <div className='d-flex flex-column mx-5 my-3'>
          <div style={{ position: 'relative', width: '100%', height: 400 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <button className="btn rounded-pill btn-success mx-5 my-4" onClick={handleCropSave}>Crop</button>
        </div>
      )}
      {!isCropping && croppedImage && (
        <div className='d-flex flex-column mx-5 my-4'>
          <img src={croppedImage} alt="Cover Image" />
          <button className="btn rounded-pill btn-warning mx-5 my-4" onClick={handleEdit}>Edit</button>
        </div>
      )}
      <canvas className="mx-5 w-25" id="croppedCanvas" style={{ display: 'none' }} />
    </div>
  );
};

export default ImageCropper;