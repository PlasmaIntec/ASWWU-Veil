const neo4j = require("neo4j-driver");
const axios = require("axios");

// given list of profile usernames and urls, create node for each profile
const seed = async (profiles) => {
	const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "neo4j"));
	const session = driver.session();

	try {
		for (var profile of profiles) {
			var [username, url] = profile;

			var result = await session.writeTransaction(tx =>
				tx.run(
				'CREATE (a:Profile) SET a.username = $username, a.url = $url RETURN a.username + " has id: " + id(a) + " and url: " + a.url',
				{ username, url }
				)
			);

			var singleRecord = result.records[0];
			var result = singleRecord.get(0);
			console.log(result);
		}
	} finally {
		await session.close();
	}

	// on application exit:
	await driver.close();
}

// bulk upload profiles to neo4j
const upload = async () => {
	const imagesJsonUrl = "https://aswwu.com/server/search/all";
	axios.get(imagesJsonUrl)
	.then(async (json) => {
		console.log("IMAGE URLS ACQUIRED");
		var results = json.data.results;

		var profiles = [];
		for (var result of results) {
			var username = result.username;
			var url = `https://aswwu-veil.s3-us-west-2.amazonaws.com/${username}.jpg`;
			var profile = [username, url];
			profiles.push(profile);
		}

		seed(profiles);
	})
	.catch(console.error)
}

upload();