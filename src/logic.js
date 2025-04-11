
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
        getAllSidebarDivs() {
            return this.sidebar;
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
            this.notebookContainer = document.createElement("div");
            this.notebookContainer.id = "notebook-container";
            this.body = document.querySelector("body");
        }

        addToScreen(id, headerTitle, notebookDescription) {
            this.DOMRefreshView();

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
                this.removeFromSidebarDivsContainer(trash.id);
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

        removeFromSidebarDivsContainer(id) {
            const sidebarDivsContainer = document.querySelector("#sidebar-divs-container");
            for (let i = 0; i < sidebarDivsContainer.children.length; i++) {
                if (sidebarDivsContainer.children[i].id === id) {
                    sidebarDivsContainer.removeChild(sidebarDivsContainer.children[i]);
                    break;
                }
            }
        }




        DOMRefreshView() {
            for (let i = 0; i < this.body.children.length; i++) {
                if (this.body.children[i].id === "project-display-div") {
                    this.body.removeChild(this.body.children[i]);
                    this.body.append(this.notebookContainer);
                }
            }
        }

    };

    class ToDoController {
        constructor(model, view) {
            this.model = model;
            this.view = view;
            this.activeButton = "low";
            const low = document.querySelector(".low");
            const medium = document.querySelector(".medium");
            const high = document.querySelector(".high");
            this.priorityButtons = document.querySelectorAll("#priority");

            low.addEventListener("click", () => {
                this.activeButton = "low";
                this.colorSwitch();
                low.style.backgroundColor = "brown";
            })
            medium.addEventListener("click", () => {
                this.activeButton = "medium";
                this.colorSwitch();
                medium.style.backgroundColor = "brown";
            })
            high.addEventListener("click", () => {
                this.activeButton = "high";
                this.colorSwitch();
                high.style.backgroundColor = "brown";
            })

        };

        confirmPress() {
            this.view.DOMRefreshView();
            this.view.removeFromScreen();

            const title = document.querySelector("#title");
            const description = document.querySelector("#description");
            const date = document.querySelector("#date");
            const sidebarDivsContainer = document.querySelector("#sidebar-divs-container");
            const sideBarDiv = document.createElement("div");
            const Todialog = document.querySelector("#to-do-dialog");

            const titleValue = title.value.trim() === "" ? "No Title" : title.value;
            const dateValue = date.value === "" ? "No due date" : date.value;

            const task = this.model.addTask(titleValue, description.value, date.value, this.activeButton);
            this.view.addToScreen(task.id, titleValue, description.value);
            Todialog.close();

            const dateDiv = document.createElement("div");
            dateDiv.textContent = dateValue;
            dateDiv.style.color = "gray";
            dateDiv.style.pointerEvents = "none";

            sideBarDiv.id = task.id;
            sideBarDiv.style.borderLeft = "1px solid " + this.returnColorForSidebar();
            sideBarDiv.classList.add("sidebar-divs");
            sideBarDiv.append(titleValue, dateDiv);
            sidebarDivsContainer.append(sideBarDiv);
            sideBarDiv.addEventListener("click", (event) => {
                this.view.removeFromScreen();
                const task = this.model.getTask(event.target.id);
                this.view.addToScreen(event.target.id, task.title, task.description);
            });
            this.model.sidebar.push(sideBarDiv);
            title.value = "";
            description.value = "";
            this.activeButton = "low";
            this.colorSwitch();
            date.value = "";
        };

        colorSwitch() {
            this.priorityButtons.forEach((button) => {
                button.style.backgroundColor = "rgb(245, 242, 197)"
            })
        }
        returnColorForSidebar() {
            if (this.activeButton === "low") {
                return "green";
            }
            else if (this.activeButton === "medium") {
                return "yellow";
            }
            else return "red";
        }
    };

    class Project {
        name;

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
                if (this.projectArray[i].projectID === projectID) {
                    this.projectArray.splice(i, 1);
                }
            }
            this.currentProject = null;
        }

        getCurrentProject() {
            return this.currentProject;
        }
    }

    class ProjectView {
        projectDivs = [];
        taskAppended = false;

        constructor(model) {
            this.model = model;

            this.projectName = document.querySelector("#project-name");
            this.body = document.querySelector("body");
            //Create new div for project displays:
            this.projectDisplayDiv = document.createElement("div");
            this.projectDisplayDiv.id = "project-display-div";
            this.newTaskButton = document.querySelector("#new-task-button");
            this.Todialog = document.querySelector("#to-do-dialog");

            this.newTaskButton.addEventListener("click", () => {
                this.Todialog.showModal();
            });
        }

        displayProject(project) {
            if (!this.taskAppended) {
                this.taskButtonEnable();
            }
            this.model.currentProject = project;
            this.clearSidebarDivsContainer();
            const sideBarArray = this.model.currentProject.ToDoManager.getAllSidebarDivs();
            const sidebarDivsContainer = document.querySelector("#sidebar-divs-container");
            const sidebarProjectNameDiv = document.createElement("div");
            const sidebarProjectDeleteButton = document.createElement("button");
            sidebarProjectDeleteButton.textContent = "DELETE";
            sidebarProjectDeleteButton.style.backgroundColor = "red";
            sidebarProjectDeleteButton.addEventListener("click", () => {
                this.removeProjectFromProjectDivsArray(this.model.currentProject.projectID);
                this.model.removeProject(this.model.currentProject.projectID);
                this.clearSidebarDivsContainer();
                this.displayAllProjects();
                this.taskButtonDisable();
            })

            sidebarProjectNameDiv.textContent = this.model.currentProject.name;
            sidebarProjectNameDiv.append(sidebarProjectDeleteButton);
            sidebarProjectNameDiv.id = "sidebar-project-name-div"
            sidebarDivsContainer.append(sidebarProjectNameDiv);
            for (let i = 0; i < sideBarArray.length; i++) {
                sidebarDivsContainer.append(sideBarArray[i]);
            }
        }

        addProjectToScreen(id) {
            const projectButton = document.createElement("button");
            let projectName = this.projectName.value.trim() === "" ? "No Project Title" : this.projectName.value;
            projectButton.textContent = projectName;
            this.model.getProject(id).name = projectName;
            this.projectName.value = "";
            projectButton.classList.add("project-button");
            projectButton.id = id;

            projectButton.addEventListener("click", () => {
                const projectToDisplay = this.model.getProject(projectButton.id);
                this.displayProject(projectToDisplay);
            })

            this.projectDisplayDiv.append(projectButton);
            this.projectDivs.push(projectButton);
            this.displayAllProjects();
        }

        displayAllProjects() {
            this.removeFromScreen();
            for (let i = 0; i < this.body.children.length; i++) {
                if (this.body.children[i].id === "notebook-container") {
                    this.body.removeChild(this.body.children[i]);
                }
            }
            for (let i = 0; i < this.projectDivs.length; i++) {
                this.projectDisplayDiv.append(this.projectDivs[i]);
            }
            this.body.append(this.projectDisplayDiv);
        }

        removeFromScreen() {
            while (this.projectDisplayDiv.firstChild) {
                this.projectDisplayDiv.removeChild(this.projectDisplayDiv.lastChild);
            }
        }

        removeProjectFromProjectDivsArray(id) {
            for (let i = 0; i < this.projectDivs.length; i++) {
                if (this.projectDivs[i].id === id) {
                    this.projectDivs.splice(i, 1);
                }
            }
        }

        taskButtonEnable() {
            this.newTaskButton.textContent = "+ New Task";
            this.newTaskButton.style.opacity = "1";
            this.newTaskButton.style.height = "fit-content";
            this.newTaskButton.style.width = "auto"
            this.newTaskButton.style.margin = "5px";
            this.newTaskButton.disabled = false;
            this.newTaskButton.taskAppended = true;
        }
        taskButtonDisable() {
            this.newTaskButton.textContent = "";
            this.newTaskButton.style.opacity = "0";
            this.newTaskButton.style.height = "0px";
            this.newTaskButton.style.width = "auto"
            this.newTaskButton.style.margin = "0px";
            this.newTaskButton.disabled = true;
            this.newTaskButton.taskAppended = false;
        }

        clearSidebarDivsContainer() {
            const sidebarDivsContainer = document.querySelector("#sidebar-divs-container");
            console.log(sidebarDivsContainer.children.length);
            while (sidebarDivsContainer.firstChild) {
                sidebarDivsContainer.removeChild(sidebarDivsContainer.lastChild);
            }
        }
    }

    class ProjectController {

        constructor(model, view) {
            this.model = model;
            this.view = view;

            this.newProjectButton = document.querySelector("#new-project-button");
            this.confirmButton = document.querySelector("#submit");
            this.projectDialog = document.querySelector("#project-dialog");
            this.projectName = document.querySelector("#project-name");
            this.notebookContainer = document.querySelector("#notebook-container");
            this.projectConfirm = document.querySelector("#project-name-confirm");
            this.allProjectsButton = document.querySelector("#all-projects");

            this.newProjectButton.addEventListener("click", () => {
                this.projectDialog.showModal();
            });

            this.confirmButton.addEventListener("click", () => {
                const currentProject = this.model.getCurrentProject();
                currentProject.ToDoController.confirmPress();
            });
            this.projectConfirm.addEventListener("click", () => {
                const project = this.model.addProject();
                this.view.addProjectToScreen(project.projectID);
                this.projectDialog.close();
            })
            this.allProjectsButton.addEventListener("click", () => {
                this.view.displayAllProjects();
            })

        }

    }

    document.addEventListener("DOMContentLoaded", () => {
        const model = new ProjectManager();
        const view = new ProjectView(model);
        const controller = new ProjectController(model, view);
    });

})();

export { logic };