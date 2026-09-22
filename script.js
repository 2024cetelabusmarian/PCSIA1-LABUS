// ==========================================================
// SWCRS - SMART WASTE COLLECTION REPORT SYSTEM
// TASK 6 + TASK 7
// FORM VALIDATION + DATA STORAGE + RECORD MANAGEMENT
// ==========================================================


// ==========================================================
// 1. GET HTML ELEMENTS
// ==========================================================

const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

const residentArea = document.getElementById("residentArea");
const adminArea = document.getElementById("adminArea");
const crewArea = document.getElementById("crewArea");
const facilitatorArea = document.getElementById("facilitatorArea");

const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const residentReportForm =
    document.getElementById("resReportForm");

const feedbackForm =
    document.getElementById("feedbackForm");

const crewSegForm =
    document.getElementById("crewSegForm");

const disposalForm =
    document.getElementById("disposalForm");


// ==========================================================
// 2. LOCAL STORAGE KEYS
// ==========================================================

const STORAGE_KEY = "swcrsRecords";
const ACCOUNTS_KEY = "swcrsAccounts";


// ==========================================================
// 3. DEFAULT DEMO RECORDS
// ==========================================================

const defaultRecords = [

    {
        type: "incident",
        id: "REP-801",
        resident: "User_01",
        location: "Main Street",
        details: "Uncollected Trash",
        status: "Under Review",
        createdAt: "2026-08-30T08:30:00"
    },

    {
        type: "disposal",
        crew: "Crew Alpha",
        site: "Central Landfill Facility",
        weight: "1240",
        dateSubmitted: "Aug 30, 2026",
        createdAt: "2026-08-30T09:00:00"
    }

];


// ==========================================================
// 4. STORAGE FUNCTIONS
// ==========================================================

function getStoredRecords() {

    try {

        const savedData =
            localStorage.getItem(STORAGE_KEY);

        if (!savedData) {

            return [];

        }

        const records =
            JSON.parse(savedData);

        if (!Array.isArray(records)) {

            return [];

        }

        return records;

    } catch (error) {

        console.error(
            "Unable to read saved records:",
            error
        );

        return [];

    }

}


function saveStoredRecords(records) {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(records)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save records:",
            error
        );

        alert(
            "The record could not be saved in your browser."
        );

        return false;

    }

}


function getStoredAccounts() {

    try {

        const savedAccounts =
            localStorage.getItem(ACCOUNTS_KEY);

        if (!savedAccounts) {

            return [];

        }

        const accounts =
            JSON.parse(savedAccounts);

        return Array.isArray(accounts)
            ? accounts
            : [];

    } catch (error) {

        console.error(
            "Unable to read accounts:",
            error
        );

        return [];

    }

}


function saveStoredAccounts(accounts) {

    try {

        localStorage.setItem(
            ACCOUNTS_KEY,
            JSON.stringify(accounts)
        );

        return true;

    } catch (error) {

        console.error(
            "Unable to save accounts:",
            error
        );

        return false;

    }

}


// ==========================================================
// 5. INITIALIZE STORAGE
// ==========================================================

function initializeStorage() {

    const existingRecords =
        getStoredRecords();

    if (existingRecords.length === 0) {

        saveStoredRecords(
            defaultRecords
        );

    }

}


// ==========================================================
// 6. HTML ESCAPE
// Prevents user-entered text from becoming HTML
// ==========================================================

