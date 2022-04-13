import React from 'react';
import Card from './Card';

const CardList = ({cardComponents}) => {

	return (
		<div>
			{
				cardComponents.map((user, i) => {
					return(
						<Card 
							key = {i} 
							id = {cardComponents[i].id} 
							name = {cardComponents[i].name} 
							property = {cardComponents[i].property} 
							image = {cardComponents[i].image}
						/>
					);
				})
			}
		</div>
	);
}

export default CardList;