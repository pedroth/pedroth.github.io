/**
 * Matrix
 */
 /**
	 * 
	 * @param rows
	 *            number of rows of the matrix. Must be a positive integer
	 *            bigger than zero, {1,2, ...}
	 * @param columns
	 *            number of columns of the matrix. Must be a positive integer
	 *            bigger than zero, {1,2, ...}
*/
function Matrix(rows , columns) {
	
	if(rows === undefined)
		rows = 1;
	if(columns === undefined)
		columns = 1;

	this.checkInputIndex = function( x,  y) {
		return x <= this.rows && x > 0 && y <= this.columns && y > 0;
	};

	/**
	 * 
	 * @param x
	 *            index for the rows where its domain is {1,2, ... , number of
	 *            rows}
	 * @param y
	 *            index for the columns where its domain is {1,2, ... , number
	 *            of columns}
	 * @param n
	 *            value to store at x and y.
	 */
	this.setXY = function( x,  y,  n) {
		
		if (this.checkInputIndex(x, y))
			this.matrix[x - 1][y - 1] = n;
		else
			console.log("index out of matrix");
	};

	this.fillZeros = function() {
		for (var i = 1; i <= this.rows; i++) {
			for (var j = 1; j <= this.columns; j++) {
				this.setXY(i, j, 0.0);
			}
		}
	};

	if (rows < 1 && columns < 1) {
			this.rows = 1;
			this.columns = 1;
		} else {
			this.matrix = [[]];
			this.rows = rows;
			this.columns = columns;
			this.fillZeros();
	}

	/**
	 * 
	 * @param x
	 *            index for the rows where its domain is {1,2, ... , number of
	 *            rows}
	 * @param y
	 *            index for the columns where its domain is {1,2, ... , number
	 *            of columns}
	 * @return value of the matrix at x and y.
	 */
	this.getXY = function( x,  y) {
		var r = null;
		if (checkInputIndex(x, y))
			r = this.matrix[x - 1][y - 1];
		else
			console.log("index out of matrix");
		return r;
	};

	this.getMatrix = function() {
		return this.matrix;
	};

	this.setMatrix = function(m) {
		this.rows = m.length;
		this.columns = m[0].length;
		this.matrix = m;
	};

	this.getRows = function() {
		return this.rows;
	};

	this.getColumns = function() {
		return this.columns;
	};

	this.toString = function() {
		 s = "";
		for (var i = 1; i <= this.getRows(); i++) {
			for (var j = 1; j <= this.getColumns(); j++) {
				s = s + String.format(" %.10f\t", this.getXY(i, j));
			}
			s += "\n";
		}
		s += "\n";
		return s;
	};

	this.toMatlab = function() {
		acm = "";
		acm += "[\t";
		for (var i = 1; i <= rows; i++) {
			for (var j = 1; j <= columns; j++) {
				acm += this.getXY(i, j) + ",\t";
			}
			acm += ";\t";
		}
		acm += "]\n";
		return acm;
	};

	

	this.fill = function( x) {
		for (var i = 1; i <= this.getRows(); i++) {
			for (var j = 1; j <= this.getColumns(); j++) {
				this.setXY(i, j, x);
			}
		}
	};

	this.fillRandom = function( xmin,  xmax) {
		for (var i = 1; i <= this.getRows(); i++) {
			for (var j = 1; j <= this.getColumns(); j++) {
				 x = xmin + (xmax - xmin) * Math.random();
				this.setXY(i, j, x);
			}
		}
	};

	this.transpose = function() {
		var m = new Matrix(this.getColumns(), this.getRows());
		for (var i = 1; i <= this.getRows(); i++) {
			for (var j = 1; j <= this.getColumns(); j++) {
				m.setXY(j, i, this.getXY(i, j));
			}
		}
		this.matrix = m.matrix;
		this.rows = m.getRows();
		this.columns = m.getColumns();
	};

	/**
	 * 
	 * @param xmin
	 *            lower bound row coordinate
	 * @param xmax
	 *            upper bound row coordinate
	 * @param ymin
	 *            lower bound column coordinate
	 * @param ymax
	 *            upper bound column coordinate
	 * @return new Matrix which is the subMatrix M[xmin ... xmax ][ymin ...
	 *         ymax]
	 */
	 this.getSubMatrix = function( xmin,  xmax,  ymin,  ymax) {
		var ans;
		if (checkInputIndex(xmin, ymin) && checkInputIndex(xmax, ymax)) {
			ans = new Matrix(xmax - xmin + 1, ymax - ymin + 1);
			for (var i = xmin; i <= xmax; i++) {
				for (var j = ymin; j <= ymax; j++) {
					ans.setXY(i - xmin + 1, j - ymin + 1, this.getXY(i, j));
				}
			}
			return ans;
		} else {
			console.log("index out of matrix");
		}
	};

	/**
	 * 
	 * @param xmin
	 *            lower bound row coordinate
	 * @param xmax
	 *            upper bound row coordinate
	 * @param ymin
	 *            lower bound column coordinate
	 * @param ymax
	 *            upper bound column coordinate
	 * @return new Matrix which is the subMatrix M[xmin ... xmax ][ymin ...
	 *         ymax]
	 */
	this.setSubMatrix = function( xmin,  xmax,  ymin,  ymax,  m) {
		if (checkInputIndex(xmin, ymin) && checkInputIndex(xmax, ymax) && m.rows == (xmax - xmin + 1) && m.columns == (ymax - ymin + 1)) {
			for (var i = xmin; i <= xmax; i++) {
				for (var j = ymin; j <= ymax; j++) {
					this.setXY(i, j, m.getXY(i - xmin + 1, j - ymin + 1));
				}
			}
		} else {
			console.log("index out of matrix or input doesnt fit");
		}
	};

	this.identity = function() {
		this.fillZeros();
		for (var i = 1; i <= this.getRows(); i++) {
			this.setXY(i, i, 1);
		}
	};

	this.copy = function() {
		var r = new Matrix(this.getRows(), this.getColumns());
		for (var i = 1; i <= this.getRows(); i++) {
			for (var j = 1; j <= this.getColumns(); j++) {
				r.setXY(i, j, this.getXY(i, j));
			}
		}
		return r;
	};

	/**
	 * 
	 * @return vector with dimension rows * columns, whose elements are taken
	 *         column-wise.
	 */
	this.toVector = function() {
		var v = new Matrix(this.rows * this.columns, 1);
		for (var j = 1; j <= this.columns; j++) {
			for (var i = 1; i <= this.rows; i++) {
				v.setX(i + (j - 1) * rows, this.getXY(i, j));
			}
		}
		return v;
	};

	this.reshape = function( rows,  columns) {
		var ans;
		if (rows * columns == this.rows * this.columns) {
			ans = new Matrix(rows, columns);
			var v = this.toVector();
			for ( j = 1; j <= columns; j++) {
				for ( i = 1; i <= rows; i++) {
					ans.setXY(i, j, v.getX(i + (j - 1) * rows));
				}
			}
			this.setMatrix(ans.getMatrix());
		} else {
			console.log("not possible reshape, rows * columns differs from original matrix");
		}
	};

	this.concat = function(m) {
		var ans = null;
		if (m.rows == this.rows) {
			ans = new Matrix(rows, columns + m.columns);
			ans.setSubMatrix(1, rows, 1, columns, this);
			ans.setSubMatrix(1, rows, columns + 1, columns + m.columns, m);
		} else if (this.rows === 0) {
			ans = m.copy();
		} else if (m.rows === 0) {
			// do nothing
		} else {
			console.log("rows of two matrices must be equal");
		}
		return ans;
	};

	this.applyFunction = function( f ) {
		for (var i = 1; i <= this.getRows(); i++) {
			for (var j = 1; j <= this.getColumns(); j++) {
				var x = this.getXY(i, j);
				var y = f.compute(x);
				this.setXY(i, j, y);
			}
		}
	};

};
	/**
	 * static
	 */

	/**
	 * 
	 * @param a
	 *            n * m matrix
	 * @param b
	 *            n * m matrix
	 * @return the sum of matrix a and b if input correct null otherwise
	 */
	 Matrix.add = function( a,  b) {
		var c = null;
		var r = 0;
		if (a.getRows() == b.getRows() && a.getColumns() == b.getColumns()) {
			c = new Matrix(a.getRows(), a.getColumns());
			for ( j = 1; j <= a.getColumns(); j++) {
				for ( i = 1; i <= a.getRows(); i++) {
					r = a.getXY(i, j) + b.getXY(i, j);
					c.setXY(i, j, r);
				}
			}
		}
		return c;
	};

	/**
	 * 
	 * @param a
	 *            n * m matrix
	 * @param b
	 *            n * m matrix
	 * @return the subtraction of matrix a and b if input correct null otherwise
	 */
	Matrix.diff = function(a,  b) {
		var r;
		r = Matrix.scalarProd(-1, b);
		r = Matrix.add(a, r);
		return r;
	};

	/**
	 * 
	 * @param r
	 *            scalar
	 * @param m
	 *            matrix
	 * @return matrix multiplied by r
	 */
	Matrix.scalarProd = function( r, m) {
		var temp = m.copy();
		temp.applyFunction(function(x){
			return r * x;
		});
		return temp;
	};

	/**
	 * 
	 * @param a
	 *            n * m matrix
	 * @param b
	 *            m * l matrix
	 * @return return a * b if they fulfill the constraints
	 */
	 Matrix.prod = function( a,  b) {
		var c = null;
		var sumIdentity;
		if (a.getColumns() == b.getRows()) {
			c = new Matrix(a.getRows(), b.getColumns());
			for ( j = 1; j <= a.getRows(); j++) {
				for ( k = 1; k <= b.getColumns(); k++) {
					sumIdentity = 0;
					for ( i = 1; i <= a.getColumns(); i++) {
						prod = a.getXY(j, i) * b.getXY(i, k);
						sumIdentity = sumIdentity + prod;
					}
					c.setXY(j, k, sumIdentity);
				}
			}
		} else {
			console.log("the number of columns of the first matrix must be equal to the number of lines of the second one");
		}
		return c;
	};

	Matrix.transpose = function( m) {
		var ans = m.copy();
		ans.transpose();
		return ans;
	};
	
	
	function test() {
	    var matrix = new Matrix();
	    matrix.setMatrix([[1,2],[3,4]]);
	    var prodM = Matrix.prod(matrix,matrix);
	    console.log(matrix);
	}

	test();