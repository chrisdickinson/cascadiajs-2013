$(function() {
  var body = $('body')

  $.getJSON('/comments', function(response) {
    response.comments.forEach(function(comment) {
      $('<div class="comment"><h1>' + comment.username + '</h1>' +
        '<p>' + comment.text + '</p>').appendTo(body)
    })
  })
})
