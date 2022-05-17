export default class APIService {

	static InsertDoctor(body) {
		return fetch(`http://127.0.0.1:5000/adduser`, {
			'method': 'POST',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': 'Bearer' + 'access_token' 
			},
			body: JSON.stringify(body)
		})
		.then(resp => resp.json())
	}

	static DeletePatient(patientsId) {
		return fetch(`http://127.0.0.1:5000/delete/${patientsId}`, {
			'method': 'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
      			'Access-Control-Allow-Headers': 'Content-Type',
      			'Access-Control-Allow-Origin': 'http://localhost:3000',
      			'Access-Control-Allow-Methods': 'DELETE',
      			'Authorization': 'Bearer access_token',			
			}
		})
	}

}
//Cors localhost:8080 portunu bunun icin ayarlamayi ogren simdilik no-cors kullan
