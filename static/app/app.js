function getApp(url) {
  console.log("Getting app...", url);
  const div2append = document.getElementById("appContainer");
  const split = url.split("=");
  if (split.length <= 1) {
    WebUtils.renderHtml("static/notFound.html", div2append);
  } else {
    WebUtils.renderNablaDown(split[1], div2append);
  }
}
getApp(window.location.href);
