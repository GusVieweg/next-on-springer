function getFormData() {
	var suggestion = $('#suggestionText')[0].value
	$('#suggestionText')[0].value = ''
	$('#lol').text('')
	return suggestion
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateWordsFromSuggestion(suggestion, i) {
	wordsAPI = "https://api.datamuse.com/sug?s=" + suggestion[i] + '&max=50'
	$.getJSON( wordsAPI, function( res ) {
		if( i == suggestion.length ) {
			if( Math.random() > 0.5 ) {
				$('#lol').append('.')
			} else {
				$('#lol').append('?')
			}
			// console.log("Word complete!")
		} else {
			// console.log("Nice")
			place = Math.floor(Math.random() * 50)
			word = res[place].word
			if( i == 0 ) {
				word = capitalizeFirstLetter(word)
			}
			$('#lol').append(word)
			if( i < suggestion.length - 1 ) {
				$('#lol').append(' ')
			}
			j = i + 1
			generateWordsFromSuggestion(suggestion, j)
		}
	})
}

function improvise() {
	suggestion = getFormData();
	console.log("Received: " + suggestion)
	generateWordsFromSuggestion(suggestion, 0)

}