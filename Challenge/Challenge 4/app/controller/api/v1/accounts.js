const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

module.exports = {
    async create(req, res) {
        try {
            const newBankAccount = await prisma.bankAccounts.create({
                data: {
                    ...req.body,
                    userId: parseInt(req.body.userId, 10)
                }
            });
    
            res.status(201).json({
                status: 'success',
                code: 201,
                message: 'Akun Bank berhasil dibuat!',
                data: newBankAccount
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },

    async get(req, res) {
        try {
            const bankAccounts = await prisma.bankAccounts.findMany();
    
            if (!bankAccounts.length) {
                return res.status(200).json({
                    status: 'success',
                    code: 200,
                    message: 'Data kosong',
                });
            }

            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Berhasil mendapatkan semua data akun!',
                data: bankAccounts
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },

    async getById(req, res) {
        try {
            const bankAccountId = parseInt(req.params.id, 10);
    
            if (!bankAccountId) {
                return res.status(400).json({
                    status: 'fail',
                    code: 400,
                    message: 'Permintaan tidak valid! ID tidak valid',
                });
            }
    
            const bankAccount = await prisma.bankAccounts.findUnique({
                where: {
                    id: bankAccountId
                },
                include: {
                    user: true, 
                    sentTransactions: true,
                    receivedTransactions: true,
                }
            });
    
            if (!bankAccount) {
                return res.status(404).json({
                    status: 'fail',
                    code: 404,
                    message: 'Akun Bank tidak ditemukan!',
                });
            }
    
            return res.status(200).json({
                status: 'success',
                code: 200,
                message: 'Berhasil mendapatkan data akun!',
                data: bankAccount
            });
        } catch (err) {
            res.status(500).json({
                status: 'error',
                code: 500,
                message: err.message,
            });
        }
    },
}
