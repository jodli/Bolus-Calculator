// calculator.js
function calculateBolus(ke, time, isHighFat) {
    let fiaspBolus = 0;
    let actrapidBolus = 0;
    let bolusFactor = 1;

    if (time === 'morgens') {
        bolusFactor = parseFloat(localStorage.getItem('bolusFactorMorgens')) || 0.8;
    } else if (time === 'mittags') {
        bolusFactor = parseFloat(localStorage.getItem('bolusFactorMittags')) || 0.3;
    } else if (time === 'abends') {
        bolusFactor = parseFloat(localStorage.getItem('bolusFactorAbends')) || 0.5;
    } else if (time === 'snack') {
        bolusFactor = parseFloat(localStorage.getItem('bolusFactorSnack')) || 0.5;
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

    bolusFactorMorgensDisplay.textContent = `(${localStorage.getItem('bolusFactorMorgens') || '0.8'})`;
    bolusFactorMittagsDisplay.textContent = `(${localStorage.getItem('bolusFactorMittags') || '0.3'})`;
    bolusFactorAbendsDisplay.textContent = `(${localStorage.getItem('bolusFactorAbends') || '0.5'})`;
    bolusFactorSnackDisplay.textContent = `(${localStorage.getItem('bolusFactorSnack') || '0.5'})`;

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
        fiaspOutput.value = fiaspBolus.toFixed(1);
        actrapidOutput.value = actrapidBolus.toFixed(1);
    });
});
