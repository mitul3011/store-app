const signupForm = document.querySelector('form');
const errMsg = document.querySelector('#errorMsg');
const submitBtn = document.querySelector('#submit');

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#inputName').value;
    const email = document.querySelector('#inputEmail').value;
    const age = document.querySelector('#inputAge').value;
    const password = document.querySelector('#inputPassword').value;

    submitBtn.innerHTML = 'Loading...';

    if(password.length <= 7){
        errMsg.innerHTML = 'Password must contain more than 8 characters.';
        submitBtn.innerHTML = 'Sign Up';
        return;
    }
    
    const passwordOk = checkPassword(password);

    if(passwordOk !== ''){
        errMsg.innerHTML = passwordOk;
        submitBtn.innerHTML = 'Sign Up';
    }else{
        const formData = JSON.stringify({
            name,
            email,
            age,
            password
        });

        fetch('/api/user/signup', {
            method: 'POST',
            body: formData,
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then((response) => {
            if(response.status === 400){
                    errMsg.innerHTML = 'Email is already registered!';
                    submitBtn.innerHTML = 'Sign Up';
            }else if(response.status === 201){
                window.location = "/home";
            }
        });
    }
});

const checkPassword = (password) => {

    let errorMessage = '';
    const upperCase = new RegExp("(?=.*[A-Z])");
    const number = new RegExp("(?=.*[0-9])");
    const specialChar = new RegExp("(?=.*[!@#$%^&*])");

    if(password.toLowerCase().includes('password')){
        errorMessage += ' Password cannot contain "password".';
    }

    if(!upperCase.test(password)){
        errorMessage += ' Password must contain atleast 1 upper case character.'
    }

    if(!number.test(password)){
        errorMessage += ' Password must contain atleast 1 numerical character.'
    }

    if(!specialChar.test(password)){
        errorMessage += ' Password must contain atleast 1 special character.'
    }

    return errorMessage;
};