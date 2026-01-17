let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let filterStatus = "all";
let filterPriority = "all";
let editIndex = null;

const taskList = document.getElementById("taskList");
const modal = document.getElementById("modal");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function openModal(index = null) {
    editIndex = index;
    modal.style.display = "block";

    if (index !== null) {
        taskText.value = tasks[index].text;
        taskPriority.value = tasks[index].priority;
        modalTitle.textContent = "Edit Task";
    } else {
        taskText.value = "";
        modalTitle.textContent = "Add Task";
    }
}

function closeModal() {
    modal.style.display = "none";
}

function saveTask() {
    const text = taskText.value.trim();
    const priority = taskPriority.value;

    if (!text) return alert("Enter task");

    if (editIndex !== null) {
        tasks[editIndex].text = text;
        tasks[editIndex].priority = priority;
    } else {
        tasks.unshift({ text, priority, completed: false });
    }

    save();
    render();
    closeModal();
}

function setFilter(status) {
    filterStatus = status;
    render();
}

function setPriorityFilter(priority) {
    filterPriority = priority;
    render();
}

function toggleTheme() {
    document.body.classList.toggle("dark");
}

function updateCounts() {
    totalCount.textContent = tasks.length;
    pendingCount.textContent = tasks.filter(t => !t.completed).length;
    completedCount.textContent = tasks.filter(t => t.completed).length;
}

function render() {
    taskList.innerHTML = "";

    const filteredTasks = tasks
        .filter(t =>
            filterStatus === "all" ||
            (filterStatus === "pending" && !t.completed) ||
            (filterStatus === "completed" && t.completed)
        )
        .filter(t =>
            filterPriority === "all" || t.priority === filterPriority
        );

    if (filteredTasks.length === 0) {
        let message = "No tasks found";

        if (filterStatus === "pending") message = "🎉 No pending tasks!";
        if (filterStatus === "completed") message = "No completed tasks yet";

        taskList.innerHTML = `<p class="empty">${message}</p>`;
        updateCounts();
        return;
    }

    filteredTasks.forEach((task, index) => {
        const div = document.createElement("div");
        div.className = "task";
        if (task.completed) div.classList.add("completed");

        div.innerHTML = `
            <span>${task.text}</span>
            <span class="priority ${task.priority}">
                ${task.priority.toUpperCase()}
            </span>
            <div class="actions">
                <button onclick="tasks[${index}].completed=!tasks[${index}].completed; save(); render()">✔</button>
                <button onclick="openModal(${index})">✎</button>
                <button onclick="tasks.splice(${index},1); save(); render()">✖</button>
            </div>
        `;

        taskList.appendChild(div);
    });

    updateCounts();
}

render();
