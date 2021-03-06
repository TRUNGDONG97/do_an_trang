$(document).ready(function () {
  $("#tabHome a").css({
    "background-color": "#fff",
    color: "#f02a2a",
  });
  $("#employee-selection").click(function () {
    window.location = "/admin/employee";
  });
  $("#admin-selection").click(function () {
    window.location = "/admin/admin";
  });
  $("#mac-selection").click(function () {
    window.location = "/admin/mac";
  });
  $.ajax({
    url: "/getCountEmployee",
    type: "GET",
    dataType: "json",
    cache: false,
    timeout: 50000,
  })
    .done(function (res) {
      console.log(res);
      $("#employee-selection span").append(res.countEmployee);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      // If fail
      swal({
        title: "Đã có lỗi xảy ra",
        text: "",
        dangerMode: true,
        icon: "warning",
      });
      console.log(textStatus + ": " + errorThrown);
      return;
    });
  $.ajax({
    url: "/getCountAdmin",
    type: "GET",
    dataType: "json",
    cache: false,
    timeout: 50000,
  })
    .done(function (res) {
      console.log(res);
      $("#admin-selection span").append(res.countAdmin);
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      // If fail
      swal({
        title: "Đã có lỗi xảy ra",
        text: "",
        dangerMode: true,
        icon: "warning",
      });
      console.log(textStatus + ": " + errorThrown);
      return;
    });
    $.ajax({
      url: "/getCountMac",
      type: "GET",
      dataType: "json",
      cache: false,
      timeout: 50000,
    })
      .done(function (res) {
        console.log(res);
        $("#mac-selection span").append(res.countMac);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        // If fail
        swal({
          title: "Đã có lỗi xảy ra",
          text: "",
          dangerMode: true,
          icon: "warning",
        });
        console.log(textStatus + ": " + errorThrown);
        return;
      });
});
