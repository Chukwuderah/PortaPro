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
    errorMessage.style.display = "none"; // Hide error message
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

    // Reset field highlights before validation
    resetFieldHighlight(
      fNameInput,
      document.querySelectorAll(".error-message")[0]
    );
    resetFieldHighlight(
      lNameInput,
      document.querySelectorAll(".error-message")[1]
    );
    resetFieldHighlight(
      emailInput,
      document.querySelectorAll(".error-message")[2]
    );
    resetFieldHighlight(
      phoneInput,
      document.querySelectorAll(".error-message")[3]
    );
    resetFieldHighlight(
      passwordInput,
      document.querySelectorAll(".error-message")[5]
    );
    resetFieldHighlight(
      confirmPasswordInput,
      document.querySelectorAll(".error-message")[5]
    );

    // Check password rules
    for (const ruleKey in rules) {
      if (!rules[ruleKey].rule.test(passwordInput.value)) {
        allRulesMet = false;
        break;
      }
    }

    // Hide all error messages initially
    errorMessages.forEach((msg) => {
      msg.style.display = "none";
    });

    // Check for validation errors
    if (!fNameInput.value) {
      highlightField(
        fNameInput,
        document.querySelectorAll(".error-message")[0],
        "First name is required."
      );
      event.preventDefault();
      return;
    }

    if (!lNameInput.value) {
      highlightField(
        lNameInput,
        document.querySelectorAll(".error-message")[1],
        "Last name is required."
      );
      event.preventDefault();
      return;
    }

    if (!emailValid) {
      highlightField(
        emailInput,
        document.querySelectorAll(".error-message")[2],
        "Invalid email format."
      );
      event.preventDefault();
      return;
    }

    if (!phoneInput.value) {
      highlightField(
        phoneInput,
        document.querySelectorAll(".error-message")[3],
        "Phone number is required."
      );
      event.preventDefault();
      return;
    }

    if (!checkboxInput.checked) {
      highlightField(
        checkboxInput,
        document.querySelectorAll(".error-message")[4],
        "You must agree to the terms."
      );
      event.preventDefault();
      return;
    }

    if (!passwordsMatch) {
      highlightField(
        confirmPasswordInput,
        document.querySelectorAll(".error-message")[5],
        "Passwords do not match."
      );
      event.preventDefault();
      return;
    }

    if (!allRulesMet) {
      highlightField(
        passwordInput,
        document.querySelectorAll(".error-message")[6],
        "Password rules not met."
      );
      event.preventDefault();
      return;
    }

    // If all checks pass, proceed with the form submission
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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

    fetch("http://20.63.19.250:5000/api/v1/auth/register", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.status_code === 201) {
          localStorage.setItem("user", JSON.stringify(result.data.user));
          localStorage.setItem("access_token", result.data.access_token);
          window.location.href = "./email-verification/email-verification.html";
        } else {
          console.error("Registration failed:", result.message);
        }
      })
      .catch((error) => console.error("Error:", error));
  });
});
