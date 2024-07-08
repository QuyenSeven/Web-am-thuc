$(document).ready(function () {
  checkEmptyCategory();
  var selectedItem = null; // Biến để lưu trữ mục danh mục được chọn

  $(".category-item").click(function () {
    if (selectedItem !== null) {
      $(selectedItem).removeClass("selected"); // Loại bỏ lớp selected từ mục danh mục trước đó
    }
    selectedItem = this; // Lưu trữ mục danh mục được chọn vào biến
    $(this).addClass("selected"); // Thêm lớp selected cho mục danh mục được click
  });

  // Search-category

  $("#search-input").on("keyup", function () {
    var value = removeDiacritics($(this).val().toLowerCase());
    $(".category-item").filter(function () {
      var text = removeDiacritics($(this).text().toLowerCase());
      $(this).toggle(text.indexOf(value) > -1);
    });

    // Check if there are any visible items left
    if ($(".category-item:visible").length === 0) {
      $(".empty-message").show();
    } else {
      $(".empty-message").hide();
    }
  });

  // Xoá danh mục

  $(".btn-xoa").click(function () {
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
    if (!$(event.target).closest(".category-item").length) {
      if (selectedItem !== null) {
        $(selectedItem).removeClass("selected"); // Loại bỏ lớp selected từ mục danh mục hiện tại
        selectedItem = null; // Đặt lại biến selectedItem thành null
      }
    }
  });

  $(".btn-them-moi").click(function () {
    $(".scrollable-content").hide(); // Ẩn đi nội dung hiện tại của tab
    $(".new-item").show(); // Hiển thị biểu mẫu khi click vào nút "Thêm mới"
    $("#detailed-view").hide();
  });
  // Bắt sự kiện click vào nút "Thêm"

  // Lắng nghe sự kiện click của nút hủy

  $('button[data-bs-toggle="pill"]').on("click", function () {
    $(".new-item").hide(); // Ẩn form khi chuyển tab

    $(".category-content-first").show();
  });
});

$(document).ready(function () {
  $("#item-form")
    .off("submit")
    .on("submit", function (event) {
      event.preventDefault(); // Ngăn chặn form submit mặc định

      // Lấy giá trị từ các trường input
      var title = $("#item-title").val();
      var imageCaption = $("#image-caption").val();
      var description = $("#item-description").val();

      var file = $("#item-image")[0].files[0]; // Lấy file được chọn

      var reader = new FileReader(); // Tạo đối tượng FileReader

      // Đọc dữ liệu từ file
      reader.readAsDataURL(file);

      // Xử lý khi hoàn thành đọc file
      reader.onload = function () {
        var imageUrl = reader.result; // Lấy URL của file

        // Tạo HTML mới cho mục mới
        var newItemHtml = `
                  <div class="row category-item">
                      <div class="row">
                          <div class="col-2">
                              <img src="${imageUrl}" id="image-url" data-src="#" alt="Image" class="img-fluid m-3" />
                          </div>
                          <div class="col-7">
                              <div>
                                  <h4 class="text-item mt-2">${title}</h4>
                                  <p class="desc-item">${description}</p>
                              </div>
                          </div>
                          <div class="col-3 mt-auto text-end">
                              <a href="#" class="text-decoration-none link-custom footer-tr fs-6 link-desc">xem tất cả <i class="fas fa-angle-double-right"></i></a>
                          </div>
                      </div>
                      <div class="row mt-3 category-contact">
                          <div class="col-2"><span class="poster">Người đăng: Thích VietFood</span></div>
                          <div class="col-2"><span>Lượt thích: 0</span></div>
                          <div class="col-2"><span>Số lượt xem: 0</span></div>
                      </div>
                  </div>
              `;

        // Thêm HTML mới vào phần nội dung chính
        $(".category-content-first").prepend(newItemHtml);

        // Ẩn form đi
        $(".new-item").hide();
        $(".category-content-first").show();

        // Xoá giá trị trong các trường input
        $("#item-title").val("");
        $("#image-caption").val("");
        $("#item-description").val("");
        $("#item-image").val(""); // Xoá giá trị của input file để người dùng có thể chọn file mới

        $(".category-item").click(function () {
          $(".category-item.selected").removeClass("selected"); // Loại bỏ lớp selected từ mục danh mục trước đó
          $(this).addClass("selected"); // Thêm lớp selected cho mục danh mục được click
        });
        $("body").on("click", function (event) {
          // Kiểm tra xem phần tử được click có thuộc vào class "category-item" hay không
          if (!$(event.target).closest(".category-item").length) {
            // Nếu không, loại bỏ lớp "selected" từ tất cả các mục danh mục
            $(".category-item.selected").removeClass("selected");
          }
        });

        //Xoá
        $(".btn-xoa").click(function () {
          $(".category-item.selected").remove();
          checkEmptyCategory();
        });
        checkEmptyCategory();
      };
    });
  $(".btn-huy-form").on("click", function () {
    $(".new-item").hide(); // Ẩn form
    $(".category-content-first").show();
  });
});

function showDetailedView(title, imageSrc, caption, description) {
  $("#detailed-title").text(title);
  $("#detailed-image").attr("src", imageSrc);
  $("#detailed-caption").text(caption);
  $("#detailed-description").text(description);
  $(".scrollable-content").hide();
  $("#detailed-view").show();
}

function showCategoryContent() {
  $(".scrollable-content").show();
  $("#detailed-view").hide();
}

function showAlternateView() {
  $(".scrollable-content").hide();
  $("#user-detail").show();
}

$(document).ready(function () {
  $(document).on("click", ".link-desc", function (event) {
    event.preventDefault();
    const categoryItem = $(this).closest(".category-item");

    // Extract the poster name and remove the "Người đăng:" prefix
    let poster = categoryItem.find(".poster").text().trim();
    poster = poster.replace("Người đăng: ", "").trim();

    if (poster === "Thích VietFood") {
      const title = categoryItem.find(".text-item").text();
      const image = categoryItem.find("img");
      const imageSrc = image.attr("src");
      const caption = image.attr("alt");
      const description = categoryItem.find(".desc-item").text();

      showDetailedView(title, imageSrc, caption, description);
    } else {
      showAlternateView();
    }
  });
  $(document).on("click", "#back-button", function () {
    showCategoryContent();
  });
});
