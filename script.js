const taskInput = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const deadline = document.getElementById("deadline");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const today = document.getElementById("today");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const darkBtn = document.getElementById("darkBtn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

// Tanggal hari ini
const date = new Date();
today.innerHTML = date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

// Tambah task
addBtn.addEventListener("click", () => {

    if (taskInput.value.trim() === "") return;

    tasks.push({
        id: Date.now(),
        title: taskInput.value,
        priority: priority.value,
        deadline: deadline.value,
        completed: false
    });

    taskInput.value = "";
    deadline.value = "";

    save();
    render();
});

// Render Task
function render(){

    taskList.innerHTML="";

    let data = tasks;

    if(filter==="pending"){
        data = tasks.filter(t=>!t.completed);
    }

    if(filter==="completed"){
        data = tasks.filter(t=>t.completed);
    }

    data.forEach(task=>{

        let badge="low";

        if(task.priority==="Medium") badge="medium";
        if(task.priority==="High") badge="high";

        taskList.innerHTML += `
        <li class="task ${task.completed ? "completed":""}">

            <div class="left">

                <input type="checkbox"
                ${task.completed?"checked":""}
                onchange="toggle(${task.id})">

                <div>

                    <h3>${task.title}</h3>

                    <p>${task.deadline || "Tidak ada deadline"}</p>

                    <span class="badge ${badge}">
                        ${task.priority}
                    </span>

                </div>

            </div>

            <div class="actions">

                <button class="edit"
                onclick="editTask(${task.id})">

                <i class="fa-solid fa-pen"></i>

                </button>

                <button class="delete"
                onclick="deleteTask(${task.id})">

                <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </li>
        `;
    });

    updateProgress();
}

// Toggle selesai
function toggle(id){

    tasks = tasks.map(task=>{

        if(task.id===id){
            task.completed=!task.completed;
        }

        return task;

    });

    save();
    render();

}

// Hapus
function deleteTask(id){

    tasks = tasks.filter(task=>task.id!==id);

    save();
    render();

}

// Edit
function editTask(id){

    const task = tasks.find(t=>t.id===id);

    let value = prompt("Edit tugas",task.title);

    if(value===null) return;

    task.title=value;

    save();
    render();

}

// Progress
function updateProgress(){

    if(tasks.length===0){

        progressFill.style.width="0%";
        progressText.innerHTML="0%";
        return;

    }

    let done = tasks.filter(t=>t.completed).length;

    let percent = Math.round(done/tasks.length*100);

    progressFill.style.width = percent+"%";

    progressText.innerHTML = percent+"%";

}

// Simpan
function save(){

    localStorage.setItem("tasks",JSON.stringify(tasks));

}

// Filter
document.querySelectorAll(".filter-btn").forEach(btn=>{

    btn.addEventListener("click",()=>{

        document.querySelectorAll(".filter-btn")
        .forEach(b=>b.classList.remove("active"));

        btn.classList.add("active");

        filter = btn.dataset.filter;

        render();

    });

});

// Dark Mode
darkBtn.onclick=()=>{

    document.body.classList.toggle("dark");

}

// Enter untuk tambah task
taskInput.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        addBtn.click();

    }

});

render();