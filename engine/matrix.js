/**
 * The type Matrix.
 */
function Matrix(rows, columns) {
    /**
     * Number of rows
     */
    this.rows = 0;
    /**
     * Number of columns
     */
    this.columns = 0;
    this.matrix = [];

    if (rows < 0 && columns < 0) {
            console.log("number of rows and columns must be positive integers");
            return;
    }
    if (rows > 0 && columns > 0) {
        this.constructMatrix(rows,columns);
        this.fillZeros();
    }
}


    /**
     * build a matrix with a two dimensional array
     *
     * @param m 2-dim array
     */
    Matrix.prototype.buildMatrixWith2Array = function(m) {
        constructMatrix(m.length, m[0].length);
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                this.setXY(i , j , m[i][j]);
            }
        }
    }

    /**
     * Build a matrix from a set of column vectors
     *
     * @param v the v
     */
     Matrix.prototype.buildVectorwithArray = function(v) {
        constructMatrix(v.length, 1);
        for (var i = 0; i < this.rows; i++) {
                this.setXY(i , 0, v[i]);
        }
    }
    
    Matrix.prototype.constructMatrix = function(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.matrix = new Float64Array[rows * columns];
    }

     /**
     * Copy matrix.
     *
     * @return the matrix
     */
    Matrix.prototype.copy = function() {
        Matrix r = new Matrix(this.getRows(), this.getColumns());
        for (var i = 1; i <= this.getRows(); i++) {
            for (var j = 1; j <= this.getColumns(); j++) {
                r.setXY(i, j, this.getXY(i, j));
            }
        }
        return r;
    }

    /**
     * Gets xY.
     *
     * @param x index for the rows where its domain is
     *          {
     *          1,2, ... , number of
     *          rows
     *          }
     * @param y index for the columns where its domain is
     *          {
     *          1,2, ... , number
     *          of columns
     *          }
     * @return value of the matrix at x and y.
     */
    Matrix.prototype.getXY = function(x, y) {
        var r;
        if (checkInputIndex(x, y)) {
            r = matrix[y + columns * x];
        }
        else {
            console.log("index out of matrix. (x,y) : ( " + x + " , " + y + " )");
            return;
        }
        return r;
    }

    /**
     * Sets xY.
     *
     * @param x index for the rows where its domain is
     *          {
     *          1,2, ... , number of
     *          rows
     *          }
     * @param y index for the columns where its domain is
     *          {
     *          1,2, ... , number
     *          of columns
     *          }
     * @param n value to store at x and y.
     */
    Matrix.prototype.setXY = function(x, y, n) {
        if (checkInputIndex(x, y)) {
            matrix[y + columns * x] = n;
        } else {
            console.log("index out of matrix");
        }
    }

    /**
     * generates a new double array with matrix information
     *
     * @return the double [ ] [ ]
     */
    Matrix.prototype.getMatrix = function() {
        var ans = [[]];
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                ans[i][j] = this.getXY(i, j);
            }
        }
        return ans;
    }

    /**
     * Gets rows.
     *
     * @return the rows
     */
    Matrix.prototype.getRows = function() {
        return this.rows;
    }

    /**
     * Gets columns.
     *
     * @return the columns
     */
    Matrix.prototype.getColumns = function() {
        return this.columns;
    }

    /**
     * Prod vector.
     *
     * @param v the v
     * @return the vector
     */
    Matrix.prototype.prodVector = function(v) {
        if (this.getColumns() != v.getDim()) {
            console.log("Matrix columns must be the same as vector dimension");
            return;
        }
        var rows = this.getRows();
        // defensive copy
        var ans = new Matrix(this.rows, 1);
        for (var i = 0; i < rows; i++) {
            double acc = 0;
            for (var j = 0; j < this.getColumns(); j++) {
                acc += this.getXY(i, j) * v.getXY(j, 1);
            }
            ans.setX(i + 1, acc);
        }
        return ans;
    }

    /**
     * Prod matrix.
     *
     * @param b the b
     * @return the matrix
     */
    Matrix.prototype.prod = function(b) {
        var c;
        var sumIdentity = 0;
        if (this.getColumns() == b.getRows()) {
            c = new Matrix(this.getRows(), b.getColumns());
            for (var j = 1; j <= this.getRows(); j++) {
                for (var k = 1; k <= b.getColumns(); k++) {
                    sumIdentity = 0;
                    for (var i = 1; i <= this.getColumns(); i++) {
                        double prod = this.getXY(j, i) * b.getXY(i, k);
                        sumIdentity = sumIdentity + prod;
                    }
                    c.setXY(j, k, sumIdentity);
                }
            }
        } else {
            console.log("the number of columns of the first matrix must be equal to the number of lines of the second one");
        }
        return c;
    }

    /**
     * 
     * @param b is a matrix with the same size as 'this'.
     * @return a matrix with the same size as 'this' and b result of the operator(this, b)
     */
    Matrix.prototype.binaryOperation = function(b, operator) {
        var c;
        var r;
        if (this.getRows() == b.getRows() && this.getColumns() == b.getColumns()) {
            c = new Matrix(this.getRows(), this.getColumns());
            for (var j = 0; j < this.getColumns(); j++) {
                for (var i = 0; i < this.getRows(); i++) {
                    r = operator(this.getXY(i, j), b.getXY(i, j));
                    c.setXY(i, j, r);
                }
            }
        }
        return c;
    }

    /**
     * Add matrix.
     *
     * @param b n * m matrix
     * @return the sum of matrix a and b if input correct null otherwise
     */
    Matrix.prototype.add = function(b) {
        this.binaryOperation(b, function(x, y) {return x + y;});
    }

    /**
     * Diff matrix.
     *
     * @param b n * m matrix
     * @return the subtraction of matrix a and b if input correct null otherwise
     */
    Matrix.prototype.diff = function(b) {
        this.binaryOperation(b, function(x, y) {return x - y;});
    }

    /**
     * Apply function.
     *
     * @param f the f
     * @return the matrix
     */
    Matrix.prototype.applyFunction = function(f) {
        var c = this.copy();
        for (var i = 0; i < this.getRows(); i++) {
            for (var j = 0; j < this.getColumns(); j++) {
                double x = this.getXY(i, j);
                double y = f(x);
                c.setXY(i, j, y);
            }
        }
        return c;
    }
    /**
     * Scalar prod.
     *
     * @param r scalar
     * @return matrix multiplied by r
     */
    Matrix.prototype.scalarProd = function(r) {
        return applyFunction( function(x) {return x * r;});
    }

    /**
     * Square norm.
     *
     * @return the Frobenius norm squared
     */
    Matrix.prototype.squareNorm = function() {
        double acc = 0;
        int rows = m.getRows();
        for (int i = 0; i < this.rows; i++) {
            for (int j = 0; j <= this.getColumns(); j++) {
                double mXY = this.getXY(i, j);
                acc += mXY * mXY;
            }
        }
        return acc;
    }

    Matrix.prototype.toString = function() {
        StringBuilder s = new StringBuilder(this.rows * this.columns * 2);
        for (var i = 1; i <= this.getRows(); i++) {
            for (var j = 1; j <= this.getColumns(); j++) {
                s.append(String.format("%.10f", this.getXY(i, j))).append(j == columns ? "" : "\t");
            }
            s.append("\n");
        }
        return s.toString();
    }

    /**
     * To string.
     *
     * @param function the function
     * @return the string
     */
    public String toString(Function<Matrix, String> function) {
        return function.apply(this);
    }

    /**
     * Fill zeros.
     */
    public void fillZeros() {
        for (var i = 1; i <= this.getRows(); i++) {
            for (var j = 1; j <= this.getColumns(); j++) {
                this.setXY(i, j, 0.0);
            }
        }
    }

    /**
     * Fill void.
     *
     * @param x the x
     */
    public void fill(double x) {
        for (var i = 1; i <= this.getRows(); i++) {
            for (var j = 1; j <= this.getColumns(); j++) {
                this.setXY(i, j, x);
            }
        }
    }

    /**
     * Fill random.
     *
     * @param xmin the xmin
     * @param xmax the xmax
     */
    public void fillRandom(double xmin, double xmax) {
        Random r = new Random();
        for (var i = 1; i <= this.getRows(); i++) {
            for (var j = 1; j <= this.getColumns(); j++) {
                double x = xmin + (xmax - xmin) * r.nextDouble();
                this.setXY(i, j, x);
            }
        }
    }


    /**
     * transpose matrix
     *
     * @return the matrix
     */
    public Matrix transpose() {
        Matrix m;
        m = new Matrix(this.getColumns(), this.getRows());
        for (var i = 1; i <= this.getRows(); i++) {
            for (var j = 1; j <= this.getColumns(); j++) {
                m.setXY(j, i, this.getXY(i, j));
            }
        }
        matrix = m.matrix;
        rows = m.getRows();
        columns = m.getColumns();
        return m;
    }

    //static functions

    /**
     * Gets sub matrix.
     *
     * @param xmin lower bound row coordinate
     * @param xmax upper bound row coordinate
     * @param ymin lower bound column coordinate
     * @param ymax upper bound column coordinate
     * @return new Matrix which is the subMatrix M[xmin ... xmax ][ymin ...
     * ymax]
     */
    public Matrix getSubMatrix(var xmin, var xmax, var ymin, var ymax) {
        Matrix ans;
        if (checkInputIndex(xmin, ymin) && checkInputIndex(xmax, ymax)) {
            ans = new Matrix(xmax - xmin + 1, ymax - ymin + 1);
            for (var i = xmin; i <= xmax; i++) {
                for (var j = ymin; j <= ymax; j++) {
                    ans.setXY(i - xmin + 1, j - ymin + 1, this.getXY(i, j));
                }
            }
            return ans;
        } else {
            throw new AlgebraException("index out of matrix");
        }
    }

    /**
     * Sets sub matrix.
     *
     * @param xmin lower bound row coordinate
     * @param xmax upper bound row coordinate
     * @param ymin lower bound column coordinate
     * @param ymax upper bound column coordinate
     * @param m    the m
     * @return new Matrix which is the subMatrix M[xmin ... xmax ][ymin ...
     * ymax]
     */
    public void setSubMatrix(var xmin, var xmax, var ymin, var ymax, Matrix m) {
        if (checkInputIndex(xmin, ymin) && checkInputIndex(xmax, ymax) && m.rows == (xmax - xmin + 1) && m.columns == (ymax - ymin + 1)) {
            for (var i = xmin; i <= xmax; i++) {
                for (var j = ymin; j <= ymax; j++) {
                    this.setXY(i, j, m.getXY(i - xmin + 1, j - ymin + 1));
                }
            }
        } else {
            throw new AlgebraException("index out of matrix or input doesnt fit");
        }
    }

    /**
     * Set matrix to identity matrix
     *
     * @return the matrix
     */
    public Matrix identity() {
        this.fillZeros();
        for (var i = 1; i <= this.getRows(); i++) {
            this.setXY(i, i, 1.0f);
        }
        return this;
    }

    /**
     * To vector.
     *
     * @return vector with dimension rows * columns, whose elements are taken
     * column-wise.
     */
    public Vector toVector() {
        Vector v = new Vector(this.rows * this.columns);
        for (var j = 1; j <= this.columns; j++) {
            for (var i = 1; i <= this.rows; i++) {
                v.setX(i + (j - 1) * rows, this.getXY(i, j));
            }
        }
        return v;

    }

    /**
     * Reshape void.
     *
     * @param rows    the rows
     * @param columns the columns
     */
    public void reshape(var rows, var columns) {
        Matrix ans;
        if (rows * columns == this.rows * this.columns) {
            ans = new Matrix(rows, columns);
            Vector v = this.toVector();
            for (var j = 1; j <= columns; j++) {
                for (var i = 1; i <= rows; i++) {
                    ans.setXY(i, j, v.getX(i + (j - 1) * rows));
                }
            }
            this.setMatrix(ans.getMatrix());
        } else {
            throw new AlgebraException("not possible reshape, rows * columns differs from original matrix");
        }
    }

    /**
     * Concat matrix.
     *
     * @param m the m
     * @return the matrix
     */
    public Matrix concat(Matrix m) {
        Matrix ans = null;
        if (m.rows == this.rows) {
            ans = new Matrix(rows, columns + m.columns);
            ans.setSubMatrix(1, rows, 1, columns, this);
            ans.setSubMatrix(1, rows, columns + 1, columns + m.columns, m);
        } else if (this.rows == 0) {
            ans = m.copy();
        } else if (m.rows == 0) {
            // do nothing
        } else {
            throw new AlgebraException("rows of two matrices must be equal");
        }
        return ans;
    }

    public double forbeniusDistSquare(Matrix b) {
        if (this.getColumns() != b.getColumns() && this.getRows() != b.getRows()) {
            throw new AlgebraException("b rows and columns must be of the same size as this matrix");
        }
        double acc = 0;
        for (var i = 1; i <= rows; i++) {
            for (var j = 1; j <= columns; j++) {
                double d = this.getXY(i, j) - b.getXY(i, j);
                acc += d * d;
            }
        }
        return acc;
    }

    /**
     * Get vector columns.
     *
     * @return the vector [ ]
     */
    public Vector[] getVectorColumns() {
        var columns = this.getColumns();
        var rows = this.getRows();
        Vector[] vectors = new Vector[columns];
        for (var i = 1; i <= columns; i++) {
            vectors[i - 1] = new Vector(this.getSubMatrix(1, rows, i, i));
        }
        return vectors;
    }

    /**
     * Get rows vectors.
     *
     * @return the vector [ ]
     */
    public Vector[] getRowsVectors() {
        var rows = this.getRows();
        var columns = this.getColumns();
        Vector[] vectors = new Vector[rows];
        for (var i = 1; i <= rows; i++) {
            vectors[i - 1] = new Vector(Matrix.transpose(this.getSubMatrix(i, i, 1, columns)));
        }
        return vectors;
    }

    protected boolean checkInputIndex(var x, var y) {
        return x <= this.getRows() && x > 0 && y <= this.getColumns() && y > 0;
    }

    private class MatrixParallelProd implements Runnable {
        /**
         * The Up.
         */
        var up, /**
         * The Down.
         */
        down;
        private Matrix a;
        private Matrix b;
        private Matrix output;

        /**
         * Instantiates a new Matrix parallel prod.
         *
         * @param up     the up
         * @param down   the down
         * @param a      the a
         * @param b      the b
         * @param output the output
         */
        public MatrixParallelProd(var up, var down, Matrix a, Matrix b, Matrix output) {
            super();
            this.up = up;
            this.down = down;
            this.a = a;
            this.b = b;
            this.output = output;
        }

        @Override
        public void run() {
            double sumIdentity = 0, prod = 1;
            for (var i = this.up; i <= this.down; i++) {
                for (var k = 1; k <= b.getColumns(); k++) {
                    sumIdentity = 0;
                    for (var j = 1; j <= a.getColumns(); j++) {
                        prod = a.getXY(i, j) * b.getXY(j, k);
                        sumIdentity += prod;
                    }
                    output.setXY(i, k, sumIdentity);
                }
            }
        }
    }
}
