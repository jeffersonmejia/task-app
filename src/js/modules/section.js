"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeItemSection = void 0;
function changeItemSection({ button: HTMLButtonElement = null, tasks: HTMLElement = null, form: HTMLFormElement = null, }) {
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
exports.changeItemSection = changeItemSection;
