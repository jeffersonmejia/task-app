const d: Document = document,
	w = window,
	$addTaskForm: formHTML = d.querySelector('.add-task-form'),
	$tasksList: elHTML = d.querySelector('.task-list'),
	$usernameContent: elHTML = d.querySelector('.welcome-user-title h2'),
	$taskTemplate: templateHTML = d.getElementById('task-template') as templateHTML,
	$sectionButton: buttonHTML = d.querySelector('.add-task-button'),
	$addTaskSubmit: inputHTML = d.querySelector('#add-task-submit'),
	$noTask: elHTML = d.querySelector('.not-task-text'),
	$totalTasks: elHTML = d.querySelector('.total-tasks span')

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
				$usernameContent.textContent = `Hi, ${username}`
			}
		}
	}
}

function getTaskId(): number {
	const tasks: string = localStorage.getItem('tasks') || ''
	let array: Task[] = [],
		id = 0
	if (tasks.length > 0) {
		array = JSON.parse(tasks)
	}
	if (array.length > 0) {
		let max = -1
		array.forEach((task: Task) => {
			max = Math.max(task.id)
		})
		id = max + 1
	} else {
		id = 0
	}
	return id
}

function getNewTasksValues(): Task[] {
	const inputsHTML: NodeList | undefined =
		$addTaskForm?.querySelectorAll('.input-group input')
	let data: object = {},
		inputs: any[] = [],
		newData: any[] = [],
		dataId: string = $addTaskSubmit?.dataset.id || '-1',
		idUpdate: number = parseInt(dataId),
		id: number = getTaskId()

	if (inputsHTML) {
		inputs = Array.from(inputsHTML)
	}
	inputs?.forEach((input: HTMLInputElement) => {
		data = { ...data, [input.id]: input.value }
	})
	data = { ...data, id: idUpdate === -1 ? id : idUpdate }
	newData.push(data)
	return newData
}

function getTasksValues(): Task[] {
	const old: string | null = localStorage.getItem('tasks'),
		dataId: string = $addTaskSubmit?.dataset.id || '-1',
		idUpdate: number = parseInt(dataId)

	let _new: Task[] = getNewTasksValues(),
		oldArray: Task[] = [],
		newArray: object[] = [],
		joined: Task[] = []

	if (old && old.length > 0) {
		oldArray = JSON.parse(old)
		joined = oldArray
	}
	if (idUpdate !== -1) {
		joined = joined.filter((task) => task.id !== idUpdate)
	}
	if (_new && _new.length > 0) {
		joined = [...joined, ..._new]
	}

	return joined
}

function handleNewTaks(): void {
	const tasks: Task[] = getTasksValues(),
		json: string = JSON.stringify(tasks),
		dataId: string = $addTaskSubmit?.dataset.id || '-1',
		id: number = parseInt(dataId)

	localStorage.setItem('tasks', json)
	if (!$noTask?.classList.contains('hidden')) {
		$noTask?.classList.add('hidden')
	}
	if ($totalTasks) {
		$totalTasks.textContent = `${tasks.length}`
	}
	$addTaskForm?.reset()

	let template: DocumentFragment | null = null
	if ($taskTemplate) {
		template = $taskTemplate.content
	}
	const $clone: elHTML = template?.cloneNode(true) as HTMLElement
	let currentTask: Task | null = null
	if (id === -1) {
		const lastTask: Task = tasks[tasks.length - 1]
		currentTask = lastTask
	} else {
		console.log('this is an update')
		const $task: elHTML = $tasksList?.querySelector(`article[data-id="${id}"]`) || null

		const updateTask: Task | undefined = tasks.find((task) => {
			return task.id === id
		})
		if (updateTask) {
			currentTask = updateTask
		}
		if ($task) {
			$tasksList?.removeChild($task)
		}
		console.log($task, updateTask)
	}
	if ($clone && currentTask) {
		const article = appendTask($clone, currentTask)
		if (article) {
			$tasksList?.appendChild(article)
		}
	}
}

