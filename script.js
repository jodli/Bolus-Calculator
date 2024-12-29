const BOLUS_FACTOR_MORGENS_KEY = 'bolusFactorMorgens';
const BOLUS_FACTOR_MITTAGS_KEY = 'bolusFactorMittags';
const BOLUS_FACTOR_ABENDS_KEY = 'bolusFactorAbends';
const BOLUS_FACTOR_SNACK_KEY = 'bolusFactorSnack';

function initializeBolusFactors() {
    const BOLUS_FACTOR_MORGENS_ID = 'bolus-factor-morgens';
    const BOLUS_FACTOR_MITTAGS_ID = 'bolus-factor-mittags';
    const BOLUS_FACTOR_ABENDS_ID = 'bolus-factor-abends';
    const BOLUS_FACTOR_SNACK_ID = 'bolus-factor-snack';
    const DEFAULT_BOLUS_FACTOR_MORGENS = '0.8';
    const DEFAULT_BOLUS_FACTOR_MITTAGS = '0.3';
    const DEFAULT_BOLUS_FACTOR_ABENDS = '0.5';
    const DEFAULT_BOLUS_FACTOR_SNACK = '0.5';

    const bolusFactorMorgensInput = document.getElementById(BOLUS_FACTOR_MORGENS_ID);
    const bolusFactorMittagsInput = document.getElementById(BOLUS_FACTOR_MITTAGS_ID);
    const bolusFactorAbendsInput = document.getElementById(BOLUS_FACTOR_ABENDS_ID);
    const bolusFactorSnackInput = document.getElementById(BOLUS_FACTOR_SNACK_ID);
    const bolusFactorMorgensDisplay = document.getElementById(BOLUS_FACTOR_MORGENS_ID + '-display');
    const bolusFactorMittagsDisplay = document.getElementById(BOLUS_FACTOR_MITTAGS_ID + '-display');
    const bolusFactorAbendsDisplay = document.getElementById(BOLUS_FACTOR_ABENDS_ID + '-display');
    const bolusFactorSnackDisplay = document.getElementById(BOLUS_FACTOR_SNACK_ID + '-display');

    if (!localStorage.getItem(BOLUS_FACTOR_MORGENS_KEY)) {
        bolusFactorMorgensInput.value = DEFAULT_BOLUS_FACTOR_MORGENS;
        localStorage.setItem(BOLUS_FACTOR_MORGENS_KEY, DEFAULT_BOLUS_FACTOR_MORGENS);
    }
    bolusFactorMorgensDisplay.textContent = `(${localStorage.getItem(BOLUS_FACTOR_MORGENS_KEY)})`;

    if (!localStorage.getItem(BOLUS_FACTOR_MITTAGS_KEY)) {
        bolusFactorMittagsInput.value = DEFAULT_BOLUS_FACTOR_MITTAGS;
        localStorage.setItem(BOLUS_FACTOR_MITTAGS_KEY, DEFAULT_BOLUS_FACTOR_MITTAGS);
    }
    bolusFactorMittagsDisplay.textContent = `(${localStorage.getItem(BOLUS_FACTOR_MITTAGS_KEY)})`;

    if (!localStorage.getItem(BOLUS_FACTOR_ABENDS_KEY)) {
        bolusFactorAbendsInput.value = DEFAULT_BOLUS_FACTOR_ABENDS;
        localStorage.setItem(BOLUS_FACTOR_ABENDS_KEY, DEFAULT_BOLUS_FACTOR_ABENDS);
    }
    bolusFactorAbendsDisplay.textContent = `(${localStorage.getItem(BOLUS_FACTOR_ABENDS_KEY)})`;

    if (!localStorage.getItem(BOLUS_FACTOR_SNACK_KEY)) {
        bolusFactorSnackInput.value = DEFAULT_BOLUS_FACTOR_SNACK;
        localStorage.setItem(BOLUS_FACTOR_SNACK_KEY, DEFAULT_BOLUS_FACTOR_SNACK);
    }
    bolusFactorSnackDisplay.textContent = `(${localStorage.getItem(BOLUS_FACTOR_SNACK_KEY)})`;

    bolusFactorMorgensInput.addEventListener('change', function () {
        localStorage.setItem(BOLUS_FACTOR_MORGENS_KEY, this.value);
        bolusFactorMorgensDisplay.textContent = `(${this.value})`;
    });

    bolusFactorMittagsInput.addEventListener('change', function () {
        localStorage.setItem(BOLUS_FACTOR_MITTAGS_KEY, this.value);
        bolusFactorMittagsDisplay.textContent = `(${this.value})`;
    });

    bolusFactorAbendsInput.addEventListener('change', function () {
        localStorage.setItem(BOLUS_FACTOR_ABENDS_KEY, this.value);
        bolusFactorAbendsDisplay.textContent = `(${this.value})`;
    });

    bolusFactorSnackInput.addEventListener('change', function () {
        localStorage.setItem(BOLUS_FACTOR_SNACK_KEY, this.value);
        bolusFactorSnackDisplay.textContent = `(${this.value})`;
    });
}
// calculator.js
function calculateBolus(ke, time, isHighFat) {
    let fiaspBolus = 0;
    let actrapidBolus = 0;
    let bolusFactor;

    if (time === 'morgens') {
        const factor = localStorage.getItem(BOLUS_FACTOR_MORGENS_KEY);
        if (!factor || isNaN(factor)) return ['Bolus Faktor Morgens fehlt.', 0];
        bolusFactor = parseFloat(factor)
    } else if (time === 'mittags') {
        const factor = localStorage.getItem(BOLUS_FACTOR_MITTAGS_KEY);
        if (!factor || isNaN(factor)) return ['Bolus Faktor Mittags fehlt.', 0];
        bolusFactor = parseFloat(factor);
    } else if (time === 'abends') {
        const factor = localStorage.getItem(BOLUS_FACTOR_ABENDS_KEY);
        if (!factor || isNaN(factor)) return ['Bolus Faktor Abends fehlt.', 0];
        bolusFactor = parseFloat(factor);
    } else if (time === 'snack') {
        const factor = localStorage.getItem(BOLUS_FACTOR_SNACK_KEY);
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
    const configSection = document.getElementById('config-section');
    const configToggle = document.getElementById('config-toggle');

    let selectedTime = null;
    let isHighFat = false;

    initializeBolusFactors();

    configToggle.addEventListener('click', () => {
        configSection.style.display = configSection.style.display === 'none' ? 'block' : 'none';
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
