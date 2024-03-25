var data = [];

function resetForm() {
    document.getElementById("nim").value = "";
    document.getElementById("nama").value = "";
    document.getElementById("alamat").value = "";
}

function displayData() {
    var displayDataBody = document.getElementById("displayData");
    displayDataBody.innerHTML = "";
    data.forEach(function(row, index) {
        var newRow = "<tr>";
        newRow += "<td>" + row.nim + "</td>";
        newRow += "<td>" + row.nama + "</td>";
        newRow += "<td>" + row.alamat + "</td>";
        newRow +=
            "<td><button type='button' class='btn btn-danger' onclick='deleteRow(" +
            index +
            ")'>Delete</button> ";
        newRow +=
            "<button type='button' class='btn btn-primary' onclick='editRow(" +
            index +
            ")'>Edit</button></td>";
        newRow += "</tr>";
        displayDataBody.innerHTML += newRow;
    });
}

function deleteRow(index) {
    var startIndex = (currentPage - 1) * itemsPerPage;
    var dataIndex = startIndex + index;

    data.splice(dataIndex, 1);
    localStorage.setItem('mahasiswaData', JSON.stringify(data));
    displayDataWithPagination();
    showAlert("Deleted", "Data Mahasiswa Telah Dihapus");
}

function editRow(index) {
    var row = data[index];
    document.getElementById("nama").value = row.nama;
    document.getElementById("alamat").value = row.alamat;
    displayData();
    showAlert("Info", "Tidak dapat mengedit NIM.");
    document.getElementById("nim").disabled = true;
}

function hideAlert() {
    var alertContainer = document.getElementById("alertContainer");
    if (alertContainer) {
        alertContainer.style.display = "none";
    }
}

function showAlert(type, message) {
    var alertContainer = document.getElementById("alertContainer");
    if (alertContainer) {
        alertContainer.remove();
    }
    var alertBar = document.createElement("div");
    alertBar.style.cssText =
        "padding: 10px; border: 1px solid #FFA500; text-align: left;";
    alertBar.innerHTML =
        "<strong>" +
        type +
        '!</strong> <span id="closeAlert" style="float:right; cursor:pointer;">Just now~ <span style="cursor:pointer;">x</span></span>';

    var alertText = document.createElement("div");
    alertText.style.cssText = "padding: 10px; border: 1px solid #FFA500;";
    alertText.textContent = message;

    if (type === "Warning") {
        alertBar.style.backgroundColor = "#FFCC00";
        alertBar.style.color = "white";
        alertText.style.backgroundColor = "white";
        alertText.style.color = "black";
    } else if (type === "Added") {
        alertBar.style.backgroundColor = "#4CAF50";
        alertBar.style.color = "white";
        alertText.style.backgroundColor = "white";
        alertText.style.color = "black";
    } else if (type === "Deleted") {
        alertBar.style.backgroundColor = "#FF0000";
        alertBar.style.color = "white";
        alertText.style.backgroundColor = "white";
        alertText.style.color = "black";
    } else if (type === "Updated") {
        alertBar.style.backgroundColor = "#0000FF";
        alertBar.style.color = "white";
        alertText.style.backgroundColor = "white";
        alertText.style.color = "black";
    }

    alertContainer = document.createElement("div");
    alertContainer.id = "alertContainer";
    alertContainer.appendChild(alertBar);
    alertContainer.appendChild(alertText);

    var form = document.getElementById("dataForm");
    form.parentNode.insertBefore(alertContainer, form.nextSibling);

    var closeAlertButton = document.getElementById("closeAlert");
    if (closeAlertButton) {
        closeAlertButton.addEventListener("click", hideAlert);
    }

    alertContainer.style.display = "block";

    setTimeout(function() {
        alertContainer.style.display = "none";
    }, 6000);
}

function addData(nim, nama, alamat) {
    data.push({ nim: nim, nama: nama, alamat: alamat });
    localStorage.setItem('mahasiswaData', JSON.stringify(data));
    resetForm();
    showAlert("Added", "Berhasil menambahkan data");
    displayDataWithPagination();
}


document
    .getElementById("dataForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();
        var nim = document.getElementById("nim").value;
        var nama = document.getElementById("nama").value;
        var alamat = document.getElementById("alamat").value;

        if (!nim || !nama || !alamat) {
            showAlert("Warning", "Tidak Dapat Menambah Mahasiswa");
        } else {
            addData(nim, nama, alamat);
        }
    });

function updatetime() {
    var d = new Date();
    var hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
    var minutes = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
    var seconds = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
    var time = hours + " : " + minutes + " : " + seconds;
    document.getElementById("time").innerHTML = time;
}

