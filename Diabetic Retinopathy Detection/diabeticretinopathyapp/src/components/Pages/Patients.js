import React from 'react';
import {useState, useEffect} from 'react';
import './Patients.css';
import APIService from './APIService';

const Patients = () => {

	const [patients, setPatients] = useState([])

	useEffect(() => {
		fetch('http://127.0.0.1:5000/patients', {
			'method': 'GET',
			headers: {
				'Content-Type': 'applications/json',
				'Authorization': `Token ${localStorage.getItem('token')}`,
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

	const deletePatient = (patient) => {
		APIService.DeletePatient(patient.patientsId)
		.then(() => deletedPatient(patient))
	}

	return (
		<div className='patients_page'>
			{patients.map(patient => {
				return(
					<div key = {patient.patientsId} className='patient_info'>
						<h2>{patient.nameSurname}</h2>
						<p>Doctor Name Surname: {patient.doctorName} {patient.doctorSurname}</p>
						<p>Tc Number: {patient.patientsTcNumber}</p>
						<div className='delete_button'>
							<input type='button' value='Delete' onClick = {() => deletePatient(patient)} />
						</div>
					</div>
				)
			})}
		</div>
	);
}


export default Patients;