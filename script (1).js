const form = document.querySelector("form");

const prioritySelect =
    document.getElementById("priority");

const complaintList =
    document.getElementById("complaintList");

let complaints =
    JSON.parse(localStorage.getItem("complaints")) || [];



// ===============================
// USER ROLE
// ===============================

let currentRole = "";


// ===============================
// RESOLUTION TIME LIMITS
// ===============================
// Time limit is based on complaint priority.
const resolutionLimits = {
    High: 24,      // 24 hours
    Medium: 48,    // 48 hours
    Low: 72        // 72 hours
};

function getDeadline(priority, submittedAt) {
    const hours = resolutionLimits[priority] || 48;
    return new Date(submittedAt + hours * 60 * 60 * 1000);
}

function formatDateTime(date) {
    return new Date(date).toLocaleString();
}

function getDeadlineStatus(complaint) {
    if (complaint.status === "Resolved") {
        return "Resolved";
    }
    return Date.now() > new Date(complaint.deadline).getTime()
        ? "Overdue"
        : "On Time";
}

// Add new fields to complaints created by an older version.
complaints = complaints.map(c => {
    const submittedAt = c.submittedAt || Date.now();
    const priority = c.priority || "Medium";
    return {
        ...c,
        priority,
        submittedAt,
        deadline: c.deadline || getDeadline(priority, submittedAt).toISOString(),
        resolvedAt: c.resolvedAt || "",
        resolution: c.resolution || ""
    };
});


// ===============================
// ELEMENTS
// ===============================

const homeScreen =
    document.getElementById("homeScreen");

const studentBtn =
    document.getElementById("studentBtn");

const staffBtn =
    document.getElementById("staffBtn");

const backHomeBtn =
    document.getElementById("backHomeBtn");

const loginBtn =
    document.getElementById("loginBtn");

const loginBox =
    document.getElementById("loginBox");

const logoutBtn =
    document.getElementById("logoutBtn");

const staffBar =
    document.querySelector(".staff-bar");

const header =
    document.querySelector("header");

const container =
    document.querySelector(".container");

const stats =
    document.querySelector(".stats");

const submitSection =
    document.getElementById("submitSection");


// ===============================
// SHOW HOME
// ===============================

function showHome() {

    currentRole = "";

    homeScreen.style.display = "block";

    loginBox.style.display = "none";

    header.style.display = "none";

    staffBar.style.display = "none";

    container.style.display = "none";

}


// ===============================
// SHOW STAFF LOGIN
// ===============================

function showStaffLogin() {

    currentRole = "";

    homeScreen.style.display = "none";

    loginBox.style.display = "block";

    header.style.display = "none";

    staffBar.style.display = "none";

    container.style.display = "none";

}


// ===============================
// SHOW STUDENT PAGE
// ===============================

function showStudentPage() {

    currentRole = "student";

    homeScreen.style.display = "none";

    loginBox.style.display = "none";

    header.style.display = "block";

    staffBar.style.display = "none";

    container.style.display = "block";

    stats.style.display = "none";

    // Student can submit complaint
    submitSection.style.display = "block";

    displayComplaints();

}


// ===============================
// SHOW STAFF DASHBOARD
// ===============================

function showStaffDashboard() {

    currentRole = "staff";

    homeScreen.style.display = "none";

    loginBox.style.display = "none";

    header.style.display = "block";

    staffBar.style.display = "block";

    container.style.display = "block";

    stats.style.display = "flex";

    // Staff cannot submit complaint
    submitSection.style.display = "none";

    displayComplaints();

}


// ===============================
// HOME BUTTONS
// ===============================

studentBtn.addEventListener(
    "click",
    function() {

        showStudentPage();

    }
);


staffBtn.addEventListener(
    "click",
    function() {

        showStaffLogin();

    }
);


backHomeBtn.addEventListener(
    "click",
    function() {

        showHome();

    }
);


// ===============================
// DISPLAY COMPLAINTS
// ===============================

