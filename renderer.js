(function() {
  var AutoUpdater, appRoot, autoupdater, basename, cfg, config, connection, data, error, fs, mysql, numRows, page, page_id, parseHtmlEntities, pkg, pkgd, qCount, updateChecker, uquery;

  fs = require('fs');

  appRoot = require('app-root-path');

  cfg = appRoot + "/config.json";

  pkgd = appRoot + "/package.json";

  mysql = require('mysql');

  config = null;

  try {
    pkg = JSON.parse(fs.readFileSync(pkgd));
  } catch (error1) {}

  try {
    config = JSON.parse(fs.readFileSync(cfg));
  } catch (error1) {
    error = error1;
    config = {
      host: "localhost",
      database: "undefined",
      user: "root",
      password: ""
    };
    console.error('Inpossibile leggere file configurazioni');
    Materialize.toast('Inpossibile leggere file configurazioni', 4000);
    $(".settings-overlay").css("display", "block");
    $(".settings-overlay").animate({
      opacity: .5
    }, "800ms");
    $(".settings").toggleClass("show");
  }

  basename = function(path, suffix) {
    var b;
    b = path.replace(/^.*[\/\\]/g, '');
    if (typeof suffix === 'string' && b.substr(b.length - suffix.length) === suffix) {
      b = b.substr(0, b.length - suffix.length);
    }
    return b;
  };

  $("#window-title").html(config.orgname);

  $("#orgname").val(config.orgname);

  AutoUpdater = require('auto-updater');

  autoupdater = new AutoUpdater({
    autoupdate: false,
    checkgit: true,
    jsonhost: 'raw.githubusercontent.com',
    contenthost: 'codeload.github.com',
    progressDebounce: 0,
    devmode: true
  });

  autoupdater.on('check.up-to-date', function(v) {
    console.info('You have the latest version: ' + v);
  });

  autoupdater.on('check.out-dated', function(v_old, v) {
    console.warn("Your version is outdated. " + v_old + " of " + v);
    $("#latest-version").html(v);
    $(".update-available").addClass("show");
  });

  autoupdater.on('update.extracted', function() {
    console.log('Update extracted successfully!');
    console.warn('RESTART THE APP!');
    Materialize.toast('Applicazione aggiornata', 4000);
    $(".update-available").html('<div class="updating"> <span id="update-mess">Aggiornato</span> <a class="btn theme right" id="restart">Riavvia</a> </div>');
  });

  autoupdater.on('download.start', function(name) {
    $(".update-mess").html("Scaricamento");
  });

  autoupdater.on('download.progress', function(name, perc) {
    $(".update-mess").html("Scaricamento " + perc + "%");
  });

  autoupdater.on('download.end', function(name) {
    console.log('Scaricato ' + name);
  });

  autoupdater.on('download.error', function(err) {
    console.error('Errore durante scaricamento: ' + err);
    Materialize.toast('Errore durante scaricamento', 4000);
  });

  autoupdater.on('update.downloaded', function() {
    console.log('Update downloaded and ready for install');
    autoupdater.fire('extract');
  });

  autoupdater.on('error', function(name, e) {
    console.error(name, e);
  });

  autoupdater.fire('check');

  updateChecker = window.setInterval(function() {
    autoupdater.fire('check');
  }, 1800000);

  $("body").on('click', '#restart', function() {
    location.reload();
  });

  $("#update").click(function() {
    autoupdater.fire('download-update');
    $(".update-available").html('<div class="updating"> <span id="update-mess">Aggiornamento</span> <div class="preloader-wrapper small active right"> <div class="spinner-layer spinner-green-only"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div> </div>');
  });

  parseHtmlEntities = function(str) {
    str.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
      var num;
      num = parseInt(numStr, 10);
      return String.fromCharCode(num);
    });
  };

  page = basename(location.pathname, ".html");

  uquery = location.search.substr(1);

  page_id = uquery.split("=")[1];

  numRows = 0;

  qCount = 0;

  window.connection = connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
  });

  window.mn = {
    0: "Genaio",
    1: "Febraio",
    2: "Marzo",
    3: "Aprile",
    4: "Maggio",
    5: "Giugnio",
    6: "Luglio",
    7: "Agosto",
    8: "Settembre",
    9: "Ottobre",
    10: "Novembre",
    11: "Dicembre"
  };

  window.mns = {
    0: "Gen",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "Mag",
    5: "Giu",
    6: "Lug",
    7: "Ago",
    8: "Set",
    9: "Ott",
    10: "Nov",
    11: "Dic"
  };

  window.months = {
    0: "01",
    1: "02",
    2: "03",
    3: "04",
    4: "05",
    5: "06",
    6: "07",
    7: "08",
    8: "09",
    9: "10",
    10: "11",
    11: "12"
  };

  window.states = {
    "-1": "<span style=\"color:#F44336\">Non riparabile</span>",
    0: "<span style=\"color:#FFC107\">Preso in carico</span>",
    1: "<span style=\"color:#CDDC39\">In riparazione</span>",
    2: "<span style=\"color:#4CAF50\">Pronto</span>",
    3: "<span>Ritirato</span>"
  };

  window.types = {
    0: {
      title: "PC",
      icon: "desktop_windows"
    },
    1: {
      title: "MAC",
      icon: "desktop_mac"
    },
    2: {
      title: "Smartphone",
      icon: "smartphone"
    },
    3: {
      title: "Notebook",
      icon: "computer"
    },
    4: {
      title: "Tablet",
      icon: "tablet"
    },
    5: {
      title: "Console",
      icon: "devices_other"
    },
    6: {
      title: "TV",
      icon: "tv"
    }
  };

  window.withdrawals = {
    0: "Ritiro al negozio",
    1: "Corriere esspresso"
  };

  window.alerts = {
    0: "Email",
    1: "Whatsapp",
    2: "Hangouts",
    3: "Chiamata"
  };

  window.uID = function() {
    var s4;
    s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    return s4() + s4() + s4() + s4() + s4();
  };

  connection.connect(function(err) {
    if (err) {
      Materialize.toast('Errore durante la connessione alla database', 4000);
      return;
    }
    console.info('Connesso. ID connessione: ' + connection.threadId);
  });

  connection.query("SELECT * FROM `orders` ORDER BY date DESC LIMIT " + qCount + ",20", function(err, rows, fields) {
    numRows = rows.length;
    if (err) {
      throw err;
    }
    rows.forEach(function(row) {
      var data, date, time;
      localStorage.setItem(row.id, JSON.stringify(row));
      date = new Date(row.date * 1000);
      time = date.getHours() + ':' + date.getMinutes();
      data = date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear();
      $("#list").append('<tr data-id="' + row.id + '" class="the-row" data-target="info-modal"> <td style="width:48px"><icon class="tooltipped" data-position="left" data-delay="50" data-tooltip="' + types[row.type].title + '">' + types[row.type].icon + '</icon></td> <td>' + row.title + '</td> <td>' + row.owner + '</td> <td>' + time + '</td> <td>' + data + '</td> <td class="right">' + states[row.state] + '</td> </tr>');
      $('.tooltipped').tooltip();
      if (numRows > 20) {
        qCount += 20;
      }
    });
  });

  window.changeState = function(opt, id) {
    connection.query("UPDATE `orders` SET state = ? WHERE id='" + id + "'", opt);
  };

  $('body').on('click', '#save', function() {
    var form, n, q;
    if (page === "add_object") {
      form = $("#jsform").serialize();
      q = form.split('&');
      n = {};
      q.forEach(function(o) {
        var f, key, value;
        f = o.split("=");
        key = f[0];
        value = f[1];
        if (key === "phone") {
          n[key] = value.replace(/\(/ig, '').replace(/\)/ig, '').replace(/-/ig, '').replace(/ /ig, '').replace(/%20/ig, '');
        } else {
          n[key] = value.replace(/%20/ig, ' ').replace(/%2C/ig, ',').replace(/%22/ig, '"').replace(/%40/ig, '@');
        }
      });
      n.code = uID();
      n.date = Math.floor(Date.now() / 1000);
      connection.query("SELECT * FROM `orders` WHERE code='" + n.code + "'", function(err, rows, fields) {
        if (err) {
          throw err;
        }
        if (rows.length !== 0) {
          return Materialize.toast('Codice già essiste nel database', 4000);
        } else {
          connection.query("INSERT INTO `orders` SET ?", n);
          Materialize.toast("Oggetto&nbsp;<b>\"" + n.title + "\"</b>&nbsp; è stato aggiunto", 4000);
          setTimeout(function() {
            return location.href = "index.html";
          }, 1500);
        }
      });
      return;
    }
    if (page === "edit_object") {
      form = $("#jsform").serialize();
      q = form.split('&');
      n = {};
      q.forEach(function(o) {
        var f, key, value;
        f = o.split("=");
        key = f[0];
        value = f[1];
        if (key === "phone") {
          n[key] = value.replace(/\(/ig, '').replace(/\)/ig, '').replace(/-/ig, '').replace(/ /ig, '').replace(/%20/ig, '');
        } else {
          n[key] = value.replace(/%20/ig, ' ').replace(/%2C/ig, ',').replace(/%22/ig, '"').replace(/%40/ig, '@');
        }
      });
      connection.query("SELECT * FROM `orders` WHERE id='" + page_id + "'", function(err, rows, fields) {
        if (err) {
          throw err;
        }
        if (rows.length === 0) {
          Materialize.toast('Oggetto non esistente', 4000);
        } else {
          if (!rows[0].date) {
            n.date = Math.floor(Date.now() / 1000);
          }
          connection.query("UPDATE `orders` SET ? WHERE id='" + page_id + "'", n);
          Materialize.toast('Oggetto&nbsp;<b>"' + n.title + '"</b>&nbsp; è stato aggiornato', 4000);
          setTimeout(function() {
            return location.href = "index.html";
          }, 1500);
        }
      });
    }
  });

  $('body').on('click', '#edit', function() {
    var id;
    id = $("#info-modal").attr("data-id");
    location.href = "edit_object.html?id=" + id;
  });

  if (page === "edit_object") {
    data = JSON.parse(localStorage.getItem(page_id));
    $("input, textarea").each(function() {
      var el, tid;
      tid = $(this).attr("id");
      return el = $("#" + tid).val(data[tid]);
    });
    $("select").each(function() {
      var opt, tid;
      tid = $(this).attr("id");
      opt = $("#" + tid)[0].options;
      $(opt[data[tid]]).attr('selected', 'true');
    });
  }

  if ($(window).scrollTop() + $(window).height() >= $(document).height() - 200 && numRows > 20) {
    connection.query("SELECT * FROM `orders` ORDER BY date DESC LIMIT " + qCount + ",20", function(err, rows, fields) {
      numRows = rows.length;
      if (err) {
        throw err;
      }
      rows.forEach(function(row) {
        var date, time;
        localStorage.setItem(row.id, JSON.stringify(row));
        date = new Date(row.date * 1000);
        time = date.getHours() + ':' + date.getMinutes();
        data = date.getDate() + '/' + months[date.getMonth()] + '/' + date.getFullYear();
        $("#list").append('<tr data-id="' + row.id + '" class="the-row" data-target="info-modal"> <td style="width:48px"><icon class="tooltipped" data-position="left" data-delay="50" data-tooltip="' + types[row.type].title + '">' + types[row.type].icon + '</icon></td> <td>' + row.title + '</td> <td>' + row.owner + '</td> <td>' + time + '</td> <td>' + data + '</td> <td class="right">' + states[row.state] + '</td> </tr>');
        $('.tooltipped').tooltip();
        if (numRows > qCount + 20) {
          qCount += 20;
        }
      });
    });
  }

  $("#settings").click(function() {
    $(".settings-overlay").css("display", "block");
    $(".settings-overlay").animate({
      opacity: .5
    }, "800ms");
    $(".settings").toggleClass("show");
  });

  $(".settings-overlay").click(function() {
    $(".settings-overlay").animate({
      opacity: 0
    }, "800ms", function() {
      $(".settings-overlay").css("display", "none");
    });
    $(".settings").toggleClass("show");
  });

  $("#close_settings").click(function() {
    $(".settings-overlay").animate({
      opacity: 0
    }, "800ms", function() {
      $(".settings-overlay").css("display", "none");
    });
    $(".settings").toggleClass("show");
  });

  $("#host").val(config.host);

  $("#database").val(config.database);

  $("#user").val(config.user);

  $("#password").val(config.password);

  $("#set_save").click(function() {
    var form, json, n, q;
    form = $("#jsform").serialize();
    q = form.split('&');
    n = {};
    q.forEach(function(o) {
      var f, key, value;
      f = o.split("=");
      key = f[0];
      value = f[1];
      n[key] = value.replace(/%20/ig, ' ').replace(/%2C/ig, ',').replace(/%22/ig, '"').replace(/%40/ig, '@');
    });
    json = JSON.stringify(n);
    fs.writeFile(cfg, json, function(err) {
      if (err) {
        throw err;
      }
      Materialize.toast('Configurazione aggiornata', 4000);
      $(".settings-overlay").animate({
        opacity: 0
      }, "800ms", function() {
        $(".settings-overlay").css("display", "none");
      });
      $(".settings").toggleClass("show");
      updateChecker = window.setTimeout(function() {
        location.reload();
      }, 2500);
    });
  });

  $("#app-version").html("v" + pkg.version);

}).call(this);

//# sourceMappingURL=renderer.js.map