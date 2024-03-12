// Filter
function filterProjects(category) {
	const gallery = document.querySelector('.gallery');
	const projects = gallery.querySelectorAll('figure');

	projects.forEach(project => {
		const projectCategory = project.dataset.category;

		if (category === 'all' || projectCategory === category) {
            var show = [project];
			showElement(show);
		} else {
            var hide = [project];
            hideElement(hide);
		}
	});
}

// Delete project
function deleteProject(projectId) {
    const token = localStorage.getItem("token"); 
    const elementDeleted = document.querySelector(`.delete-icon[data-project-id="${projectId}"]`);
    const portfolioDeleted = document.querySelector(`figure[data-project-id="${projectId}"]`);
    const galleryDeleted = elementDeleted.parentElement;

    fetch(`http://localhost:5678/api/works/${projectId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (response.ok) {
                portfolioDeleted.remove();
                galleryDeleted.remove();
                console.log(`Le projet avec l'ID ${projectId} a été supprimé.`);
            } else {
                console.log(`Une erreur s'est produite lors de la suppression du projet avec l'ID ${projectId}.`);
            }
        })
        .catch(error => {
            console.log('Une erreur s\'est produite lors de la communication avec l\'API :', error);
        });
}

// Logout user
function logoutUser() {
    localStorage.removeItem("token"); //Supprime le jeton d'authentification du stockage local
    window.location.href = "index.html"; //Redirige l'utilisateur vers la page d'accueil 
}

// Hide Element
function hideElement(elements) {
    elements.forEach(el => {
        el.classList.add("display-none");
    });
}

// Show Element
function showElement(elements) {
    elements.forEach(el => {
        el.classList.remove("display-none");
    });
}

// Preview Picture
function previewPicture(file) {
    // Récupération des éléments du DOM liés à la prévisualisation d'image
    const previewImg = document.getElementById('preview');
    const btnUpload = document.querySelector('.btn-upload');
    const uploadText = document.querySelector('.upload-text');
    const imgIcon = document.querySelector('.imgIcon');
    const errorText = document.querySelector('.error');

    // Tableau des éléments à masquer
    var hide = [btnUpload, uploadText, imgIcon, errorText];
    hideElement(hide); // Appel d'une fonction pour masquer les éléments spécifiés

    // Tableau des éléments à afficher
    var show = [previewImg];
    showElement(show); // Appel d'une fonction pour afficher les éléments spécifiés

    // Récupération du fichier sélectionné par l'utilisateur
    const picture = file.files[0];

    // Mise à jour de la source de l'élément d'aperçu avec l'URL générée à partir du fichier
    const preview = document.getElementById('preview');
    preview.src = URL.createObjectURL(picture);
}

// Supprimer l'aperçu de l'image
function removePreviewPicture() {
    // Obtenir les éléments du DOM
    const previewImg = document.getElementById('preview');
    const btnUpload = document.querySelector('.btn-upload');
    const uploadText = document.querySelector('.upload-text');
    const imgIcon = document.querySelector('.imgIcon');
    const errorText = document.querySelector('.error');

    // Afficher des éléments spécifiques
    var show = [btnUpload, uploadText, imgIcon, errorText];
    showElement(show);

    // Masquer des éléments spécifiques
    var hide = [previewImg];
    hideElement(hide);

    // Effacer le texte d'erreur
    errorText.textContent = "";

    // Effacer la source de l'image de prévisualisation
    const preview = document.getElementById('preview');
    preview.src = "";
}

// Reset Form
// Réinitialiser le formulaire
function resetForm() {
    // Réinitialiser le formulaire HTML
    document.getElementById('addImgForm').reset();

    // Appeler la fonction pour supprimer l'aperçu de l'image
    removePreviewPicture();

    // Cacher les messages d'erreur pour le titre, la catégorie et le fichier
    hideValidationError(titleInput);
    hideValidationError(categorySelect);
    hideValidationError(fileInputDiv);

    // Désactiver le bouton de soumission
    disableSubmit();
}

