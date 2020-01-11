function getApp(url) {
  console.log("Getting app...", url);
  const firstSplit = url.split("?");
  const secondSplit = firstSplit[1].split("=");
  const slashSplit = secondSplit[1].split("/");
  const filename = slashSplit[slashSplit.length - 1];
  const finalSrc =
    slashSplit.length > 1
      ? `${secondSplit[1]}/${filename}`
      : `resources/templates/${filename}`;
  VisualExp.retrieveAndAppend(`${finalSrc}.html`, "appContainer");
}
getApp(window.location.href);
