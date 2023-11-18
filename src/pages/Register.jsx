import React, { useState } from 'react'
import '../style.scss'
import Add from '../images/uploadImage.jpg'
import { createUserWithEmailAndPassword , updateProfile } from 'firebase/auth'
import { auth, storage ,db} from '../firebase'
import {  ref, uploadBytesResumable, getDownloadURL  } from "firebase/storage";
import {doc , setDoc , getDoc , updateDoc} from 'firebase/firestore'
import { useNavigate , Link} from 'react-router-dom'


export default function Register() {

  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const file = e.target[3].files[0]

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password)
      
      const storageRef = ref(storage, displayName);
       const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        (err) => {   setErr(true);  },
        async () => {
           await uploadTask;
           await getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {

            await updateProfile(res.user , {
              displayName,
              photoURL: downloadURL,
            });
        
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL
            });

            await setDoc(doc(db,"userChats" , res.user.uid) , {});
            navigate("/");

          });
        });

      console.log(res)
    } catch (err) {
      setErr("uploading error");
    }

  }

  return (
    <div className='formContainer'>
      <div className="formWrapper">
        <span className="logo" title='logo'>Konect</span>
        <span className="tagLine" title='logo'>The Chat App</span>
        <span className="register" title='Register'>Register</span>
        <form className='form' onSubmit={handleSubmit}>
          <input className="box" type="text" placeholder='Username' />
          <input className="box" type="email" placeholder='Email' />
          <input className="box" type="password" placeholder='Password' />
          <input type='file' id='file' style={{ display: "none" }} />
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Choose an avatar</span>
          </label>
          <button className="button" type='submit'>Sign Up</button>
          {err && <span>Something went wrong</span>}
        </form>
        <span className="tagLine"> Already have an account? <Link to='/login' className='link'><u>Login</u></Link></span>
      </div>


    </div>
  )
}
