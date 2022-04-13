import React from 'react';


const Card = ({name, property, image}) => {

	return(

		<div className = 'bg-gray dib br3 pa3 ma2 grow bw2 shadow-5'>
			<img alt='photo' src= {image} height = "200" width = "300"/>
			<div>
				<h2>{name}</h2>
				<p>{property}</p>
			</div>
		</div>
	);
}
export default Card;