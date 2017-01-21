(function() {
  var BrowserWindow, FocusWin, alert_mode, btn, cod_fisc, code, comment, cred, email, error, idate, itime, maximize, minimize, number, owner, remote, state, title, type, withdrawal;

  $('.modal').modal();

  $(".button-collapse").sideNav();

  $(".disabled").click(function(e) {
    return e.preventDefault();
  });

  $('select').material_select();

  code = $("#code");

  type = $('#type');

  title = $('#title');

  owner = $('#owner');

  cod_fisc = $('#cod-fisc');

  withdrawal = $('#withdrawal');

  itime = $('#itime');

  idate = $('#idate');

  number = $('#number');

  email = $('#email');

  alert_mode = $('#alert-mode');

  state = $('#state');

  comment = $('#comment');

  $('.modal').modal({
    dismissible: true,
    opacity: .5,
    in_duration: 300,
    out_duration: 200,
    starting_top: '4%',
    ending_top: '10%',
    ready: function(modal, trigger) {
      var d, data, date, rid, time;
      rid = trigger.attr("data-id");
      data = JSON.parse(localStorage.getItem(rid));
      d = new Date(data.date * 1000);
      time = d.getHours() + ':' + d.getMinutes();
      date = d.getDate() + '/' + months[d.getMonth()] + '/' + d.getFullYear();
      code.html(data.code);
      type.html(types[data.type].title);
      title.html(data.title);
      owner.html(data.owner);
      cod_fisc.html(data['cod-fisc']);
      withdrawal.html(withdrawals[data.withdrawal]);
      itime.html(time);
      idate.html(date);
      number.html("(" + data.phone.substr(0, 3) + ") " + data.phone.substr(3, 2) + "-" + data.phone.substr(5, 2) + "-" + data.phone.substr(7, 3));
      email.html(data.email);
      alert_mode.html(alerts[data.alert]);
      state.html(states[data.state]);
      comment.html(data.comment);
      $('#info-modal').attr("data-id", data.id);
    },
    complete: function() {
      code.html("");
      type.html("");
      title.html("");
      owner.html("");
      cod_fisc.html("");
      withdrawal.html("");
      itime.html("");
      idate.html("");
      number.html("");
      email.html("");
      alert_mode.html("");
      state.html("");
      comment.html("");
      $('#info-modal').removeAttr("data-id");
    }
  });

  BrowserWindow = remote = require('electron').remote;

  FocusWin = remote.getCurrentWindow();

  cred = {};

  cred.height = window.outerHeight;

  cred.width = window.outerWidth;

  cred.maxHeight = screen.height - 40;

  cred.maxWidth = screen.width;

  minimize = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>';

  maximize = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>';

  $(window).on("resize", function() {
    cred.height = window.outerHeight;
    return cred.width = window.outerWidth;
  });

  if (cred.height === cred.maxHeight && cred.width === cred.maxWidth) {
    btn = $('[action="resize"]');
    btn.attr("status", "max");
    btn.html(maximize);
  }

  $('[action="close"]').click(function() {
    return window.close();
  });

  $('[action="resize"]').click(function() {
    btn = $(this);
    if (btn.attr("status") === "max") {
      FocusWin = remote.getCurrentWindow();
      btn.attr("status", "normal");
      btn.html(minimize);
      return FocusWin.maximize();
    } else {
      btn.attr("status", "max");
      btn.html(maximize);
      return FocusWin.unmaximize();
    }
  });

  $('[action="tray"]').click(function() {
    var win;
    win = remote.getCurrentWindow();
    return win.minimize();
  });

  $(".modal-action").click(function() {
    var action, data, id, stato;
    id = $("#info-modal").attr("data-id");
    if (id === "") {
      Materialize.toast('Errore nel elaborazione richiesta. Chiudi e riapri di nuovo finestrino', 4000);
      return;
    }
    if ($(this).attr("action")) {
      if ($(this).attr("action") === "norepair") {
        action = "-1";
        stato = "Non riparabile";
      }
      if ($(this).attr("action") === "onwork") {
        action = 1;
        stato = "In riparazione";
      }
      if ($(this).attr("action") === "complete") {
        action = 2;
        stato = "Pronto";
      }
      data = JSON.parse(localStorage.getItem(id));
      if (data.state === action) {
        Materialize.toast('Oggetto già segniato come&nbsp;<b>"' + stato + '"</b>', 4000);
        return;
      }
      data.state = action;
      localStorage.setItem(id, JSON.stringify(data));
      $("#state").html(states[action]);
      $('tr[data-id="' + id + '"]').children(".right").html(states[action]);
      changeState(action, id);
      return Materialize.toast('Stato di oggetto passato a&nbsp;<b>"' + stato + '"</b>', 4000);
    }
  });

  try {
    $("#phone").mask("(999) 99-99-999", {
      placeholder: "(___) __-__-___"
    });
  } catch (error1) {
    error = error1;
    return;
  }

}).call(this);

//# sourceMappingURL=main.js.map