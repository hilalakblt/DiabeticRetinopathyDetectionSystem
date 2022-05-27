import React from 'react';
import './PopupError.css';


function PopupError(props){
	return(props.trigger) ? (
		<div className="popup">
			<div className="popup-inner">
				<button className="close-button" onClick={() => props.setTrigger(false)} >Close</button>
				{props.children}
			</div>
		</div>

	) :"";
}

export default PopupError;