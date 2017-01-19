# out: ../../app/$1.js, sourcemap: true
# This file is required by the index.html file and will
# be executed in the renderer process for that window.
# All of the Node.js APIs are available in this process.
fs = require('fs')
#window.cfg_db =
#  "host":"localhost"
#  "database":"tbservice"
#  "user":"root"
#  "password":""
window.cfg_db =
  "host":"sql11.freemysqlhosting.net"
  "database":"sql11154081"
  "user":"sql11154081"
  "password":"rvhLBIXsD6"
mysql = require('mysql')

basename = (path, suffix) ->
  b = path.replace(/^.*[\/\\]/g, '')
  if typeof suffix == 'string' and b.substr(b.length - (suffix.length)) == suffix
    b = b.substr(0, b.length - (suffix.length))
  b

AutoUpdater = require('auto-updater')

autoupdater = new AutoUpdater
  pathToJson: ''
  autoupdate: false
  checkgit: true
  jsonhost: 'raw.githubusercontent.com'
  contenthost: 'codeload.github.com'
  progressDebounce: 0
  devmode: false

autoupdater.on 'check.up-to-date', (v) ->
  console.info 'You have the latest version: ' + v
  return
autoupdater.on 'check.out-dated', (v_old, v) ->
  console.warn "Your version is outdated. #{v_old} of #{v}"
  $("#latest-version").html(v)
  $(".update-available").addClass("show")
  return
autoupdater.on 'update.extracted', ->
  console.log 'Update extracted successfully!'
  console.warn 'RESTART THE APP!'
  Materialize.toast 'Applicazione aggiornata', 4000
  $(".update-available").html '<div class="updating">
    <span id="update-mess">Aggiornato</span>
    <a class="btn right" id="restart">Riavvia</a>
  </div>'
  return
autoupdater.on 'download.start', (name) ->
  $(".update-mess").html "Scaricamento"
  return
autoupdater.on 'download.progress', (name, perc) ->
  $(".update-mess").html "Scaricamento #{perc}%"
  return
autoupdater.on 'download.end', (name) ->
  console.log 'Scaricato ' + name
  return
autoupdater.on 'download.error', (err) ->
  console.error 'Errore durante scaricamento: ' + err
  Materialize.toast 'Errore durante scaricamento', 4000
  return
autoupdater.on 'update.downloaded', ->
  console.log 'Update downloaded and ready for install'
  autoupdater.fire 'extract'
  return
autoupdater.on 'error', (name, e) ->
  console.error name, e
  return

autoupdater.fire 'check'

$("body").on 'click', '#restart',  ->
  location.reload()



$("#update").click ->
  autoupdater.fire 'download-update'
  $(".update-available").html '<div class="updating">
    <span id="update-mess">Aggiornamento</span>
    <div class="preloader-wrapper small active right">
      <div class="spinner-layer spinner-green-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>'



page = basename location.pathname, ".html"
uquery = location.search.substr 1
page_id = uquery.split("=")[1]

window.connection = connection = mysql.createConnection(
  host: cfg_db.host
  user: cfg_db.user
  password: cfg_db.password
  database: cfg_db.database)

window.mn =
  0: "Genaio"
  1: "Febraio"
  2: "Marzo"
  3: "Aprile"
  4: "Maggio"
  5: "Giugnio"
  6: "Luglio"
  7: "Agosto"
  8: "Settembre"
  9: "Ottobre"
  10: "Novembre"
  11: "Dicembre"

window.mns =
  0: "Gen"
  1: "Feb"
  2: "Mar"
  3: "Apr"
  4: "Mag"
  5: "Giu"
  6: "Lug"
  7: "Ago"
  8: "Set"
  9: "Ott"
  10: "Nov"
  11: "Dic"

window.months =
  0: "01"
  1: "02"
  2: "03"
  3: "04"
  4: "05"
  5: "06"
  6: "07"
  7: "08"
  8: "09"
  9: "10"
  10: "11"
  11: "12"

window.states =
  "-1": "<span style=\"color:#F44336\">Non riparabile</span>"
  0: "<span style=\"color:#FFC107\">Preso in carico</span>"
  1: "<span style=\"color:#CDDC39\">In riparazione</span>"
  2: "<span style=\"color:#4CAF50\">Pronto</span>"
  3: "<span>Ritirato</span>"

