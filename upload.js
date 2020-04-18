const fs = require('fs');
const AWS = require('aws-sdk');
const axios = require('axios');

// Enter copied or downloaded access id and secret here
const ID = AWS.config.credentials.accessKeyId;
const SECRET = AWS.config.credentials.secretAccessKey;

// Enter the name of the bucket that you have created here
const BUCKET_NAME = 'aswwu-veil';

// Initializing S3 Interface
const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

// upload File fileName to S3 with Key keyName
const uploadFile = (fileName, keyName) => {
    // read content from the file
    const fileContent = fs.readFileSync(fileName);

    // setting up s3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: keyName, // file name you want to save as
        Body: fileContent
	};
	
	return new Promise((resolve, reject) => {
		// Uploading files to the bucket
		s3.upload(params, function(err, data) {
			if (err) {
				reject(err);
			}
			console.log(`File uploaded successfully. ${data.Location}`);
			resolve();
		});
	})
};

// download image from url to fileName
const downloadImage = async (url, fileName) => {  
	const writer = fs.createWriteStream(fileName);
  
	const response = await axios({
	  url,
	  method: 'GET',
	  responseType: 'stream'
	});
  
	response.data.pipe(writer);
  
	return new Promise((resolve, reject) => {
		writer.on('finish', resolve);
		writer.on('error', reject);
	});
};

// bulk upload profile pictures to S3
const upload = async () => {
	const imagesJsonUrl = "https://aswwu.com/server/search/all";
	axios.get(imagesJsonUrl)
	.then(async (json) => {
		console.log("IMAGE URLS ACQUIRED");
		var results = json.data.results;

		for (var result of results) {
			var username = result.username;
			var photoUrl;
			if (!result.username || !result.photo || result.photo === "None") {
				photoUrl = "https://aswwu.com/media/img-sm/images/default_mask/default.jpg";
			} else {
				photoUrl = `https://aswwu.com/media/img-sm/${result.photo}`;
			}
			console.log(username, photoUrl);

			try {
				await downloadImage(photoUrl, "temp.jpg");
			} catch (error) {
				console.log(error.response.status);
				if (error.response.status == 415) {
					await downloadImage("https://aswwu.com/media/img-sm/images/default_mask/default.jpg", "temp.jpg");
				} else {
					throw new Error();
				}
			}

			await uploadFile("temp.jpg", `${username}.jpg`);
			
			await fs.unlinkSync("temp.jpg");
		}
	})
	.catch(console.error)
}

upload();