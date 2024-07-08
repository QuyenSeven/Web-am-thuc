let changeTab = (tabTarget) => {
  $(".nav-link").removeClass(" text-danger active");
  $(".nav-link").parent().removeClass("active");
  tabTarget.addClass(" text-danger  active");
  tabTarget.parent().addClass("active");

  // Lấy vị trí của chỉ báo
  var indicator = tabTarget.find(".indicator");
  // Lấy vị trí và kích thước của nút tab
  var buttonRect = tabTarget[0].getBoundingClientRect();
  // Cập nhật vị trí của chỉ báo
  indicator.css({
    top: buttonRect.top + buttonRect.height / 2 - indicator.height() / 2,
    right:
      $(window).width() -
      buttonRect.right +
      buttonRect.width / 2 -
      indicator.width() / 2,
  });
};

// Hàm loại bỏ dấu tiếng Việt
function removeDiacritics(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

// Hàm kiểm tra danh mục trống
function checkEmptyCategory() {
  var categoryContent = $(".category-content-first");
  var emptyMessage = categoryContent.find(".empty-message");

  if (categoryContent.find(".category-item").length === 0) {
    emptyMessage.show(); // Hiển thị thông báo nếu danh sách trống
  } else {
    emptyMessage.hide(); // Ẩn thông báo nếu danh sách không trống
  }
}

// LOAD TAB

function loadTabContent(tabId, contentUrl, scriptUrl) {
  if (!$(tabId).data("loaded")) {
    $(tabId).load(contentUrl, function () {
      $.getScript(scriptUrl, function () {
        $(tabId).data("loaded", true);
      });
    });
  }
}

$(document).ready(function () {
  $('button[data-bs-toggle="pill"]').on("click", function (e) {
    var target = $(e.target).attr("data-bs-target");
    switch (target) {
      case "#v-pills-home":
        loadTabContent(
          "#v-pills-home",
          "../content-tab/home-tab.html",
          "../jquery/home-tab.js"
        );
        break;
      case "#v-pills-category":
        loadTabContent(
          "#v-pills-category",
          "../content-tab/category-tab.html",
          "../jquery/category-tab.js"
        );
        break;
      case "#v-pills-post":
        loadTabContent(
          "#v-pills-post",
          "../content-tab/post-tab.html",
          "../jquery/post-tab.js"
        );
        break;
      case "#v-pills-person":
        loadTabContent(
          "#v-pills-person",
          "../content-tab/person-tab.html",
          "../jquery/person-tab.js"
        );
        break;
      case "#v-pills-notification":
        loadTabContent(
          "#v-pills-notification",
          "../content-tab/notification-tab.html",
          "../jquery/notification-tab.js"
        );
        break;
    }
  });
  // Tải nội dung của tab đầu tiên khi trang được load
  loadTabContent(
    "#v-pills-home",
    "../content-tab/home-tab.html",
    "../jquery/home-tab.js"
  );
});

$(document).ready(function () {
  $(".nav-link").click(function () {
    var tabTarget = $(this);
    changeTab(tabTarget);
    var tabId = $(this).data("tab");
    $(".tab-content").removeClass("active");
    $("#" + tabId).addClass("active");
    $(this).addClass("active");
  });

  // Popover
  $('[data-bs-toggle="popover"]').popover({
    content: function () {
      return $("#setting-popover-content").html();
    },
    html: true,
  });

  $("#logout-option").click(function () {
    // Chuyển hướng đến trang đăng nhập
    $("#logoutSuccessModal").modal("show");
    // Chuyển hướng đến trang đăng nhập
    setTimeout(function () {
      window.location.replace("login.html");
    }, 2000);
  });
});

//  API WEATHER

$(document).ready(function () {
  const apiKey = "11414c48f6853befc28fc87fe69e336b"; // Thay thế bằng API key của bạn
  const lat = "21.054155"; // Vĩ độ của địa điểm
  const lon = "105.735027"; // Kinh độ của địa điểm
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=vi`;

  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const temperatureElement = $(".temperature");
      const cityElement = $(".city");
      const timeDateElement = $(".time-date");
      const weatherIconElement = $("#weather-icon");
      const descriptionElement = $(".description");

      const temperature = Math.round(data.main.temp);
      const city = data.name;
      const description = data.weather[0].description;
      const iconCode = data.weather[0].icon;
      const currentDate = new Date();
      const time = currentDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const date = currentDate.toLocaleDateString("vi-VN");

      temperatureElement.text(`${temperature}°C`);
      cityElement.text(city);
      timeDateElement.text(`${time} - ${date}`);
      descriptionElement.text(
        description.charAt(0).toUpperCase() + description.slice(1)
      );
      weatherIconElement.attr(
        "src",
        `http://openweathermap.org/img/wn/${iconCode}.png`
      );
    })
    .catch((error) => console.error("Error fetching weather data:", error));
});