function escapeHTML(value) {

    if (value === null || value === undefined) {

        return "";

    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================================
// 7. VALIDATION - ONE FIELD
// ==========================================================

function validateField(input) {

    if (!input) {

        return true;

    }

    const errorMessage =
        document.getElementById(
            "err-" + input.id
        );

    let valid = true;


    // ------------------------------------------------------
    // Required validation
    // ------------------------------------------------------

    if (
        input.hasAttribute("required") &&
        input.value.trim() === ""
    ) {

        valid = false;

    }


    // ------------------------------------------------------
    // Minimum length
    // ------------------------------------------------------

    if (
        valid &&
        input.value.trim() !== "" &&
        input.hasAttribute("minlength")
    ) {

        const minimum =
            parseInt(
                input.getAttribute("minlength")
            );

        if (
            input.value.trim().length <
            minimum
        ) {

            valid = false;

        }

    }


    // ------------------------------------------------------
    // Maximum length
    // ------------------------------------------------------

    if (
        valid &&
        input.value.trim() !== "" &&
        input.hasAttribute("maxlength")
    ) {

        const maximum =
            parseInt(
                input.getAttribute("maxlength")
            );

        if (
            input.value.trim().length >
            maximum
        ) {

            valid = false;

        }

    }


    // ------------------------------------------------------
    // Pattern validation
    // ------------------------------------------------------

    if (
        valid &&
        input.value.trim() !== "" &&
        input.hasAttribute("pattern")
    ) {

        try {

            const rawPattern =
                input.getAttribute("pattern");

            const pattern =
                new RegExp(
                    "^" +
                    rawPattern +
                    "$"
                );

            if (
                !pattern.test(
                    input.value.trim()
                )
            ) {

                valid = false;

            }

        } catch (error) {

            console.error(
                "Pattern validation error:",
                error
            );

        }

    }


    // ------------------------------------------------------
    // Email validation
    // ------------------------------------------------------

    if (
        valid &&
        input.type === "email" &&
        input.value.trim() !== ""
    ) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailPattern.test(
                input.value.trim()
            )
        ) {

            valid = false;

        }

    }


    // ------------------------------------------------------
    // Number validation
    // ------------------------------------------------------

    if (
        valid &&
        input.type === "number" &&
        input.value.trim() !== ""
    ) {

        const numberValue =
            Number(input.value);

        if (
            !Number.isFinite(numberValue)
        ) {

            valid = false;

        }


        if (
            valid &&
            input.hasAttribute("min")
        ) {

            const minimum =
                Number(
                    input.getAttribute("min")
                );

            if (
                numberValue < minimum
            ) {

                valid = false;

            }

        }


        if (
            valid &&
            input.hasAttribute("max")
        ) {

            const maximum =
                Number(
                    input.getAttribute("max")
                );

            if (
                numberValue > maximum
            ) {

                valid = false;

            }

        }

    }


    // ------------------------------------------------------
    // HTML5 browser validation
    // ------------------------------------------------------

    if (
        valid &&
        typeof input.checkValidity === "function"
    ) {

        if (!input.checkValidity()) {

            valid = false;

        }

    }


    // ------------------------------------------------------
    // SHOW VALIDATION RESULT
    // ------------------------------------------------------

    if (valid) {

        input.classList.remove(
            "invalid"
        );

        if (
            input.value.trim() !== ""
        ) {

            input.classList.add(
                "valid"
            );

        }

        if (errorMessage) {

            errorMessage.classList.remove(
                "visible"
            );

        }

    } else {

        input.classList.remove(
            "valid"
        );

        input.classList.add(
            "invalid"
        );

        if (errorMessage) {

            errorMessage.classList.add(
                "visible"
            );

        }

    }


    return valid;

}


// ==========================================================
// 8. VALIDATE COMPLETE FORM
// ==========================================================

function validateForm(form) {

    if (!form) {

        return false;

    }

    let formIsValid = true;

    const fields =
        form.querySelectorAll(
            "input, select, textarea"
        );


    fields.forEach(
        function (field) {

            if (
                !validateField(field)
            ) {

                formIsValid = false;

            }

        }
    );


    return formIsValid;

}


// ==========================================================
// 9. LIVE VALIDATION
// ==========================================================

document
    .querySelectorAll(
        "input, select, textarea"
    )
    .forEach(
        function (input) {

            input.addEventListener(
                "input",
                function () {

                    validateField(
                        input
                    );

                }
            );


            input.addEventListener(
                "change",
                function () {

                    validateField(
                        input
                    );

                }
            );


            input.addEventListener(
                "blur",
                function () {

                    validateField(
                        input
                    );

                }
            );

        }
    );


// ==========================================================
// 10. RESET FORM
// ==========================================================

function resetForm(form) {

    if (!form) {

        return;

    }

    form.reset();


    form
        .querySelectorAll(
            "input, select, textarea"
        )
        .forEach(
            function (input) {

                input.classList.remove(
                    "valid",
                    "invalid"
                );

            }
        );


    form
        .querySelectorAll(
            ".error-msg"
        )
        .forEach(
            function (message) {

                message.classList.remove(
                    "visible"
                );

            }
        );

}


// ==========================================================
// 11. REPORT NUMBER
// ==========================================================

