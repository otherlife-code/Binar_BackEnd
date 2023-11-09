const request = require('supertest');
const app = require('../index');
const prisma = require('../app/prismaClient');

describe("Transactions API", () => {
    describe("GET /v1/transactions", () => {
        it("should return a list of transactions", async () => {
            const response = await request(app).get('/v1/transactions');

            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                status: 'success',
                code: 200,
                message: 'Getting all transactions data successfully!',
                data: expect.any(Array),
            });
        });

        it("should return an empty list when no transactions found", async () => {
            const mock = jest.spyOn(prisma.transactions, 'findMany').mockResolvedValueOnce([]);

            const response = await request(app).get('/v1/transactions');

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

    describe("GET /v1/transactions/:id", () => {
        it("should return a specific transaction by id", async () => {
            const transactionId = 1;
            const dummyTransaction = {
                id: transactionId,
                source_account_id: 2,
                destination_account_id: 3,
                amount: 100.00,
            };

            const mock = jest.spyOn(prisma.transactions, 'findUnique').mockResolvedValueOnce(dummyTransaction);

            const response = await request(app).get(`/v1/transactions/${transactionId}`);
            expect(response.statusCode).toBe(200);
            expect(response.body).toMatchObject({
                status: 'success',
                code: 200,
                message: 'Getting transaction data successfully!',
                data: dummyTransaction,
            });

            mock.mockRestore();
        });

        it("should return 400 when transactionId is not a number", async () => {
            const response = await request(app).get(`/v1/transactions/abc`);
            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                status: 'fail',
                code: 400,
                message: "Bad Request! Id is not valid",
            });
        });

        it("should return 404 when transactionId not found", async () => {
            const transactionId = 9000;
            const mock = jest.spyOn(prisma.transactions, 'findUnique').mockResolvedValueOnce(null);

            const response = await request(app).get(`/v1/transactions/${transactionId}`);
            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                status: 'fail',
                code: 404,
                message: "Transaction not found",
            });

            mock.mockRestore();
        });
    });

    describe('POST /v1/transactions', () => {
        it('should create a new transaction with valid data', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 2,
                amount: 100,
            };

            jest.spyOn(prisma.bankAccounts, 'findUnique')
                .mockResolvedValueOnce({ id: 1, balance: 500 })
                .mockResolvedValueOnce({ id: 2, balance: 200 });

            jest.spyOn(prisma.transactions, 'create').mockResolvedValueOnce({
                ...transactionData,
                id: 3,
            });

            jest.spyOn(prisma, '$transaction').mockImplementation(async (actions) => {
                return actions.map(action => {
                    if (typeof action === 'function') {
                        return Promise.resolve({ id: action.where.id, balance: action.data.balance });
                    }

                    return Promise.resolve({ ...transactionData, id: 3 });
                });
            });

            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(201);
            expect(response.body).toMatchObject({
                status: 'success',
                code: 201,
                message: 'Transaction completed successfully!',
            });
        });

        it('should not allow transaction between the same account', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 1,
                amount: 100,
            };

            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                status: 'error',
                code: 400,
                message: 'A transaction cannot occur between the same account.',
            });
        });

        it('should not allow transaction with amount less than or equal to zero', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 2,
                amount: 0,
            };

            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                status: 'fail',
                code: 400,
                message: 'Transaction amount should be greater than zero.',
            });
        });

        it('should return 404 if source or destination account does not exist', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 3,
                amount: 100,
            };

            jest.spyOn(prisma.bankAccounts, 'findUnique')
                .mockResolvedValueOnce({ id: 1, balance: 500 })
                .mockResolvedValueOnce(null);

            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                status: 'fail',
                code: 404,
                message: 'Source or destination account not found.',
            });
        });

        it('should not allow transaction if source account has insufficient funds', async () => {
            const transactionData = {
                source_account_id: 1,
                destination_account_id: 2,
                amount: 600,
            };

            jest.spyOn(prisma.bankAccounts, 'findUnique')
                .mockResolvedValueOnce({ id: 1, balance: 500 })
                .mockResolvedValueOnce({ id: 2, balance: 200 });

            const response = await request(app)
                .post('/v1/transactions')
                .send(transactionData);

            expect(response.statusCode).toBe(400);
            expect(response.body).toMatchObject({
                status: 'fail',
                code: 400,
                message: 'Insufficient funds in source account.',
            });
        });
    });
});
