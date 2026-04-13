
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

    let html = '<tr><td colspan="10" class="text-center bg-secondary text-white">Final Augmented Matrix (Upper Triangular)</td></tr>';
    
    finalMatrix.forEach(row => {
        html += `<tr>${row.map(v => `<td class="text-center">${v.toFixed(3)}</td>`).join('')}</tr>`;
    });

    tbody.innerHTML = html;
}






















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