function displayComplaints() {

    complaintList.innerHTML = "";


    if (complaints.length === 0) {

        complaintList.innerHTML =
            '<p class="no-complaints">No complaints submitted yet.</p>';

        updateStats();

        return;

    }


    complaints.forEach(
        function(complaint) {

            const card =
                document.createElement("div");

            card.className =
                "complaint-card";
            card.dataset.id = complaint.id;


            card.innerHTML = `

                <h3>
                    ${complaint.title || "No Title"}
                </h3>


                <p>
                    <b>Complaint ID:</b>
                    ${complaint.id || "N/A"}
                </p>


                <p>
                    <b>Date & Time:</b>
                    ${complaint.date || "N/A"}
                </p>


                <p>
                    <b>Category:</b>
                    ${complaint.category || "N/A"}
                </p>


                <p>
                    <b>Priority:</b>
                    ${complaint.priority || "Medium"}
                </p>


                <p>
                    <b>Location:</b>
                    ${complaint.location || "N/A"}
                </p>


                <p>
                    <b>Description:</b>
                    ${complaint.description || "N/A"}
                </p>


                ${
                    complaint.photo
                    ?
                    `<img
                        src="${complaint.photo}"
                        class="complaint-photo"
                    >`
                    :
                    ""
                }


                <p>
                    <b>⏱ Resolution Time Limit:</b>
                    ${resolutionLimits[complaint.priority] || 48} hours
                </p>

                <p>
                    <b>📅 Resolution Deadline:</b>
                    ${complaint.deadline ? formatDateTime(complaint.deadline) : "N/A"}
                    ${complaint.status !== "Resolved" ? `<span class="deadline-badge ${getDeadlineStatus(complaint).toLowerCase().replace(" ", "-")}">${getDeadlineStatus(complaint)}</span>` : ""}
                </p>

                <p>
                    <b>🕐 Resolved On:</b>
                    ${complaint.resolvedAt ? formatDateTime(complaint.resolvedAt) : "Not resolved yet"}
                </p>

                <p>
                    <b>🔧 How Problem Was Solved:</b>
                    ${complaint.resolution || "Not provided yet"}
                </p>

                ${
                    currentRole === "staff"
                    ?
                    `

                        <select class="status-select" data-id="${complaint.id}">

                            <option
                                value="Pending"
                                ${
                                    complaint.status === "Pending"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Pending
                            </option>


                            <option
                                value="In Progress"
                                ${
                                    complaint.status === "In Progress"
                                    ? "selected"
                                    : ""
                                }
                            >
                                In Progress
                            </option>


                            <option
                                value="Resolved"
                                ${
                                    complaint.status === "Resolved"
                                    ? "selected"
                                    : ""
                                }
                            >
                                Resolved
                            </option>

                        </select>

                        <div class="resolution-box">
                            <label>🔧 How was the problem solved?</label>
                            <textarea class="resolution-input" data-id="${complaint.id}" placeholder="Enter the action taken to solve the problem...">${complaint.resolution || ""}</textarea>
                            <button type="button" class="save-resolution-btn" data-id="${complaint.id}">
                                💾 Save Resolution Details
                            </button>
                        </div>

                    `
                    :
                    ""
                }


                <button class="view-btn">
                    👁️ View Details
                </button>


                ${
                    currentRole === "staff"
                    ?
                    `

                        <button class="delete-btn">
                            🗑️ Delete Complaint
                        </button>

                    `
                    :
                    ""
                }

            `;


            complaintList.appendChild(card);

        }
    );


    updateStats();

}


// ===============================
// UPDATE DASHBOARD STATS
// ===============================

function updateStats() {

    const totalCount =
        document.getElementById("totalCount");

    const pendingCount =
        document.getElementById("pendingCount");

    const resolvedCount =
        document.getElementById("resolvedCount");


    if (totalCount) {

        totalCount.textContent =
            complaints.length;

    }


    if (pendingCount) {

        pendingCount.textContent =
            complaints.filter(
                function(c) {

                    return c.status === "Pending";

                }
            ).length;

    }


    if (resolvedCount) {

        resolvedCount.textContent =
            complaints.filter(
                function(c) {

                    return c.status === "Resolved";

                }
            ).length;

    }

}


// ===============================
// SUBMIT COMPLAINT
// ===============================

form.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        // Only student can submit
        if (currentRole !== "student") {

            alert(
                "Only Student/User can submit a complaint."
            );

            return;

        }


        const textInputs =
            document.querySelectorAll(
                "input[type='text']"
            );


        const title =
            textInputs[0].value.trim();


        const category =
            document.querySelector(
                "form select"
            ).value;


        const location =
            textInputs[1].value.trim();


        const description =
            document.querySelector(
                "textarea"
            ).value.trim();


        if (
            title === "" ||
            category === "" ||
            location === "" ||
            description === ""
        ) {

            alert(
                "Please fill all required fields."
            );

            return;

        }


        const photoInput =
            document.querySelector(
                'input[type="file"]'
            );


        const photoFile =
            photoInput.files[0];


        function saveComplaint(photoData) {

            const newComplaint = {

                id:
                    "CMP-" +
                    Date.now()
                        .toString()
                        .slice(-6),

                title:
                    title,

                category:
                    category,

                location:
                    location,

                description:
                    description,

                photo:
                    photoData,

                status:
                    "Pending",

                priority:
                    prioritySelect.value,

                submittedAt:
                    Date.now(),

                deadline:
                    getDeadline(
                        prioritySelect.value,
                        Date.now()
                    ).toISOString(),

                resolvedAt:
                    "",

                resolution:
                    "",

                date:
                    new Date()
                        .toLocaleString()

            };


            complaints.push(
                newComplaint
            );


            localStorage.setItem(
                "complaints",
                JSON.stringify(
                    complaints
                )
            );


            alert(
                "✅ Complaint submitted successfully!"
            );


            form.reset();


            displayComplaints();

        }


        if (photoFile) {

            const reader =
                new FileReader();


            reader.onload =
                function() {

                    saveComplaint(
                        reader.result
                    );

                };


            reader.readAsDataURL(
                photoFile
            );

        }
        else {

            saveComplaint("");

        }

    }
);


