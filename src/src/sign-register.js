function togglePassword(id) {
    let passwordField = document.getElementById(id);
    let type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
}

let signInSection = document.getElementById("signIn");
let registerSection = document.getElementById("register");
let showSignInBtn = document.getElementById("showSignIn");
let showRegisterBtn = document.getElementById("showRegister");

// Mobile View Logic
showSignInBtn.addEventListener("click", () => {
    signInSection.classList.remove("hidden");
    registerSection.classList.add("hidden");
});

showRegisterBtn.addEventListener("click", () => {
    registerSection.classList.remove("hidden");
    signInSection.classList.add("hidden");
});