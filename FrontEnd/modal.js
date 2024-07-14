document.addEventListener('DOMContentLoaded', () => {
    const loginLogout = document.getElementById("login");
    const filters = document.getElementById("filters");
    const banner = document.getElementById("banner");
    const editLink = document.getElementById('d');
    const modal = document.getElementById('modal');
    const modifier = document.getElementById("modifier");
    const addPhotoButton = document.getElementById('button-modale');
    const modale2 = document.getElementById('modale-2');
    const cancelmodale = document.getElementById('cancel-bouton');
    const addimage = document.getElementById('addimage');
    const addImageInput = document.getElementById('add-image');
    const backgroundImage = document.getElementById('background-image');
    const categorySelect = document.getElementById('category');
    const submitButton = document.getElementById('submit-button');
    const imageTitle = document.getElementById('image-title');
 const closeButton2 = document.getElementById('close2')
    if (sessionStorage.getItem('token')) {
        loginLogout.textContent = 'logout';
        loginLogout.style.cursor = 'pointer'
        loginLogout.href = "#";
        loginLogout.addEventListener("click", (e) => {
            e.preventDefault();
            sessionStorage.clear();
            window.location.reload();
        });
        modifier.style.display = "block";
        filters.style.display = 'none';
    } else {
        banner.style.display = 'none';
        editLink.style.display = 'none';
        modifier.style.display = "none";
    }

    editLink.addEventListener('click', () => {
        showModal();
        fetchWorks();
    });

    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        closeModal();
    });
    closeButton2.addEventListener('click', () => {
        closeModal2();
    });
    function showModal() {
        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }
function closeModal2() {
    modale2.style.display
}
    async function fetchWorks() {
        try {
            const response = await fetch('http://localhost:5678/api/works');
            if (!response.ok) {
                throw new Error('Erreur de requête: ' + response.status);
            }
            const works = await response.json();
            displayWorks(works);
            filterProjects(works)
        } catch (error) {
            console.error('Erreur lors de la récupération des travaux:', error);
        }
    }

    function displayWorks(works) {
        const galleryDiv = document.getElementById('gallery');
        galleryDiv.innerHTML = '';

        works.forEach(work => {
            const workDiv = document.createElement('div');
            workDiv.classList.add('work');

            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            const image = document.createElement('img');
            image.src = work.imageUrl;
            image.alt = work.title;
            image.style.width = "76.86px";
            image.style.height = "102.57px";
            image.style.borderRadius = "2px";

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fas', 'fa-trash-alt', 'delete-icon');
            deleteIcon.addEventListener('click', () => {
                deleteImage(workDiv, work);
            });

            imageContainer.appendChild(image);
            imageContainer.appendChild(deleteIcon);
            workDiv.appendChild(imageContainer);
            galleryDiv.appendChild(workDiv);
        });
    }

    function deleteImage(workDiv, work) {
        workDiv.remove();
        fetch(`http://localhost:5678/api/works/${work.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`
            }

        })

        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de l\'image');
            }
            console.log('Image supprimée avec succès');
            work = workdata.filter(workdata =>  work.id != workdata.id  )
            console.log(workdata)
            filterProjects(work)
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'image:', error);
        });
        
    }

    addPhotoButton.addEventListener("click", () => {
        modal.style.display = 'none';
        modale2.style.display = 'block';
    });

    cancelmodale.addEventListener("click", () => {
        modal.style.display = 'block';
        modale2.style.display = 'none';
    });

    addimage.addEventListener('click', () => {
        addImageInput.click();
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    modale2.addEventListener('click', (event) => {
        if (event.target === modale2) {
            closeModal2();
        }
    });

    function closeModal2() {
        modale2.style.display = 'none';
    }

    addImageInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            backgroundImage.src = e.target.result;
            backgroundImage.style.display = 'block';
        }

        reader.readAsDataURL(file);
    });

    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:5678/api/categories');
            if (!response.ok) {
                throw new Error('Erreur de requête: ' + response.status);
            }
            const categories = await response.json();
            populateCategorySelect(categories);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    }

    function populateCategorySelect(categories) {
        categorySelect.innerHTML = '';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    }

    function checkFormValidity() {
        const isCompled =   imageTitle.value.trim()   && categorySelect.value  && addImageInput.files.length  ;
                                                  
            submitButton.disabled = !isCompled;
        
       if(isCompled)  {
        submitButton.style.backgroundColor = '#1D6154'
    }  
         else {
            submitButton.style.backgroundColor = ''
        }
    }

    imageTitle.addEventListener('input', checkFormValidity);
    categorySelect.addEventListener('change', checkFormValidity);
    addImageInput.addEventListener('change', checkFormValidity);

    submitButton.addEventListener('click', async (event) => {
        event.preventDefault();
            
        const file = addImageInput.files[0];
        const formData = new FormData();
        formData.append('title', imageTitle.value.trim());
        formData.append('category', categorySelect.value);
        formData.append('image', file);

        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout de l\'image: ' + response.statusText);
            }

            const newWork = await response.json();
            console.log('Image ajoutée avec succès:', newWork);
             
            fetchWorks();

            imageTitle.value = '';
            categorySelect.value = '';
            addImageInput.value = '';
            backgroundImage.style.display = 'none';

            submitButton.disabled = true;

        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'image:', error);
        }
    });

    fetchCategories();
});
