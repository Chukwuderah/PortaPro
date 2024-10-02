document.addEventListener("DOMContentLoaded", function () {
  const passwordFields = document.querySelectorAll(".password input");
  const toggleIcons = document.querySelectorAll(".password img");
  const signInForm = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("createPasswrd");
  const errorMessages = document.querySelectorAll(".error-message");

  // Predefined user data (this is for demo purposes, usually retrieved from a database)
  const userData = {
    email: "user@example.com",
    password: "Password123",
  };

  // Toggle password visibility
  toggleIcons.forEach((icon, index) => {
    icon.addEventListener("click", function () {
      const type = passwordFields[index].getAttribute("type");
      if (type === "password") {
        passwordFields[index].setAttribute("type", "text");
        icon.src = "../Images/icons8-hide-30.png"; // Change to hide image
      } else {
        passwordFields[index].setAttribute("type", "password");
        icon.src = "../Images/icons8-show-24.png"; // Change back to show image
      }
    });
  });

  // Sign-in form submission handler
  signInForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Clear previous error messages
    errorMessages.forEach((msg) => {
      msg.style.display = "none";
    });

    // Get the entered email and password
    const enteredEmail = emailInput.value.trim();
    const enteredPassword = passwordInput.value.trim();

    // Validate the email and password
    if (
      enteredEmail === userData.email &&
      enteredPassword === userData.password
    ) {
      // Proceed to the dashboard (this can be a redirect or any other action)
      window.location.href = "dashboard.html"; // Simulating dashboard redirect
    } else {
      // Display error message if credentials are incorrect
      if (enteredEmail !== userData.email) {
        const emailErrorMessage = document.querySelector(
          "#email + .error-message"
        );
        emailErrorMessage.textContent = "Incorrect email address.";
        emailErrorMessage.style.display = "block";
      }
      if (enteredPassword !== userData.password) {
        const passwordErrorMessage = document.querySelector(
          "#createPasswrd + .error-message"
        );
        passwordErrorMessage.textContent = "Password Is Incorrect";
        passwordErrorMessage.style.display = "block";
      }
    }
  });
});
