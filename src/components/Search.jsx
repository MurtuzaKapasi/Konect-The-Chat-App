import React, { useContext } from 'react'
import find from '../images/find2.png';
import user from '../images/p2.jpg';
import { useState, useEffect } from 'react';
import { collection, query, where, getDoc, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase';
import { AuthContext, } from '../context/AuthContext';
import { serverTimestamp } from 'firebase/firestore';

export default function Search() {
  const [username, setusername] = useState('')
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const table = collection(db, 'users');
    const q = query(table, where('displayName', '==', username));

    try {
      const querySnapshot = await getDocs(q);
      const foundUser = querySnapshot.docs.map((doc) => {
        setUser(doc.data())
      });

      if (foundUser.length > 0) {
        setErr(false); // User found, so reset the error state
      } else {
        setUser(null);
        setErr(true); // User not found
      }

    } catch (err) { setErr(true); setUser(null) }
  };

  useEffect(() => {
    let timer;
    if (err) {
      timer = setTimeout(() => {
        setErr(false);
      }, 1000); // 3 seconds
    }
    return () => {
      clearTimeout(timer);
    };
  }, [err]);

  const handleKey = (e) => {
    e.code === 'Enter' && handleSearch()
  }

  const handleSelect = async () => {
    //check if user is not selected
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {

      const res = await getDoc(doc(db, 'chats', combinedId));
      if (!res.exists()) {
        //create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        //create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          //storing user's char 
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          [combinedId + ".date"]: serverTimestamp()
        });

        //storing other user's chat
        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          },
          [combinedId + '.date']: serverTimestamp()
        });

      }

      //create user chats
    } catch (err) { }
    setUser(null); setusername('')
  };

  return (
    <div className='search'>
      <div className="searchForm">
        <i className="icon ri-search-2-line"></i>
        <input type="text" placeholder='Find a user' onKeyDown={handleKey} onChange={(e) => setusername(e.target.value)} value={username}/>
      </div>
      {err && <span style={{ color: "red", alignItems: "center", textAlign: "center" }}>User not found</span>}
      {user && <div className="user" onClick={handleSelect}>
        <img src={user.photoURL} alt="" />
        <span>{user.displayName} </span>
      </div>}

    </div>
  )
}
