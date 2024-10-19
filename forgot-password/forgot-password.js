document.addEventListener("DOMContentLoaded", () => {
  const passwordFields = document.querySelectorAll(".password input");
  const toggleIcons = document.querySelectorAll(".password img");
  const form = document.querySelector("form");

  // Toggle password visibility
  toggleIcons.forEach((icon, index) => {
    icon.addEventListener("click", function () {
      const type = passwordFields[index].getAttribute("type");
      if (type === "password") {
        passwordFields[index].setAttribute("type", "text");
        icon.src = "../Images/icons8-show-24.png"; // Change to hide image
      } else {
        passwordFields[index].setAttribute("type", "password");
        icon.src = "../Images/icons8-hide-30.png"; // Change back to show image
      }
    });
  });

  // Password validation
  const passwordInput = document.getElementById("createPasswrd");
  const confirmPasswordInput = document.getElementById("confirmpasswrd");
  const emailInput = document.getElementById("email");
  const fNameInput = document.getElementById("fName");
  const lNameInput = document.getElementById("lname");
  const phoneInput = document.getElementById("pnumber");
  const checkboxInput = document.getElementById("checkbox");
  const errorMessages = document.querySelectorAll(".error-message");

  const rules = {
    length: {
      rule: /.{8,}/,
      element: document.getElementById("rule-length"),
    },
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

  // Handle form submission and make POST request
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Check if passwords match
    const passwordsMatch = passwordInput.value === confirmPasswordInput.value;
    if (!passwordsMatch) {
      document.querySelectorAll(".error-message")[5].textContent =
        "Passwords do not match.";
      document.querySelectorAll(".error-message")[5].style.display = "block";
      highlightField(confirmPasswordInput);
      return;
    }

    // Get email and resetToken from localStorage
    const email = localStorage.getItem("forgotPasswordUser");
    const actualEmail = JSON.parse(email).email;
    const resetToken = localStorage.getItem("enteredOTP");
    const newPassword = passwordInput.value;

    // Make POST request to reset password
    const payload = {
      email: actualEmail,
      resetToken: resetToken,
      newPassword: newPassword,
    };

    fetch("http://20.63.19.250:5000/api/v1/auth/reset-password/confirm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.code === 200) {
          // Handle successful password reset, maybe redirect to login
          console.log("Password reset successful");
          window.location.href = "/signin-page/signin.html"; // Redirect to login page
        } else {
          // Handle error
          console.error("Password reset failed:", data.message);
          document.querySelectorAll(".error-message")[5].textContent =
            data.message || "Password reset failed.";
          document.querySelectorAll(".error-message")[5].style.display =
            "block";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.querySelectorAll(".error-message")[5].textContent =
          "An error occurred during password reset.";
        document.querySelectorAll(".error-message")[5].style.display = "block";
      });
  });
});
