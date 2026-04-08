document.addEventListener("DOMContentLoaded", () => {
    const signInForm = document.getElementById("signInForm");
    const signUpForm = document.getElementById("signUpForm");
    const toSignUp = document.getElementById("toSignUp");
    const toSignIn = document.getElementById("toSignIn");
    const formTitle = document.getElementById("formTitle");

    // Switch to Sign Up
    toSignUp.addEventListener("click", (e) => {
        e.preventDefault();
        signInForm.style.display = "none";
        signUpForm.style.display = "block";
        formTitle.textContent = "Sign Up";
    });

    // Switch to Sign In
    toSignIn.addEventListener("click", (e) => {
        e.preventDefault();
        signUpForm.style.display = "none";
        signInForm.style.display = "block";
        formTitle.textContent = "Sign In";
    });
});
