const phoneInput = document.getElementById("phone");
const passwordInput = document.getElementById("password");
const togglePasswordButton = document.querySelector(".toggle-password");
const loginForm = document.getElementById("loginForm");
const loginButton = loginForm?.querySelector(".submit-button");
const formMessage = loginForm?.querySelector(".form-message");

// Show or hide the password
if (togglePasswordButton && passwordInput) {
  togglePasswordButton.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";

    togglePasswordButton.setAttribute(
      "aria-label",
      isHidden ? "Hide password" : "Show password"
    );

    togglePasswordButton.title = isHidden
      ? "Hide password"
      : "Show password";

    togglePasswordButton.innerHTML = isHidden
      ? '<span class="eye-icon">◌</span>'
      : '<span class="eye-icon">◉</span>';
  });
}

// Display form messages
const showMessage = (message, isSuccess = false) => {
  if (!formMessage) return;

  formMessage.textContent = message;
  formMessage.classList.toggle("success", isSuccess);
  formMessage.hidden = false;
};

// Handle login
if (loginForm && phoneInput && passwordInput && loginButton && formMessage) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const password = passwordInput.value;
    const digits = phoneInput.value.replace(/\D/g, "");
    const nationalNumber = digits.startsWith("977")
      ? digits.slice(3)
      : digits;

    if (!/^9\d{9}$/.test(nationalNumber)) {
      showMessage("Enter a valid 10-digit Nepal mobile number.");
      phoneInput.focus();
      return;
    }

    if (!password) {
      showMessage("Enter your password.");
      passwordInput.focus();
      return;
    }

    // Send the 10-digit number expected by the backend
    const credentials = {
      phone: nationalNumber,
      password,
    };

    formMessage.hidden = true;
    loginButton.disabled = true;
    loginButton.innerHTML = "Signing in...";

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "same-origin",
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to log in. Please try again."
        );
      }

      showMessage(
        `Welcome back${
          result.user?.fullname ? `, ${result.user.fullname}` : ""
        }. You are now logged in.`,
        true
      );

      // Redirect after successful login once the dashboard is ready:
      // window.location.href = "/pages/dashboard.html";
    } catch (error) {
      showMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect. Please try again."
      );
    } finally {
      loginButton.disabled = false;
      loginButton.innerHTML = 'Log in securely <span>→</span>';
    }
  });
}

//-------Registration Page Handling ----------

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  const fullnameInput = registerForm.querySelector("#fullname");
  const phoneInput = registerForm.querySelector("#phone");
  const passwordInput = registerForm.querySelector("#password");
  const registerButton = registerForm.querySelector(".submit-button");
  const formMessage = registerForm.querySelector(".form-message");

  const showRegisterMessage = (message, isSuccess = false) => {
    formMessage.textContent = message;
    formMessage.classList.toggle("success", isSuccess);
    formMessage.hidden = false;
  };

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullname = fullnameInput.value.trim();
    const digits = phoneInput.value.replace(/\D/g, "");
    const phone = digits.startsWith("977") ? digits.slice(3) : digits;
    const password = passwordInput.value;

    if (!fullname) {
      showRegisterMessage("Please enter your full name.");
      fullnameInput.focus();
      return;
    }

    if (!/^9\d{9}$/.test(phone)) {
      showRegisterMessage("Enter a valid 10-digit Nepal mobile number.");
      phoneInput.focus();
      return;
    }

    if (password.length < 6) {
      showRegisterMessage("Password must be at least 6 characters.");
      passwordInput.focus();
      return;
    }

    registerButton.disabled = true;
    registerButton.textContent = "Creating account...";
    formMessage.hidden = true;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname,
          phone,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Registration failed.");
      }

      showRegisterMessage(
        "Account created successfully! You can now log in.",
        true
      );

      registerForm.reset();
    } catch (error) {
      showRegisterMessage(
        error instanceof Error
          ? error.message
          : "Unable to connect to the server."
      );
    } finally {
      registerButton.disabled = false;
      registerButton.textContent = "Create account";
    }
  });
}

