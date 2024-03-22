console.log("Script cargado");

window.onload = function () {
    populateLoanTypes();

    // Cambia la forma en que se agrega el evento onchange
    const loanTypeDropdown = document.getElementById("loan-type");
    loanTypeDropdown.addEventListener('change', updateLoanTerms);

       // Agrega la siguiente línea para asegurarte de que selectedLoanTypeElement tenga un valor inicial
       updateLoanTerms();
};

const loanTypes = [
    { type: "Falcon Personal", rate: 0.5, terms: [3, 6, 9, 12] },
    { type: "Falcon Express", rate: 0.5, terms: [3, 6] },
    { type: "Falcon Negocio", rate: 0.5, terms: [3, 6, 9, 12] },
    { type: "Falcon Incubadora", rate: 0.5, terms: [6, 9, 12, 18] }
];

function populateLoanTypes() {
    console.log("Entro a populateLoanTypes");
    const loanTypeDropdown = document.getElementById("loan-type");

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.text = "Escoja el tipo de crédito";
    defaultOption.disabled = true;
    loanTypeDropdown.add(defaultOption);

    loanTypes.forEach(loan => {
        const option = document.createElement("option");
        option.value = loan.rate;
        option.text = loan.type;
        loanTypeDropdown.add(option);
    });

    loanTypeDropdown.value = "";
}

function updateLoanTerms() {
    const plazoElemento = document.getElementById("loan-term");

    plazoElemento.innerHTML = "";

    const loanTermOptions = {
        "Falcon Personal": [3, 6, 9, 12],
        "Falcon Express": [3, 6],
        "Falcon Negocio": [3, 6, 9, 12],
        "Falcon Incubadora": [6, 9, 12, 18]
    };

    const selectedLoanType = document.getElementById("loan-type").options[document.getElementById("loan-type").selectedIndex].text;
    const plazos = loanTermOptions[selectedLoanType] || [];

    plazos.forEach(term => {
        const option = document.createElement("option");
        option.value = term;
        option.text = `${term} meses`;
        plazoElemento.add(option);
    });
}

