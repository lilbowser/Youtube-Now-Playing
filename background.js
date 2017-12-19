	// Copyright (c) 2016 A Goldfarb. All rights reserved.

	
	/*
	  Displays a notification with the current playing video on Youtube. Requires "notifications"
	  permission in the manifest file (or calling
 	  "Notification.requestPermission" beforehand).
	*/
var tagCount = 0;
var currentTab;
var numOfOpenNotifications = 0;
var notificationIDMap = new Array();
// function show(song_name, channel_name, img_url) {
	
// 	console.log("Creating new notification: ");
// 	console.log(song_name);
// 	console.log(channel_name);
// 	console.log(img_url);
// 	var notification = new Notification(song_name, {
// 		// icon: '48.png',
//     	icon: img_url,
//     	body: "Artist: " + channel_name,
//     	tag: tagCount.toString()
    	
// 	});
// 	incrementTag();

// 	setTimeout(function(){
// 		console.log(notification);
// 		notification.close();
// 	},localStorage.displayTime*1000); //seconds -> ms
// }

function showC(song_name, channel_name, img_url, video_img_url, tabID) {
	
	
	incrementTag();
	notificationIDMap[tagCount.toString()] = tabID;
	currentTab = tabID;
	numOfOpenNotifications++;
	console.log("Creating new notification: " + tagCount.toString());
	console.log(song_name);
	console.log(channel_name);
	console.log(img_url);

	var notiOptions = {
			type: "image",//"basic",
			iconUrl: img_url,//"miku128.png",//"img_url.jpg",
			title: song_name,
			message: "Artist: " + channel_name,
			imageUrl: video_img_url,//"miku128.png",//
			isClickable: true,
			requireInteraction: true
		};
	

	chrome.notifications.create(tagCount.toString(), notiOptions, function(){});
	// setTimeout(closeNotification, localStorage.displayTime*1000); //seconds -> ms
	setTimeout(closeNotificationP.bind(null, tagCount.toString()), localStorage.displayTime*1000); //seconds -> ms

}

function closeNotificationP(id){
	if (numOfOpenNotifications > 0) {
		// var tagToClose = oldestOpenedNotification()
		console.log("Auto Closing Notification " + id);
		chrome.notifications.clear(id);
	};
};

function closeNotification(){
	if (numOfOpenNotifications > 0) {
		var tagToClose = oldestOpenedNotification()
		console.log("Auto Closing Notification " + tagToClose.toString());
		chrome.notifications.clear(tagToClose.toString());
	};
};

function oldestOpenedNotification(){
	return tagCount - (numOfOpenNotifications -1);
}

function mostRecentNotification(){
	return tagCount;
}

function incrementTag(){
	if (tagCount < 10000) {
		tagCount++;
	} else{
		tagCount = 0;
	};
}

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (localStorage.isActivated == "true") {
			console.log("Title: " + request.song_name);
			// console.log(sender);
			showC(request.song_name, request.channel_name, request.channel_image, request.video_image, sender.tab.id);
		};
});


chrome.notifications.onClicked.addListener(function(notificationId) {
        console.log("R");
        if (notificationIDMap[notificationId]) {
        	var tabID = notificationIDMap[notificationId]
        	console.log("Making tab " + tabID + " active.");
        	chrome.tabs.update(tabID, {highlighted: true});

        	chrome.tabs.get(tabID, function(tabDetails){
        		// console.log(tabDetails);
        		// console.log(tabDetails.windowId);
        		chrome.windows.update(tabDetails.windowId, {focused: true});
        	});   	
        };
});


chrome.notifications.onClosed.addListener(function(notificationId, byUser){
	//clean up when notification is closed.
	console.log("Cleaning up notification " + notificationId);
	// var indexToRemove = notificationIDMap.indexOf(notificationId);
	// if (indexToRemove > -1){
		// notificationIDMap.splice(notificationId, 1);
	// }
	notificationIDMap[notificationId] = undefined;
	numOfOpenNotifications--;
});


chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  // console.log('Turning ' + tab.url + ' red!');
  // chrome.tabs.executeScript({
  //   code: 'document.body.style.backgroundColor="red"'
  // });

  console.log("Attempting to active tab.");
  if (currentTab) {
    	var tabID = currentTab;
    	console.log("Making tab " + tabID + " active.");
    	chrome.tabs.update(tabID, {highlighted: true});

    	chrome.tabs.get(tabID, function(tabDetails){
    		// console.log(tabDetails);
    		// console.log(tabDetails.windowId);
    		chrome.windows.update(tabDetails.windowId, {focused: true});
    	});   	
    };

});

// Conditionally initialize the options.
if (!localStorage.isInitialized) {
  localStorage.isActivated = true;   // The display activation.
  localStorage.displayTime = 10;        // The display frequency, in minutes.
  localStorage.isInitialized = true; // The option initialization.
}

	