// Utils.js imported in index.js
// DomBuilder.js imported in index.js
// WebUtils.js imported in index.js
const { getCardGrid } = Utils;
//========================================================================================
/*                                                                                      *
 *                                         MAIN                                         *
 *                                                                                      */
//========================================================================================

(() => {
  WebUtils.readDb().then(db => {
    DomBuilder.ofId("results").append(getCardGrid(WebUtils.sortDb(db)));
  });
})();
