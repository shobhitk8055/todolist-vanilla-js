//Global variable for tasks
var items = [];

//Adding event listeners
const addListener = (id, action, callback) =>
  document.getElementById(id).addEventListener(action, callback);
  
addListener("myInput", "keyup", changeInput);
addListener("endIcon", "click", addClicked);
addListener("uncompleted", "click", showUncomplete);
addListener("completed", "click", showComplete);
addListener("all", "click", showAll);
addListener("clear", "click", clear);
addListener("completeAll", "click", completeAll);
addListener("main", "click", setCount);

//Complete all tasks
function completeAll(){
  items = items.map(t => {
    t.seen = true;
    return t
  });
  items.map(task => task.id).forEach(checkTaskUsingId)
}

//Clear all tasks
function clear(){
  const targetTasks = items.filter(t => t.seen);
  targetTasks.map(task => task.id).forEach(removeFromDOM);
  items = items.filter(t => !t.seen);
  setCount();
  if(items.length == 0){
    clearList();
  }
}

//Show all tasks
function showAll() {
  document.querySelector("#taskStatus .active").classList.remove("active");
  document.querySelector("#taskStatus #all").classList.add("active");
  clearList();
  items.forEach(pushToDOM);
}

//Show all uncompleted tasks
function showUncomplete() {
  document.querySelector("#taskStatus .active").classList.remove("active");
  document.querySelector("#taskStatus #uncompleted").classList.add("active");
  const showItems = items.filter((i) => !i.seen);
  clearList();
  showItems.forEach(pushToDOM);
}

//Show all completed tasks
function showComplete() {
  document.querySelector("#taskStatus .active").classList.remove("active");
  document.querySelector("#taskStatus #completed").classList.add("active");
  const showItems = items.filter((i) => i.seen);
  clearList();
  showItems.forEach(pushToDOM);
}

//Click on plus button
function addClicked(e) {
  e.target.style.display = "none";
  const inputElement = document.getElementById("myInput");
  const val = inputElement.value;
  if (val.length === 0) {
    return;
  }
  pushItem(val);
  inputElement.value = "";
}

//Keyboard events in input field
function changeInput(e) {
  const val = e.target.value;
  const plusIcon = document.querySelector(".end-icon");
  if (val.length) {
    plusIcon.style.display = "block";
    if (e.key === "Enter") {
      pushItem(val);
      e.target.value = "";
      plusIcon.style.display = "none";
    }
  } else {
    plusIcon.style.display = "none";
  }
}

//Pushing an item to the list
function pushItem(val) {
  const itemList = [...items];
  const lastItem = itemList.at(-1);
  const id = lastItem ? lastItem.id + 1 : 1;
  const item = {
    id,
    value: val,
    seen: false,
  };
  items.push(item);
  setCount();
  pushToDOM(item);
}

//Setting all the counts
function setCount() {
  document.querySelector("#totalItems").innerText = items.length;
  document.querySelector("#uncompleted span").innerText = items.filter(i => !i.seen).length;
  document.querySelector("#completed span").innerText = items.filter(i => i.seen).length;
}

//Clear the list
function clearList() {
  document.querySelector(".task-lists").innerHTML = "<p class='text-center mt-0'>No items</p><ul></ul>";
}

//Push task to the dom
function pushToDOM(item) {
  const blueprint = document.querySelector("#blueprint li");
  const listItem = blueprint.cloneNode(true);
  listItem.setAttribute("data-id", item.id);
  listItem.querySelector(".task-text").innerText = item.value;
  const noItems = document.querySelector(".task-lists p");
  if (noItems) {
    noItems.style.display = "none";
  }
  const checked = listItem.querySelector(".checked");
  const text = listItem.querySelector(".task-text");
  const unchecked = listItem.querySelector(".unchecked");
  checked.addEventListener("click", uncheck);
  unchecked.addEventListener("click", check);
  text.addEventListener("click", textClick);
  if (item.seen) {
    checked.style.display = "block";
    unchecked.style.display = "none";
  }
  if (!item.seen) {
    checked.style.display = "none";
    unchecked.style.display = "block";
  }
  const taskList = document.querySelector(".task-lists").children[1];
  listItem.querySelector(".deleteMark").addEventListener("click", deleteTask);
  taskList.append(listItem);
}

//Check a task
function check({ target }) {
  const id = target.parentNode.parentNode.parentNode.getAttribute("data-id");
  items = items.map((i) => {
    if (i.id === +id) {
      i.seen = true;
      return i;
    }
    return i;
  });
  checkTaskUsingId(id);
}

//Uncheck a task
function uncheck({ target }) {
  const id = target.parentNode.parentNode.parentNode.getAttribute("data-id");
  items = items.map((i) => {
    if (i.id === +id) {
      i.seen = false;
      return i;
    }
    return i;
  });
  const item = document.querySelector(`.task-lists li[data-id="${id}"]`);
  item.querySelector(".unchecked").style.display = "block";
  item.querySelector(".checked").style.display = "none";
}

//Click on the task text
function textClick({ target }){
  const children = target.previousElementSibling.children;
  if(children[0].style.display === "none"){
    children[1].click();
  }else{
    children[0].click();
  }
}

//Remove a task from the dom
function removeFromDOM(id) {
  const item = document.querySelector(`.task-lists li[data-id="${id}"]`);
  item.remove();
  if(items.length == 0){
    clearList();
  }
}

//Delete a single task listener
function deleteTask({ target }) {
  const liElement = target.parentNode.parentNode;
  liElement.classList.add("exit");
  setTimeout(()=>{

    const id = liElement.getAttribute("data-id");
    removeTaskUsingId(id);
  },600);
}

//Remove a task using id
function removeTaskUsingId(id) {
  items = items.filter((i) => i.id !== +id);
  setCount();
  removeFromDOM(id);
}

//Complete a task using id
function checkTaskUsingId(id) {
  const item = document.querySelector(`.task-lists li[data-id="${id}"]`);
  item.querySelector(".unchecked").style.display = "none";
  item.querySelector(".checked").style.display = "block";
}
