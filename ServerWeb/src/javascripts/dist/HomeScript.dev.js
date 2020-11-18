"use strict";

$(document).ready(function () {
  $("#tabHome a").css({
    "background-color": "#fff",
    color: "#078a23"
  });
  $("#employee-selection").click(function () {
    window.location = "/admin/employee";
  });
  $.ajax({
    url: "/getCountEmployee",
    type: "GET",
    dataType: "json",
    cache: false,
    timeout: 50000
  }).done(function (res) {
    console.log(res);
    $('#employee-selection span').append(res.countEmployee);
  }).fail(function (jqXHR, textStatus, errorThrown) {
    // If fail
    swal({
      title: "Đã có lỗi xảy ra",
      text: "",
      dangerMode: true,
      icon: "warning"
    });
    console.log(textStatus + ": " + errorThrown);
    return;
  });
});