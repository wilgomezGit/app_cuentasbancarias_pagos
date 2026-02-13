document.getElementById('processButton').addEventListener('click', processFile);
document.getElementById('exportButton').addEventListener('click', exportToExcel);
document.getElementById('cancelButton').addEventListener('click', cancelProcess);

let processedData = [];
let isExporting = false;

const bancoData = {
    'ABN AMRO': { banco: '08', dato3: '005600081' },
    'BANCO DE BOGOTA': { banco: '01', dato3: '000001001' },
    'BANCO POPULAR': { banco: '02', dato3: '000001002' },
    'GRAN BANCO - BANCAFE': { banco: '05', dato3: '005600052' },
    'SANTANDER': { banco: '06', dato3: '000001065' },
    'BANCOLOMBIA': { banco: '07', dato3: '000001007' },
    'CITIBANK': { banco: '09', dato3: '000001009' },
    'BANCO SUDAMERIS': { banco: '12', dato3: '000001012' },
    'BBVA COLOMBIA': { banco: '13', dato3: '000001013' },
    'BANCO COLPATRIA': { banco: '19', dato3: '000001019' },
    'UNION COLOMBIANO': { banco: '22', dato3: '005600227' },
    'BANCO DE OCCIDENTE': { banco: '23', dato3: '000001023' },
    'STANDARD CHARTERED': { banco: '24', dato3: '000001024' },
    'BANCO TEQUENDAMA': { banco: '29', dato3: '005600298' },
    'BANCOLDEX S.A.': { banco: '31', dato3: '000001031' },
    'BANCO CAJA SOCIAL BCSC SA': { banco: '32', dato3: '000001032' },
    'BANCO SUPERIOR': { banco: '34', dato3: '005600340' },
    'MEGABANCO': { banco: '36', dato3: '000001036' },
    'NEQUI': { banco: '37', dato3: '000001507' },
    'BANCO AGRARIO': { banco: '40', dato3: '000001040' },
    'BANCO DAVIVIENDA SA': { banco: '51', dato3: '000001051' },
    'BANCO AV VILLAS': { banco: '52', dato3: '000001052' },
    'GRANAHORRAR': { banco: '54', dato3: '005701304' },
    'CONAVI': { banco: '55', dato3: '005701100' },
    'COLMENA': { banco: '57', dato3: '005701809' },
    'BANCAMIA S.A.': { banco: '59', dato3: '000001059' },
    'BANCO MUNDO MUJER': { banco: '60', dato3: '000001047' },
    'BANCOOMEVA': { banco: '61', dato3: '000001061' },
    'BANCO FALABELLA S.A.': { banco: '62', dato3: '000001062' },
    'ITAU antes Corpbanca': { banco: '63', dato3: '000000006' },
    'BANCO PICHINCHA': { banco: '64', dato3: '000001060' },
    'BANCO W S.A.': { banco: '65', dato3: '000001053' },
    'BANCO COOPERATIVO COOPCENTRAL': { banco: '66', dato3: '000001066' },
    'BANCO COMPARTIR': { banco: '67', dato3: '000001067' },
    'BANCO SERFINANZA': { banco: '68', dato3: '000001069' },
    'DAVIPLATA': { banco: '69', dato3: '000001551' },
    'FINANCIERA JURISCOOP S.A. COMPAÑIA DE FINANCIAMIENTO': { banco: '70', dato3: '000001121' },
    'BANCO FINANDINA S.A.': { banco: '71', dato3: '000001063' },
    'LULO BANK': { banco: '1070', dato3: '000001070' },
    'BOLD CF': { banco: '1070', dato3: '000001808' },
    'NU BANK': { banco: '1809', dato3: '000001809' }

};

function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor selecciona un archivo Excel.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        parseData(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

function parseData(data) {
    const tableBody = document.getElementById('dataBody');
    tableBody.innerHTML = '';
    processedData = [];
    let hasErrors = false;
    let errorMessages = [];

    data.slice(1).forEach((row, index) => {
        if (row.length < 6) return;

        const noDocumento = row[1]?.toString().trim() || '';
        const noCuenta = row[3]?.toString().trim() || '';
        const bancoNombre = row[4]?.toString().trim() || '';
        const tipoDocumento = row[6]?.toString().trim() || '';
        const tipoCuentaTexto = row[5]?.toString().trim() || '';

        const bancoInfo = bancoData[bancoNombre] || { banco: 'ERROR', dato3: '000000000' };
        const tipoCuenta = tipoCuentaTexto === 'AHORROS' ? '2' : tipoCuentaTexto === 'CORRIENTE' ? '1' : 'ERROR';

        let dato2 = 'ERROR';
        if (tipoDocumento === 'CÉDULA CIUDADANÍA') dato2 = '1';
        else if (tipoDocumento === 'NIT') dato2 = '3';
        else if (tipoDocumento === 'CÉDULA EXTRANJERÍA') dato2 = '2';

        const dato6 = tipoCuentaTexto === 'AHORROS' ? '37' : tipoCuentaTexto === 'CORRIENTE' ? '27' : 'ERROR';

        if (bancoInfo.banco === 'ERROR' || bancoInfo.dato3 === '000000000' || tipoCuenta === 'ERROR' || dato2 === 'ERROR' || dato6 === 'ERROR') {
            errorMessages.push(`Fila ${index + 2}: Error en datos (${bancoNombre}, ${tipoCuentaTexto}, ${tipoDocumento}).`);
            hasErrors = true;
        }

        const rowData = [
            noDocumento, '001', bancoInfo.banco, noCuenta, tipoCuenta, '00000509', '1', '1',
            noDocumento, dato2, bancoInfo.dato3, noCuenta, '', dato6, '', '00000'
        ];

        processedData.push(rowData);
        const tr = document.createElement('tr');

        rowData.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            if (cell === 'ERROR' || cell === '000000000') {
                td.style.backgroundColor = 'red';
            }
            tr.appendChild(td);
        });

        tableBody.appendChild(tr);
    });

    if (hasErrors) {
        alert(`Errores detectados:\n${errorMessages.join('\n')}`);
        document.getElementById('exportButton').disabled = true;
    } else {
        document.getElementById('exportButton').disabled = false;
    }
}

function exportToExcel() {
    if (isExporting) return;

    isExporting = true;
    document.getElementById('exportButton').disabled = true;

    setTimeout(() => {
        if (processedData.length === 0) {
            alert('No hay datos procesados para exportar.');
            isExporting = false;
            document.getElementById('exportButton').disabled = false;
            return;
        }

        const headers = [
            'Código del proveedor', 'Sucursal del proveedor', 'Banco del proveedor',
            'Número de cuenta corriente o de ahorros', 'Tipo de cuenta 1=cta cte 2=cta ahorro', 'formato', 'forma de pago',
            'Cuenta por defecto 0= cta reg. no es default, 1=cta reg. es default', 'DATO 1', 'DATO 2', 'DATO 3', 'DATO 4', 'DATO 5',
            'DATO 6', 'DATO 7', 'DATO 8'
        ];

        const sheetData = [headers, ...processedData];
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Pago electrónico');
        XLSX.writeFile(workbook, 'FormatoSiesa.xlsx');

        //alert('Datos exportados correctamente.');

        isExporting = false;
        document.getElementById('exportButton').disabled = false;
    }, 100);
}

function cancelProcess() {
    document.getElementById('fileInput').value = '';
    document.getElementById('dataBody').innerHTML = '';
    processedData = [];
    document.getElementById('exportButton').disabled = true;
}

function goToHome() {
    window.location.href = "../index.html";
}
