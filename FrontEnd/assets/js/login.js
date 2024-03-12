// Sélection des éléments du DOM
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const submitButton = document.querySelector('#login-submit');

// Gestionnaire d'événement pour la saisie dans le champ email
emailInput.addEventListener('input', function () {
    hideValidationError(emailInput, false); // Masque l'erreur de validation
    if (emailInput.value.trim() === '') {
        showValidationError(emailInput, false); // Affiche une erreur si le champ est vide
    } else if (!validateEmail(emailInput.value.trim())) {
        showValidationError(emailInput, false, 'Format incorrect'); // Affiche une erreur si le format de l'email est incorrect
    } else {
        hideValidationError(emailInput, false); // Masque l'erreur si tout est correct
    }
});

// Gestionnaire d'événement pour la saisie dans le champ mot de passe
passwordInput.addEventListener('input', function () {
    if (passwordInput.value === '') {
        showValidationError(passwordInput, false); // Affiche une erreur si le champ est vide
    } else {
        hideValidationError(passwordInput, false); // Masque l'erreur si tout est correct
    }
});

// Gestionnaire d'événement pour le clic sur le bouton de soumission
submitButton.addEventListener('click', async (e) => {
    checkLoginFormValidity(emailInput, passwordInput); // Vérifie la validité du formulaire

    e.preventDefault(); // Empêche le formulaire de se soumettre automatiquement

    // Vérifie s'il n'y a pas d'erreurs dans les champs email et mot de passe
    if (!emailInput.classList.contains("error-input") && !passwordInput.classList.contains("error-input")) {
        
        var email = emailInput.value;
        var password = passwordInput.value;

        // Vérifie à nouveau le format de l'email
        if (!validateEmail(email)) {
            showValidationError(emailInput, false, 'Format incorrect');
            return;
        }

        // Prépare les données à envoyer
        var data = {
            email: email,
            password: password
        };

        // Envoie une requête POST pour la connexion à l'API
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json(); // Renvoie les données JSON si la requête est réussie
                } else if (response.status === 401) {
                    throw new Error("Adresse mail ou mot de passe invalide");
                } else {
                    throw new Error("Erreur lors de la connexion");
                }
            })
            .then(function (responseData) {
                var token = responseData.token;
                localStorage.setItem("token", token); // Stocke le jeton dans le stockage local

                window.location.href = "index.html"; // Redirige vers la page d'accueil
            })
            .catch(function (error) {
                showValidationError(passwordInput, false, error.message); // Affiche l'erreur s'il y a un problème
                passwordInput.value = ''; // Efface le champ du mot de passe
            });
    }
});