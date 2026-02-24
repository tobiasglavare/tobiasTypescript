interface User {
    name: string;
    age?: number;
    id: string;
}

function createUser(name: string, age?: number): User {
    return { id: "001", name, age };
}