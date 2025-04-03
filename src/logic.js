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


    const ToDoArray = [];
    const confirm = document.querySelector("#submit");
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");
    const low = document.querySelector(".low");
    const date = document.querySelector("#date");

    confirm.addEventListener("click", () =>{
        //wipe screen:
        if (ToDoDivsArray.length > 0) {
            removeChildren(notebookContainer,
                ToDoDivsArray[ToDoDivsArray.length - 1].getHeader(),
                ToDoDivsArray[ToDoDivsArray.length - 1].getNotebook());
        };
        //append new items:
        //header:
        const headerDiv = document.createElement("header");
        headerDiv.id = "header";

        //notebook div:
        const notebook = document.createElement("div");
        notebook.id = "notebook";
        for(let i = 0;i<20;i++){
            const divPosition = (i)/20 * 100;
            console.log(divPosition);
            const lineDiv = document.createElement("div");
            lineDiv.style.position = "relative";
            lineDiv.style.top = `${divPosition}%`;
            lineDiv.style.width = "100%";
            lineDiv.style.height = "0.5px";
            lineDiv.style.backgroundColor = "black";
            notebook.append(lineDiv);
        }


        let ToDoDiv = new ToDoDivs(headerDiv, notebook);
        ToDoDivsArray.push(ToDoDiv);
        notebookContainer.append(headerDiv, notebook);
        if(title.value.trim() === ""){
            title.value = "No title";
        }
        let ToDoObject = new ToDo(title.value, description.value, date.value, low.textContent);
        ToDoArray.push(ToDoObject);
        for(let i = 0;i<ToDoArray.length;i++){
            console.log(ToDoArray[i]);
        }
        title.value = "";
        description.value = "";
        date.value="";
        dialog.close();
    });

    class ToDo {

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