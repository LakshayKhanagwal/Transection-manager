import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Firebase from './Firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey, faLock, faUnlock } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer'

const Login = () => {
  const [Visibility, setvisibility] = useState(true)
  const [icons,seticons]= useState(faLock)
  const Uname = useRef('')
  const Pass = useRef('')
  const msg = useRef()
  const msg_err = useRef()
  const msg_empty = useRef()
  const navigate = useNavigate()

  function login(event) {
    event.preventDefault()
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    if (Uname.current.value === '' || Pass.current.value === '') {
      msg_empty.current.style.display = 'block'
      setTimeout(() => {
        msg_empty.current.style.display = 'none'
      }, 3000);
    } else {
      if (Uname.current.value === 'Admin' && Pass.current.value === 'Admin@123') {
        const security_key = Array(8).fill().map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
        localStorage.setItem('validation', security_key)
        navigate(`/Admin/${security_key}`)
      } else {
        Firebase.child('users').orderByChild('uname').equalTo(Uname.current.value).on('value', function (user) {
          if (user.val()) {
            var key = Object.keys(user.val())
            if (user.val()[key].password === Pass.current.value) {
              if (user.val()[key].Approval) {
                msg.current.style.display = 'none'
                const security_key = Array(8).fill().map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
                localStorage.setItem('validation', security_key)
                navigate(`/Home/${key}/${security_key}`)
              } else {
                msg.current.style.display = 'block'
                setTimeout(() => {
                  msg.current.style.display = 'none'
                }, 3000);
              }
            } else {
              msg_err.current.style.display = 'block'
              setTimeout(() => {
                msg_err.current.style.display = 'none'
              }, 2000);
            }
          } else {
            msg_err.current.style.display = 'block'
            setTimeout(() => {
              msg_err.current.style.display = 'none'
            }, 2000);
          }
        })
      }
    }
  }

  function visibility() {
    if (Visibility === true) {
      Pass.current.type = 'text'
      setvisibility(false)
      seticons(faUnlock)
    } else {
      Pass.current.type = 'password'
      setvisibility(true)
      seticons(faLock)
    }
  }

  return (
    <div>
      <div className='login'>
        <div className=' Header pe-4 pb-2'>
          <div></div>
          <h4 className=' text-center mt-2 ps-5'>Transaction Manager</h4>
          <div></div>
        </div>
        <div className="container col-12 col-md-5 pannel_login">
          <h1 className="text-center mt-md-4 mt-3 mb-4 text-decoration-underline" >LogIn</h1>
          <form>
            <label><FontAwesomeIcon icon={faUser} /> Username: <span>*</span></label>
            <input type="text" name='uname' className="form-control mb-2 mt-1" ref={Uname} placeholder='Enter UserName' />
            <label><FontAwesomeIcon icon={faKey} /> Password: <span>*</span></label>
            <input type="Password" name='passsword' className="pass_input form-control mb-2 mt-1" ref={Pass} placeholder='Enter Password' />
            <div className='pass_visibility form-control' onClick={visibility}><FontAwesomeIcon icon={icons} /></div>
            <h6 ref={msg} className='text-center text-danger text_display'>User not Approved, Wait For Approval From Admin.</h6>
            <h6 ref={msg_err} className='text-center text-danger text_display'>Wrong Username And Password</h6>
            <h6 ref={msg_empty} className='text-center text-danger text_display'>Mandatory Fields Can't be Empty.</h6>
            <div className='text-center pt-3'>
              <button onClick={login} className="btn btn-primary mb-1">LogIn</button><br />
              <span className="pb-2">Need An Account <Link to={'/signup'}>Click Here</Link> </span>
            </div>
          </form>
        </div>
      </div>
      <div className='align-items-baseline'>
        <Footer />
      </div>
    </div>
  )
}

export default Login
