document.addEventListener("DOMContentLoaded", () => {
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

  if (!passwordsMatch) {
    document.querySelectorAll(".error-message")[5].textContent =
      "Passwords do not match.";
    document.querySelectorAll(".error-message")[5].style.display = "block";
    highlightField(confirmPasswordInput);
    event.preventDefault();
    return;
  }
});
