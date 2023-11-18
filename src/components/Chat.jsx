import React, { useContext } from 'react'
import Messages from './Messages'
import Input from './Input'
import { ChatsContext } from '../context/ChatContext'


export default function Chat() {
  const {data} = useContext(ChatsContext)

  return (
    <div className='chat'>
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <i className="ri-vidicon-fill"></i>
          <i className="ri-user-add-fill"></i>
          <i className="ri-more-fill"></i>
        </div>
      </div>
      <Messages/>
      <Input/>
    </div>
  )
}
