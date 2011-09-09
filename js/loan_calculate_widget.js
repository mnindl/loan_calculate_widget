/*global window */
/*global $ */
/*global alert */
/*global google */
google.load("jquery", "1.6.2");
google.load("jqueryui", "1.8.14");
if (!window.LOANCALCULATEWIDGET) { var LOANCALCULATEWIDGET = {}; }

LOANCALCULATEWIDGET.compute = (function () {
  var calc_data_json = {
    "0" : {
        "50" : "0,0359",
        "60" : "0,0359",
        "80" : "0,0359",
        "100": "0,039"
    },
    "100000" : {
        "50" : "0,0358",
        "60" : "0,0359",
        "80" : "0,0359",
        "100": "0,039"
    },
    "200000" : {
        "50" : "0,0335",
        "60" : "0,0335",
        "80" : "0,0359",
        "100": "0,039"
    },
    "300000" : {
        "50" : "0,0335",
        "60" : "0,0335",
        "80" : "0,0359",
        "100": "0,039"
    }
  };

  function getFormatPrice(price, euro_sign) {
    var temp;
    price = parseInt(price * 100, 10);
    price = price / 100;
    //für kommastellen(2) anstatt ()
    temp = price.toFixed();
    temp = temp.replace(/\./, ",");
    while (temp.match(/^(\d+)(\d{3}\b)/)) {
      temp = temp.replace(/^(\d+)(\d{3}\b)/, RegExp.$1 + '.' + RegExp.$2);
    }
    if (euro_sign) {
      return temp + " &#128;";
    } else {
      return temp;
    }
  }
  function getDebitInterest(loan_sum, loan_ratio) {
    var loan_key,
        ratio_key;
    if (loan_sum < 100000) {
      loan_key = "0";
    } else if (loan_sum >= 100000 && loan_sum < 200000) {
      loan_key = "100000";
    } else if (loan_sum >= 200000 && loan_sum < 300000) {
      loan_key = "200000";
    } else {
      loan_key = "300000";
    }
    if (loan_ratio <= 50){
      ratio_key = "50";
    } else if (loan_ratio > 50 && loan_ratio <= 60 ) {
      ratio_key ="60";
    } else if (loan_ratio > 60 && loan_ratio <= 80 ) {
      ratio_key ="80";
    } else {
      ratio_key ="100";
    }
    return parseFloat(calc_data_json[loan_key][ratio_key].replace(/\,/, "."));
  }
  function calcLoan() {
    var buy_price = $('#buy_price_slider .ui-slider-handle').html().replace(/\./, ""),
        own_capital = $('#own_capital_slider .ui-slider-handle').html().replace(/\./, ""),
        buy_price_num = Number(buy_price.slice(0, buy_price.length-1)),
        own_capital_num = Number(own_capital.slice(0, own_capital.length-1)),
        loan_sum = buy_price_num-own_capital_num,
        loan_ratio = ((loan_sum/buy_price_num).toFixed(2))*100,
        debit_interest = getDebitInterest(loan_sum, loan_ratio);
        monthly_rate = (loan_sum * ((debit_interest + 0.01)/12)).toFixed(0);
    $('#loan_value').html(getFormatPrice(loan_sum, true));
    $('#monthly_value').html(getFormatPrice(monthly_rate, true));
  }
  function setSliderValues(slider, ui) {
    var own_capital_value = $(".slider_own_capital").slider('value');
    var buy_price_value =  $(".slider_buy_price").slider('value');
    if (slider === "buy_price") {
      if (own_capital_value >= ui.value) {
        $('#own_capital_slider .ui-slider-handle').html(getFormatPrice(ui.value, true));
        $('#buy_price_slider .ui-slider-handle').html(getFormatPrice(ui.value, true));
      } else {
        $('#buy_price_slider .ui-slider-handle').html(getFormatPrice(ui.value, true));
      }
    }
    if (slider === "own_capital") {
      if (buy_price_value <= ui.value) {
        $('#own_capital_slider .ui-slider-handle').html(getFormatPrice(buy_price_value, true));
      } else {
        $('#own_capital_slider .ui-slider-handle').html(getFormatPrice(ui.value, true));
      }
    }
  }
  function initSlider() {
    // set sliders
    var slider_opt_buy_price = {
      min: 50000,
      max: 900000,
      step: 10000,
      range: "max",
      animate: 2000,
      create: function (e, ui) {
        $('#buy_price_slider .ui-slider-handle').html(getFormatPrice('50000', true));
      },
      slide: function (e, ui) {
        setSliderValues("buy_price", ui);
        calcLoan();
      },
      change: function (e, ui) {
        setSliderValues("buy_price", ui);
        calcLoan();
      } 
    },
      slider_opt_own_capital = {
        min: 10000,
        max: 500000,
        step: 10000,
        range: "max",
        animate: 2000,
        create: function (e, ui) {
          $('#own_capital_slider .ui-slider-handle').html(getFormatPrice('10000', true));
        },
        slide: function (e, ui) {
          setSliderValues("own_capital", ui);
          calcLoan();
        },
        change: function (e, ui) {
          setSliderValues("own_capital", ui);
          calcLoan();
        }
      };
      $(".slider_buy_price").slider(slider_opt_buy_price);
      $(".slider_own_capital").slider(slider_opt_own_capital);
      $('#sliders').css('visibility', 'visible');
      $('.slider_buy_price .ui-slider-handle').focus();
      $(".slider_buy_price").slider("value", 640000);
      $(".slider_own_capital").slider("value", 210000);
  }
  function init() {
    initSlider();
  }
  return {
    init: function () {
      return init();
    }
  };
}());
google.setOnLoadCallback(LOANCALCULATEWIDGET.compute.init);
