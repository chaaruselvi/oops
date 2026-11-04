
// Load saved data from browser storage

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];

let requests = JSON.parse(localStorage.getItem("requests")) || [];


// Save inventory

function saveInventory() {
    localStorage.setItem("inventory", JSON.stringify(inventory));
}


// Add inventory item

function addItem() {

    const name = document.getElementById("itemName").value.trim();

    const quantity = Number(document.getElementById("itemQuantity").value);

    if (name === "" || !Number.isInteger(quantity) || quantity <= 0) {
        alert("Enter a valid item name and quantity.");
        return;
    }

    inventory.push({
        name: name,
        quantity: quantity
    });

    saveInventory();

    document.getElementById("itemName").value = "";
    document.getElementById("itemQuantity").value = "";

    displayInventory();
}


// Display inventory

function displayInventory() {

    const list = document.getElementById("inventoryList");

    list.innerHTML = "";

    inventory.forEach((item, index) => {

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;

        const quantityCell = document.createElement("td");
        quantityCell.textContent = item.quantity;

        const actionCell = document.createElement("td");

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.onclick = function() {

            inventory.splice(index, 1);

            saveInventory();

            displayInventory();
        };

        actionCell.appendChild(deleteButton);

        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(actionCell);

        list.appendChild(row);
    });

    document.getElementById("totalItems").textContent = inventory.length;
}


// Save purchase requests

function saveRequests() {
    localStorage.setItem("requests", JSON.stringify(requests));
}


// Submit purchase request

function submitRequest() {

    const name = document.getElementById("requestName").value.trim();

    const quantity = Number(document.getElementById("requestQuantity").value);

    if (name === "" || !Number.isInteger(quantity) || quantity <= 0) {
        alert("Enter a valid item name and quantity.");
        return;
    }

    requests.push({
        name: name,
        quantity: quantity,
        status: "Pending"
    });

    saveRequests();

    document.getElementById("requestName").value = "";
    document.getElementById("requestQuantity").value = "";

    displayRequests();
}


// Display purchase requests

function displayRequests() {

    const list = document.getElementById("requestList");

    list.innerHTML = "";

    requests.forEach((request, index) => {

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = request.name;

        const quantityCell = document.createElement("td");
        quantityCell.textContent = request.quantity;

        const statusCell = document.createElement("td");
        statusCell.textContent = request.status;

        const actionCell = document.createElement("td");

        if (request.status === "Pending") {

            const approveButton = document.createElement("button");
            approveButton.textContent = "Approve";

            approveButton.onclick = function() {

                requests[index].status = "Approved";

                // Add approved quantity to inventory
                const existingItem = inventory.find(
                    item => item.name.toLowerCase() === request.name.toLowerCase()
                );

                if (existingItem) {
                    existingItem.quantity += request.quantity;
                } else {
                    inventory.push({
                        name: request.name,
                        quantity: request.quantity
                    });
                }

                saveRequests();
                saveInventory();

                displayRequests();
                displayInventory();
            };

            const rejectButton = document.createElement("button");
            rejectButton.textContent = "Reject";
            rejectButton.className = "reject-btn";

            rejectButton.onclick = function() {

                requests[index].status = "Rejected";

                saveRequests();

                displayRequests();
            };

            actionCell.appendChild(approveButton);
            actionCell.appendChild(rejectButton);

        } else {
            actionCell.textContent = "No action";
        }

        row.appendChild(nameCell);
        row.appendChild(quantityCell);
        row.appendChild(statusCell);
        row.appendChild(actionCell);

        list.appendChild(row);
    });

    const pending = requests.filter(
        request => request.status === "Pending"
    ).length;

    document.getElementById("pendingRequests").textContent = pending;
}


// Load everything when application opens

displayInventory();
displayRequests();
