
export function solveGauss() {
    const matrixInput = document.getElementById('matrix').value;
    if (!matrixInput) throw new Error('Please enter the matrix');

    
    const matrix = matrixInput.split(';').map(row => row.split(',').map(Number));
    const n = matrix.length;
    
    if (matrix[0].length !== n + 1) {
        throw new Error('Invalid matrix dimensions. Expected augmented matrix (n x n+1)');
    }

    let A = matrix.map(row => [...row]); 

    
    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
        }
        [A[i], A[maxRow]] = [A[maxRow], A[i]];

        for (let k = i + 1; k < n; k++) {
            const factor = A[k][i] / A[i][i];
            for (let j = i; j <= n; j++) {
                A[k][j] -= factor * A[i][j];
            }
        }
    }

    const X = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += A[i][j] * X[j];
        }
        X[i] = (A[i][n] - sum) / A[i][i];
    }

    displayGaussMatrix(A, X);
}

function displayGaussMatrix(finalMatrix, X) {
    const resultDiv = document.getElementById('result');
    const tbody = document.querySelector('#table tbody');
    
    if (!tbody) return;
    tbody.innerHTML = ''; 

    resultDiv.innerHTML = `<strong>Solution:</strong> X = [ ${X.map(v => v.toFixed(3)).join(', ')} ]`;

    let html = '<tr><td colspan="10" class="text-center bg-secondary text-white">Final Matrix</td></tr>';
    
    finalMatrix.forEach(row => {
        html += `<tr>${row.map(v => `<td class="text-center">${v.toFixed(3)}</td>`).join('')}</tr>`;
    });

    tbody.innerHTML = html;
}

                               //lu decomposition
export function solveLU() {
    const matrixInput = document.getElementById('matrix').value;
    if (!matrixInput) throw new Error('Please enter the matrix');

    const matrix = matrixInput.split(';').map(row => row.split(',').map(Number));
    const n = matrix.length;
    const A = []; 
    const B = []; 

    for (let i = 0; i < n; i++) {
        A[i] = matrix[i].slice(0, n);
        B[i] = matrix[i][n];
    }

    const L = Array.from({ length: n }, () => Array(n).fill(0));
    const U = Array.from({ length: n }, () => Array(n).fill(0));

   
    for (let i = 0; i < n; i++) {
        for (let k = i; k < n; k++) {
            let sum = 0;
            for (let j = 0; j < i; j++) sum += (L[i][j] * U[j][k]);
            U[i][k] = A[i][k] - sum;
        }
        for (let k = i; k < n; k++) {
            if (i === k) L[i][i] = 1;
            else {
                let sum = 0;
                for (let j = 0; j < i; j++) sum += (L[k][j] * U[j][i]);
                L[k][i] = (A[k][i] - sum) / U[i][i];
            }
        }
    }

    const Y = Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        let sum = 0;
        for (let j = 0; j < i; j++) sum += L[i][j] * Y[j];
        Y[i] = B[i] - sum;
    }

    const X = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) sum += U[i][j] * X[j];
        X[i] = (Y[i] - sum) / U[i][i];
    }

    displayLUMatrix(L, U, X);
}

function displayLUMatrix(L, U, X) {
    const resultDiv = document.getElementById('result');
    const tbody = document.querySelector('#table tbody');
    tbody.innerHTML = '';

    resultDiv.innerHTML = `<strong>Solution:</strong> X = [ ${X.map(v => v.toFixed(3)).join(', ')} ]`;

    let html = '<tr><td colspan="10" class="text-center bg-secondary text-white">Matrix L</td></tr>';
    L.forEach(row => {
        html += `<tr>${row.map(v => `<td>${v.toFixed(3)}</td>`).join('')}</tr>`;
    });
    html += '<tr><td colspan="10" class="text-center bg-secondary text-white">Matrix U</td></tr>';
    U.forEach(row => {
        html += `<tr>${row.map(v => `<td>${v.toFixed(3)}</td>`).join('')}</tr>`;
    });

    tbody.innerHTML = html;
}


                    /* Gauss-Jordan Elimination */

