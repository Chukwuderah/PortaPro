document.addEventListener("DOMContentLoaded", function () {
  const passwordFields = document.querySelectorAll(".password input");
  const toggleIcons = document.querySelectorAll(".password img");

  // Toggle password visibility
  toggleIcons.forEach((icon, index) => {
    icon.addEventListener("click", function () {
      const type = passwordFields[index].getAttribute("type");
      if (type === "password") {
        passwordFields[index].setAttribute("type", "text");
        icon.src = "./Images/icons8-hide-30.png"; // Change to hide image
      } else {
        passwordFields[index].setAttribute("type", "password");
        icon.src = "./Images/icons8-show-24.png"; // Change back to show image
      }
    });
  });

  // Password validation
  const passwordInput = document.getElementById("createPasswrd");
  const confirmPasswordInput = document.getElementById("confirmpasswrd");
  const form = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const fNameInput = document.getElementById("fName");
  const lNameInput = document.getElementById("lname");
  const phoneInput = document.getElementById("pnumber");
  const checkboxInput = document.getElementById("checkbox");
  const errorMessages = document.querySelectorAll(".error-message");

  const rules = {
    length: { rule: /.{8,}/, element: document.getElementById("rule-length") },
    lowercase: {
      rule: /[a-z]/,
      element: document.getElementById("rule-lowercase"),
    },
    uppercase: {
      rule: /[A-Z]/,
      element: document.getElementById("rule-uppercase"),
    },
    symbol: {
      rule: /[!@#$%^&*(),.?":{}|<>]/,
      element: document.getElementById("rule-symbol"),
    },
  };

  // Show rules on focus
  passwordInput.addEventListener("focus", function () {
    document.querySelector(".password-rules-container").style.display = "flex";
  });

  // Validate password on input
  passwordInput.addEventListener("input", function () {
    for (const ruleKey in rules) {
      if (rules[ruleKey].rule.test(passwordInput.value)) {
        rules[ruleKey].element.classList.add("met"); // Green for met rule
      } else {
        rules[ruleKey].element.classList.remove("met"); // Default for unmet rule
      }
    }
  });

  // Helper function to validate email format
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Helper function to highlight invalid fields
  function highlightField(input) {
    input.style.border = "2px solid red";
  }

  function resetFieldHighlight(input) {
    input.style.border = "1px solid lightgray"; // Reset to default
  }

  // Form submission validation
  form.addEventListener("submit", function (event) {
    let allRulesMet = true;
    let passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    let emailValid = validateEmail(emailInput.value);
    let allFieldsFilled =
      fNameInput.value &&
      lNameInput.value &&
      phoneInput.value &&
      checkboxInput.checked;

    // Check password rules
    for (const ruleKey in rules) {
      if (!rules[ruleKey].rule.test(passwordInput.value)) {
        allRulesMet = false;
        break;
      }
    }

    // Reset field highlights before validation
    resetFieldHighlight(fNameInput);
    resetFieldHighlight(lNameInput);
    resetFieldHighlight(emailInput);
    resetFieldHighlight(phoneInput);
    resetFieldHighlight(passwordInput);
    resetFieldHighlight(confirmPasswordInput);
    resetFieldHighlight(checkboxInput);

    // Hide all error messages initially
    errorMessages.forEach((msg) => {
      msg.style.display = "none";
    });

    // Check for validation errors
    if (!emailValid) {
      document.querySelectorAll(".error-message")[2].textContent =
        "Invalid email format.";
      document.querySelectorAll(".error-message")[2].style.display = "block";
      highlightField(emailInput);
      event.preventDefault();
      return;
    }

    if (!fNameInput.value) {
      document.querySelectorAll(".error-message")[0].textContent =
        "First name is required.";
      document.querySelectorAll(".error-message")[0].style.display = "block";
      highlightField(fNameInput);
      event.preventDefault();
      return;
    }

    if (!lNameInput.value) {
      document.querySelectorAll(".error-message")[1].textContent =
        "Last name is required.";
      document.querySelectorAll(".error-message")[1].style.display = "block";
      highlightField(lNameInput);
      event.preventDefault();
      return;
    }

    if (!phoneInput.value) {
      document.querySelectorAll(".error-message")[3].textContent =
        "Phone number is required.";
      document.querySelectorAll(".error-message")[3].style.display = "block";
      highlightField(phoneInput);
      event.preventDefault();
      return;
    }

    if (!checkboxInput.checked) {
      document.querySelectorAll(".error-message")[4].textContent =
        "You must agree to the terms.";
      document.querySelectorAll(".error-message")[4].style.display = "block";
      event.preventDefault();
      return;
    }

    if (!passwordsMatch) {
      document.querySelectorAll(".error-message")[5].textContent =
        "Passwords do not match.";
      document.querySelectorAll(".error-message")[5].style.display = "block";
      highlightField(confirmPasswordInput);
      event.preventDefault();
      return;
    }

    if (!allRulesMet) {
      // This targets the error message under "Create Password" instead of "Confirm Password"
      document.querySelectorAll(".error-message")[4].textContent =
        "Password rules not met.";
      document.querySelectorAll(".error-message")[4].style.display = "block";
      highlightField(passwordInput); // Highlight create password field
      event.preventDefault();
      return;
    }

    // If all conditions are met, redirect to the email verification page
    event.preventDefault(); // Prevent default form submission
    window.location.href = "./email-verification/email-verification.html";
  });
});

// function handleCredentialResponse(response) {
//   console.log("Encoded JWT ID token: " + response.credential);

//   // Decode the JWT token to get user information
//   const userObject = jwt_decode(response.credential);

//   console.log("User Information: ", userObject);

//   // You can now use the user information to sign them up or log them in
//   // Redirect to a dashboard or further steps after successful login
//   window.location.href = "./dashboard.html"; // Example redirection
// }

// // Load JWT decode library
// const script = document.createElement("script");
// script.src = "https://cdn.jsdelivr.net/npm/jwt-decode/build/jwt-decode.min.js";
// document.head.appendChild(script);
