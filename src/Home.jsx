import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Firebase from './Firebase'
import Transections from './Transections'

const Home = () => {
  const Phone = useRef()
  const Mail = useRef()

  const phone_error = useRef()
  const mail_error = useRef()
  const btn_add_customer = useRef()

  // Customer key
  const [customer_key, setcustomer_key] = useState()

  //Credit ref's
  const [total_balance, set_total_balance] = useState('')
  const Credit = useRef()
  const item = useRef('')
  const amount = useRef('')
  const quantity = useRef('')
  const [creditstate, setcreditstate] = useState({})

  //debit ref's
  const [total_balance_debit, set_total_balance_debit] = useState('')
  const [debitstate, setdebitstate] = useState({})
  const debit = useRef()
  const amount_debit = useRef('')

  const [user_mail, setuser_mail] = useState({})
  const [user_phone, setuser_phone] = useState({})

  const [user, setuser] = useState({})
  const [data, setdata] = useState({ Balance: 0 })
  const [customer_details, setcustomer_details] = useState()

  const navigate = useNavigate()
  const { key } = useParams()

  useEffect(function () {
    if (localStorage.getItem('validation') === 'true') {
      localStorage.setItem('validation', 'false')
      // window.location.reload()
    }
  }, [])

  useEffect(function () {
    Firebase.child(`users/${key}`).on('value', function (user) {
      setuser(user.val())
    })
  }, [key])

  useEffect(function () {
    Firebase.child(`users/${key}/customer`).on('value', function (customer) {
      setcustomer_details(customer.val())
    })
  }, [key])

  useEffect(function () {
    if (total_balance !== '') {
      Firebase.child(`users/${key}`).child(`customer/${customer_key}`).update({ Balance: total_balance }, err => {
        if (err) {
          alert('Some Error Occured')
        } else {
          alert('transection save')
          set_total_balance('')
          setcreditstate({})
          item.current.value = ''
          amount.current.value = ''
          quantity.current.value = ''
        }
      })
    }
  }, [total_balance, customer_key, key])

  useEffect(function () {
    if (total_balance_debit !== '') {
      Firebase.child(`users/${key}`).child(`customer/${customer_key}`).update({ Balance: total_balance_debit }, err => {
        if (err) {
          alert('Some Error Occured')
        } else {
          setdebitstate({})
          set_total_balance_debit('')
          alert('Transection Saved')
        }
      })
    }
  }, [total_balance_debit, customer_key, key])

  function logout() {
    navigate('/')
  }

  function set(event) {
    setdata({ ...data, [event.target.name]: event.target.value })
  }

  function add_customer(e) {
    e.preventDefault()
    if (data.name && data.phone && data.mail && data.address) {
      Firebase.child(`users/${key}/customer`).push(data, err => {
        if (err) {
          alert('Some Error Occured')
        } else {
          alert('Customer added Successfully')
        }
      })
    } else {
      alert('All Fields Are Mendatory')
    }
  }

  function phone_check(event) {
    Firebase.child(`users/${key}/customer`).orderByChild('phone').equalTo(Phone.current.value).on('value', function (phone) {
      if (phone.val()) {
        btn_add_customer.current.setAttribute('disabled', '')
        phone_error.current.style.display = 'block'
        event.target.classList.remove('mb-2')
        var key = Object.keys(phone.val())
        setuser_phone(phone.val()[key].phone)
      } else {
        setdata({ ...data, [event.target.name]: event.target.value })
        event.target.setAttribute('class', 'form-control mt-1 mb-2')
        phone_error.current.style.display = 'none'
        if (Mail.current.value !== user_mail) {
          btn_add_customer.current.removeAttribute('disabled')
        }
      }
    })
  }

  function mail_check(event) {
    Firebase.child(`users/${key}/customer`).orderByChild('mail').equalTo(Mail.current.value).on('value', function (mails) {
      if (mails.val()) {
        btn_add_customer.current.setAttribute('disabled', '')
        mail_error.current.style.display = 'block'
        event.target.classList.remove('mb-2')
        var key = Object.keys(mails.val())
        setuser_mail(mails.val()[key].mail)
      } else {
        setdata({ ...data, [event.target.name]: event.target.value })
        event.target.setAttribute('class', 'form-control mt-1 mb-2')
        mail_error.current.style.display = 'none'
        if (Phone.current.value !== user_phone) {
          btn_add_customer.current.removeAttribute('disabled')
        }
      }
    })
  }

  function Transection(customerkey) {
    navigate(`/Transections/${key}/${customerkey}`)
    return (
      <Transections cukey={customerkey} />
    )

  }

  //Credit functions

  function credit_page(key) {
    Credit.current.style.display = 'flex'
    setcustomer_key(key)
  }

  function credit_set(event) {
    setcreditstate({ ...creditstate, [event.target.name]: event.target.value })
  }

  function add_credit(e) {
    e.preventDefault()
    if (item.current.value && amount.current.value && quantity.current.value) {
      Firebase.child(`users/${key}/customer/${customer_key}/Transection/credit`).push(creditstate, err => {
        if (err) {
          alert('Some Error Occured')
        } else {
          set_total_balance(parseInt(customer_details[customer_key].Balance) + (creditstate.Amount * creditstate.Quantity))
        }
      })
    } else {
      alert('All fields are Mandatory');
    }
  }

  function credit_close(e) {
    e.preventDefault()
    Credit.current.style.display = 'none'
    set_total_balance('')
    setcreditstate()
    item.current.value = ''
    amount.current.value = ''
    quantity.current.value = ''
  }

  //debit functions

  function debit_page(key) {
    debit.current.style.display = 'flex'
    setcustomer_key(key)
  }

  function debit_set(event) {
    setdebitstate({ [event.target.name]: event.target.value })
  }

  function debit_amount(e) {
    e.preventDefault()
    if (amount_debit.current.value) {
      Firebase.child(`users/${key}/customer/${customer_key}/Transection/debit`).push(debitstate, err => {
        if (err) {
          alert('Some Error Occured')
        } else {
          set_total_balance_debit(parseInt(customer_details[customer_key].Balance) - debitstate.Amount)
          amount_debit.current.value = ''
        }
      })
    } else {
      alert('All Fields Are Mandatory')
    }

  }

  function debit_close(e) {
    e.preventDefault()
    debit.current.style.display = 'none'
    amount_debit.current.value = ''
  }

  return (
    <div>
      <div className=' Header pe-4 pb-2'>
        <div></div>
        <h4 className=' text-center mt-2 ps-5'>Welcome, {user.Name ? user.Name : 'User'}</h4>
        <button className=' btn btn-danger mt-2' onClick={logout}>Logout</button>
      </div>
      <div className='container'>
        <h1 className=' text-center mt-3 mb-2'>Customer Details</h1>
        <form>
          <label>Name:<span>*</span></label>
          <input type="text" className="form-control mb-2 mt-1" name='name' onChange={set} placeholder='Enter Customer Name' />
          <label>Phone:<span>*</span></label>
          <input type="number" className="form-control mb-2 mt-1" name='phone' ref={Phone} onChange={phone_check} placeholder='Enter Customer Phone Number' />
          <h6 ref={phone_error} className="Error_text mb-2">Phone Number Already Exists</h6>
          <label>E-mail:<span>*</span></label>
          <input type="mail" className="form-control mb-2 mt-1" name='mail' ref={Mail} onChange={mail_check} placeholder='Enter Customer E-mail' />
          <h6 ref={mail_error} className="Error_text mb-2">E-mail Already Used</h6>
          <label>Address:<span>*</span></label>
          <textarea type="text" className="form-control mb-2 mt-1" name='address' onChange={set} placeholder='Enter Customer Address' />
          <button className='btn btn-primary mt-2' ref={btn_add_customer} onClick={add_customer}>Add Customer</button>
        </form>
      </div>
      <div className='container-fluid mt-3'>
        <h1 className='text-center mb-4 mt-2'>Customer Record</h1>
        <h6 className='text-end pe-3'>Help</h6>
        <table className=' table table-striped table-hover table-bordered'>
          <thead>
            <tr className='text-center'>
              <th>Name</th>
              <th>Phone</th>
              <th style={{ width: '16%' }}>E-mail</th>
              <th style={{ width: '25%' }}>Address</th>
              <th style={{ width: '15%' }}>Balance Amount</th>
              <th style={{ width: '8%' }}>Transections</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {
              customer_details ? Object.keys(customer_details).map(function (key) {
                return (
                  <tr key={key} className='text-center'>
                    <td>{customer_details[key].name}</td>
                    <td>{customer_details[key].phone}</td>
                    <td>{customer_details[key].mail}</td>
                    <td>{customer_details[key].address}</td>
                    <td>{customer_details[key].Balance}</td>
                    <td><button className='btn btn-primary' onClick={() => Transection(key)}>View</button></td>
                    <td>
                      <button className=" btn btn-primary me-1" onClick={() => credit_page(key)}>+</button>
                      <button className=" btn btn-warning" onClick={() => debit_page(key)}>--</button>
                      <button className=" btn btn-danger ms-1">X</button>
                    </td>
                  </tr>
                )
              }) :
                <tr>
                  <td colSpan={7} className='text-center'>No Record Found</td>
                </tr>
            }
          </tbody>
        </table>
      </div>
      <div ref={Credit} className='add_money'>
        <div className='bg-white border border-2 border-primary rounded-1 col-3'>
          <h1 className='text-center bg-primary pb-2 text-light'>Credit</h1>
          <form className='container pb-2'>
            <label>Item:<span>*</span></label>
            <input type="text" name='Item' ref={item} onChange={credit_set} className='form-control mt-1 mb-2' placeholder='Enter Item Name' />
            <label>Amount:<span>*</span></label>
            <input type="number" name='Amount' ref={amount} onChange={credit_set} className='form-control mt-1 mb-2' placeholder='Enter Item Cost' />
            <label>Quantity:<span>*</span></label>
            <input type="number" name='Quantity' ref={quantity} onChange={credit_set} className='form-control mt-1' placeholder='Enter Quantity of item' />
            <div className='text-center mt-3'>
              <button className='btn btn-primary me-1' onClick={add_credit}>Add Amount</button>
              <button className='btn btn-danger ms-1' onClick={credit_close}>Close</button>
            </div>
          </form>
        </div>
      </div>
      <div ref={debit} className='add_money'>
        <div className='bg-white border border-2 border-warning rounded-1 col-3'>
          <h1 className='text-center bg-warning pb-2 text-light'>debit</h1>
          <form className='container pb-2'>
            <label>Amount:<span>*</span></label>
            <input type="number" name='Amount' ref={amount_debit} onChange={debit_set} className='form-control mt-1 mb-2' placeholder='Enter Amount Paid By Customer' />
            <div className='text-center mt-3'>
              <button className='btn btn-warning me-1' onClick={debit_amount}>debit Amount</button>
              <button className='btn btn-danger ms-1' onClick={debit_close}>Close</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
export default Home