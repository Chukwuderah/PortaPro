document.addEventListener("DOMContentLoaded", function () {
  const passwordFields = document.querySelectorAll(".password input");
  const toggleIcons = document.querySelectorAll(".password img");

  // Toggle password visibility
  toggleIcons.forEach((icon, index) => {
    icon.addEventListener("click", function () {
      const type = passwordFields[index].getAttribute("type");
      if (type === "password") {
        passwordFields[index].setAttribute("type", "text");
        icon.src = "./Images/icons8-show-24.png"; // Change to hide image
      } else {
        passwordFields[index].setAttribute("type", "password");
        icon.src = "./Images/icons8-hide-30.png"; // Change back to show image
      }
    });
  });

  // Password validation rules and fields
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
        rules[ruleKey].element.classList.add("met"); // Mark rule as met
      } else {
        rules[ruleKey].element.classList.remove("met"); // Unmark unmet rule
      }
    }
  });

  // Email validation helper function
  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  // Highlight invalid fields
  function highlightField(input, errorMessage, message) {
    input.style.border = "2px solid red";
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  // Reset field highlight and hide error messages
  function resetFieldHighlight(input, errorMessage) {
    input.style.border = "1px solid lightgray"; // Reset to default
    // errorMessage.style.display = "none"; // Hide error message
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
      document.querySelectorAll(".error-message")[6].textContent = // Change the index if necessary
        "Password rules not met.";
      document.querySelectorAll(".error-message")[6].style.display = "block";
      highlightField(passwordInput); // Highlight create password field
      event.preventDefault();
      return;
    }

    // Proceed with form submission only if all fields are valid
    if (allFieldsFilled && allRulesMet && passwordsMatch) {
      // Prepare headers
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Prepare request payload
      const raw = JSON.stringify({
        firstName: fNameInput.value,
        lastName: lNameInput.value,
        email: emailInput.value,
        password: passwordInput.value,
        phoneNumber: phoneInput.value,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      // Send request to server
      fetch("http://20.63.19.250:5000/api/v1/auth/register", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status_code === 201) {
            // Store user and access token in localStorage
            localStorage.setItem("user", JSON.stringify(result.data.user));
            localStorage.setItem("access_token", result.data.access_token);

            // Redirect to email verification page
            window.location.href =
              "./email-verification/email-verification.html";
          } else {
            console.error("Registration failed:", result.message);
          }
        })
        .catch((error) => console.error("Error:", error));
    }
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
