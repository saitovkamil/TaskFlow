function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text) {
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
const title = createElement("h1", "page-title", "Освободите место для важного.");
const description = createElement(
    "p",
    "page-description",
    "Удобное место для ваших задач, планов и повседневных дел."
);

main.append(eyebrow, title, description);

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

const tasks = [];

const taskList = createElement("ul", "task-list");

main.append(taskForm, taskList);

function renderTasks() {
    taskList.replaceChildren();

    tasks.forEach(function(task) {
        const taskItem = createElement("li", "task-item");

        const taskTitle = createElement(
            "span",
            "task-title",
            task.title
        );

        taskItem.append(taskTitle);

        if (task.date) {
            const [year, month, day] = task.date.split("-");

            const taskDate = createElement(
                "span",
                "task-date",
                `${day}.${month}.${year}`
            );

            taskItem.append(taskDate);
        }

        taskList.append(taskItem);
    });
}

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

    renderTasks();

    taskForm.reset();
    taskInput.focus();
});

app.append(header, main);
document.body.append(app);