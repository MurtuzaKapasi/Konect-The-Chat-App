import React, { useEffect,useContext , useState } from 'react'
import Message from './Message'
import { ChatsContext } from '../context/ChatContext'
import { onSnapshot  , doc} from 'firebase/firestore';
import { db } from '../firebase';


export default function Messages() {
  const [messages, setMessages] = useState([]);
  const {data} = useContext(ChatsContext);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages)
    })
    return () => {
      unsub();
    }
  }, [data.chatId])

  return (
    <div className='messages'>
      {messages.map(m => (
        <Message key={m.id} message={m}/>
      ))}
  
    </div>
  )
}