// Show Form Error
// Afficher l'erreur du formulaire
function showValidationError(inputElement, submit = true, text = 'Ce champ doit être rempli') {
    // Vérifier si un message d'erreur existe déjà
    const errorElement = inputElement.parentNode.querySelector(`.error-message[data-input="${inputElement.id}"]`);

    // Si un message d'erreur existe déjà, ne rien faire
    if (errorElement) {
        return;
    }

    // Ajouter la classe 'error-input' à l'élément d'entrée pour le style
    inputElement.classList.add('error-input');

    // Créer un nouvel élément paragraphe pour afficher le message d'erreur
    const errorMessage = document.createElement('p');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = text;
    errorMessage.dataset.input = inputElement.id;

    // Insérer le message d'erreur après l'élément d'entrée dans le DOM
    inputElement.parentNode.insertBefore(errorMessage, inputElement.nextSibling);

    // Désactiver le bouton de soumission (si submit est vrai)
    if (submit) {
        disableSubmit();
    }
}

// Hide Form Error
// Cacher l'erreur du formulaire
function hideValidationError(inputElement, submit = true) {
    // Supprimer la classe 'error-input' de l'élément d'entrée
    inputElement.classList.remove('error-input');

    // Rechercher l'élément d'erreur correspondant à l'élément d'entrée
    const errorElement = inputElement.parentNode.querySelector(`.error-message[data-input="${inputElement.id}"]`);

    // Si un élément d'erreur est trouvé, le supprimer du DOM
    if (errorElement) {
        errorElement.parentNode.removeChild(errorElement);
    }

    // Désactiver le bouton de soumission (si submit est vrai)
    if (submit) {
        disableSubmit();
    }
}

// Disable/Enable Submit
function disableSubmit() {
    // Vérifier si le titre, la catégorie et le fichier sont valides
    const isTitleValid = titleInput.value.trim() !== '';
    const isCategoryValid = categorySelect.value !== '';
    const isFileValid = fileInput.value !== '';

    // Vérifier si le formulaire est valide en fonction des conditions ci-dessus
    const isFormValid = isTitleValid && isCategoryValid && isFileValid;

    // Si le formulaire est valide, activer le bouton de soumission, sinon le désactiver
    if (isFormValid) {
        submitButton.classList.remove('disabled');
    } else {
        submitButton.classList.add('disabled');
    }
}

// Check Form Validity
function checkFormValidity(elements) {

    function checkFormValidity(elements) {
        elements.forEach(el => {
            if (el.value.trim() === '') {
                // Si l'élément n'a pas d'ID, utilisez son parent comme référence
                if (el.id === '') {
                    el = el.parentElement.parentElement;
                }
                // Afficher l'erreur de validation
                showValidationError(el);
            } else {
                // Masquer l'erreur de validation
                hideValidationError(el);
            }
        });
        // Mettre à jour l'état du bouton de soumission
        disableSubmit();
    }
}

// Check Login Form Validity
function checkLoginFormValidity(email, password) {
    // Vérifier la validité de l'adresse e-mail
    if (email.value.trim() === '') {
        // Afficher l'erreur si l'adresse e-mail est vide
        showValidationError(email, false, 'Veuillez entrer votre adresse e-mail.');
    } else if (!validateEmail(email.value.trim())) {
        // Afficher l'erreur si le format de l'adresse e-mail est incorrect
        showValidationError(email, false, 'Format incorrect pour l\'adresse e-mail.');
    } else {
        // Cacher l'erreur si l'adresse e-mail est valide
        hideValidationError(email, false);
    }

    // Vérifier la validité du mot de passe
    if (password.value === '') {
        // Afficher l'erreur si le mot de passe est vide
        showValidationError(password, false, 'Veuillez entrer votre mot de passe.');
    } else {
        // Cacher l'erreur si le mot de passe est non vide
        hideValidationError(password, false);
    }
}

// Check Email Format
function validateEmail(email) {
    // Le motif regex pour valider le format de l'adresse e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Utiliser test() pour vérifier si l'adresse e-mail correspond au motif
    return emailRegex.test(email);
}