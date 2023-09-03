"use strict";
const d = document, w = window, $addTaskForm = d.querySelector('.add-task-form'), $tasksList = d.querySelector('.task-list'), $usernameContent = d.querySelector('.welcome-user-title h2'), $taskTemplate = d.getElementById('task-template'), $sectionButton = d.querySelector('.add-task-button'), $addTaskSubmit = d.querySelector('#add-task-submit'), $noTask = d.querySelector('.not-task-text'), $totalTasks = d.querySelector('.total-tasks span');
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
        let max = -1;
        array.forEach((task) => {
            max = Math.max(task.id);
        });
        id = max + 1;
    }
    else {
        id = 0;
    }
    console.log(id);
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
    localStorage.setItem('tasks', json);
    if (!($noTask === null || $noTask === void 0 ? void 0 : $noTask.classList.contains('hidden'))) {
        $noTask === null || $noTask === void 0 ? void 0 : $noTask.classList.add('hidden');
    }
    updateStoredTasks();
    if ($totalTasks) {
        $totalTasks.textContent = `${tasks.length}`;
    }
    $addTaskForm === null || $addTaskForm === void 0 ? void 0 : $addTaskForm.reset();
}
//fix this
function updateStoredTasks() {
    const tasks = getNewTasksValues(), $task = $tasksList === null || $tasksList === void 0 ? void 0 : $tasksList.querySelectorAll('article');
    let template = null;
    if ($task) {
        if ($taskTemplate) {
            template = $taskTemplate.content;
        }
        const $taskListArray = Array.from($task);
        $taskListArray.forEach((taskHTML) => {
            const editId = taskHTML.querySelector('.edit-task');
            if (editId && template) {
                checkEditUpdate(editId, tasks, template);
            }
        });
    }
}
function checkEditUpdate(editId, tasks, template) {
    var _a;
    if (editId !== null) {
        const idString = ((_a = editId.dataset) === null || _a === void 0 ? void 0 : _a.id) || '-1', id = parseInt(idString);
        if (id !== null || id !== undefined) {
            tasks.forEach((task) => {
                if (task.id !== id) {
                    const $clone = template === null || template === void 0 ? void 0 : template.cloneNode(true);
                    if ($clone) {
                        appendTask($clone, task);
                    }
                    $tasksList === null || $tasksList === void 0 ? void 0 : $tasksList.appendChild($clone);
                }
                else {
                    console.log('is update!');
                }
            });
        }
    }
}
function getSavedTasks() {
    const tasks = localStorage.getItem('tasks') || '';
    let json = [];
    if (tasks) {
        json = JSON.parse(tasks);
    }
    return json;
}
function appendTask(el, task) {
    const article = el.querySelector('article'), name = el.querySelector('h3'), description = el.querySelector('p'), date = el.querySelector('.task-date-item'), time = el.querySelector('.task-time-item'), deleteButton = el.querySelector('.delete-task'), editButton = el.querySelector('.edit-task');
    if (article) {
        article.setAttribute('data-id', `${task.id}`);
    }
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
    return el;
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
                appendTask($clone, task);
            }
            $fragment.appendChild($clone);
        });
        $tasksList === null || $tasksList === void 0 ? void 0 : $tasksList.appendChild($fragment);
    }
    else {
        $noTask === null || $noTask === void 0 ? void 0 : $noTask.classList.remove('hidden');
    }
    if ($totalTasks) {
        const $parent = $totalTasks.parentElement;
        $totalTasks.textContent = `${tasks.length}`;
        if ($parent && tasks.length > 0) {
            $parent.classList.remove('hidden');
        }
    }
}
function editTask(id) {
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
        const parentInputs = $addTaskForm === null || $addTaskForm === void 0 ? void 0 : $addTaskForm.querySelectorAll('.input-group');
        if (parentInputs) {
            parentInputs.forEach((parent) => {
                parent.classList.add('input-group-filled');
            });
        }
        $addTaskSubmit.value = 'Update';
        $addTaskSubmit.setAttribute('data-update-id', `${id}`);
    }
    handleAddTask();
}
function deleteTask(id) {
    const tasks = getSavedTasks(), filter = tasks.filter((task) => task.id !== id), json = JSON.stringify(filter);
    localStorage.setItem('tasks', json);
    if ($tasksList) {
        const $task = $tasksList.querySelector(`[data-id="${id}"]`);
        if ($task) {
            $tasksList.removeChild($task);
        }
    }
    if (tasks.length <= 1) {
        $noTask === null || $noTask === void 0 ? void 0 : $noTask.classList.remove('hidden');
        const $parent = $totalTasks === null || $totalTasks === void 0 ? void 0 : $totalTasks.parentElement;
        $parent === null || $parent === void 0 ? void 0 : $parent.classList.add('hidden');
    }
    if ($totalTasks) {
        $totalTasks.textContent = `${tasks.length - 1}`;
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
    if (target.matches('.delete-task')) {
        const id = parseInt(target.dataset.id || '0');
        deleteTask(id);
    }
});
d.addEventListener('keyup', (e) => {
    const target = e === null || e === void 0 ? void 0 : e.target;
    if (target.matches('.welcome-user-title h2')) {
        const username = target.textContent || '';
        localStorage.setItem('username', username);
    }
    if (target.matches('.input-group input')) {
        const parent = target.parentElement;
        const input = target;
        if (parent && input.type === 'text') {
            if (input.value.length > 0) {
                parent.classList.add('input-group-filled');
            }
            else {
                parent.classList.remove('input-group-filled');
            }
        }
    }
});
