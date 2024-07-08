$(document).ready(function () {
  checkEmptyCategory();
  var selectedItem = null; // Biến để lưu trữ mục danh mục được chọn
  var originalItems = $(".feedback-item");
  $(".feedback-item").click(function () {
    if (selectedItem !== null) {
      $(selectedItem).removeClass("selected-feedback"); // Loại bỏ lớp selected từ mục danh mục trước đó
    }
    selectedItem = this; // Lưu trữ mục danh mục được chọn vào biến
    $(this).addClass("selected-feedback"); // Thêm lớp selected cho mục danh mục được click
  });

  // Search-category

  $("#search-input-feedback").on("keyup", function () {
    var value = removeDiacritics($(this).val().toLowerCase());
    if (!value) {
      originalItems.show();
      return;
    }
    originalItems.filter(function () {
      var text;
      var feedbackImgSrc = $(this).find("img").attr("src");

      // Lặp qua từng ảnh trong bảng table-person-content
      $(".table-person-content tr").each(function () {
        var tableImgSrc = $(this).find(".col-person-1 img").attr("src");
        var tableUsername = $(this).find(".col-person-2").text().trim();

        // So sánh src của ảnh trong feedback-item với src của ảnh trong table-person-content
        if (feedbackImgSrc === tableImgSrc) {
          text = removeDiacritics(tableUsername.toLowerCase());
        }
      });
      $(this).toggle(text.indexOf(value) > -1);
    });

    // Check if there are any visible items left
    if ($(".feedback-item:visible").length === 0) {
      $(".empty-message-feedback").show();
    } else {
      $(".empty-message-feedback").hide();
    }
  });

  // Xoá danh mục

  $(".btn-xoa-feedback").click(function () {
    if (selectedItem !== null) {
      $(selectedItem).slideUp(400, function () {
        $(this).remove(); // Xóa mục danh mục được chọn sau khi hiệu ứng slide up hoàn thành
        selectedItem = null; // Đặt lại biến selectedItem thành null
        checkEmptyCategory();
      });
    }
  });
  $(document).click(function (event) {
    // Kiểm tra xem click không phải là trên .category-item hoặc các phần tử con của nó
    if (!$(event.target).closest(".feedback-item").length) {
      if (selectedItem !== null) {
        $(selectedItem).removeClass("selected-feedback"); // Loại bỏ lớp selected từ mục danh mục hiện tại
        selectedItem = null; // Đặt lại biến selectedItem thành null
      }
    }
  });

  var feedbackItemId;
  $(".feedback-item a").click(function (e) {
    e.preventDefault();
    var $parent = $(this).closest(".feedback-item");
    var imageSrc = $parent.find("img").attr("src");
    var description = $parent.find(".feedback-desc-item").text();
    var usernamefeedback;
    $(".table-person-content tr").each(function () {
      var tableImgSrc = $(this).find(".col-person-1 img").attr("src");
      var tableUsername = $(this).find(".col-person-2").text().trim();

      // So sánh src của ảnh trong feedback-item với src của ảnh trong table-person-content
      if (tableImgSrc === imageSrc) {
        usernamefeedback = tableUsername;
      }
    });

    $("#feedbackModalImage").attr("src", imageSrc);
    $("#feedback-user-name").text(usernamefeedback);
    $("#feedbackModalDescription").text(description);
    $("#feedbackModal").modal("show");
    feedbackItemId = $(this).closest(".feedback-item");
  });

  $(".btn-send").click(function () {
    feedbackItemId.remove();
    originalItems = $(".feedback-item");
    $(".feedback-modal-content").hide();
    $("#sentTick").removeClass("d-none");
    setTimeout(function () {
      $("#sentTick").addClass("d-none");
    }, 5000);
    setTimeout(function () {
      $("#feedbackModal").modal("hide");
    }, 5000);
  });

  $("#feedbackModal").on("hidden.bs.modal", function () {
    $(".feedback-modal-content").show();
    $("#sentTick").addClass("d-none");
  });
});
