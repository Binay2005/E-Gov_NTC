
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

// ===============================
// COMPLAINT MANAGEMENT
// ===============================

const complaintForm = document.getElementById("complaintForm");
const complaintsList = document.getElementById("complaintsList");
const complaintMessage = document.getElementById("complaintMessage");
const submitComplaintBtn = document.getElementById("submitComplaintBtn");


// Submit a new complaint
complaintForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const category = document.getElementById("complaintCategory").value;
    const subject = document.getElementById("complaintSubject").value.trim();
    const description = document.getElementById("complaintDescription").value.trim();

    complaintMessage.textContent = "";
    complaintMessage.className = "complaint-message";

    if (!category || !subject || !description) {
        complaintMessage.textContent = "Please fill in all fields.";
        complaintMessage.classList.add("error");
        return;
    }

    submitComplaintBtn.disabled = true;
    submitComplaintBtn.textContent = "Submitting...";

    try {

        const response = await fetch("/api/complaints", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                category,
                subject,
                description
            })
        });

        const data = await response.json();

        if (response.status === 401 || response.status === 403) {
            window.location.href = "./index.html";
            return;
        }

        if (!response.ok) {
            throw new Error(data.message || "Unable to submit complaint.");
        }

        complaintMessage.textContent = "Your complaint was submitted successfully!";
        complaintMessage.classList.add("success");

        complaintForm.reset();

        // Refresh complaint history and statistics
        await loadComplaints();

    } catch (error) {

        console.error("Submit complaint error:", error);

        complaintMessage.textContent = error.message;
        complaintMessage.classList.add("error");

    } finally {

        submitComplaintBtn.disabled = false;
        submitComplaintBtn.textContent = "Submit Complaint";
    }
});


// Create a complaint card
function createComplaintCard(complaint) {

    const card = document.createElement("div");
    card.className = "complaint-card";

    // Header
    const header = document.createElement("div");
    header.className = "complaint-card-header";

    const details = document.createElement("div");

    const subject = document.createElement("h3");
    subject.textContent = complaint.subject;

    const category = document.createElement("p");
    category.className = "complaint-category";
    category.textContent = complaint.category;

    details.append(subject, category);

    const status = document.createElement("span");
    status.className = "complaint-status";

    const statusClasses = {
        "Pending": "status-pending",
        "In Progress": "status-in-progress",
        "Resolved": "status-resolved",
        "Rejected": "status-rejected"
    };

    status.textContent = complaint.status;
    status.classList.add(
        statusClasses[complaint.status] || "status-pending"
    );

    header.append(details, status);

    // Description
    const description = document.createElement("p");
    description.className = "complaint-description";
    description.textContent = complaint.description;

    // Submission date
    const date = document.createElement("p");
    date.className = "complaint-date";

    date.textContent = `Submitted: ${new Date(
        complaint.createdAt
    ).toLocaleDateString()}`;

    card.append(header, description, date);

    // Administrator response
    if (complaint.adminResponse) {

        const responseBox = document.createElement("div");
        responseBox.className = "admin-response";

        const responseHeading = document.createElement("h4");
        responseHeading.textContent = "NTC Administrator Response";

        const responseText = document.createElement("p");
        responseText.textContent = complaint.adminResponse;

        responseBox.append(responseHeading, responseText);
        card.appendChild(responseBox);
    }

    return card;
}


// Load complaints submitted by the logged-in customer
async function loadComplaints() {

    try {

        const response = await fetch("/api/complaints/my", {
            method: "GET",
            credentials: "include"
        });

        if (response.status === 401 || response.status === 403) {
            window.location.href = "./index.html";
            return;
        }

        if (!response.ok) {
            throw new Error("Unable to retrieve complaints.");
        }

        const data = await response.json();
        const complaints = data.complaints || [];

        complaintsList.replaceChildren();

        // Update complaint statistics
        const totalCount = complaints.length;

        const pendingCount = complaints.filter(
            complaint => complaint.status === "Pending"
        ).length;

        const resolvedCount = complaints.filter(
            complaint => complaint.status === "Resolved"
        ).length;

        const activeCount = complaints.filter(
            complaint =>
                complaint.status === "Pending" ||
                complaint.status === "In Progress"
        ).length;

        // Update dashboard values
        document.getElementById("totalComplaints").textContent = totalCount;
        document.getElementById("pendingComplaints").textContent = pendingCount;
        document.getElementById("resolvedComplaints").textContent = resolvedCount;
        document.getElementById("activeComplaints").textContent = activeCount;

        // Display empty state
        if (complaints.length === 0) {

            const emptyCard = document.createElement("div");
            emptyCard.className = "placeholder-card";

            const icon = document.createElement("div");
            icon.className = "placeholder-icon";
            icon.textContent = "◉";

            const heading = document.createElement("h3");
            heading.textContent = "No complaints to display";

            const message = document.createElement("p");
            message.textContent =
                "Your submitted complaints will appear here.";

            emptyCard.append(icon, heading, message);
            complaintsList.appendChild(emptyCard);

            return;
        }

        // Display complaint cards
        complaints.forEach(complaint => {
            complaintsList.appendChild(
                createComplaintCard(complaint)
            );
        });

    } catch (error) {

        console.error("Load complaints error:", error);

        complaintsList.textContent =
            "Unable to load complaints. Please try again.";
    }
}


// Load complaints when the dashboard opens
loadComplaints();