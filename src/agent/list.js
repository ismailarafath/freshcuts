import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
    useLocation,
    useHistory,
    withRouter
} from "react-router-dom";
import { useContext } from 'react';

import { UrlContenxt } from '../App.js';
import logos from './../assets/Logo.png';
import DatePicker, { getYear } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AgentDashboard = () => {
    const urls = useContext(UrlContenxt);
    const [dinfos, setDinfos] = useState({});
    useEffect(() => {
        let isloaded = false;
        if(!isloaded){
            loadAllinfos();
            function loadAllinfos() {
                let fd = new FormData();
                fd.append('username', localStorage.getItem('username'));
                fd.append('usertoken', localStorage.getItem('usertoken'));
                fetch(`${urls.api}agents/dashboard.php`, {
                    method: "POST",
                    body: fd
                }).then(resp => resp.json())
                    .then(res => {
                        if (res.msg === "1") {
                            if (!isloaded){
                            setDinfos(res.data);
                            }
                        } else if (res.msg === "404") {
                            localStorage.removeItem('username');
                            localStorage.removeItem('usertoken');
                            localStorage.removeItem('userinfo');
                            window.location.href = "/";
                        } else {
                            alert(res.data)
                        }
                    })
            }
        }
        
        return () =>{
            isloaded = true;
        }
    }, [])
    return (
        <div className="naf-acc-router-container">
            <div className="naf-acc-router-main-head">
                <h3>HOME</h3>
            </div>
            <div className="naf-project-sub-container">
                <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                    <div className="naf-asm-table-row">
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                            Total Issue
                        </div>
                        <div className="naf-ams-table-cell table-lable">
                            {dinfos.tot_issue}
                        </div>
                    </div>
                    <div className="naf-asm-table-row">
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                            Total Amount
                        </div>
                        <div className="naf-ams-table-cell table-lable">
                            {dinfos.tot_amount}
                        </div>
                    </div>
                    <div className="naf-asm-table-row">
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                            Total Paid
                        </div>
                        <div className="naf-ams-table-cell table-lable">
                            {dinfos.tot_paid}
                        </div>
                    </div>
                    <div className="naf-asm-table-row">
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                            Current Balance
                        </div>
                        <div className="naf-ams-table-cell table-lable">
                            {dinfos.tot_balance}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AgentDashboard;