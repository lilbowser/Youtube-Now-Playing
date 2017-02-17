	// Copyright (c) 2011 The Chromium Authors. All rights reserved.
	// Use of this source code is governed by a BSD-style license that can be
	// found in the LICENSE file.
	
	/*
	  Grays out or [whatever the opposite of graying out is called] the option
	  field.
	*/
  	function ghost(isDeactivated) {
		options.style.color = isDeactivated ? 'graytext' : 'black';
		                                          // The label color.
		options.displayTime.disabled = isDeactivated; // The control manipulability.
	}
	
	window.addEventListener('load', function() {
	  
		options.isActivated.checked = JSON.parse(localStorage.isActivated); // The display activation.
		                                     

		// if (localStorage.displayTime == undefined) {
		// 	localStorage.displayTime = defaultDisplayTime;
		// };                                   
		options.displayTime.value = localStorage.displayTime; // The display time, in seconds.
	
		if (!options.isActivated.checked) {
		 ghost(true); 
		}
		
		// Set the display activation and displayTime.
		options.isActivated.onchange = function() {
			localStorage.isActivated = options.isActivated.checked;
			ghost(!options.isActivated.checked);
		};

		options.displayTime.onchange = function() {
			localStorage.displayTime = options.displayTime.value;
		};
	});