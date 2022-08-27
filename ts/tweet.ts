class Tweet {
	private text:string;
    time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
        this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
        
	}

    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
    
        if(this.textParse("dash") ||
           this.textParse("runkeeper") || 
           this.textParse("time") || 
           this.textParse("timedash") ||
           this.text.match(/(?:complete)/i))  {                               
            // console.log(this.text);
            return "completed_event";
        }
        else if(this.text.match(/(?:achieve)/i) || this.text.match(/(?:set a goal)/i))
        {
            // console.log(this.text);
            return "achievement";
        }
        else if(this.textParse("watch"))
        {//this.text.includes("#RKLive") || 
            // console.log(this.text);

            return "live_event";
        }
        else {
            // console.log(this.text);

            return "miscellaneous";
        }
    }

     //returns a boolean, whether the text includes any content written by the person tweeting.
     get written():boolean {    
        // filters out user written text
        var writtenText = new RegExp(/(?:-\s*)(.*)(?=http.*$)/);

        // Common auto-text filters
        var sportsWatch = new RegExp(/(TomTom MySports Watch)(?:\s*)/);
        

        if(writtenText.exec(this.text)){

            // additonal else if statements can be
            // added to filter out other auto-text
            // patterns
            if(sportsWatch.exec(this.text))
            {

                return false;
            }
            else{

                return true;
            }    
        }

        return false;
        
    } 

    // writtenText() returns user created text of the tweet
    // excluding auto generated text
    get writtenText():string {
        
        // filters out user written text
        var writtenText = new RegExp(/(?:-\s*)(.*)(?=http.*$)/);

        if(this.written){
            // console.log(writtenText.exec(this.text)![1]);
            return writtenText.exec(this.text)![1];
        }
        return ""      
    }





    // activityType returns walk, bike, run, mtn bike, etc ...
    get activityType():string {
 

        // filter out 'watch my activity'
        // var watchActivity = new RegExp(/(?:Watch my )([+-]?\d+\.\d*)(?:\s*)(\w*)(?:\s*)(.+?(?=\s*right\s*now\s*with\s*.*Runkeeper))/);

        // live events contain '#RKLive'
        var liveEvent  = "#RKLive";


        if(!this.text.includes(liveEvent)){
            if(this.textParse("dash"))
            {
                // console.log(this.activityParse(dashDelim)![3]);
                return this.textParse("dash")![3];
            }
            else if(this.textParse("runkeeper")){
                // console.log(this.activityParse(withRunkeeper)![3]);
                return this.textParse("runkeeper")![3];

            }
            else if(this.textParse("time")){
                // console.log(this.activityParse(activityWithTime)![1]);
                return this.textParse("time")![1];
                
            }
            else if(this.textParse("timedash")){
                // console.log(this.activityParse(activityWithTimeDash)![1]);
                return this.textParse("timedash")![1];
                
            }
            else{
                return "";
            }
        }
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }

        //convert to mi if km
        const kmToMi = 1.609344;
        
        var dist:number = 0;
        
        if(this.textParse("dash")){
            dist = parseFloat(this.textParse("dash")![1]);
        }
        else if( this.textParse("runkeeper")){
            dist = parseFloat(this.textParse("runkeeper")![1]);
        }

        // if distance is in km convert to mi
		if(this.isKilometers)
		{	
            // console.log("before: " + dist);
            dist = dist/kmToMi;	            
            // console.log(Number(dist).toFixed(2));
            
        }
        return dist;






        // // RegEx that looks for doubles
        // var distRegEx = /[+-]?\d+(\.\d+)?/g;
        // //TODO: prase the distance from the text of the tweet
        // var dist = this.text.match(distRegEx);
        // return Number(this.text.match(dist![0]));
    }

    getHTMLTableRow(rowNumber:number):any {
        var newRow = document.createElement("tr");
        var rowNum = document.createElement("td");
        var activity = document.createElement("td");
        var text = document.createElement("td");

        var urlFilter = new RegExp(/(http.*)(?:\s)/i);


        var link = urlFilter.exec(this.text);
        var newLink = "<a href=\"" + link![1] + "\">" + link![0] + "</a>";        



        var newText = this.text.replace(link![1], newLink);
        
        rowNum.innerHTML = (rowNumber).toString();
        activity.innerHTML = this.activityType;
        text.innerHTML = newText;

        newRow.append(rowNum, activity, text);


        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity        
        return newRow;
    }


    // returns true if the distance units are in kilometers
    get isKilometers():boolean {

            if(this.textParse("dash"))
            {              
                if((this.textParse("dash")![2] === "km")){
                    // console.log(this.textParse('dash')![2]);
                    return true;
                }
            }
            else if(this.textParse("runkeeper"))
            {                
                if((this.textParse("runkeeper")![2] === "km")){
                    // console.log(this.textParse('runkeeper')![2]);
                    return true;
                }
            }        
        return false;
    }







 /* Helper Functions */

 // textParse() returns an array of the requested regexp

    textParse(data:string):RegExpExecArray | null{

        // these 4 regexp filter out standard patterns and extract the
        // activity type, distance & distance measure or the activity duration
        var dashDelim = new RegExp(/([+-]?\d+\.\d*)(?:\s*)(\w*)(?:\s*)(.+?(?=\ \s*\-))/);
        var withRunkeeper = new RegExp(/([+-]?\d+\.\d*)(?:\s*)(\w*)(?:\s*)(.+?(?=(?: with .*Runkeeper\.)))/);
        var activityWithTime = new RegExp(/(?:Just posted a\w*)(?:\s*)(.+?(?= in))(?:\s*)(?:\w*)(?:\s*)(.+?(?=\s*with\s*.*Runkeeper))/);
        var activityWithTimeDash = new RegExp(/(?:Just posted a\w*)(?:\s*)(.+?(?= in))(?:\s*)(?:\w*)(?:\s*)(.+?(?=\ \s*\-))/);
        var watchActivity = new RegExp(/(?:Watch my )([+-]?\d+\.\d*)(?:\s*)(\w*)(?:\s*)(.+?(?=\s*right\s*now\s*with\s*.*Runkeeper))/);

            if(data === "dash" && dashDelim.exec(this.text))
            {
                // console.log(this.activityParse(dashDelim)![3]);
                return dashDelim.exec(this.text);
            }
            else if(data === "runkeeper" && withRunkeeper.exec(this.text)){
                // console.log(this.activityParse(withRunkeeper)![3]);
                return withRunkeeper.exec(this.text);

            }
            else if(data === "time" && activityWithTime.exec(this.text)){
                // console.log(this.activityParse(activityWithTime)![1]);
                return activityWithTime.exec(this.text);
                
            }
            else if(data === "timedash" && activityWithTimeDash.exec(this.text)){
                // console.log(this.activityParse(activityWithTimeDash)![1]);
                return activityWithTimeDash.exec(this.text);        
            }
            else if(data === "watch" && watchActivity.exec(this.text)){
                // console.log(this.activityParse(activityWithTimeDash)![1]);
                return watchActivity.exec(this.text);        
            }
        return null;
    }

    // used for debugging regexp strings
    debugOutput(regExp:RegExp):void
    {
        // console.log(">>debug<<");
        if(regExp.exec(this.text))
        {
            console.log(regExp.exec(this.text));//![1]);
        }   
    }


    activityParse(regExp:RegExp):RegExpExecArray | null
    {
        // console.log(">>debug<<");
        if(regExp.exec(this.text))
        {
            return regExp.exec(this.text);
        }   
        
        return null;
    }
}






