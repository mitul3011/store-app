// All Button
const logOutBtn = document.querySelector('#logOut');
const logOutAllBtn = document.querySelector('#logOutAll');
const deleteButton = document.querySelector('#deleteProfile');

// URL of Store Backend
const url = '/api/product/products';

// Product List
const productList = document.querySelector('#productList');

// Check List
const checkList = document.querySelector('#checkList');

// Filter Button
const filterBtn = document.querySelector('#filterBtn');

// Modal Close Button
const closeBtn = document.querySelector('#closeBtn');

filterBtn.addEventListener('click', () => {
    let reqUrl = '';

    // Radio Elements
    const radioElements = document.getElementsByName('customRadio');

    for (let i = 0; i < radioElements.length; i++) {
        if(radioElements[i].checked)
            reqUrl += 'rating=' + radioElements[i].value;
    }

    // CheckBox Elements
    const checkElements = document.getElementsByName('category');
    
    for (let i = 0; i < checkElements.length; i++) {
        if(checkElements[i].checked){
            reqUrl += '&category=' + checkElements[i].value;
        }
    }

    // Price Range Inputs
    const minPrice = document.querySelector('#minPrice').value;
    const maxPrice = document.querySelector('#maxPrice').value;

    if(minPrice !== ''){
        reqUrl += '&minPrice=' + minPrice;
    }

    if(maxPrice !== ''){
        reqUrl += '&maxPrice=' + maxPrice;
    }

    fetch(url + '/false?' + reqUrl, {
        method: 'GET'
    }).then((response) => {
        if(response.ok){
            response.json().then((data) => {
                renderProducts(data);
                closeBtn.click();
            });
        }else
            window.location.reload();
    });
});

// Function for rendering products for different lists
const renderProducts = (products) => {
    let output = '';
    products.forEach(product => {
        output += `
            <div class="col-sm-6 col-md-4 col-lg-3 my-3">
                <div class="card">
                    <img class="card-img-top" src="data:image/png;base64, ${product.image}" alt="Card image cap">
                    <div class="card-body justify-content-center">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">Category: ${product.category}</p>
                        <p class="card-text">Price: &#8377;${product.price}</p>
                        <p class="card-text">Rating: ${product.rating}</p>
                    </div>
                </div>
            </div>
            `;
    });
    productList.innerHTML = output;
};

const renderCategories = (categories) => {
    let output = '';
    categories.forEach(category => {
        output += `
            <div class="custom-control custom-checkbox">
                <input class="custom-control-input" name="category" type="checkbox" value="${category}" id="${category}Check">
                <label class="custom-control-label" for="${category}Check">
                    ${category}
                </label>
            </div>
            `;
    });
    checkList.innerHTML = output;
};

// function for fetching Products from Backend
const getProducts = () => {
    fetch(url + '/false', {
        method: 'GET'
    }).then((response) => {
        if(response.ok){
            response.json().then((data) => {
                renderProducts(data);
            });
        }else
            window.location.reload();
    });
};

getProducts();

const getCategories = () => {
    fetch(url + '/true', {
        method: 'GET'
    }).then((response) => {
        if(response.ok){
            response.json().then((data) => {
                renderCategories(data);
            });
        }
    });
};

getCategories();

// Logout function
logOutBtn.addEventListener('click', () => {
    document.querySelector('#commonSpinner').removeAttribute('hidden');
    fetch('/api/user/logout', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/login';
        else{
            window.location.reload();
        }
    });
});

// Logout from All Devices function
logOutAllBtn.addEventListener('click', () => {
    document.querySelector('#commonSpinner').removeAttribute('hidden');
    fetch('/api/user/logoutall', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/login';
        else{
            window.location.reload();
        }
    });
});

// Delete Profile function
deleteButton.addEventListener('click', () => {
    document.querySelector('#commonSpinner').removeAttribute('hidden');
    fetch('/api/user/deletePro', {
        method: 'DELETE'
    }).then((response) => {
        if(response.status === 200)
            // window.location = '/success?task=Deleted';
            window.location = '/login';
        else{
            window.location.reload();
        }
    });
});