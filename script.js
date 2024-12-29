// calculator.js
function calculateBolus(ke, time, isHighFat) {
    let fiaspBolus = 0;
    let actrapidBolus = 0;
    let bolusFactor;

    if (time === 'morgens') {
        const factor = localStorage.getItem('bolusFactorMorgens');
        if (!factor || isNaN(factor)) return ['Bolus Faktor Morgens fehlt.', 0];
        bolusFactor = parseFloat(factor)
    } else if (time === 'mittags') {
        const factor = localStorage.getItem('bolusFactorMittags');
        if (!factor || isNaN(factor)) return ['Bolus Faktor Mittags fehlt.', 0];
        bolusFactor = parseFloat(factor);
    } else if (time === 'abends') {
        const factor = localStorage.getItem('bolusFactorAbends');
        if (!factor || isNaN(factor)) return ['Bolus Faktor Abends fehlt.', 0];
        bolusFactor = parseFloat(factor);
    } else if (time === 'snack') {
        const factor = localStorage.getItem('bolusFactorSnack');
        if (!factor || isNaN(factor)) return ['Bolus Faktor Snack fehlt.', 0];
        bolusFactor = parseFloat(factor);
    }

    if (time === 'morgens' || time === 'mittags' || time === 'snack') {
        fiaspBolus = ke * bolusFactor;
        actrapidBolus = 0;
    } else if (time === 'abends') {
        let totalBolus = ke * bolusFactor;
        if (isHighFat) {
            fiaspBolus = totalBolus * (1 / 3);
            actrapidBolus = totalBolus * (2 / 3);
        } else {
            fiaspBolus = totalBolus * (2 / 3);
            actrapidBolus = totalBolus * (1 / 3);
        }
    }
    return [fiaspBolus, actrapidBolus];
}

document.addEventListener('DOMContentLoaded', () => {
    const timeButtons = document.querySelectorAll('.time-button');
    const fatButtons = document.querySelectorAll('.fat-button');
    const calculateButton = document.getElementById('calculate-button');
    const kohlenhydrateInput = document.getElementById('kohlenhydrate');
    const fiaspOutput = document.getElementById('fiasp');
    const actrapidOutput = document.getElementById('actrapid');
    const bolusFactorMorgensDisplay = document.getElementById('bolus-factor-morgens-display');
    const bolusFactorMittagsDisplay = document.getElementById('bolus-factor-mittags-display');
    const bolusFactorAbendsDisplay = document.getElementById('bolus-factor-abends-display');
    const bolusFactorSnackDisplay = document.getElementById('bolus-factor-snack-display');
    const configSection = document.getElementById('config-section');
    const configToggle = document.getElementById('config-toggle');
    const bolusFactorMorgensInput = document.getElementById('bolus-factor-morgens');
    const bolusFactorMittagsInput = document.getElementById('bolus-factor-mittags');
    const bolusFactorAbendsInput = document.getElementById('bolus-factor-abends');
    const bolusFactorSnackInput = document.getElementById('bolus-factor-snack');

    let selectedTime = null;
    let isHighFat = false;

    if (!localStorage.getItem('bolusFactorMorgens')) {
        bolusFactorMorgensInput.value = '0.8';
        localStorage.setItem('bolusFactorMorgens', '0.8');
    }
    bolusFactorMorgensDisplay.textContent = `(${localStorage.getItem('bolusFactorMorgens')})`;

    if (!localStorage.getItem('bolusFactorMittags')) {
        bolusFactorMittagsInput.value = '0.3';
        localStorage.setItem('bolusFactorMittags', '0.3');
    }
    bolusFactorMittagsDisplay.textContent = `(${localStorage.getItem('bolusFactorMittags')})`;

    if (!localStorage.getItem('bolusFactorAbends')) {
        bolusFactorAbendsInput.value = '0.5';
        localStorage.setItem('bolusFactorAbends', '0.5');
    }
    bolusFactorAbendsDisplay.textContent = `(${localStorage.getItem('bolusFactorAbends')})`;

    if (!localStorage.getItem('bolusFactorSnack')) {
        bolusFactorSnackInput.value = '0.5';
        localStorage.setItem('bolusFactorSnack', '0.5');
    }
    bolusFactorSnackDisplay.textContent = `(${localStorage.getItem('bolusFactorSnack')})`;

    configToggle.addEventListener('click', () => {
        configSection.style.display = configSection.style.display === 'none' ? 'block' : 'none';
    });

    bolusFactorMorgensInput.addEventListener('change', function () {
        localStorage.setItem('bolusFactorMorgens', this.value);
        bolusFactorMorgensDisplay.textContent = `(${this.value})`;
    });

    bolusFactorMittagsInput.addEventListener('change', function () {
        localStorage.setItem('bolusFactorMittags', this.value);
        bolusFactorMittagsDisplay.textContent = `(${this.value})`;
    });

    bolusFactorAbendsInput.addEventListener('change', function () {
        localStorage.setItem('bolusFactorAbends', this.value);
        bolusFactorAbendsDisplay.textContent = `(${this.value})`;
    });

    bolusFactorSnackInput.addEventListener('change', function () {
        localStorage.setItem('bolusFactorSnack', this.value);
        bolusFactorSnackDisplay.textContent = `(${this.value})`;
    });

    function selectButton(group, selectedButton) {
        group.forEach(button => {
            button.classList.remove('selected');
        });
        selectedButton.classList.add('selected');
    }

    timeButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectButton(timeButtons, this);
            selectedTime = this.dataset.time;
        });
    });

    fatButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectButton(fatButtons, this);
            isHighFat = this.dataset.fat === 'fettreich';
        });
    });

    calculateButton.addEventListener('click', () => {
        const kohlenhydrateinheiten = parseFloat(kohlenhydrateInput.value);

        if (isNaN(kohlenhydrateinheiten)) {
            fiaspOutput.value = 'Ungültige Eingabe';
            actrapidOutput.value = 'Ungültige Eingabe';
            return;
        }

        if (!selectedTime) {
            fiaspOutput.value = 'Bitte Zeitpunkt auswählen';
            actrapidOutput.value = 'Bitte Zeitpunkt auswählen';
            return;
        }

        const [fiaspBolus, actrapidBolus] = calculateBolus(kohlenhydrateinheiten, selectedTime, isHighFat);
        if (isNaN(fiaspBolus) || isNaN(actrapidBolus)) {
            fiaspOutput.value = fiaspBolus;
            actrapidOutput.value = actrapidBolus;
            return;
        }
        fiaspOutput.value = fiaspBolus.toFixed(1);
        actrapidOutput.value = actrapidBolus.toFixed(1);
    });
});
