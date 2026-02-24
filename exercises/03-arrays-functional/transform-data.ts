const itmes = [
    { name: "peach", price: 1.00 },
    { name: "beans", price: 1.99 },
    { name: "grapes", price: 3.99},
    { name: "strawberries", price: 5.29}
]

const productList = itmes
    .map((p) => `${p.name}: $${p.price}`);
    
console.log(productList);