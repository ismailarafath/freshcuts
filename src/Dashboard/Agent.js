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

const PaymentHistory = ({ index, phistory }) => {

}
const AgentsList = ({ index, datas, paymentlist, opensavepaymentdialog, openagentEdit }) => {
    function getlistpayments(id, name) {
        console.log('its working')
        console.log(id);
        paymentlist(id, name)
    }
    function opensavepaymentdialog_f(id, title) {
        opensavepaymentdialog(id, title)
    }
    function editagent(id) {
        openagentEdit(id);
    }
    return (
        <div className="naf-asm-table-row">
            <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "20px" }}>
                {index + 1}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view">
                {datas.agent_name}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "90px" }}>
                {datas.tot_issue}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "90px" }}>
                {datas.tot_money}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "90px" }}>
                {datas.tot_paid}
            </div>

            <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "120px" }}>
                {datas.tot_paid === '0' || datas.tot_paid === 0 ? '-' : datas.lpdate_d}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "90px" }}>
                {datas.balance}
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view">
                <div style={{ display: "flex" }}>
                    <button onClick={() => { opensavepaymentdialog_f(datas.agent_id, datas.agent_name) }} className="naf-ams-btn naf-ams-btn-primary">
                        <i className="fa fa-plus"></i>
                        New
                    </button>
                    {datas.tot_paid === '0' || datas.tot_paid === 0 ? '' : <button onClick={() => { getlistpayments(datas.agent_id, datas.agent_name) }} className="naf-ams-btn naf-ams-btn-excelexport" style={{ margin: "0px 3px" }}>
                        <i className="fa fa-list"></i>
                        History
                    </button>}
                </div>
            </div>
            <div className="naf-ams-table-cell table-inputs tbl-view">
                <button className="naf-ams-btn naf-ams-btn-danger" onClick={() => { editagent(datas.agent_id) }}>
                    <i className="fa fa-eye"></i>
                    View Profile
                </button>
            </div>
        </div>
    )
}
const Newagent = () => {
    const [viewdialog, setViewdialog] = useState('none');
    const [payment_dialog, setPaymentDialog] = useState(false);
    const [newpaymentdialog, setNewPaymentDialog] = useState(false);

    const [agent_name, setagent_name] = useState('');
    const [amount_30, setamount_30] = useState('');
    const [amount_90, setamount_90] = useState('');
    const [username, setUserName] = useState('');
    const [password, setUserPassword] = useState('');
    const [repass, setRepass] = useState('');
    const [savenewAgetload, setsavenewAgetload] = useState(false)

    const [agentlist, setAgetnlist] = useState([]);
    const [agentpaymentlist, setAgentPayments] = useState([]);

    //new payment dialog 

    const [newpayment_id, setnewpayment_id] = useState('');
    const [newpayment_title, setnewpayment_title] = useState('');
    const [resetstatusH, setresetstatusH] = useState({
        status: false,
        emsg: ""
    });



    let history = useHistory();
    const urls = useContext(UrlContenxt);
    const LoadList = () => {
        var fd = new FormData();
        fd.append('username', localStorage.getItem('username'));
        fd.append('usertoken', localStorage.getItem('usertoken'));
        fetch(`${urls.api}/agents/index.php`, {
            body: fd,
            method: 'POST'
        }).then(resp => resp.json())
            .then(
                (res) => {
                    console.log(res);
                    if (res.msg === "1") {
                        setAgetnlist(res.data);
                        console.log(agentlist);
                    } else if (res.msg === "404") {
                        alert(res.data);
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertoken');
                        localStorage.removeItem('userinfo');
                        window.location.href = "/";
                    } else {
                        alert(res.data);
                    }
                }
            )
    }
    useEffect(() => {
        LoadList();

    }, [])
    const closedialogbox = () => {
        console.log("owrking")
        setNewPaymentDialog(false)
    }
    const opensavepaymentdialog = (id, title) => {
        console.log("working");
        setNewPaymentDialog(true);
        setnewpayment_id(id);
        setnewpayment_title(title)
    }
    const paymentlist = (id, name) => {
        setPaymentDialog(true);
        //setAgentPayments()
        setnewpayment_title(name);
        let fd = new FormData();
        fd.append('username', localStorage.getItem('username'));
        fd.append('usertoken', localStorage.getItem('usertoken'));
        fd.append('pagid', id);
        fd.append('auth_username', username);
        fd.append('auth_password', password);
        fetch(`${urls.api}/agents/paymentlist.php`, {
            body: fd,
            method: 'POST'
        }).then(resp => resp.json())
            .then(res => {
                if (res.msg === '1') {
                    setAgentPayments(res.data);
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
    const saveagent = (e) => {
        e.preventDefault();
        setsavenewAgetload(true);
        let fd = new FormData();
        fd.append('username', localStorage.getItem('username'));
        fd.append('usertoken', localStorage.getItem('usertoken'));
        fd.append('agent_name', agent_name);
        fd.append('amountb30', amount_30);
        fd.append('amountm30', amount_90);
        fd.append('auth_username', username);
        fd.append('auth_password', password);

        fetch(`${urls.api}saveagent.php`, {
            method: "POST",
            body: fd,
        }).then(resp => resp.json())
            .then(res => {
                setsavenewAgetload(false);
                if (res.msg === '1') {
                    alert('saved');
                    setagent_name('');
                    setUserName('');
                    setUserPassword('');
                    setRepass('');
                    setamount_30('');
                    setamount_90('');
                    LoadList();
                    document.getElementsByName('agent_name')[0].focus();

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
    const dialogbox = {
        display: viewdialog
    }
    const [secvalue, setSearchvalue] = useState('')

    const [editagetininfodiv, seteditagetininfodiv] = useState(false);
    const openagentEdit = (id) => {
        seteditagetininfodiv(true);
        setnewpayment_id(id);
    }
    const closeagentEdit = () => {
        seteditagetininfodiv(false);
    }
    return (
        <div className="naf-acc-router-container">
            <div className="naf-acc-router-main-head">
                <h3>AGENTS MANAGEMENT</h3>
            </div>

            <div className="naf-project-sub-container">
                <div className="naf-ams-buttons-div">
                    <div className="naf-ams-button-rights">
                        Search : <input className="arnewinput" value={secvalue} type="search" onChange={(e) => {
                            setSearchvalue(e.target.value)
                        }} style={{ width: "200px" }} ></input>
                        <button onClick={() => { setViewdialog('block') }} type="button" className="naf-ams-btn naf-ams-btn-primary" style={{ margin: "10px 10px" }}>
                            <i className="fa fa-plus"></i>
                            New</button>

                    </div>
                </div>

                <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                    <div className="naf-asm-table-row">
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "20px" }}>
                            S.NO
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                            Agent Name
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "90px" }}>
                            Total Applications
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "90px" }}>
                            Total Amount
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "90px" }}>
                            Total Paid
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "120px" }}>
                            Last Payment Date
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "120px" }}>
                            Balance
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "120px" }}>
                            Payment
                        </div>
                        <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "120px" }}>
                            View Profile
                        </div>
                    </div>
                    {
                        agentlist.filter(
                            x =>
                                x.agent_name.toLocaleLowerCase().includes(secvalue.toLocaleLowerCase())

                        ).map((i, index) => {
                            return (
                                <AgentsList key={index} index={index}
                                    datas={i} paymentlist={paymentlist} opensavepaymentdialog={opensavepaymentdialog} openagentEdit={openagentEdit}
                                />
                            )
                        })

                    }
                </div>

            </div>

            {payment_dialog ? <div className="naf-ams-menu-dialog" style={{ display: 'block' }}>
                <div className="naf-ams-menu-container" style={{ width: "1150px" }}>
                    <div className="naf-ams-menu-header">
                        <div className="naf-ams-menu-header-title">
                            <div className="naf-acc-header-title-name">{newpayment_title}'s PAYMENT HISTORY</div>
                        </div>
                        <div className="naf-ams-menu-header-closebutn" onClick={() => { setPaymentDialog(false) }}>
                            <i className="fa fa-times"></i>
                        </div>
                    </div>
                    <div className="naf-ams-menu-body">
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
                            {agentpaymentlist.map((i, index) => {
                                return (

                                    <PaymentListDiv key={index} index={index} datas={i} opensavepaymentdialog={opensavepaymentdialog} />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div> : ''}
            {newpaymentdialog ? <NewPaymentDiv LoadList={LoadList} id={newpayment_id} title={newpayment_title} closedialogbox={closedialogbox} /> : ''}
            {editagetininfodiv ? <EditAgetninfoDiv LoadList={LoadList} id={newpayment_id} closeagentEdit={closeagentEdit} /> : ''}
            <div className="naf-ams-menu-dialog" style={dialogbox}>
                <div className="naf-ams-menu-container" style={{ width: "480px" }}>
                    <div className="naf-ams-menu-header">
                        <div className="naf-ams-menu-header-title">
                            <div className="naf-acc-header-title-name">Add New Agent</div>
                        </div>
                        <div className="naf-ams-menu-header-closebutn" onClick={() => { setViewdialog('none') }}>
                            <i className="fa fa-times"></i>
                        </div>
                    </div>
                    <div className="naf-ams-menu-body">
                        <form onSubmit={saveagent}>
                            <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                                <div className="naf-asm-table-row">
                                    <div className="naf-ams-table-cell table-lable">Agent Name</div>
                                    <div className="naf-ams-table-cell table-inputs">
                                        <input value={agent_name} onChange={(e) => { setagent_name(e.target.value) }} type="text" name="agent_name" className="arnewinput"></input>
                                    </div>
                                </div>
                                <div className="naf-asm-table-row">
                                    <div className="naf-ams-table-cell table-lable">below 30 Days</div>
                                    <div className="naf-ams-table-cell table-inputs">
                                        <input value={amount_30} onChange={(e) => { setamount_30(e.target.value) }} type="text" name="agent_name" className="arnewinput"></input>
                                    </div>
                                </div>
                                <div className="naf-asm-table-row">
                                    <div className="naf-ams-table-cell table-lable">More Than 30 Days</div>
                                    <div className="naf-ams-table-cell table-inputs">
                                        <input value={amount_90} onChange={(e) => { setamount_90(e.target.value) }} type="text" name="agent_name" className="arnewinput"></input>
                                    </div>
                                </div>
                                <div className="naf-asm-table-row">
                                    <div className="naf-ams-table-cell table-lable">User Name</div>
                                    <div className="naf-ams-table-cell table-inputs">
                                        <input value={username} onChange={(e) => { setUserName(e.target.value) }} type="text" className="arnewinput"></input>
                                    </div>
                                </div>
                                <div className="naf-asm-table-row">
                                    <div className="naf-ams-table-cell table-lable">Password</div>
                                    <div className="naf-ams-table-cell table-inputs">
                                        <input value={password} onChange={(e) => { setUserPassword(e.target.value) }} type="password" className="arnewinput"></input>
                                    </div>
                                </div>
                                <div className="naf-asm-table-row">
                                    <div className="naf-ams-table-cell table-lable">Re Type Password</div>
                                    <div className="naf-ams-table-cell table-inputs">
                                        <input value={repass} onChange={(e) => { setRepass(e.target.value) }} type="password" className="arnewinput"></input>
                                    </div>
                                </div>
                                <div className="naf-asm-table-row">
                                    <div className="naf-ams-table-cell table-lable"></div>
                                    <div className="naf-ams-table-cell table-inputs">
                                        {username === '' ? <div className="error_box">* Enter User Name</div> : ''}
                                        {password === '' ? <div className="error_box">* Enter Password</div> : ''}
                                        {repass === '' ? <div className="error_box">* Re type Password</div> : ''}
                                        {password !== repass ? <div className="error_box">* Check Password</div> : ''}
                                    </div>
                                </div>
                                <div className="naf-asm-table-row">
                                    <div className="naf-ams-table-cell table-lable"></div>
                                    <div className="naf-ams-table-cell table-inputs">
                                        <button
                                            disabled={
                                                agent_name === '' ||
                                                username === '' ||
                                                password === '' ||
                                                password !== repass ||
                                                savenewAgetload
                                            }
                                            className="naf-ams-btn naf-ams-btn-primary">
                                            {savenewAgetload ?
                                                <i className="fa fa-spinner"></i>
                                                :
                                                <i className="fa fa-check"></i>
                                            }
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
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

const NewPaymentDiv = ({ id, title, closedialogbox, LoadList }) => {
    const urls = useContext(UrlContenxt);
    const pagid = id;
    const [pdate, setpdate] = useState(new Date());
    const [pvia, setpvia] = useState('');
    const [pamount, setpamount] = useState('');
    const [pnotes, setpnotes] = useState('');
    const [error_msg_lable, setErrormsglable] = useState('');
    function closePaymentDialog() {
        closedialogbox();
    }
    const save_payment = (e) => {
        e.preventDefault();
        if (pagid === '') {
            setErrormsglable('Agent Id Missing');
        }
        else if (pdate === '') {
            setErrormsglable('Enter Date');
        } else if (pvia === '') {
            setErrormsglable('Enter Pay Types');
        } else if (pamount === '') {
            setErrormsglable('Enter Amount');
        } else if (isNaN(pamount)) {
            setErrormsglable('Amount Is Not Valid Format');
        } else if (pnotes === '') {
            setErrormsglable('Enter Payment Notes');
        } else {
            let date = `${pdate.getDate()}-${pdate.getMonth() + 1}-${pdate.getFullYear()}`;
            let fd = new FormData();
            fd.append('username', localStorage.getItem('username'));
            fd.append('usertoken', localStorage.getItem('usertoken'));
            fd.append('pagid', pagid);
            fd.append('pdate', date);
            fd.append('pvia', pvia);
            fd.append('pamount', pamount);
            fd.append('pnotes', pnotes);
            fetch(`${urls.api}agents/newpay.php`, {
                method: 'POST',
                body: fd,
            }).then(resp => resp.json())
                .then(res => {
                    if (res.msg === '1') {
                        setpdate('');
                        setpvia('');
                        setpamount('');
                        setpnotes('');
                        alert("saved");
                        setErrormsglable('');
                        LoadList();
                    } else if (res.msg === "404") {
                        alert(res.data);
                        localStorage.removeItem('username');
                        localStorage.removeItem('usertoken');
                        localStorage.removeItem('userinfo');
                        window.location.href = "/";
                    } else {
                        setErrormsglable(res.data);
                    }
                })
        }
    }
    return (
        <div className="naf-ams-menu-dialog" style={{ display: 'block' }}>
            <div className="naf-ams-menu-container" style={{ width: "480px" }}>
                <div className="naf-ams-menu-header">
                    <div className="naf-ams-menu-header-title">
                        <div className="naf-acc-header-title-name">{title}'s NEW PAYMENT </div>
                    </div>
                    <div className="naf-ams-menu-header-closebutn" onClick={() => { closePaymentDialog() }}>
                        <i className="fa fa-times"></i>
                    </div>
                </div>
                <div className="naf-ams-menu-body">
                    <form onSubmit={save_payment}>
                        <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                            <div className="naf-asm-table-row" style={{ display: 'none' }}>
                                <div className="naf-ams-table-cell table-lable">Agent Name</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input value={pagid} type="text" name="agent_name" className="arnewinput" readOnly></input>
                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Date</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <DatePicker selected={pdate} onChange={(date) => setpdate(date)} dateFormat="dd-MM-yyyy" className="naf-ams-table-cell table-inputs" style={{ padding: "0px" }} />
                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Pay Type</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <select onChange={
                                            (e) => {
                                                setpvia(e.target.value)
                                            }
                                        } value={pvia} className="arnewinput">
                                            <option value="">-Select-</option>
                                            <option value="Cash Deposit">Cash Deposit </option>
                                            <option value="Online Transfer">Online Transfer</option>
                                            <option value="Cheque">Cheque</option>
                                            <option value="Others">Others</option>
                                    </select>
                                    
                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">Amount</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input value={pamount}
                                        onChange={
                                            (e) => {
                                                setpamount(e.target.value)
                                            }
                                        }
                                        type="text" name="agent_name" className="arnewinput"></input>
                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable">NOTES</div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <input value={pnotes} onChange={
                                        (e) => {
                                            setpnotes(e.target.value)
                                        }
                                    }
                                        type="text" name="agent_name" className="arnewinput"></input>
                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable"></div>
                                <div className="naf-ams-table-cell table-inputs">
                                    {pdate === '' ? <div className="error_box">* Enter Date</div> : ''}
                                    {pvia === '' ? <div className="error_box">* Enter Pay Type</div> : ''}
                                    {pamount === '' ? <div className="error_box">* Enter Amount</div> : ''}
                                    {isNaN(pamount) ? <div className="error_box">* Amount Not a valid Format</div> : ''}
                                    {pnotes === '' ? <div className="error_box">* Enter Payment Notes</div> : ''}
                                    {error_msg_lable === '' ? '' : error_msg_lable}
                                </div>
                            </div>
                            <div className="naf-asm-table-row">
                                <div className="naf-ams-table-cell table-lable"></div>
                                <div className="naf-ams-table-cell table-inputs">
                                    <button
                                        disabled={
                                            pdate === '' ||
                                            pvia === '' ||
                                            pamount === '' ||
                                            pnotes === '' ||
                                            isNaN(pamount)
                                        }
                                        className="naf-ams-btn naf-ams-btn-primary">
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
    )
}

const EditAgetninfoDiv = ({ id, closeagentEdit, LoadList }) => {

    const urls = useContext(UrlContenxt);
    const [auth_id, setauth_id] = useState('');    
    const [auth_username, setauth_username] = useState('');
    const [auth_password, setauth_password] = useState('');
    const [auth_status, setauth_status] = useState('');
    const [auth_llogin, setauth_llogin] = useState('');
    const [agent_id, setagent_id] = useState(id);
    const [agent_name, setagent_name] = useState('');
    const [amount_30,setamount_30] = useState('');
    const [amount_90,setamount_90]  = useState('');
    useEffect(() => {
        let fd = new FormData();
        fd.append('username', localStorage.getItem('username'));
        fd.append('usertoken', localStorage.getItem('usertoken'));
        fd.append('agent_id', agent_id);
        fetch(`${urls.api}agents/get.php`, {
            method: "POST",
            body: fd
        }).then(resp => resp.json())
            .then(res => {
                if (res.msg === "1") {
                    setagent_id(res.data.agent_id);
                    setagent_name(res.data.agent_name);
                    setauth_id(res.data.login.auth_id);
                    setauth_username(res.data.login.auth_username);
                    setauth_password(res.data.login.auth_password);
                    setauth_status(res.data.login.auth_status);
                    setauth_llogin(res.data.login.auth_llogin);
                    setamount_30(res.data.amount_30);
                    setamount_90(res.data.amount_90);
                } else if (res.msg === "404") {
                    alert(res.data);
                    localStorage.removeItem('username');
                    localStorage.removeItem('usertoken');
                    localStorage.removeItem('userinfo');
                    window.location.href = "/";
                } else {
                    alert(res.data);
                    closeagentEdit();
                }
            })
    }, []);
    const closePaymentDialog = () => {
        closeagentEdit();
    }

    function changeStatus(status) {
        let fd = new FormData();
        fd.append('username', localStorage.getItem('username'));
        fd.append('usertoken', localStorage.getItem('usertoken'));
        fd.append('auth_username', auth_username);
        fd.append('agent_status', status);
        fetch(`${urls.api}agents/statusch.php`, {
            method: 'POST',
            body: fd,
        }).then(resp => resp.json())
            .then(res => {
                if (res.msg === "1") {
                    alert("Updated")
                    setauth_status(status);
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

    const updateprice = () =>{
        let fd = new FormData();
        fd.append('username', localStorage.getItem('username'));
        fd.append('usertoken', localStorage.getItem('usertoken'));
        fd.append('agent_id', agent_id);
        console.log(agent_id);
        fd.append('amount_30', amount_30);
        console.log(amount_30);
        fd.append('amount_90', amount_90);
        console.log(amount_90);
        fetch(`${urls.api}agents/updateprice.php`,{
            method : "POST",
            body : fd
        }).then(resp=>resp.json())
        .then(res=>{
            if(res.msg === "1"){
                alert("Updated");
                LoadList();
            }else if(res.msg === "404"){
                localStorage.removeItem('username');
                localStorage.removeItem('usertoken');
                localStorage.removeItem('userinfo');
                window.location.href = "/";
            }else{
                alert(res.data);
            }
        })
        .catch(e=>{console.log(e)})
    }
    return (
        <div className="naf-ams-menu-dialog" style={{ display: 'block' }}>
            <div className="naf-ams-menu-container" style={{ width: "480px" }}>
                <div className="naf-ams-menu-header">
                    <div className="naf-ams-menu-header-title">
                        <div className="naf-acc-header-title-name">{agent_name}'s Informations </div>
                    </div>
                    <div className="naf-ams-menu-header-closebutn" onClick={() => { closePaymentDialog() }}>
                        <i className="fa fa-times"></i>
                    </div>
                </div>
                <div className="naf-ams-menu-body">

                    <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
                        <div className="naf-asm-table-row" style={{ display: 'none' }}>
                            <div className="naf-ams-table-cell table-lable">Agent Name</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={agent_id} type="text" className="arnewinput" readOnly></input>
                                <input value={auth_id} type="text" className="arnewinput" readOnly></input>
                            </div>
                        </div>

                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">Agent</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={agent_name}  type="text" className="arnewinput" readOnly></input>
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">Below 30 Days</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={amount_30} onChange={(e)=>{
                                    setamount_30(e.target.value);
                                }} type="text" className="arnewinput"></input>
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">More than 30 Days</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={amount_90} onChange={(e)=>{ setamount_90(e.target.value) } } type="text" className="arnewinput"></input>
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">Agent</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={agent_name} type="text" className="arnewinput" readOnly></input>
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">User Name</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={auth_username} type="text" name="agent_name" className="arnewinput" readOnly></input>
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">Password</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={auth_password} type="text" name="agent_name" className="arnewinput" readOnly></input>
                            </div>
                        </div>
                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable">Last Login Time</div>
                            <div className="naf-ams-table-cell table-inputs">
                                <input value={auth_llogin} type="text" name="agent_name" className="arnewinput" readOnly></input>
                            </div>
                        </div>

                        <div className="naf-asm-table-row">
                            <div className="naf-ams-table-cell table-lable"></div>
                            <div className="naf-ams-table-cell table-inputs">
                                <div style={{
                                    display: "flex",
                                }}>
                                    <button type="button" className="naf-ams-btn naf-ams-btn-primary" 
                                        disabled={ amount_90 === "" || amount_30 === '' } 
                                        onClick={updateprice}

                                    >
                                        <i className="fa fa-edit"></i>
                                        Update Price
                                    </button>   
                                    {auth_status === '1' ?
                                        <button type="button" onClick={() => {
                                            changeStatus('0')
                                        }}
                                            style={{ margin: "0px 5px" }}

                                            className="naf-ams-btn naf-ams-btn-danger">
                                            <i className="fa fa-calendar-times-o"></i>
                                            Block
                                        </button> :
                                        <button type="button" onClick={() => {
                                            changeStatus('1')
                                        }} style={{ margin: "0px 5px" }}
                                            className="naf-ams-btn naf-ams-btn-primary">
                                            <i className="fa fa-check"></i>
                                            Unblock
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}


export default Newagent;


