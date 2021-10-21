import React, { useState, useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { UrlContenxt } from './../App.js';

const ChangePassword = () => {
    const urls = useContext(UrlContenxt);
    const userid = localStorage.getItem('username');
    const [password, setPassword] = useState('');
    const [newpass, setnewPassword] = useState('');
    const [renewpass, setrenewpass] = useState('');

    const updatepassword = (e) => {
        e.preventDefault();
        let fd = new FormData();
        fd.append('username', userid);
        fd.append('password', password);
        fd.append('passwordnew', renewpass);
        fetch(`${urls.api}changepass.php`, {
            method: "POST",
            body: fd,
        }).then(
            resp => resp.json()
        ).then(res => {
            if (res.msg === '1') {
                alert("updated");
                localStorage.removeItem('username');
                localStorage.removeItem('usertoken');
                localStorage.removeItem('userinfo');
                window.location.href = "/";
            } else {
                alert(res.data);
            }
        })
    }

    return (
        <div className="naf-acc-router-container">
            <div className="naf-acc-router-main-head">
                <h3>Change Password</h3>
            </div>
            <div className="naf-project-sub-container">
                <form onSubmit={updatepassword}>
                    <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">Current Password</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" className="arnewinput"></input>
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">New Password</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={newpass} onChange={(e) => { setnewPassword(e.target.value) }} type="password" className="arnewinput"></input>
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">New Password</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={renewpass} onChange={(e) => { setrenewpass(e.target.value) }} type="password" className="arnewinput"></input>
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable"></div>
                            <div className="naf-ams-table-cell table-inputs">
                                {
                                    password === '' ? <div className="error_box">* Enter Password</div> : ''
                                }
                                {
                                    newpass === '' ? <div className="error_box">* Enter New Password</div> : ''
                                }
                                {
                                    renewpass === '' ? <div className="error_box">* Enter Re-Type Password</div> : ''
                                }
                                {
                                    renewpass !== newpass ? <div className="error_box">* Check Your New Password</div> : ''
                                }
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable"></div>
                            <div className="naf-ams-table-cell table-inputs">
                                <button disabled={
                                    password === '' ||
                                    newpass === '' ||
                                    renewpass === '' ||
                                    renewpass !== newpass
                                } className="naf-ams-btn naf-ams-btn-primary">
                                    <i className="fa fa-check"></i>
                                    Update
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;