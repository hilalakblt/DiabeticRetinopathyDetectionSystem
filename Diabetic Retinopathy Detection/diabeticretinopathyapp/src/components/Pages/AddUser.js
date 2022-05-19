import React from 'react';
import { useState } from 'react';
import './AddUser.css';


const AddUser = (props) => {

	const [name, setUserName] = useState('');
	const [surname, setUserSurname] = useState('');
	const [age, setAge] = useState('');
	const [email, setEmail] = useState('');
	const [doctor_tcNumber, setTCNumber] = useState('');
	const [passwd, setPassword] = useState('');
	const [disposition, setDisposition] = useState('');
	const [gender, setGender] = useState('');


	async function insertDoctor(){
		const requestOptions = {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + props.token
			},
			body: JSON.stringify({name:name, surname:surname, age:age, gender:gender, doctor_tcNumber:doctor_tcNumber, email:email, passwd:passwd, disposition:disposition})
		};
		let result = await fetch('http://127.0.0.1:5000/adduser', requestOptions)
			 .then(response => response.json())
		if(result.status === 200){
			setUserName("");
		    setUserSurname("");
		    setAge("");
		    setEmail("");
		    setTCNumber("");
		    setPassword("");
		    setDisposition("");
		    setGender("");
		}else{
			alert("No permission!")
		}
	}


	return (
		<div className='adduser_page'>
			<form>
				<div className='text_box'>
					<input 
						type='text' 
						placeholder='User Name' 
						value={name} 
						onChange={(e) => setUserName(e.target.value)}
					/>
				</div>
				<div className='text_box'>
					<input 
						type='text' 
						placeholder='User Surname' 
						value={surname} 
						onChange={(e) => setUserSurname(e.target.value)}
					/>
				</div>
				<div className='text_box'>
					<input 
						type='text' 
						placeholder='Age' 
						value={age} 
						onChange={(e) => setAge(e.target.value)}
					/>
				</div>
				<div className='text_box'>
					<input 
						type='text' 
						placeholder='Email' 
						value={email} 
						onChange={(e) => setEmail(e.target.value)}
					/>
				</div>
				<div className='text_box'>
					<input 
						type='text' 
						placeholder='TC Number' 
						value={doctor_tcNumber} 
						onChange={(e) => setTCNumber(e.target.value)}
					/>
				</div>
				<div className='text_box'>
					<input 
						type='password' 
						placeholder="Password"
						value={passwd}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</div>
				<div className='select_option'>
					<select value={disposition} onChange={(e) => setDisposition(e.target.value)}> 
						<option>Select Disposition:</option>
						<option value='Attending Physician'>Attending Physician</option>
						<option value='Senior Resident'>Senior Resident</option>
						<option value='Junior Resident'>Junior Resident</option>
						<option value='Chief Resident'>Chief Resident</option>
						<option value='Head of Department'>Head of Department</option>
						<option value='Fellow'>Fellow</option>
						<option value='Intern'>Intern</option>
					</select>
				</div>
				<div className="radio_box">
					<input 
						type="radio" 
						value="Female"
						name="gender"
						checked={gender === "Female"} //Database icin {gender} kullan, date icin {displayDate} kullan
						onChange={(e) => setGender(e.target.value)}
					/>Female
					<input 
						type="radio" 
						value="Male"
						name="gender"
						checked={gender === "Male"}
						onChange={(e) => setGender(e.target.value)}
					/>Male
				</div>
				<div className='save_button'>
					<input type='button' value='Save' onClick = {insertDoctor} />
				</div>
			</form>
		</div>
	);
}


export default AddUser;