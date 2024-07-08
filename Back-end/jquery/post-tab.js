function renderPostPageNumbers() {
  var totalItemsInTable = $(".table-fixed tbody tr").length;
  // Lấy giá trị của select-box
  var selectValue = parseInt($(".form-select-post").val());

  // Tính toán tổng số mục để hiển thị
  var totalItems =
    selectValue > totalItemsInTable ? totalItemsInTable : selectValue;

  var totalPages = Math.ceil(totalItems / 5);
  // Hiển thị số trang và tạo nút chuyển trang
  $("#pageNumbers").empty();
  for (var i = 1; i <= totalPages; i++) {
    $("#pageNumbers").append(
      "<button class='btn btn-page' data-pageNum=" + i + ">" + i + "</button>"
    );
  }

  // Hiển thị trang đầu tiên khi trang được tải
  showPage(1);

  // Xử lý khi người dùng chọn một trang mới
  $(".btn-page").click(function () {
    var pageNum = parseInt($(this).text());
    showPage(pageNum);
    $(".btn-page").removeClass("active");
    $(this).addClass("active");
  });

  // Hiển thị các mục tương ứng với trang đã chọn
  function showPage(pageNum) {
    $(".table-fixed tbody tr").hide();
    var startIndex = (pageNum - 1) * 5;
    var endIndex = startIndex + 5;
    $(".table-fixed tbody tr").slice(startIndex, endIndex).show();
    $(".btn-page").removeClass("active");

    // Thêm lớp nhấn mạnh lên nút btn-page tương ứng
    var pageButton = $(".btn-page[data-pageNum='" + pageNum + "']");
    pageButton.addClass("active");
  }

  // Hiển thị số trang và nhấn mạnh trang hiện tại

  $("#btnNext").click(function () {
    var currentPage = parseInt($(".btn-page.active").text());
    var totalPages = parseInt($("#pageNumbers").children().last().text());
    if (currentPage < totalPages) {
      $(".btn-page.active").next().click();
    }
  });

  // Sự kiện lắng nghe khi nhấn vào nút Previous
  $("#btnPrev").click(function () {
    var currentPage = parseInt($(".btn-page.active").text());
    if (currentPage > 1) {
      $(".btn-page.active").prev().click();
    }
  });
}

function checkEmptyPostTable() {
  // Lấy số lượng dòng trong tbody của bảng
  var rowCount = $(".table-content tr").length;

  // Lấy thẻ span chứa thông báo bảng trống
  var emptyMsg = $(".empty-table-msg");

  // Kiểm tra số lượng dòng
  if (rowCount === 0) {
    // Nếu bảng trống, hiển thị thông báo
    emptyMsg.show();
  } else {
    // Nếu không trống, ẩn thông báo
    emptyMsg.hide();
  }
}

