import React, { useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from "../utils/firebase";
import {  useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { LOGO, SUPPORTED_LANGUAGES } from '../utils/constants';
import { toggleGptSearchView } from '../utils/gptSlice';
import { changeLanguage } from '../utils/configSlice';


const  Header = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const user= useSelector(store => store.user);
  const showGptSearch = useSelector((store)=>store.gpt.showGptSearch)



const handleSignOut = () =>{
  signOut(auth).then(() => {
    
  }).catch((error) => {
    navigate("/error");
  });
}
useEffect(() =>{
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      const {uid, email, displayName, photoURL} = user;
      dispatch(addUser({uid: uid,email: email, displayName: displayName, photoURL:"https://tse2.explicit.bing.net/th?id=OIP.ih2IZZn9oBDOn6nZTMRwAwHaHO&pid=Api&P=0&h=180"}));
      navigate("/browse")
    } else {
    dispatch(removeUser());
    navigate("/");
    }
  });
   return () => unsubscribe();
},[])

const handleGptSearchClick = () => {
  dispatch(toggleGptSearchView());
};

const handleLanguageChange =(e)=>{
  dispatch(changeLanguage(e.target.value));
};


  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex flex-col md:flex-row  justify-between">
      <img 
      className="w-44 mx-auto md:mx-0"
       src={LOGO}
      alt="logo"/>
     {user && (<div className="flex p-2 justify-between">
      {showGptSearch && (<select
       className="p-2 m-3 bg-gray-900 text-white" onChange={handleLanguageChange}>
        {SUPPORTED_LANGUAGES.map(lang => <option key={lang.identifier} value={lang.identifier}>
          {lang.name}</option>)}
      </select>)}
     <button className="py-2 px-4 mx-4 my-2 bg-purple-800 text-white rounded-lg"
     onClick={handleGptSearchClick}
     >
      {showGptSearch? "Homepage": "GPT Search"}
      </button>
      <img className="hidden md:block w-11 h-11 "
      alt="usericon"
      src={user?.photoURL}
      />
      <button onClick={handleSignOut} className="font-bold text-white"> (Sign Out)</button>
     </div>
)}
    </div>
  )
}

export default Header

