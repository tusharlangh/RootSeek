import React, { useEffect, useRef, useState } from "react";
import { PictureIcon } from "../icons";

const PictureSearch = ({ onSelectPicture, picture }) => {
  const [showPicture, setShowPicture] = useState(false);
  const [pictureURL, setPictureURL] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (picture) {
      setPictureURL(URL.createObjectURL(picture));
      setShowPicture(true);
    }
  }, [picture]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    onSelectPicture(file);
    setPictureURL(URL.createObjectURL(file));
    setShowPicture(true);
  };

  return (
    <div className="w-full h-full">
      {!showPicture && (
        <div className="flex flex-col justify-center items-center w-full h-full pb-12">
          <div className="w-42">
            <PictureIcon size={29} />
          </div>
          <p className="font-medium text-xl">
            Add a picture to emphasize your root
          </p>
          <button
            className="bg-[#49CDFD] text-white p-1 px-4 rounded-md cursor-pointer hover:scale-103 transition-transform hover:shadow-lg duration-400 mt-4"
            onClick={() => fileInputRef.current.click()}
          >
            Add a picture
          </button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>
      )}

      {showPicture && (
        <div className="flex justify-center items-center h-full w-full">
          {<img src={pictureURL} className="h-full w-full object-cover" />}
        </div>
      )}
    </div>
  );
};

export default PictureSearch;
