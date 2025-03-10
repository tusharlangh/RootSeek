import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const EmojiSelector = ({ onSelectEmoji }) => {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div>
      <button onClick={() => setShowPicker(!showPicker)}>😊</button>
      {showPicker && (
        <EmojiPicker
          onEmojiClick={(emoji) => {
            onSelectEmoji(emoji.emoji);
            setShowPicker(false);
          }}
        />
      )}
    </div>
  );
};

export default EmojiSelector;
