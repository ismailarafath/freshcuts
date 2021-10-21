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

import { UrlContenxt } from './../App.js';
import logos from './../assets/Logo.png';
import DatePicker, { getYear } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const NewCertificate = () => {

    const [agentlist, setAgentList] = useState([]);
    const [planlist, setPlanlist] = useState([]);
    const [countrylist, setCountrylist] = useState([]);
    const urls = useContext(UrlContenxt);
    //const api = "http://localhost:8082/sabeel/dhabitours/api/";
    const api = urls.api;
    const [startDate, setStartDate] = useState(new Date());
    const [user_name, setUser_name] = useState('');
    const [user_dob, setuser_dob] = useState('');
    const [user_passport_no, setuser_passport_no] = useState('');
    const [user_DESTINATION, setuser_DESTINATION] = useState('UNITED ARAB EMIRATES');
    const [user_COUNTRYOFRESIDENCE, setuser_COUNTRYOFRESIDENCE] = useState('');
    const [user_from_date, setuser_from_date] = useState('');
    const [user_to_date, setuser_to_date] = useState('');
    const [user_ref_no, setuser_ref_no] = useState('-');
    const [user_issue_date, setuser_issue_date] = useState(startDate);
    const [user_plan, setuser_plan] = useState('');
    const [totdays, settotdays] = useState(0);
    const [last_currentid, setlast_currentid] = useState(0);
    const [amount_30, setamount_30] = useState(0);
    const [amount_90, setamount_90] = useState(0);
    const [totalamount, settotalamount] = useState('0');
    const [dispamount, setDispamount] = useState('0');
    function datesplit(xmdate) {
        let mdate = xmdate;
        return `${mdate.getDate()}-${mdate.getMonth() + 1}-${mdate.getFullYear()}`;
    }
    function saveUsers(e) {
        e.preventDefault();
        let fd = new FormData();
        let dob = datesplit(user_dob);
        console.log(dob);
        let _user_from_date = datesplit(user_from_date);
        console.log(_user_from_date);
        let _user_issue_date = datesplit(user_issue_date)
        console.log(user_issue_date);
        fd.append('username', localStorage.getItem('username'));
        fd.append('usertoken', localStorage.getItem('usertoken'));
        fd.append('user_name', user_name);
        fd.append('user_dob', dob);
        fd.append('user_passport_no', user_passport_no);
        fd.append('user_DESTINATION', user_DESTINATION);
        fd.append('user_COUNTRYOFRESIDENCE', user_COUNTRYOFRESIDENCE);
        fd.append('user_from_date', _user_from_date);
        fd.append('user_to_date', user_to_date);
        fd.append('user_ref_no', user_ref_no);
        fd.append('user_issue_date', _user_issue_date);
        fd.append('user_plan', user_plan);
        fd.append('totdays', totdays);
        fd.append('last_currentid', last_currentid);
        fd.append('totalamount', totalamount);

        fetch(`${api}newissue.php`, {
            method: "POST",
            body: fd,
        }).then(resp => resp.json())
            .then(res => {
                if (res.msg === '1') {
                    alert('saved');
                    window.location.reload();
                } else if (res.msg === '404') {
                    alert(res.data);
                    localStorage.removeItem('username');
                    localStorage.removeItem('usertoken');
                    localStorage.removeItem('userinfo');
                    window.location.href = "/";

                } else {
                    alert(res.data);
                }
            })
    }
    const year = new Date().getFullYear() + 1;
    const [years, setYears] = useState([]);

    const [dinfos, setDinfos] = useState({});
    useEffect(() => {
        let ismount = false;

        //console.log(k)
        
        let _i = year;
        let k = []
        for (var i = 1900; i < _i; i++) {
            //k = [...years,i]
            k.push(i)

        }
        setYears(k)
        agetlistget();
        planlist();
        contrylistall();
        snoget();
        getAgentBalance();
        getAgentPricing();
        getAgentPricing();


        function agetlistget() {
            let fd = new FormData();
            fd.append('username', localStorage.getItem('username'));
            fd.append('usertoken', localStorage.getItem('usertoken'));
            fetch(`${urls.api}allagent.php`, {
                body: fd,
                method: 'POST'
            }).then(resp => resp.json())
                .then(res => {
                    if (res.msg === "1") {
                        if (!ismount) {
                        setAgentList(res.data);
                        }
                    } else if (res.msg === "404") {
                        alert("login Error");
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertoken');
                        localStorage.removeItem('userinfo');
                        window.location.href = "/";
                    } else {
                        alert(res.data);
                    }
                })
        }

        function planlist() {
            //planlist.php
            let fd = new FormData();
            fd.append('username', localStorage.getItem('username'));
            fd.append('usertoken', localStorage.getItem('usertoken'));
            fetch(`${urls.api}planlist.php`, {
                method: "POST",
                body: fd
            }).then(resp => resp.json())
                .then(res => {
                    if (res.msg === "1") {
                        if (!ismount) {
                        setPlanlist(res.data);

                        }
                    } else if (res.msg === "404") {
                        alert(res.data);
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertoken');
                        localStorage.removeItem('userinfo');
                        window.location.href = "/";
                    } else {
                        alert(res.data);
                    }
                })
        }


        function contrylistall() {
            let fd = new FormData();
            fd.append('username', localStorage.getItem('username'));
            fd.append('usertoken', localStorage.getItem('usertoken'));
            fetch(`${urls.api}countrylist.php`, {
                method: "POST",
                body: fd
            }).then(resp => resp.json())
                .then(res => {
                    if (res.msg === "1") {
                        if (!ismount) {
                        setCountrylist(res.data);
                        }
                    } else if (res.msg === "404") {
                        alert(res.data);
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertoken');
                        localStorage.removeItem('userinfo');
                        window.location.href = "/";
                    } else {
                        alert(res.data);
                    }
                })
        }

        function snoget() {
            let fd = new FormData();
            fd.append('username', localStorage.getItem('username'));
            fd.append('usertoken', localStorage.getItem('usertoken'));
            fetch(`${urls.api}sno.php`, {
                method: "POST",
                body: fd
            }).then(resp => resp.json())
                .then(res => {
                    if (res.msg === "1") {
                        if (!ismount) {
                        let xdate = new Date();
                        let y = xdate.getFullYear();
                        setlast_currentid(res.data);
                        setuser_ref_no(`CTA-${y}-${res.data}`);
                        }
                    } else if (res.msg === "404") {
                        alert(res.data);
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertoken');
                        localStorage.removeItem('userinfo');
                        window.location.href = "/";
                    } else {
                        alert(res.data);
                    }
                })
        }

        function getAgentBalance() {
            let fd = new FormData();
            fd.append('username', localStorage.getItem('username'));
            fd.append('usertoken', localStorage.getItem('usertoken'));
            fetch(`${urls.api}agents/dashboard.php`, {
                method: "POST",
                body: fd
            }).then(resp => resp.json())
                .then(res => {
                    if (res.msg === "1") {
                        if (!ismount) {
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


        function getAgentPricing() {
            let x = JSON.parse(localStorage.getItem('userinfo'));
            if (x.auht_type === 1 || x.auht_type === "1") {

            } else {
                let fd = new FormData();
                fd.append('username', localStorage.getItem('username'));
                fd.append('usertoken', localStorage.getItem('usertoken'));
                fetch(`${api}agents/getpriceing.php`, { body: fd, method: 'POST' }).then(resp => resp.json())
                    .then(res => {
                        if (res.msg === "1") {
                            if (!ismount) {
                            setamount_30((+res.data.amount_30));
                            setamount_90((+res.data.amount_90));
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

        return () => {
            ismount = true;
        };
    }, []);

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        let _d = (days - 1);
        date.setDate(date.getDate() + _d);
        return date;
    }
    let date = new Date();
    const handlesettotdays = e => {
        console.log(isNaN(e.target.value));
        if (e.target.value !== '' && e.target.value !== "0" && e.target.value !== 0 && user_from_date !== '' && !isNaN(e.target.value)) {
            settotdays(e.target.value);
            //console.log(e.target.value)
            let x = `${user_from_date.getFullYear()}-${user_from_date.getMonth() + 1}-${user_from_date.getDate()}`;
            date = new Date(x);
            //console.log(date.addDays((+lcdraft)));
            let lcduedate = date.addDays((+e.target.value));
            var datea = lcduedate.getDate();
            var month = lcduedate.getMonth() + 1;
            let year = lcduedate.getFullYear();

            setuser_to_date(`${datea}-${month}-${year}`);
            let _totdays = e.target.value;
            //console.log(+_totdays);
            if ((+_totdays) <= 30) {
                let nwam = (+_totdays) * (+amount_30);
                settotalamount(amount_30);
                setDispamount(amount_30);
            } else {
                let nwam = (+_totdays) * (+amount_90);
                settotalamount(amount_90);
                setDispamount(amount_90);
                //console.log(nwam)
            }
        }
        else {
            setuser_to_date("");
            settotalamount("0");
        }
    }
    const [_m, setms] = useState(new Date().getMonth());
    const months = [
        { mname: "January", monid: 0 },
        { mname: "February", monid: 1 },
        { mname: "March", monid: 2 },
        { mname: "April", monid: 3 },
        { mname: "May", monid: 4 },
        { mname: "June", monid: 5 },
        { mname: "July", monid: 6 },
        { mname: "August", monid: 7 },
        { mname: "September", monid: 8 },
        { mname: "October", monid: 9 },
        { mname: "November", monid: 10 },
        { mname: "December", monid: 11 },
    ];
    return (
        <div className="naf-acc-router-container">
            <div className="naf-acc-router-main-head">
                <h3>Add New Register - <span style={{ color: "red" }}> Your Current Balance - {dinfos.tot_balance}</span> </h3>
            </div>
            <div className="naf-project-sub-container">
                <div className="naf-project-sub-container">
                    <form onSubmit={(e) => { saveUsers(e) }}>
                        <h6>Plan Information</h6>
                        <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Package</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <select className="arnewinput" onChange={(e) => {
                                        setuser_plan(e.target.value)
                                    }}>
                                        <option value="">-select-</option>
                                        {planlist.map((i, index) => {
                                            return (
                                                <AgentList key={index} id={i.package_id} name={i.package_name}></AgentList>
                                            );
                                        })}
                                    </select>

                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Reference. No.</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input readOnly value={user_ref_no} onChange={(e) => { setuser_ref_no(e.target.value) }} type="text" className="arnewinput"></input>
                                </div>
                                <div className="naf-ams-table-cell table-lable">Issue Date</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <DatePicker selected={startDate} onChange={(date) => setuser_issue_date(date)} dateFormat="dd-MM-yyyy" className="naf-ams-table-cell table-inputs" style={{ padding: "0px" }} />
                                </div>
                            </div>
                        </div>
                        <h6>Beneficiary Information</h6>
                        <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Name</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input
                                        onChange={(e) => {
                                            setUser_name(e.target.value);
                                        }}
                                        type="text" className="arnewinput"></input>
                                </div>
                                <div className="naf-ams-table-cell table-lable">Passport No.</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input onChange={(e) => { setuser_passport_no(e.target.value) }} type="text" className="arnewinput"></input>
                                </div>
                            </div>

                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Date of Birth <br/>(DD-MM-YYYY)</div>
                                <div className="naf-ams-table-cell table-inputs">

                                    <DatePicker
                                        renderCustomHeader={({
                                            date,
                                            changeYear,
                                            changeMonth
                                        }) => (
                                            <div style={{
                                                margin: 10,
                                                display: "flex",
                                                justifyContent: "center",
                                            }}>
                                                <select
                                                    value={new Date().getFullYear()}
                                                    onChange={({ target: { value } }) => changeYear(value)}
                                                >

                                                    <option value="">-Select Year-</option>
                                                    {years.map((i, index) => (
                                                        <option key={index} value={i}>{i}</option>
                                                    ))
                                                    }

                                                </select>
                                                <select
                                                    value={_m}
                                                    onChange={
                                                        (
                                                            ({ target: { value } }) => {
                                                                //console.log(months[value-1].mname);
                                                                let m = months[value].monid;
                                                                changeMonth(m)
                                                                setms(months[value].monid)
                                                            }
                                                        )
                                                    }
                                                // onChange={({ target: { value } }) =>{
                                                //     console.log(value);
                                                //     console.log(months.indexOf(value))
                                                //     //changeMonth(months.indexOf(value))
                                                // }}
                                                >
                                                    {months.map((option, index) => (
                                                        <option key={option.monid} value={option.monid}>
                                                            {option.mname}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        selected={user_dob} onChange={(date) => setuser_dob(date)} dateFormat="dd-MM-yyyy" className="naf-ams-table-cell table-inputs" style={{ padding: "0px" }} />
                                </div>
                                <div className="naf-ams-table-cell table-lable"></div>
                                <div className="naf-ams-table-cell table-inputs">

                                </div>
                            </div>
                        </div>
                        <h6>Travel Information</h6>
                        <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Destination</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input value={user_DESTINATION} onChange={(e) => { setuser_DESTINATION(e.target.value) }} type="text" className="arnewinput" readOnly></input>
                                </div>
                                <div className="naf-ams-table-cell table-lable">Residence</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input list="ctrllist" onChange={(e) => { setuser_COUNTRYOFRESIDENCE(e.target.value) }} type="text" className="arnewinput"></input>
                                    <datalist id="ctrllist">
                                        {countrylist.map((c, index) => {
                                            return (
                                                <option key={index}>{c.cname}</option>
                                            )
                                        })}
                                    </datalist>
                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">From</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <DatePicker selected={user_from_date} onChange={(date) => setuser_from_date(date)} dateFormat="dd-MM-yyyy" className="naf-ams-table-cell table-inputs" style={{ padding: "0px" }} />
                                </div>
                                <div className="naf-ams-table-cell table-lable">No of Days</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input onKeyUp={handlesettotdays} type="text" className="arnewinput"></input>
                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">To</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input readOnly value={user_to_date} type="text" className="arnewinput"></input>
                                </div>
                                <div className="naf-ams-table-cell table-lable">Amount</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input readOnly value={totalamount} type="text" className="arnewinput"></input>
                                </div>
                            </div>
                        </div>
                        <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable"></div>
                                <div className="naf-ams-table-cell table-inputs">

                                </div>
                                <div className="naf-ams-table-cell table-lable"></div>
                                <div className="naf-ams-table-cell table-inputs"
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        padding: "15px"
                                    }}
                                >
                                    <button disabled={
                                        user_name === '' ||
                                        user_dob === '' ||
                                        user_passport_no === '' ||
                                        user_DESTINATION === '' ||
                                        user_COUNTRYOFRESIDENCE === '' ||
                                        user_from_date === '' ||
                                        user_ref_no === '' ||
                                        user_issue_date === '' ||
                                        user_plan === '' ||
                                        totdays === '' ||
                                        totdays === 0 || totdays === '0' || isNaN(totdays)

                                    } className="naf-ams-btn naf-ams-btn-primary"
                                        style={{
                                            marginRight: "5px"
                                        }}
                                    >
                                        <i className="fa fa-check"></i>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default NewCertificate;

const AgentList = ({ id, name }) => {
    return (
        <option value={id}>{name}</option>
    )
}