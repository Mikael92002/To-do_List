const displayLogic = (function () {
    const ToDoDivsArray = [];
    const newProjectButton = document.querySelector("#new-project-button");

    //notebook styling:
    const notebookContainer = document.querySelector("#notebook-container");
    const noteBookElementsHolder = document.createElement("div");
    const dialog = document.querySelector("dialog");

    newProjectButton.addEventListener("click", () => {
        //wipe screen:
        if (ToDoDivsArray.length > 0) {
            removeChildren(notebookContainer,
                ToDoDivsArray[ToDoDivsArray.length - 1].getHeader(),
                ToDoDivsArray[ToDoDivsArray.length - 1].getNotebook());
        }
        //show dialog:
        dialog.showModal();
        //append new items:
        const headerDiv = document.createElement("header");
        headerDiv.id = "header";
        const notebook = document.createElement("div");
        notebook.id = "notebook";
        let ToDoDiv = new ToDoDivs(headerDiv, notebook);
        ToDoDivsArray.push(ToDoDiv);
        notebookContainer.append(headerDiv, notebook);
    });

    //class to store header and notebook divs, object gets stored in ToDoDivsArray:
    class ToDoDivs {

        constructor(header, notebook) {
            this.header = header;
            this.notebook = notebook;
        };

        getHeader() {
            return this.header;
        }
        getNotebook() {
            return this.notebook;
        }
    }

    //function to remove multiple children at once:
    function removeChildren(parentDiv, ...children) {
        children.forEach((child) => {
            parentDiv.removeChild(child);
        })
    };

})();

const ToDoLogic = (function () {
    const ToDoArray = [];

})();

export class ToDo {

    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    };

    getTitle() {
        return this.title;
    }
    setTitle(newTitle) {
        this.title = newTitle;
    }
    getDescription() {
        return this.description;
    }
    setDescription(newDescription) {
        this.description = newDescription;
    }
    getDueDate() {
        return this.dueDate;
    }
    setDueDate(newDueDate) {
        this.dueDate = newDueDate;
    }
    getPriority() {
        return this.priority;
    }
    setPriority(newPriority) {
        this.priority = newPriority;
    }

};

export { ToDoLogic };
export { displayLogic };