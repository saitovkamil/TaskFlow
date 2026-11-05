
function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

const app = createElement("div", "app");

const header = createElement("header", "app-header");
const brand = createElement("div", "brand");

const brandMark = createElement("span", "brand-mark", "T");
const brandName = createElement("span", "brand-name", "TaskFlow");

brand.append(brandMark, brandName);
header.append(brand);

const main = createElement("main", "main-content");

const eyebrow = createElement("p", "eyebrow", "ВАШЕ ПРОСТРАНСТВО");
const title = createElement("h1", "page-title", "Мои задачи");
const description = createElement(
    "p",
    "page-description",
    "Планируйте дела и следите за прогрессом"
);

main.append(eyebrow, title, description);

const stats = createElement("section", "stats-grid");

function createStatCard(label) {
    const card = createElement("div", "stat-card");
    const number = createElement("span", "stat-number", "0");
    const text = createElement("span", "stat-label", label);

    card.append(number, text);
    stats.append(card);

    return number;
}

const totalCount = createStatCard("Всего задач");
const activeCount = createStatCard("В работе");
const completedCount = createStatCard("Выполнено");

const progressSection = createElement("section", "progress-section");
const progressHeader = createElement("div", "progress-header");
const progressTitle = createElement("h2", "progress-title", "Ваш прогресс");
const progressPercent = createElement("span", "progress-percent", "0%");

progressHeader.append(progressTitle, progressPercent);

const progressTrack = createElement("div", "progress-track");
const progressFill = createElement("div", "progress-fill");

progressTrack.append(progressFill);
progressSection.append(progressHeader, progressTrack);

main.append(stats, progressSection);

const taskForm = createElement("form", "task-form");

const taskInput = createElement("input", "task-input");
taskInput.type = "text";
taskInput.placeholder = "Что нужно сделать?";
taskInput.required = true;
taskInput.maxLength = 100;

const dateInput = createElement("input", "date-input");
dateInput.type = "date";

const addButton = createElement("button", "add-button", "+ Добавить");
addButton.type = "submit";

taskForm.append(taskInput, dateInput, addButton);

const tasks = JSON.parse(localStorage.getItem("taskflow-tasks") || "[]");
let activeFilter = "all";

const listHeader = createElement("div", "list-header");
const listTitle = createElement("h2", "list-title", "Список задач");
const listCount = createElement("span", "list-count", "Всего задач: 0");

listHeader.append(listTitle, listCount);

const controls = createElement("section", "task-controls");
const controlsTop = createElement("div", "controls-top");

const searchInput = createElement("input", "search-input");
searchInput.type = "search";
searchInput.placeholder = "Поиск по названию или дате...";
searchInput.setAttribute("aria-label", "Поиск по названию или дате");

const sortSelect = createElement("select", "sort-select");
sortSelect.setAttribute("aria-label", "Сортировка задач");

const sortOptions = [
    ["default", "По порядку"],
    ["asc", "Сначала ближайшие"],
    ["desc", "Сначала поздние"]
];

sortOptions.forEach(function([value, label]) {
    const option = createElement("option", "", label);
    option.value = value;
    sortSelect.append(option);
});

controlsTop.append(searchInput, sortSelect);

const filterGroup = createElement("div", "filter-group");
const filterButtons = [];

const filters = [
    ["all", "Все"],
    ["active", "В работе"],
    ["completed", "Выполнено"]
];

filters.forEach(function([value, label]) {
    const button = createElement("button", "filter-button", label);
    button.type = "button";

    button.addEventListener("click", function() {
        activeFilter = value;
        renderTasks();
    });

    filterButtons.push({ button, value });
    filterGroup.append(button);
});

controls.append(controlsTop, filterGroup);

const taskList = createElement("ul", "task-list");

const emptyState = createElement("div", "empty-state");
const emptyTitle = createElement("h3", "empty-title", "Здесь пока пусто");
const emptyDescription = createElement(
    "p",
    "empty-description",
    "Добавьте первую задачу, чтобы начать планировать свои дела."
);

emptyState.append(emptyTitle, emptyDescription);

main.append(taskForm, listHeader, controls, taskList, emptyState);

function updateDashboard(visibleCount) {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    const percent = total === 0 ? 0 : Math.round(completed / total * 100);

    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;

    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;

    listCount.textContent = `Показано: ${visibleCount} из ${total}`;

    emptyState.hidden = visibleCount !== 0;

    if (total === 0) {
        emptyTitle.textContent = "Здесь пока пусто";
        emptyDescription.textContent = "Добавьте первую задачу, чтобы начать планировать свои дела.";
    } else {
        emptyTitle.textContent = "Ничего не найдено";
        emptyDescription.textContent = "Попробуйте изменить поиск или выбрать другой фильтр.";
    }
}



function getVisibleTasks() {
    const query = searchInput.value.trim().toLowerCase();

    const visibleTasks = tasks.filter(function(task) {
        const formattedDate = task.date
            ? task.date.split("-").reverse().join(".")
            : "";

        const matchesSearch =
            task.title.toLowerCase().includes(query) ||
            task.date.includes(query) ||
            formattedDate.includes(query);

        const matchesFilter =
            activeFilter === "all" ||
            (activeFilter === "active" && !task.completed) ||
            (activeFilter === "completed" && task.completed);

        return matchesSearch && matchesFilter;
    });

    if (sortSelect.value !== "default") {
        const now = new Date();
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

        visibleTasks.sort(function(a, b) {
            if (!a.date && !b.date) return 0;
            if (!a.date) return 1;
            if (!b.date) return -1;

            if (sortSelect.value === "desc") {
                return b.date.localeCompare(a.date);
            }

            const aPast = a.date < today;
            const bPast = b.date < today;

            if (aPast !== bPast) {
                return aPast ? 1 : -1;
            }

            return aPast
                ? b.date.localeCompare(a.date)
                : a.date.localeCompare(b.date);
        });
    }

    return visibleTasks;
}




