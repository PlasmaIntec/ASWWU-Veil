import neo4j from "neo4j-driver";

// const loggingConfig = {logging: neo4j.logging.console('debug')}; // DEBUG
// var driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"), loggingConfig);
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
			return result.records.map(record => {
				var profile = record.get("profile");
				var properties = profile.properties;
				var username = properties.username;
				var url = properties.url;
				return { username, url };
			});
		})
		.catch(error => {
			throw error;
		});
}

var createRelationship = (subject, verb, object) => {
	var session = driver.session();
	return session
		.run(
			`CALL {
				MATCH (a:Profile)
				WHERE a.username =~ $subject
				RETURN a
				LIMIT 1
			}
			CALL {
				MATCH (b:Profile)
				WHERE b.username =~ $object
				RETURN b
				LIMIT 1
			}
			CREATE (a)-[:${verb.toUpperCase()}]->(b)
			RETURN a, b`,
			{
				subject: '(?i).*' + subject + '.*',
				object: '(?i).*' + object + '.*',
			}
		)
		.then(result => {
			return result.records.map(record => {
				var profileA = record.get("a");
				var profileB = record.get("b");
				var usernameA = profileA.properties.username;
				var usernameB = profileB.properties.username;
				return { usernameA, usernameB };
			});
		})
		.catch(error => {
			throw error;
		});
}

var getRelationships = (subject, object) => {
	var session = driver.session();
	return session
		.run(
			`CALL {
				MATCH (a:Profile)
				WHERE a.username =~ $subject
				RETURN a
				LIMIT 1
			}
			CALL {
				MATCH (b:Profile)
				WHERE b.username =~ $object
				RETURN b
				LIMIT 1
			}
			MATCH (a)-[r]->(b)
			RETURN r`,
			{
				subject: '(?i).*' + subject + '.*',
				object: '(?i).*' + object + '.*',
			}
		)
		.then(result => {
			return new Set(result.records.map(record => {
				return record.get("r").type;
			}))
		})
		.catch(error => {
			throw error;
		});
}

var deleteRelationships = (subject, verb, object) => {
	var session = driver.session();
	return session
		.run(
			`CALL {
				MATCH (a:Profile)
				WHERE a.username =~ $subject
				RETURN a
				LIMIT 1
			}
			CALL {
				MATCH (b:Profile)
				WHERE b.username =~ $object
				RETURN b
				LIMIT 1
			}
			MATCH (a)-[r:${verb.toUpperCase()}]->(b)
			DELETE r`,
			{
				subject: '(?i).*' + subject + '.*',
				object: '(?i).*' + object + '.*',
			}
		)
		.then(result => {
			return result;
		})
		.catch(error => {
			throw error;
		});
}

export { 
	searchProfiles, 
	createRelationship, 
	getRelationships,
	deleteRelationships
};