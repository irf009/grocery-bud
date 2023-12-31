//select elements
const alert = document.querySelector(`.alert`);
const form = document.querySelector(`.grocery-form`);
const input = document.querySelector(`#grocery`);
const submitBtn = document.querySelector(`.submit-btn`);
const container = document.querySelector(`.grocery-container`);
const list = document.querySelector(`.grocery-list`);
const clearBtn = document.querySelector(`.clear-btn`);

//edit option
let editElement;
let editFlag = false;
let editID = ``;

//event listeners
form.addEventListener(`submit`, addItem);
clearBtn.addEventListener(`click`, clearItems);
window.addEventListener(`DOMContentLoaded`, setupItems);

//functions
function addItem(e) {
	e.preventDefault();
	let value = input.value;
	const id = new Date().getTime().toString();
	if (value && !editFlag) {
		createListItem(id, value);
		//alert
		displayAlert(`item added to the list`, `success`);
		container.classList.add(`show-container`);
		addToLocalStorage(id, value);
		setBackToDefault();
	} else if (value && editFlag) {
		editElement.innerHTML = value;
		displayAlert(`value changed`, `success`);
		editLocalStorage(editID, value);
		setBackToDefault();
	} else {
		displayAlert(`please enter value`, `danger`);
	}
}

function displayAlert(text, action) {
	alert.innerHTML = text;
	alert.classList.add(`alert-${action}`);
	//remove alert
	setTimeout(function () {
		alert.innerHTML = ``;
		alert.classList.remove(`alert-${action}`);
	}, 1000);
}

function setBackToDefault() {
	input.value = ``;
	editFlag = false;
	editID = ``;
	submitBtn.textContent = `submit`;
}

function clearItems() {
	container.classList.remove(`show-container`);
	const items = document.querySelectorAll(`.grocery-item`);
	items.forEach(function (item) {
		list.removeChild(item);
	});
	displayAlert(`empty list`, `success`);
	localStorage.removeItem(`list`);
	setBackToDefault();
}

function deleteItem(e) {
	const element = e.currentTarget.parentElement.parentElement;
	const id = element.dataset.id;
	list.removeChild(element);
	if (list.children.length === 0) {
		container.classList.remove(`show-container`);
	}
	displayAlert(`item removed`, `danger`);
	removeFromLocalStorage(id);
	setBackToDefault();
}
function editItem(e) {
	const element = e.currentTarget.parentElement.parentElement;
	editElement = e.currentTarget.parentElement.previousElementSibling;
	editFlag = true;
	editID = element.dataset.id;
	input.value = editElement.innerHTML;
	submitBtn.innerHTML = `edit`;
}
//local storage
function addToLocalStorage(id, value) {
	const grocery = { id, value };
	let items = getLocalStorage();
	items.push(grocery);
	localStorage.setItem(`list`, JSON.stringify(items));
}

function removeFromLocalStorage(id) {
	let items = getLocalStorage();

	items = items.filter(function (item) {
		if (item.id !== id) {
			return item;
		}
	});
	localStorage.setItem(`list`, JSON.stringify(items));
}

function editLocalStorage(id, value) {
	let items = getLocalStorage();

	items = items.map(function (item) {
		if (item.id === id) {
			item.value = value;
		}
		return item;
	});
	localStorage.setItem(`list`, JSON.stringify(items));
}

function getLocalStorage() {
	return localStorage.getItem(`list`)
		? JSON.parse(localStorage.getItem(`list`))
		: [];
}

function setupItems() {
	let items = getLocalStorage();
	if (items.length > 0) {
		items.forEach(function (item) {
			createListItem(item.id, item.value);
		});
		container.classList.add(`show-container`);
	}
}

function createListItem(id, value) {
	const element = document.createElement(`article`);
	const attr = document.createAttribute(`data-id`);
	attr.value = id;
	element.setAttributeNode(attr);
	element.classList.add(`grocery-item`);
	element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;
	list.appendChild(element);
	const deleteBtn = element.querySelector(`.delete-btn`);
	const editBtn = element.querySelector(`.edit-btn`);
	deleteBtn.addEventListener(`click`, deleteItem);
	editBtn.addEventListener(`click`, editItem);
}
