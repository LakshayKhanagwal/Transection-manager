import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Firebase from './Firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer'

const Login = () => {
  const Uname = useRef('')
  const Pass = useRef('')
  const msg = useRef()
  const msg_err = useRef()
  const msg_empty = useRef()
  const navigate = useNavigate()

  function login(event) {
    event.preventDefault()
    if (Uname.current.value === '' || Pass.current.value === '') {
      msg_empty.current.style.display='block'
      setTimeout(() => {
        msg_empty.current.style.display = 'none'
      }, 3000);
    } else {
      if (Uname.current.value === 'Admin' && Pass.current.value === 'Admin@123') {
        navigate('/Admin')
      } else {
        Firebase.child('users').orderByChild('uname').equalTo(Uname.current.value).on('value', function (user) {
          if (user.val()) {
            var key = Object.keys(user.val())
            if (user.val()[key].password === Pass.current.value) {
              if (user.val()[key].Approval) {
                msg.current.style.display = 'none'
                localStorage.setItem('validation', 'true')
                navigate(`/Home/${key}`)
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
            <input type="Password" name='passsword' className="form-control mb-2 mt-1" ref={Pass} placeholder='Enter Password' />
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
