import React from 'react';
import { useState } from 'react';
import './Detection.css'

const Detection = (props) => {

	const [patientsTcNumber, setPatientsTCNumber] = useState('');
	const [nameSurname, setNameSurname] = useState('');
	const [age, setAge] = useState('');
	const [gender, setGender] = useState('');
	const [file, setFile] = useState(null);
	const [imgData, setImgData] = useState('');
	const [diseaseLevel, setDiseaseLevel] = useState(null);

	/*var showdate = new Date();
	var displayDate = showdate.getDate()
			  + '/' + showdate.getMonth() 
			  + '/' + showdate.getFullYear(); // Database icin {displayDate} kullan*/

	

	async function onSubmit(){
		const formData = new FormData();
		formData.append('file', file);
		let result = await fetch('http://127.0.0.1:5000/detection', {
			method: 'POST',
			body: formData
		});
		if (result.status === 200){
			const text = await result.text();
			setDiseaseLevel(text);
		}else {
			setDiseaseLevel("Error from API");
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

	const insertPatient = () => {
		const requestOption = {
			method: 'POST',
			headers: { 
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + props.token
			},
			body: JSON.stringify({patientsTcNumber:patientsTcNumber, nameSurname:nameSurname, age:age, gender:gender, diseaseLevel:diseaseLevel})
		};
		fetch('http://127.0.0.1:5000/savepatient', requestOption)
			.then(response => response.json())

		setPatientsTCNumber("");
		setNameSurname("");
		setAge("");
		setGender("");
		setDiseaseLevel(null);
		setFile(null)
		setImgData('')
			
	}	

	return (
		<div className='detection_page'>
			<form >
				<br/>
				<div className="text_box">
					<input 
						type="text" 
						placeholder="TC Number"
						value={patientsTcNumber}
						onChange={(e) => setPatientsTCNumber(e.target.value)}
					/>
				</div>
				
				<div className="text_box">
					<input 
						type="text" 
						placeholder="Name and Surname"
						value={nameSurname}
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
						checked={gender === "Female"}
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
					<input type='button' value='Save' onClick={insertPatient} />
				</div>
					{diseaseLevel}	
			</form>
			
		</div>
	);
}


export default Detection;