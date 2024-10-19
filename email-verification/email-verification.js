document.addEventListener("DOMContentLoaded", () => {
  const otpInputs = document.querySelectorAll(".otp");
  const userEmailSpan = document.querySelector(".user-email");
  const resendButton = document.querySelector(".resend-code input");
  const countdownElement = document.querySelector(".countdown");
  const submitButton = document.querySelector('button[type="submit"]');
  const errorMessage = document.querySelector(".error-message");

  let generatedOTP = "";
  let resendTimeout = 60;

  // Get the email from local storage
  const email = JSON.parse(localStorage.getItem("user")).email;

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
    console.log("OTP sent to email:", generatedOTP);
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
    countdownElement.style.color = "black";
    countdownElement.textContent = ` ${resendTimeout} secs`;

    const countdownInterval = setInterval(() => {
      resendTimeout -= 1;
      countdownElement.textContent = ` ${resendTimeout} secs`;

      if (resendTimeout <= 0) {
        clearInterval(countdownInterval);
        resendTimeout = 60;
        countdownElement.textContent = "";
        resendButton.disabled = false;
        resendButton.style.color = "black";
      }
    }, 1000);
  };

  // OTP input focus navigation
  otpInputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && index > 0 && input.value === "") {
        otpInputs[index - 1].focus();
      }
    });
  });

  // Resend OTP when the resend button is clicked
  resendButton.addEventListener("click", () => {
    otpInputs.forEach((input) => {
      input.textContent = "";
      input.value = "";
    });

    // Function to handle resend OTP
    const resendOTP = () => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        email: email,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(
        "http://20.63.19.250:5000/api/v1/auth/resend-confirmation-email",
        requestOptions
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to resend OTP");
          }
          return response.json();
        })
        .then((result) => {
          console.log("OTP resent successfully:", result);
          sendOTP(); // Trigger new OTP generation and countdown
        })
        .catch((error) => {
          console.error("Error resending OTP:", error);
          errorMessage.textContent = "Failed to resend OTP. Please try again.";
          errorMessage.style.color = "red";
          errorMessage.style.display = "block";
        });
    };

    resendOTP(); // Call resendOTP function when button is clicked
  });

  // Function to verify OTP on submit
  const verifyOTP = () => {
    const enteredOTP = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      confirmationToken: enteredOTP,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://20.63.19.250:5000/api/v1/auth/verify-email", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Verification failed");
        }
        return response.json();
      })
      .then((result) => {
        if (result.status_code === 200) {
          window.location.href = "/dashboard/dashboard.html";
        } else {
          errorMessage.textContent = "Verification failed. Please try again.";
          errorMessage.style.color = "red";
          errorMessage.style.display = "block";
        }
      })
      .catch((error) => {
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.color = "red";
        errorMessage.style.display = "block";
      });
  };

  // Handle OTP submission
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    verifyOTP();
  });

  sendOTP();
});
