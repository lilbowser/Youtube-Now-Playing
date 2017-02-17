// Copyright (c) 2016 A Goldfarb. All rights reserved.

var pollingFrequency = 1000; //(ms)
var currentTitle = "";
var debugging = false;
debug("Youtube Now Playing Injected!");


function checkVideoChange() {
	setTimeout(checkVideoChange, pollingFrequency);
	if (currentTitle != document.title) {
		currentTitle = document.title;
		debug(document.title);

		if ('/watch' === location.pathname) {
			
			var video_img = getVideoImage();
	    	var title = getSongTitle();
	    	var img = getChannelImage();
	    	var name = getChannelName();
	    	showNotification(title, name, img, video_img);
	    };
	};
};


function getSongTitle(){
	// <h1 class="watch-title-container">     
	//   <span id="eow-title" class="watch-title" dir="ltr" title="【Fukase V4】Tokyo Teddy Bear-東京テディベア【VOCALOID カバー】">
	//     【Fukase V4】Tokyo Teddy Bear-東京テディベア【VOCALOID カバー】
	//   </span>
	// </h1>
	var element = document.getElementsByClassName("watch-title");

	if (element[0].title != null) {
		return element[0].title;
	} else{
		return "";
	};
	
};

function getChannelImage(){
// <span class="yt-thumb-clip">
//   <img width="48" alt="Nogate 虎" height="48" src="photo.jpg">
//	 <span class="vertical-align"></span>
// </span>

 	var topElement = document.getElementsByClassName("video-thumb  yt-thumb yt-thumb-48 g-hovercard");
 	debug(topElement);
 	if (topElement != null) {
 		var element = topElement[0].getElementsByClassName("yt-thumb-clip");
 		if (element != null) {
 			var imgEle = element[0].getElementsByTagName('img');
 			if (imgEle != null) {
 				debug(imgEle[0].getAttribute("data-thumb"));
		 		var val = imgEle[0].getAttribute("data-thumb");
		 		if (val == null) {
		 			val = imgEle[0].src;
		 		};
		 		return val;
 			};
 		};
 	};
 	return "";
 	
};

function getChannelName(){
// <div class="yt-user-info">
//    <a href="" class="g-hovercard yt-uix-sessionlink      spf-link " data-sessionlink="">Nogate 虎</a>
// </div>

	var topElement = document.getElementsByClassName("video-thumb  yt-thumb yt-thumb-48 g-hovercard");
	if (topElement != null) {
		var element = topElement[0].getElementsByClassName("yt-thumb-clip");
		if (element != null) {
	 		var imgEle = element[0].getElementsByTagName('img');
	 		if (imgEle != null) {
		 		debug(imgEle[0].alt);
		 		return imgEle[0].alt;
		 	};
	 	};
	};
	return "";
};

function getVideoImage(){

	//TODO: Use the YouTube APIv3 to get correct image. http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
	// http://img.youtube.com/vi/0-LysJT-XNw/0.jpg
	// https://www.youtube.com/watch?v=tvrv1YZWjRY

	//get video ID
	var video_id = location.search.split('v=')[1];
	var ampersandPosition = video_id.indexOf('&');
	if(ampersandPosition != -1) {
	  video_id = video_id.substring(0, ampersandPosition);
	}

	//construct video image URL
	var video_img = "https://img.youtube.com/vi/" + video_id +"/0.jpg"
	return video_img;
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

setTimeout(checkVideoChange, pollingFrequency);
