Made as the final project for the graduate course, XML and Web Services taught at the University of Cincinnati's Information Systems program.

Features such as current weather conditions, hourly temperature variation, 3 day weather forecast and F/C toggle are supported. A fancy add on is that the background changes with the time and weather condition of the place selected.

The project uses ASP MVC along with JavaScript to fetch and render weather information from the following APIs, so if you are pulling from this repo, you might need to get relevant keys for yourselves:

	1.	Various Wunderground.com APIs : Key to be inserted in Controllers/HomeController.cs and Scripts/jquery.weather.ajax.js
	2.	Bing Image Search API : Key to be inserted in Controllers/HomeController.cs
	3.	Google Places JavaScript API: Key to be inserted in the scripts section of Views/Index.cshtml
	4.	Google Maps API: Key to be inserted in Scripts/jquery.weather.ajax.js
	
Most locations across the world are supported given that they are specific at least to the city level. 

The Doppler radar map is supported for locations within the Unites States and Canada only.