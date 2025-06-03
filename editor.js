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

        if (obj.type === "cube") {
            ctx.fillRect(obj.x, obj.y, gridSize, gridSize);
        } else if (obj.type === "triangle") {
            ctx.beginPath();
            ctx.moveTo(obj.x, obj.y + gridSize);
            ctx.lineTo(obj.x + gridSize / 2, obj.y);
            ctx.lineTo(obj.x + gridSize, obj.y + gridSize);
            ctx.closePath();
            ctx.fill();
        }

        // If this object is selected, draw a green outline
        if (selectedObject === obj) {
            ctx.strokeStyle = "green";
            ctx.lineWidth = 3;
            ctx.strokeRect(obj.x, obj.y, gridSize, gridSize);
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
    const newObj = { x: 0, y: 0, type, color: "black", rotation: 0 };
    objects.push(newObj);
    selectedObject = newObj; // Instantly select the new object
    updateCanvas();
}

// Function to copy & paste an object to the right
function copyPaste() {
    if (selectedObject) {
        const newObj = {
            x: selectedObject.x + gridSize,
            y: selectedObject.y,
            type: selectedObject.type,
            color: selectedObject.color,
            rotation: selectedObject.rotation
        };

        objects.push(newObj);
        selectedObject = newObj; // Select the new copy
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
        selectedObject.x += dx * gridSize;
        selectedObject.y += dy * gridSize;
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

// Function to switch tabs
function switchTab(tabName) {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.style.display = tab.id === tabName ? "block" : "none";
    });
}

document.addEventListener("keydown", (event) => {
    const moveAmount = event.shiftKey ? 5 : 1; // Shift moves 5 spaces

    switch (event.key.toLowerCase()) {
        case "w": moveSelectedObject(0, -moveAmount); break; // Move Up
        case "s": moveSelectedObject(0, moveAmount); break; // Move Down
        case "a": moveSelectedObject(-moveAmount, 0); break; // Move Left
        case "d": moveSelectedObject(moveAmount, 0); break; // Move Right
    }
});


// Show the Build tab by default
switchTab("build");

// Initialize the editor
updateCanvas();
