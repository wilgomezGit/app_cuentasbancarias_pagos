let fileContent = '';
let fileName = '';

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type === 'text/plain') {
        fileName = file.name;
        const reader = new FileReader();
        reader.onload = function(e) {
            fileContent = e.target.result;
            document.getElementById('processButton').disabled = false;
        };
        reader.readAsText(file);
        document.getElementById('fileName').textContent = `Archivo cargado: ${fileName}`;
    } else {
        alert('Por favor, selecciona un archivo de texto (.txt).');
    }
});

document.getElementById('processButton').addEventListener('click', function() {
    if (!fileContent) {
        alert('Por favor cargue un archivo.');
        return;
    }
    validateFileContent(fileContent);
});

document.getElementById('clearButton').addEventListener('click', function() {
    document.getElementById('fileInput').value = '';
    document.getElementById('output').textContent = '';
    document.getElementById('fileName').textContent = '';
    document.getElementById('validationMessage').textContent = ''; // Borra el mensaje de validación
    fileContent = '';
    document.getElementById('processButton').disabled = true;
});

function validateFileContent(content) {
    const lines = content.split('\n');
    const specialCharactersRegex = /[^a-zA-Z0-9\s\-:]/; // Permite letras, números, espacios, "-" y ":"
    let output = '';
    let hasErrors = false;

    lines.forEach((line, index) => {
        const lineNumber = index + 1;
        if (specialCharactersRegex.test(line)) {
            hasErrors = true;
            output += `<span class="highlight">Línea ${lineNumber}:</span> ${line}\n`;
        }
    });

    document.getElementById('output').innerHTML = output;

    // Muestra el mensaje de validación arriba
    if (hasErrors) {
        document.getElementById('validationMessage').textContent = '⚠️ Se encontraron errores en el archivo. ¡Revísalos y corrígelos antes de continuar!';
        document.getElementById('validationMessage').style.color = 'red';
    } else {
        document.getElementById('validationMessage').textContent = '✅ Archivo correcto. ¡Puedo cargarlo en BANCOLOMBIA!';
        document.getElementById('validationMessage').style.color = 'green';
    }
}

function goToHome() {
    window.location.href = "../index.html"; // Cambia "index.html" por la ruta de la página principal
}
