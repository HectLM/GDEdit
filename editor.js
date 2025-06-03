const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 40;
let objects = [];
let selectedObject = null;

// Function to draw the grid
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#ddd";

    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

// Function to draw all objects
function drawObjects() {
    objects.forEach(obj => {
        ctx.fillStyle = obj.color;

        ctx.save();
        ctx.translate(obj.x + gridSize / 2, obj.y + gridSize / 2);
        ctx.rotate(obj.rotation * Math.PI / 180);

        if (obj.type === "cube") {
            ctx.fillRect(-gridSize / 2, -gridSize / 2, gridSize, gridSize);
        } else if (obj.type === "slab") {
            ctx.fillRect(-gridSize / 4, -gridSize / 2, gridSize / 2, gridSize);
		} else if (obj.type === "triangle") {
			ctx.beginPath();
			ctx.moveTo(-gridSize / 2, gridSize / 2);
			ctx.lineTo(0, -gridSize / 2);
			ctx.lineTo(gridSize / 2, gridSize / 2);
			ctx.closePath();
			ctx.fill();
        } else if (obj.type === "slope1") {
            ctx.beginPath();
            ctx.moveTo(-gridSize / 2, gridSize / 2);
            ctx.lineTo(gridSize / 2, -gridSize / 2);
            ctx.lineTo(gridSize / 2, gridSize / 2);
            ctx.closePath();
            ctx.fill();
        } else if (obj.type === "slope2") {
            ctx.beginPath();
            ctx.moveTo(-gridSize + gridSize / 2, gridSize / 2); // Shifted right
            ctx.lineTo(gridSize + gridSize / 2, -gridSize / 2);
            ctx.lineTo(gridSize + gridSize / 2, gridSize / 2);
            ctx.closePath();
            ctx.fill();
        } else if (obj.type.startsWith("orb")) {
            ctx.beginPath();
            ctx.arc(0, 0, obj.width / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (obj.type.startsWith("pad")) {
            ctx.fillRect(-obj.width / 2, obj.height / 2, obj.width, obj.height);
        } else if (obj.type === "triangle") {
            ctx.beginPath();
            ctx.moveTo(-gridSize / 2, gridSize / 2);
            ctx.lineTo(0, -gridSize / 2);
            ctx.lineTo(gridSize / 2, gridSize / 2);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();

        // Selection outline: ONLY highlights the grid space containing the object
        if (selectedObject === obj) {
            ctx.strokeStyle = "green";
            ctx.lineWidth = 3;
            ctx.strokeRect(
                Math.floor(obj.x / gridSize) * gridSize,
                Math.floor(obj.y / gridSize) * gridSize,
                gridSize,
                gridSize
            );
        }
    });
}

// Function to update the canvas
function updateCanvas() {
    drawGrid();
    drawObjects();
}

// Function to add objects
function addObject(type) {
    let newObj = { x: 0, y: 0, type, color: "black", rotation: 0 };

    if (type === "slab") {
        newObj.width = gridSize / 2;
        newObj.height = gridSize;
	} else if (type === "triangle") {
		newObj.width = gridSize;
		newObj.height = gridSize;
    } else if (type === "slope1") {
        newObj.slopeType = "diagonal";
    } else if (type === "slope2") {
        newObj.slopeType = "gradual";
        newObj.width = gridSize * 2;
        newObj.height = gridSize;
        newObj.x = Math.floor(newObj.x / gridSize) * gridSize + gridSize / 2; // Shifted right
        newObj.y = Math.floor(newObj.y / gridSize) * gridSize;
    } else if (type.startsWith("orb")) {
        const colorMap = {
            "yellow": "#FFD700",
            "red": "#FF4500",
            "pink": "#FF69B4",
            "blue": "#ADD8E6",
            "green": "#90EE90",
            "black": "#000000"
        };
        newObj.color = colorMap[type.replace("orb-", "")];
        newObj.width = gridSize * 0.8;
        newObj.height = gridSize * 0.8;
    } else if (type.startsWith("pad")) {
        const padColorMap = {
            "yellow": "#FFD700",
            "red": "#FF4500",
            "pink": "#FF69B4",
            "blue": "#ADD8E6"
        };
        newObj.color = padColorMap[type.replace("pad-", "")];
        newObj.width = gridSize * 1;
        newObj.height = gridSize * 0.3;
        newObj.y = Math.floor(canvas.height / gridSize) * gridSize - newObj.height;
    }

    objects.push(newObj);
    selectedObject = newObj;
    updateCanvas();
}

// Function to copy & paste an object to the right
function copyPaste() {
    if (selectedObject) {
        const newObj = {
            x: selectedObject.x + gridSize, // Shifted right
            y: selectedObject.y,
            type: selectedObject.type,
            color: selectedObject.color,
            rotation: selectedObject.rotation,
            width: selectedObject.width, // Preserve width
            height: selectedObject.height // Preserve height
        };

        objects.push(newObj);
        selectedObject = newObj;
        updateCanvas();
    }
}

// Function to delete selected object
function deleteObject() {
    if (selectedObject) {
        objects = objects.filter(obj => obj !== selectedObject);
        selectedObject = null;
        updateCanvas();
    }
}

// Function to clear all objects
function clearCanvas() {
    objects = [];
    selectedObject = null;
    updateCanvas();
}

// Function to deselect the selected object
function deselectObject() {
    selectedObject = null;
    updateCanvas();
}

// Function to move selected object
function moveSelectedObject(dx, dy) {
    if (selectedObject) {
        selectedObject.x = Math.floor((selectedObject.x + dx * gridSize) / gridSize) * gridSize;
        selectedObject.y = Math.floor((selectedObject.y + dy * gridSize) / gridSize) * gridSize;
        updateCanvas();
    }
}

// Function to select an object when clicking
canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    selectedObject = objects.find(obj =>
        x >= obj.x && x <= obj.x + gridSize &&
        y >= obj.y && y <= obj.y + gridSize
    ) || null;

    updateCanvas();
});

function rotateObject() {
    if (selectedObject) {
        selectedObject.rotation = (selectedObject.rotation + 90) % 360;
        updateCanvas();
    }
}

document.addEventListener("keydown", (event) => {
    const moveAmount = event.shiftKey ? 5 : 1;
    switch (event.key.toLowerCase()) {
        case "w": moveSelectedObject(0, -moveAmount); break;
        case "s": moveSelectedObject(0, moveAmount); break;
        case "a": moveSelectedObject(-moveAmount, 0); break;
        case "d": moveSelectedObject(moveAmount, 0); break;
    }
});

function switchTab(tabName) {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.style.display = "none"; // Hide all tabs
    });

    document.getElementById(tabName).style.display = "block"; // Show the selected tab
}

// Ensure the Build tab is visible when the page loads
document.addEventListener("DOMContentLoaded", () => {
    switchTab("build");
});

// Save & Load system with slots
function saveLevel(slot) {
    localStorage.setItem(`GDEditLevel${slot}`, JSON.stringify(objects));
    alert(`Level saved to Slot ${slot}!`);
}

function loadLevel(slot) {
    const savedData = localStorage.getItem(`GDEditLevel${slot}`);
    if (savedData) {
        objects = JSON.parse(savedData);
        updateCanvas();
        alert(`Level loaded from Slot ${slot}!`);
    } else {
        alert(`No saved level found in Slot ${slot}.`);
    }
}

// Initialize the editor
updateCanvas();
