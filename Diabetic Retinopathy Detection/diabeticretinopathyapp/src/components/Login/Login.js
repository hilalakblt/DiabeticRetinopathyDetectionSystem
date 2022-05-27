import React from 'react';
import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = (props) => {

	const [tcNumber, setTcNumber] = useState('');
	const [passwd, setPassword] = useState('');

	function loginPage(event) {
      axios({
        method: "POST",
        url:"/login",
        data:{
          tcNumber,
          passwd
         }
      })
      .then((response) => {
        props.setToken(response.data.access_token)
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          }
      })

      setTcNumber("");
      setPassword("");

      event.preventDefault()
    }
    
	return (
		<div className="login_form">
			<h1>DRDS</h1>
			<form>
				<div className="login_text">
					<label>TC Number:</label>
					<input 
						type="text" 
						value={tcNumber}
						onChange={(e) => setTcNumber(e.target.value)}
					/>
				</div>
				<div className="login_text">
					<label>Password:</label>
					<input 
						type="password"
						value={passwd} 
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<Link to="/detection">
					<input onClick={loginPage} type="submit" value="Login" />
				</Link>
				<div className="forgot_pass" >Take a new password</div>
			</form>
		</div>
		
	);
}

export default Login;