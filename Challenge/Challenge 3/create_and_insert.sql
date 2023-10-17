-- Drop table if exist
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS accounts CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

CREATE TABLE customers (
    id_customer SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,  -- Changed 'Name' to 'name'
    email VARCHAR(255) UNIQUE NOT NULL,
    address VARCHAR(255) NOT NULL,    
    phone_number VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE accounts (
    id_account SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id_customer),  -- Changed 'id_customer' to 'customer_id'
    account_type VARCHAR(255) NOT NULL,
    debit_card_number VARCHAR(255) UNIQUE NOT NULL,
    saldo DECIMAL(15, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE transactions (
    id_transaction SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL REFERENCES accounts(id_account),  -- Changed 'account_id' to 'id_account'
    transaction_date DATE NOT NULL,
    description TEXT,
    amount DECIMAL(15, 2) NOT NULL
);

INSERT INTO customers (name, address, email, phone_number)
VALUES 
    ('Sarah Johnson', '789 Elm St, Springfield', 'sarah.j@example.com', '5551234567'),
    ('David Lee', '456 Oak St, Lakeside', 'david.lee@example.com', '7779876543'),
    ('Megan Davis', '123 Birch St, Riverside', 'megan.d@example.com', '3338765432'),
    ('Kevin Smith', '101 Cedar St, Mountainview', 'kevin.smith@example.com', '2223456789'),
    ('Laura White', '202 Pine St, Beachside', 'laura.white@example.com', '8882345670');

INSERT INTO accounts (customer_id, account_type, debit_card_number)
VALUES 
    (1, 'Savings', '1234-5678-1234-5678'),
    (2, 'Checking', '5678-1234-5678-1234'),
    (3, 'Savings', '2345-6789-2345-6789'),
    (4, 'Checking', '6789-2345-6789-2345'),
    (5, 'Savings', '3456-7890-3456-7890');

INSERT INTO transactions (account_id, transaction_date, amount, description)
VALUES 
    (1, '2023-10-01', 25000.00, 'Deposit'),
    (1, '2023-10-02', -15000.00, 'Withdrawal'),
    (2, '2023-10-01', 35000.00, 'Deposit'),
    (2, '2023-10-03', -20000.00, 'Withdrawal'),
    (3, '2023-10-04', 15000.00, 'Deposit'),
    (4, '2023-10-05', 20000.00, 'Deposit'),
    (5, '2023-10-06', -10000.00, 'Withdrawal');


UPDATE customers
SET email = 'new.email@example.com'
WHERE name = 'David Lee';


UPDATE accounts
SET debit_card_number = '9999-8888-7777-6666'
WHERE account_id = 3;


UPDATE transactions
SET amount = 500.00
WHERE id_transaction = 5;


DELETE FROM customers
WHERE name = 'Megan Davis';


DELETE FROM accounts
WHERE customer_id = 2;


DELETE FROM transactions
WHERE description = 'Deposit' AND account_id = 4;

SELECT * FROM customers;
SELECT * FROM accounts;
SELECT * FROM transactions;