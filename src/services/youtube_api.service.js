import google from 'googleapis';

let instance = null;

const urlshortener = google.urlshortener('v1');
const youtube = google.youtube('v3');

const constQuery = 'Paul Simon';

export default class YouTubeApiService {  
    constructor() {
        if(!instance){
            instance = this;
			/*
			let params = {
				auth: process.env.API_KEY,
				shortUrl: 'http://goo.gl/xKbRu3'
			};

			// get the long url of a shortened url
			urlshortener.url.get(params, (err, response) => {
			  if (err) {
				console.log('Encountered error', err);
			  } else {
				console.log('Long url is', response.longUrl);
			  }
			});
			
			youtube.search.list({
				auth: process.env.API_KEY,
				maxResults: '1',
                part: 'snippet',
                q: 'front 242'
			}, (err, response) => {
			  if (err) {
				console.log('Encountered error', err);
			  } else {
				console.log('Response', response.items[0].id, response.items[0].snippet);
			  }
			});
			*/
		}

        return instance;
    }
	
	searchList(queryString) {
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
}