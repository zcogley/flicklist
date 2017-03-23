

var model = {
  watchlistItems: [],
  browseItems: []
}


var api = {
  root: "https://api.themoviedb.org/3",
  token: "2b4581cc2d56025d4ca9ae36318573ce" // TODO 0 put your api key here
}


/**
 * Makes an AJAX request to themoviedb.org, asking for some movies
 * if successful, updates the model.browseItems appropriately, and then invokes
 * the callback function that was passed in
 */
function discoverMovies(callback) {
	$.ajax({
		url: api.root + "/discover/movie",
		data: {
			api_key: api.token,
		},

    success: function(response) {
			  // updates the model, setting its .browseItems property equal to the movies we recieved in the response
        model.browseItems = response.results;
        // invokes the callback function that was passed in.
        callback(response);
      },
    fail: function(){
      console.log("fail!");
    }
	});
}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {
  var watchlistElement = $('#section-watchlist ul');
  var browseElement = $('#section-browse ul');

  // clears both lists
  watchlistElement.empty();
  browseElement.empty();

  // for each movie on the user's watchlist, inserts a list item into the <ul>
  // in the watchlist section
  model.watchlistItems.forEach(function (movie) {
    var title = $("<p></p>").text(movie.original_title);
    var itemView = $("<li></li>").append(title);
    watchlistElement.append(itemView);
  });


  //  inserts a list item into the <ul>
  // in the browseItems section
  model.browseItems.forEach(function(movie) {
		// for each movie on the current browse list,
    // inserts a list item into the <ul> in the browse section,
    // with a button that when clicked adds the movie to the model's watchlistItems
    // page is then rerendered to update movie location
    var title = $('<p></p>').text(movie.original_title);
    var button = $('<button></button>').append(title)
      .text('Add to Watchlist')
      .click(function() {
        model.watchlistItems.push(movie);
        render();
      });

      var itemView = $("<li></li>").append(title).append(button);
      browseElement.append(itemView);


  });

}


// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function() {
  discoverMovies(render);
});
