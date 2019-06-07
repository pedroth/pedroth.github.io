/**
 *
 * @param {*} opt1
 * @param {*} opt2
 * @param {*} predicate predicate is a function: (opt1, opt2) => {true, false}
 */
const Choice = function(left, right) {
  this.left = left;
  this.right = right;
  this.predicate = () => true;
};

Choice.prototype.chooseLeftIf = function(predicate) {
  this.predicate = predicate;
  return this;
};

Choice.prototype.get = function() {
  if (this.predicate(this.left, this.right)) return this.left;
  return this.right;
};

Choice.of = function(left, right) {
  return new Choice(left, right);
};

module.exports = Choice;
