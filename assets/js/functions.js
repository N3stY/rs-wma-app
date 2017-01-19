(function() {
  var DropdownClose;

  DropdownClose = function(e) {
    var cnt, i, results, t;
    cnt = $(".dropdown-window");
    i = 0;
    results = [];
    while (i < cnt.length) {
      t = $(cnt[i]);
      if (t.attr("state") === "open") {
        if (t.find($(e.target)).length !== 1) {
          t.removeAttr("state");
          t.animate({
            width: 0,
            height: 0,
            opacity: 1,
            left: "100%"
          }, 200);
        }
      }
      results.push(i++);
    }
    return results;
  };

  $(window).mouseup(function(e) {
    DropdownClose(e);
  });

  $(".dropdown-window").each(function() {
    return $(this).attr("data-width", $(this).width()).attr("data-height", $(this).height());
  });

  $('[data-function="dropdown"]').click(function(e) {
    var b, bo, height, left, top, w, width;
    e.preventDefault();
    b = $(this);
    bo = b[0];
    w = $(b.attr("href"));
    width = w.attr("data-width");
    height = w.attr("data-height");
    top = bo.offsetTop + bo.offsetHeight;
    left = (bo.offsetLeft + 50) - width - 24;
    w.css({
      "width": 0
    }).css("height", 0).css({
      "top": top
    }).css("left", bo.offsetLeft + 50).css({
      "display": "block"
    }).attr("state", "open");
    return w.animate({
      width: width,
      height: height,
      opacity: 1,
      left: left
    }, 200);
  });

  $(".dropdown-window a").click(function() {
    var w;
    w = $(this).parent("div");
    w.removeAttr("state");
    return w.animate({
      width: 0,
      height: 0,
      opacity: 1,
      left: "100%"
    }, 200);
  });

}).call(this);

//# sourceMappingURL=functions.js.map