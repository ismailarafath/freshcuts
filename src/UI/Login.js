import { React, useState, useEffect, useContext } from 'react';
import { useLocation, useHistory } from 'react-router';
import { UrlContenxt } from '../App';
import logos from './../assets/Logo.png';
import bgimg from './bgimg.jpg';
const Login = () => {
    const ulrs = useContext(UrlContenxt);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errormsg, setErrormsg] = useState('');
    let history = useHistory();
    // let location = useLocation();
    const loginprocess = (e) => {
        setErrormsg("Checking...");
        e.preventDefault();
        console.log('working');
        var fd = new FormData();
        fd.append('username', username);
        fd.append('password', password);
        fetch(`${ulrs.api}login.php`, {
            method: "POST",
            body: fd,
        }).then(resp => resp.json()).then((res) => {
            if (res.msg === "1") {
                localStorage.setItem('username', res.data.auth_username);
                localStorage.setItem('usertoken', res.data.auth_token);
                localStorage.setItem('userinfo', JSON.stringify(res.data));
                window.location.reload();
            } else {
                setErrormsg(res.data + " Or Your Account Blocked By Super Admin Contact your Superadmin");
            }
        })

    }
    return (
        <div className="d-lg-flex half" style={{
            backgroundImage: `url(${bgimg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: 'contain',
        }}>
            <div className="contents order-2 order-md-1">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-md-7" style={{
                            background: "#fff",
                            border: "1px solid #e3e3e3",
                            boxSizing: "border-box",
                            boxShadow: "20px 12px 20px #0000001c",
                            padding: "25px"
                        }}>
                            <div style={{
                                display: "flex",
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <img src={logos} style={{ width: "100px" }} />
                                <h3>CARE TRAVEL ASSISTANCE</h3>

                            </div>
                            <div style={{ display: "flex", flexDirection: "row-reverse" }}><h6 style={{ color: 'maroon' }}>For Better Journey</h6></div>
                            <form onSubmit={loginprocess}>
                                <div className="form-group first">
                                    <label>Username</label>
                                    <input type="text" onKeyUp={(e) => {
                                        setUsername(e.target.value)
                                    }} className="form-control" placeholder="User Name" id="username" />
                                </div>
                                <div className="form-group last mb-3">
                                    <label>Password</label>
                                    <input type="password" onKeyUp={(e) => {
                                        setPassword(e.target.value)
                                    }} className="form-control" placeholder="Password" id="password" />
                                </div>
                                <div className="d-flex mb-5 align-items-center" style={{ color: 'red' }}>
                                    {errormsg}
                                </div>
                                <button disabled={username === '' || password === ''} type="submit" className="btn btn-block btn-primary">
                                    Log in
                                </button>
                            </form>
                            <div className="footerdiv">Care Travel Assistance | 3rd Floor, Amera Tower, ABD Road, TS, India |
                                 email support@care-ta.com
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Login;