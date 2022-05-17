import React from 'react';
import { useState } from 'react';
import './Detection.css'
import axios from 'axios';

const Detection = (props) => {

	const [patientsTCNumber, setPatientsTCNumber] = useState('');
	const [nameSurname, setNameSurname] = useState('');
	const [age, setAge] = useState('');
	const [gender, setGender] = useState('');
	const [file, setFile] = useState(null);
	const [imgData, setImgData] = useState('');
	const [prediction, setPrediction] = useState(null);

	var showdate = new Date();
	var displayDate = showdate.getDate()
			  + '/' + showdate.getMonth() 
			  + '/' + showdate.getFullYear(); // Database icin {displayDate} kullan

	

	async function onSubmit(){
		const formData = new FormData();
		formData.append('file', file);
		let result = await fetch('http://127.0.0.1:5000/detection', {
			method: 'POST',
			body: formData
		});
		if (result.status === 200){
			const text = await result.text();
			setPrediction(text);
		}else {
			setPrediction("Error from API");
		}
	} 
		
	const uploadPhoto = (e) => {
		if (e.target.files[0]) {
	      console.log("retinalImage: ", e.target.files);
	      setFile(e.target.files[0]);
	      const reader = new FileReader();
	      reader.addEventListener("load", () => {
	        setImgData(reader.result);
	      });
	      reader.readAsDataURL(e.target.files[0]);
	    }
	};

	/*const insertPatient = () => {
		APIService.InsertDoctor({ patientsTCNumber, nameSurname, age, gender, prediction})
		.then(resp => console.log(resp))
		.catch(error => console.log(error))
		//After adding doctor clear the inputs
		setPatientsTCNumber("");
		setNameSurname("");
		setAge("");
		setGender("");
		setPrediction(null);
		setFile(null)
	}*/

	return (
		<div className='detection_page'>
			<form >
				<br/>
				<div className="text_box">
					<input 
						type="text" 
						placeholder="TC Number"
						value={patientsTCNumber} //Database icin burdaki deger
						onChange={(e) => setPatientsTCNumber(e.target.value)}
					/>
				</div>
				
				<div className="text_box">
					<input 
						type="text" 
						placeholder="Name and Surname"
						value={nameSurname} //Database icin burdaki deger
						onChange={(e) => setNameSurname(e.target.value)}
					/>
				</div>
				
				<div className="text_box">
					<input 
						type="text"
						placeholder="Age"
						value={age}
						onChange={(e) => setAge(e.target.value)}
					/>
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
				<div className="image_box">
					<img src={imgData} alt="" />
				</div>
				<div className="file_upload">
					<input type="file" id="fl" onChange={uploadPhoto} />
				</div>
				<div className='detection_button'>
					<input type='button' value='Detect' onClick={onSubmit} />
					<input type='button' value='Save' />
				</div>
					{prediction}	
			</form>
			
		</div>
	);
}


export default Detection;