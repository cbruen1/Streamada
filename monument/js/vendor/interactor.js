/*
The MIT License (MIT)

Copyright (c) 2015 Benjamin Cordier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

var Interactor = function (config) {
	// Call Initialization on Interactor Call
	this.__init__(config);
};

Interactor.prototype = {

	// Initialization
	__init__: function (config) {

		// console.log("typeof interactions: " + typeof(config.interactions));
		// somehow, config.interactions is being set from 'true' (as it is passed in),
		// to 'undefined' between here and where it is assigned to this.interactions
		
		// Argument Assignment  // Type Checks 																			// Default Values
		this.interactions 		= true; //typeof(config.interactions) 				== "boolean" 	? config.interations 		: true,
		this.interactionElement = typeof(config.interactionElement) 		== "string" 	? config.interactionElement :'interaction',
		this.interactionEvents 	= Array.isArray(config.interactionEvents) 	=== true 		? config.interactionEvents 	: ['mouseup', 'touchend'],
		this.conversions 		= typeof(config.coversions)					== "boolean" 	? config.conversions		: false,
		this.conversionElement 	= typeof(config.conversionElement) 			== "string" 	? config.conversionElement 	: 'conversion',
		this.conversionEvents 	= Array.isArray(config.conversionEvents) 	=== true 		? config.conversionEvents 	: ['mouseup', 'touchend'],
		this.endpoint 			= typeof(config.endpoint) 					== "string" 	? config.endpoint 			: '/interactions',
		this.async 				= typeof(config.async) 						== "boolean" 	? config.async 				: true,
		this.records 			= [];
		this.loadTime 			= new Date();
		this.debug 				= config.debug;

		if (this.debug) {
			console.log("in init, config.interactions: " + config.interactions);
			console.log("in init, this.interactions: " + this.interactions);
		}
		
		// Call Event Binding Method
		this.__bindEvents__();
		
		return this;
	},

	// Create Events to Track
	__bindEvents__: function () {

		var interactor 	= this;

		if (interactor.debug) console.log("interactor.interactions: " + interactor.interactions);
		// Set Interaction Capture
		if (interactor.interactions === true) {
			for (var i = 0; i < interactor.interactionEvents.length; i++) {
				var ev 		= interactor.interactionEvents[i],
					targets = document.getElementsByClassName(interactor.interactionElement);
				for (var j = 0; j < targets.length; j++) {
					targets[j].addEventListener(ev, function (e) {
						e.stopPropagation();
						interactor.__addInteraction__(e, "interaction");
					});
				}
			}	
		}

		// Set Conversion Capture
		if (interactor.conversions === true) {
			for (var i = 0; i < interactor.conversionEvents.length; i++) {
				var ev 		= interactor.events[i],
					targets = document.getElementsByClassName(interactor.conversionElement);
				for (var j = 0; j < targets.length; j++) {
					targets[j].addEventListener(ev, function (e) {
						e.stopPropagation();
						interactor.__addInteraction__(e, "conversion");
					});
				}
			}	
		}

		// Bind onbeforeunload Event
		window.onbeforeunload = function (e) {
			interactor.__sendInteractions__();
		};
		
		return this;
	},

	// Add Interaction Object Triggered By Events to Records Array
	__addInteraction__: function (e, type) {
		
		var interactor 	= this,

			// Interaction Object
			interaction 	= {
				type 			: type,
				event 			: e.type,
				targetTag 		: e.path[0].tagName,
				targetClasses 	: e.path[0].className,
				content 		: e.path[0].innerText,
				clientPosition  : {
					x 				: e.clientX,
					y 				: e.clientY
				},
				screenPosition 	: {
					x 				: e.screenX,
					y 				: e.screenY
				},
				createdAt 		: new Date()
			};
		
		// Insert into Records Array
		interactor.records.push(interaction);
		
		return this;
	},

	// Gather Additional Data and Send Interaction(s) to Server
	__sendInteractions__: function () {
		
		var interactor 	= this,
			
			// Generate Session Data Object
			session 		= {
				loadTime 		: interactor.loadTime,
				unloadTime 		: new Date(),
				language 		: window.navigator.language,
				platform 		: window.navigator.platform,
				port 			: window.location.port,
				client 			: {
					name 			: window.navigator.appVersion,
					innerWidth 		: window.innerWidth,
					innerHeight 	: window.innerHeight,
					outerWidth 		: window.outerWidth,
					outerHeight 	: window.outerHeight
				},
				page 			: {
					location 		: window.location.pathname,
					href 			: window.location.href,
					origin 			: window.location.origin,
					title 			: document.title
				},
				interactions 	: interactor.records
			},

		// Initialize Cross Header Request
		xhr  			= new XMLHttpRequest();

		var session_json = JSON.stringify(session).replace(';', '');

		// Post Session Data Serialized as JSON
		xhr.open('POST', interactor.endpoint, interactor.async);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send("stats=" + session_json );

		if ( interactor.debug ) console.log(session_json);

		return this;
	}
};