export function solveGaussJordan() {
    const matrixInput = document.getElementById('matrix').value;
    if (!matrixInput) throw new Error('Please enter the matrix');

    const matrix = matrixInput.split(';').map(row => row.split(',').map(Number));
    const n = matrix.length;
    let A = matrix.map(row => [...row]);

    for (let i = 0; i < n; i++) {

        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
        }
        [A[i], A[maxRow]] = [A[maxRow], A[i]];

        const pivot = A[i][i];
        if (Math.abs(pivot) < 1e-10) throw new Error('Matrix is singular or nearly singular');
        
        for (let j = i; j <= n; j++) {
            A[i][j] /= pivot;
        }

        for (let k = 0; k < n; k++) {
            if (k !== i) {
                const factor = A[k][i];
                for (let j = i; j <= n; j++) {
                    A[k][j] -= factor * A[i][j];
                }
            }
        }
    }

    const X = A.map(row => row[n]);
    displayJordanMatrix(A, X);
}

function displayJordanMatrix(finalMatrix, X) {
    const resultDiv = document.getElementById('result');
    const tbody = document.querySelector('#table tbody');
    
    if (!tbody) return;
    tbody.innerHTML = '';

    resultDiv.innerHTML = `<strong>Solution:</strong> X = [ ${X.map(v => v.toFixed(3)).join(', ')} ]`;

    let html = '<tr><td colspan="10" class="text-center bg-secondary text-white">final Matrix</td></tr>';
    
    finalMatrix.forEach(row => {
        html += `<tr>${row.map(v => `<td class="text-center">${v.toFixed(3)}</td>`).join('')}</tr>`;
    });

    tbody.innerHTML = html;
}


                          //cramer's rule


function calculateDet(matrix) {
    let n = matrix.length;
    let A = matrix.map(row => [...row]);
    let det = 1;
    let swaps = 0;

    for (let i = 0; i < n; i++) {
        let maxRow = i;
        for (let k = i + 1; k < n; k++) {
            if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
        }
        if (maxRow !== i) {
            [A[i], A[maxRow]] = [A[maxRow], A[i]];
            swaps++;
        }
        if (Math.abs(A[i][i]) < 1e-10) return 0;
        for (let k = i + 1; k < n; k++) {
            let factor = A[k][i] / A[i][i];
            for (let j = i; j < n; j++) { A[k][j] -= factor * A[i][j]; }
        }
        det *= A[i][i];
    }
    return swaps % 2 === 0 ? det : -det;
}

export function solveCramer() {
    const matrixInput = document.getElementById('matrix').value;
    if (!matrixInput) throw new Error('Please enter the matrix');

    const matrix = matrixInput.split(';').map(row => row.split(',').map(Number));
    const n = matrix.length;
    
    const A = []; const B = [];
    for (let i = 0; i < n; i++) {
        A[i] = matrix[i].slice(0, n);
        B[i] = matrix[i][n];
    }

    const detA = calculateDet(A);
    if (Math.abs(detA) < 1e-10) throw new Error('No unique solution (Determinant = 0)');

    let determinants = [];
    let X = [];

    for (let i = 0; i < n; i++) {
        let temp = A.map(row => [...row]);
        for (let j = 0; j < n; j++) {
            temp[j][i] = B[j];
        }
        const d_i = calculateDet(temp);
        determinants.push(d_i);
        X.push(d_i / detA);
    }

    displayCramer(detA, determinants, X);
}

function displayCramer(detA, determinants, X) {
    const resultDiv = document.getElementById('result');
    const tbody = document.querySelector('#table tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    resultDiv.innerHTML = `<strong>Solution:</strong> X = [ ${X.map(v => v.toFixed(3)).join(', ')} ]`;

    let html = `<tr><td colspan="10" class="text-center bg-secondary text-white">Cramer's Rule Results</td></tr>`;
    html += `<tr class="table-info"><td colspan="10" class="text-center">Main Determinant (Det A) = <b>${detA.toFixed(3)}</b></td></tr>`;
    
    determinants.forEach((det, i) => {
        html += `<tr class="text-center">
            <td style="width:20%">Det A<sub>${i+1}</sub></td>
            <td style="width:20%">${det.toFixed(3)}</td>
            <td>/</td>
            <td style="width:20%">${detA.toFixed(3)}</td>
            <td style="width:20%"><b class="text-success">${X[i].toFixed(3)}</b></td>
        </tr>`;
    });

    tbody.innerHTML = html;
}