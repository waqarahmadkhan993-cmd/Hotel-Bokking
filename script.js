
// Hotel Room Data
const rooms = [
    {
        name: "Standard Room",
        type: "Standard",
        price: 3500,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600",
        amenities: "WiFi, AC, TV"
    },
    {
        name: "Deluxe Room",
        type: "Deluxe",
        price: 6500,
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600",
        amenities: "WiFi, AC, Breakfast"
    },
    {
        name: "Luxury Suite",
        type: "Luxury",
        price: 12000,
        image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600",
        amenities: "WiFi, AC, Pool"
    }
];

// HTML Elements
const roomGrid = document.getElementById("roomGrid");
const priceFilter = document.getElementById("priceFilter");
const roomFilter = document.getElementById("roomFilter");

const bookingForm = document.getElementById("bookingForm");
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");
const guests = document.getElementById("guests");

const modal = document.getElementById("bookingModal");
const bookingDetails = document.getElementById("bookingDetails");
const totalPrice = document.getElementById("totalPrice");

let selectedRoom = null;
let bookingData = null;

// Set minimum date to today
const today = new Date().toLocaleDateString("en-CA");

checkin.min = today;
checkout.min = today;

// Display Rooms
function displayRooms(list = rooms) {

    roomGrid.innerHTML = "";

    if (list.length === 0) {
        roomGrid.innerHTML = "<p>No rooms found.</p>";
        return;
    }

    list.forEach((room) => {

        const index = rooms.indexOf(room);

        roomGrid.innerHTML += `
            <div class="room-card">

                <img src="${room.image}" alt="${room.name}">

                <div class="room-info">

                    <h3>${room.name}</h3>

                    <p>${room.type} Room</p>

                    <p class="amenities">
                        Facilities: ${room.amenities}
                    </p>

                    <div class="price">
                        Rs. ${room.price.toLocaleString()} / Night
                    </div>

                    <button class="book-btn"
                        onclick="bookRoom(${index})">
                        Book Now
                    </button>

                </div>
            </div>
        `;
    });
}

// Filter Rooms
function filterRooms() {

    const maxPrice = priceFilter.value;
    const selectedType = roomFilter.value;

    const filtered = rooms.filter(room => {

        const priceMatch =
            maxPrice === "all" || room.price < Number(maxPrice);

        const typeMatch =
            selectedType === "all" || room.type === selectedType;

        return priceMatch && typeMatch;
    });

    displayRooms(filtered);
}

priceFilter.addEventListener("change", filterRooms);
roomFilter.addEventListener("change", filterRooms);

// Check-in Date Validation
checkin.addEventListener("change", () => {
    checkout.min = checkin.value;

    if (checkout.value && checkout.value <= checkin.value) {
        checkout.value = "";
    }
});

// Search Form
bookingForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const start = new Date(checkin.value);
    const end = new Date(checkout.value);

    if (!checkin.value || !checkout.value) {
        showMessage("Please select both dates.");
        return;
    }

    if (end <= start) {
        showMessage("Check-out must be after check-in.");
        return;
    }

    showMessage("Dates selected! Choose your room below.", true);

    document.getElementById("rooms").scrollIntoView({
        behavior: "smooth"
    });
});

// Show Search Message
function showMessage(message, success = false) {
    const output = document.getElementById("searchMessage");

    output.textContent = message;
    output.style.color = success ? "green" : "red";
}

// Open Booking Modal
function bookRoom(index) {

    if (!checkin.value || !checkout.value) {
        showMessage("Please select check-in and check-out dates first.");
        return;
    }

    const start = new Date(checkin.value);
    const end = new Date(checkout.value);

    if (end <= start) {
        showMessage("Please select valid booking dates.");
        return;
    }

    selectedRoom = rooms[index];

    const oneDay = 24 * 60 * 60 * 1000;

    const nights = Math.round(
        (end - start) / oneDay
    );

    const guestCount = Number(guests.value);

    const total = selectedRoom.price * nights;

    bookingData = {
        room: selectedRoom.name,
        nights: nights,
        guests: guestCount,
        total: total
    };

    bookingDetails.innerHTML = `
        <strong>Room:</strong> ${selectedRoom.name}<br>
        <strong>Check-in:</strong> ${checkin.value}<br>
        <strong>Check-out:</strong> ${checkout.value}<br>
        <strong>Nights:</strong> ${nights}<br>
        <strong>Guests:</strong> ${guestCount}
    `;

    totalPrice.textContent =
        "Total Price: Rs. " + total.toLocaleString();

    document.getElementById("confirmMessage").textContent = "";

    modal.style.display = "flex";
}

// Confirm Booking
document.getElementById("confirmBtn").addEventListener("click", () => {

    if (!bookingData) return;

    document.getElementById("confirmMessage").textContent =
        "Booking request confirmed successfully!";

    document.getElementById("confirmMessage").style.color = "green";
});

// Close Modal
document.getElementById("closeModal").addEventListener("click", () => {
    modal.style.display = "none";
});

// Close Modal on Outside Click
modal.addEventListener("click", (event) => {

    if (event.target === modal) {
        modal.style.display = "none";
    }
});

// Initial Display
displayRooms();
