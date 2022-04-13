import React from 'react';
import {useState, useEffect} from 'react';
import './Patients.css';

const Patients = () => {

	const [patients, setPatients] = useState([])

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

	return (
		<div className='patients_page'>
			{patients.map(patient => {
				return(
					<div key = {patient.patientsId}>
						<h2>{patient.nameSurname}</h2>
						<p>{patient.doctorName} {patient.doctorSurname}</p>
						<div className='delete_button'>
							<input type='button' value='Delete' />
						</div>
					</div>
				)
			})}
		</div>
	);
}


export default Patients;