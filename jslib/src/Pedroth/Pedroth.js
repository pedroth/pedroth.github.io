const DomBuilder = require("../DomBuilder/main/DomBuilder");
const WebUtils = require("../WebUtils/WebUtils");
const Card = require("../Card/Card");
//========================================================================================
/*                                                                                      *
 *                                    Pedroth class                                   *
 *                                                                                      */
//========================================================================================

const Pedroth = {
  DomBuilder,
  WebUtils,
  Card
};

//========================================================================================
/*                                                                                      *
 *                                         MAIN                                         *
 *                                                                                      */
//========================================================================================

WebUtils.retrieveAndAppend("/static/nav/nav.html", "root");

// exports
module.exports = Pedroth;