setInterval(updatetime, 1000);

let editIndex = null;

function editRow(index) {
    var startIndex = (currentPage - 1) * itemsPerPage;
    editIndex = startIndex + index;
    var row = data[editIndex];

    document.getElementById("editNim").value = row.nim;
    document.getElementById("editNama").value = row.nama;
    document.getElementById("editAlamat").value = row.alamat;

    var editModal = new bootstrap.Modal(
        document.getElementById("editDataModal"), {
            keyboard: false,
        }
    );
    editModal.show();

    var saveButton = document.getElementById("saveButton");
    saveButton.removeEventListener("click", saveEditData);
    saveButton.addEventListener("click", saveEditData);
}

function saveEditData() {
    var nama = document.getElementById("editNama").value;
    var alamat = document.getElementById("editAlamat").value;

    data[editIndex].nama = nama;
    data[editIndex].alamat = alamat;

    displayDataWithPagination();
    var editModal = bootstrap.Modal.getInstance(
        document.getElementById("editDataModal")
    );
    editModal.hide();
    showAlert("Updated", "Data berhasil diperbarui!");

    editIndex = null;
}

document
    .getElementById("dataForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();
        this.classList.add("submitted");
    });

document.addEventListener("click", function() {
    playSound();
});

function playSound() {
    var audio = new Audio("sound.mp3");
    audio.play();
}
document.addEventListener("DOMContentLoaded", function() {
    var username = prompt("Masukkan nama Anda:");
    if (username !== null && username !== "") {
        document.getElementById("greeting").innerText = "Hello, " + username + "!";
    }
});

document.addEventListener("DOMContentLoaded", function() {
    var storedData = localStorage.getItem('mahasiswaData');
    if (storedData) {
        data = JSON.parse(storedData);
        displayData();
    } else {
        data = [];
    }
});

document.getElementById("nim").addEventListener("input", function() {
    var input = this.value;
    var regex = /\D/g;

    if (input.length > 11) {
        input = input.slice(0, 11);
    }

    this.value = input.replace(regex, "");
});

function searchData() {
    var searchValue = document.getElementById("searchInput").value.toLowerCase();
    var filteredData = data.filter(function(item) {
        return (
            item.nama.toLowerCase().includes(searchValue) ||
            item.nim.includes(searchValue)
        );
    });
    displayFilteredData(filteredData);
}

function displayFilteredData(filteredData) {
    var displayDataBody = document.getElementById("displayData");
    displayDataBody.innerHTML = "";
    filteredData.forEach(function(row, index) {
        var newRow = "<tr>";
        newRow += "<td>" + row.nim + "</td>";
        newRow += "<td>" + row.nama + "</td>";
        newRow += "<td>" + row.alamat + "</td>";
        newRow +=
            "<td><button type='button' class='btn btn-danger' onclick='deleteRow(" +
            index +
            ")'>Delete</button> ";
        newRow +=
            "<button type='button' class='btn btn-primary' onclick='editRow(" +
            index +
            ")'>Edit</button></td>";
        newRow += "</tr>";
        displayDataBody.innerHTML += newRow;
    });
}

var currentPage = 1;
var itemsPerPage = 5;

function displayDataWithPagination() {
    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = startIndex + itemsPerPage;
    var paginatedData = data.slice(startIndex, endIndex);

    clearTable();
    displayFilteredData(paginatedData);
}

function clearTable() {
    var displayDataBody = document.getElementById("displayData");
    displayDataBody.innerHTML = "";
}


function updatePaginationButtons() {
    var totalPages = Math.ceil(data.length / itemsPerPage);
    var prevButton = document.getElementById("prevButton");
    var nextButton = document.getElementById("nextButton");

    if (currentPage === 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }

    if (currentPage === totalPages) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
}

function checkAndNavigateNextPage() {
    if (data.length > itemsPerPage * currentPage) {
        currentPage++;
        displayDataWithPagination();
        updatePaginationButtons();
    }
}

document.getElementById("prevButton").addEventListener("click", function() {
    if (currentPage > 1) {
        currentPage--;
        displayDataWithPagination();
        updatePaginationButtons();
    }
});

document.getElementById("nextButton").addEventListener("click", function() {
    var totalPages = Math.ceil(data.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayDataWithPagination();
        updatePaginationButtons();
    }
});


document.addEventListener("DOMContentLoaded", function() {
    displayDataWithPagination();
    updatePaginationButtons();
    checkAndNavigateNextPage();
});