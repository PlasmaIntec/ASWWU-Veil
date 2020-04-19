import React from "react";
import "./Search.css";
import { searchProfiles } from "./neo4jApi";
import ProfileGrid from "./ProfileGrid.jsx"
import { Subject, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';

const sub$ = new Subject();
const debouncedSub$ = sub$.pipe(debounce(() => interval(200)))

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

	componentDidMount() {
		debouncedSub$.subscribe(query => {
			searchProfiles(query)
				.then(profiles => this.setState({ profiles }, () => console.log(this.state.profiles)))
		})
	}
  
	handleSubmit(event) {
		this.setState({
			query: event.target.value
		}, this.search)
	}

	search() {
		var query = this.state.query;
		debouncedSub$.next(query);
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