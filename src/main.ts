import "toastify-js/src/toastify.css"
import './style.css'
import Toastify from 'toastify-js'

import { v4 } from 'uuid';

const taskForm = document.querySelector<HTMLFormElement>('#taskForm');
const taskList = document.querySelector<HTMLDivElement>('#taskList');

interface Task {
  title: string;
  description: string;
  id: string;
}

let tasks: Task[] = [];
//load task in local storage
taskForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = taskForm['title'] as unknown as HTMLInputElement;
  const description = taskForm['description'] as unknown as HTMLTextAreaElement;
  console.log(title.value);
  console.log(description.value);

  tasks.push({
    title: title.value,
    description: description.value,
    id: v4()
  })
  //key and value and convert into a json to add in local storage
  localStorage.setItem('task', JSON.stringify(tasks));

  //using toastify to show a message when a task is added
  Toastify({
    text: 'Task added',
    style: {
      backgroundColor: '#00b894',
      color: '#fff',
      fontSize: '1.5rem',
      textAlign: 'center'
    }
  }).showToast();

  renderTasks(tasks);
  //clean after submit
  taskForm.reset();
  //focus on title when its submitted
  title.focus();

});

//get tasks from local storage
document.addEventListener('DOMContentLoaded', () => {
  //same key
  const task = localStorage.getItem('task');
  tasks = task ? JSON.parse(task) : [];
  renderTasks(tasks);
  
});

//render tasks and append to taskList
const renderTasks = (tasks: Task[]) => {
  //possibly empty but mandatory
  taskList!.innerHTML = '';

  tasks.forEach(task => {
    //creatinmng a secting for each task
    const taskElement = document.createElement('section');
    taskElement.className = 'bg-zinc-800 mb-1 p-4 roundend-lg hover:bg-zinc-700 hover:cursor-pointer';

    //header for tittle 
    const header = document.createElement('header');
    header.className = 'flex justify-between';
    const title = document.createElement('span');
    title.innerText = task.title;
    header.append(title);

    //description in p tag
    const description = document.createElement('p');
    description.innerText = task.description;

    //deleting task find it by id and remove it from array and local storage
    const btnDelete = document.createElement('button');
    btnDelete.innerText = 'X';
    btnDelete.className = 'bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md';
    header.append(btnDelete);
    //when is clicked remove task looking for id
    btnDelete.addEventListener('click', () => {
      if (task.id) {
        const index = tasks.findIndex(t => t.id === task.id);
        tasks.splice(index, 1);
        //up[date local storage]
        localStorage.setItem('task', JSON.stringify(tasks));
        renderTasks(tasks);
      }
    });

    //append all to taskElement
    taskElement.append(header);
    taskElement.append(description);

    taskList?.append(taskElement);

  });
}
