const displayLogic = (function() {
    const ToDoDivsArray = [];
const newProjectButton = document.querySelector("#new-project-button");

//notebook styling:
const headerDiv = document.createElement("div");
const notebook = document.createElement("div");

newProjectButton.addEventListener("click", () => {

})
})();

const ToDoLogic = (function(){
const ToDoArray = [];

})();

export class ToDo{

    constructor(title, description, dueDate, priority){
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    };

    getTitle() {
        return this.title;
    }
    setTitle(newTitle){
        this.title = newTitle;
    }
    getDescription(){
        return this.description;
    }
    setDescription(newDescription){
        this.description = newDescription;
    }
    getDueDate(){
        return this.dueDate;
    }
    setDueDate(newDueDate){
        this.dueDate = newDueDate;
    }
    getPriority(){
        return this.priority;
    }
    setPriority(newPriority){
        this.priority = newPriority;
    }

};

export{ToDoLogic};