function getNextReportID() {

    const records =
        getStoredRecords();

    let highestNumber = 800;


    records.forEach(
        function (record) {

            if (
                record.type === "incident" &&
                typeof record.id === "string"
            ) {

                const match =
                    record.id.match(
                        /^REP-(\d+)$/
                    );

                if (match) {

                    const number =
                        parseInt(
                            match[1]
                        );

                    if (
                        number >
                        highestNumber
                    ) {

                        highestNumber =
                            number;

                    }

                }

            }

        }
    );


    return (
        "REP-" +
        (highestNumber + 1)
    );

}


// ==========================================================
// 12. RENDER ALL SAVED RECORDS
// ==========================================================

function renderStoredRecords() {

    const residentTable =
        document.getElementById(
            "resIncidentBody"
        );

    const adminTable =
        document.getElementById(
            "adminReportBody"
        );

    const disposalTable =
        document.getElementById(
            "facDisposalBody"
        );


    const records =
        getStoredRecords();


    // ------------------------------------------------------
    // INCIDENT TABLES
    // ------------------------------------------------------

    if (residentTable) {

        residentTable.innerHTML = "";

    }


    if (adminTable) {

        adminTable.innerHTML = "";

    }


    const incidentRecords =
        records.filter(
            function (record) {

                return (
                    record.type ===
                    "incident"
                );

            }
        );


    if (
        incidentRecords.length === 0
    ) {

        if (residentTable) {

            residentTable.innerHTML =
                `
                <tr>
                    <td colspan="4">
                        No incident records found.
                    </td>
                </tr>
                `;

        }


        if (adminTable) {

            adminTable.innerHTML =
                `
                <tr>
                    <td colspan="6">
                        No incident records found.
                    </td>
                </tr>
                `;

        }

    }


    incidentRecords.forEach(
        function (record) {

            const status =
                record.status ||
                "Under Review";


            const statusClass =
                status === "Resolved"
                    ? "badge-success"
                    : "badge-warning";


            // --------------------------------------------------
            // RESIDENT TABLE
            // --------------------------------------------------

            if (residentTable) {

                const residentRow =
                    document.createElement(
                        "tr"
                    );

                residentRow.id =
                    "res-row-" +
                    record.id;


                residentRow.innerHTML =
                    `
                    <td>
                        ${escapeHTML(record.id)}
                    </td>

                    <td>
                        ${escapeHTML(record.location)}
                    </td>

                    <td>
                        ${escapeHTML(record.details)}
                    </td>

                    <td class="status-cell">

                        <span class="badge ${statusClass}">
                            ${escapeHTML(status)}
                        </span>

                    </td>
                    `;


                residentTable.prepend(
                    residentRow
                );

            }


            // --------------------------------------------------
            // ADMIN TABLE
            // --------------------------------------------------

            if (adminTable) {

                const adminRow =
                    document.createElement(
                        "tr"
                    );

                adminRow.id =
                    "admin-row-" +
                    record.id;


                adminRow.innerHTML =
                    `
                    <td>
                        ${escapeHTML(record.id)}
                    </td>

                    <td>
                        ${escapeHTML(
                            record.resident ||
                            "Resident"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(record.location)}
                    </td>

                    <td>
                        ${escapeHTML(record.details)}
                    </td>

                    <td class="status-cell">

                        <span class="badge ${statusClass}">
                            ${escapeHTML(status)}
                        </span>

                    </td>

                    <td>

                        <button
                            class="btn-action"
                            onclick="resolveReport('${escapeHTML(record.id)}')"
                        >

                            ${
                                status ===
                                "Resolved"
                                    ? "Resolved"
                                    : "Resolve"
                            }

                        </button>

                    </td>
                    `;


                adminTable.prepend(
                    adminRow
                );

            }

        }
    );


    // ------------------------------------------------------
    // DISPOSAL TABLE
    // ------------------------------------------------------

    if (disposalTable) {

        disposalTable.innerHTML = "";

    }


    const disposalRecords =
        records.filter(
            function (record) {

                return (
                    record.type ===
                    "disposal"
                );

            }
        );


    if (
        disposalRecords.length === 0
    ) {

        if (disposalTable) {

            disposalTable.innerHTML =
                `
                <tr>
                    <td colspan="4">
                        No disposal records found.
                    </td>
                </tr>
                `;

        }

    }


    disposalRecords.forEach(
        function (record) {

            if (!disposalTable) {

                return;

            }


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML =
                `
                <td>
                    ${escapeHTML(
                        record.crew ||
                        "Collection Crew"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.site
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        record.weight
                    )} kg
                </td>

                <td>
                    ${escapeHTML(
                        record.dateSubmitted
                    )}
                </td>
                `;


            disposalTable.prepend(
                row
            );

        }
    );

}


