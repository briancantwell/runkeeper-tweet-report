function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	document.getElementById("longestActivityType").innerHTML = 'run';
	document.getElementById("shortestActivityType").innerHTML = 'walk';
	document.getElementById("weekdayOrWeekendLonger").innerHTML = 'Sat';
	document.getElementById("numberActivities").innerHTML = 30;
	document.getElementById("firstMost").innerHTML = "run";
	document.getElementById("secondMost").innerHTML = "walk";
	document.getElementById("thirdMost").innerHTML = "bike";
		

	// TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    	"values": tweet_array.map(tweet => {
				return{
					"distance": tweet.distance,
					"activityType": tweet.activityType,
					"time":tweet.time
				};
			})
		 },
		"mark": {
			"type": "arc"
		},
		"transform":[
			{"filter":{"field":"activityType", "valid":""}, }
		],
	  	"encoding": {
			"theta":{"field": "activityType","type": "nominal",},

			// x: {
			// 	"field": "activityType",
			// 	"sort":"ascending",
			// 	"type": "nominal", "axis": {"labelAngle":45},
			// },
			// y: {"aggregate": "count",
			// 	"type": "nominal",
			// },
			"color":{"field":"activityType"}

		}

	};
	mean_distance_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v4.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			  "values": tweet_array.map(tweet => {
				  return{
					  "distance": tweet.distance,
					  "activityType": tweet.activityType,
					  "time":tweet.time
				  };
			  })
		   },
		  "mark": {
			  "type": "point"
		  },
		  "transform":[
			{"filter":{"field":"activityType", "oneOf":["run", "walk", "bike"]}, }
		],
			"encoding": {
				x:{
					"field":"time",
					"type":"ordinal",
					"timeUnit":"day",
					
					"title":"Day of Week"
				},
				y: {"aggregate": "mean",
					"field": "distance",
					"type": "quantitative",
			},
			"color":{"field":"activityType"}
		}  
	  };
	
	var distance_spec = JSON.parse(JSON.stringify(mean_distance_spec));

	distance_spec.encoding = {
		x:{
			"field":"time",
			"type":"ordinal",
			"timeUnit":"day",
			
			"title":"Day of Week"
		},
		y: {//"aggregate": "count",
			"field": "distance",
			"type": "quantitative",
		},
		"color":{"field":"activityType"}

	};



	vegaEmbed('#meanDisVis', mean_distance_spec, {actions:false});
	vegaEmbed('#distanceVis', distance_spec, {actions:false});
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
}


// function buttonClick(){
// 	var chart1 = document.getElementById("distanceVis");
// 	var chart2 = document.getElementById("distanceVisAggregated");


// 	if(	chart1.style.display === "block"){
// 		chart1.style.display = "none";
// 		chart2.style.display = "block";
// 	}
// 	else{
// 			chart2.style.display === "block"){
// 			chart2.style.display = "none";
// 			chart1.style.display = "block";
// 	}

// //   if (chart1.style.display === "none") {
// //     chart1.style.display = "block";
// //   } else {
// //     chart2.style.display = "none";
// //   }
// }}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});