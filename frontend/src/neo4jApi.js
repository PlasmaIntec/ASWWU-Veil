import neo4j from "neo4j-driver";

var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));

var searchProfiles = (queryString) => {
	var session = driver.session();
	return session
		.run(
			`MATCH (profile:Profile)
			WHERE profile.username =~ $username
			RETURN profile
			LIMIT 20`,
			{username: '(?i).*' + queryString + '.*'}
		)
		.then(result => {
			// session.close();
			return result.records.map(record => {
				var profile = record.get("profile");
				var properties = profile.properties;
				var username = properties.username;
				var url = properties.url;
				return { username, url };
			});
		})
		.catch(error => {
			// session.close();
			throw error;
		});
}

export default searchProfiles;