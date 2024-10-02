document.addEventListener("DOMContentLoaded", () => {
  const otpInputs = document.querySelectorAll(".otp");
  const userEmailSpan = document.querySelector(".user-email");
  const resendButton = document.querySelector(".resend-code input");
  const countdownElement = document.querySelector(".countdown");
  const submitButton = document.querySelector('button[type="submit"]');
  const errorMessage = document.querySelector(".error-message"); // Error message container

  let generatedOTP = ""; // Will store the generated OTP
  let resendTimeout = 60; // Countdown time in seconds

  // Example: Get the email from session or input
  const email = "useremail@gmail.com"; // Replace with dynamic email

  // Mask the email (First 4 characters visible, rest asterisks, then domain)
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    const maskedName = name.slice(0, 4) + "*".repeat(name.length - 4);
    return `${maskedName}@${domain}`;
  };

  // Display the masked email in the span
  userEmailSpan.textContent = maskEmail(email);

  // Function to send OTP (simulate sending OTP to the user's email)
  const sendOTP = () => {
    generatedOTP = generateRandomOTP();
    console.log("OTP sent to email:", generatedOTP); // For testing
    startCountdown();
  };

  // Function to generate a random 6-digit OTP
  const generateRandomOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Start the countdown for the resend button
  const startCountdown = () => {
    resendButton.disabled = true;
    resendButton.style.color = "gray";
    countdownElement.style.color = "black"; // Set countdown color to black
    countdownElement.textContent = ` ${resendTimeout} secs`;

    const countdownInterval = setInterval(() => {
      resendTimeout -= 1;
      countdownElement.textContent = ` ${resendTimeout} secs`;

      if (resendTimeout <= 0) {
        clearInterval(countdownInterval);
        resendTimeout = 60; // Reset timer
        countdownElement.textContent = ""; // Clear countdown display
        resendButton.disabled = false;
        resendButton.style.color = "black"; // Make the resend button active
      }
    }, 1000);
  };

  // OTP input focus navigation
  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus(); // Move to the next input
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && index > 0 && input.value === "") {
        otpInputs[index - 1].focus(); // Move to the previous input on backspace
      }
    });
  });

  // Resend OTP when the resend button is clicked
  resendButton.addEventListener("click", () => {
    // Clear OTP inputs
    otpInputs.forEach((input) => {
      input.textContent = ""; // Clear each otp input field
      input.value = ""; // Ensure value is reset for future input
    });

    sendOTP(); // Resend OTP and start countdown
  });

  // Function to verify OTP on submit
  const verifyOTP = () => {
    const enteredOTP = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    if (enteredOTP === generatedOTP) {
      errorMessage.textContent = ""; // Clear the error message
      window.location.href = "./dashboard.html"; // Redirect to dashboard
    } else {
      errorMessage.textContent = "Invalid OTP. Please try again."; // Show error message
      errorMessage.style.color = "red"; // Style the error message
      errorMessage.style.display = "block"; // Displat the error message
    }
  };

  // Handle OTP submission
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    verifyOTP(); // Verify OTP on form submission
  });

  // Simulate sending the initial OTP when the page loads
  sendOTP();
});
