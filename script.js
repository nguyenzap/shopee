document.addEventListener('DOMContentLoaded', () => {
    fetch('https://raw.githubusercontent.com/<your-github-username>/demo-shopping-site/main/api/products.json')
        .then(response => response.json())
        .then(data => {
            const productList = document.getElementById('product-list');
            data.products.forEach(product => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('product');
                productDiv.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Price: $${product.price}</p>
                    <p>${product.description}</p>
                `;
                productList.appendChild(productDiv);
            });
        })
        .catch(err => console.error('Error fetching products:', err));
});
