import React, { useEffect, useRef, useState } from 'react'
import Firebase from './Firebase'
import { useNavigate } from 'react-router-dom'
import Footer from './Footer'

const Admin = () => {
    const [data, setdata] = useState({})
    const [all_data, set_all_data] = useState({})
    const navigate = useNavigate()

    // Search
    const select_data = useRef()
    const search_data = useRef()

    useEffect(function () {
        Firebase.child('users').on('value', function (user) {
            setdata(user.val())
            set_all_data(user.val())
        })
    }, [])

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
            setdata(all_data)
        } else {
            var obj = {}
            Object.keys(all_data).map(function (user_key) {
                if (select_data.current.value === 'Name') {
                    if (all_data[user_key].Name.match(search_data.current.value)) {
                        obj[user_key] = all_data[user_key]
                    }
                } else if (select_data.current.value === 'Phone') {
                    if (all_data[user_key].phone.match(search_data.current.value)) {
                        obj[user_key] = all_data[user_key]
                    }
                } else if (select_data.current.value === 'E-mail') {
                    if (all_data[user_key].email.match(search_data.current.value)) {
                        obj[user_key] = all_data[user_key]
                    }
                }
                return (true)
            })
            if (Object.keys(obj).length === 0) {
                setdata()
            } else {
                setdata(obj)
            }
        }
    }

    function approval(key) {
        Firebase.child(`users/${key}`).once('value', function (appr) {
            if (appr.val().Approval === 'Approved') {
                Firebase.child(`users/${key}/Approval`).remove(err => {
                    if (err) {
                        alert('Some Error Occured')
                    } else {
                        alert('User Un-Approved')
                    }
                })
            } else {
                Firebase.child(`users/${key}`).update({ Approval: 'Approved' }, err => {
                    if (err) {
                        alert('Some Error Occured')
                    } else {
                        alert('User Approved')
                    }
                })
            }
        })
    }

    function del(user) {
        if (window.confirm('are you sure')) {
            Firebase.child(`users/${user}`).remove()
        }
    }

    function logout() {
        navigate('/')
    }
    return (
        <div>
            <div className='admin'>
                <div className=' Header pe-4 pb-2'>
                    <div></div>
                    <h4 className=' text-center mt-2'>Welcome Admin</h4>
                    <button className=' btn btn-danger mt-2' onClick={logout}>Logout</button>
                </div>
                <div className='container'>
                    <div className='mb-2 mt-3'>
                        <select className='select form-control bg-danger-subtle' ref={select_data} onChange={change_search_type}>
                            <option className='form-control' value="Name">Name</option>
                            <option className='form-control' value="Phone">Phone</option>
                            <option className='form-control' value="E-mail">E-mail</option>
                        </select>
                        <input type="search" ref={search_data} onChange={search_customers} className='search_admin form-control' placeholder='Search By Name' />
                    </div>
                    <table className=" table table-striped table-hover table-bordered mt-3">
                        <thead>
                            <tr className='text-center'>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>E-mail</th>
                                <th>Business Name</th>
                                <th>Business Type</th>
                                <th>UserName</th>
                                <th>Password</th>
                                <th>Status</th>
                                <th>Operations</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data ? Object.keys(data).map(function (user) {
                                    return (
                                        <tr key={user}>
                                            <td>{data[user].Name}</td>
                                            <td>{data[user].phone}</td>
                                            <td>{data[user].email}</td>
                                            <td>{data[user].business_name}</td>
                                            <td>{data[user].business_type}</td>
                                            <td>{data[user].uname}</td>
                                            <td>{data[user].password}</td>
                                            <td>{data[user].Approval ? data[user].Approval : "Not Approved"}</td>
                                            <td>
                                                <div>
                                                    <button className={data[user].Approval ? ' btn btn-warning me-1' : "btn btn-primary me-1"} onClick={() => approval(user)}>{data[user].Approval ? 'Un-Approve' : "Approved"}</button>
                                                    <button className='btn btn-danger' onClick={() => del(user)}>Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                }) :
                                    <tr>
                                        <td colSpan={9} className=' text-center'>No Record found</td>
                                    </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className='align-items-baseline'>
                <Footer />
            </div>
        </div>
    )
}

export default Admin
