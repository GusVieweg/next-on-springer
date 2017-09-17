var interval = null;
var suggo = ''
function getFormData() {
	suggo = $('#suggestionText')[0].value
	$('#suggestionText')[0].value = ''
	$('#suggestionGen').text('')
	return suggo
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateWordsFromSuggestion(suggestion, i, prevpos) {
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	var wordsAPI = "https://api.datamuse.com/sug?s=" + suggestion[i] + '&max=50'
	var sentenceStructure = {
		"n": ["v", "adv", ""],
		"v": ["adv", "prop", "n", ""],
		"adj": ["n", ""],
		"adv": ["v", "n", ""],
		"prop": ["n", "adj", "prop"],
		"": ["n", "adj", "adv", "prop"]
	}

	$.ajax({
	    url: proxyurl + wordsAPI,
	    headers: { 'Access-Control-Allow-Origin': '*' },
	    crossDomain: true,
	    success: function( res ) {
			if( i == suggestion.length ) {
				switch( Math.floor(Math.random() * 7) ) {
					case 0: $('#suggestionGen').append('.'); break;
					case 1: $('#suggestionGen').append('?'); break;
					case 2: $('#suggestionGen').append('...'); break;
					case 3: $('#suggestionGen').append('!'); break;
					case 4: $('#suggestionGen').append('?!'); break;
					case 5: $('#suggestionGen').append(' ;)'); break;
					case 6: $('#suggestionGen').append(' :)'); break;
				}
				$('#cSaveForm').show();
				$('#cPlayAgainForm').show();
			} else {
				// console.log("Nice")
				var place = Math.floor(Math.random() * 50)
				if( (place == 0) && (suggestion[i] != 'a') && (suggestion[i] != 'i') ) { place = 1 }
				var word = res[place].word

				var wordAPI = "https://api.datamuse.com/words?sp=" + word + "&md=p"

				$.ajax({
					url: proxyurl + wordAPI,
					headers: { 'Access-Control-Allow-Origin': '*' },
	    			crossDomain: true,
	    			success: function( res ) {
	    				var true_word = ''
	    				var force_break = false;
	    				var k, m, n = 0;
	    				if( i>0 ) {
		    				for( k=0 ; k<res.length; k++ ) {
		    					if( !force_break ) {
			    					console.log(res[k])
			    					console.log(k, m, n)
			    					if( typeof res[k].tags !== "undefined") {
			    						console.log(res[k] + " has tags, so we shall continue!")
			    						for( m=0 ; m<res[k].tags.length; m++ ) {
			    							if( !force_break ) {
			    								console.log("Investigating tag " + res[k].tags[m])
					    						for( n=0 ; n<sentenceStructure[prevpos].length ; n++ ) {
					    							console.log("Comparing tag " + res[k].tags[m] + " with " + sentenceStructure[prevpos][n]);
					    							if( sentenceStructure[prevpos][n] == res[k].tags[m]) {
					    								console.log(res[k].word + ", which is a " + res[k].tags[m] + ", selected to follow a " + prevpos)
					    								true_word = res[k].word;
					    								prevpos = res[k].tags[m];
					    								if( (prevpos == 'v') ) {
					    									if(true_word[-1] !== 's') {
					    										true_word = true_word + 's'
					    									} else {
					    										true_word = true_word + 'es'
					    									}
					    								}
					    								console.log("---------------- FORCING BREAK ----------------")
					    								force_break = true;
					    								break;
					    							}
					    						}
			    							}
				    					}
			    					}
			    				}
		    				}
		    				if( !force_break ) {
		    					console.log("Did not find ANY words!")
		    					true_word = "..." + res[0].word;
		    					if( typeof res[0].tags !== "undefined" ) {
		    						prevpos = res[0].tags[0];
		    					} else {
		    						prevpos = ""
		    					}
		    				}
		    			}
	    				if( i == 0 ) {
							true_word = capitalizeFirstLetter(word)
							if( typeof res[0].tags !== "undefined" ) {
	    						prevpos = res[0].tags[0];
	    					} else {
	    						prevpos = ""
	    					}
						}
						true_word = true_word.replace(" ", "-");
						$('#suggestionGen').append(true_word)
						if( i < suggestion.length - 1 ) {
							$('#suggestionGen').append(' ')
						}
						j = i + 1
						generateWordsFromSuggestion(suggestion, j, prevpos)
	    			},
	    			error: function() {alert('it doesnt work')},
	   				datatype: 'jsonp'
				})
			}
		},
	    error: function() {alert('it doesnt work')},
	    datatype: 'jsonp'
	});
}

function improvise() {
	var suggestion = getFormData();
	console.log("Received: " + suggestion)
	generateWordsFromSuggestion(suggestion, 0, "")
}

function generateRandomWord(playerName) {
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	var randomLetter = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // where n is 0, 1, 2 ...
	var wordsAPI = "https://api.datamuse.com/sug?s=" + randomLetter + '&max=75'
	$.ajax({
		url: proxyurl + wordsAPI,
		headers: { 'Access-Control-Allow-Origin': '*' },
		crossDomain: true,
		success: function( res ) {
			var randomPlace = Math.floor(Math.random() * 75)
			var randomWord = res[randomPlace].word
			if( (randomWord.length <= 8) && (randomWord.length > 1) ) {
				// console.log(playerName)
				var textInsert = "Okay... Your word is: <p id='randoWord'>" + randomWord + '</p>'
				$('#nameGen').show();
				$('#nameGen').html(textInsert)
				startTimer(20, $('#time'))
				$("#answerForm").show();
			} else {
				generateRandomWord();
			}
		},
		error: function() {alert('it doesnt work')},
		datatype: 'jsonp'
	})
}

function getNameData() {
	var playerName = $('#nameText')[0].value
	$('#nameForm').hide()
	generateRandomWord(playerName)
}

function askUser() {
	clearInterval(interval)
	$('#playAgainForm').show();
	$('#saveForm').show();
	$('#answerForm').hide();
	var input = $('#answerText')[0].value
	var leftoverTime = parseInt($('#time').text())
	$('#time').hide();
	$('#results').text("You entered '" + input + "' in " + String(20-leftoverTime) + " seconds!" )
	$('#results').show();
	$('#saveToVault').prop('disabled', false);
	$('#saveToVault')[0].innerText = "Save to vault"
}

function countdown() {
	$('#time').show();
	timer = parseInt($('#time').text());
	seconds = parseInt(timer % 60, 10);

    if (--seconds < 0) {
        seconds = 0;
    }

    $('#time').text(seconds);
}

function startTimer() {
    interval = setInterval(countdown, 1000);
}

function playAgain() {
	$('#time').text('20')
	$('#results').hide();
	$('#nameGen').hide();
	$('#nameForm').show();
	$('#saveForm').hide();
	$('#playAgainForm').hide();
	$('#answerText')[0].value = ''
}

function cPlayAgain() {
	$('#suggestionForm').show();
	$('#cSaveForm').hide();
	$('#cPlayAgainForm').hide();
	$('#suggestionText')[0].value = ''
	$('#suggestionGen')[0].innerText = ''
	$('#cSaveToVault').prop('disabled', false);
	$('#cSaveToVault')[0].innerText = "Save to vault"
}

function clearDatabase() {
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	var storageAPI = "https://api.myjson.com/bins/qidrh";
	$.ajax({
		url: storageAPI,
		type: "PUT",
		crossDomain: true,
		data: '[]',
		contentType: "application/json; charset=utf-8",
		success: function( res ) {
			$('#saveToVault')[0].innerText = "Saved!"
		},
		error: function() {alert('it doesnt work')},
		datatype: 'jsonp'
	})
}

function saveToVault() {
	$('#saveToVault').prop('disabled', true);
	$('#saveToVault')[0].innerText = "Saving..."
	var playerName = $('#nameText')[0].value
	var answer = $('#answerText')[0].value
	var seconds = parseInt($('#time').text())
	var prompt = $('#randoWord')[0].innerText
	var new_entry = {}
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	var storageAPI = "https://api.myjson.com/bins/qidrh";
	new_entry.player = playerName
	new_entry.answer = answer
	new_entry.seconds = 20 - seconds
	new_entry.prompt = prompt
	$.ajax({
		url: proxyurl + storageAPI,
		type: "GET",
		headers: { 'Access-Control-Allow-Origin': '*' },
		crossDomain: true,
		success: function( res ) {
			console.log(res)
			new_data = res
			new_data.push(new_entry)
			if( new_data.length > 5 ) {
				new_data.splice(0, 1)
			}
			stringit = JSON.stringify(new_data)
			$.ajax({
				url: storageAPI,
				type: "PUT",
				data: stringit,
				contentType: "application/json; charset=utf-8",
				crossDomain: true,
				success: function( res ) {
					$('#saveToVault')[0].innerText = "Saved!"
					initializeCarousel();
				},
				error: function() {alert('it doesnt work')},
				datatype: 'jsonp'
			})
		},
		error: function() {alert('it doesnt work')},
		datatype: 'jsonp'
	})
}

function cSaveToVault() {
	$('#cSaveToVault').prop('disabled', true);
	$('#cSaveToVault')[0].innerText = "Saving..."
	var playerName = "Computer generated"
	var answer = $('#suggestionGen')[0].innerText
	var prompt = suggo
	var new_entry = {}
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	var storageAPI = "https://api.myjson.com/bins/qidrh";
	new_entry.player = playerName
	new_entry.answer = answer
	new_entry.seconds = "a few"
	new_entry.prompt = prompt
	$.ajax({
		url: proxyurl + storageAPI,
		type: "GET",
		headers: { 'Access-Control-Allow-Origin': '*' },
		crossDomain: true,
		success: function( res ) {
			console.log(res)
			new_data = res
			new_data.push(new_entry)
			if( new_data.length > 5 ) {
				new_data.splice(0, 1)
			}
			stringit = JSON.stringify(new_data)
			$.ajax({
				url: storageAPI,
				type: "PUT",
				data: stringit,
				contentType: "application/json; charset=utf-8",
				crossDomain: true,
				success: function( res ) {
					$('#cSaveToVault')[0].innerText = "Saved!"
					initializeCarousel();
				},
				error: function() {alert('it doesnt work')},
				datatype: 'jsonp'
			})
		},
		error: function() {alert('it doesnt work')},
		datatype: 'jsonp'
	})
}

function initializeCarousel() {
	const proxyurl = "https://cors-anywhere.herokuapp.com/";
	var storageAPI = "https://api.myjson.com/bins/qidrh";
	$.ajax({
		url: proxyurl + storageAPI,
		type: "GET",
		headers: { 'Access-Control-Allow-Origin': '*' },
		crossDomain: true,
		success: function( res ) {
			var i = 0
			for( i=0 ; i<5 ; i++ ) {
				id = '#slide-' + String(i) + '-header'
				$(id)[0].innerText = res[i].answer
				id2 = '#slide-' + String(i) + '-content'
				$(id2)[0].innerText = '-- ' + res[i].player + ' with prompt "' + res[i].prompt + '" in ' + String(res[i].seconds) + ' seconds'
				console.log($(id2))
			}
		},
		error: function() {alert('it doesnt work')},
		datatype: 'jsonp'
	})
}