// ==========================================================
// 13. RESOLVE INCIDENT REPORT
// ==========================================================

function resolveReport(reportID) {

    const records =
        getStoredRecords();


    const target =
        records.find(
            function (record) {

                return (
                    record.type ===
                    "incident" &&
                    record.id ===
                    reportID
                );

            }
        );


    if (!target) {

        alert(
            "The selected report could not be found."
        );

        return;

    }


    target.status =
        "Resolved";


    target.updatedAt =
        new Date().toISOString();


    if (
        saveStoredRecords(records)
    ) {

        renderStoredRecords();


        alert(
            "Report " +
            reportID +
            " has been marked as Resolved."
        );

    }

}


// Keep compatibility with the button
// used by the original HTML.

function resolveAdminReport(reportID) {

    resolveReport(reportID);

}


// ==========================================================
// 14. LOGIN / REGISTER SWITCH
// ==========================================================

if (showRegister) {

    showRegister.addEventListener(
        "click",
        function () {

            if (loginSection) {

                loginSection.classList.remove(
                    "active"
                );

            }

            if (registerSection) {

                registerSection.classList.add(
                    "active"
                );

            }

        }
    );

}


if (showLogin) {

    showLogin.addEventListener(
        "click",
        function () {

            if (registerSection) {

                registerSection.classList.remove(
                    "active"
                );

            }

            if (loginSection) {

                loginSection.classList.add(
                    "active"
                );

            }

        }
    );

}


// ==========================================================
// 15. ROLE DETECTION
// ==========================================================

function inferRoleFromUsername(
    username
) {

    const value =
        username
            .trim()
            .toLowerCase();


    if (
        value.includes("admin") ||
        value.includes("officer") ||
        value.includes("manager")
    ) {

        return "admin";

    }


    if (
        value.includes("crew") ||
        value.includes("truck") ||
        value.includes("collection")
    ) {

        return "crew";

    }


    if (
        value.includes("facilitator") ||
        value.includes("city")
    ) {

        return "facilitator";

    }


    return "resident";

}


// ==========================================================
// 16. SHOW DASHBOARD BY ROLE
// ==========================================================

function showDashboard(
    role,
    username
) {

    document
        .querySelectorAll(
            ".section-area"
        )
        .forEach(
            function (section) {

                section.classList.remove(
                    "active"
                );

            }
        );


    document
        .querySelectorAll(
            ".view-panel"
        )
        .forEach(
            function (panel) {

                panel.classList.remove(
                    "active"
                );

            }
        );


    document
        .querySelectorAll(
            ".displayUser"
        )
        .forEach(
            function (element) {

                element.textContent =
                    username;

            }
        );


    if (role === "admin") {

        if (adminArea) {

            adminArea.classList.add(
                "active"
            );

        }

        renderStoredRecords();
        renderChart();

    }

    else if (role === "crew") {

        if (crewArea) {

            crewArea.classList.add(
                "active"
            );

        }

    }

    else if (
        role === "facilitator"
    ) {

        if (facilitatorArea) {

            facilitatorArea.classList.add(
                "active"
            );

        }

        renderStoredRecords();

    }

    else {

        if (residentArea) {

            residentArea.classList.add(
                "active"
            );

        }

        renderStoredRecords();

    }

}


// ==========================================================
// 17. LOGIN FORM
// ==========================================================

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ----------------------------------------------
            // Validate before login
            // ----------------------------------------------

            if (
                !validateForm(
                    loginForm
                )
            ) {

                alert(
                    "Please correct the highlighted fields before signing in."
                );

                return;

            }


            const username =
                document.getElementById(
                    "loginUser"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPass"
                ).value;


            const accounts =
                getStoredAccounts();


            const account =
                accounts.find(
                    function (item) {

                        return (
                            item.username
                                .toLowerCase() ===
                            username.toLowerCase() &&
                            item.password ===
                            password
                        );

                    }
                );


            if (!account) {

                alert(
                    "No registered account was found with these credentials. Please register first."
                );

                return;

            }


            // Use saved role from registration.
            // If old account has no role,
            // use username detection.

            const role =
                account.role ||
                inferRoleFromUsername(
                    username
                );


            showDashboard(
                role,
                username
            );


            resetForm(
                loginForm
            );

        }
    );

}


