document.addEventListener("DOMContentLoaded", function () {
  const passwordFields = document.querySelectorAll(".password input");
  const toggleIcons = document.querySelectorAll(".password img");
  const signInForm = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("createPasswrd");
  const errorMessages = document.querySelectorAll(".error-message");
  const forgotPasswordButton = document.getElementById("forgotPassword");

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

    // Prepare headers for the API request
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Prepare the body with the entered email and password
    const raw = JSON.stringify({
      email: enteredEmail,
      password: enteredPassword,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // Send the login request to the server
    fetch("http://20.63.19.250:5000/api/v1/auth/login", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Invalid email or password");
        }
        return response.json(); // Parse the response as JSON
      })
      .then((result) => {
        // Store user and access token in localStorage
        localStorage.setItem("user", JSON.stringify(result.user)); // Store user data
        localStorage.setItem("accessToken", result.accessToken); // Store access token

        // Redirect to the dashboard page
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        console.error("Error:", error);

        // Display error message if credentials are incorrect
        if (enteredEmail !== "" && enteredPassword !== "") {
          const emailErrorMessage = document.querySelector(
            "#email + .error-message"
          );
          emailErrorMessage.textContent = "Incorrect email or password.";
          emailErrorMessage.style.display = "block";
        }
      });
  });

  // Forgot password click handler
  forgotPasswordButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Clear previous error messages
    errorMessages.forEach((msg) => {
      msg.style.display = "none";
    });

    // Get the entered email
    const enteredEmail = emailInput.value.trim();

    if (enteredEmail === "") {
      // Show an error message if email field is empty
      const emailErrorMessage = document.querySelector(
        "#email + .error-message"
      );
      emailErrorMessage.textContent = "Please enter your email address.";
      emailErrorMessage.style.display = "block";
      return;
    }

    // Prepare headers for the API request
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    // Prepare the body with the entered email
    const raw = JSON.stringify({
      email: enteredEmail,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    // Send the reset password request to the server
    fetch("http://20.63.19.250:5000/api/v1/auth/reset-password", requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to send reset password request");
        }
        return response.json();
      })
      .then((result) => {
        console.log(result); // Handle the response, if needed

        // Store the entered email in localStorage
        const userEmail = { email: enteredEmail };
        localStorage.setItem("forgotPasswordUser", JSON.stringify(userEmail)); // Store email in localStorage

        // Redirect to forgot-password page
        window.location.href = "../forgot-password/forgot-password.html";
      })
      .catch((error) => {
        console.error("Error:", error);

        // Display error message if something goes wrong
        const emailErrorMessage = document.querySelector(
          "#email + .error-message"
        );
        emailErrorMessage.textContent =
          "Failed to send reset password request. Please try again.";
        emailErrorMessage.style.display = "block";
      });
  });
});
