
const userName = document.getElementById("userName");
const welcomeName = document.getElementById("welcomeName");
const userAvatar = document.getElementById("userAvatar");

const profileName = document.getElementById("profileName");
const profilePhone = document.getElementById("profilePhone");
const profileAvatar = document.getElementById("profileAvatar");


// Load logged-in customer
async function loadDashboard() {
    try {
        const response = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "./index.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to load customer information");
        }

        const data = await response.json();
        const user = data.user;

        if (!user) {
            throw new Error("User information not found");
        }

        // Display customer information
        userName.textContent = user.fullname;
        welcomeName.textContent = user.fullname;

        profileName.textContent = user.fullname;
        profilePhone.textContent = user.phone;

        // Generate avatar initial
        const initial = user.fullname.charAt(0).toUpperCase();

        userAvatar.textContent = initial;
        profileAvatar.textContent = initial;

    } catch (error) {
        console.error("Dashboard error:", error);
        alert("Unable to load dashboard. Please try again.");
    }
}


// Logout customer
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (response.ok) {
            window.location.href = "./index.html";
        } else {
            alert("Unable to logout. Please try again.");
        }

    } catch (error) {
        console.error("Logout error:", error);
        alert("Something went wrong during logout.");
    }
});


// Sidebar active navigation
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(link => link.classList.remove("active"));
        item.classList.add("active");
    });
});


// Initialize dashboard
loadDashboard();
