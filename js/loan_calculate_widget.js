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
      "100": "0,039",
  },
  "100000" : {
      "50" : "0,0358",
      "60" : "0,0359",
      "80" : "0,0359",
      "100": "0,039",
  },
  "200000" : {
      "50" : "0,0335",
      "60" : "0,0335",
      "80" : "0,0359",
      "100": "0,039",
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
    console.log("loan_sum= "+loan_sum);
    console.log("loan_ratio= "+loan_ratio);
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
    console.log(loan_key);
    console.log(ratio_key);
    console.log(calc_data_json[loan_key][ratio_key]);
    return parseFloat(calc_data_json[loan_key][ratio_key].replace(/\,/, "."));
    
  }
  function calcLoan() {
    var buy_price = Number($('.buy_price_slider .ui-slider-handle').html().replace(/\./, "")),
       own_capital = Number($('.own_capital_slider .ui-slider-handle').html().replace(/\./, "")),
       loan_sum = buy_price-own_capital,
       loan_ratio = ((loan_sum/buy_price).toFixed(2))*100,
       debit_interest = getDebitInterest(loan_sum, loan_ratio);
       //console.log(loan_sum * ((debit_interest +0.01)/12));
       monthly_rate = (loan_sum * ((debit_interest + 0.01)/12)).toFixed(0);
       //console.log("monthly_rate= "+monthly_rate);
    $('#loan_value').text(loan_sum);
    $('#monthly_value').text(monthly_rate);
     /*  console.log(buy_price+"  "+own_capital+" "),
       console.log(calc_data_json['50000']);
       console.log("Darlehenssumme: "+loan_sum);*/
       /*console.log("Monatliche Rate: "+buy_price-own_capital);
       230.000 x (0,0359 + 0,01) / 12 = 880*/ 
  }
  function initSlider() {
    // set sliders
    var slider_opt_buy_price = {
      min: 50000,
      max: 900000,
      step: 10000,
      create: function (e, ui) {
        $('.buy_price_slider .ui-slider-handle').text('50.000');
      },
      slide: function (e, ui) {
        var own_capital_value =  $(".slider_own_capital").slider('value');
        $('.buy_price_slider .ui-slider-handle').text(getFormatPrice(ui.value, false));
        if (own_capital_value > ui.value) {
          $('.own_capital_slider .ui-slider-handle').text(getFormatPrice(ui.value, false));
        }
        calcLoan();
      },
      change: function (e, ui) {
        var own_capital_value =  $(".slider_own_capital").slider('value');
        $('.buy_price_slider .ui-slider-handle').text(getFormatPrice(ui.value, false));
        calcLoan();
      } 
    },
      slider_opt_own_capital = {
        min: 10000,
        max: 500000,
        step: 10000,
        create: function (e, ui) {
          $('.own_capital_slider .ui-slider-handle').text('10.000');
        },
        slide: function (e, ui) {
          var buy_price_value =  $(".slider_buy_price").slider('value');
          $('.own_capital_slider .ui-slider-handle').text(getFormatPrice(ui.value, false));
          if (buy_price_value <= ui.value) {
            $('.own_capital_slider .ui-slider-handle').text(getFormatPrice(buy_price_value, false));
          }
          calcLoan();
        },
        change: function (e, ui) {
          var buy_price_value =  $(".slider_buy_price").slider('value');
          $('.own_capital_slider .ui-slider-handle').text(getFormatPrice(ui.value, false));
          if (buy_price_value <= ui.value) {
            $('.own_capital_slider .ui-slider-handle').text(getFormatPrice(buy_price_value, false));
          }
          calcLoan();
        } 
      };
      $(".slider_buy_price").slider(slider_opt_buy_price);
      $(".slider_own_capital").slider(slider_opt_own_capital);
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
