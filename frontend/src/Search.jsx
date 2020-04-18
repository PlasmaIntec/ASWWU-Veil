import React from "react";
import "./Search.css";
import search from "./neo4jApi";
import ProfileGrid from "./ProfileGrid.jsx"

class Search extends React.Component {
	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.search = this.search.bind(this);
		this.state = {
			query: "",
			profiles: []
		};
	}
  
	handleSubmit(event) {
		this.setState({
			query: event.target.value
		}, this.search)
	}

	search() {
		var query = this.state.query;
		search(query)
			.then(profiles => this.setState({ profiles }, () => console.log(this.state.profiles)))
	}
  
	render() {
		return (
			<div>
				<input type="text" className="Search-bar" placeholder="Search..." onChange={this.handleSubmit} />
				<ProfileGrid profiles={this.state.profiles} /> 
			</div>
		);
	}
}

export default Search;