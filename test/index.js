exports.sanitize = function(word){
	return word.toLowerCase().replace(/-/g,' ');
};

exports.tokenize = function(sent){
	return sent.split(' ');
};