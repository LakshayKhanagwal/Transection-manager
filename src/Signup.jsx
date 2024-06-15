import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Firebase from './Firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faPhone, faEnvelope, faLocationDot, faBriefcase, faBriefcaseClock, faKey } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer'

const Signup = () => {
  const [data, setdata] = useState()
  const nevigate = useNavigate()
  const field_err = useRef()

  const Name = useRef()
  const Phone = useRef()
  const Email = useRef()
  const Address = useRef()
  const business_name = useRef()
  const business_type = useRef()
  const Uname = useRef()
  const Pass = useRef()

  const [email_check_state, set_email_check_state] = useState()
  const [phone_check_state, set_phone_check_state] = useState()
  const [username_check_state, set_username_check_state] = useState()

  function set(event) {
    setdata({ ...data, [event.target.name]: event.target.value })
  }
  function phone_check(event) {
    Firebase.child('users').orderByChild('phone').equalTo(event.target.value).on('value', function (phones) {
      if (phones.val()) {
        document.getElementById('signup').setAttribute('disabled', 'true')
        document.getElementById('phone_error').style.display = 'block'
        event.target.classList.remove('mb-2')
        var key = Object.keys(phones.val())
        set_phone_check_state(phones.val()[key].phone)
      } else {
        setdata({ ...data, [event.target.name]: event.target.value })
        event.target.setAttribute('class', 'form-control mt-1 mb-2')
        document.getElementById('phone_error').style.display = 'none'
        if (Email.current.value !== email_check_state && Uname.current.value !== username_check_state) {
          document.getElementById('signup').removeAttribute('disabled')
        }
      }
    })
  }
  function email_check(event) {
    Firebase.child('users').orderByChild('email').equalTo(event.target.value).on('value', function (mail) {
      if (mail.val()) {
        document.getElementById('signup').setAttribute('disabled', 'true')
        document.getElementById('mail_error').style.display = 'block'
        event.target.classList.remove('mb-2')
        set_email_check_state()
        var key = Object.keys(mail.val())
        set_email_check_state(mail.val()[key].email)
      } else {
        setdata({ ...data, [event.target.name]: event.target.value })
        event.target.setAttribute('class', 'form-control mt-1 mb-2')
        document.getElementById('mail_error').style.display = 'none'
        if (Phone.current.value !== phone_check_state && Uname.current.value !== username_check_state) {
          document.getElementById('signup').removeAttribute('disabled')
        }
      }
    })
  }
  function username_check(event) {
    Firebase.child('users').orderByChild('uname').equalTo(event.target.value).on('value', function (user) {
      if (user.val() || Uname.current.value === 'Admin' || Uname.current.value === 'admin') {
        document.getElementById('signup').setAttribute('disabled', 'true')
        document.getElementById('uname_error').style.display = 'block'
        event.target.classList.remove('mb-2')
        var key = Object.keys(user.val())
        set_username_check_state(user.val()[key].uname)
      } else {
        setdata({ ...data, [event.target.name]: event.target.value })
        event.target.setAttribute('class', 'form-control mt-1 mb-2')
        document.getElementById('uname_error').style.display = 'none'
        if (Phone.current.value !== phone_check_state && Email.current.value !== email_check_state) {
          document.getElementById('signup').removeAttribute('disabled')
        }
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
      field_err.current.style.display = 'block'
      setTimeout(() => {
        field_err.current.style.display = 'none'
      }, 2000);
    }
  }

  return (
    <div>
      <div className='signup'>
        <div className=' Header pe-4 pb-2'>
          <div></div>
          <h4 className=' text-center mt-2 ps-5 text-decoration-underline'>Create Account</h4>
          <div></div>
        </div>
        <div className="container">
          <h1 className="text-center mt-md-4 mt-3 mb-4 text-decoration-underline" >SignUp</h1>
          <form>
            <label><FontAwesomeIcon icon={faUser} /> Name: <span>*</span></label>
            <input type="text" name='Name' ref={Name} className="form-control mb-2 mt-1" onChange={set} placeholder='Enter your Name' />
            <label><FontAwesomeIcon icon={faPhone} /> Phone: <span>*</span></label>
            <input type="number" name='phone' className="form-control mt-1 mb-2" ref={Phone} onChange={phone_check} placeholder='Enter Phone Number' />
            <h6 id='phone_error' className="Error_text mb-2">Phone Number Already Exists</h6>
            <label><FontAwesomeIcon icon={faEnvelope} /> Email: <span>*</span></label>
            <input type="mail" name='email' className="form-control mb-2 mt-1" ref={Email} onChange={email_check} placeholder='Enter Your E-Mail' />
            <h6 id='mail_error' className="Error_text mb-2">E-mail Already Used</h6>
            <label><FontAwesomeIcon icon={faLocationDot} /> Address: <span>*</span></label>
            <textarea name='address' ref={Address} className="form-control mb-2 mt-1" onChange={set} placeholder='Enter Adderss' ></textarea>
            <label><FontAwesomeIcon icon={faBriefcase} /> Business Name: <span>*</span></label>
            <input type="text" name='business_name' ref={business_name} className="form-control mb-2 mt-1" onChange={set} placeholder='Enter Your Business Name' />
            <label><FontAwesomeIcon icon={faBriefcaseClock} /> Business Type: <span>*</span></label>
            <input type="text" name='business_type' ref={business_type} className="form-control mb-2 mt-1" onChange={set} placeholder='Enter Your Business Type' />
            <label><FontAwesomeIcon icon={faUser} /> Username: <span>*</span></label>
            <input type="text" name='uname' className="form-control mb-2 mt-1" ref={Uname} onChange={username_check} placeholder='Create UserName' />
            <h6 id='uname_error' className="Error_text mb-2">UserName Already Taken</h6>
            <label><FontAwesomeIcon icon={faKey} /> Password: <span>*</span></label>
            <input type="Password" name='password' className="form-control mb-2 mt-1" ref={Pass} onChange={set} placeholder='Create Password' />
            <h6 ref={field_err} className='text-center text-danger text_display'>All Fields Are Mandatory</h6>
            <div className='text-center pt-3 mb-2'>
              <button className="btn btn-primary mb-1" id='signup' onClick={signup}>SignUp</button><br />
              <span className="pb-2">Already Have Account <Link to={'/'}>Click Here</Link> </span>
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

export default Signup
