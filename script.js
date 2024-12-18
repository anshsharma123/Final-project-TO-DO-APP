const form = document.getElementById('todo-form');
const taskList = document.getElementById('task-list');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const themeToggle = document.getElementById('theme-toggle');
const searchBar = document.getElementById('search-bar');
const sortOptions = document.getElementById('sort-options');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks(filter = '') {
  taskList.innerHTML = '';
  const filteredTasks = tasks.filter((task) =>
    task.name.toLowerCase().includes(filter.toLowerCase())
  );

  filteredTasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.classList.add('task', task.priority);
    if (new Date(task.dueDate) < new Date() && !task.completed) {
      taskElement.classList.add('overdue');
    }

    taskElement.innerHTML = `
      <div>
        <strong>${task.name}</strong> <small>(${task.dueDate})</small>
        <span>[${task.priority.toUpperCase()}]</span>
      </div>
      <div class="actions">
        <button onclick="toggleComplete(${index})">
          ${task.completed ? 'Undo' : 'Complete'}
        </button>
        <button onclick="editTask(${index})">Edit</button>
        <button onclick="deleteTask(${index})">Delete</button>
      </div>
    `;
    taskList.appendChild(taskElement);
  });

  updateProgress();
}

function updateProgress() {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progress = tasks.length ? (completedTasks / tasks.length) * 100 : 0;
  progressBar.value = progress;
  progressText.textContent = `${Math.round(progress)}% completed`;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const taskName = document.getElementById('task-name').value;
  const dueDate = document.getElementById('due-date').value;
  const priority = document.getElementById('priority').value;

  tasks.push({ name: taskName, dueDate, priority, completed: false });
  saveTasks();
  renderTasks();
  form.reset();
});

function editTask(index) {
  const task = tasks[index];
  const newName = prompt('Edit Task Name:', task.name);
  const newDueDate = prompt('Edit Due Date:', task.dueDate);
  const newPriority = prompt('Edit Priority (low, medium, high):', task.priority);
  if (newName && newDueDate && newPriority) {
    tasks[index] = { ...task, name: newName, dueDate: newDueDate, priority: newPriority };
    saveTasks();
    renderTasks();
  }
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  saveTasks();
  renderTasks();
}

searchBar.addEventListener('input', (e) => {
  renderTasks(e.target.value);
});

sortOptions.addEventListener('click', (e) => {
  const sortType = e.target.dataset.sort;
  if (sortType) {
    tasks.sort((a, b) => {
      if (sortType === 'alphabetical') return a.name.localeCompare(b.name);
      if (sortType === 'dueDate') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortType === 'priority') return ['low', 'medium', 'high'].indexOf(a.priority) - ['low', 'medium', 'high'].indexOf(b.priority);
    });
    saveTasks();
    renderTasks();
  }
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

renderTasks();
