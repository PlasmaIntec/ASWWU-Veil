import React from "react";
import "./Search.css";

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.input = React.createRef();
	}
  
	handleSubmit(event) {
		alert('A name was submitted: ' + this.input.current.value);
		event.preventDefault();
	}
  
	render() {
		return (
			<div>
				<input type="text" className="Search-bar" placeholder="Search..." />
			</div>
		);
	}
}

export default Search;