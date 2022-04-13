import React, { Component } from 'react';
import CardList from './CardList';
import SearchBox from './SearchBox';
import { cardComponents } from './cardComponents';


class App extends Component {
	constructor(){
		super()
		this.state = {
			cardComponents : cardComponents,
			searchfield : ''
		}
	}

	onSearchChange = (event) => { //For doing interactive search
		 //.target.value -> we can get the letters
		this.setState({ searchfield: event.target.value })
		
	}

	render(){
		const filteredCards = this.state.cardComponents.filter(card => {
			return card.name.toLowerCase().includes(this.state.searchfield.toLowerCase());
		})

		return(
			<div className = 'tc'>
				<h1>Into The Space</h1>
				<SearchBox searchChange={this.onSearchChange}/>
				<CardList cardComponents = {filteredCards}/>
			</div>
		);
	}
}

export default App;