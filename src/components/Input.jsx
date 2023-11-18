import React from 'react'
import { AuthContext } from '../context/AuthContext';
import { ChatsContext } from '../context/ChatContext';
import { v4 as uuid } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { useContext } from 'react';
import { useState } from 'react';
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';



export default function Input() {
  const [text, setText] = useState("");
  const [img , setImg] = useState(null);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatsContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (err) => {   /*setErr(true);*/  },
        async () => {
           await uploadTask;
           await getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL
              })
            })
          });
        });

    }
    else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      })

    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {text},
      [data.chatId + ".date"]: serverTimestamp()
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {text},
      [data.chatId + ".date"]: serverTimestamp()
    })


    setText("");
    setImg(null);

  };

  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' onChange={e => setText(e.target.value)} value={text}/>
      <div className="send">
        <i className="icon ri-attachment-2 line"></i>
        <input type="file" style={{ display: "none" }} id='file' onChange={e => setImg(e.target.files[0])}/>
        <label htmlFor="file">
          <i className="icon ri-image-add-line"></i>
        </label>
        <i className="icon ri-emotion-happy-line"></i>

        <button onClick={handleSend}>Send</button>
      </div>


    </div>
  )
}
