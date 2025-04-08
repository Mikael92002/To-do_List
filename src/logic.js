
const logic = (function () {
    let tasks = [];

    //model, view, controller

    class ToDo {
        constructor(title, description, dueDate, priority) {
            this.id = crypto.randomUUID();
            this.title = title
            this.description = description;
            this.dueDate = dueDate;
            this.priority = priority;
        }
    }

    class ToDoManager {
        constructor() {
            this.tasks = [];
        }

        addTask(title, description, dueDate, priority) {
            const task = new ToDo(title, description, dueDate, priority);
            this.tasks.push(task);
            return task;
        }

        removeTask(taskID) {
            let taskToReturn = null;
            for (let i = 0; i < this.tasks.length; i++) {
                if (this.tasks[i].id === taskID) {
                    taskToReturn = this.tasks[i].id;
                    this.tasks.splice(i, 1);
                }
            }
            if (taskToReturn === null) {
                throw new Error("Object not found");
            }
            else return taskToReturn;
        };

        getAllTasks() {
            return this.tasks;
        };
    };

    class ToDoView {
        constructor(model) {
            this.model = model;
            this.notebookContainer = document.querySelector("#notebook-container");
        }

        addToScreen(id, headerTitle, notebookDescription) {

            const header = document.createElement("header");
            header.textContent = headerTitle;
            const trash = document.createElement("button");
            let notebook = document.createElement("div");
            notebook.id = "notebook";
            notebook.contentEditable = "true";
            notebook.append(notebookDescription);

            trash.textContent = "DELETE";
            trash.id = id;

            trash.addEventListener("click", () => {
                console.log("id of trash button: " + trash.id);
                this.model.removeTask(trash.id);
                this.removeFromScreen();
            });

            header.append(trash);
            this.notebookContainer.append(header, notebook);
        }

        removeFromScreen() {
            while (this.notebookContainer.firstChild) {
                this.notebookContainer.removeChild(this.notebookContainer.lastChild);
            }
        };

        addToSideBar(){
            //sidebar:
            const sideBar = document.querySelector("#sidebar");
            const sideBarDiv = document.createElement("div");
            sideBarDiv.id = id;
            sideBarDiv.classList.add("sidebar-divs");
            sideBarDiv.append(headerTitle);
            sideBarDiv.addEventListener("click", () => {
                // console.log(this.model);
                // console.log("sidebar div id: " + sideBarDiv.id);
                const currentTask = this.taskFinder(sideBarDiv.id);
                this.removeFromScreen();
                this.addToScreen(id, currentTask.title.value, currentTask.description.value);
            });
            sideBar.append(sideBarDiv);

        }

        taskFinder(taskID) {
            let currentTask = null;
            let arr = this.model.getAllTasks();
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].id === taskID) {
                    currentTask = arr[i];
                }
            }
            if (currentTask === null) throw new Error("task not found");
            else return currentTask;
        }

    };

    class ToDoController {
        constructor(model, view) {
            this.model = model;
            this.view = view;

            this.dialog = document.querySelector("dialog");
            this.newTaskButton = document.querySelector("#new-project-button");
            this.confirmButton = document.querySelector("#submit");

            this.newTaskButton.addEventListener("click", () => {
                this.dialog.showModal();
            });

            this.confirmButton.addEventListener("click", () => {
                this.confirmPress();
            });

            //add sidebar logic here: !!!
        };

        confirmPress() {
            this.view.removeFromScreen();

            const title = document.querySelector("#title");
            const description = document.querySelector("#description");
            const low = document.querySelector(".low");
            const medium = document.querySelector(".medium");
            const high = document.querySelector(".high");
            const date = document.querySelector("#date");
            const sidebar = document.querySelector("#sidebar");

            const titleValue = title.value.trim() === "" ? "No title" : title.value;
            let activeButton = "WORK ON THIS";

            const task = this.model.addTask(titleValue, description.value, date.value, activeButton);
            this.view.addToScreen(task.id, titleValue, description.value);
            this.dialog.close();
            title.value = "";
            description.value = "";
            activeButton = "";
            date.value = "";
        };
    };

    document.addEventListener("DOMContentLoaded", () => {
        const model = new ToDoManager();
        const view = new ToDoView(model);
        const controller = new ToDoController(model, view);
    });

})();

export { logic };