// ==========================================================
// 18. REGISTER FORM
// ==========================================================

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ----------------------------------------------
            // Validate all registration fields first
            // ----------------------------------------------

            if (
                !validateForm(
                    registerForm
                )
            ) {

                alert(
                    "Please correct the highlighted fields before creating your account."
                );

                return;

            }


            const usernameElement =
                document.getElementById(
                    "regUser"
                );


            const passwordElement =
                document.getElementById(
                    "regPassword"
                );


            const roleElement =
                document.getElementById(
                    "regRole"
                );


            if (
                !usernameElement ||
                !passwordElement ||
                !roleElement
            ) {

                alert(
                    "Some registration fields are missing from the form."
                );

                return;

            }


            const username =
                usernameElement.value.trim();


            const password =
                passwordElement.value;


            const role =
                roleElement.value;


            const accounts =
                getStoredAccounts();


            const alreadyRegistered =
                accounts.some(
                    function (account) {

                        return (
                            account.username
                                .toLowerCase() ===
                            username.toLowerCase()
                        );

                    }
                );


            if (alreadyRegistered) {

                alert(
                    "That username or account ID is already registered. Please use another one."
                );

                return;

            }


            // ----------------------------------------------
            // Store account
            // ----------------------------------------------

            const newAccount = {

                username:
                    username,

                password:
                    password,

                role:
                    role,

                firstName:
                    document.getElementById(
                        "regFirstName"
                    )?.value.trim() || "",

                middleName:
                    document.getElementById(
                        "regMiddleName"
                    )?.value.trim() || "",

                lastName:
                    document.getElementById(
                        "regLastName"
                    )?.value.trim() || "",

                email:
                    document.getElementById(
                        "regEmail"
                    )?.value.trim() || "",

                createdAt:
                    new Date().toISOString()

            };


            accounts.push(
                newAccount
            );


            if (
                !saveStoredAccounts(
                    accounts
                )
            ) {

                return;

            }


            alert(
                "Registration successful! Please login."
            );


            if (registerSection) {

                registerSection.classList.remove(
                    "active"
                );

            }


            if (loginSection) {

                loginSection.classList.add(
                    "active"
                );

            }


            resetForm(
                registerForm
            );

        }
    );

}


// ==========================================================
// 19. RESIDENT INCIDENT REPORT
// ==========================================================

if (residentReportForm) {

    residentReportForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ----------------------------------------------
            // IMPORTANT:
            // Do not save anything until validation passes.
            // ----------------------------------------------

            if (
                !validateForm(
                    residentReportForm
                )
            ) {

                alert(
                    "Please correct the highlighted fields before submitting."
                );

                return;

            }


            const locationElement =
                document.getElementById(
                    "resIncLoc"
                );


            const detailsElement =
                document.getElementById(
                    "resIncDetails"
                );


            if (
                !locationElement ||
                !detailsElement
            ) {

                alert(
                    "Incident form fields could not be found."
                );

                return;

            }


            const location =
                locationElement.value.trim();


            const details =
                detailsElement.value.trim();


            const reportID =
                getNextReportID();


            const currentUserElement =
                document.querySelector(
                    "#residentArea .displayUser"
                );


            const resident =
                currentUserElement
                    ? currentUserElement.textContent.trim()
                    : "Resident";


            const newRecord = {

                type:
                    "incident",

                id:
                    reportID,

                resident:
                    resident,

                location:
                    location,

                details:
                    details,

                status:
                    "Under Review",

                createdAt:
                    new Date().toISOString()

            };


            // ----------------------------------------------
            // SAVE ONLY AFTER VALIDATION
            // ----------------------------------------------

            const records =
                getStoredRecords();


            records.push(
                newRecord
            );


            if (
                !saveStoredRecords(
                    records
                )
            ) {

                return;

            }


            // ----------------------------------------------
            // UPDATE TABLE IMMEDIATELY
            // ----------------------------------------------

            renderStoredRecords();


            alert(
                "Incident report " +
                reportID +
                " submitted successfully!"
            );


            resetForm(
                residentReportForm
            );

        }
    );

}


