import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Firebase from './Firebase'

const Login = () => {
  const Uname = useRef()
  const Pass = useRef()
  const msg = useRef()
  const navigate = useNavigate()

  function login(event) {
    if (Uname.current.value === 'Admin' && Pass.current.value === 'Admin@123') {
      navigate('/Admin')
    } else {
      event.preventDefault()
      Firebase.child('users').orderByChild('uname').equalTo(Uname.current.value).on('value', function (user) {
        if (user.val()) {
          var key = Object.keys(user.val())
          if (user.val()[key].password === Pass.current.value) {
            if (user.val()[key].Approval) {
              msg.current.style.display = 'none'
              localStorage.setItem('validation','true')
              navigate(`/Home/${key}`)
            } else {
              msg.current.style.display = 'block'
            }
          } else {
            alert('Wrong UserName And Password')
          }
        } else {
          alert('Wrong UserName And Password')
        }
      })
    }
  }
  return (
    <div className="container">
      <h1 className="text-center mt-md-5 mt-3 mb-4 text-decoration-underline" >LogIn</h1>
      <form>
        <label>Username: <span>*</span></label>
        <input type="text" name='uname' className="form-control mb-2 mt-1" ref={Uname} placeholder='Enter UserName' />
        <label>Password: <span>*</span></label>
        <input type="Password" name='passsword' className="form-control mb-2 mt-1" ref={Pass} placeholder='Enter Password' />
        <h6 ref={msg} className='text-center text-danger text_display'>User not Approved, Wait For Approval From Admin.</h6>
        <div className='text-center pt-3'>
          <button onClick={login} className="btn btn-primary mb-1">LogIn</button><br />
          <span className="pb-2">Need An Account <Link to={'/signup'}>Click Here</Link> </span>
        </div>
      </form>
    </div>
  )
}

export default Login
