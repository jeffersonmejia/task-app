const d: Document = document,
	$addTaskForm: HTMLFormElement | null = d.querySelector('.add-task-form'),
	$tasksList: HTMLElement | null = d.querySelector('.task-list'),
	$usernameContent: HTMLElement | null = d.querySelector('.welcome-user-title h2'),
	$taskTemplate: HTMLTemplateElement | null = d.getElementById(
		'task-template'
	) as HTMLTemplateElement,
	$sectionButton: HTMLButtonElement | null = d.querySelector('.add-task-button'),
	$addTaskSubmit: HTMLInputElement | null = d.querySelector('#add-task-submit'),
	$noTask: HTMLElement | null = d.querySelector('.not-task-text')

function handleAddTask(): void {
	let buttonContent: string,
		isAdd: boolean = false
	if ($sectionButton) {
		buttonContent = $sectionButton?.textContent || ''
		isAdd = buttonContent?.includes('Add') || false

		if (isAdd) {
			$tasksList?.classList.add('hidden')
			$sectionButton.textContent = 'Home'
			$addTaskForm?.classList.remove('hidden')
		} else {
			$sectionButton.textContent = 'Add new task'
			$addTaskForm?.classList.add('hidden')
			$tasksList?.classList.remove('hidden')
		}

		$sectionButton.textContent = isAdd ? 'Home' : 'Add new task'
	}
}

function getUser(): void {
	const isUsername = localStorage.getItem('username')

	if ($usernameContent) {
		if (!isUsername) {
			$usernameContent.textContent = 'Type your name...'
			$usernameContent.contentEditable = 'true'
			$usernameContent.focus()
		} else {
			let username: string = localStorage.getItem('username') || 'Unknown'
			if (username?.includes('Type')) {
				$usernameContent.textContent = 'Type your name...'
				$usernameContent.contentEditable = 'true'
				$usernameContent.focus()
			} else {
				$usernameContent.textContent = `Bienvenido, ${username}`
			}
		}
	}
}

function getTaskId(): number {
	const tasks: string = localStorage.getItem('tasks') || ''
	let array: object[] = [],
		id = 0
	if (tasks.length > 0) {
		array = JSON.parse(tasks)
	}
	if (array.length > 0) {
		id = array.length
	}
	return id
}

function getNewTasksValues(): object[] {
	const inputsHTML: NodeList | undefined =
		$addTaskForm?.querySelectorAll('.input-group input')
	let data: object = {},
		inputs: any[] = [],
		newData: any[] = [],
		id: number = getTaskId()

	if (inputsHTML) {
		inputs = Array.from(inputsHTML)
	}
	inputs?.forEach((input: HTMLInputElement) => {
		data = { ...data, [input.id]: input.value }
	})
	data = { ...data, id }
	newData.push(data)
	return newData
}

function getTasksValues(): object[] {
	const old: string | null = localStorage.getItem('tasks')
	let _new: object[] = getNewTasksValues(),
		oldArray: object[] = [],
		newArray: object[] = [],
		joined: object[] = []

	if (old && old.length > 0) {
		oldArray = JSON.parse(old)
		joined = oldArray
	}
	if (_new && _new.length > 0) {
		joined = [...joined, ..._new]
	}
	return joined
}

function handleNewTaks(): void {
	const tasks: object[] = getTasksValues(),
		json: string = JSON.stringify(tasks)
	console.log(json)
	localStorage.setItem('tasks', json)
	$addTaskForm?.reset()
	if (!$noTask?.classList.contains('hidden')) {
		$noTask?.classList.add('hidden')
	}
	loadSavedTasks()
}
interface Task {
	id: number
	name: string
	description: string
	date: string
	time: string
}
function getSavedTasks(): Task[] {
	const tasks: string = localStorage.getItem('tasks') || ''
	let json: Task[] = []
	if (tasks) {
		json = JSON.parse(tasks)
	}

	return json
}

function loadSavedTasks(): void {
	const tasks: Task[] = getSavedTasks(),
		$fragment: DocumentFragment = d.createDocumentFragment()

	let template: DocumentFragment | null = null
	if ($taskTemplate) {
		template = $taskTemplate.content
	}
	if (tasks.length > 0) {
		tasks.forEach((task: Task, index: number) => {
			const $clone = template?.cloneNode(true) as HTMLElement
			if ($clone) {
				const name = $clone.querySelector('h3'),
					description = $clone.querySelector('p'),
					date = $clone.querySelector('.task-date-item'),
					time = $clone.querySelector('.task-time-item'),
					deleteButton = $clone.querySelector('.delete-task'),
					editButton = $clone.querySelector('.edit-task')
				if (name) {
					name.textContent = task.name || 'No named'
				}
				if (description) {
					description.textContent = task.description || 'No description'
				}
				if (date) {
					date.textContent = task.date || '00/00/00'
				}
				if (time) {
					time.textContent = task.time || '--:--'
				}
				if (deleteButton) {
					deleteButton.setAttribute('data-id', `${task.id}`)
				}
				if (editButton) {
					editButton.setAttribute('data-id', `${task.id}`)
				}
			}
			$fragment.appendChild($clone)
		})
		$tasksList?.appendChild($fragment)
	} else {
		$noTask?.classList.remove('hidden')
	}
}

function editTask(id: number): void {
	handleAddTask()
	if ($addTaskForm) {
		const name: HTMLInputElement | null = $addTaskForm.querySelector('#name'),
			description: HTMLInputElement | null = $addTaskForm.querySelector('#description'),
			date: HTMLInputElement | null = $addTaskForm.querySelector('#date'),
			time: HTMLInputElement | null = $addTaskForm.querySelector('#time')

		const tasks: Task[] = getSavedTasks()
		const DEFAULT_TASK: Task = {
			id: -1,
			date: '',
			description: '',
			name: '',
			time: '',
		}
		const task: Task = tasks.find((task: Task) => task.id === id) || DEFAULT_TASK
		if (task.id !== -1) {
			console.log(task)
			if (name) {
				name.value = task.name
			}
			if (description) {
				description.value = task.description
			}
			if (date) {
				date.value = task.date
			}
			if (time) {
				time.value = task.time
			}
		}
	}
	if ($addTaskSubmit) {
		$addTaskSubmit.value = 'Update'
		$addTaskSubmit.setAttribute('data-update-id', `${id}`)
	}
}

d.addEventListener('DOMContentLoaded', (e: Event | null) => {
	getUser()
	loadSavedTasks()
})

d.addEventListener('click', (e: Event | null) => {
	const target = e?.target as HTMLElement
	if (target.matches('.add-task-button')) {
		handleAddTask()
	}
	if (target.matches('#add-task-submit')) {
		e?.preventDefault()
		handleNewTaks()
	}
	if (target.matches('.edit-task')) {
		const id: number = parseInt(target.dataset.id || '0')
		editTask(id)
	}
})

d.addEventListener('keyup', (e: Event | null) => {
	const target = e?.target as HTMLElement
	if (target.matches('.welcome-user-title h2')) {
		const username: string = target.textContent || ''
		localStorage.setItem('username', username)
	}
})
