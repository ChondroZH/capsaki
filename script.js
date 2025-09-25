let lowStakeRoundCount = 0;
let highStakeRoundCount = 0;

// Set up event listeners for both game modes
setupGameMode('low', 2);
setupGameMode('high', 5);

// Setup reset button and dialog
const resetButton = document.getElementById('reset-btn');
const confirmDialog = document.getElementById('confirm-dialog');
const confirmYesBtn = document.getElementById('confirm-yes');
const confirmNoBtn = document.getElementById('confirm-no');

resetButton.addEventListener('click', () => {
    confirmDialog.style.display = 'flex';
});

confirmYesBtn.addEventListener('click', () => {
    resetAll();
    confirmDialog.style.display = 'none';
});

confirmNoBtn.addEventListener('click', () => {
    confirmDialog.style.display = 'none';
});

function setupGameMode(mode, multiplier) {
    const scoreInputs = document.querySelectorAll(`.score-input-${mode}`);
    const addRoundBtn = document.querySelector(`.add-round-btn-${mode}`);
    const signButtons = document.querySelectorAll(`#${mode}-stake-mode .toggle-sign`);
    
    scoreInputs.forEach(input => {
        input.addEventListener('input', () => updateButtonState(scoreInputs, addRoundBtn));
    });

    addRoundBtn.addEventListener('click', () => addRound(mode, multiplier));

    signButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const label = event.target.closest('label');
            const input = label.querySelector('input');
            toggleSign(input);
        });
    });

    updateButtonState(scoreInputs, addRoundBtn);
}

function updateButtonState(inputs, button) {
    // Check if any input is blank. The .some() method returns true if at least one element in the array passes the test.
    const isAnyInputBlank = Array.from(inputs).some(input => input.value === '');
    
    if (isAnyInputBlank) {
        button.disabled = true;
        return; // Exit the function early
    }

    // If no inputs are blank, then check if the total score is not zero
    const totalRoundScore = Array.from(inputs).reduce((sum, input) => sum + (parseFloat(input.value) || 0), 0);
    button.disabled = totalRoundScore !== 0;
}

function toggleSign(input) {
    let currentValue = parseFloat(input.value) || 0;
    input.value = currentValue * -1;
    
    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
}

function addRound(mode, multiplier) {
    const scoreInputs = document.querySelectorAll(`.score-input-${mode}`);
    const scores = Array.from(scoreInputs).map(input => parseFloat(input.value) || 0);
    const totalRoundScore = scores.reduce((sum, score) => sum + score, 0);

    const tableBody = document.querySelector(`#${mode}-stake-mode tbody`);
    
    let roundCount;
    if (mode === 'low') {
        lowStakeRoundCount++;
        roundCount = lowStakeRoundCount;
    } else {
        highStakeRoundCount++;
        roundCount = highStakeRoundCount;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${roundCount}</td>
        <td>${scores[0]}</td>
        <td>${scores[1]}</td>
        <td>${scores[2]}</td>
        <td>${scores[3]}</td>
    `;

    if (totalRoundScore !== 0) {
        newRow.classList.add('highlight');
    }

    tableBody.appendChild(newRow);
    updateTotalScores(scores, mode, multiplier);

    scoreInputs.forEach(input => input.value = '');
    document.querySelector(`.add-round-btn-${mode}`).disabled = true;
}

function updateTotalScores(roundScores, mode, multiplier) {
    const totalCells = document.querySelectorAll(`#${mode}-stake-mode tfoot .total-p1, #${mode}-stake-mode tfoot .total-p2, #${mode}-stake-mode tfoot .total-p3, #${mode}-stake-mode tfoot .total-p4`);
    
    roundScores.forEach((score, index) => {
        const currentTotal = parseFloat(totalCells[index].textContent);
        const newTotal = currentTotal + (score * multiplier);
        totalCells[index].textContent = newTotal;
    });
}

function resetAll() {
    // Reset Low Stake
    lowStakeRoundCount = 0;
    document.querySelector('#low-stake-mode tbody').innerHTML = '';
    document.querySelectorAll('#low-stake-mode tfoot td:not(:first-child)').forEach(td => td.textContent = '0');
    document.querySelectorAll('.score-input-low').forEach(input => input.value = '');
    document.querySelector('.add-round-btn-low').disabled = true;

    // Reset High Stake
    highStakeRoundCount = 0;
    document.querySelector('#high-stake-mode tbody').innerHTML = '';
    document.querySelectorAll('#high-stake-mode tfoot td:not(:first-child)').forEach(td => td.textContent = '0');
    document.querySelectorAll('.score-input-high').forEach(input => input.value = '');
    document.querySelector('.add-round-btn-high').disabled = true;
}
