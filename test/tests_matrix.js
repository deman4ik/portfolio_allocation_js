// ------------------------------------------------------------
QUnit.module('Matrix internal module', {
  before: function() {
    // Generate a random non square matrix
	 // Generate the dimensions
	var max = 10;
	var min = 2;
	var r = Math.floor(Math.random()*(max-min+1) + min);
	var c = Math.floor(Math.random()*(max-min+1) + min);
	while (c == r) {
	  c = Math.floor(Math.random()*(max-min+1) + min);
	}
	
	// Generate the values 
	var doubleArray = new Array(r);
    for (var i = 0; i < r; ++i) {
	  doubleArray[i] = new Array(c);
	  for (var j = 0; j < c; ++j) {
	    doubleArray[i][j] = Math.random();
	  }
    }
	this.nsMatValues = doubleArray;	
	
	// Generate a random square matrix
	var doubleArray2 = new Array(r);
    for (var i = 0; i < r; ++i) {
	  doubleArray2[i] = new Array(r);
	  for (var j = 0; j < r; ++j) {
	    doubleArray2[i][j] = Math.random();
	  }
    }
	this.sMatValues = doubleArray2;	
  }
});


QUnit.test('Matrix basic manipulations', function(assert) {    
  // Test non square matrix using random data
  {
      var nsMat = new PortfolioAllocation.Matrix(this.nsMatValues);
    
      // Check the dimensions	
      assert.equal(nsMat.nbRows, this.nsMatValues.length, 'Number of rows');
      assert.equal(nsMat.nbColumns, this.nsMatValues[0].length, 'Number of columns');
      
      // Ensure the matrix is not square
      assert.equal(nsMat.isSquare(), false, 'Matrix not square');
    
      // Ensure the matrix is equal to itself
      assert.equal(PortfolioAllocation.Matrix.areEqual(nsMat,nsMat), true, 'Matrix equal to itself');
      
      // Check the values with getValueAt
      for (var i = 0; i < nsMat.nbRows; ++i) {
    	for (var j = 0; j < nsMat.nbColumns; ++j) {
    	  assert.equal(nsMat.getValueAt(i+1,j+1), this.nsMatValues[i][j], 'Matrix values');
    	}
      }
  }
  
  // Test equality using the non square matrix
  {
      // Create a new matrix equal to the previous one and replace 
      // the values of the matrix with new values with setValueAt
      var nsMat2 = new PortfolioAllocation.Matrix(this.nsMatValues);
      for (var i = 1; i <= nsMat.nbRows; ++i) {
    	for (var j = 1; j <= nsMat.nbColumns; ++j) {
    	  var newVal = nsMat2.getValueAt(i,j) + Math.random();
    	  nsMat2.setValueAt(i,j, newVal);
    	  assert.equal(nsMat2.getValueAt(i,j), newVal, 'Matrix values #2');
    	}
      }
    
      // Ensure the old matrix is not equal to the new matrix with a 0 tolerance...
      assert.equal(PortfolioAllocation.Matrix.areEqual(nsMat, nsMat2), false, 'Old matrix not strictly equal to new matrix');
    
      // ... but is with a 1 tolerance, as Math.random max value is 1, so that the new matrix coefficients must be 
      // equal to the old matrix coefficients + at most 1 !
      assert.equal(PortfolioAllocation.Matrix.areEqual(nsMat, nsMat2, 1), true, 'Old matrix equal to new matrix within 1');
  }
  
  // Test square matrix using random data
  {
      var sMat = new PortfolioAllocation.Matrix(this.sMatValues);
    
      // Ensure the matrix is square
      assert.equal(sMat.isSquare(), true, 'Matrix is square');
      
      // Extract the matrix diagonal elements
      var diag = sMat.getDiagonal();
      for (var i = 1; i <= sMat.nbRows; ++i) {
          assert.equal(diag.getValueAt(i, 1), sMat.getValueAt(i, i), 'Matrix diagonal elements');
      }
  }

});