// ==========================================================
// 20. FEEDBACK FORM
// ==========================================================

if (feedbackForm) {

    feedbackForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                !validateForm(
                    feedbackForm
                )
            ) {

                alert(
                    "Please correct the highlighted fields before submitting your feedback."
                );

                return;

            }


            const rating =
                document.getElementById(
                    "fbRating"
                ).value;


            const comment =
                document.getElementById(
                    "fbComment"
                ).value.trim();


            const currentUser =
                document.querySelector(
                    "#residentArea .displayUser"
                );


            const resident =
                currentUser
                    ? currentUser.textContent.trim()
                    : "Resident";


            const newRecord = {

                type:
                    "feedback",

                resident:
                    resident,

                rating:
                    rating,

                comment:
                    comment,

                createdAt:
                    new Date().toISOString()

            };


            const records =
                getStoredRecords();


            records.push(
                newRecord
            );


            if (
                !saveStoredRecords(
                    records
                )
            ) {

                return;

            }


            alert(
                "Thank you! Your feedback has been submitted successfully."
            );


            resetForm(
                feedbackForm
            );

        }
    );

}


// ==========================================================
// 21. CREW SEGREGATION FORM
// ==========================================================

if (crewSegForm) {

    crewSegForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                !validateForm(
                    crewSegForm
                )
            ) {

                alert(
                    "Please correct the highlighted fields."
                );

                return;

            }


            const location =
                document.getElementById(
                    "segLoc"
                ).value.trim();


            const status =
                document.getElementById(
                    "segStatus"
                ).value;


            const currentUser =
                document.querySelector(
                    "#crewArea .displayUser"
                );


            const crew =
                currentUser
                    ? currentUser.textContent.trim()
                    : "Collection Crew";


            const newRecord = {

                type:
                    "segregation",

                crew:
                    crew,

                location:
                    location,

                status:
                    status,

                createdAt:
                    new Date().toISOString()

            };


            const records =
                getStoredRecords();


            records.push(
                newRecord
            );


            if (
                !saveStoredRecords(
                    records
                )
            ) {

                return;

            }


            alert(
                "Segregation compliance record submitted successfully!"
            );


            resetForm(
                crewSegForm
            );

        }
    );

}


// ==========================================================
// 22. DISPOSAL FORM
// ==========================================================

if (disposalForm) {

    disposalForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ----------------------------------------------
            // Validate first
            // ----------------------------------------------

            if (
                !validateForm(
                    disposalForm
                )
            ) {

                alert(
                    "Please correct the highlighted fields."
                );

                return;

            }


            const weight =
                document.getElementById(
                    "dispWeight"
                ).value;


            const site =
                document.getElementById(
                    "dispSite"
                ).value.trim();


            const currentUser =
                document.querySelector(
                    "#crewArea .displayUser"
                );


            const crew =
                currentUser
                    ? currentUser.textContent.trim()
                    : "Collection Crew";


            const dateSubmitted =
                new Date().toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "short",
                        day: "numeric"
                    }
                );


            const newRecord = {

                type:
                    "disposal",

                crew:
                    crew,

                site:
                    site,

                weight:
                    weight,

                dateSubmitted:
                    dateSubmitted,

                createdAt:
                    new Date().toISOString()

            };


            // ----------------------------------------------
            // SAVE TO LOCAL STORAGE
            // ----------------------------------------------

            const records =
                getStoredRecords();


            records.push(
                newRecord
            );


            if (
                !saveStoredRecords(
                    records
                )
            ) {

                return;

            }


            // ----------------------------------------------
            // UPDATE FACILITATOR TABLE
            // ----------------------------------------------

            renderStoredRecords();


            alert(
                "Disposal data submitted successfully!"
            );


            resetForm(
                disposalForm
            );

        }
    );

}


// ==========================================================
// 23. CITY / REGION SELECTION
// ==========================================================

const regRegion =
    document.getElementById(
        "regRegion"
    );

const regCity =
    document.getElementById(
        "regCity"
    );


