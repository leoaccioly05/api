const express = require('express');
const app = express();
const port = 3000;

// Middleware para interpretar JSON no corpo da requisição
app.use(express.json());

// Banco de dados (array em memória)
let users = Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `User${index + 1}`,
    email: `user${index + 1}@example.com`,
}));

// Alguns dados gerados:
console.log(users.slice(0, 5));

// Rota POST: cria um novo usuário
app.post('/users', (req, res) => {
    const { id, name, email } = req.body;

    // Verificação simples de dados enviados
    if (!id || !name || !email) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
    }

    // Adiciona o novo usuário à lista
    users.push({ id, name, email });
    res.status(201).json({ message: 'Usuário criado com sucesso!', user: { id, name, email } });
});

// Rota GET (sem parâmetros): retorna todos os usuários
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// Rota GET (com parâmetros): retorna usuário pelo ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;

    // Busca o usuário pelo ID
    const user = users.find((u) => u.id === parseInt(id));
    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    res.status(200).json(user);
});

// Rota PUT: atualiza um usuário pelo ID
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    // Busca o usuário pelo ID
    const userIndex = users.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Atualiza os dados do usuário
    users[userIndex] = { ...users[userIndex], name, email };
    res.status(200).json({ message: 'Usuário atualizado com sucesso!', user: users[userIndex] });
});

// Rota DELETE: remove um usuário pelo ID
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    // Busca e remove o usuário pelo ID
    const userIndex = users.findIndex((u) => u.id === parseInt(id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    // Remove o usuário
    const removedUser = users.splice(userIndex, 1);
    res.status(200).json({ message: 'Usuário removido com sucesso!', user: removedUser[0] });
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`API rodando em http://localhost:${port}`);
});