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

        const checkbox = createElement("input", "task-checkbox");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

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