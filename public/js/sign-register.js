function togglePassword(id) {
    let passwordField = document.getElementById(id);
    let type = passwordField.type === 'password' ? 'text' : 'password';
    passwordField.type = type;
}

let signInSection = document.getElementById("signIn");
let registerSection = document.getElementById("register");
let showSignInBtn = document.getElementById("showSignIn");
let showRegisterBtn = document.getElementById("showRegister");


showSignInBtn.addEventListener("click", () => {
    signInSection.classList.remove("hidden");
    registerSection.classList.add("hidden");
});

showRegisterBtn.addEventListener("click", () => {
    registerSection.classList.remove("hidden");
    signInSection.classList.add("hidden");
});


document.getElementById("register-form").addEventListener("submit", register);

const API_KEY = "AIzaSyDOkLpJMNYevwtsM8FJtTFBf_gUdL_KdS4";

// sign up 
function register(event) {
    event.preventDefault();

    const firstName = document.getElementById("reg-Fname");
    const lastName = document.getElementById("reg-Lname");
    const email = document.getElementById("reg-email");
    const password = document.getElementById("reg-password");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            returnSecureToken: true,
        }),
    };

    fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
        requestOptions
    )
        .then((resp) => resp.json())
        .then((res) => {
            if (res.idToken) {
                const databaseUrl = `https://product-data-371b9-default-rtdb.firebaseio.com/users.json`;

                fetch(databaseUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: firstName.value,
                        lastName: lastName.value,
                        email: email.value,
                        userId: res.localId,
                    }),
                })
                    .then(() => {
                        alert("Signup successful!");
                        firstName.value = "";
                        lastName.value = "";
                        email.value = "";
                        password.value = "";
                    })
                    .catch((err) => console.error("Error storing user data:", err));
            } else {
                alert("Signup failed. This email already exists: " + (res.error.message || "Unknown error"));
            }
        })
        .catch((err) => console.error("Error:", err));
}



// sign in Form 
document.getElementById("signIn-form").addEventListener("submit", signIn);

function signIn(event) {
    event.preventDefault();

    const email = document.getElementById("sign-email");
    const password = document.getElementById("sign-password");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value,
            returnSecureToken: true,
        }),
    };

    fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, requestOptions)
        .then((resp) => resp.json())
        .then((res) => {
            if (res.idToken) {
                const databaseUrl = `https://product-data-371b9-default-rtdb.firebaseio.com/users.json`;

                fetch(databaseUrl)
                    .then((response) => response.json())
                    .then((users) => {
                        for (const key in users) {
                            if (users[key].email === email.value) {
                                sessionStorage.setItem("currentUser", JSON.stringify(users[key]));
                                break;
                            }
                        }
                        email.value = "";
                        password.value = "";

                        window.location.href = "../index.html";
                    })
                    .catch((err) => console.error("Error fetching user data:", err));
            } else {
                alert(res.error.message || "Login failed");
            }
        })
        .catch((err) => console.error("Error:", err));
}

function toggleMenu() {
    const menu = document.querySelector('.menu-items');
    menu.classList.toggle('active');
}