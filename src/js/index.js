"use strict";
const d = document, $addTaskForm = d.querySelector('.add-task-form'), $taskList = d.querySelector('.task-list');
function handleAddTask(buttonTask) {
    const buttonContent = buttonTask === null || buttonTask === void 0 ? void 0 : buttonTask.textContent, isAdd = buttonContent === null || buttonContent === void 0 ? void 0 : buttonContent.includes('Add');
    if (isAdd) {
        $taskList === null || $taskList === void 0 ? void 0 : $taskList.classList.add('hidden');
        buttonTask.textContent = 'Home';
        $addTaskForm === null || $addTaskForm === void 0 ? void 0 : $addTaskForm.classList.remove('hidden');
    }
    else {
        buttonTask.textContent = 'Add new task';
        $addTaskForm === null || $addTaskForm === void 0 ? void 0 : $addTaskForm.classList.add('hidden');
        $taskList === null || $taskList === void 0 ? void 0 : $taskList.classList.remove('hidden');
    }
    buttonTask.textContent = isAdd ? 'Home' : 'Add new task';
}
d.addEventListener('click', (e) => {
    const target = e === null || e === void 0 ? void 0 : e.target;
    if (target.matches('.add-task-button')) {
        handleAddTask(target);
    }
});
