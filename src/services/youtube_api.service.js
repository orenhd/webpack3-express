import google from 'googleapis';

const urlshortener = google.urlshortener('v1');
const youtube = google.youtube('v3');

const constQuery = 'Paul Simon';

export const searchList = (queryString) => {
	let searchListPromise = new Promise((resolve, reject) => {
	
		youtube.search.list({
			auth: process.env.API_KEY,
			maxResults: '1',
							part: 'snippet',
							q: `${constQuery} ${queryString}`
		}, (err, response) => {
			if (err) {
			reject('searchList error');
			} else {
			resolve(response);
			}
		});
	});
	
	return searchListPromise;
}