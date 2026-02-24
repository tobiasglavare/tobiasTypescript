const users = [
    { id: 1, name: "Lynx" },
    { id: 2, name: "Tiger"},
    { id: 3, name: "Elephant"}
];

const specificUser = users.find(user => user.id === 1);
console.log(specificUser);


