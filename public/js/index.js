function toggleMenu() {
    const menu = document.querySelector('.menu-items');
    menu.classList.toggle('active');
}

let navSign = document.getElementById("NavSignIn")

function updateNavbar() {
    const profileDropdown = document.getElementById("profile-dropdown");
    const profileIcon = document.getElementById("profile-icon");

    // Retrieve currentUser from sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (currentUser) {
        navSign.href = "#";
        profileDropdown.innerHTML = `
            <p>${currentUser.firstName} ${currentUser.lastName}</p>
            <button id="logout-btn"><i class="fa-solid fa-right-from-bracket"></i>  <b>Logout</b></button>
        `;
        
        profileIcon.addEventListener("mouseenter", () => {
            profileDropdown.style.display = "block";
        });
        profileDropdown.addEventListener("mouseleave", () => {
            profileDropdown.style.display = "none";
        });

        document.getElementById("logout-btn").addEventListener("click", () => {
            sessionStorage.removeItem('currentUser');
            location.reload();
        });
    } else {
        profileIcon.setAttribute("title", "Login");
        profileDropdown.innerHTML = ""; 
    }
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", updateNavbar);