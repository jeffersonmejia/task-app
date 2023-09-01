const d: Document = document,
	$addTaskForm: HTMLFormElement | null = d.querySelector('.add-task-form'),
	$taskList: HTMLElement | null = d.querySelector('.task-list')

function handleAddTask(buttonTask: HTMLElement) {
	const buttonContent = buttonTask?.textContent,
		isAdd = buttonContent?.includes('Add')

	if (isAdd) {
		$taskList?.classList.add('hidden')
		buttonTask.textContent = 'Home'
		$addTaskForm?.classList.remove('hidden')
	} else {
		buttonTask.textContent = 'Add new task'
		$addTaskForm?.classList.add('hidden')
		$taskList?.classList.remove('hidden')
	}

	buttonTask.textContent = isAdd ? 'Home' : 'Add new task'
}

d.addEventListener('click', (e: Event | null) => {
	const target = e?.target as HTMLElement
	if (target.matches('.add-task-button')) {
		handleAddTask(target)
	}
})
