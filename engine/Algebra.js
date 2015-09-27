/**
 * 2D vectors
 * 
 * */
function Vec2(x,y) {
	this.v = [];
	this.v[0] = x;
	this.v[1] = y;

this.zeros = function() {
	this.v[0] = 0;
	this.v[1] = 0;
};
	
};

Vec2.add = function(u, v) {
	var ans = new Vec2(0,0);
	ans.v[0] = u.v[0] + v.v[0];
	ans.v[1] = u.v[1] + v.v[1];
	return ans;
};

Vec2.diff = function(u, v) {
	var ans = new Vec2(0,0);
	ans.v[0] = u.v[0] - v.v[0];
	ans.v[1] = u.v[1] - v.v[1];
	return ans;
};

Vec2.scalarMult = function(s, v) {
	var ans = [];
	ans.v[0] = s * v[0];
	ans.v[1] = s * v[1];
	return ans;
};

Vec2.innerProd = function(u, v) {
	return u.v[0] * v.v[0] + u.v[1] * v.v[1];
};

Vec2.squaredNorm = function(v) {
	return innerProd(v, v);
};

Vec2.myNorm = function(v) {
	return Math.sqrt(squaredNorm(v));
};

Vec2.normalize = function(v) {
	if (v.v[0] !== 0.0 && v.v[1] !== 0.0) {
		return scalarMult(1 / myNorm(v), v);
	} else {
		return v;
	}
};

/**
 * project u on v
 * */

Vec2.proj = function(u, v) {
	var aux = normalize(v);
	var dot = innerProd(u, v);
	return scalarMult(dot, aux);
};

Vec2.pointWiseMult = function(u, v) {
	var ans = [];
	ans.v[0] = u.v[0] * v.v[0];
	ans.v[1] = u.v[1] * v.v[1];
	return ans;
};

/**
 * return product between the matrix formed by (u,v) and x;
 * */

Vec2.matrixProd = function(u, v, x) {
	return add(add(scalarMult(x[0], u), scalarMult(x[1], v)));
};

/**
 * end vectors
 * */


};
