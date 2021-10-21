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
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import NewItems from './NewItem.js';
import Newagent from './Agent.js'
import './dh.css';
import ChangePassword from '../UI/Changepass.js';
import AgentDashboard from '../agent/list.js';
import NewCertificate from '../agent/new.js'
import ReportPagePage from './report.js';
import PaymentHistory from '../agent/payhs.js';
import ReportPageAgent from '../agent/rpt.js';
import EditCe from './Editce.js';
import EditCeN from '../agent/Edit.js';

const Home = () => {
  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default Home;


function Dashboard({ api }) {
  let history = useHistory();
  const [dispusername,setDispusername] = useState('');
  function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('userinfo');
    localStorage.removeItem('usertoken');
    window.location.href = "/";
  }
  const title = {
    color: 'red',
    marginLeft: "5px"
  }
  const [uaccess, setUserAccess] = useState(false);
  useEffect(() => {
    setDispusername(localStorage.getItem('username'))
    let x = JSON.parse(localStorage.getItem('userinfo'));
    if (x.auht_type === 1 || x.auht_type === "1") {
      setUserAccess(true);
    }

  }, [])
  return (
    <div className="naf-acc-container">
      <Router>
        <div className="naf-acc-headers">
          <div className="naf-acc-header-container">
            <div className="naf-acc-header-left">
              <div className="naf-acc-header-left-titles">
                <div className="naf-acc-header-title-name">
                  <img src={logos} style={{ width: "60px" }} />
                  CARE
                  <span style={title}>
                    TRAVEL ASSISTANCE
                  </span>
                </div>
              </div>
              <div className="naf-acc-header-menu-items">
                <div className="naf-acc-header-menu-list">
                  <div className="acc-header-menu-list-items">
                    <Link className="mnu" to={'/'}>
                      <i className="fa fa-home"></i>
                      HOME
                    </Link>
                  </div>
                  <div className="acc-header-menu-list-items">
                    <Link className="mnu" to={'/newproject'}>
                      <i className="fa fa-qrcode"></i>
                      NEW APPLICATION
                    </Link>
                  </div>
                  {uaccess ?
                    <div className="acc-header-menu-list-items">
                      <Link className="mnu" to={'/package'}>
                        <i className="fa fa-cubes"></i>
                        PLAN
                      </Link>
                    </div> : ''}
                  {uaccess ?
                    <div className="acc-header-menu-list-items">
                      <Link className="mnu" to={'/agent'}>
                        <i className="fa fa-users"></i>
                        AGENTS
                      </Link>
                    </div> : <Link className="mnu" to={'/paymenthistory'}>
                      <i className="fa fa-users"></i>
                      PAYMENTS
                    </Link>}
                  {uaccess ?
                    <div className="acc-header-menu-list-items">
                      <Link className="mnu" to={'/report'}>
                        <i className="fa fa-list"></i>
                        Report
                      </Link>
                    </div> :
                    <div className="acc-header-menu-list-items">
                      <Link className="mnu" to={'/agentreport'}>
                        <i className="fa fa-list"></i>
                        Report
                      </Link>
                    </div>
                  }

                </div>
              </div>
            </div>
            <div className="naf-acc-header-right">
              <div id="dispuseranme" className="naf-acc-header-right-userdisplay">

              </div>
              <div className="naf-acc-header-right-menu-list">

                <div className="naf-acc-header-right-menu-items">
                  <Link to={'/changepassword'}>
                    <i className="fa fa-key"></i> Change Password
                  </Link>
                </div>
                <div className="naf-acc-header-right-menu-items">
                 
                    <i className="fa fa-user"></i>{dispusername}
                 
                </div>
                <div className="naf-acc-header-right-menu-items">
                  <a onClick={() => logout()}>
                    <i className="fa fa-lock"></i> Logout
                  </a>

                </div>
              </div>
            </div>
          </div>
          <div className="naf-acc-body">
            <Switch>
              <Switch>
                <Route exact path={`/`} comp>
                  {uaccess ? <ListPage api={api}></ListPage> : <AgentDashboard />}
                </Route>
                <Route path={`/newproject`}>
                  {uaccess ?
                    <NewItems></NewItems> :
                    <NewCertificate></NewCertificate>
                  }
                </Route>
                <Route path={`/agent`}>
                  <Newagent></Newagent>
                </Route>
                <Route path={`/package`}>
                  <NewPackage></NewPackage>
                </Route>
                <Route path={'/report'}>
                  <ReportPagePage></ReportPagePage>
                </Route>
                <Route path={'/agentreport'}>
                  <ReportPageAgent />
                </Route>
                <Route path={'/changepassword'}>
                  <ChangePassword />
                </Route>
                <Route path={'/paymenthistory'}>
                  <PaymentHistory />
                </Route>
                <Route path={`/editissue/:id`}>
                  {uaccess ? <EditCe /> : <EditCeN/>}
                </Route>

              </Switch>
            </Switch>
          </div>
        </div>
      </Router>

      <div className="naf-acc-footer">
        <div className="naf-acc-fotter-text">Developed By SABEEL TECH @ version 1.0 </div>
      </div>
    </div>
  );
}