window.types =
  0:
    title: "PC"
    icon: "desktop_windows"
  1:
    title: "MAC"
    icon: "desktop_mac"
  2:
    title: "Smartphone"
    icon: "smartphone"
  3:
    title: "Notebook"
    icon: "computer"
  4:
    title: "Tablet"
    icon: "tablet"
  5:
    title: "Console"
    icon: "devices_other"
  6:
    title: "TV"
    icon: "tv"

window.withdrawals =
  0: "Ritiro al negozio"
  1: "Corriere esspresso"

window.alerts =
  0: "Email"
  1: "Whatsapp"
  2: "Hangouts"
  3: "Chiamata"

window.uID = ->
  s4 = ->
    Math.floor((1 + Math.random()) * 0x10000).toString(16).substring 1
  s4() + s4() + s4() + s4() + s4()

connection.connect (err) ->
  if err
    Materialize.toast 'Errore durante la connessione alla database', 4000
    return
  console.info 'Connesso. ID connessione: ' + connection.threadId
  return
connection.query 'SELECT * FROM `orders` ORDER BY date DESC LIMIT 0,20', (err, rows, fields) ->
  if err
    throw err
  rows.forEach (row) ->
    localStorage.setItem(row.id, JSON.stringify(row))
    date = new Date row.date * 1000
    time = date.getHours() + ':' + date.getMinutes()
    data = date.getDate()+'/'+months[date.getMonth()]+'/'+date.getFullYear()
    $("#list").append '<tr data-id="'+row.id+'" class="the-row" data-target="info-modal">
      <td style="width:48px"><icon class="tooltipped" data-position="left" data-delay="50" data-tooltip="'+types[row.type].title+'">'+types[row.type].icon+'</icon></td>
      <td>'+row.title+'</td>
      <td>'+row.owner+'</td>
      <td>'+time+'</td>
      <td>'+data+'</td>
      <td class="right">'+states[row.state]+'</td>
    </tr>'
    $('.tooltipped').tooltip()
  return

window.changeState = (opt, id) ->
  connection.query "UPDATE `orders` SET state = ? WHERE id='"+id+"'", opt


$('body').on 'click', '#save', ->
  if(page == "add_object")
    form = $("#jsform").serialize()
    q = form.split '&'
    n = {}
    q.forEach (o) ->
      f = o.split "="
      key = f[0]
      value = f[1]
      n[key] = value
    n.code = uID()
    n.date = Math.floor Date.now() / 1000
    connection.query "SELECT * FROM `orders` WHERE code='"+n.code+"'", (err, rows, fields) ->
      if err
        throw err
      if rows.length != 0
        Materialize.toast 'Codice già essiste nel database', 4000
      else
        connection.query 'INSERT INTO `orders` SET ?', n
        Materialize.toast 'Oggetto&nbsp;<b>"'+n.title+'"</b>&nbsp; è stato aggiunto', 4000
        setTimeout location.href = "index.html", 3000
    return
  if(page == "edit_object")
    form = $("#jsform").serialize()
    q = form.split '&'
    n = {}
    q.forEach (o) ->
      f = o.split "="
      key = f[0]
      value = f[1]
      n[key] = value.replace(/%20/ig, ' ').replace(/%2C/ig, ',').replace(/%22/ig, '"')


    connection.query "SELECT * FROM `orders` WHERE id='"+page_id+"'", (err, rows, fields) ->
      if err
        throw err
      if rows.length == 0
        Materialize.toast 'Oggetto non esistente', 4000
      else
        if(!rows[0].date)
          n.date = Math.floor Date.now() / 1000
        connection.query "UPDATE `orders` SET ? WHERE id='"+page_id+"'", n
        Materialize.toast 'Oggetto&nbsp;<b>"'+n.title+'"</b>&nbsp; è stato aggiornato', 4000
        setTimeout location.href = "index.html", 3000
      return

$('body').on 'click', '#edit', ->
  id = $("#info-modal").attr("data-id")
  location.href = "edit_object.html?id="+id

if(page == "edit_object")
  data = JSON.parse(localStorage.getItem(page_id))

  $("input, textarea").each ->
    tid = $(@).attr "id"
    el = $("#"+tid).val(data[tid])
  $("select").each ->
    tid = $(@).attr "id"
    opt = $("#"+tid)[0].options
    $(opt[data[tid]]).attr('selected', 'true')