QUnit.test('Matrix-matrix product', function(assert) {    
  // Test matrix-matrix product using static data
  var mat1 = new PortfolioAllocation.Matrix([[1,2,3], [4,5,6]]);
  var mat2 = new PortfolioAllocation.Matrix([[1,2], [2,4], [3,6]]);
  var prodMat = PortfolioAllocation.Matrix.product(mat1, mat2);

  var expectedResMat = new PortfolioAllocation.Matrix([[14,28], [32,64]]);
  assert.equal(PortfolioAllocation.Matrix.areEqual(prodMat, expectedResMat), true, 'Matrix-matrix product');
});


QUnit.test('Matrix element wise power', function(assert) {    
  // Test matrix element wise power using static data
  var mat = new PortfolioAllocation.Matrix([[1,2,3], [4,5,6]]);
  var powerMat = mat.elemPower(2);
 
  var expectedResMat = new PortfolioAllocation.Matrix([[1,4,9], [16,25,36]]);
  assert.equal(PortfolioAllocation.Matrix.areEqual(powerMat, expectedResMat), true, 'Matrix element wise power');
});


QUnit.test('Matrix element wise function', function(assert) {    
  // Test matrix element wise function using static data
  var mat = new PortfolioAllocation.Matrix([[1,2,3], [4,5,6]]);
  var powerMat = mat.elemMap(function(i,j,val) { return Math.pow(val, 2); });
 
  var expectedResMat = new PortfolioAllocation.Matrix([[1,4,9], [16,25,36]]);
  assert.equal(PortfolioAllocation.Matrix.areEqual(powerMat, expectedResMat), true, 'Matrix element wise function');
});


QUnit.test('Matrix to string', function(assert) {    
  // Test matrix to string using static data
  var mat = new PortfolioAllocation.Matrix([[1,2,3], [4,5,10]]);
  assert.equal(mat.toString(), '[  1  2  3 ]\n[  4  5 10 ]\n', 'Matrix to string');
});


QUnit.test('Matrix to double array', function(assert) {    
  // Test using static data
  var mat = new PortfolioAllocation.Matrix([[1,2,3], [4,5,10]]);
  assert.deepEqual(mat.toDoubleArray(), [[1,2,3], [4,5,10]], 'Matrix to double array');
  assert.deepEqual(mat.toDoubleArray(function(i,j,val) { return i==j; }), [[1], [5]], 'Matrix to doule array with function');
  
  // Test using the random matrix, using identity matrix(matrix to array) == matrix
  var nsMat = new PortfolioAllocation.Matrix(this.nsMatValues);
  var nsMatArray = nsMat.toDoubleArray();
  assert.deepEqual(nsMatArray, this.nsMatValues, 'Array to matrix to array');
  assert.equal(PortfolioAllocation.Matrix.areEqual(nsMat, new PortfolioAllocation.Matrix(nsMatArray)), true, 'Matrix to double array to matrix');
});


QUnit.test('Matrix to array', function(assert) {    
  // Test using static data
  var mat = new PortfolioAllocation.Matrix([[1,2,3], [4,5,10]]);
  assert.deepEqual(mat.toArray(), [1,2,3,4,5,10], 'Matrix to array');
  assert.deepEqual(mat.toArray(function(i,j,val) { return i==j; }), [1, 5], 'Matrix to array with function');  
});


QUnit.test('Diagonal matrix creation', function(assert) {    
  // Test using static data
  var mat = PortfolioAllocation.Matrix.diagonal([1,2,3]);
  var expectedMat = new PortfolioAllocation.Matrix([[1,0,0], [0,2,0], [0,0,3]]);
  assert.deepEqual(mat.toArray(), expectedMat.toArray(), 'Diagonal matrix creation');
});


