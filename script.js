
const form = document.querySelector('form');
const result = document.getElementById('result');
const currency = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' });

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Stops the page reloading

// Gets the information from the number inputs and parses them to numbers 
    const principal = parseFloat(document.getElementById('loanAmount').value);  
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0; 
    const loanTerm = parseFloat(document.getElementById('loanTerm').value); 
    const r = interestRate / 100 / 12;  //  Monthly interest rate
    const n = loanTerm * 12;    // Total number of payments 

    let monthlyPayment;
    // If there is no interest, just spreads the payments evenly across the number of payments
    if (r === 0) {
        monthlyPayment = principal / n;
        // Or it runs the formula for compounding interest
    } else {
        monthlyPayment = principal * r * (1 + r) ** n / ((1 + r) ** n - 1);
    };

    const totalRepaid = monthlyPayment * n;
    const totalInterest = totalRepaid - principal;

    result.innerHTML = `
        <p>Monthly Payment: <strong>${currency.format(monthlyPayment)}</strong></p> 
        <p>Total Repaid: <strong>${currency.format(totalRepaid)}</strong></p> 
        <p>Interest Paid: <strong>${currency.format(totalInterest)}</strong></p>`;

    console.log(`Principal: ${principal}, Interest Rate: ${interestRate}, Loan Term: ${loanTerm}`);
    console.log(`Monthly rate: ${r}, Number of payments: ${n}`);
    console.log(`Monthly Payment: ${monthlyPayment}`);

});