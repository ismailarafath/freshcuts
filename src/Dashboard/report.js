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
import DatePicker, { getYear } from 'react-datepicker';
import { UrlContenxt } from './../App.js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import ReactExport from "@ibrahimrahmani/react-export-excel";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;




const ReportPage = () => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';
  let urls = useContext(UrlContenxt);
  let history = useHistory();
  const [srcno, setSrcno] = useState('');
  //const api = "http://localhost:8082/sabeel/dhabitours/api/";
  const api = urls.api;
  //const url = "http://localhost:8082/sabeel/dhabitours/";
  const url = urls.url;
  const [userlist, setUserlist] = useState([]);

  const [stdate, setStdate] = useState(new Date());
  const [enddate, setEnddate] = useState(new Date);


  const getreport = (e) => {

    e.preventDefault();
    console.log("woring");
    let _stdate = `${stdate.getDate()}-${stdate.getMonth() + 1}-${stdate.getFullYear()}`;
    let _enddate = `${enddate.getDate()}-${enddate.getMonth() + 1}-${enddate.getFullYear()}`;
    let fd = new FormData();
    fd.append('username', localStorage.getItem('username'));
    fd.append('usertoken', localStorage.getItem('usertoken'));
    fd.append('stdate', _stdate);
    fd.append('enddate', _enddate);
    fetch(`${api}issue/report.php`, {
      method: 'POST',
      body: fd
    }).then(resp => resp.json())
      .then(res => {
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
      })
  }
  const exportToCSV = (csvData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  return (
    <div className="naf-acc-router-container">
      <div className="naf-acc-router-main-head">
        <h3>REPORT</h3>
      </div>
      <div className="naf-project-sub-container">
        <div className="naf-project-sub-container">
          <div className="naf-ams-buttons-div">
            <div className="naf-ams-button-rights">
              <form onSubmit={getreport}>
                Start Date
                <DatePicker selected={stdate} onChange={(date) => setStdate(date)} dateFormat="dd-MM-yyyy" className="naf-ams-table-cell table-inputs" style={{ padding: "5px", margin: "0px 5px" }} />
                End Date
                <DatePicker selected={enddate} onChange={(date) => setEnddate(date)} dateFormat="dd-MM-yyyy" className="naf-ams-table-cell table-inputs" style={{ padding: "5px", margin: "0px 5px" }} />
                <button
                  disabled={
                    stdate === '' || enddate === ''
                  }
                  className="naf-ams-btn naf-ams-btn-primary" type="submit" style={{ margin: "10px 0px" }}>
                  <i className="fa fa-search"></i>
                  Get Report
                </button>                
                <ExcelFile element={<button  className="naf-ams-btn naf-ams-btn-primary" style={{margin : "0px 5px"}}>Download Data</button>}>
                <ExcelSheet data={userlist} name="Issues">
                    <ExcelColumn label="Issue Date" value="user_issue_date_d"/>
                    <ExcelColumn label="Reference. No." value="user_ref_no"/>                    
                    <ExcelColumn label="Name" value="user_name"/>  
                    <ExcelColumn label="Passport No." value="user_passport_no"/>  
                    <ExcelColumn label="Date of Birth" value="user_dob_d"/>  
                    <ExcelColumn label="Destination" value="user_DESTINATION"/>  
                    <ExcelColumn label="Residence" value="user_COUNTRYOFRESIDENCE"/> 
                    <ExcelColumn label="Package" value="package_name"/> 
                    <ExcelColumn label="Agent" value="agent_name"/> 
                    <ExcelColumn label="Amount" value="user_others"/> 

                </ExcelSheet>               
            </ExcelFile>
              </form>
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
                REF.No
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                User Name
              </div>
              <div className="naf-ams-table-cell table-inputs row-title tbl-view">
                Passport
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
                Options
              </div>

            </div>
            {userlist.map((i, index) => {
              return (
                <div key={i.tokens} className="naf-asm-table-row">
                  <div className="naf-ams-table-cell table-inputs tbl-view" style={{ width: "20px" }}>
                    {index + 1}
                  </div>
                  <div className="naf-ams-table-cell table-inputs tbl-view">
                    {i.user_issue_date}
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
                    <a target="_blank" href={`${url}index.php?ref=${i.tokens}`} className="naf-ams-btn naf-ams-btn-primary">
                      <i className="fa fa-eye"></i>
                    </a>
                    <Link to={`editissue/${i.tokens}`} className="naf-ams-btn naf-ams-btn-danger" style={{ margin: "0px 2px" }}>
                      <i className="fa fa-edit"></i>
                    </Link>
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

export default ReportPage;