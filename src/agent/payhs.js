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

const PaymentHistory = () => {
    const urls = useContext(UrlContenxt);
    const [ph, setPh] = useState([]);
    useEffect(() => {
        let fd = new FormData();
        fd.append('username', localStorage.getItem('username'));
        fd.append('usertoken', localStorage.getItem('usertoken'));

        fetch(`${urls.api}agents/paymentn.php`, {
            method: "POST",
            body: fd
        }).then(resp => resp.json())
            .then(res => {
                if (res.msg === "1") {
                    setPh(res.data);
                } else if (res.msg === "404") {
                    localStorage.removeItem('username');
                    localStorage.removeItem('usertoken');
                    localStorage.removeItem('userinfo');
                    window.location.href = "/";
                } else {
                    alert(res.data);
                }
            }).catch(e => console.log(e));
    }, [])
    return (
        <div className="naf-acc-router-container">
            <div className="naf-acc-router-main-head">
                <h3>Payment History</h3>
            </div>
            <div className="naf-project-sub-container">
                <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                    <div className="naf-asm-table-row">
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "20px" }}>
                            SNO
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                            DATE
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                            AMOUNT
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                            METHOD
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                            NOTES
                        </div>
                    </div>
                    {ph.map((i, index) => {
                        return (

                            <PaymentListDiv key={index} index={index} datas={i} />
                        )
                    })}
                </div>

            </div>
        </div>
    )
}

const PaymentListDiv = ({ index, datas }) => {
    return (
        <div className="naf-asm-table-row">
            <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "20px" }}>
                {index + 1}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view">
                {datas.pdate_d}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view">
                {datas.pamount}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view">
                {datas.pvia}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view">
                {datas.pnotes}
            </div>
        </div>
    )
}

export default PaymentHistory;