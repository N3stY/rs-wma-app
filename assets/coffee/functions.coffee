# out: ../js/$1.js, sourcemap: true
DropdownClose = (e) ->
  cnt = $ ".dropdown-window"
  i = 0
  while i < cnt.length
    t = $(cnt[i])
    if t.attr("state") == "open"
      if t.find($(e.target)).length != 1
        t.removeAttr "state"
        t.animate {
          width: 0,
          height: 0,
          opacity: 1,
          left: "100%"
        }, 200
    i++

$(window).mouseup (e) ->
  DropdownClose e
  return

$(".dropdown-window").each ->
  $(@).attr("data-width", $(@).width()).attr("data-height", $(@).height())

$('[data-function="dropdown"]').click (e) ->
  e.preventDefault()
  b = $(@)
  bo = b[0]
  w = $(b.attr "href")
  width = w.attr("data-width")
  height = w.attr("data-height")
  top = bo.offsetTop + bo.offsetHeight
  left = (bo.offsetLeft + 50) - width - 24
  w.css("width": 0)
  .css("height", 0)
  .css("top": top)
  .css("left", bo.offsetLeft + 50)
  .css("display":"block")
  .attr("state", "open")
  w.animate {
    width: width,
    height: height,
    opacity: 1,
    left: left
  }, 200
$(".dropdown-window a").click ->
  w = $(@).parent "div"
  w.removeAttr "state"
  w.animate {
    width: 0,
    height: 0,
    opacity: 1,
    left: "100%"
  }, 200