//** DEPRECATED **//

// this was in get writtenText
        // var userText = this.text;
        // // var urlRegEx = /(https?:\/\/[^ ]*)/g;
        
        // // idenifies all URLs within a string
        // var urlRegEx = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/gm;

        // // common strings, most likely to be auto-generated.
        // var checkItOut = new RegExp(/Check it out!(.*)(https?:\/\/[^ ]*$)/);
        // var runKeepHashtag = new RegExp(/#r(unkeeper)/gi);
        // var commonStrings = ["Just completed a ", "Just posted a ", "TomTom MySports Watch", runKeepHashtag, checkItOut];

        // // filter out common start strings
        // commonStrings.forEach(str => {
        //                                                         // console.log(">>: " + userText.includes(str));            
            
        //     // checks if input is a string or RegEx
        //     // if input is a string
        //     if(typeof(str) == "string")
        //     {
        //                                                         // console.log(str)
        //         if(userText.includes(str))
        //         {
        //             userText = userText.replace(str, "");
        //         }
        //     }
        //     // if input in a RegExp
        //     else{
        //                                                         // console.log(str)
        //                                                         // console.log("Before: " + userText);
        //         str.exec(userText)?.forEach(item => {
        //             userText = userText.replace(item, "");
        //         });
        //                                                         // console.log("After: " + userText);
        //     }

        // });

        
        //                                                         // console.log(urlRegEx.exec(userText));
        // // filter out any other URLs
        // urlRegEx.exec(userText)?.forEach(item => {          
        //     userText = userText.replace(item, "");
        // });

        // // extract distance and activity type
        //                                                         // console.log(userText);


/**Simple form of activity extraction */
        // get activityType():string {
        //     // search this.text for activity keywords
            
        //     if(this.text.includes("bike"))
        //     {
        //         if(this.text.includes("mtn bike")){
        //             return "mtn bike";
        //         }
        //         else{
        //             return "bike";  
        //         }
        //     } 
        //     else if(this.text.includes("walk")){
        //         return "walk";
        //     }
        //     else if(this.text.includes("run")){
        //         return "run";
        //     }
        //     else if(this.text.includes("hike")){
        //         return "hike";
        //     }
        //     else if(this.text.includes("swim")){
        //         return "swim";
        //     }
        //     else {
        //         return "";
        //     }
    
        //     // if (this.source != 'completed_event') {
        //     //     return "unknown";
        //     // }
    
        // }


/*This works, but may not get all activities */
    // get isKilometers():boolean {
    //     var units = "";
    //     // RegEx set to extract a double
    //     var distRegEx = /[+-]?\d+(\.\d+)?/g;

    //     // Extract the double
    //     var dist = this.text.match(distRegEx);

    //     // Store the number as a string
    //     var distNum = String(this.text.match(dist![0]));

    //     // get starting position of the number 
    //     // and determine the end position of the number within this.text;
    //     // the next character will determine the meausre unit type (mi) or (km)
    //     var start = (this.text.search(distNum) + distNum.length);
        
    //             // console.log(this.text[start + 1]);
    //     // stores the first char of the measure units
    //     units = this.text[start + 1];

    //     if(units == "k")
    //     {
    //         return true;
    //     }        

    //     return false;
    // }