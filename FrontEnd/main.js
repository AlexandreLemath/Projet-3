const galleryDiv = document.querySelector(".gallery");
const Perror = document.getElementById("error");
let workdata = [];
fetch("http://localhost:5678/api/works")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erreur de requête: " + response.status);
    }
    return response.json();
  })
  .then((data) => {
    filterProjects(data);

    fetchCategory(data);
    workdata = data;
  })
  .catch((error) => {});

function filterProjects(projects) {
  galleryDiv.innerHTML = "";

  projects.forEach((project) => {
    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project");

    const image = document.createElement("img");
    image.src = project.imageUrl;
    image.alt = project.title;

    const title = document.createElement("h3");
    title.textContent = project.title;

    projectDiv.appendChild(image);
    projectDiv.appendChild(title);

    galleryDiv.appendChild(projectDiv);
  });
}

function fetchCategory(works) {
  fetch("http://localhost:5678/api/categories")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur de requête: " + response.status);
      }
      return response.json();
    })
    .then((categories) => {
      categoryFilters(works, categories);
    })
    .catch((error) => {});
}

function categoryFilters(projects, categories) {
  const filterDiv = document.getElementById("filters");
  filterDiv.innerHTML = "";

  const buttonAll = document.createElement("button");
  buttonAll.textContent = "Tous";
  buttonAll.className = "green-button";
  buttonAll.onclick = () => {
    filterProjects(projects);
  };
  filterDiv.appendChild(buttonAll);

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.className = "green-button";
    button.onclick = () => {
      const ProjetsFiltrer = projects.filter(
        (project) => project.category.name === category.name
      );
      filterProjects(ProjetsFiltrer);
    };
    filterDiv.appendChild(button);
  });
}
const loginForm = document.querySelector(".form-login");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Identifiants incorrects");
    }

    const data = await response.json();
    const token = data.token;
    sessionStorage.setItem("token", token);
    window.location.href = "./index.html";
  } catch (error) {
    Perror.textContent = "Login ou mot de passe incorrect";
    Perror.style.color = "red";
  }
});
