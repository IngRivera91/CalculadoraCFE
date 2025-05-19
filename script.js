document.addEventListener('DOMContentLoaded', () => {
    const limiteBajoInput = document.getElementById('limiteBajo');
    const precioBajoInput = document.getElementById('precioBajo');
    const limiteMedioInput = document.getElementById('limiteMedio');
    const precioMedioInput = document.getElementById('precioMedio');
    const precioAltoInput = document.getElementById('precioAlto');
    const consumoTotalInput = document.getElementById('consumoTotal');
    const calcularBtn = document.getElementById('calcularBtn');

    // Modal elements
    const resultsModal = document.getElementById('resultsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');

    // Result spans
    const kwhBajoResSpan = document.getElementById('kwhBajoRes');
    const costoBajoResSpan = document.getElementById('costoBajoRes');
    const kwhMedioResSpan = document.getElementById('kwhMedioRes');
    const costoMedioResSpan = document.getElementById('costoMedioRes');
    const kwhAltoResSpan = document.getElementById('kwhAltoRes');
    const costoAltoResSpan = document.getElementById('costoAltoRes');
    const subtotalResSpan = document.getElementById('subtotalRes');
    const ivaResSpan = document.getElementById('ivaRes');
    const totalFinalResSpan = document.getElementById('totalFinalRes');

    // Tariff section toggle functionality
    const tariffGroupHeaders = document.querySelectorAll('.tariff-group > h3');
    tariffGroupHeaders.forEach(header => {
        const content = header.nextElementSibling; // This should be the div.input-row
        const indicator = header.querySelector('.toggle-indicator');

        if (!content || !content.classList.contains('toggleable-content')) {
            console.error('Could not find toggleable content for header:', header);
            return;
        }
        if (!indicator) {
            console.error('Could not find toggle indicator for header:', header);
            return;
        }
        
        // Initial state is set by CSS via .content-hidden and indicator text in HTML

        header.addEventListener('click', () => {
            content.classList.toggle('content-hidden');
            if (content.classList.contains('content-hidden')) {
                indicator.textContent = '+';
                // content.style.display = 'none'; // Not needed if using class
            } else {
                indicator.textContent = '−'; // Unicode minus sign
                // content.style.display = 'flex'; // Not needed if removing class sets it back to flex via CSS
            }
        });
    });


    calcularBtn.addEventListener('click', calcularCosto);

    function calcularCosto() {
        const limiteBajo = parseFloat(limiteBajoInput.value) || 0;
        const precioBajo = parseFloat(precioBajoInput.value) || 0;
        const limiteMedio = parseFloat(limiteMedioInput.value) || 0;
        const precioMedio = parseFloat(precioMedioInput.value) || 0;
        const precioAlto = parseFloat(precioAltoInput.value) || 0;
        const consumoTotal = parseFloat(consumoTotalInput.value) || 0;

        if (consumoTotal <= 0 && consumoTotalInput.value !== "0") { // Allow 0 consumption
             alert("Por favor, ingrese un consumo total válido.");
             consumoTotalInput.focus();
             return;
        }
        if (consumoTotal < 0) {
            alert("El consumo total no puede ser negativo.");
            consumoTotalInput.focus();
            return;
        }
        if (limiteBajo < 0 || limiteMedio < 0 || precioBajo < 0 || precioMedio < 0 || precioAlto < 0) {
            alert("Los límites y precios de las tarifas no pueden ser negativos.");
            return;
        }
        if ( isNaN(parseFloat(limiteBajoInput.value)) || isNaN(parseFloat(precioBajoInput.value)) ||
             isNaN(parseFloat(limiteMedioInput.value)) || isNaN(parseFloat(precioMedioInput.value)) ||
             isNaN(parseFloat(precioAltoInput.value)) ) {
            alert("Por favor, complete todos los campos de tarifas con valores numéricos.");
            return;
        }


        let kwhBajo = 0;
        let kwhMedio = 0;
        let kwhAlto = 0;

        let consumoRestante = consumoTotal;

        // Calcular kWh en tarifa baja
        if (consumoRestante > 0) {
            kwhBajo = Math.min(consumoRestante, limiteBajo);
            consumoRestante -= kwhBajo;
        }

        // Calcular kWh en tarifa media
        if (consumoRestante > 0) {
            kwhMedio = Math.min(consumoRestante, limiteMedio);
            consumoRestante -= kwhMedio;
        }

        // Calcular kWh en tarifa alta
        if (consumoRestante > 0) {
            kwhAlto = consumoRestante;
        }

        const costoBajo = kwhBajo * precioBajo;
        const costoMedio = kwhMedio * precioMedio;
        const costoAlto = kwhAlto * precioAlto;

        const subtotal = costoBajo + costoMedio + costoAlto;
        const iva = subtotal * 0.16; // 16% IVA
        const totalFinal = subtotal + iva;

        kwhBajoResSpan.textContent = kwhBajo.toFixed(2);
        costoBajoResSpan.textContent = costoBajo.toFixed(2);
        kwhMedioResSpan.textContent = kwhMedio.toFixed(2);
        costoMedioResSpan.textContent = costoMedio.toFixed(2);
        kwhAltoResSpan.textContent = kwhAlto.toFixed(2);
        costoAltoResSpan.textContent = costoAlto.toFixed(2);
        subtotalResSpan.textContent = subtotal.toFixed(2);
        ivaResSpan.textContent = iva.toFixed(2);
        totalFinalResSpan.textContent = totalFinal.toFixed(2);

        // Display the modal
        resultsModal.style.display = 'flex'; // Use flex for easy centering defined in CSS
    }

    // Close modal when the close button is clicked
    closeModalBtn.addEventListener('click', () => {
        resultsModal.style.display = 'none';
    });

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === resultsModal) {
            resultsModal.style.display = 'none';
        }
    });
});