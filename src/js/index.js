"use strict";
const d = document, $addTaskForm = d.querySelector('.add-task-form'), $tasksList = d.querySelector('.task-list'), $usernameContent = d.querySelector('.welcome-user-title h2'), $taskTemplate = d.getElementById('task-template'), $sectionButton = d.querySelector('.add-task-button'), $addTaskSubmit = d.querySelector('#add-task-submit'), $noTask = d.querySelector('.not-task-text');
function handleAddTask() {
    let buttonContent, isAdd = false;
    if ($sectionButton) {
        buttonContent = ($sectionButton === null || $sectionButton === void 0 ? void 0 : $sectionButton.textContent) || '';
        isAdd = (buttonContent === null || buttonContent === void 0 ? void 0 : buttonContent.includes('Add')) || false;
        if (isAdd) {
            $tasksList === null || $tasksList === void 0 ? void 0 : $tasksList.classList.add('hidden');
            $sectionButton.textContent = 'Home';
            $addTaskForm === null || $addTaskForm === void 0 ? void 0 : $addTaskForm.classList.remove('hidden');
        }
        else {
            $sectionButton.textContent = 'Add new task';
            $addTaskForm === null || $addTaskForm === void 0 ? void 0 : $addTaskForm.classList.add('hidden');
            $tasksList === null || $tasksList === void 0 ? void 0 : $tasksList.classList.remove('hidden');
        }
        $sectionButton.textContent = isAdd ? 'Home' : 'Add new task';
    }
}
function getUser() {
    const isUsername = localStorage.getItem('username');
    if ($usernameContent) {
        if (!isUsername) {
            $usernameContent.textContent = 'Type your name...';
            $usernameContent.contentEditable = 'true';
            $usernameContent.focus();
        }
        else {
            let username = localStorage.getItem('username') || 'Unknown';
            if (username === null || username === void 0 ? void 0 : username.includes('Type')) {
                $usernameContent.textContent = 'Type your name...';
                $usernameContent.contentEditable = 'true';
                $usernameContent.focus();
            }
            else {
                $usernameContent.textContent = `Bienvenido, ${username}`;
            }
        }
    }
}
function getTaskId() {
    const tasks = localStorage.getItem('tasks') || '';
    let array = [], id = 0;
    if (tasks.length > 0) {
        array = JSON.parse(tasks);
    }
    if (array.length > 0) {
        id = array.length;
    }
    return id;
}
function getNewTasksValues() {
    const inputsHTML = $addTaskForm === null || $addTaskForm === void 0 ? void 0 : $addTaskForm.querySelectorAll('.input-group input');
    let data = {}, inputs = [], newData = [], id = getTaskId();
    if (inputsHTML) {
        inputs = Array.from(inputsHTML);
    }
    inputs === null || inputs === void 0 ? void 0 : inputs.forEach((input) => {
        data = Object.assign(Object.assign({}, data), { [input.id]: input.value });
    });
    data = Object.assign(Object.assign({}, data), { id });
    newData.push(data);
    return newData;
}
function getTasksValues() {
    const old = localStorage.getItem('tasks');
    let _new = getNewTasksValues(), oldArray = [], newArray = [], joined = [];
    if (old && old.length > 0) {
        oldArray = JSON.parse(old);
        joined = oldArray;
    }
    if (_new && _new.length > 0) {
        joined = [...joined, ..._new];
    }
    return joined;
}
function handleNewTaks() {
    const tasks = getTasksValues(), json = JSON.stringify(tasks);
    console.log(json);
    localStorage.setItem('tasks', json);
    $addTaskForm === null || $addTaskForm === void 0 ? void 0 : $addTaskForm.reset();
    if (!($noTask === null || $noTask === void 0 ? void 0 : $noTask.classList.contains('hidden'))) {
        $noTask === null || $noTask === void 0 ? void 0 : $noTask.classList.add('hidden');
    }
    loadSavedTasks();
}
function getSavedTasks() {
    const tasks = localStorage.getItem('tasks') || '';
    let json = [];
    if (tasks) {
        json = JSON.parse(tasks);
    }
    return json;
}
function loadSavedTasks() {
    const tasks = getSavedTasks(), $fragment = d.createDocumentFragment();
    let template = null;
    if ($taskTemplate) {
        template = $taskTemplate.content;
    }
    if (tasks.length > 0) {
        tasks.forEach((task, index) => {
            const $clone = template === null || template === void 0 ? void 0 : template.cloneNode(true);
            if ($clone) {
                const name = $clone.querySelector('h3'), description = $clone.querySelector('p'), date = $clone.querySelector('.task-date-item'), time = $clone.querySelector('.task-time-item'), deleteButton = $clone.querySelector('.delete-task'), editButton = $clone.querySelector('.edit-task');
                if (name) {
                    name.textContent = task.name || 'No named';
                }
                if (description) {
                    description.textContent = task.description || 'No description';
                }
                if (date) {
                    date.textContent = task.date || '00/00/00';
                }
                if (time) {
                    time.textContent = task.time || '--:--';
                }
                if (deleteButton) {
                    deleteButton.setAttribute('data-id', `${task.id}`);
                }
                if (editButton) {
                    editButton.setAttribute('data-id', `${task.id}`);
                }
            }
            $fragment.appendChild($clone);
        });
        $tasksList === null || $tasksList === void 0 ? void 0 : $tasksList.appendChild($fragment);
    }
    else {
        $noTask === null || $noTask === void 0 ? void 0 : $noTask.classList.remove('hidden');
    }
}
function editTask(id) {
    handleAddTask();
    if ($addTaskForm) {
        const name = $addTaskForm.querySelector('#name'), description = $addTaskForm.querySelector('#description'), date = $addTaskForm.querySelector('#date'), time = $addTaskForm.querySelector('#time');
        const tasks = getSavedTasks();
        const DEFAULT_TASK = {
            id: -1,
            date: '',
            description: '',
            name: '',
            time: '',
        };
        const task = tasks.find((task) => task.id === id) || DEFAULT_TASK;
        if (task.id !== -1) {
            console.log(task);
            if (name) {
                name.value = task.name;
            }
            if (description) {
                description.value = task.description;
            }
            if (date) {
                date.value = task.date;
            }
            if (time) {
                time.value = task.time;
            }
        }
    }
    if ($addTaskSubmit) {
        $addTaskSubmit.value = 'Update';
        $addTaskSubmit.setAttribute('data-update-id', `${id}`);
    }
}
d.addEventListener('DOMContentLoaded', (e) => {
    getUser();
    loadSavedTasks();
});
d.addEventListener('click', (e) => {
    const target = e === null || e === void 0 ? void 0 : e.target;
    if (target.matches('.add-task-button')) {
        handleAddTask();
    }
    if (target.matches('#add-task-submit')) {
        e === null || e === void 0 ? void 0 : e.preventDefault();
        handleNewTaks();
    }
    if (target.matches('.edit-task')) {
        const id = parseInt(target.dataset.id || '0');
        editTask(id);
    }
});
d.addEventListener('keyup', (e) => {
    const target = e === null || e === void 0 ? void 0 : e.target;
    if (target.matches('.welcome-user-title h2')) {
        const username = target.textContent || '';
        localStorage.setItem('username', username);
    }
});
