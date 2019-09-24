const Function = function(f) {
  this.f = f;
};

Function.prototype.compose = function(g) {
  return new Function(x => this.f(g(x)));
};

Function.prototype.leftCompose = function(g) {
  return new Function(x => g(this.f(x)));
};

Function.prototype.apply = function(x) {
  return this.f(x);
};

Function.prototype.get = function() {
  return this.f;
};

Function.of = function(f) {
  return new Function(f);
};

module.exports = Function;
