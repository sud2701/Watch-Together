import React from 'react';
import YouTube from 'react-youtube';
import apiKey from './api';
const YoutubePlayer = ({ videoUrl }) => {
  const onReady = (event) => {
    console.log("Playing Video");
  };

  return (
    <div>
      {videoUrl && (
        <YouTube
          videoId={videoUrl}
          opts={{
            width: '1000',
            height: '565',
            playerVars: {
              key: apiKey,
              controls: 1
            },
            
          }}
          onReady={onReady}
        />
      )}
    </div>
  );
};

export default YoutubePlayer;