QUnit.test('Symetric matrix creation', function(assert) {    
  // Test using static data
  var mat = PortfolioAllocation.Matrix.fillSymetric(2, function(i,j) { return i+j; });
  var expectedMat = new PortfolioAllocation.Matrix([[2,3], [3,4]]);
  assert.equal(PortfolioAllocation.Matrix.areEqual(mat, expectedMat), true, 'Symetric matrix creation');
});


QUnit.test('Submatrix extraction', function(assert) {    
  // Test using static data
  var mat = new PortfolioAllocation.Matrix([[1,2,3], [4,5,6], [7,8,9]]);
  var subMat = mat.getSubmatrix([1,3], [1, 3]);
  var expectedMat = new PortfolioAllocation.Matrix([[1,3], [7,9]]);
  assert.equal(PortfolioAllocation.Matrix.areEqual(subMat, expectedMat), true, 'Submatrix extraction');
});


QUnit.test('Zeros matrix creation', function(assert) {    
  // Test using static data
  var mat = PortfolioAllocation.Matrix.zeros(3, 2);
  var expectedMat = new PortfolioAllocation.Matrix([[0,0], [0,0], [0,0]]);
  assert.equal(PortfolioAllocation.Matrix.areEqual(mat, expectedMat), true, 'Zeros matrix creation');
});

QUnit.test('Identity matrix creation', function(assert) {    
  // Test using static data
  var mat = PortfolioAllocation.Matrix.eye(3);
  var expectedMat = new PortfolioAllocation.Matrix([[1,0,0], [0,1,0], [0,0,1]]);
  assert.equal(PortfolioAllocation.Matrix.areEqual(mat, expectedMat), true, 'Identity matrix creation');
});

QUnit.test('Transpose matrix', function(assert) {    
  // Test using static data  
  var mat = new PortfolioAllocation.Matrix([[1,2,3], [4,5,6]]);
  var transpMat = mat.transpose();
  var expectedMat = new PortfolioAllocation.Matrix([[1,4], [2,5], [3,6]]); 
  assert.equal(PortfolioAllocation.Matrix.areEqual(transpMat, expectedMat), true, 'Transpose matrix');
});


QUnit.test('Givens QR decomposition', function(assert) {    
  // Test using static data  
  {
	  //var mat = new PortfolioAllocation.Matrix([[1,2,3], [4,5,6], [7,8,9]]);
	  var mat = new PortfolioAllocation.Matrix([[1,2,0], [1,1,1], [2,1,0]]);
	  
	  // Computation of a QR decomposition
	  var qr = PortfolioAllocation.Matrix.givensQRDecomposition(mat);
	  var q = qr[0];
	  var r = qr[1];
	  
	  //console.log(q.toString());
	  //console.log(r.toString());
	  
	  var qqp = PortfolioAllocation.Matrix.product(q, q.transpose());
	  //console.log(qqp.toString());//OK
	  
	  var qtimesr = PortfolioAllocation.Matrix.product(q, r);
	  //console.log(qtimesr.toString()); // OK
	  
	  // Expected matrices were verified with Matlab
	  var expectedQMat = new PortfolioAllocation.Matrix([[1,4], [2,5], [3,6]]); 
	  var expectedRMat = new PortfolioAllocation.Matrix([[1,4], [2,5], [3,6]]);
	  
	  assert.equal(PortfolioAllocation.Matrix.areEqual(expectedQMat, expectedRMat), true, 'Givens QR decomposition');
  }
  
  // TODO: Test using random data: check Q,R dimensions, check Q*R = A, check R upper triangular, check Q orthogonal: Q*q^t = Identity (m)
  
  // TODO: Test error case
});


QUnit.test('Determinant computation', function(assert) {    
  // Test using static data  
  var mat = new PortfolioAllocation.Matrix([[-2,2,-3], [-1,1,3], [2,0,-1]]);
  var expectedValue = 18;

  assert.equal(Math.abs(mat.determinant() - expectedValue) <= 1e-16, true, 'Determinant computation');
});