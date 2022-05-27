import React from 'react';
import {useState, useEffect} from 'react';
import './Statistics.css';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement
)

const Statistics = () => {

	const [diseases, setDiseases] = useState([]);

	useEffect(() => {
		fetch('http://127.0.0.1:5000/statistics', {
			'method': 'GET',
			headers: {
				'Content-Type': 'applications/json'
			}
		})
		.then(resp => resp.json())
		.then(resp => setDiseases(resp))
		.catch(error => console.log(error))
	},[])

	var data = {
        labels: diseases.map(x => x.diseaseLevel.split('-->')[0]),
        datasets: [{
            label: '# of Diseases',
            data: diseases.map(x => x.diseaseLevel.split('-->')[1]),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    }
    var options = {
    	maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        legend: {
        	labels: {
        		fontSize: 26
        	}
        }
    }
	return (
		<div className='statistics_page'>
			<Bar 
				data = {data}
				height= {400}
				options = {options}
			/>
		</div>
	);
}


export default Statistics;