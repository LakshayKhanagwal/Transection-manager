import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Firebase from './Firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeftLong, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import Footer from './Footer'

const Transections = () => {
  const { key, customerkey } = useParams()
  const navigate = useNavigate()
  const [trans, settrans] = useState('')
  const [combine_transection, set_combine_transection] = useState()

  const [customer_details, set_customer_details] = useState()

  useEffect(function () {
    if (trans === '') {
      Firebase.child(`users/${key}/customer/${customerkey}/Transection`).on('value', function (transections) {
        settrans(transections.val())
      })
    }
  }, [key, customerkey, trans])

  useEffect(function () {
    if (trans) {
      set_combine_transection({ ...trans.credit, ...trans.debit })
    }
  }, [trans])

  useEffect(function () {
    Firebase.child(`users/${key}/customer/${customerkey}`).on('value', function (details) {
      set_customer_details(details.val())
    })
  }, [key, customerkey])

  function back() {
    navigate(`/Home/${key}`)
  }

  function logout() {
    navigate('/')
  }

  return (
    <div>
      <div className='Transaction'>
        <div className=' Header ps-3 pe-4 pb-2'>
          <button className='btn btn-warning mt-2' onClick={back}> <FontAwesomeIcon icon={faArrowLeftLong} /> Back</button>
          <h4 className=' text-center mt-2 ps-5'>Customer, <span className='text-decoration-underline'>{customer_details ? `${customer_details.name}'s` : ''}</span> Transactions </h4>
          <button className=' btn btn-danger mt-2' onClick={logout}><FontAwesomeIcon icon={faRightFromBracket} /> Logout</button>
        </div>
        <div className='container'>
          <div className='row p-2'>
            <div className='col-6'>
              <span>{customer_details ? customer_details.name : 'Name'}</span><br />
              <span>{customer_details ? customer_details.phone : 'Phone Number'}</span><br />
              <span>{customer_details ? customer_details.mail : 'E-Mail'}</span><br />
              <span className='text_weight'>Balance: </span>
              <span className='text_weight'>₹</span><span className='text_weight text-decoration-underline'>{customer_details ? customer_details.Balance : 'Nil'}</span>
            </div>
            <div className='col-6 d-flex justify-content-end'>
              <div className='text-end col-md-4 col-sm-9'>{customer_details ? customer_details.address : 'Address'}</div>
            </div>
          </div>
          <div className='table_customer'>
            <table className='table table-striped table-hover table-bordered'>
              <thead>
                <tr className='text-center'>
                  <th>Sr. No.</th>
                  <th>Item</th>
                  <th>Date</th>
                  <th style={{ width: '15%' }}>Quantity</th>
                  <th style={{ width: '15%' }}>Price</th>
                  <th style={{ width: '15%' }}>Paid Amount</th>
                  <th style={{ width: '17%' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {
                  combine_transection ? Object.keys(combine_transection).map(function (key, index) {
                    return (
                      <tr key={key}>
                        <td style={{ width: '10%' }} className='text-center'>{index + 1}</td>
                        <td className={combine_transection[key].Item ? '' : 'text_weight'}>{combine_transection[key].Item ? combine_transection[key].Item : 'Payment'}</td>
                        <td>asd</td>
                        <td>{combine_transection[key].Quantity ? combine_transection[key].Quantity : '-'}</td>
                        <td>{combine_transection[key].Item ? combine_transection[key].Amount : '-'}</td>
                        <td className={combine_transection[key].Item ? '' : 'text_weight'}>{combine_transection[key].Item ? '-' : `-${combine_transection[key].Amount}`}</td>
                        <td className={combine_transection[key].Item ? '' : 'text_weight'}>{combine_transection[key].Quantity ? combine_transection[key].Quantity * combine_transection[key].Amount : `-${combine_transection[key].Amount}`}</td>
                      </tr>
                    )
                  }) : <tr>
                    <td colSpan={5} className='text-center'>No Record Found</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className='align-items-baseline'>
        <Footer />
      </div>
    </div>
  )
}

export default Transections
