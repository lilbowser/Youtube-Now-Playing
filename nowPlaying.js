// Copyright (c) 2016 A Goldfarb. All rights reserved.

var pollingFrequency = 1000; //(ms)
var currentTitle = "";
var debugging = true;
var chn_image_retry_count = 0;
debug("Youtube Now Playing Injected!");


async function checkVideoChange() {
	setTimeout(checkVideoChange, pollingFrequency);
	if (currentTitle != document.title) {

		// debug("Doc Title - Current: "+ document.title + " , Former: " + currentTitle)
		debug("Form Doc Title: " + currentTitle);
		currentTitle = document.title;
		debug("Cur Doc Title: " + document.title);

		if ('/watch' === location.pathname) {
			
			var video_img = getVideoImage();
	    	var title = getSongTitle();
	    	// var img = await getChannelImage();
	    	var img = getChannelImage();
	    	var name = getChannelName();
	    	debug("Showing Notification");
	    	showNotification(title, name, img, video_img);
	    };
	};
};


function getSongTitle(){
	//	<h3 class="style-scope ytd-compact-radio-renderer">
    //    <ytd-badge-supported-renderer class="style-scope ytd-compact-radio-renderer">
    //		<template is="dom-repeat" id="repeat" as="badge" class="style-scope ytd-badge-supported-renderer"></template>
    //	  </ytd-badge-supported-renderer>
    //    <span id="video-title" class="style-scope ytd-compact-radio-renderer" title="Mix - 【CYBER DIVA】LOVE【Vocaloid Original Song】">
    //      Mix - 【CYBER DIVA】LOVE【Vocaloid Original Song】
    //    </span>
    //  </h3>

	//Fixed on 10/15/2017.
	try{
		//var element = document.getElementById("video-title");
		//var title = element.title;
		var title = document.getElementsByClassName("ytp-title-link")[0].innerHTML;
		debug("Song Title: " + title);
		return title;
	}
	catch(err){
		console.log(err);
		console.log("Title could not be found!");
		return "Title could not be found!";
	}
};

// async 
function getChannelImage(){
 	try{
 		//https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep/39914235#39914235

 		//This should be done better
 		var owner_renderer = document.getElementsByTagName('ytd-video-owner-renderer')[0]
 		// var avatar = document.getElementById("avatar");
 		var avatar_img = owner_renderer.getElementsByTagName('img');
 		link = avatar_img[0].src;
 		debug("Channel Image URL: " + link);
 		//return "miku128.png";
 		if (!link.trim()){
 			if (chn_image_retry_count < 5){
 				chn_image_retry_count++;
 				debug('Waiting for page load.')
 				// await sleep(50)
 				return getChannelImage();
 			}else{
 				link = "miku128.png";
 			}
 			
 		}
 		return link;
 	}
 	catch(err){
		console.log(err);
		console.log("Channel Image could not be found!");
		return "Channel Image could not be found!";
 	}
 	
};

function getChannelName(){

	try{
 		var chn_name_container = document.getElementById("owner-container");
 		var chn_name = chn_name_container.getElementsByClassName('yt-formatted-string')[0].text;
 		debug("Channel Name: " + chn_name);
 		return chn_name;
 	}
 	catch(err){
		console.log(err);
		console.log("Channel Name could not be found!");
		return "Channel Name could not be found!";
 	}
};

function getVideoImage(){

	//TODO: Use the YouTube APIv3 to get correct image. http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
	// http://img.youtube.com/vi/0-LysJT-XNw/0.jpg
	// https://www.youtube.com/watch?v=tvrv1YZWjRY

	//get video ID

	try{
		var video_id = location.search.split('v=')[1];
		var ampersandPosition = video_id.indexOf('&');
		if(ampersandPosition != -1) {
		  video_id = video_id.substring(0, ampersandPosition);
		}

		//construct video image URL
		var video_img = "https://img.youtube.com/vi/" + video_id +"/0.jpg"
		debug("Video Image Url: " + video_img);
		return video_img;
	}
	catch(err){
		console.log(err);
		console.log("Video Image could not be found!");
		return "Video Image could not be found!";
 	}
};

function showNotification(songName, channelName, channelImage, videoImage){
	chrome.runtime.sendMessage(
		{
			song_name: songName,
			channel_name: channelName,
			channel_image: channelImage,
			video_image: videoImage

		}
	);
};

function debug (message) {
	if (debugging) {
		console.log(message);
	};
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


setTimeout(checkVideoChange, pollingFrequency);
