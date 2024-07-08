$(".change-tab").click(function (e) {
  e.preventDefault();
  var targetPaneId = $(this).data("target");
  var targetTab = $(".nav-link[data-bs-target='" + targetPaneId + "']");
  $(".tab-pane").removeClass("show active");
  $(targetPaneId).addClass("show active");
  changeTab(targetTab);
  switch (targetPaneId) {
    case "#v-pills-home":
      loadTabContent(
        "#v-pills-home",
        "../home-tab.html",
        "../jquery/home-tab.js"
      );
      break;
    case "#v-pills-category":
      loadTabContent(
        "#v-pills-category",
        "../category-tab.html",
        "../jquery/category-tab.js"
      );
      break;
    case "#v-pills-post":
      loadTabContent(
        "#v-pills-post",
        "../post-tab.html",
        "../jquery/post-tab.js"
      );
      break;
    case "#v-pills-person":
      loadTabContent(
        "#v-pills-person",
        "../person-tab.html",
        "../jquery/person-tab.js"
      );
      break;
    case "#v-pills-notification":
      loadTabContent(
        "#v-pills-notification",
        "../notification-tab.html",
        "../jquery/notification-tab.js"
      );
      break;
  }
});
