import React from 'react';
import {Link} from 'react-router-dom';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import axios from 'axios';
import './NavBar.css';


const NavBar = (props) => {

	function logginOut() {
	    axios({
	      method: "POST",
	      url:"/logout",
	    })
	    .then((response) => {
	       props.token()
	    }).catch((error) => {
	      if (error.response) {
	        console.log(error.response)
	        console.log(error.response.status)
	        console.log(error.response.headers)
	      }
    })}

	return (
		<div>
			<nav className="nav_bar">
				<ul className='nav_links'>
					<Link to="/detection">
						<li className='nav_text'>Detection</li>
					</Link>
					<Link to="/patients">
						<li className='nav_text'>Patients</li>
					</Link>
					<Link to="/statistics">
						<li className='nav_text'>Statistics</li>
					</Link>
					<Link to="/addUser">
						<li className='nav_text'>Add User</li>
					</Link>
					<Link to="/help">
						<li  className='nav_text'>Help</li>
					</Link>
					<div className='save_button'>
						<input type='button' value='Logout' onClick = {logginOut} />
					</div>
				</ul>
			</nav>
		</div>
	);
}

export default NavBar;