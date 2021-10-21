import React, { useState, useEffect, useContext } from 'react';
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
import { UrlContenxt } from './../App.js';
import DatePicker, { getYear } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const EditCeN = () => {
    const [uaccess, setUserAccess] = useState(false);
    const { id } = new useParams();
    const urls = useContext(UrlContenxt);
    let history = useHistory();
    const [agentlist, setAgentList] = useState([]);
    const [planlist, setPlanlist] = useState([]);
    const [countrylist, setCountrylist] = useState([]);

    const [diff_dates, setdiff_dates] = useState('0');
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
    const [user_issue_date, setuser_issue_date] = useState('');
    const [user_plan, setuser_plan] = useState('');
    const [user_agent, setuser_agent] = useState('');
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
    const year = new Date().getFullYear() + 1;
    const [years, setYears] = useState([]);
    useEffect(() => {
        let isloaded = false;
        let x = JSON.parse(localStorage.getItem('userinfo'));
        if (x.auht_type === 1 || x.auht_type === "1") {
            setUserAccess(true);
        }
        let _i = year;
        let k = []
        for (var i = 1900; i < _i; i++) {
            //k = [...years,i]
            k.push(i)

        }
        //console.log(k)
        setYears(k)
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
                        if(!isloaded){
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
        agetlistget();

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
                        if(!isloaded){
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
        planlist();
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
                        if(!isloaded){
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
        contrylistall();
        getinformations();
        function getinformations() {
            let fd = new FormData();
            fd.append('issue_id', id);
            fd.append('username', localStorage.getItem('username'));
            fd.append('usertoken', localStorage.getItem('usertoken'));

            fetch(`${urls.api}issue/index.php`, { body: fd, method: 'POST' })
                .then(resp => resp.json())
                .then(res => {
                    if (res.msg === "1") {
                        if(!isloaded){
                            let to_dif = Math.round(res.data.diff);
                            let frmdate = formatDate(res.data.user_from_date);
                            let todate = formatDate(res.data.user_to_date);
                            let cdob = formatDate(res.data.user_dob);
                            let issuedate = formatDate(res.data.user_issue_date);
                            console.log(res.data.user_name);
                            setStartDate(frmdate);
                            setUser_name(res.data.user_name);
                            setuser_dob(cdob);
                            setuser_passport_no(res.data.user_passport_no);
                            setuser_DESTINATION(res.data.user_DESTINATION);
                            setuser_COUNTRYOFRESIDENCE(res.data.user_COUNTRYOFRESIDENCE);
                            setuser_from_date(frmdate);
                            setuser_to_date(res.data.user_to_date);
                            setuser_ref_no(res.data.user_ref_no);
                            setuser_issue_date(issuedate);
                            setuser_plan(res.data.pacakge.package_id);
                            setuser_agent(res.data.agent.agent_id);
                            setlast_currentid(res.data.last_currentid);
                            settotalamount(res.data.user_others);
                            setdiff_dates(res.data.totdays);
                               
                        if(x.auht_type === '1' || x.auht_type === 1){
                        }else{
                            loadAgentinfosagent();
                        }
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
                }).catch(e => { console.log(e) });
        }

       
        function loadAgentinfosagent() {
            
            let fd = new FormData();
            fd.append('username', localStorage.getItem('username'));
            fd.append('usertoken', localStorage.getItem('usertoken'));
            fetch(`${api}agents/getpriceing.php`, { body: fd, method: 'POST' }).then(resp => resp.json())
                .then(res => {
                    if (res.msg === "1") {
                        if(!isloaded){
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
                }).catch(e => { console.log(e) });
        }

        return () => {isloaded =true}
    }, [])

    function formatDate(x) {

        let d = new Date(x);
        return d;
    }
    const getagetinfos = (e) => {

        console.log(e.target.value);

        if (e.target.value !== '' && e.target.value !== "-select-") {
            let fd = new FormData();
            fd.append('username', localStorage.getItem('username'));
            fd.append('usertoken', localStorage.getItem('usertoken'));
            setuser_agent(e.target.value);
            fd.append('agent_id', e.target.value);

            fetch(`${urls.api}agents/get.php`, { method: 'POST', body: fd }).then(resp => resp.json()).then(res => {
                if (res.msg === '1') {
                    setamount_30((+res.data.amount_30));
                    setamount_90((+res.data.amount_90));
                } else if (res.msg === "404") {
                    alert(res.data);
                    localStorage.removeItem('username');
                    localStorage.removeItem('usertoken');
                    localStorage.removeItem('userinfo');
                    window.location.href = "/";
                } else {
                    alert(`${res.data} find`);
                }
            }).catch(e => console.log(e));
        } else {
            setuser_agent(e.target.value);
        }
    }
    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        let _d = (days - 1);
        date.setDate(date.getDate() + _d);
        return date;
    }
    let date = new Date();
    const handlesettotdays = e => {
        setdiff_dates(e.target.value);
        if (e.target.value !== '' && e.target.value !== "0" && e.target.value !== 0 && user_from_date !== '' && !isNaN(e.target.value)) {

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
            console.log(amount_30);
            console.log(amount_90);
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
        { mname: "January", monid: 1 },
        { mname: "February", monid: 2 },
        { mname: "March", monid: 3 },
        { mname: "April", monid: 4 },
        { mname: "May", monid: 5 },
        { mname: "June", monid: 6 },
        { mname: "July", monid: 7 },
        { mname: "August", monid: 8 },
        { mname: "September", monid: 9 },
        { mname: "October", monid: 10 },
        { mname: "November", monid: 11 },
        { mname: "December", monid: 12 },
    ];
    function updateuser(e) {
        e.preventDefault();
        let fd = new FormData();
        let dob = datesplit(user_dob);
        let _user_from_date = datesplit(user_from_date);
        let _user_issue_date = datesplit(user_issue_date)
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
        fd.append('user_agent', user_agent);
        fd.append('totdays', diff_dates);
        fd.append('totalamount', totalamount);
        fd.append('token', id);

        fetch(`${urls.api}issue/update.php`, { method: "POST", body: fd })
            .then(resp => resp.json())
            .then(res => {
                if (res.msg === "1") {
                    alert("updated");
                    //getinformations();
                   // window.location.reload();
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
    return (
        <div className="naf-acc-router-container">
            <div className="naf-acc-router-main-head">
                <h3>EDIT - <span style={{ color: 'red' }}>{user_ref_no}</span></h3>
            </div>
            <div className="naf-project-sub-container">
                <div className="naf-project-sub-container">
                    <form onSubmit={(e) => { updateuser(e) }}>
                        <h6>Plan Information</h6>
                        <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Package</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <select value={user_plan} className="arnewinput" onChange={(e) => {
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
                                <div className="naf-ams-table-cell table-lable"></div>
                                <div className="naf-ams-table-cell table-inputs">
                                   
                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Reference. No.</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input readOnly value={user_ref_no} type="text" className="arnewinput"></input>
                                </div>
                                <div className="naf-ams-table-cell table-lable">Issue Date</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <DatePicker selected={user_issue_date} onChange={(date) => setuser_issue_date(date)} dateFormat="dd-MM-yyyy" className="naf-ams-table-cell table-inputs" style={{ padding: "0px" }} />
                                </div>
                            </div>
                        </div>
                        <h6>Beneficiary Information</h6>
                        <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Name</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input value={user_name}
                                        onChange={(e) => {
                                            setUser_name(e.target.value);
                                        }}
                                        type="text" className="arnewinput"></input>
                                </div>
                                <div className="naf-ams-table-cell table-lable">Passport No.</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input value={user_passport_no} onChange={(e) => { setuser_passport_no(e.target.value) }} type="text" className="arnewinput"></input>
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
                                    <input value={user_DESTINATION} type="text" className="arnewinput" readOnly></input>
                                </div>
                                <div className="naf-ams-table-cell table-lable">Residence</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input list="ctrllist" value={user_COUNTRYOFRESIDENCE} onChange={(e) => { setuser_COUNTRYOFRESIDENCE(e.target.value) }} type="text" className="arnewinput"></input>
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
                                    <input value={diff_dates} onChange={(e) => { setdiff_dates(e.target.value) }} onKeyUp={handlesettotdays} type="text" className="arnewinput"></input>
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
                                        user_plan === '' || user_plan === '-select-' ||
                                        user_agent === '' ||
                                        diff_dates === '' ||
                                        diff_dates === 0 || diff_dates === '0' || isNaN(diff_dates)

                                    } className="naf-ams-btn naf-ams-btn-primary"
                                        style={{
                                            marginRight: "5px"
                                        }}
                                    >
                                        <i className="fa fa-edit"></i>
                                        Update
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
export default EditCeN;

const AgentList = ({ id, name }) => {
    return (
        <option value={id}>{name}</option>
    )
}
