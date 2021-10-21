import React, { useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import createContext from 'react';

import Auth from './auth.js';
import Login from './UI/Login.js';
import ViewC from './UI/veiw.js';
import Home from './Dashboard/home.js';
import './assets/main.css';

export const LoginContext = React.createContext({});
export const UrlContenxt = React.createContext({});
const App = () => {
  const urls = {
    api : "http://cta.care-ta.com/dh/api/",
    url : "http://cta.care-ta.com/dh/",
  };
  // const urls ={
  //   api : 'http://dhabitours.avaxaa.tech/dh/api/',
  //   url : 'http://dhabitours.avaxaa.tech/dh/',
  // }
  // const urls = {
  //   api: "http://localhost:8082/sabeel/dhabitours/api/",
  //   url: "http://localhost:8082/sabeel/dhabitours/",
  // }
  const [apilogin, setApiLogin] = useState(false);
  const [isloading,setIsloading] = useState(false);
  useEffect(() => {
    let loading = false;
    setIsloading(true);
    let usertoken = localStorage.getItem('usertoken');
    let username = localStorage.getItem('username');
    if (username === null || usertoken === null) {
      setIsloading(false);
    } else {
      //setIsloading(true);
      let fd = new FormData();
      fd.append('username', username);
      fd.append('usertoken', usertoken);

      const req = fetch(`${urls.api}index.php`, {
        method: 'POST',
        body: fd
      });
      req.then(reps => reps.json())
        .then((res) => {
          console.log(res.msg);
          if (res.msg === "1") {
            if(!loading){
            //history.push('/dashboard');
            setApiLogin(true);setIsloading(false);
            }

          }
        }).catch(e => console.log(e));
    }

    return () => { loading = true; }
  }, [])
  return (
    <div>
      
       {isloading ? <div className="loadingscreen">
        <div className="innerloading">
          loading.....
        </div>        
      </div>:''}
      <div className="naf-acc-router-container">

        <UrlContenxt.Provider value={urls}>
          {apilogin ? <Home></Home> : <Login></Login>}
        </UrlContenxt.Provider>
        {/* <Router>
        <Route exact path={'/'} api={api} component={() => <Login api={api}></Login>}>

        </Route>
        <Route path={'/view/:token'} component={ViewC}></Route>
        <LoginContext.Provider value={{apilogin,setApiLogin}}>
          <Route path={'/dashboard'} component={Home}/>        
        </LoginContext.Provider>

      </Router> */}
      </div >
     
    </div>
  )
}

export default App;


