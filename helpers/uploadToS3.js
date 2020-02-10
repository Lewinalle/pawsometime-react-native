import Config from '../config';
import axios from 'axios';

export const uploadToS3 = async (fileUri, fileType, fileName) => {
	try {
		const postBody = {
			fileName: fileName,
			contentType: fileType
		};
		const postOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			data: JSON.stringify(postBody),
			url: `${Config.OTHERS_API_URL}/s3/uploadurl`
		};

		const s3SignedUrl = await axios(postOptions);

		// Uploading by axios(put) didn't work, replacing with XHR
		const xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					console.log('Successfully uploaded a file to S3.');
				} else {
					console.error('Something went wrong while uploading to S3.');
					alert('Sorry, something went wrong while uploading the image. Please try again.');
				}
			}
		};
		xhr.open('PUT', s3SignedUrl.data);
		xhr.setRequestHeader('Content-Type', fileType);
		xhr.send({ uri: fileUri, type: fileType, name: fileName });

		// IF YOU WANT TO MAKE S3 BUCKET PRIVATE, THEN YOU HAVE TO CALL ENDPOINT FOR:
		// s3.getSignedUrl('getObject', ...) TO GET PRE_SIGNED URL FOR DOWNLOAD
	} catch (err) {
		console.error(err);
		alert('Sorry, something went wrong while uploading the image. Please try again.');
	}
};
