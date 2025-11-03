// Arquivo: __tests__/integration/auth.test.js

// Importa o Supertest para fazer requisições HTTP
const request = require('supertest');

// Importa a instância do Express (app) e do Sequelize (sequelize)
// O server.js deve exportar ambos: module.exports = { app, sequelize };
const { app, sequelize } = require('../../server'); 

describe('Fluxo Completo de Autenticação e Perfil (Rotas)', () => {
    
    // Variáveis para salvar dados entre os testes
    let authToken = '';
    const initialUser = { 
        email: 'jest.user@jest.com', 
        password: 'senhaSegura123' 
    };

    // --- Hooks do Jest ---

    // Executado antes de TODOS os testes: Garante um estado limpo no banco de dados
    beforeAll(async () => {
        // Usa o 'force: true' para limpar e recriar as tabelas
        // Isso é seguro, pois não estamos usando o banco de produção.
        try {
            await sequelize.sync({ force: true });
        } catch (error) {
            // Em caso de erro na conexão, interrompe a execução dos testes
            console.error('Falha ao sincronizar o banco de dados:', error.message);
            process.exit(1);
        }
    });

    // Executado após TODOS os testes: Fecha a conexão para liberar o Jest
    afterAll(async () => {
        await sequelize.close();
    });

    // --- Testes de Registro (POST /auth/register) ---

    it('1. deve registrar um novo usuário com sucesso (Status 201)', async () => {
        const response = await request(app)
            .post('/auth/register') 
            .send(initialUser);
        
        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.email).toBe(initialUser.email);
    });

    it('2. deve rejeitar o registro com email duplicado', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send(initialUser);

        // O seu controller deve retornar 400 ou 409 para conflito
        expect(response.statusCode).toBe(400); 
        expect(response.body.error).toContain('Email já está em uso'); // Ajuste a mensagem de erro conforme seu AuthService
    });

    it('3. deve rejeitar o registro com dados inválidos (email ou password ausente)', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({ password: 'apenas_senha' }); // Faltando o email
        
        expect(response.statusCode).toBe(400);
        expect(response.body.errors).toBeInstanceOf(Array);
        expect(response.body.errors[0]).toContain('email');
    });

    // --- Testes de Login (POST /auth/login) ---

    it('4. deve autenticar o usuário e retornar um JWT (Status 200)', async () => {
        const response = await request(app)
            .post('/auth/login') 
            .send(initialUser);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        authToken = response.body.token; // SALVA O TOKEN para os próximos testes
    });

    it('5. deve rejeitar o login com senha incorreta (Status 401)', async () => {
        const response = await request(app)
            .post('/auth/login') 
            .send({ email: initialUser.email, password: 'senha_errada' });

        expect(response.statusCode).toBe(401);
        expect(response.body.error).toContain('Credenciais inválidas');
    });

    // --- Testes de Acesso Protegido (GET /auth/me) ---

    it('6. deve acessar a rota /auth/me com o token válido (Status 200)', async () => {
        const response = await request(app)
            .get('/auth/me') 
            .set('Authorization', `Bearer ${authToken}`); // Configura o Header
        
        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(initialUser.email);
        expect(response.body).toHaveProperty('id', 1); // ID do primeiro usuário
    });

    it('7. deve retornar 401 ao tentar acessar /auth/me sem token', async () => {
        const response = await request(app)
            .get('/auth/me'); // Não envia o token
        
        expect(response.statusCode).toBe(401); 
        expect(response.body.error).toContain('Token não fornecido');
    });

    it('8. deve retornar 401 ao tentar acessar /auth/me com token inválido', async () => {
        const response = await request(app)
            .get('/auth/me') 
            .set('Authorization', `Bearer token.invalido.1234`); // Token malformado
        
        expect(response.statusCode).toBe(401); 
    });

    // --- Testes de Atualização de Perfil (PUT /auth/me) ---

    it('9. deve permitir que o usuário atualize seu email e retornar 200', async () => {
        const newEmail = 'profile.update@jest.com';
        
        const response = await request(app)
            .put('/auth/me') 
            .set('Authorization', `Bearer ${authToken}`)
            .send({ email: newEmail });

        expect(response.statusCode).toBe(200);
        expect(response.body.email).toBe(newEmail);
    });

    it('10. deve retornar 401 se tentar atualizar o perfil sem token', async () => {
        const response = await request(app)
            .put('/auth/me') 
            .send({ email: 'tentativa@hack.com' });

        expect(response.statusCode).toBe(401);
    });
});