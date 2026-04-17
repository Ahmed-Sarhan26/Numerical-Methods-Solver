const MAX_ITER = 100
const DEFAULT_TOL = 0.001
import { solveGauss, solveLU, solveGaussJordan ,solveCramer  } from './CH2.js'
function evaluate(expr, x) {
    const allowed = /^[0-9+\-*/().x\s^e√sincostanlogln]+$/i
    if (!allowed.test(expr)) throw new Error('Invalid expression')
    expr = expr.replace(/\s+/g, '')
    expr = expr
        .replace(/√\s*\(/g, 'Math.sqrt(')
        .replace(/√/g, 'Math.sqrt')
        .replace(/\^/g, '**')
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/ln/g, 'Math.log')
        .replace(/log/g, 'Math.log10')
    expr = expr
        .replace(/(\d)(x)/gi, '$1*x')
        .replace(/(x)(\d)/gi, 'x*$2')
        .replace(/(\))(\()/g, '$1*$2')
        .replace(/(\d)(\()/g, '$1*$2')
        .replace(/(\))(x)/g, '$1*$2')
    const fn = new Function('x', `with (Math){ return ${expr}; }`)
    return fn(x)
}

function clearTable() {
    const tbody = document.querySelector('#table tbody')
    if(tbody) tbody.innerHTML = ''
    const head = document.querySelector('#table-head')
    if(head) head.innerHTML = ''
}

function setTableHeader(method) {
    const head = document.querySelector('#table-head')
    const tr = document.createElement('tr')
    const columns = {
        bisection: ['i','xl','f(xl)','xu','f(xu)','xr','f(xr)','Error'],
        falsePosition:['i','xl','f(xl)','xu','f(xu)','xr','f(xr)','Error'],
        fixedPoint:['i','x','g(x)','Error'],
        newton:['i','x','f(x)',"f'(x)",'Error'],
        secant:['i','x0','f(x0)','x1','f(x1)','x2','Error'],
        gauss:[],
        luDecomposition: [],
        gaussJordan: [] ,
        cramer: []

    }
    columns[method].forEach(c => {
        const th = document.createElement('th')
        th.textContent = c
        tr.appendChild(th)
    })
    head.appendChild(tr)
}

function addRow(values) {
    const tbody = document.querySelector('#table tbody')
    const tr = tbody.insertRow()
    values.forEach(v => {
        const td = tr.insertCell()
        td.textContent = (typeof v === 'number' && !isNaN(v))
            ? v.toFixed(3)
            : v
    })
}

function updateInputs() {
    const container = document.getElementById('inputs')
    const method = document.getElementById('method').value
    const fxDiv  = document.getElementById('fx-input')
    const tolDiv = document.getElementById('tol-input')

 if (fxDiv) fxDiv.style.display = (method === 'gauss' || method === 'luDecomposition' || method === 'gaussJordan' || method === 'cramer') ? 'none' : 'block'
if (tolDiv) tolDiv.style.display = (method === 'gauss' || method === 'luDecomposition' || method === 'gaussJordan' || method === 'cramer') ? 'none' : 'block'
    
    container.innerHTML = ''
    const field = (id, label) => `
        <div class="mb-3">
            <label class="form-label">${label}</label>
            <input class="form-control" id="${id}">
        </div>`

    if (method === 'bisection' || method === 'falsePosition') {
        container.innerHTML = field('xl','xl') + field('xu','xu')
    } else if (method === 'fixedPoint' || method === 'newton') {
        container.innerHTML = field('x0','Initial guess (x₀)')
    } else if (method === 'secant') {
        container.innerHTML = field('x0','x₀') + field('x1','x₁')
    } else if (method === 'gauss' || method === 'luDecomposition' || method === 'gaussJordan' || method === 'cramer') {
    container.innerHTML = `
        <div class="mb-3">
            <label class="form-label">
                Augmented matrix (rows separated by ';', entries by ',')
            </label>
            <input class="form-control" id="matrix" 
                   placeholder="2,1,5,8;1,-1,1,2;3,2,-1,3">
        </div>`;
}
}


function solve() {
    clearTable()
    document.getElementById('result').textContent = '---'
    const method = document.getElementById('method').value
    const expr   = document.getElementById('func') ? document.getElementById('func').value.trim() : ''
    let tol = DEFAULT_TOL
    if(document.getElementById('tol')) {
        tol = parseFloat(document.getElementById('tol').value)
        if (isNaN(tol) || tol <= 0) tol = DEFAULT_TOL
    }
    
    setTableHeader(method)
    try {
        switch (method) {
            case 'bisection':      solveBisection(expr, tol); break
            case 'falsePosition': solveFalsePosition(expr, tol); break
            case 'fixedPoint':    solveFixedPoint(expr, tol); break
            case 'newton':        solveNewton(expr, tol); break
            case 'secant':        solveSecant(expr, tol); break
            case 'gauss':         solveGauss(); break
            case 'luDecomposition': solveLU(); break 
            case 'gaussJordan':   solveGaussJordan(); break 
            case 'cramer':        solveCramer(); break
            default: throw new Error('Unknown method selected')
        }
    } catch (e) {
        alert('Error: ' + e.message)
    }
}

