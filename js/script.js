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

app.append(header, main);
document.body.append(app);