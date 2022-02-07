// INPUTS / INTERACTIVE ELEMENTS
const deleteBtn = document.querySelectorAll('.fa-trash');
const item = document.querySelectorAll('.item span');
const itemCompleted = document.querySelectorAll('.item span.completed');

// EVENT LISTENERS AND FUNCTION CALLS
Array.from(deleteBtn).forEach((element) => {
	element.addEventListener('click', deleteItem);
});

Array.from(item).forEach((element) => {
	element.addEventListener('click', markComplete);
});

Array.from(itemCompleted).forEach((element) => {
	element.addEventListener('click', markUnComplete);
});

// FUNCTIONS
async function deleteItem() {
	// Stores the deleted stage name
	const itemText = this.parentNode.childNodes[1].innerText;

	try {
		const response = await fetch('deleteThing', {
			method: 'delete',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});

		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

async function markComplete() {
	// Stores the deleted stage name
	const itemText = this.parentNode.childNodes[1].innerText;

	try {
		const response = await fetch('markComplete', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});

		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}

async function markUnComplete() {
	// Stores the deleted stage name
	const itemText = this.parentNode.childNodes[1].innerText;

	try {
		const response = await fetch('markUnComplete', {
			method: 'put',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				itemFromJS: itemText,
			}),
		});

		const data = await response.json();
		console.log(data);
		location.reload();
	} catch (err) {
		console.log(err);
	}
}