function solveBisection(expr, tol) {
    let xl = parseFloat(document.getElementById('xl').value)
    let xu = parseFloat(document.getElementById('xu').value)
    if (isNaN(xl) || isNaN(xu)) throw new Error('Enter valid xl and xu')
    let xr = 0, old = 0, err = 1, i = 1
    while (err > tol && i <= MAX_ITER) {
        xr = (xl + xu) / 2
        err = i > 1 ? Math.abs((xr - old) / (xr || 1)) : 1
        const fxl = evaluate(expr, xl)
        const fxu = evaluate(expr, xu)
        const fxr = evaluate(expr, xr)
        addRow([i, xl, fxl, xu, fxu, xr, fxr, err])
        if (fxl * fxr < 0) xu = xr; else xl = xr
        old = xr; i++
    }
    document.getElementById('result').textContent = `Root ≈ ${xr.toFixed(3)}`
}


function solveFalsePosition(expr, tol) {
    let xl = parseFloat(document.getElementById('xl').value)
    let xu = parseFloat(document.getElementById('xu').value)
    if (isNaN(xl) || isNaN(xu)) throw new Error('Enter valid xl and xu')
    let xr = 0, old = 0, err = 1, i = 1
    while (err > tol && i <= MAX_ITER) {
        const fxl = evaluate(expr, xl)
        const fxu = evaluate(expr, xu)
        xr = xu - (fxu * (xl - xu)) / (fxl - fxu)
        err = i > 1 ? Math.abs((xr - old) / (xr || 1)) : 1
        const fxr = evaluate(expr, xr)
        addRow([i, xl, fxl, xu, fxu, xr, fxr, err])
        if (fxl * fxr < 0) xu = xr; else xl = xr
        old = xr; i++
    }
    document.getElementById('result').textContent = `Root ≈ ${xr.toFixed(3)}`
}

function solveFixedPoint(expr, tol) {
    let x = parseFloat(document.getElementById('x0').value)
    if (isNaN(x)) throw new Error('Enter a valid initial guess')
    let err = 1, i = 1
    while (err > tol && i <= MAX_ITER) {
        const xn = evaluate(expr, x)
        err = Math.abs((xn - x) / (xn || 1))
        addRow([i, x, xn, err])
        x = xn; i++
    }
    document.getElementById('result').textContent = `Root ≈ ${x.toFixed(3)}`
}

function solveNewton(expr, tol) {
    let x = parseFloat(document.getElementById('x0').value)
    if (isNaN(x)) throw new Error('Enter a valid initial guess')
    const h = 1e-5
    let err = 1, i = 1
    while (err > tol && i <= MAX_ITER) {
        const fx = evaluate(expr, x)
        const dfx = (evaluate(expr, x + h) - evaluate(expr, x - h)) / (2 * h)
        if (dfx === 0) throw new Error('Derivative became zero')
        const xn = x - fx / dfx
        err = Math.abs((xn - x) / (xn || 1))
        addRow([i, x, fx, dfx, err])
        x = xn; i++
    }
    document.getElementById('result').textContent = `Root ≈ ${x.toFixed(3)}`
}

function solveSecant(expr, tol) {
    let x0 = parseFloat(document.getElementById('x0').value)
    let x1 = parseFloat(document.getElementById('x1').value)
    if (isNaN(x0) || isNaN(x1)) throw new Error('Enter valid x0 and x1')
    let err = 1, i = 1
    while (err > tol && i <= MAX_ITER) {
        const f0 = evaluate(expr, x0)
        const f1 = evaluate(expr, x1)
        if (f0 === f1) throw new Error('Division by zero (f(x0) == f(x1))')
        const x2 = x1 - f1 * (x0 - x1) / (f0 - f1)
        err = Math.abs((x2 - x1) / (x2 || 1))
        addRow([i, x0, f0, x1, f1, x2, err])
        x0 = x1; x1 = x2; i++
    }
    document.getElementById('result').textContent = `Root ≈ ${x1.toFixed(3)}`
}


function exportToPDF() {
    // 1. استهدف عنصر النتيجة والجدول فقط وابعد عن الـ Card اللي فيه ظل وخلفية معقدة
    const element = document.getElementById('table-section').parentElement; 

    if (!element) {
        alert("No results to export!");
        return;
    }

    const opt = {
        margin:       [0.5, 0.5],
        filename:     'Numerical_Results.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true,
            // السر هنا: بنجبره يتجاهل الصور اللي مش فاهمها ويركز على النصوص والجداول
            logging: false,
            backgroundColor: '#ffffff' // بنخلي الخلفية بيضاء سادة للـ PDF
        },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // 2. التنفيذ
    html2pdf().set(opt).from(element).save().catch(err => {
        console.error("PDF Export failed:", err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateInputs();
    document.getElementById('method').addEventListener('change', updateInputs);
    document.getElementById('solveBtn').addEventListener('click', solve);
    document.getElementById('exportBtn').addEventListener('click', exportToPDF);
});
