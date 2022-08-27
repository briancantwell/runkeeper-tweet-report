let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	document.getElementById("searchCount").innerHTML = 0;
	document.getElementById("searchText").innerHTML = "value";
	// filters the tweets for only tweets
	// with written text
	for(let tweet of runkeeper_tweets)
	{	
		var newTweet = new Tweet(tweet.text, tweet.created_at);
		if(newTweet.written)
		{
			writtenTweets.push(newTweet);
		}
	}

}

function searchHandler(value) {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
		// clears the table on each input
		var tTable = document.getElementById("tweetTable");
		tTable.innerHTML = "";
		if(value <= 1)
		{
			document.getElementById("searchCount").innerHTML = 0;
			document.getElementById("searchText").innerHTML = "value";
		}
		// requires the input value to be at least 2 characters
		if(value.length > 1){

			var rowNum = 1;
		for(let i = 0; i < writtenTweets.length; i++)
		{
			var tweet = writtenTweets[i];

			if(tweet.text.toLowerCase().includes(value.toLowerCase()))
			{
				document.getElementById("searchCount").innerHTML = tTable.rows.length;
				document.getElementById("searchText").innerHTML = value;
				tTable.append(tweet.getHTMLTableRow(rowNum));
				rowNum++;
			}
		}	
	}	
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	// searchHandler();
	loadSavedRunkeeperTweets().then(parseTweets);
});