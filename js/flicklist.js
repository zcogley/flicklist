

var model = {
  watchlistItems: [],
  browseItems: []
}


var api = {

  root: "https://api.themoviedb.org/3",
  token: "2b4581cc2d56025d4ca9ae36318573ce",

  /**
   * Given a movie object, returns the url to its poster image
   */
  posterUrl: function(movie) {
    // TODO 4b
    // implement this function

    return "http://image.tmdb.org/t/p/w300/" + movie.poster_path
  }
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
      api_key: api.token
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
      console.log(response);
    }
  });
}


/**
 * Makes an AJAX request to the /search endpoint of the API, using the
 * query string that was passed in
 *
 * if successful, updates model.browseItems appropriately and then invokes
 * the callback function that was passed in
 */
function searchMovies(query, callback) {
  $.ajax({
    url: api.root + "/search/movie",
    data: {
      api_key: api.token,
      query: query
    },
    success: function(response) {
      model.browseItems = response.results;
      callback(response);
    }
  });
}


/**
 * re-renders the page with new content, based on the current state of the model
 */
function render() {

  // clear everything
  $("#section-watchlist ul").empty();
  $("#section-browse ul").empty();

  // insert watchlist items
  model.watchlistItems.forEach(function(movie) {

    var title = $("<h6></h6>").text(movie.original_title);

      var titleDiv = $("<div></div>")
        .attr("class", "panel-heading")
        .append(title);

    var movieImage = $("<img></img>")
        .attr("src", api.posterUrl(movie))
        .attr("class", "img-responsive");

    var removeButton = $("<button></button>")
      .text("I watched it")
      .click(function() {
        model.watchlistItems.pop(movie);
        render();
      })
      .attr("class", "btn btn-danger");

    var bodyDiv = $("<div></div>")
      .attr("class", "panel-body")
      .append(movieImage)
      .append(removeButton);

    var itemView = $("<li></li>")
      .append(titleDiv)
      .append(bodyDiv)
      .attr("class", "panel panel-default");

    $("#section-watchlist ul").append(itemView);
  });

  // insert browse items
  model.browseItems.forEach(function(movie) {

    var title = $("<h4></h4>").text(movie.original_title);

    var button = $("<button></button>")
      .text("Add to Watchlist")
      .attr("class", "btn btn-primary")
      .click(function() {
        model.watchlistItems.push(movie);
        render();
      })
      .prop("disabled", model.watchlistItems.indexOf(movie) !== -1);

    var overview = $("<p></p>").text(movie.overview);

    // append everything to itemView, along with an <hr/>
    var itemView = $("<li></li>")
      .append(title)
      .append(overview)
      .append(button)
      .attr("class", "list-group-item");

    // append the itemView to the list
    $("#section-browse ul").append(itemView);
  });
}


// When the HTML document is ready, we call the discoverMovies function,
// and pass the render function as its callback
$(document).ready(function() {
  discoverMovies(render);
});
