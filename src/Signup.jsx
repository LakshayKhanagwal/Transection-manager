import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Firebase from './Firebase'

const Signup = () => {
  const [data, setdata] = useState()
  const nevigate = useNavigate()

  const Name = useRef()
  const Phone = useRef()
  const Email = useRef()
  const Address = useRef()
  const business_name = useRef()
  const business_type = useRef()
  const Uname = useRef()
  const Pass = useRef()

  function set(event) {
    setdata({ ...data, [event.target.name]: event.target.value })
  }
  function phone_check(event) {
    Firebase.child('users').orderByChild('phone').equalTo(event.target.value).on('value', function (phones) {
      if (phones.val()) {
        document.getElementById('signup').setAttribute('disabled', 'true')
        document.getElementById('phone_error').style.display = 'block'
        event.target.classList.remove('mb-2')
      } else {
        setdata({ ...data, [event.target.name]: event.target.value })
        event.target.setAttribute('class', 'form-control mt-1 mb-2')
        document.getElementById('phone_error').style.display = 'none'
        document.getElementById('signup').removeAttribute('disabled')
      }
    })
  }
  function email_check(event) {
    Firebase.child('users').orderByChild('email').equalTo(event.target.value).on('value', function (mail) {
      if (mail.val()) {
        document.getElementById('signup').setAttribute('disabled', 'true')
        document.getElementById('mail_error').style.display = 'block'
        event.target.classList.remove('mb-2')
      } else {
        setdata({ ...data, [event.target.name]: event.target.value })
        event.target.setAttribute('class', 'form-control mt-1 mb-2')
        document.getElementById('mail_error').style.display = 'none'
        document.getElementById('signup').removeAttribute('disabled')
      }
    })
  }
  function username_check(event) {
    Firebase.child('users').orderByChild('uname').equalTo(event.target.value).on('value', function (user) {
      if (user.val()) {
        document.getElementById('signup').setAttribute('disabled', 'true')
        document.getElementById('uname_error').style.display = 'block'
        event.target.classList.remove('mb-2')
      } else {
        setdata({ ...data, [event.target.name]: event.target.value })
        event.target.setAttribute('class', 'form-control mt-1 mb-2')
        document.getElementById('uname_error').style.display = 'none'
        document.getElementById('signup').removeAttribute('disabled')
      }
    })
  }

  function signup(e) {
    e.preventDefault()
    if (Name.current.value !== "" && Phone.current.value !== "" && Email.current.value !== "" && Address.current.value !== "" && business_name.current.value !== "" && business_type.current.value !== "" && Uname.current.value !== "" && Pass.current.value !== "") {
      Firebase.child('users').push(data, err => {
        if (err) {
          alert('Some error occured')
        } else {
          alert('Account Created wait for admin approval')
          nevigate('/')
        }
      })
    } else {
      alert('All Fields Are Mandatory')
    }
  }

  return (
    <div className="container">
      <h1 className="text-center mt-md-5 mt-3 mb-4 text-decoration-underline" >SignUp</h1>
      <form>
        <label>Name: <span>*</span></label>
        <input type="text" name='Name' ref={Name} className="form-control mb-2 mt-1" onChange={set} placeholder='Enter your Name' />
        <label>Phone: <span>*</span></label>
        <input type="number" name='phone' className="form-control mt-1 mb-2" ref={Phone} onChange={phone_check} placeholder='Enter Phone Number' />
        <h6 id='phone_error' className="Error_text mb-2">Phone Number Already Exists</h6>
        <label>Email: <span>*</span></label>
        <input type="mail" name='email' className="form-control mb-2 mt-1" ref={Email} onChange={email_check} placeholder='Enter Your E-Mail' />
        <h6 id='mail_error' className="Error_text mb-2">E-mail Already Used</h6>
        <label>Address: <span>*</span></label>
        <textarea name='address' ref={Address} className="form-control mb-2 mt-1" onChange={set} placeholder='Enter Adderss' ></textarea>
        <label>Business Name: <span>*</span></label>
        <input type="text" name='business_name' ref={business_name} className="form-control mb-2 mt-1" onChange={set} placeholder='Enter Your Business Name' />
        <label>Business Type: <span>*</span></label>
        <input type="text" name='business_type' ref={business_type} className="form-control mb-2 mt-1" onChange={set} placeholder='Enter Your Business Type' />
        <label>Username: <span>*</span></label>
        <input type="text" name='uname' className="form-control mb-2 mt-1" ref={Uname} onChange={username_check} placeholder='Create UserName' />
        <h6 id='uname_error' className="Error_text mb-2">UserName Already Taken</h6>
        <label>Password: <span>*</span></label>
        <input type="Password" name='password' className="form-control mb-2 mt-1" ref={Pass} onChange={set} placeholder='Create Password' />
        <div className='text-center pt-3'>
          <button className="btn btn-primary mb-1" id='signup' onClick={signup}>SignUp</button><br />
          <span className="pb-2">Already Have Account <Link to={'/'}>Click Here</Link> </span>
        </div>
      </form>
    </div>
  )
}

export default Signup
