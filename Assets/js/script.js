
const postForm = document.getElementById("postForm");
const userIdControl = document.getElementById("userId");
const spinner = document.getElementById("spinner");
const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const postContainer = document.getElementById("postContainer");
const bodyControl = document.getElementById("body");
const titleControl = document.getElementById("title");

const BASE_URL = "https://jsonplaceholder.typicode.com";
const POST_URL = `${BASE_URL}/posts`;

function snackbar(title, icon) {
    Swal.fire({ title, icon, timer: 3000 });
}

function createSingleBlogCard(blog) {
    return `
        <div class="col-md-4 mb-4" id="${blog.id}">
            <div class="card h-100">
                <div class="card-header"><h3>${blog.title}</h3></div>
                <div class="card-body"><p>${blog.body}</p></div>
                <div class="card-footer d-flex justify-content-between">
                    <button onclick="onEdit(this)" class="btn btn-sm btn-outline-primary">Edit</button>
                    <button onclick="onRemove(this)" class="btn btn-sm btn-outline-danger">Remove</button>
                </div>
            </div>
        </div>
    `;
}

function createPostCard(arr) {
    let result = "";
    const limited = arr.slice(0, 10);
    for (let i = limited.length - 1; i >= 0; i--) {
        result += createSingleBlogCard(limited[i]);
    }
    postContainer.innerHTML = result;
}

function fetchPosts() {
    spinner.classList.remove("d-none");
    fetch(POST_URL)
        .then((res) => res.json())
        .then((response) => {
            createPostCard(response);
        })
        .catch((error) => {
            console.log(error);
            snackbar("Error fetching blogs", "error");
        })
        .finally(() => spinner.classList.add("d-none"));
}

function onPostSubmit(event) {
    event.preventDefault();
    const postObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value,
    };
    spinner.classList.remove("d-none");
    fetch(POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postObj),
    })
        .then((res) => res.json())
        .then((newBlog) => {
            postContainer.insertAdjacentHTML("afterbegin", createSingleBlogCard(newBlog));
            postForm.reset();
            snackbar("Blog created successfully", "success");
        })
        .catch((error) => {
            console.log(error);
            snackbar("Error creating blog", "error");
        })
        .finally(() => spinner.classList.add("d-none"));
}

function onEdit(element) {
    const blogId = element.closest(".col-md-4").id;
    spinner.classList.remove("d-none");
    fetch(`${POST_URL}/${blogId}`)
        .then((res) => res.json())
        .then((blog) => {
            titleControl.value = blog.title;
            bodyControl.value = blog.body;
            updateBtn.dataset.id = blog.id;
            addBtn.classList.add("d-none");
            updateBtn.classList.remove("d-none");
            postForm.scrollIntoView({ behavior: "smooth" });
        })
        .catch((error) => {
            console.log(error);
            snackbar("Error fetching blog", "error");
        })
        .finally(() => spinner.classList.add("d-none"));
}

function onPostUpdate() {
    const blogId = updateBtn.dataset.id;
    const updatedObj = {
        title: titleControl.value,
        body: bodyControl.value,
        userId: userIdControl.value,
    };
    spinner.classList.remove("d-none");
    fetch(`${POST_URL}/${blogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedObj),
    })
        .then((res) => res.json())
        .then((updatedBlog) => {
            const blogCard = document.getElementById(blogId);
            blogCard.querySelector(".card-header h3").textContent = updatedBlog.title;
            blogCard.querySelector(".card-body p").textContent = updatedBlog.body;
            postForm.reset();
            addBtn.classList.remove("d-none");
            updateBtn.classList.add("d-none");
            delete updateBtn.dataset.id;
            snackbar("Blog updated successfully", "success");
        })
        .catch((error) => {
            console.log(error);
            snackbar("Error updating blog", "error");
        })
        .finally(() => spinner.classList.add("d-none"));
}

function onRemove(element) {
    const blogCard = element.closest(".col-md-4");
    const blogId = blogCard.id;
    spinner.classList.remove("d-none");
    fetch(`${POST_URL}/${blogId}`, { method: "DELETE" })
        .then(() => {
            blogCard.remove();
            snackbar("Blog deleted successfully", "success");
        })
        .catch((error) => {
            console.log(error);
            snackbar("Error deleting blog", "error");
        })
        .finally(() => spinner.classList.add("d-none"));
}

fetchPosts();
postForm.addEventListener("submit", onPostSubmit);
updateBtn.addEventListener("click", onPostUpdate);
