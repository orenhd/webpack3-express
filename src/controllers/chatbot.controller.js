import request from 'request';

import * as youTubeApiService from '../services/youtube_api.service';

export const webhook = (req, res) => {

  // Make sure this is a page subscription
  if (req.body.object == "page") {
    // Iterate over each entry
    // There may be multiple entries if batched
    req.body.entry.forEach((entry) => {
      // Iterate over each messaging event
      entry.messaging.forEach((event) => {
		if (event.message) {
          processMessage(event);
        } else if (event.postback) {
			if (event.sender.id === process.env.MY_MICHAL_ID || event.sender.id === process.env.MY_ID) {
				processMyPostback(event);
			}
		}
      });
    });

    res.sendStatus(200);
  }
}

/**
 * Chatbot Functions
 **/

function processMessage(event) {
    let message = event.message;
    let senderId = event.sender.id;

    // You may get a text or attachment but not both
    if (message.text) {
      let formattedMsg = message.text.toLowerCase().trim();
		// Get user's first name from the User Profile API
		// and include it in the greeting
		/*
		request({
		  url: "https://graph.facebook.com/v2.10/" + senderId,
		  qs: {
			access_token: process.env.PAGE_ACCESS_TOKEN,
			fields: "first_name"
		  },
		  method: "GET"
		}, (error, response, body) => {
		  if (error) {
			console.log("Error getting user's name: " +  error);
		  } else {
			let bodyObj = JSON.parse(body);
			let senderName = bodyObj.first_name;
			fetchVideoAndSend(formattedMsg, senderId, senderName);
		  }
		  
		});
		*/
		fetchVideoAndSend(formattedMsg, senderId, 'senderName');
    } else if (message.attachments) {
      sendMessage(senderId, {text: "Sorry, I don't understand your request."});
    }
}

function processMyPostback(event) {
  let senderId = event.sender.id;
  let payload = event.postback.payload;
}

function fetchVideoAndSend(formattedMessage, recipientId, recipientName) {
	youtubeApiService.searchList(formattedMessage).then((response, err) => {
		if (err) {
			//TODO: handle error
		} else if (response && response.items[0]) {
			let videoData = response.items[0];
			let message = {
				"attachment": {
				  "type": "template",
				  "payload": {
				  "template_type":"generic",
					"elements":[
					   {
						"title": videoData.snippet.title,
						"image_url": videoData.snippet.thumbnails.medium.url,
						"subtitle": videoData.snippet.description,
						"default_action": {
						  "type": "web_url",
						  "url": `https://www.youtube.com/watch?v=${videoData.id.videoId}`,
						}      
					  }
					]
				  }
				}
			}
			sendMessage(recipientId, message)
		}
	})
}

// sends message to user
function sendMessage(recipientId, message) {
  request({
    url: "https://graph.facebook.com/v2.10/me/messages",
    qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
    method: "POST",
    json: {
      recipient: {id: recipientId},
      message: message,
    }
  }, function(error, response, body) {
    if (error) {
      console.log("Error sending message: " + response.error);
    } else {
	  //console.log(response);
	}
  });
}

/**
 * YouTube API Test functions
 **/

export const youtube_search = (req, res) => {
	youTubeApiService.searchList(req.query['query_string']).then((searchListRepoonse, err) => {
		if (err) {
		  handleError(res, err.message, "searchList Error");
		} else {
		  res.status(200).json(searchListRepoonse);
		}
	})
}