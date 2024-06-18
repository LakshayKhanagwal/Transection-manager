import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Firebase from './Firebase'
import Transections from './Transections'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faPhone, faEnvelope, faLocationDot, faRightFromBracket, faTrash, faPlus, faSubtract, faCookieBite, faIndianRupee, faBoxesStacked } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer'

const Home = () => {
  const main = useRef()
  const { security_key } = useParams()

  const name = useRef()
  const Phone = useRef()
  const Mail = useRef()
  const address = useRef()

  const field_err = useRef()
  const customer_success = useRef()

  const phone_error = useRef()
  const mail_error = useRef()
  const btn_add_customer = useRef()

  // Date and Time
  const date = new Date()
  const date_transection = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  const time_transection = date.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
  const complete_date_time = `${date_transection}/${time_transection}`

  // Search
  const select_data = useRef()
  const search_data = useRef()

  // Customer key
  const [customer_key, setcustomer_key] = useState()

  //Credit ref's
  const [total_balance, set_total_balance] = useState('')
  const Credit = useRef()
  const item = useRef('')
  const amount = useRef('')
  const quantity = useRef('')
  const [creditstate, setcreditstate] = useState({})
  const field_err_credit = useRef()
  const field_err_credit_success = useRef()

  //debit ref's
  const [total_balance_debit, set_total_balance_debit] = useState('')
  const [debitstate, setdebitstate] = useState({})
  const debit = useRef()
  const amount_debit = useRef('')
  const field_err_debit = useRef()
  const field_err_debit_success = useRef()

  const [user_mail, setuser_mail] = useState({})
  const [user_phone, setuser_phone] = useState({})

  const [user, setuser] = useState({})
  const [data, setdata] = useState({ Balance: 0 })
  const [customer_details, setcustomer_details] = useState()
  const [all_customer_details, set_all_customer_details] = useState()

  const navigate = useNavigate()
  const { key } = useParams()

  useEffect(function () {
    setcreditstate({ 'date_time': complete_date_time })
    setdebitstate({ 'date_time': complete_date_time })
  }, [complete_date_time])
  console.log(debitstate);

  useEffect(function () {
    if (localStorage.getItem('validation') === security_key) {
      main.current.style.display = 'block'
    } else {
      navigate('/')
    }
  }, [security_key, navigate])

  useEffect(function () {
    Firebase.child(`users/${key}`).on('value', function (user) {
      setuser(user.val())
    })
  }, [key])

  useEffect(function () {
    Firebase.child(`users/${key}/customer`).on('value', function (customer) {
      setcustomer_details(customer.val())
      set_all_customer_details(customer.val())
    })
  }, [key])

  useEffect(function () {
    if (total_balance !== '') {
      Firebase.child(`users/${key}`).child(`customer/${customer_key}`).update({ Balance: total_balance }, err => {
        if (err) {
          alert('Some Error Occured')
        } else {
          field_err_credit_success.current.style.display = 'block'
          set_total_balance('')
          setcreditstate({})
          item.current.value = ''
          amount.current.value = ''
          quantity.current.value = ''
          setTimeout(() => {
            field_err_credit_success.current.style.display = 'none'
          }, 2000);
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
          field_err_debit_success.current.style.display = 'block'
          setTimeout(() => {
            field_err_debit_success.current.style.display = 'none'
          }, 2000);
        }
      })
    }
  }, [total_balance_debit, customer_key, key])

  function logout() {
    localStorage.removeItem('validation')
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
          name.current.value = ''
          Phone.current.value = ''
          Mail.current.value = ''
          address.current.value = ''
          setuser_mail({})
          Mail.current.setAttribute('class', 'form-control mt-1 mb-2')
          mail_error.current.style.display = 'none'
          setuser_phone({})
          Phone.current.setAttribute('class', 'form-control mt-1 mb-2')
          phone_error.current.style.display = 'none'
          btn_add_customer.current.removeAttribute('disabled')
          setdata({ Balance: 0 })
          customer_success.current.style.display = 'block'
          setTimeout(() => {
            customer_success.current.style.display = 'none'
          }, 3000);
        }
      })
    } else {
      field_err.current.style.display = 'block'
      setTimeout(() => {
        field_err.current.style.display = 'none'
      }, 3000);
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
    navigate(`/Transections/${key}/${customerkey}/${security_key}`)
    return (
      <Transections cukey={customerkey} />
    )

  }

  function delete_customer(keys_customer) {

    Firebase.child(`users/${key}/customer/${keys_customer}`).once('value', function (user_data) {
      if (user_data.val().Balance !== 0) {
        alert('First Clear The Balance')
      } else if (window.confirm('Are you Sure, Once Deleted Never Restored.')) {
        Firebase.child(`users/${key}/customer/${keys_customer}`).remove()
      }
    })
  }

  //search Functions

  function change_search_type() {
    console.log(select_data.current.value);
    if (select_data.current.value === 'Name') {
      search_data.current.placeholder = 'Search By Name'
    } else if (select_data.current.value === 'Phone') {
      search_data.current.placeholder = 'Search By phone number'
    } else if (select_data.current.value === 'E-mail') {
      search_data.current.placeholder = 'Search By E-mail'
    }
  }

  function search_customers(event) {
    if (event.target.value === '') {
      setcustomer_details(all_customer_details)
    } else {
      var obj = {}
      Object.keys(all_customer_details).map(function (cust_keys) {
        if (select_data.current.value === 'Name') {
          if (all_customer_details[cust_keys].name.match(search_data.current.value)) {
            obj[cust_keys] = all_customer_details[cust_keys]
          }
        } else if (select_data.current.value === 'Phone') {
          if (all_customer_details[cust_keys].phone.match(search_data.current.value)) {
            obj[cust_keys] = all_customer_details[cust_keys]
          }
        } else if (select_data.current.value === 'E-mail') {
          if (all_customer_details[cust_keys].mail.match(search_data.current.value)) {
            obj[cust_keys] = all_customer_details[cust_keys]
          }
        }
        return (true)
      })
      if (Object.keys(obj).length === 0) {
        setcustomer_details()
      } else {
        setcustomer_details(obj)
      }
    }
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
      field_err_credit.current.style.display = 'block'
      setTimeout(() => {
        field_err_credit.current.style.display = 'none'
      }, 2000);
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
    setdebitstate({ ...debitstate,[event.target.name]: event.target.value })
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
      field_err_debit.current.style.display = 'block'
      setTimeout(() => {
        field_err_debit.current.style.display = 'none'
      }, 2000);
    }

  }

  function debit_close(e) {
    e.preventDefault()
    debit.current.style.display = 'none'
    amount_debit.current.value = ''
  }

  return (
    <div ref={main}>
      <div className='home'>
        <div className=' Header pe-4 pb-2'>
          <div></div>
          <h4 className=' text-center mt-2 ps-5'>Welcome, {user.Name ? user.Name : 'User'}</h4>
          <button className=' btn btn-danger mt-2' onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /> Logout</button>
        </div>
        <div className='container'>
          <h1 className=' text-center mt-3 mb-2'>Customer Details</h1>
          <form>
            <label><FontAwesomeIcon icon={faUser} /> Name:<span>*</span></label>
            <input type="text" className="form-control mb-2 mt-1" name='name' ref={name} onChange={set} placeholder='Enter Customer Name' />
            <label><FontAwesomeIcon icon={faPhone} /> Phone:<span>*</span></label>
            <input type="number" className="form-control mb-2 mt-1" name='phone' ref={Phone} onChange={phone_check} placeholder='Enter Customer Phone Number' />
            <h6 ref={phone_error} className="Error_text mb-2">Phone Number Already Exists</h6>
            <label><FontAwesomeIcon icon={faEnvelope} /> E-mail:<span>*</span></label>
            <input type="mail" className="form-control mb-2 mt-1" name='mail' ref={Mail} onChange={mail_check} placeholder='Enter Customer E-mail' />
            <h6 ref={mail_error} className="Error_text mb-2">E-mail Already Used</h6>
            <label><FontAwesomeIcon icon={faLocationDot} /> Address:<span>*</span></label>
            <textarea type="text" className="form-control mb-2 mt-1" name='address' ref={address} onChange={set} placeholder='Enter Customer Address' />
            <h6 ref={field_err} className='text-danger text_display'>All Fields Are Mandatory</h6>
            <h6 ref={customer_success} className='text-success text_display'>Customer Added Successfully</h6>
            <button className='btn btn-primary mt-2' ref={btn_add_customer} onClick={add_customer}>Add Customer</button>
          </form>
        </div>
        <div className='container-fluid mt-3'>
          <h1 className='text-center mb-4 mt-2'>Customer Record</h1>
          <div className='mb-2'>
            <select className='select form-control bg-danger-subtle' ref={select_data} onChange={change_search_type}>
              <option className='form-control' value="Name">Name</option>
              <option className='form-control' value="Phone">Phone</option>
              <option className='form-control' value="E-mail">E-mail</option>
            </select>
            <input type="search" ref={search_data} onChange={search_customers} className='search form-control' placeholder='Search By Name' />
          </div>
          <h6 className='text-end pe-3'>Help</h6>
          <div className='table_customer'>
            <table className=' table table-striped table-hover table-bordered'>
              <thead>
                <tr className='text-center'>
                  <th>Sr. No.</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th style={{ width: '16%' }}>E-mail</th>
                  <th style={{ width: '25%' }}>Address</th>
                  <th style={{ width: '15%' }}>Balance Amount</th>
                  <th style={{ width: '8%' }}>Transactions</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {
                  customer_details ? Object.keys(customer_details).map(function (key, index) {
                    return (
                      <tr key={key} className='text-center'>
                        <td>{index + 1}</td>
                        <td>{customer_details[key].name}</td>
                        <td>{customer_details[key].phone}</td>
                        <td>{customer_details[key].mail}</td>
                        <td>{customer_details[key].address}</td>
                        <td>{customer_details[key].Balance}</td>
                        <td><button className='btn btn-primary' onClick={() => Transection(key)}>View</button></td>
                        <td>
                          <button className=" btn btn-primary me-1" onClick={() => credit_page(key)}><FontAwesomeIcon icon={faPlus} /></button>
                          <button className=" btn btn-warning" onClick={() => debit_page(key)}><FontAwesomeIcon icon={faSubtract} /></button>
                          <button className=" btn btn-danger ms-1" onClick={() => delete_customer(key)}><FontAwesomeIcon icon={faTrash} /></button>
                        </td>
                      </tr>
                    )
                  }) :
                    <tr>
                      <td colSpan={8} className='text-center'>No Record Found</td>
                    </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        <div ref={Credit} className='add_money'>
          <div className='bg-white border border-2 border-primary rounded-1 col-md-3 col-9'>
            <h1 className='text-center bg-primary pb-2 text-light'>Credit</h1>
            <form className='container pb-2'>
              <label><FontAwesomeIcon icon={faCookieBite} /> Item:<span>*</span></label>
              <input type="text" name='Item' ref={item} onChange={credit_set} className='form-control mt-1 mb-2' placeholder='Enter Item Name' />
              <label><FontAwesomeIcon icon={faIndianRupee} /> Amount:<span>*</span></label>
              <input type="number" name='Amount' ref={amount} onChange={credit_set} className='form-control mt-1 mb-2' placeholder='Enter Item Cost' />
              <label><FontAwesomeIcon icon={faBoxesStacked} /> Quantity:<span>*</span></label>
              <input type="number" name='Quantity' ref={quantity} onChange={credit_set} className='form-control mt-1' placeholder='Enter Quantity of item' />
              <h6 ref={field_err_credit} className='text-danger text_display'>All Fields Are Mandatory</h6>
              <h6 ref={field_err_credit_success} className='text-success text_display'>Transection Saved</h6>
              <div className='text-center mt-3'>
                <button className='btn btn-primary me-1' onClick={add_credit}>Add Amount</button>
                <button className='btn btn-danger ms-1' onClick={credit_close}>Close</button>
              </div>
            </form>
          </div>
        </div>
        <div ref={debit} className='add_money'>
          <div className='bg-white border border-2 border-warning rounded-1 col-md-3 col-9'>
            <h1 className='text-center bg-warning pb-2 text-light'>debit</h1>
            <form className='container pb-2'>
              <label><FontAwesomeIcon icon={faIndianRupee} /> Amount:<span>*</span></label>
              <input type="number" name='Amount' ref={amount_debit} onChange={debit_set} className='form-control mt-1 mb-2' placeholder='Enter Amount Paid By Customer' />
              <h6 ref={field_err_debit} className='text-danger text_display'>This Field Can't Be Empty</h6>
              <h6 ref={field_err_debit_success} className='text-success text_display'>Transection Saved</h6>
              <div className='text-center mt-3'>
                <button className='btn btn-warning me-1' onClick={debit_amount}>debit Amount</button>
                <button className='btn btn-danger ms-1' onClick={debit_close}>Close</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='align-items-baseline'>
        <Footer />
      </div>
    </div>
  )
}
export default Home