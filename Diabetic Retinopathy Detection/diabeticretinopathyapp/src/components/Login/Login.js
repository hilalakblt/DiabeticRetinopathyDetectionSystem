import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';

const Login = (props) => {

	const [tcNumber, setTcNumber] = useState('');
	const [passwd, setPassword] = useState('');

	function logMeIn(event) {
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
    /*function handleChange(event) { 
      const {value, name} = event.target
      setloginForm(prevNote => ({
          ...prevNote, [name]: value})
      )}*/

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
				<input onClick={logMeIn} type="submit" value="Login" />
				<div className="forgot_pass">Forgot Password?</div>
			</form>
		</div>
		
	);
}

export default Login;