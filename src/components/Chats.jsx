import React, { useEffect } from 'react'
import user from '../images/p2.jpg';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useState } from 'react';
import { ChatsContext } from '../context/ChatContext';


export default function Chats() {

  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatsContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data())
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid])

  console.log(chats);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u  })
  }


  return (
    <div className='chats'>

      {Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date)?.map((chat) => (
        <div className="user" key={chat[0]} onClick={() => handleSelect(chat[1].userInfo)}>
          <img src={chat[1]?.userInfo?.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1]?.userInfo?.displayName} </span>
            <p>{chat[1]?.lastMessage?.text}</p>
          </div>
        </div>
      ))}

    </div>
  )
}