const cityOptionsByRegion = {

    "NCR": [
        "Caloocan City",
        "Las Piñas City",
        "Makati City",
        "Malabon City",
        "Mandaluyong City",
        "Manila City",
        "Marikina City",
        "Muntinlupa City",
        "Navotas City",
        "Parañaque City",
        "Pasay City",
        "Pasig City",
        "Quezon City",
        "San Juan City",
        "Taguig City",
        "Valenzuela City",
        "Pateros"
    ],

    "CAR": [
        "Baguio City",
        "Tabuk City",
        "La Trinidad",
        "Bangued",
        "Banaue",
        "Bontoc",
        "Lagawe",
        "Sagada"
    ],

    "Region I": [
        "Laoag City",
        "Batac City",
        "Vigan City",
        "Candon City",
        "San Fernando City",
        "Alaminos City",
        "Dagupan City",
        "Urdaneta City",
        "Lingayen",
        "Binalonan",
        "Rosales"
    ],

    "Region II": [
        "Tuguegarao City",
        "Santiago City",
        "Ilagan City",
        "Cauayan City",
        "Aparri",
        "Baggao",
        "Cabagan",
        "Solana"
    ],

    "Region III": [
        "Angeles City",
        "Balanga City",
        "Cabanatuan City",
        "Gapan City",
        "Olongapo City",
        "San Fernando City",
        "Tarlac City",
        "Baliuag",
        "Guagua",
        "Lubao"
    ],

    "Region IV-A": [
        "Bacoor City",
        "Batangas City",
        "Biñan City",
        "Cainta",
        "Calamba City",
        "Cavite City",
        "Dasmariñas City",
        "General Trias City",
        "Imus City",
        "Lipa City",
        "Lucena City",
        "San Pablo City",
        "Santa Rosa City",
        "Tagaytay City",
        "Tanauan City",
        "Taytay",
        "Silang"
    ],

    "Region IV-B": [
        "Calapan City",
        "Puerto Princesa City",
        "Santa Cruz",
        "Brooke's Point",
        "Coron",
        "El Nido",
        "Odiongan",
        "Looc",
        "San Vicente"
    ],

    "Region V": [
        "Legazpi City",
        "Ligao City",
        "Masbate City",
        "Naga City",
        "Sorsogon City",
        "Iriga City",
        "Tabaco City",
        "Virac",
        "Pili",
        "Bulan",
        "Donsol"
    ],

    "Region VI": [
        "Bacolod City",
        "Cadiz City",
        "Escalante City",
        "Himamaylan City",
        "Iloilo City",
        "Kabankalan City",
        "Passi City",
        "Roxas City",
        "San Carlos City",
        "Sipalay City",
        "Talisay City",
        "Victorias City"
    ],

    "Region VII": [
        "Bogo City",
        "Carcar City",
        "Cebu City",
        "Danao City",
        "Lapu-Lapu City",
        "Mandaue City",
        "Tagbilaran City",
        "Toledo City",
        "Talisay City",
        "Dumaguete City"
    ],

    "Region VIII": [
        "Baybay City",
        "Borongan City",
        "Catbalogan City",
        "Maasin City",
        "Ormoc City",
        "Tacloban City",
        "Abuyog",
        "Catarman",
        "Guiuan"
    ],

    "Region IX": [
        "Dapitan City",
        "Dipolog City",
        "Pagadian City",
        "Zamboanga City",
        "Ipil",
        "Kabasalan",
        "Liloy",
        "Siocon"
    ],

    "Region X": [
        "Cagayan de Oro City",
        "El Salvador City",
        "Gingoog City",
        "Iligan City",
        "Malaybalay City",
        "Ozamiz City",
        "Valencia City",
        "Opol",
        "Balingasag"
    ],

    "Region XI": [
        "Davao City",
        "Digos City",
        "Kidapawan City",
        "Mati City",
        "Panabo City",
        "Samal City",
        "Tagum City",
        "Bansalan",
        "Magsaysay",
        "Malita"
    ],

    "Region XII": [
        "General Santos City",
        "South Cotabato",
        "Cotabato",
        "Sarangani",
        "Sultan Kudarat"
    ],

    "Region XIII": [
        "Butuan City",
        "Cabadbaran City",
        "Bislig City",
        "Surigao City",
        "Tandag City",
        "Bayugan City",
        "San Francisco",
        "Prosperidad",
        "Placer"
    ],

    "BARMM": [
        "Cotabato City",
        "Jolo",
        "Lamitan City",
        "Marawi City",
        "Isabela City",
        "Bongao",
        "Parang",
        "Sultan Kudarat",
        "Talipao"
    ]

};


