// calculator.js
function calculateBolus(ke, time, isHighFat) {
    let bolusFactor = 0;
    if (time === 'morgens') {
        bolusFactor = 1.5;
    } else if (time === 'mittags' || time === 'abends') {
        bolusFactor = 1.0;
    } else if (time === 'snack') {
        bolusFactor = 0.8;
    }

    let bolus = ke * bolusFactor;

    if (isHighFat) {
        bolus *= 1.2;
    }

    return bolus;
}

document.addEventListener('DOMContentLoaded', () => {
    const timeButtons = document.querySelectorAll('.time-button');
    const fatButtons = document.querySelectorAll('.fat-button');
    const calculateButton = document.getElementById('calculate-button');
    const kohlenhydrateInput = document.getElementById('kohlenhydrate');
    const fiaspOutput = document.getElementById('fiasp');
    const actrapidOutput = document.getElementById('actrapid');

    let selectedTime = null;
    let isHighFat = false;

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

        const bolus = calculateBolus(kohlenhydrateinheiten, selectedTime, isHighFat);
        fiaspOutput.value = bolus.toFixed(1);
        actrapidOutput.value = bolus.toFixed(1);
    });
});
