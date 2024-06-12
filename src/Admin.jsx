import React, { useEffect, useState } from 'react'
import Firebase from './Firebase'
import { useNavigate } from 'react-router-dom'

const Admin = () => {
    const [data, setdata] = useState({})
    const navigate = useNavigate()
    useEffect(function () {
        Firebase.child('users').on('value', function (user) {
            setdata(user.val())
        })
    }, [])
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
            <div className=' Header pe-4 pb-2'>
                <div></div>
                <h4 className=' text-center mt-2'>Welcome Admin</h4>
                <button className=' btn btn-danger mt-2' onClick={logout}>Logout</button>
            </div>
            <div className='container'>
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
    )
}

export default Admin