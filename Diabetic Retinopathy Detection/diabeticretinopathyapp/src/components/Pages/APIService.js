export default class APIService {

	static InsertDoctor(body) {
		return fetch(`http://127.0.0.1:5000/adduser`, {
			'method': 'POST',
			mode: 'no-cors',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(body)
		})
		.then(resp => resp.json())
	}

}
//Cors localhost:8080 portunu bunun icin ayarlamayi ogren simdilik no-cors kullan