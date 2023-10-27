const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
  const { source_account_id, destination_account_id, amount } = req.body;

  if (source_account_id === destination_account_id) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'Transaksi tidak dapat terjadi antara akun yang sama.',
    });
  }

  if (amount <= 0) {
    return res.status(400).json({
      status: 'fail',
      code: 400,
      message: 'Jumlah transaksi harus lebih besar dari nol.',
    });
  }

  const sourceAccount = await prisma.bankAccounts.findUnique({ where: { id: source_account_id } });
  const destinationAccount = await prisma.bankAccounts.findUnique({ where: { id: destination_account_id } });

  if (!sourceAccount || !destinationAccount) {
    return res.status(404).json({
      status: 'fail',
      code: 404,
      message: 'Akun sumber atau tujuan tidak ditemukan.',
    });
  }

  if (sourceAccount.balance < amount) {
    return res.status(400).json({
      status: 'fail',
      code: 400,
      message: 'Dana tidak mencukupi dalam akun sumber.',
    });
  }

  try {
    await prisma.$transaction([
      prisma.bankAccounts.update({
        where: { id: source_account_id },
        data: { balance: sourceAccount.balance - amount },
      }),
      prisma.bankAccounts.update({
        where: { id: destination_account_id },
        data: { balance: destinationAccount.balance + amount },
      }),
      prisma.transactions.create({
        data: {
          source_account_id,
          destination_account_id,
          amount,
        },
      }),
    ]);

    res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Transaksi berhasil diselesaikan!',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: err.message,
    });
  }
};

const get = async (req, res) => {
  try {
    const transactions = await prisma.transactions.findMany();

    if (!transactions.length) {
      return res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Data kosong',
      });
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Berhasil mendapatkan semua data transaksi!',
      data: transactions,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: err.message,
    });
  }
};

const getById = async (req, res) => {
  try {
    const transactionId = parseInt(req.params.id, 10);

    if (!transactionId || isNaN(transactionId)) {
      return res.status(400).json({
        status: 'fail',
        code: 400,
        message: 'Permintaan tidak valid! Id tidak valid',
      });
    }

    const transaction = await prisma.transactions.findUnique({
      where: {
        id: transactionId,
      },
      include: {
        sourceAccount: {
          select: {
            bank_name: true,
            account_number: true,
          },
        },
        destinationAccount: {
          select: {
            bank_name: true,
            account_number: true,
          },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({
        status: 'fail',
        code: 404,
        message: 'Transaksi tidak ditemukan!',
      });
    }

    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Berhasil mendapatkan data transaksi!',
      data: transaction,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      code: 500,
      message: err.message,
    });
  }
};

module.exports = { create, get, getById };
