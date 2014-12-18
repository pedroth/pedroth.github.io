/**
 * 2D vectors
 * 
 * */
function Vec2(x,y) {
	this.v = [];
	this.v[0] = x;
	this.v[1] = y;

this.zeros = function(){
	this.v[0] = 0;
	this.v[1] = 0;
};	

this.add = function(u, v) {
	var ans = new Vec2(0,0);
	ans.v[0] = u.v[0] + v.v[0];
	ans.v[1] = u.v[1] + v.v[1];
	return ans;
};

this.diff = function(u, v) {
	var ans = new Vec2(0,0);
	ans[0] = u.v[0] - v.v[0];
	ans[1] = u.v[1] - v.v[1];
	return ans;
};

this.scalarMult = function(s, v) {
	var ans = [];
	ans[0] = s * v[0];
	ans[1] = s * v[1];
	return ans;
};

this.innerProd = function(u, v) {
	return u[0] * v[0] + u[1] * v[1];
};

this.squaredNorm = function(v) {
	return innerProd(v, v);
};

this.myNorm = function(v) {
	return Math.sqrt(squaredNorm(v));
};

this.normalize = function(v) {
	if (v[0] !== 0.0 && v[1] !== 0.0) {
		return scalarMult(1 / myNorm(v), v);
	} else {
		return v;
	}
};

/**
 * project u on v
 * */

this.proj = function(u, v) {
	var aux = normalize(v);
	var dot = innerProd(u, v);
	return scalarMult(dot, aux);
};

this.pointWiseMult = function(u, v) {
	var ans = [];
	ans[0] = u[0] * v[0];
	ans[1] = u[1] * v[1];
	return ans;
};

/**
 * return product between the matrix formed by (u,v) and x;
 * */

this.matrixProd = function(u, v, x) {
	return add(add(scalarMult(x[0], u), scalarMult(x[1], v)));
};

/**
 * end vectors
 * */
};
