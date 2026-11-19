
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


//services

const ntcServicesGrid = document.getElementById("ntcServicesGrid");
const utilitiesGrid = document.getElementById("utilitiesGrid");

const emergencyContacts = [
    { name: "Nepal Police", number: "100" },
    { name: "Fire Brigade", number: "101" },
    { name: "Ambulance", number: "102" },
    { name: "Traffic Police", number: "103" },
    { name: "Tourist Police", number: "1144" }
];


// Handle service actions
function handleService(service) {

    if (service.type === "redirect") {
        window.open(
            service.actionValue,
            "_blank",
            "noopener,noreferrer"
        );
    }

    else if (service.type === "ussd") {
        alert(
            `This utility requires an NTC SIM.\n` +
            `Dial ${service.actionValue} on your mobile phone.`
        );

        window.location.href =
            `tel:${service.actionValue.replace("#", "%23")}`;
    }

    else if (service.type === "instruction") {
        handleBalanceTransfer();
    }
}


// Balance transfer
function handleBalanceTransfer() {

    const destination = prompt("Enter destination mobile number:");

    if (!destination) return;

    if (!/^\d{10}$/.test(destination)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const amount = prompt("Enter transfer amount (Rs. 10 - 500):");

    if (!amount || !/^\d+$/.test(amount)) {
        alert("Please enter a valid amount.");
        return;
    }

    const transferAmount = Number(amount);

    if (transferAmount < 10 || transferAmount > 500) {
        alert("Transfer amount must be between Rs. 10 and Rs. 500.");
        return;
    }

    const securityCode = prompt("Enter your NTC security code:");

    if (!securityCode || !/^\d+$/.test(securityCode)) {
        alert("A valid security code is required.");
        return;
    }

    const ussd =
        `*422*${securityCode}*${destination}*${transferAmount}#`;

    alert("Your phone will open the USSD dialer. Verify the details before confirming.");

    window.location.href = `tel:${ussd.replace("#", "%23")}`;
}


// Create service cards
function createServiceCard(service) {

    const card = document.createElement("div");
    card.className = "service-card";

    const icon = document.createElement("div");
    icon.className = "service-icon";
    icon.textContent = service.icon;

    const name = document.createElement("h3");
    name.textContent = service.name;

    const description = document.createElement("p");
    description.textContent = service.description;

    card.append(icon, name, description);

    if (service.type === "emergency") {

        const contactList = document.createElement("div");
        contactList.className = "emergency-list";

        emergencyContacts.forEach(contact => {

            const link = document.createElement("a");
            link.href = `tel:${contact.number}`;
            link.className = "emergency-link";
            link.textContent =
                `${contact.name} - ${contact.number}`;

            contactList.appendChild(link);
        });

        card.appendChild(contactList);

    } else {

        const button = document.createElement("button");
        button.className = "service-btn";
        button.textContent = service.actionLabel;

        button.addEventListener("click", () => {
            handleService(service);
        });

        card.appendChild(button);
    }

    return card;
}


// Fetch services from MongoDB
async function loadServices() {

    try {

        const response = await fetch("/api/services", {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "./index.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load services");
        }

        const data = await response.json();

        ntcServicesGrid.replaceChildren();
        utilitiesGrid.replaceChildren();

        data.services.forEach(service => {

            const card = createServiceCard(service);

            if (service.category === "NTC Service") {
                ntcServicesGrid.appendChild(card);
            }

            else if (service.category === "Utility") {
                utilitiesGrid.appendChild(card);
            }
        });

    } catch (error) {

        console.error("Services error:", error);

        ntcServicesGrid.textContent =
            "Unable to load NTC services.";

        utilitiesGrid.textContent =
            "Unable to load utilities.";
    }
}


// Load services
loadServices();
