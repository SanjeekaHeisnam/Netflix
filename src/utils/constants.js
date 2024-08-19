const HarmCategory = {
  HATE_SPEECH: 'HATE_SPEECH',
  HARASSMENT: 'HARASSMENT',
  SEXUALLY_EXPLICIT: 'SEXUALLY_EXPLICIT',
  DANGEROUS_CONTENT: 'DANGEROUS_CONTENT'
};

const HarmBlockThreshold = {
  BLOCK_NONE: 'BLOCK_NONE',
  BLOCK_MODERATE: 'BLOCK_MODERATE',
  BLOCK_HIGH: 'BLOCK_HIGH'
};



export const LOGO = 
"https://cdn.cookielaw.org/logos/dd6b162f-1a32-456a-9cfe-897231c7763c/4345ea78-053c-46d2-b11e-09adaef973dc/Netflix_Logo_PMS.png";

export const USER_AVATAR = "https://tse2.explicit.bing.net/th?id=OIP.ih2IZZn9oBDOn6nZTMRwAwHaHO&pid=Api&P=0&h=180";

export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: 'Bearer ' + process.env.REACT_APP_TMDB_KEY,
  },
};


export const IMG_CDN_URL = "https://image.tmdb.org/t/p/w500";

export const BG_URL = "https://assets.nflxext.com/ffe/siteui/vlv3/fc164b4b-f085-44ee-bb7f-ec7df8539eff/d23a1608-7d90-4da1-93d6-bae2fe60a69b/IN-en-20230814-popsignuptwoweeks-perspective_alpha_website_large.jpg";

export const SUPPORTED_LANGUAGES = [{identifier: "en", name: "English"}, 
  {identifier: "hindi", name: "Hindi"},
  {identifier: "spanish", name: "Spanish"},
  {identifier: "dutch", name: "Dutch"}];

  export const GEMINI_KEY = process.env.REACT_APP_GEMINI_KEY;

  export const safetySettings = {
    [HarmCategory.HATE_SPEECH]: HarmBlockThreshold.BLOCK_NONE,
    [HarmCategory.HARASSMENT]: HarmBlockThreshold.BLOCK_NONE,
    [HarmCategory.SEXUALLY_EXPLICIT]: HarmBlockThreshold.BLOCK_NONE,
    [HarmCategory.DANGEROUS_CONTENT]: HarmBlockThreshold.BLOCK_NONE
  };