$(document).ready(function () {
  checkEmptyPostTable();
  var originalTableBody = $(".table-content tbody").clone();
  $(".form-select-post").on("change", function () {
    renderPostPageNumbers(); // Render lại số trang khi số lượng hiển thị thay đổi
  });
  $("#search-input-post").on("keyup", function () {
    $(".btn-br").addClass("d-none");
    var searchText = removeDiacritics($(this).val().toLowerCase());
    if (searchText === "") {
      $(".table-fixed tbody tr").show();
      $(".btn-br").removeClass("d-none");
      renderPostPageNumbers(); // Nếu ô tìm kiếm rỗng, hiển thị tất cả các hàng
    } else {
      $(".table-fixed tbody tr").each(function () {
        var text = removeDiacritics($(this).text().toLowerCase());
        $(this).toggle(text.indexOf(searchText) > -1);
      });
    }
  });
  renderPostPageNumbers();

  function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = $(".table-content");
    switching = true;
    /* Make a loop that will continue until
      no switching has been done: */
    while (switching) {
      switching = false;
      rows = table.find("tr");
      /* Loop through all table rows (except the
        first, which contains table headers): */
      for (i = 1; i < rows.length - 1; i++) {
        shouldSwitch = false;
        /* Get the two elements you want to compare,
          one from current row and one from the next: */
        var namesX = $(rows[i])
          .find("td.column-1")
          .text()
          .toLowerCase()
          .split(" ");
        var firstNameX = namesX[0];
        var lastNameX = namesX[1];
        var dateX = new Date($(rows[i]).find("td.column-2").text());

        var namesY = $(rows[i + 1])
          .find("td.column-1")
          .text()
          .toLowerCase()
          .split(" ");
        var firstNameY = namesY[0];
        var lastNameY = namesY[1];
        var dateY = new Date(
          $(rows[i + 1])
            .find("td.column-2")
            .text()
        );

        /* Compare last name */
        if (
          lastNameX > lastNameY ||
          (lastNameX === lastNameY && firstNameX > firstNameY)
        ) {
          shouldSwitch = true;
          break;
        }

        /* If last names are equal, compare dates */
        if (
          lastNameX === lastNameY &&
          firstNameX === firstNameY &&
          dateX > dateY
        ) {
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
          and mark the switch as done: */
        $(rows[i]).insertAfter($(rows[i + 1]));
        switching = true;
      }
    }
    // Sau khi sắp xếp xong, gọi lại hàm renderPageNumbers để phân trang lại
    renderPostPageNumbers();
  }

  // Xử lý sự kiện khi nhấn nút sắp xếp
  $(".btn-sort").click(function () {
    sortTable();
  });

  $(".table-content").on("click", ".approve-btn", function () {
    // Lấy dòng của nút được nhấn
    var row = $(this).closest("tr");

    // Lấy dữ liệu từ các ô trong dòng đó
    var nguoiDang = row.find(".column-1").text();
    var tieuDe = row.find(".column-3").text();
    var ngayDang = row.find(".column-2").text();

    // Tạo phần tử category-item mới
    var newCategoryItem = `
        <div class="row category-item">
          <!-- Content Part 1 -->
          <div class="row">
            <div class="col-2">
              <img
                src="./assets/img/category/pho-bo-bap-hoa-500.jpg"
                alt="Image"
                class="img-fluid m-3"
                data-src="#"
              />
            </div>
            <div class="col-7">
              <div>
                <h4 class="text-item mt-2">${tieuDe}</h4>
                <p class="desc-item">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Libero et illo optio dolor omnis ipsam deleniti nam,
                  molestias voluptas incidunt, animi at nostrum mollitia
                  similique laborum? Hic tenetur molestias dolore!
                </p>
              </div>
            </div>
            <div class="col-3 mt-auto text-end">
              <a href="#" class="text-decoration-none link-custom footer-tr fs-6 link-desc">
                xem tất cả
                <i class="fas fa-angle-double-right"></i>
              </a>
            </div>
          </div>
  
          <!-- Content Part 2 -->
          <div class="row mt-3 category-contact">
            <div class="col-2">
              <span class="poster">Người đăng: ${nguoiDang}</span>
              <span class="date-post" style="display: none">${ngayDang}</span>
            </div>
            <div class="col-2">
              <span>Lượt thích: 143,958</span>
            </div>
            <div class="col-2">
              <span>Số lượt xem: 158,462</span>
            </div>
          </div>
        </div>
      `;

    // Thêm phần tử mới vào container
    $(".category-content-first").prepend(newCategoryItem);
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
    // Xóa dòng đã phê duyệt khỏi bảng
    row.remove();
    checkEmptyPostTable();
    renderPostPageNumbers();
  });

  $(".table-content").on("click", ".delete-btn", function () {
    // Lấy dòng chứa nút được nhấn
    var row = $(this).closest("tr");

    // Xóa dòng đó khỏi bảng
    row.remove();
    renderPostPageNumbers();
    checkEmptyPostTable();
  });
});

$(document).ready(function () {
  $(".table-content").on("click", ".xem-btn", function () {
    var row = $(this).closest("tr");
    console.log("complete");
    var username = row.find(".column-1").text().trim();
    console.log(username);
    var title = row.find(".column-3").text().trim();
    var date = row.find(".column-2").text().trim();
    var userImageSrc = getUserImage(username);

    $("#user-name").text(username);
    $("#user-image").attr("src", userImageSrc);
    $("#title-detail").text(title);
    $("#post-date").text("Ngày đăng: " + date);

    $("#post-tab-content").removeClass("d-flex").hide();
    $("#user-post").show();
  });

  $("#back-post-button").click(function () {
    $("#user-post").hide();
    $("#post-tab-content").addClass("d-flex").show();
  });
});

function getUserImage(username) {
  var userImageSrc = "";
  $(".table-person-content tr").each(function () {
    var personUsername = $(this).find(".col-person-2").text().trim();
    var imgSrc = $(this).find(".col-person-1 img").attr("src");
    if (personUsername === username) {
      userImageSrc = imgSrc;
      return false; // Break the loop once a match is found
    }
  });

  return userImageSrc;
}
