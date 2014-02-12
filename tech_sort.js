var sortElements = function(allEls, inputEls, offset, $mainEl) {
  var values = [];
  for (var i=0; i < inputEls.length; i++) {
    values[values.length] = $(inputEls[i]).val();
  }

  var activeIndex = 0;
  var inactiveIndex = values.length;
  var activeEls = [];
  var inactiveEls = [];
  var reset = true;

  for (var i=0; i < allEls.length; i++) {
    var $el = $(allEls[i]);
    var nextIndex = inactiveIndex;
    var isActive = false;

    if (values.length > 0) {
      for (var j=0; j < values.length; j++) {
        if (values[j] == $el.text()) {
          $el.removeClass("inactive");
          values.splice(j, 1);

          nextIndex = activeIndex;
          isActive = true;
          activeIndex += 1;
          inactiveIndex -= 1;
          break;
        }
      }
    }

    var newTop = (nextIndex - i) * offset;

    if (isActive) {
      activeEls[activeEls.length] = $el.clone();
    } else {
      inactiveEls[inactiveEls.length] = $el.clone();
    }

    $el.animate({top: "+=" + newTop}, "slow", "swing", function() {
      if (reset) {
        reset = false;
        $mainEl.empty();
        var els = activeEls.concat(inactiveEls);
        for (var i=0; i < els.length; i++) {
          $mainEl.append(els[i])
        }

      }
    });

    inactiveIndex += 1;
  }
}

var swapArticle = function(href) {
  var req = new XMLHttpRequest();
  req.open("GET",
           href.split("/").pop(),
           false);
  req.send(null);

  if (req.status == 200) {
    $response = $(req.responseText).find("article")

    $("#content").html($response);
    return true;
  }
  return false;

}