import React from 'react';
import {useState, useEffect} from 'react';
import './Patients.css';
import PopupError from './PopupError.js';
import PopupSuccess from './PopupSuccess';

const Patients = (props) => {

	const [patients, setPatients] = useState([]);
	const [buttonPopup, setButtonPopup] = useState(false);
	const [popupSuccess, setPopupSuccess] = useState(false);
	const [patientDetails, setPatientDetails] = useState(false);

	useEffect(() => {
		fetch('http://127.0.0.1:5000/patients', {
			'method': 'GET',
			headers: {
				'Content-Type': 'applications/json'
			}
		})
		.then(resp => resp.json())
		.then(resp => setPatients(resp))
		.catch(error => console.log(error))
	},[])

	const deletedPatient = (patient) => {
		const new_patient = patients.filter(mypatient => {
			if(mypatient.patientsId === patient.patientsId){
				return false;
			}
			return true
		})
		setPatients(new_patient)
	}

	async function deletePatient(patient){
		const patientsId = patient.patientsId
		const reqOptions = {
			method: 'DELETE',
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
      			'Access-Control-Allow-Headers': 'Content-Type',
      			'Access-Control-Allow-Origin': 'http://localhost:3000',
      			'Access-Control-Allow-Methods': 'DELETE',
      			'Authorization': 'Bearer ' + props.token
			}
		};
		let result = await fetch(`http://127.0.0.1:5000/delete/${patientsId}`, reqOptions);
		if(result.status === 200){
			deletedPatient(patient)
			setPopupSuccess(true)
		}else{
			setButtonPopup(true)
		}
	}

	return (
		<div className='patients_page'>
			{patients.map(patient => {
				return(
					<div key = {patient.patientsId} className='patient_info'>
						<h4>{patient.nameSurname}</h4>
						<p>Doctor Name Surname: {patient.doctorName} {patient.doctorSurname}</p>
						<p>Tc Number: {patient.patientsTcNumber}</p>
						<div className='delete_button'>
							<input type='button' value='Delete' onClick = {() => deletePatient(patient)} />
							<PopupError trigger={buttonPopup} setTrigger={setButtonPopup}>
								<h3>You do not have permission!</h3>
							</PopupError>
							<PopupSuccess trigger={popupSuccess} setTrigger={setPopupSuccess}>
								<h3>User is deleted!</h3>
							</PopupSuccess>
						</div>
					</div>
				)
			})}
		</div>
	);
}


export default Patients;