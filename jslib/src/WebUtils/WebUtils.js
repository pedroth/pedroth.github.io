import { Sort, ArrayUtils } from "nabla.js";
import $ from "jquery";

const WebUtils = {};

WebUtils.retrieveAndAppend = async function(url, htmlId) {
  console.log(`Reading from ${url}.. appending on ${htmlId}`);
  const html = await fetch(url).then(x => x.text());
  $(`#${htmlId}`).html(html);
  /**
   * We have to use jquery to run <script> tags in html, vanilla js doesn't work.
   * vanilla js: document.getElementById(htmlId).innerHTML = html;
   * jquery does some processing to the innerHTML string
   */
};

WebUtils.readDb = async function() {
  const time = new Date().getTime();
  if (!localStorage.db || time - localStorage.db.time > TIME2UPDATE_MILLIS) {
    const dbJson = await fetch("resources/db/db.json").then(x => x.json());
    localStorage.db = JSON.stringify({ time: time, data: dbJson });
  }
  return JSON.parse(localStorage.db).data;
};

WebUtils.sortDb = function(db) {
  return Sort.quicksort(
    db.posts,
    (a, b) => date2int(a.date) - date2int(b.date) < 0
  );
};

WebUtils.randomDb = function(db) {
  return ArrayUtils.randomPermute(db.posts);
};

WebUtils.searchDb = db => searchTerm => {};

export default WebUtils;

//========================================================================================
/*                                                                                      *
 *                                   Private functions                                  *
 *                                                                                      */
//========================================================================================

function date2int(date) {
  var dateStrs = date.split("/");
  var acm = 0;
  var ide = 1;
  for (var j = 0; j < dateStrs.length; j++) {
    acm += parseFloat(dateStrs[j]) * ide;
    ide *= 100;
  }
  return acm;
}

const TIME2UPDATE_MILLIS = 24 * 3.6e3 * 1e3; // one day in millis;
