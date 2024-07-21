if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/scripts/service-worker.js").then(
      (registration) => {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      (error) => {
        console.log("ServiceWorker registration failed: ", error);
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const categoryForm = document.querySelector(".category-form");
  const taskForm = document.querySelector(".task-form");
  const newCategoryInput = document.getElementById("new-category");
  const addCategoryButton = document.getElementById("add-category");
  const taskNameInput = document.getElementById("task-name");
  const categorySelect = document.getElementById("category-select");
  const addTaskButton = document.getElementById("add-task");
  const categoriesDiv = document.getElementById("categories");

  // Load categories and tasks from localStorage
  let categories = JSON.parse(localStorage.getItem("categories")) || [];
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Initialize the app
  function initialize() {
    renderCategories();
    populateCategorySelect();
  }

  // Render categories and tasks
  function renderCategories() {
    categoriesDiv.innerHTML = "";
    categories.forEach((category) => {
      const categoryDiv = document.createElement("div");
      categoryDiv.classList.add("category");

      const categoryTitle = document.createElement("h2");
      categoryTitle.innerHTML = `${category.name} ⟪${
        tasks.filter((task) => task.category === category.name).length
      }⟫`;

      const removeCategoryButton = document.createElement("button");
      removeCategoryButton.classList.add("remove-category");
      removeCategoryButton.textContent = "❌";
      removeCategoryButton.addEventListener("click", function () {
        removeCategory(category.name);
      });

      categoryTitle.appendChild(removeCategoryButton);
      categoryDiv.appendChild(categoryTitle);

      const taskList = document.createElement("ul");
      taskList.classList.add("tasks");

      tasks
        .filter((task) => task.category === category.name)
        .forEach((task) => {
          const taskItem = document.createElement("li");
          taskItem.textContent = task.name;
          taskItem.classList.toggle("completed", task.completed);

          const removeTaskButton = document.createElement("button");
          removeTaskButton.textContent = "❌";
          removeTaskButton.addEventListener("click", function () {
            removeTask(task);
          });

          taskItem.appendChild(removeTaskButton);
          taskList.appendChild(taskItem);
        });

      categoryDiv.appendChild(taskList);
      categoriesDiv.appendChild(categoryDiv);
    });
  }

  // Populate the category select dropdown
  function populateCategorySelect() {
    categorySelect.innerHTML = "";
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.name;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  }

  // Add a new category
  addCategoryButton.addEventListener("click", function () {
    const newCategoryName = newCategoryInput.value.trim();
    if (
      newCategoryName &&
      !categories.some((category) => category.name === newCategoryName)
    ) {
      categories.push({ name: newCategoryName });
      localStorage.setItem("categories", JSON.stringify(categories));
      newCategoryInput.value = "";
      renderCategories();
      populateCategorySelect();
    }
  });

  // Add a new task
  addTaskButton.addEventListener("click", function () {
    const taskName = taskNameInput.value.trim();
    const category = categorySelect.value;
    if (taskName && category) {
      tasks.push({ name: taskName, category: category, completed: false });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      taskNameInput.value = "";
      renderCategories();
    }
  });

  // Remove a task
  function removeTask(taskToRemove) {
    tasks = tasks.filter((task) => task !== taskToRemove);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderCategories();
  }

  // Remove a category
  function removeCategory(categoryName) {
    categories = categories.filter(
      (category) => category.name !== categoryName
    );
    tasks = tasks.filter((task) => task.category !== categoryName);
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderCategories();
    populateCategorySelect();
  }

  initialize();
});