const ListPage = () => {
  let urls = useContext(UrlContenxt);
  let history = useHistory();
  const [srcno, setSrcno] = useState('');
  //const api = "http://localhost:8082/sabeel/dhabitours/api/";
  const api = urls.api;
  //const url = "http://localhost:8082/sabeel/dhabitours/";
  const url = urls.url;
  const [userlist, setUserlist] = useState([]);
  function goNew() {
    history.push('/newproject')
  }
  useEffect(() => {
    let fd = new FormData();
    fd.append('username', localStorage.getItem('username'));
    fd.append('usertoken', localStorage.getItem('usertoken'));

    fetch(`${api}alluser.php`, {
      method: 'POST',
      body: fd,
    }).then(resp => resp.json())
      .then(
        (res) => {
          if (res.msg === "1") {
            setUserlist(res.data);
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
  }, []);
  return (
    <div className="naf-acc-router-container">
      <div className="naf-acc-router-main-head">
        <h3>HOME</h3>
      </div>
      <div className="naf-project-sub-container">
        <div className="naf-project-sub-container">
          <div className="naf-ams-buttons-div">
            <div className="naf-ams-button-rights">
              <input type="text" placeholder="search..." value={srcno} onChange={e => setSrcno(e.target.value)} />
              <button onClick={() => { goNew() }} className="naf-ams-btn naf-ams-btn-primary" type="button" style={{ marginLeft: "10px" }}>
                <i className="fa fa-qrcode"></i>
                Add New
              </button>
            </div>
          </div>
          <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
            <div className="naf-asm-table-row">
              <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "20px" }}>
                S.NO
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                Issue Date
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
              Reference. No.
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                User Name
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                Passport No.
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                Destination
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                C.OF.Residence
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                Package
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                From Date
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                To Date
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                Agent
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                Amount
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view" style={{ width: "100px" }}>
                View
              </div>
            </div>
            {userlist.filter(x =>
              x.user_name.toLocaleLowerCase().includes(srcno.toLocaleLowerCase())
              ||
              x.user_ref_no.toLocaleLowerCase().includes(srcno.toLocaleLowerCase())
              ||
              x.user_passport_no.toLocaleLowerCase().includes(srcno.toLocaleLowerCase())
              ||
              x.agent.agent_name.toLocaleLowerCase().includes(srcno.toLocaleLowerCase())
              ||
              x.user_DESTINATION.toLocaleLowerCase().includes(srcno.toLocaleLowerCase())
              ||
              x.user_COUNTRYOFRESIDENCE.toLocaleLowerCase().includes(srcno.toLocaleLowerCase())
              ||
              x.pacakge.package_name.toLocaleLowerCase().includes(srcno.toLocaleLowerCase()) 
              
            ).map((i, index) => {
              return (
                <div key={i.tokens} className="naf-asm-table-row">
                  <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "20px" }}>
                    {index + 1}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.user_issue_date_d}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.user_ref_no}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.user_name}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.user_passport_no}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.user_DESTINATION}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.user_COUNTRYOFRESIDENCE}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.pacakge.package_name}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.user_from_date_d}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.user_to_date}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.agent.agent_name}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    <strong>{i.user_others}</strong>
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "100px" }}>
                    <div style={{ display: 'flex' }}>
                      <a target="_blank" href={`${url}index.php?ref=${i.tokens}`} className="naf-ams-btn naf-ams-btn-primary">
                        <i className="fa fa-eye"></i>
                      </a>
                      <Link to={`editissue/${i.tokens}`} className="naf-ams-btn naf-ams-btn-danger" style={{ margin: "0px 2px" }}>
                        <i className="fa fa-edit"></i>
                      </Link>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  )
}




const NewPackage = () => {
  const urls = useContext(UrlContenxt);
  let history = useHistory();
  const [package_name, setpackage_name] = useState('');
  const savepackage = (e) => {
    e.preventDefault();

    let fd = new FormData();
    fd.append('username', localStorage.getItem('username'));
    fd.append('usertoken', localStorage.getItem('usertoken'));
    fd.append('package_name', package_name);
    fetch(`${urls.api}savepackage.php`, {
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
  return (
    <div className="naf-acc-router-container">
      <div className="naf-acc-router-main-head">
        <h3>Add New Package</h3>
      </div>
      <div className="naf-project-sub-container">
        <form onSubmit={savepackage}>
          <div className="naf-ams-tablediv" style={{ marginTop: '10px' }}>
            <div className="naf-asm-table-row">
              <div className="naf-ams-table-cell table-lable">Package Name</div>
              <div className="naf-ams-table-cell table-inputs">
                <input onChange={(e) => { setpackage_name(e.target.value) }} type="text" className="arnewinput"></input>
              </div>
            </div>
            <div className="naf-asm-table-row">
              <div className="naf-ams-table-cell table-lable"></div>
              <div className="naf-ams-table-cell table-inputs">
                <button disabled={package_name === ''} className="naf-ams-btn naf-ams-btn-primary">
                  <i className="fa fa-check"></i>
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}