function populateCityOptions(
    regionValue
) {

    if (!regCity) {

        return;

    }


    const cities =
        cityOptionsByRegion[
            regionValue
        ] || [];


    regCity.innerHTML =
        `
        <option
            value=""
            disabled
            selected
        >
            Select City
        </option>
        `;


    cities.forEach(
        function (city) {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                city;

            option.textContent =
                city;

            regCity.appendChild(
                option
            );

        }
    );


    regCity.disabled =
        cities.length === 0;

}


if (
    regRegion &&
    regCity
) {

    regRegion.addEventListener(
        "change",
        function () {

            populateCityOptions(
                this.value
            );

            validateField(
                regRegion
            );

        }
    );

}


// ==========================================================
// 24. DASHBOARD PANEL SWITCHING
// ==========================================================

function switchPanel(
    panelId
) {

    const panel =
        document.getElementById(
            panelId
        );


    if (!panel) {

        return;

    }


    const dashboard =
        panel.closest(
            ".dashboard-card"
        );


    if (!dashboard) {

        return;

    }


    dashboard
        .querySelectorAll(
            ".view-panel"
        )
        .forEach(
            function (item) {

                item.classList.remove(
                    "active"
                );

            }
        );


    panel.classList.add(
        "active"
    );


    // Refresh tables whenever
    // a relevant panel is opened.

    if (
        panelId ===
        "resIncident" ||
        panelId ===
        "admReports" ||
        panelId ===
        "facDisposalData"
    ) {

        renderStoredRecords();

    }

}


// ==========================================================
// 25. LOGOUT
// ==========================================================

document
    .querySelectorAll(
        ".logoutBtn"
    )
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".section-area"
                        )
                        .forEach(
                            function (section) {

                                section.classList.remove(
                                    "active"
                                );

                            }
                        );


                    document
                        .querySelectorAll(
                            ".view-panel"
                        )
                        .forEach(
                            function (panel) {

                                panel.classList.remove(
                                    "active"
                                );

                            }
                        );


                    if (loginSection) {

                        loginSection.classList.add(
                            "active"
                        );

                    }

                }
            );

        }
    );


// ==========================================================
// 26. ADMIN CHART
// ==========================================================

let adminChart = null;


function renderChart() {

    const chartCanvas =
        document.getElementById(
            "adminAnalyticsChart"
        );


    if (
        !chartCanvas ||
        typeof Chart === "undefined"
    ) {

        return;

    }


    const context =
        chartCanvas.getContext(
            "2d"
        );


    if (adminChart) {

        adminChart.destroy();

    }


    const records =
        getStoredRecords();


    const disposalRecords =
        records.filter(
            function (record) {

                return (
                    record.type ===
                    "disposal"
                );

            }
        );


    let totalWeight = 0;


    disposalRecords.forEach(
        function (record) {

            const weight =
                Number(
                    record.weight
                );


            if (
                Number.isFinite(weight)
            ) {

                totalWeight +=
                    weight;

            }

        }
    );


    const incidentCount =
        records.filter(
            function (record) {

                return (
                    record.type ===
                    "incident"
                );

            }
        ).length;


    const resolvedCount =
        records.filter(
            function (record) {

                return (
                    record.type ===
                    "incident" &&
                    record.status ===
                    "Resolved"
                );

            }
        ).length;


    adminChart =
        new Chart(
            context,
            {

                type: "bar",

                data: {

                    labels: [
                        "Incident Reports",
                        "Resolved Reports",
                        "Disposal Weight (kg)"
                    ],

                    datasets: [

                        {

                            label:
                                "SWCRS Records",

                            data: [

                                incidentCount,

                                resolvedCount,

                                totalWeight

                            ],

                            backgroundColor: [
                                "#22c55e",
                                "#0ea5e9",
                                "#8b5cf6"
                            ]

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    scales: {

                        y: {

                            beginAtZero:
                                true

                        }

                    }

                }

            }
        );

}


// ==========================================================
// 27. REFRESH RECORDS AFTER PAGE LOAD
// ==========================================================

// Task 7:
// Retrieve previously saved Local Storage data
// when the page is refreshed.

initializeStorage();

renderStoredRecords();


// ==========================================================
// 28. CONSOLE TEST INFORMATION
// ==========================================================

console.log(
    "SWCRS Task 7 loaded successfully."
);

console.log(
    "Stored records:",
    getStoredRecords()
);