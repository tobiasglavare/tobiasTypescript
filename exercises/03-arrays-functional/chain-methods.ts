const products = [
    {name: "sushi rice", price: 3.99, inStock: true},
    {name: "noori", price: 2.99, inStock: false},
    {name: "miso soup", price: 5.99, inStock: true},
    {name: "tunafish", price: 50.99, inStock: true}
];

const lessThanFiftyInStock = products.filter(a => a.inStock && a.price < 50).map(p => p.name);
console.log(lessThanFiftyInStock);
