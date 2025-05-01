document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const equationDisplay = document.getElementById('equation-display');
    const answerInputArea = document.getElementById('answer-input-area');
    const userAnswerInput = document.getElementById('user-answer');
    const checkAnswerBtn = document.getElementById('check-answer-btn');
    const feedbackArea = document.getElementById('feedback-area');
    const feedbackText = document.getElementById('feedback-text');
    const correctAnswerArea = document.getElementById('correct-answer-area');
    const correctAnswerDisplay = document.getElementById('correct-answer-display');

    let correctSolution = null; // Variable to store the correct numerical solution

    // Function to generate a random integer between min and max (inclusive)
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        if (min > max) {
             [min, max] = [max, min];
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to generate a linear equation (ax + b = c) with integer solution
    function generateEquation() {
        // Reset state
        userAnswerInput.value = '';
        feedbackArea.classList.add('hidden');
        correctAnswerArea.classList.add('hidden');
        feedbackArea.classList.remove('correct', 'incorrect'); // Remove feedback classes

        let a, x, b, c;

        // Generate integer solution x
        x = getRandomInt(-10, 10); // Solutions between -10 and 10

        // Generate coefficient a (cannot be 0)
        a = getRandomInt(-5, 5);
        while (a === 0) {
            a = getRandomInt(-5, 5);
        }

        // Generate constant b
        b = getRandomInt(-20, 20); // Constant between -20 and 20

        // Calculate c based on the chosen a, x, and b --> c = ax + b
        c = a * x + b;

        // Store the correct solution
        correctSolution = x;

        // Construct the equation string in LaTeX format for KaTeX
        let equationString = '';

        // Add 'a' and 'x' part
        if (a === 1) {
            equationString += 'x';
        } else if (a === -1) {
            equationString += '-x';
        } else {
            equationString += `${a}x`;
        }

        // Add 'b' part and '= c' part
        if (b > 0) {
            equationString += ` + ${b}`;
        } else if (b < 0) {
            equationString += ` - ${Math.abs(b)}`; // Use absolute value and minus sign
        }
        // If b is 0, just omit the '+ 0'. This case is handled correctly by the if/else if structure.

        equationString += ` = ${c}`;

        // --- Debugging line ---
        console.log("Generated LaTeX:", equationString);
        // ------------------------

        // Render the equation using KaTeX
        // Need to clear previous content first
        equationDisplay.innerHTML = '';
        try {
             // Use displayMode: false for inline rendering within the div
            // throwOnError: false prevents script from crashing if KaTeX fails
            katex.render(equationString, equationDisplay, { displayMode: false, throwOnError: false });
        } catch (e) {
            console.error("KaTeX rendering error:", e);
            equationDisplay.textContent = "Error rendering equation."; // Fallback text
        }


        // Show the input area (it might already be visible, but good to ensure)
        answerInputArea.classList.remove('hidden');
        userAnswerInput.focus(); // Put cursor in the input field
    }

    // Function to check the user's answer
    function checkAnswer() {
        const userAnswerString = userAnswerInput.value.trim();
        const userAnswer = parseFloat(userAnswerString); // Use parseFloat to handle decimals if needed

        // Basic validation: check if input is a valid number
        if (isNaN(userAnswer) || userAnswerString === '') {
            feedbackArea.classList.remove('hidden', 'correct');
             feedbackArea.classList.add('incorrect');
            feedbackText.textContent = "Please enter a valid number.";
             correctAnswerArea.classList.add('hidden'); // Hide correct answer if input is invalid
            return; // Stop checking
        }

        // Compare user answer to the correct solution
        // For integer solutions, direct comparison is usually fine.
        const isCorrect = userAnswer === correctSolution;

        // Display feedback
        feedbackArea.classList.remove('hidden', 'correct', 'incorrect'); // Reset classes

        if (isCorrect) {
            feedbackArea.classList.add('correct');
            feedbackText.textContent = "Correct! 🎉";
        } else {
            feedbackArea.classList.add('incorrect');
            feedbackText.textContent = "Incorrect. Try again!";
        }

        // Always show the correct answer after checking
        correctAnswerDisplay.textContent = correctSolution;
        correctAnswerArea.classList.remove('hidden');

        // Optionally, hide the input/check button after an answer is checked
        // answerInputArea.classList.add('hidden');
    }

    // --- Event Listeners ---
    generateBtn.addEventListener('click', generateEquation);
    checkAnswerBtn.addEventListener('click', checkAnswer);

     // Allow checking answer by pressing Enter in the input field
    userAnswerInput.addEventListener('keypress', function(event) {
        // Check if the key pressed was 'Enter'
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission
            checkAnswerBtn.click(); // Simulate button click
        }
    });


    // --- Initial Setup ---
    // Generate the first equation when the page loads
    generateEquation();
});
