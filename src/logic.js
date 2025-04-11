
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
            this.sidebar = [];
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
        getTask(id) {
            for (let i = 0; i < this.tasks.length; i++) {
                if (this.tasks[i].id === id) {
                    return this.tasks[i];
                }
            }
        }
        getSidebarDiv(id) {
            for (let i = 0; i < this.sidebar.length; i++) {
                if (this.sidebar[i].id === id) {
                    return this.sidebar[i];
                }
            }
        }
        removeSidebarDiv(id) {
            for (let i = 0; i < this.sidebar.length; i++) {
                if (this.sidebar[i].id === id) {
                    this.sidebar.splice(i, 1);
                }
            }
        }
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
            notebook.id = id;
            notebook.classList.add("notebook")
            notebook.contentEditable = "true";
            notebook.addEventListener("blur", (event) => {
                const newDescription = notebook.textContent;
                this.model.getTask(event.target.id).description = newDescription;
            })
            notebook.append(notebookDescription);

            trash.textContent = "DELETE";
            trash.id = id;

            trash.addEventListener("click", () => {
                this.model.removeTask(trash.id);
                this.removeFromScreen();
                this.removeFromSidebar(trash.id);
                this.model.removeSidebarDiv(trash.id);
            });

            header.append(trash);
            this.notebookContainer.append(header, notebook);
        }

        removeFromScreen() {
            while (this.notebookContainer.firstChild) {
                this.notebookContainer.removeChild(this.notebookContainer.lastChild);
            }
        };

        removeFromSidebar(id) {
            const sidebar = document.querySelector("#sidebar");
            for (let i = 0; i < sidebar.children.length; i++) {
                if (sidebar.children[i].id === id) {
                    sidebar.removeChild(sidebar.children[i]);
                    break;
                }
            }
        }

    };

    class ToDoController {
        constructor(model, view) {
            this.model = model;
            this.view = view;


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
            const sideBarDiv = document.createElement("div");
            const Todialog = document.querySelector("#to-do-dialog");

            const titleValue = title.value.trim() === "" ? "No Title" : title.value;
            let activeButton = "WORK ON THIS";

            const task = this.model.addTask(titleValue, description.value, date.value, activeButton);
            this.view.addToScreen(task.id, titleValue, description.value);
            Todialog.close();
            title.value = "";
            description.value = "";
            activeButton = "";
            date.value = "";

            sideBarDiv.id = task.id;
            sideBarDiv.classList.add("sidebar-divs");
            sideBarDiv.append(titleValue);
            sidebar.append(sideBarDiv);
            sideBarDiv.addEventListener("click", (event) => {
                this.view.removeFromScreen();
                const task = this.model.getTask(event.target.id);
                this.view.addToScreen(event.target.id, task.title, task.description);
            });
            this.model.sidebar.push(sideBarDiv);
        };
    };

    class Project {
        constructor(ToDoManager, ToDoView, ToDoController) {
            this.projectID = crypto.randomUUID();
            this.ToDoManager = ToDoManager;
            this.ToDoView = ToDoView;
            this.ToDoController = ToDoController;
        }

        getModel() {
            return this.ToDoManager;
        }
        getView() {
            return this.view;
        }
        getController() {
            return this.ToDoController;
        }
    }

    class ProjectManager {
        projectArray = [];
        currentProject = null;

        addProject() {
            const toDoModel = new ToDoManager();
            const toDoView = new ToDoView(toDoModel);
            const toDoController = new ToDoController(toDoModel, toDoView);
            const newProject = new Project(toDoModel, toDoView, toDoController);
            this.projectArray.push(newProject);
            this.currentProject = newProject;

            return newProject;
        }

        getProject(projectID) {
            for (let i = 0; i < this.projectArray.length; i++) {
                if (this.projectArray[i].projectID === projectID) {
                    return this.projectArray[i];
                }
            }
        }
        removeProject(projectID) {
            for (let i = 0; i < this.projectArray.length; i++) {
                if (this.projectArray[i].id === projectID) {
                    this.projectArray.splice(i, 1);
                }
            }
        }

        getCurrentProject() {
            return this.currentProject;
        }
    }

    class ProjectView {
        projectDivs = [];

        constructor(model) {
            this.model = model;

            this.projectName = document.querySelector("#project-name");
            //this.notebookContainer = document.querySelector("#notebook-container");
            this.body = document.querySelector("body");
            //Create new div for project displays:
            this.projectDisplayDiv = document.createElement("div");
            this.projectDisplayDiv.id = "project-display-div";
        }

        displayProject(project) {
            this.model.currentProject = project;
            //need to do
        }

        addProjectToScreen(id) {
            const projectButton = document.createElement("button");
            let projectName = this.projectName.value.trim() === "" ? "No Project Title" : this.projectName.value;
            projectButton.textContent = projectName;
            this.projectName.value = "";
            projectButton.classList.add("project-button");
            projectButton.id = id;

            projectButton.addEventListener("click", () => {
                const projectToDisplay = this.model.getProject(projectButton.id);
                //need to do
            })

            this.projectDisplayDiv.append(projectButton);
            this.displayAllProjects();
        }

        displayAllProjects() {
            for(let i = 0;i<this.body.children.length;i++){
                if(this.body.children[i].id === "notebook-container"){
                    this.body.removeChild(this.body.children[i]);
                }
            }
            for (let i = 0; i < this.projectDivs.length; i++) {
                this.projectDisplayDiv.append(projectDivs[i]);
            }
            this.body.append(this.projectDisplayDiv);
        }

        removeFromScreen() {
            while (this.projectDisplayDiv.firstChild) {
                this.projectDisplayDiv.removeChild(this.projectDisplayDiv.lastChild);
            }
        };
    }

    class ProjectController {
        taskAppended = false;

        constructor(model, view) {
            this.model = model;
            this.view = view;

            this.newProjectButton = document.querySelector("#new-project-button");
            this.newTaskButton = document.querySelector("#new-task-button");
            this.confirmButton = document.querySelector("#submit");
            this.Todialog = document.querySelector("#to-do-dialog");
            this.projectDialog = document.querySelector("#project-dialog");
            this.projectName = document.querySelector("#project-name");
            this.notebookContainer = document.querySelector("#notebook-container");
            this.projectConfirm = document.querySelector("#project-name-confirm");

            this.newProjectButton.addEventListener("click", () => {
                this.projectDialog.showModal();
            });


            this.newTaskButton.addEventListener("click", () => {
                this.Todialog.showModal();
            });

            this.confirmButton.addEventListener("click", () => {
                const currentProject = this.model.getCurrentProject();
                currentProject.ToDoController.confirmPress();
            });
            this.projectConfirm.addEventListener("click", () => {
                const project = this.model.addProject();
                this.view.addProjectToScreen(project.projectID);
                if (!this.taskAppended) {
                    const taskButton = document.querySelector("#new-task-button");
                    taskButton.textContent = "+ New Task";
                    taskButton.style.opacity = "1";
                    taskButton.style.height = "fit-content";
                    taskButton.style.width = "auto"
                    taskButton.style.margin = "5px";
                    this.taskAppended = true;
                }
                this.projectDialog.close();
            })

        }

        projectConfirmClick() {

        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        const model = new ProjectManager();
        const view = new ProjectView(model);
        const controller = new ProjectController(model, view);
    });

})();

export { logic };