// ===============================
// STATUS CHANGE
// ===============================

document.addEventListener(
    "change",
    function(event) {

        if (currentRole !== "staff") return;

        if (event.target.classList.contains("status-select")) {

            const id = event.target.dataset.id;
            const complaint = complaints.find(c => c.id === id);

            if (!complaint) return;

            complaint.status = event.target.value;

            if (complaint.status === "Resolved") {
                complaint.resolvedAt = complaint.resolvedAt || new Date().toISOString();
            } else {
                complaint.resolvedAt = "";
            }

            localStorage.setItem("complaints", JSON.stringify(complaints));
            displayComplaints();
        }
    }
);


// ===============================
// SAVE RESOLUTION DETAILS
// ===============================

document.addEventListener(
    "click",
    function(event) {

        if (currentRole !== "staff") return;

        if (event.target.classList.contains("save-resolution-btn")) {

            const id = event.target.dataset.id;
            const complaint = complaints.find(c => c.id === id);
            const input = document.querySelector(`.resolution-input[data-id="${id}"]`);

            if (!complaint || !input) return;

            const resolution = input.value.trim();

            if (resolution === "") {
                alert("Please enter how the problem was solved.");
                return;
            }

            complaint.resolution = resolution;

            if (complaint.status === "Resolved" && !complaint.resolvedAt) {
                complaint.resolvedAt = new Date().toISOString();
            }

            localStorage.setItem("complaints", JSON.stringify(complaints));
            displayComplaints();
            alert("✅ Resolution details saved successfully!");
        }
    }
);


// ===============================
// DELETE COMPLAINT
// ===============================

document.addEventListener(
    "click",
    function(event) {

        if (currentRole !== "staff") return;

        if (event.target.classList.contains("delete-btn")) {

            const card = event.target.closest(".complaint-card");
            const id = card?.dataset.id;
            const index = complaints.findIndex(c => c.id === id);

            if (index !== -1) {

                const confirmDelete = confirm(
                    "Are you sure you want to delete this complaint?"
                );

                if (confirmDelete) {
                    complaints.splice(index, 1);
                    localStorage.setItem("complaints", JSON.stringify(complaints));
                    displayComplaints();
                    alert("🗑️ Complaint deleted successfully!");
                }
            }
        }
    }
);


// ===============================
// VIEW DETAILS
// ===============================

document.addEventListener(
    "click",
    function(event) {

        if (
            event.target.classList.contains(
                "view-btn"
            )
        ) {

            const card =
                event.target.closest(
                    ".complaint-card"
                );


            alert(
                "📋 COMPLAINT DETAILS\n\n" +
                card.innerText
            );

        }

    }
);


// ===============================
// SEARCH
// ===============================

const searchInput =
    document.getElementById(
        "searchInput"
    );


if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            const searchText =
                this.value
                    .toLowerCase()
                    .trim();


            const cards =
                document.querySelectorAll(
                    ".complaint-card"
                );


            cards.forEach(
                function(card) {

                    const complaintText =
                        card.textContent
                            .toLowerCase();


                    card.style.display =
                        complaintText.includes(
                            searchText
                        )
                        ? ""
                        : "none";

                }
            );

        }
    );

}


// ===============================
// STAFF LOGIN
// ===============================

loginBtn.addEventListener(
    "click",
    function() {

        const email =
            document.getElementById(
                "staffEmail"
            ).value.trim();


        const password =
            document.getElementById(
                "staffPassword"
            ).value;


        const message =
            document.getElementById(
                "loginMessage"
            );


        if (
            email === "staff@college.com" &&
            password === "12345"
        ) {

            alert(
                "✅ Login Successful!"
            );


            showStaffDashboard();


            message.textContent = "";

        }
        else {

            message.textContent =
                "❌ Invalid email or password";

        }

    }
);


// ===============================
// LOGOUT
// ===============================

logoutBtn.addEventListener(
    "click",
    function() {

        document.getElementById(
            "staffEmail"
        ).value = "";


        document.getElementById(
            "staffPassword"
        ).value = "";


        alert(
            "🚪 Logged out successfully!"
        );


        showHome();

    }
);


// ===============================
// START APP
// ===============================

showHome();