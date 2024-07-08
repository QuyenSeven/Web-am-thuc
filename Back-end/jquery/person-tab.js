function renderPageNumbers() {
  sortOnlineUsersFirst();
  var totalItemsInTable = $(".table-person tbody tr").length;
  // Lấy giá trị của select-box
  var selectValue = parseInt($(".person-select-form").val());

  // Tính toán tổng số mục để hiển thị
  var totalItems =
    selectValue > totalItemsInTable ? totalItemsInTable : selectValue;

  var totalPages = Math.ceil(totalItems / 5);
  // Hiển thị số trang và tạo nút chuyển trang
  $("#personPageNumbers").empty();
  for (var i = 1; i <= totalPages; i++) {
    $("#personPageNumbers").append(
      "<button class='btn btn-person-page' data-personPageNum=" +
        i +
        ">" +
        i +
        "</button>"
    );
  }

  // Hiển thị trang đầu tiên khi trang được tải
  showPage(1);

  // Xử lý khi người dùng chọn một trang mới
  $(".btn-person-page").click(function () {
    var pageNum = parseInt($(this).text());
    showPage(pageNum);
    $(".btn-person-page").removeClass("active");
    $(this).addClass("active");
  });

  // Hiển thị các mục tương ứng với trang đã chọn
  function showPage(pageNum) {
    $(".table-person tbody tr").hide();
    var startIndex = (pageNum - 1) * 5;
    var endIndex = startIndex + 5;
    $(".table-person tbody tr").slice(startIndex, endIndex).show();
    $(".btn-person-page").removeClass("active");

    // Thêm lớp nhấn mạnh lên nút btn-page tương ứng
    var pageButton = $(
      ".btn-person-page[data-personPageNum='" + pageNum + "']"
    );
    pageButton.addClass("active");
  }

  // Hiển thị số trang và nhấn mạnh trang hiện tại

  $("#nextBtn").click(function () {
    var currentPage = parseInt($(".btn-person-page.active").text());
    var totalPages = parseInt($("#personPageNumbers").children().last().text());
    if (currentPage < totalPages) {
      $(".btn-person-page.active").next().click();
    }
  });

  // Sự kiện lắng nghe khi nhấn vào nút Previous
  $("#prevBtn").click(function () {
    var currentPage = parseInt($(".btn-person-page.active").text());
    if (currentPage > 1) {
      $(".btn-person-page.active").prev().click();
    }
  });
}

function checkEmptyPersonTable() {
  // Lấy số lượng dòng trong tbody của bảng
  var rowCount = $(".table-person-content tr").length;

  // Lấy thẻ span chứa thông báo bảng trống
  var emptyMsg = $(".empty-person-table-msg");

  // Kiểm tra số lượng dòng
  if (rowCount === 0) {
    // Nếu bảng trống, hiển thị thông báo
    emptyMsg.show();
  } else {
    // Nếu không trống, ẩn thông báo
    emptyMsg.hide();
  }
}

// Auto sort online
function sortOnlineUsersFirst() {
  // Lấy tất cả các hàng trong tbody
  var rows = $(".table-person-content tr").get();

  // Sắp xếp các hàng dựa trên trạng thái (Online/Offline)
  rows.sort(function (a, b) {
    var statusA = $(a).find(".col-person-4").text().toLowerCase();
    var statusB = $(b).find(".col-person-4").text().toLowerCase();

    // Đưa người dùng Online lên đầu
    if (statusA === "online" && statusB !== "online") {
      return -1;
    } else if (statusA !== "online" && statusB === "online") {
      return 1;
    } else {
      return 0;
    }
  });

  // Đặt lại thứ tự của các hàng trong tbody
  $.each(rows, function (index, row) {
    $(".table-person-content").append(row);
  });
}

$(document).ready(function () {
  checkEmptyPersonTable();
  var originalTableBody = $(".table-person-content tbody").clone();
  $(".person-select-form").on("change", function () {
    renderPageNumbers(); // Render lại số trang khi số lượng hiển thị thay đổi
  });
  $("#person-search-input").on("keyup", function () {
    $(".btn-br").addClass("d-none");
    var searchText = removeDiacritics($(this).val().toLowerCase());
    if (searchText === "") {
      $(".table-person tbody tr").show();
      $(".btn-br").removeClass("d-none");
      renderPageNumbers(); // Nếu ô tìm kiếm rỗng, hiển thị tất cả các hàng
    } else {
      $(".table-person tbody tr").each(function () {
        var text = removeDiacritics($(this).text().toLowerCase());
        $(this).toggle(text.indexOf(searchText) > -1);
      });
    }
  });
  renderPageNumbers();

  $(".btn-person-sort").on("click", function () {
    var rows = $(".table-person-content tr").get();

    // Sort rows by the second column (Tên người dùng)
    var collator = new Intl.Collator("vi"); // Tạo một đối tượng Collator cho tiếng Việt
    rows.sort(function (a, b) {
      // Sắp xếp các hàng dựa trên nội dung của cột tên
      var nameA = $(a).find(".col-person-2").text().split(" "); // Tách chuỗi tên thành mảng họ, đệm và tên
      var nameB = $(b).find(".col-person-2").text().split(" "); // Tách chuỗi tên thành mảng họ, đệm và tên
      // So sánh theo tên
      var compareResult = collator.compare(
        nameA[nameA.length - 1],
        nameB[nameB.length - 1]
      );
      if (compareResult !== 0) {
        return compareResult;
      }
      // So sánh theo họ
      compareResult = collator.compare(nameA[0], nameB[0]);
      if (compareResult !== 0) {
        return compareResult;
      }
      // So sánh theo đệm
      if (nameA.length > 2 && nameB.length > 2) {
        // Kiểm tra nếu có đủ đệm
        compareResult = collator.compare(nameA[1], nameB[1]);
        if (compareResult !== 0) {
          return compareResult;
        }
      }
      // Nếu các thành phần trước đều giống nhau, trả về 0
      return 0;
    });
    $.each(rows, function (index, row) {
      // Đặt lại thứ tự của các hàng trong tbody
      $(".table-person-content").append(row);
    });
    renderPageNumbers();
  });

  $(".table-person-content").on("click", ".infor-btn", function () {
    const row = $(this).closest("tr");
    const userImage = row.find("td").eq(0).find("img").attr("src");
    const userName = row.find("td").eq(1).text();
    const userEmail = row.find("td").eq(2).text();
    const headerColor = $(this).data("header-color");
    console.log(headerColor);

    $("#modalUserImage").attr("src", userImage);
    $("#modalUserName").text(userName);
    $("#modalUserEmail").text(`Email: ${userEmail}`);
    $(".modal-header")
      .removeClass("modal-header-1 modal-header-2 modal-header-3")
      .addClass(headerColor);
  });

  $(".table-person-content").on("click", ".remove-btn", function () {
    // Lấy dòng chứa nút được nhấn
    var row = $(this).closest("tr");

    // Xóa dòng đó khỏi bảng
    row.remove();
    renderPageNumbers();
    checkEmptyPostTable();
  });
});
