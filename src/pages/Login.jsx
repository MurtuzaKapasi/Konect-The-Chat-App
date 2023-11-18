import React , {useState} from 'react'
import '../style.scss'
import { useNavigate , Link} from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

export default function Login() {
  const [err, setErr] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value
    const password = e.target[1].value

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    }catch(err){
      setErr(true)
    }
  }



  return (
    <div className='formContainer'>
        <div className="formWrapper" style={{height:"50%"}}>
            <span className="logo" title='logo'>Konect</span>
            <span className="tagLine" title='logo'>The Chat App</span>
            <span className="register"title='Register'>Login</span>
            <form className='form' onSubmit={handleSubmit}>
                <input className="box" type="email" placeholder='Email'/>
                <input className="box" type="password" placeholder='Password'/>

                <button className="button" type="submit">Login</button>
                {
                  err && <span>Something went wrong</span>
                }
            </form>
            <span className="tagLine">Don't have an account? <Link to='/register' className='link'><u>Register</u></Link></span>
        </div>

     
    </div>
  )
}
