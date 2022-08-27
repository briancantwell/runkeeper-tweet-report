function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	// document.getElementById('numberTweets').innerText = tweet_array.length;
	
	totalTweetCount = tweet_array.length;
	completedEventCount = getCount(tweet_array, "completed_event");
	liveEventCount = getCount(tweet_array, "live_event");
	achievementCount = getCount(tweet_array, "achievement");
	miscCount = totalTweetCount - (completedEventCount + liveEventCount + achievementCount);
	writtenCount = getCount(tweet_array, "written");

	// find earlist and latests dates in the array
	var firstDate = new Date(Math.min.apply(null, tweet_array.map(function(i){
		return new Date(i.time);
	}))).toLocaleDateString("en-US");

	var lastDate = new Date(Math.max.apply(null, tweet_array.map(function(i){
		return new Date(i.time);
	}))).toLocaleDateString("en-US");
	
	// Tweet dates
	$('#firstDate').text(firstDate);
	$('#lastDate').text(lastDate);

	// Totals output
	$('#numberTweets').text(totalTweetCount);
	$('.completedEvents').text(completedEventCount);
	$('.liveEvents').text(liveEventCount);
	$('.achievements').text(achievementCount);
	$('.miscellaneous').text(miscCount);
	$('.written').text(writtenCount);

	// Percentage output
	$('.completedEventsPct').text(getPct(completedEventCount, totalTweetCount) + "%");
	$('.liveEventsPct').text(getPct(liveEventCount, totalTweetCount) + "%");
	$('.achievementsPct').text(getPct(achievementCount, totalTweetCount) + "%");
	$('.miscellaneousPct').text(getPct(miscCount, totalTweetCount) + "%");
	$('.writtenPct').text(getPct(writtenCount, completedEventCount) + "%");


	// tweet_array[0].writtenText;
	// var userText = tweet_array[60].writtenText;
	// tweet_array[0].text.replace('Just','');
	// console.log(userText);

	// what is this for?
	tweet_array.forEach(element => {
		if(element.written)
		{
			element.writtenText;
		}
	});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

function getPct(catagory, totalTweets) {
	var pct = (catagory / totalTweets) * 100;
	return pct.toFixed(2);
}

// getCount takes the tweet_array and the type of tweets to be found
// and returns the count of the given type
function getCount(tweet_array, type){	
	var count = 0;
		// count tweets with written text
		if(type == "written"){	
			for( var i = 0; i < tweet_array.length; i++){
				if(tweet_array[i].written)
				{
					// console.log(tweet_array[i].text);
					// only count "compeleted event"
					// tweets with user text
					if(tweet_array[i].source == "completed_event")
					{
						count++;				
					}		
				}
			}
		}
		else{
			// counts activityType of tweet
			for( var i = 0; i < tweet_array.length; i++){
				if(tweet_array[i].source == type)
				{
					count++;				
				}		
			}
		}
		return count;
	}