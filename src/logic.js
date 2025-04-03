const displayLogic = (function () {
    const ToDoDivsArray = [];
    const newProjectButton = document.querySelector("#new-project-button");

    //notebook styling:
    const notebookContainer = document.querySelector("#notebook-container");
    const noteBookElementsHolder = document.createElement("div");
    const dialog = document.querySelector("dialog");

    newProjectButton.addEventListener("click", () => {
        //show dialog:
        dialog.showModal();
    });

    //class to store header and notebook divs, object gets stored in ToDoDivsArray:
    class ToDoDivs {
        uuid;
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
        setUUID(uuid) {
            this.uuid = uuid;
        }
    }

    //function to remove multiple children at once:
    function removeChildren(parentDiv, ...children) {
        children.forEach((child) => {
            parentDiv.removeChild(child);
        })
    };


    const ToDoArray = [];
    const confirm = document.querySelector("#submit");
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    const low = document.querySelector(".low");
    const medium = document.querySelector(".medium");
    const high = document.querySelector(".high");
    const date = document.querySelector("#date");
    const sidebar = document.querySelector("#sidebar");

    confirm.addEventListener("click", () => {
        //wipe screen:
        while(notebookContainer.firstChild){
            notebookContainer.removeChild(notebookContainer.lastChild);
        }

        //ToDoObject:
        let ToDoObject = new ToDo(title.value, description.value, date.value, currentPriority.textContent);
        ToDoArray.push(ToDoObject);

        //header:
        let headerDiv = document.createElement("header");
        headerDiv.id = "header";

        //notebook:
        let notebook = document.createElement("div");
        notebook.id = "notebook";
        notebook.contentEditable = "true";

        //ToDo div:
        let ToDoDiv = new ToDoDivs(headerDiv, notebook);
        ToDoDiv.setUUID(ToDoObject.uuid);
        ToDoDivsArray.push(ToDoDiv);
        notebookContainer.append(headerDiv, notebook);
        if (title.value.trim() === "") {
            title.value = "No title";
        }


        //append items to screen:
        header.append(title.value);
        notebook.append(description.value);


        //sidebar div:
        const sideBarDiv = document.createElement("div");
        sideBarDiv.id = "sidebar-divs";
        sideBarDiv.classList.add(ToDoObject.uuid);
        if(currentPriority.textContent === "Low"){
            sideBarDiv.style.borderLeft = "2px solid green";
        }
        else if(currentPriority.textContent === "Medium"){
            sideBarDiv.style.borderLeft = "2px solid yellow";
        }
        else sideBarDiv.style.borderLeft = "2px solid red";
        console.log(currentPriority.textContent);
        sideBarDiv.append(title.value);
        sidebar.append(sideBarDiv);
        sideBarDiv.addEventListener("click", () => {
            for (let i = 0; i < ToDoDivsArray.length; i++) {
                if (sideBarDiv.classList.contains(ToDoDivsArray[i].uuid)) {
                    while(notebookContainer.firstChild){
                        notebookContainer.removeChild(notebookContainer.lastChild);
                    }

                    headerDiv = ToDoDivsArray[i].getHeader();
                    notebook = ToDoDivsArray[i].getNotebook();
                    notebookContainer.append(headerDiv,notebook);
                };
            };
        });

        //reset dialog fields:
        title.value = "";
        description.value = "";
        date.value = "";
        dialog.close();
    });


    //priority buttons event-handling:
    const priorityDiv = document.querySelector("#priority-button-holder");
    low.style.backgroundColor = "brown";
    let currentPriority = low;
    priorityDiv.addEventListener("click", (event) => {
        if (event.target.id === "priority") {
            for (let i = 0; i < priorityDiv.children.length; i++) {
                priorityDiv.children[i].style.backgroundColor = "rgb(245, 242, 197)";
            }
            event.target.style.backgroundColor = "brown";
            currentPriority = event.target;
        }
    });

    class ToDo {
        uuid = crypto.randomUUID();

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

})();



export { displayLogic };