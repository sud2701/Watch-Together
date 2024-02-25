const checkYoutubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(.*\/)?|youtu\.be\/)([^&"'>]+)/;
    return youtubeRegex.test(url);   
}

const getYoutubeVideoId = (url) => {
    const regExp = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : '';
}

const getVideoTitle = async (videoId, apiKey) => {
  
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const video = data.items[0];
      return video.snippet.title;
    } catch (error) {
      console.error('Error fetching video title:', error);
      return null;
    }
  };

export {checkYoutubeUrl, getYoutubeVideoId, getVideoTitle};