function checkEditUpdate(editId: HTMLElement, tasks: Task[], template: DocumentFragment) {
	if (editId !== null) {
		const idString: string = editId.dataset?.id || '-1',
			id = parseInt(idString)
		if (id !== null || id !== undefined) {
			tasks.forEach((task) => {
				if (task.id === id) {
					const $clone = template?.cloneNode(true) as HTMLElement,
						$oldTask = d.querySelector(`[data-id="${id}"]`)
					if ($oldTask) {
						$tasksList?.removeChild($oldTask)
					}
					if ($clone) {
						appendTask($clone, task)
					}
					$tasksList?.appendChild($clone)
				}
			})
		}
	}
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

function appendTask(el: HTMLElement, task: Task): HTMLElement {
	const article = el.querySelector('article'),
		name = el.querySelector('h3'),
		description = el.querySelector('p'),
		date = el.querySelector('.task-date-item'),
		time = el.querySelector('.task-time-item'),
		deleteButton = el.querySelector('.delete-task'),
		editButton = el.querySelector('.edit-task')
	if (article) {
		article.setAttribute('data-id', `${task.id}`)
	}
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
	return el
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
				appendTask($clone, task)
			}
			$fragment.appendChild($clone)
		})
		$tasksList?.appendChild($fragment)
	} else {
		$noTask?.classList.remove('hidden')
	}
	if ($totalTasks) {
		const $parent = $totalTasks.parentElement
		$totalTasks.textContent = `${tasks.length}`
		if ($parent && tasks.length > 0) {
			$parent.classList.remove('hidden')
		}
	}
}

function editTask(id: number): void {
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
		const parentInputs: NodeListOf<HTMLElement> | undefined =
			$addTaskForm?.querySelectorAll('.input-group')

		if (parentInputs) {
			parentInputs.forEach((parent) => {
				parent.classList.add('input-group-filled')
			})
		}
		$addTaskSubmit.value = 'Update'
		$addTaskSubmit.setAttribute('data-id', `${id}`)
	}
	handleAddTask()
}

function deleteTask(id: number): void {
	const tasks: Task[] = getSavedTasks(),
		filter: Task[] = tasks.filter((task) => task.id !== id),
		json: string = JSON.stringify(filter)
	localStorage.setItem('tasks', json)

	if ($tasksList) {
		const $task: HTMLElement | null = $tasksList.querySelector(`[data-id="${id}"]`)

		if ($task) {
			$tasksList.removeChild($task)
		}
	}
	if (tasks.length - 1 === 0) {
		$noTask?.classList.remove('hidden')
		const $parent = $totalTasks?.parentElement
		$parent?.classList.add('hidden')
	}
	if ($totalTasks) {
		$totalTasks.textContent = `${tasks.length - 1}`
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
		if ($addTaskSubmit) {
			$addTaskSubmit.value = 'Add task'
			$addTaskSubmit.setAttribute('data-id', '')
		}
	}
	if (target.matches('#add-task-submit')) {
		e?.preventDefault()
		handleNewTaks()
	}
	if (target.matches('.edit-task')) {
		const id: number = parseInt(target.dataset.id || '0')
		editTask(id)
	}
	if (target.matches('.delete-task')) {
		const id: number = parseInt(target.dataset.id || '0')
		deleteTask(id)
	}
})

d.addEventListener('keyup', (e: Event | null) => {
	const target = e?.target as HTMLElement
	if (target.matches('.welcome-user-title h2')) {
		const username: string = target.textContent || ''
		localStorage.setItem('username', username)
	}
	if (target.matches('.input-group input')) {
		const parent: HTMLElement | null = target.parentElement
		const input: HTMLInputElement | null = target as HTMLInputElement
		if (parent && input.type === 'text') {
			if (input.value.length > 0) {
				parent.classList.add('input-group-filled')
			} else {
				parent.classList.remove('input-group-filled')
			}
		}
	}
})
