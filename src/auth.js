import { React, useState, useEffect , useContext } from 'react';
import {
    Route, Redirect
} from 'react-router-dom';
import {LoginContext } from './App.js';

function Auth({component: Component, ...rest }) {
    
    let isAuth = useContext(LoginContext);
    console.log(isAuth);
    return (
        <Route {...rest} render={(props) => {
            if (isAuth) {
                return <Component />
            } else {
                return (
                    <Redirect to={{ pathname: '/', state: { from: props.location } }} />
                );
            }
        }} />
    );
}

export default Auth;