const form = document.querySelector('form');
const result = document.getElementById('result');
const currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });

// Button validation - greys out if required fields don't have an input
const button = form.querySelector('button');
const hint = document.getElementById('hint');

// Logic to add commas separating thousands ($1,000)
const loanAmountInput = document.getElementById('loanAmount');
// Event listener to update during each keystroke
loanAmountInput.addEventListener('input', function() {
    // Strips out any non digits from the loanAmountInput
    const digits = loanAmountInput.value.replace(/\D/g, '');
    // adds the commas into the right places, ? since there can be no digits (or not enough to need a comma)
    loanAmountInput.value = digits ? Number(digits).toLocaleString('en-AU') : '';
});

// Creates a function that updates whether the button is enabled or not
function updateButton() {
    const isValid = form.checkValidity();
    button.disabled = !isValid;

    // If the form is valid, hint is empty
    if (isValid) {
        hint.textContent = '';
        return;
    }

    // Since there can be >= 1 missing input, an empty array is created to contain which input is missing
    const missingInput = [];
    // If loan amount is missing, push "a loan amount" to the hint
    if (!loanAmountInput.checkValidity()) {
        missingInput.push('a loan amount');
    }
    // If loan term is missing, outputs to hint as well
    if (!document.getElementById('loanTerm').checkValidity()) {
        missingInput.push('a loan term (1-30 years)');
    }
    // Outputs the hint to the user using .join to combine the missing inputs
    hint.textContent = `Enter ${missingInput.join(' and ')} to calculate.`;
}
// Event listener to update the button as typing occurs
form.addEventListener('input', updateButton);
updateButton(); // Default as the page loads

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Stops the page reloading

    // Gets the information from the number inputs and parses them to numbers 
    // Remove commas before converting, otherwise parseFloat stops at the first comma
    const principal = parseFloat(loanAmountInput.value.replace(/,/g, ''));
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0; 
    const loanTerm = parseFloat(document.getElementById('loanTerm').value); 
    const r = interestRate / 100 / 12;  //  Monthly interest rate
    const n = loanTerm * 12;    // Total number of payments 

    // Input validation - If required fields don't have an input - throws the error
    if (!principal || principal <= 0 || !loanTerm || loanTerm <= 0) {
        result.innerHTML = '<p class="error">Loan amount and term must be more than 0!</p>';
        return;
    }

    // Monthly payment calculation
    let monthlyPayment;
    // If there is no interest, just spreads the payments evenly across the number of payments
    if (r === 0) {
        monthlyPayment = principal / n;
        // Or it runs the formula for compounding interest
    } else {
        monthlyPayment = principal * r * (1 + r) ** n / ((1 + r) ** n - 1);
    }

    const totalRepaid = monthlyPayment * n; // Total amount paid - principal + interest
    const totalInterest = totalRepaid - principal;  // total amount paid to interest

    // Result output
    result.innerHTML = `
        <p>Monthly Payment: <strong>${currency.format(monthlyPayment)}</strong></p>
        <p>Interest Paid: <strong>${currency.format(totalInterest)}</strong></p> 
        <p>Total Repaid: <strong>${currency.format(totalRepaid)}</strong></p>`;
        
});