import React from 'react';
import { useState } from 'react';
import './Detection.css'

const Detection = () => {

	const [patientsTCNumber, setPatientsTCNumber] = useState('');
	const [nameSurname, setNameSurname] = useState('');
	const [age, setAge] = useState('');
	const [gender, setGender] = useState('');
	const [picture, setPicture] = useState('');
	const [imgData, setImgData] = useState('');

	var showdate = new Date();
	var displayDate = showdate.getDate()
			  + '/' + showdate.getMonth() 
			  + '/' + showdate.getFullYear(); // Database icin {displayDate} kullan

	const uploadPhoto = (e) => {
		if (e.target.files[0]) {
	      console.log("retinalImage: ", e.target.files);
	      setPicture(e.target.files[0]);
	      const reader = new FileReader();
	      reader.addEventListener("load", () => {
	        setImgData(reader.result);
	      });
	      reader.readAsDataURL(e.target.files[0]);
	    }
	};
		

	return (
		<div className='detection_page'>
			<form>
				<br/>
				<div className="text_box">
					<input 
						type="text" 
						placeholder="TC Number"
						value={patientsTCNumber} //Database icin burdaki deger
						onChange={(e) => setPatientsTCNumber(e.target.value)}
					/>
				</div>
				<br/>
				<div className="text_box">
					<input 
						type="text" 
						placeholder="Name and Surname"
						value={nameSurname} //Database icin burdaki deger
						onChange={(e) => setNameSurname(e.target.value)}
					/>
				</div>
				<br/>
				<div className="text_box">
					<input 
						type="text" 
						placeholder="Age"
						value={age}
						onChange={(e) => setAge(e.target.value)}
					/>
				</div>
				<br/>
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
					<input type="file" accept="image/*" onChange={uploadPhoto} />
				</div>
								
			</form>
		</div>
	);
}


export default Detection;