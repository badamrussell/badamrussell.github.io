$(function() {
  $(".project-sidebar").click("project-thumb", function(event) {
    event.preventDefault();

    var $target = $(event.target);
    var $icon = $("#project-icon");
    var $parent = $target.parent("a")
    $(".language").addClass("inactive");
    $(".tech").addClass("inactive");

    swapArticle($target.parent("a").attr("href"));

    history.pushState(null, null, $parent.attr("href"))

    var $article = $("article");
    var iconSrc = $icon.attr("src");
    var icon_href = $icon.data("href");
    $icon.attr("src", $target.attr("src"));
    $target.attr("src", iconSrc);

    $icon.data("href", $parent.attr("href"));
    $parent.attr("href", icon_href);


    sortElements($(".language"), $article.find(".languages-used input"), 40.5, $("#languages"))

    sortElements($(".tech"), $article.find(".techs-used input"), 20, $("#technology"))
  
  });
});