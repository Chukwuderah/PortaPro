document.addEventListener("DOMContentLoaded", () => {
  const otpInputs = document.querySelectorAll(".otp");
  const userEmailSpan = document.querySelector(".user-email");
  const resendButton = document.querySelector(".resend-code input");
  const countdownElement = document.querySelector(".countdown");
  const submitButton = document.querySelector('button[type="submit"]');
  const errorMessage = document.querySelector(".error-message"); // Error message container

  let resendTimeout = 60; // Countdown time in seconds

  const email = localStorage.getItem("forgotPasswordUser");
  const actualEmail = JSON.parse(email);

  // Mask the email (First 4 characters visible, rest asterisks, then domain)
  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    const maskedName = name.slice(0, 4) + "*".repeat(name.length - 4);
    return `${maskedName}@${domain}`;
  };

  // Display the masked email in the span
  userEmailSpan.textContent = maskEmail(actualEmail.email);

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

    startCountdown(); // Restart countdown for resend button
  });

  // Function to store OTP in localStorage and redirect
  const storeOTPAndRedirect = () => {
    const enteredOTP = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    // Store the entered OTP in localStorage
    localStorage.setItem("enteredOTP", enteredOTP);

    // Redirect to the reset-password page
    window.location.href = "../reset-password/reset-password.html";
  };

  // Handle OTP submission
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    storeOTPAndRedirect(); // Store OTP and redirect on form submission
  });

  // Simulate sending the initial OTP countdown when the page loads
  startCountdown();
});
