const request = require('supertest');
const app = require('../index');
const prisma = require('../app/prismaClient');

describe("Accounts API", () => {
    describe("GET /v1/accounts", () => {
        it("should return a list of accounts", async () => {
            const response = await request(app).get('/v1/accounts');

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                status: 'success',
                code: 200,
                message: 'Getting all accounts data successfully!',
                data: expect.any(Array),
            });
        });

        it("should return an empty list", async () => {
            const mock = jest.spyOn(prisma.bankAccounts, 'findMany').mockResolvedValueOnce([]);

            const response = await request(app).get('/v1/accounts');

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                status: 'success',
                code: 200,
                message: 'Data is empty',
                data: [],
            });

            mock.mockRestore();
        });
    });

    describe("GET /v1/accounts/:id", () => {
        it("should return specific account by id", async () => {
            const accountId = "1";
            const mockAccount = { id: parseInt(accountId, 10) };
            const mock = jest.spyOn(prisma.bankAccounts, 'findUnique').mockResolvedValueOnce(mockAccount);

            const response = await request(app).get(`/v1/accounts/${accountId}`);

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                status: 'success',
                code: 200,
                message: 'Getting account data successfully!',
                data: expect.any(Object),
                data: { id: parseInt(accountId, 10) },
            });

            mock.mockRestore();
        });

        it("should throw error for missing or invalid accountId", async () => {
            const accountId = "d";
            const response = await request(app).get(`/v1/accounts/${accountId}`);

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                status: 'fail',
                code: 400,
                message: "Bad Request! Account ID is not valid",
            });
        });

        it("should throw error if accountId not found", async () => {
            const accountId = "9000";
            const findUniqueSpy = jest.spyOn(prisma.bankAccounts, 'findUnique').mockResolvedValueOnce(null);

            const response = await request(app).get(`/v1/accounts/${accountId}`);

            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                status: 'fail',
                code: 404,
                message: "Bank Account not found!",
            });

            expect(findUniqueSpy).toHaveBeenCalledWith({
                where: { id: parseInt(accountId, 10) },
                include: { user: true, sentTransactions: true, receivedTransactions: true },
            });

            findUniqueSpy.mockRestore();
        });
    });

    describe("POST /v1/accounts", () => {
        it("should create a new account", async () => {
            const newAccount = {
                userId: "2",
                bank_name: "Industrial Bank",
                account_number: "1112233330",
                balance: 20000.50,
            };

            const findUniqueSpy = jest.spyOn(prisma.users, 'findUnique').mockResolvedValue({
                id: parseInt(newAccount.userId, 10),
                name: 'Anderson',
            });

            const createSpy = jest.spyOn(prisma.bankAccounts, 'create').mockResolvedValue({
                ...newAccount,
                id: 1,
                userId: parseInt(newAccount.userId, 10),
            });

            const response = await request(app)
                .post('/v1/accounts')
                .send(newAccount);

            expect(findUniqueSpy).toHaveBeenCalledWith({
                where: { id: parseInt(newAccount.userId, 10) },
            });

            expect(createSpy).toHaveBeenCalledWith({
                data: { ...newAccount, userId: parseInt(newAccount.userId, 10) },
            });

            expect(response.statusCode).toBe(201);
            expect(response.body).toMatchObject({
                status: 'success',
                code: 201,
                message: "Bank Account created successfully!",
                data: { userId: parseInt(newAccount.userId, 10) },
            });

            findUniqueSpy.mockRestore();
            createSpy.mockRestore();
        });

        it("should throw error for missing or invalid userId", async () => {
            const newAccount = {
                userId: "",
                bank_name: "Industrial Bank",
                account_number: "1112233330",
                balance: 20000.50,
            };

            const response = await request(app)
                .post('/v1/accounts')
                .send(newAccount);

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                status: 'fail',
                code: 400,
                message: "Bad Request! User ID is not valid",
            });
        });

        it("should throw error if userId not found", async () => {
            const newAccount = {
                userId: "9000",
                bank_name: "Industrial Bank",
                account_number: "1112233330",
                balance: 20000.50,
            };

            const mock = jest.spyOn(prisma.users, 'findUnique').mockResolvedValueOnce(null);

            const response = await request(app)
                .post('/v1/accounts')
                .send(newAccount);

            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                status: 'fail',
                code: 404,
                message: "User not found!",
            });

            mock.mockRestore();
        });
    });
});

