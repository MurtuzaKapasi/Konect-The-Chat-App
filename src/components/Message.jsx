import React, { useRef , useEffect } from 'react'
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { ChatsContext } from '../context/ChatContext';

export default function Message({message}) {

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatsContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({behavior: "smooth"});
  } , [message])


  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
       <img src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL} alt="" /> 
        <span>Just Now</span>
      </div>
      <div className="messageContent">
        {message.text && <p>{message.text}</p> }
        {message.img  &&  <img src={message.img} alt="" /> }
         {/* <img src={message.img} alt="" />  */}
      </div>      
    </div>
  )
}
