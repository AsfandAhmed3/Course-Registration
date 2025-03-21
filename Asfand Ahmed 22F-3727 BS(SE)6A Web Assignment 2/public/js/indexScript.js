document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("login-btn");
    
    loginButton.addEventListener("click", function() {
      window.location.href = "/auth/login";
    });
  });
  