function renderTasks() {
    taskList.replaceChildren();

    filterButtons.forEach(function({ button, value }) {
        const selected = activeFilter === value;
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });

    const visibleTasks = getVisibleTasks();

    const canDrag =
        activeFilter === "all" &&
        sortSelect.value === "default" &&
        searchInput.value.trim() === "";

    visibleTasks.forEach(function(task) {
        const taskItem = createElement("li", "task-item");

        taskItem.draggable = canDrag;

        taskItem.addEventListener("dragstart", function(event) {
            if (!canDrag) {
                event.preventDefault();
                return;
            }

            event.dataTransfer.setData("text/plain", task.id);
            event.dataTransfer.effectAllowed = "move";

            taskItem.classList.add("dragging");
        });

        taskItem.addEventListener("dragend", function() {
            taskItem.classList.remove("dragging");
            taskItem.classList.remove("drag-over");
        });

        taskItem.addEventListener("dragover", function(event) {
            if (!canDrag) return;

            event.preventDefault();
            event.dataTransfer.dropEffect = "move";

            taskItem.classList.add("drag-over");
        });

        taskItem.addEventListener("dragleave", function(event) {
            if (!taskItem.contains(event.relatedTarget)) {
                taskItem.classList.remove("drag-over");
            }
        });

        taskItem.addEventListener("drop", function(event) {
            if (!canDrag) return;

            event.preventDefault();
            taskItem.classList.remove("drag-over");

            const draggedId = event.dataTransfer.getData("text/plain");

            if (!draggedId || draggedId === task.id) return;

            const fromIndex = tasks.findIndex(item => item.id === draggedId);

            if (fromIndex === -1) return;

            const middle = taskItem.getBoundingClientRect().top +
                taskItem.offsetHeight / 2;

            const insertAfter = event.clientY > middle;

            const [movedTask] = tasks.splice(fromIndex, 1);

            let toIndex = tasks.findIndex(item => item.id === task.id);

            if (toIndex === -1) {
                tasks.splice(fromIndex, 0, movedTask);
                return;
            }

            if (insertAfter) {
                toIndex++;
            }

            tasks.splice(toIndex, 0, movedTask);

            renderTasks();
        });

        const checkbox = createElement("input", "task-checkbox");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            `Отметить задачу «${task.title}» выполненной`
        );

        checkbox.addEventListener("change", function() {
            task.completed = checkbox.checked;
            renderTasks();
        });

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        const taskContent = createElement("div", "task-content");
        const taskTitle = createElement("span", "task-title", task.title);

        taskContent.append(taskTitle);

        if (task.date) {
            const [year, month, day] = task.date.split("-");
            const taskDate = createElement(
                "span",
                "task-date",
                `${day}.${month}.${year}`
            );

            taskContent.append(taskDate);
        }

        const actions = createElement("div", "task-actions");

        const editButton = createElement("button", "edit-button", "Изменить");
        editButton.type = "button";

        editButton.addEventListener("click", function() {
            taskItem.draggable = false;

            const editForm = createElement("form", "edit-form");

            const editInput = createElement("input", "edit-input");
            editInput.type = "text";
            editInput.value = task.title;
            editInput.required = true;
            editInput.maxLength = 100;

            const editDate = createElement("input", "edit-date");
            editDate.type = "date";
            editDate.value = task.date;

            const saveButton = createElement("button", "save-button", "Сохранить");
            saveButton.type = "submit";

            const cancelButton = createElement("button", "cancel-button", "Отмена");
            cancelButton.type = "button";

            editForm.append(editInput, editDate, saveButton, cancelButton);

            editForm.addEventListener("submit", function(event) {
                event.preventDefault();

                const newTitle = editInput.value.trim();

                if (!newTitle) {
                    return;
                }

                task.title = newTitle;
                task.date = editDate.value;

                renderTasks();
            });

            cancelButton.addEventListener("click", function() {
                renderTasks();
            });

            taskItem.replaceChildren(editForm);
            editInput.focus();
        });

        const deleteButton = createElement("button", "delete-button", "Удалить");
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function() {
            const index = tasks.findIndex(item => item.id === task.id);

            if (index !== -1) {
                tasks.splice(index, 1);
                renderTasks();
            }
        });

        actions.append(editButton, deleteButton);
        taskItem.append(checkbox, taskContent, actions);
        taskList.append(taskItem);
    });

    updateDashboard(visibleTasks.length);
    saveTasks();
}

searchInput.addEventListener("input", renderTasks);
sortSelect.addEventListener("change", renderTasks);

taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        return;
    }

    const newTask = {
        id: crypto.randomUUID(),
        title: title,
        date: dateInput.value,
        completed: false
    };

    tasks.push(newTask);
    searchInput.value = "";
    activeFilter = "all";

    renderTasks();

    taskForm.reset();
    taskInput.focus();
});

app.append(header, main);
document.body.append(app);

renderTasks();