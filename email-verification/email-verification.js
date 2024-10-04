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

    sendOTP();
  });

  // Function to verify OTP on submit
  const verifyOTP = () => {
    console.log("verifyOTP function called"); // Log the function call to track execution

    const enteredOTP = Array.from(otpInputs)
      .map((input) => input.value)
      .join("");
    console.log("Entered OTP:", enteredOTP); // Log the entered OTP for verification

    // if (enteredOTP === generatedOTP) {
    //   errorMessage.textContent = "";

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      email: email,
      confirmationToken: enteredOTP,
    });

    console.log("Sending request with email:", email, "and OTP:", enteredOTP);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://20.63.19.250:5000/api/v1/auth/verify-email", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((result) => {
        console.log("API response:", result); // Log the API response
        if (result.status_code === 200) {
          window.location.href = "./dashboard.html";
        } else {
          errorMessage.textContent = "Verification failed. Please try again.";
          errorMessage.style.color = "red";
          errorMessage.style.display = "block";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        errorMessage.textContent = "An error occurred. Please try again.";
        errorMessage.style.color = "red";
        errorMessage.style.display = "block";
      });
    //  else {
    //   errorMessage.textContent = "Invalid OTP. Please try again.";
    //   errorMessage.style.color = "red";
    //   errorMessage.style.display = "block";
    // }
  };

  // Handle OTP submission
  submitButton.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Submit button clicked"); // Log the button click
    verifyOTP();
  });

  sendOTP();
});