const loanAmountLimits = {
    "Falcon Personal": 50000,
    "Falcon Express": 10000,
    "Falcon Negocio": 200000,
    "Falcon Incubadora": Infinity // No hay límite
};
function calculatePayment() {
    const selectedLoanTypeElement = document.getElementById("loan-type");
  
    if (!selectedLoanTypeElement) {
        console.error("Element with id 'loan-type' not found.");
        return null;}

        const selectedLoanType = selectedLoanTypeElement.options[selectedLoanTypeElement.selectedIndex].text;
        const loanAmount = parseFloat(document.getElementById("loan-amount").value);
    
        // Validar el monto del préstamo según el límite correspondiente
        const loanAmountLimit = loanAmountLimits[selectedLoanType];
        if (isNaN(loanAmount) || loanAmount <= 0 || (loanAmountLimit !== Infinity && loanAmount > loanAmountLimit)) {
            alert(`Por favor, ingresa un monto de préstamo válido para el tipo de préstamo ${selectedLoanType}. El límite de préstamo para ${selectedLoanType} es $${loanAmountLimit.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`);
            return null;
        }
    
    const interestRate = parseFloat(selectedLoanTypeElement.value);
    const loanTerm = parseInt(document.getElementById("loan-term").value);
    const paymentMethod = document.getElementById("payment-method").value;

    
    
    if (isNaN(loanAmount) || isNaN(interestRate) || isNaN(loanTerm) || paymentMethod === "") {
        alert("Por favor, ingresa valores válidos para calcular el pago.");
        return null;
    }
    
    const openingCost = 0.02 * loanAmount;
    const monthlyInterestRate = (interestRate / 12) * loanTerm;
    
    let totalPayments;
    if (paymentMethod === "semanal") {
        totalPayments = loanTerm * (52 / 12);
    } else if (paymentMethod === "quincenal") {
        totalPayments = loanTerm * 2;
    } else if (paymentMethod === "mensual") {
        totalPayments = loanTerm;
    }
    
    let cuota;
    
    const interestAmount = loanAmount * monthlyInterestRate;
    const ivaInterest = interestAmount * 0.16;
    const partialIva = ivaInterest / totalPayments;
    
    cuota = (loanAmount / totalPayments) + (loanAmount * monthlyInterestRate) / totalPayments;
    
    const totalPayment = (cuota * totalPayments);
    
    const dispositionOfCredit = loanAmount - openingCost;
    
    const resultsContainer = document.getElementById("results-container");
    let resultsHTML = `
        <p>A continuación, encontrarás un resumen de los términos clave del préstamo:</p>
        <p>*Los resultados proporcionados son meramente informativos y no constituyen una oferta definitiva.</p>
        <p>Costo de Apertura: $${openingCost.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
    `;
    
    if (selectedLoanTypeElement.selectedIndex >= 0) {
        const selectedLoanType = selectedLoanTypeElement.options[selectedLoanTypeElement.selectedIndex].text;
    
        if (selectedLoanType === "Falcon Negocio" || selectedLoanType === "Falcon Incubadora") {
            resultsHTML += `
                <p>Cuota: $${cuota.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p>Pago Total: $${totalPayment.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            `;
        } else if (selectedLoanType === "Falcon Personal" || selectedLoanType === "Falcon Express") {
            resultsHTML += `
                <p>Cuota (IVA Incluido): $${(cuota + partialIva).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p>Pago Total (IVA Incluido): $${(totalPayment+ivaInterest).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p>IVA Interés (16%): $${ivaInterest.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            `;
        }
    }
    
    resultsHTML += `
        <p>Disposición de Crédito: $${dispositionOfCredit.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        <p class="notasalpie">*Tasa de simulador correspondiente al máximo del producto seleccionado. La tasa real aplicable está sujeta a análisis de crédito.</p>
    `;
    
    resultsContainer.innerHTML = resultsHTML;
    
        // Mostrar el botón de generar tabla de pagos
        const generateTableBtn = document.getElementById("generate-table-btn");
        if (generateTableBtn) {
            generateTableBtn.style.display = "block";
        }
    
        // Ocultar el botón de descargar PDF
        const downloadPDFBtn = document.getElementById("download-pdf-btn");
        if (downloadPDFBtn) {
            downloadPDFBtn.style.display = "none";
        }
    
        return cuota; // Devolver el valor de la cuota
    }

    function generatePaymentTable() {
        const selectedLoanTypeElement = document.getElementById("loan-type");
        const interestRate = parseFloat(selectedLoanTypeElement.value);
        const loanTerm = parseInt(document.getElementById("loan-term").value);
        const paymentMethod = document.getElementById("payment-method").value;
        const loanAmount = parseFloat(document.getElementById("loan-amount").value);
    
        // Obtener el valor de la cuota usando la función calculatePayment
        let cuota = calculatePayment();
    
        if (cuota === null) {
            // Si hay un error en el cálculo, no continuar
            return;
        }
    
        // Calcular el número total de pagos según la duración del préstamo y la frecuencia del método de pago
        let totalPayments;
    
        if (paymentMethod === "semanal") {
            totalPayments = loanTerm * (52 / 12);
        } else if (paymentMethod === "quincenal") {
            totalPayments = loanTerm * 2;
        } else if (paymentMethod === "mensual") {
            totalPayments = loanTerm;
        }
    
        const monthlyInterestRate = (interestRate / 12) *loanTerm;
        const interestAmount = loanAmount * monthlyInterestRate;
        const ivaInterest = interestAmount * 0.16;
        const partialIva = ivaInterest / totalPayments;
    
        // Guardar los resultados existentes
        const existingResults = document.getElementById("results-container").innerHTML;
    
        // Crear un párrafo antes de la tabla y asignar el contenido deseado
        const paragraphBeforeTable = document.createElement("p");
        paragraphBeforeTable.textContent = "Este esquema te permite visualizar el progreso y la influencia de cada pago en la reducción de tu deuda total. Para consultas adicionales, nuestro equipo está a tu disposición.";
    
        // Declarar e inicializar tableContainer antes de usarlo
        const tableContainer = document.createElement("div");
        tableContainer.id = "payment-table-container";
    
        const table = document.createElement("table");
        table.innerHTML = `
            <thead>
                <caption>Tabla de Pagos</caption>
                <tr>
                    <th>Periodo</th>
                    <th>Capital</th>
                    <th>Interés</th>
                    <th>IVA</th> ${selectedLoanTypeElement.value === "Falcon Personal" || selectedLoanTypeElement.value === "Falcon Express" ? '<th>IVA Interés</th>' : ''}
                    <th>Total Pago</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        `;
    
        const tbody = table.querySelector("tbody");
    
        // Generar la tabla con los pagos
       // Generar la tabla con los pagos
    let remainingLoanAmount = parseFloat(document.getElementById("loan-amount").value);
    console.log("partialIva:", partialIva);
    for (let i = 1; i <= totalPayments; i++) {
        const interestPayment = (loanAmount * monthlyInterestRate) / totalPayments;
        console.log("selectedLoanTypeElement.value:", selectedLoanTypeElement.value);
        const ivaInterestPayment = document.getElementById("loan-type").options[document.getElementById("loan-type").selectedIndex].text === "Falcon Personal" || document.getElementById("loan-type").options[document.getElementById("loan-type").selectedIndex].text === "Falcon Express" ? partialIva: 0;
        console.log("ivaInterestPayment:", ivaInterestPayment);
        
            const principalPayment = cuota - interestPayment;
            const totalPayment = cuota + ivaInterestPayment;
    
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${i}</td>
                <td>$${formatCurrency(principalPayment)}</td>
                <td>$${formatCurrency(interestPayment)}</td>
                <td>$${formatCurrency(ivaInterestPayment)}</td>${selectedLoanTypeElement.value === "Falcon Personal" || selectedLoanTypeElement.value === "Falcon Express" ? `<td>$${formatCurrency(ivaInterestPayment)}</td>` : ''}
                <td>$${formatCurrency(totalPayment)}</td>
            `;
    
            tbody.appendChild(row);
    
            remainingLoanAmount -= principalPayment;
    
            // Evitar saldo negativo
            if (remainingLoanAmount < 0) {
                remainingLoanAmount = 0;
            }
        }
    
        // Función auxiliar para formatear la moneda
        function formatCurrency(amount) {
            return amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    
        // Agregar el párrafo antes de la tabla
        tableContainer.appendChild(paragraphBeforeTable);
    
        // Agregar la tabla al contenedor
        tableContainer.appendChild(table);
    
        // Restaurar los resultados existentes y agregar la tabla y el párrafo adicional
        const resultsContainer = document.getElementById("results-container");
        resultsContainer.innerHTML = existingResults;
        resultsContainer.appendChild(tableContainer);
    
        // Ocultar el botón de generar tabla de pagos después de generar la tabla
        const generateTableBtn = document.getElementById("generate-table-btn");
        if (generateTableBtn) {
            generateTableBtn.style.display = "none";
        }
    
        // Mostrar el botón de descargar PDF después de generar la tabla
        const downloadPDFBtn = document.getElementById("download-pdf-btn");
        if (downloadPDFBtn) {
            downloadPDFBtn.style.display = "block";
        }
    
        // Agregar el párrafo después de la tabla
        const additionalText = document.createElement("p");
        additionalText.classList.add("additional-text", "notasalpie");
        additionalText.textContent = "*Tasa de simulador correspondiente al máximo del producto seleccionado. La tasa real aplicable está sujeta a análisis de crédito.";
    
        resultsContainer.appendChild(additionalText);
    }
    

    function downloadPDF() {
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

    const textColor = [255, 255, 255];
        let loanAmount = parseFloat(document.getElementById("loan-amount").value);
        const selectedLoanTypeElement = document.getElementById("loan-type");
        const interestRate = parseFloat(selectedLoanTypeElement.value);
        const loanTerm = parseInt(document.getElementById("loan-term").value);
        const paymentMethod = document.getElementById("payment-method").value;
        const espacioSeparacion = 4; 
        const fontSize = 10;
        
        

    
        // Obtener el valor de la cuota usando la función calculatePayment
        let cuota = calculatePayment();
    
        if (cuota === null) {
            // Si hay un error en el cálculo, no continuar
            return;
        }
    
        // Calcular el número total de pagos según la duración del préstamo y la frecuencia del método de pago
        let totalPayments;
    
        if (paymentMethod === "semanal") {
            totalPayments = loanTerm * (52 / 12);
        } else if (paymentMethod === "quincenal") {
            totalPayments = loanTerm * 2;
        } else if (paymentMethod === "mensual") {
            totalPayments = loanTerm;
        }
        const openingCost = 0.02 * loanAmount;
        const monthlyInterestRate = (interestRate / 12) *loanTerm;
        const interestAmount = loanAmount * monthlyInterestRate;
        const ivaInterest = interestAmount * 0.16;
        const partialIva = ivaInterest / totalPayments;
        const colWidth = pdf.internal.pageSize.width / 6;
        const rowHeight = 7;
        let startY = 65;
    
        // Crear un nuevo objeto jsPDF
        
    
        function drawTableHeader() {
            pdf.setFillColor(61, 1, 15);
            pdf.setTextColor(242,228,191);
            pdf.rect(20, startY, colWidth, rowHeight, "F");
            pdf.rect(20 + colWidth, startY, colWidth, rowHeight, "F");
            pdf.rect(20 + colWidth * 2, startY, colWidth, rowHeight, "F");
            pdf.rect(20 + colWidth * 3, startY, colWidth, rowHeight, "F");
            pdf.rect(20 + colWidth * 4, startY, colWidth, rowHeight, "F");
    
            const texts = ["Periodo", "Capital", "Interés", "IVA", "Pago Total"];
            for (let j = 0; j < texts.length; j++) {
                const text = texts[j];
                const textWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
                const textHeight = fontSize;
    
                const startX = 20 + colWidth * j + (colWidth - textWidth) / 2;
                const startYText = startY + rowHeight / 2 + textHeight / 8;
    
    
                pdf.text(text, startX, startYText, { valign: 'middle' });
            }
        }

        
    
        function drawTableRow(data, rowIndex, yOffset) {
            for (let j = 0; j < data.length; j++) {
                const cellText = String(data[j]);
                const textWidth = pdf.getStringUnitWidth(cellText) * 10 / pdf.internal.scaleFactor;
                const textHeight = 10;
    
                const startX = 20 + colWidth * j + (colWidth - textWidth) / 2;
                const startYText = startY + yOffset + rowHeight / 2 + textHeight / 8;
    
                pdf.setFillColor((rowIndex % 2 === 0) ? 255 : 242, (rowIndex % 2 === 0) ? 255 : 228, (rowIndex % 2 === 0) ? 255 : 191);
                pdf.rect(20 + colWidth * j, startY + yOffset, colWidth, rowHeight, 'F');
    
                pdf.text(cellText, startX, startYText, { align: 'center', valign: 'middle' });
            }
        }
       
        function drawTable(data) {
            pdf.setTextColor(61,1,15);
            pdf.setFont("Libre Baskerville", "regular");
            let yOffset = rowHeight; // To account for header
            let currentPage = 1; // Variable para llevar un registro de la página actual
            let lastRowY = 0; // Variable para almacenar la posición Y de la última fila en la página anterior
            for (let i = 0; i < data.length; i++) {
                const rowData = data[i];
        
                if (yOffset + rowHeight > pdf.internal.pageSize.height) {
                    pdf.addPage();
                    currentPage++;
                    if (currentPage === 2) {
                        // Si estamos en la segunda página, establecer lastRowY como la posición Y de la última fila en la página anterior
                        lastRowY = startY;
                    }
                    yOffset = rowHeight; // Reiniciar yOffset para comenzar desde la parte superior de la página
                }
        
                drawTableRow(rowData, i, yOffset);
                yOffset += rowHeight;
        
                if (currentPage === 2 && i === 0) {
                    // Si estamos en la segunda página y es la primera fila, ajustar yOffset para comenzar desde lastRowY
                    yOffset = lastRowY;
                }
            }
        }
        
        
    
    
        
    
        pdf.setFont("Libre Baskerville", 'bold');
    
        var pageWidth = pdf.internal.pageSize.width || pdf.internal.pageSize.getWidth();
        var text = "Tabla de Pagos";
        var textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        var xPosition = (pageWidth - textWidth) / 2;
    
        pdf.text(text, xPosition, 15);


        pdf.setFont("Libre Baskerville", "regular");
        pdf.setFontSize (10);
        let p1 = "Nos complace informarte que tu solicitud de préstamo ha sido preaprobada. A continuación, te presentamos un resumen breve de las condiciones del préstamo:";
        let maxWidth = 150;
        let verticalOffset = 25;
        let textLines = pdf.splitTextToSize(p1, maxWidth);
    
        textLines.forEach((line) => {
            pdf.text(line, 20, verticalOffset);
            verticalOffset += 4;
        });
    
        pdf.setFont("Libre Baskerville", "regular");
        pdf.setFontSize(10);
        let posY = 35;
    
        pdf.text(`-Monto Solicitado: $${loanAmount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, posY);
        posY += espacioSeparacion;
    
        pdf.text(`-Plazo del Préstamo: ${loanTerm} meses`, 20, posY);
        posY += espacioSeparacion;
    
        pdf.text(`-Tasa de Interés Anual: ${interestRate.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`, 20, posY);
        posY += espacioSeparacion;
    
        pdf.text(`-Costo de Apertura: $${openingCost.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, posY);
        posY += espacioSeparacion;
    
        pdf.text(`-Cuota Mensual Estimada: $${(cuota+partialIva).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, posY);
        posY += espacioSeparacion;
    
        const totalPayment = cuota * totalPayments + openingCost;
        pdf.text(`-Pago Total Estimado: $${totalPayment.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 20, posY);
        posY += espacioSeparacion;
    
        pdf.setFont("Libre Baskerville", "bold");
    
        const tableData = [];
    
        for (let i = 1; i <= totalPayments; i++) {
            const interestPayment = interestAmount / totalPayments;
            const ivaInterestPayment = selectedLoanTypeElement.options[selectedLoanTypeElement.selectedIndex].text === "Falcon Personal" || selectedLoanTypeElement.options[selectedLoanTypeElement.selectedIndex].text === "Falcon Express" ? partialIva : 0;
            const principalPayment = cuota - interestPayment;
            const totalPayment = cuota + ivaInterestPayment;
    
            const iFormatted = i.toLocaleString('es-MX');
            const principalFormatted = principalPayment.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            const interestFormatted = interestPayment.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            const ivaInterestFormatted = ivaInterestPayment.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
            const totalFormatted = totalPayment.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
    
            tableData.push([iFormatted, principalFormatted, interestFormatted, ivaInterestFormatted, totalFormatted]);
    
            loanAmount -= principalPayment;
            if (loanAmount < 0) {
                loanAmount = 0;
            }
        }
    
        
        
        drawTableHeader();
        drawTable(tableData);
    
        pdf.setTextColor(0);
    
        const tableHeight = rowHeight * (tableData.length + 1);
        let verticalOffset2 = startY + (tableHeight) + 15;
    
        pdf.setFont("Libre Baskerville", "regular");
        pdf.setFontSize(10);
        let p2 = "Si tienes alguna pregunta o necesitas asistencia durante el proceso de solicitud, nuestro equipo de servicio al cliente está aquí para ayudarte. Esperamos brindarte el apoyo financiero que necesitas.";
        let maxWidth2 = 150;
        let textLines2 = pdf.splitTextToSize(p2, maxWidth2);
    
        textLines2.forEach((line) => {
            pdf.text(line, 20, verticalOffset2);
            verticalOffset2 += 4;
        });
    
        let heightOfParrafo2 = textLines2.length * 4;
    
        pdf.setFontSize(7);
        pdf.setFont("Libre Baskerville", 'italic');
        let Notas = "*Tasa de simulador correspondiente al máximo del producto seleccionado. La tasa real aplicable está sujeta a análisis de crédito.*La aprobación final está sujeta a la revisión y aprobación por parte de nuestra institución financiera.*Pueden realizarse ajustes durante este proceso, y te informaremos oportunamente de cualquier cambio.";
        let maxWidthNotas = 150;
        let verticalOffsetNotas = verticalOffset2 + heightOfParrafo2 + 0;
    
        let textLinesNotas = pdf.splitTextToSize(Notas, maxWidthNotas);
    
        // Verificar si hay espacio suficiente en la página actual
if (pdf.internal.pageSize.height - verticalOffset2 < rowHeight) {
    pdf.addPage();
    verticalOffset2 = 15;
    
}
    
        pdf.setTextColor(0);
    
        const tableHeight2 = rowHeight * (tableData.length + 1);
        let verticalOffset2_2 = verticalOffset2 + (tableHeight2) + 15;
    
        textLinesNotas.forEach((line) => {
            pdf.text(line, 20, verticalOffset2_2);
            verticalOffset2_2 += 4;
        });
    
        pdf.save("Tabla_Pagos_CréditoFalcon.pdf");
    }
    
    

    

window.onload = function () {
    populateLoanTypes();

    // Cambia la forma en que se agrega el evento onchange
    const loanTypeDropdown = document.getElementById("loan-type");
    loanTypeDropdown.addEventListener('change', updateLoanTerms);
}; 