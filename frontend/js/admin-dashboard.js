const complaintsList = document.getElementById("complaintsList");
const complaintsMessage = document.getElementById("complaintsMessage");
const statusFilter = document.getElementById("statusFilter");

let allComplaints = [];

async function checkAdminAccess() {
    const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include"
    });

    if (!response.ok) {
        window.location.href = "./index.html";
        return false;
    }

    const data = await response.json();
    const user = data.user || data;

    if (!user.isAdmin) {
        window.location.href = "./dashboard.html";
        return false;
    }

    document.getElementById("adminName").textContent =
        user.fullname || "Admin";

    return true;
}

function updateStatistics(complaints) {
    document.getElementById("totalComplaints").textContent =
        complaints.length;

    document.getElementById("pendingComplaints").textContent =
        complaints.filter(c => c.status === "Pending").length;

    document.getElementById("inProgressComplaints").textContent =
        complaints.filter(c => c.status === "In Progress").length;

    document.getElementById("resolvedComplaints").textContent =
        complaints.filter(c => c.status === "Resolved").length;
}

function createComplaintCard(complaint) {
    const card = document.createElement("article");
    card.className = "complaint-card";

    const top = document.createElement("div");
    top.className = "complaint-top";

    const titleArea = document.createElement("div");

    const title = document.createElement("h3");
    title.textContent = complaint.subject || "Untitled complaint";

    const meta = document.createElement("p");
    meta.className = "complaint-meta";

    const customer = complaint.user || {};
    const customerName = customer.fullname || "Customer";
    const customerPhone = customer.phone || "No phone number";
    const category = complaint.category || "Other";

    meta.textContent = `${customerName} · ${customerPhone} · ${category}`;

    titleArea.append(title, meta);

    const badge = document.createElement("span");
    badge.className = "status-badge";
    badge.textContent = complaint.status || "Pending";

    const statusClass = (complaint.status || "Pending")
        .toLowerCase()
        .replaceAll(" ", "-");

    badge.classList.add(`status-${statusClass}`);
    top.append(titleArea, badge);

    const description = document.createElement("p");
    description.className = "complaint-description";
    description.textContent = complaint.description || "";

    const date = document.createElement("p");
    date.className = "complaint-date";
    date.textContent = complaint.createdAt
        ? `Submitted: ${new Date(complaint.createdAt).toLocaleString()}`
        : "";

    const fields = document.createElement("div");
    fields.className = "admin-fields";

    const statusSelect = document.createElement("select");
    statusSelect.setAttribute("aria-label", "Complaint status");

    ["Pending", "In Progress", "Resolved", "Rejected"].forEach(status => {
        const option = document.createElement("option");
        option.value = status;
        option.textContent = status;
        option.selected = complaint.status === status;
        statusSelect.appendChild(option);
    });

    const responseTextarea = document.createElement("textarea");
    responseTextarea.placeholder = "Write an admin response (optional)";
    responseTextarea.setAttribute("aria-label", "Admin response");
    responseTextarea.value = complaint.adminResponse || "";

    fields.append(statusSelect, responseTextarea);

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "save-btn";
    saveButton.textContent = "Save update";

    saveButton.addEventListener("click", async () => {
        saveButton.disabled = true;
        saveButton.textContent = "Saving...";
        complaintsMessage.textContent = "";

        try {
            const response = await fetch(`/api/complaints/${complaint._id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: statusSelect.value,
                    adminResponse: responseTextarea.value.trim()
                })
            });

            const result = await response.json().catch(() => ({}));

            if (response.status === 401 || response.status === 403) {
                window.location.href = "./index.html";
                return;
            }

            if (!response.ok) {
                throw new Error(result.error || "Could not update complaint.");
            }

            complaintsMessage.className = "message";
            complaintsMessage.textContent = "Complaint updated.";
            await loadComplaints();
        } catch (error) {
            complaintsMessage.className = "message error";
            complaintsMessage.textContent = error.message;
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = "Save update";
        }
    });

    card.append(top, description, date, fields, saveButton);

    if (complaint.adminResponse) {
        const responseBox = document.createElement("div");
        responseBox.className = "admin-response";

        const responseTitle = document.createElement("strong");
        responseTitle.textContent = "Previous admin response: ";

        const responseText = document.createElement("span");
        responseText.textContent = complaint.adminResponse;

        responseBox.append(responseTitle, responseText);
        card.appendChild(responseBox);
    }

    return card;
}

function renderComplaints() {
    complaintsList.replaceChildren();

    const selectedStatus = statusFilter.value;
    const filteredComplaints = selectedStatus === "All"
        ? allComplaints
        : allComplaints.filter(c => c.status === selectedStatus);

    if (filteredComplaints.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No complaints found for this status.";
        complaintsList.appendChild(emptyMessage);
        return;
    }

    filteredComplaints.forEach(complaint => {
        complaintsList.appendChild(createComplaintCard(complaint));
    });
}

async function loadComplaints() {
    try {
        const response = await fetch("/api/complaints", {
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
        allComplaints = data.complaints || [];

        updateStatistics(allComplaints);
        renderComplaints();
    } catch (error) {
        complaintsMessage.className = "message error";
        complaintsMessage.textContent = error.message;
        complaintsList.replaceChildren();
    }
}

statusFilter.addEventListener("change", renderComplaints);

document.getElementById("logoutBtn").addEventListener("click", async () => {
    try {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include"
        });
    } finally {
        window.location.href = "./index.html";
    }
});

async function initializeAdminDashboard() {
    const isAdmin = await checkAdminAccess();

    if (isAdmin) {
        await loadComplaints();
    }
}

initializeAdminDashboard();