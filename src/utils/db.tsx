import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'expenses.db' });

interface User {
  id: number;
  email: string;
  password: string;
  role: string;
}

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
}

interface ResultSet {
  rows: {
    length: number;
    item: (index: number) => any;
    raw: () => any[];
  };
}

interface Transaction {
  executeSql: (
    sqlStatement: string,
    args?: any[],
    callback?: (tx: Transaction, resultSet: ResultSet) => void,
    errorCallback?: (error: Error) => void
  ) => void;
}

// Create user table and seed
export const createUserTableAndSeed = (): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, role TEXT)',
      [],
      () => {
        console.log('User table created successfully');
        tx.executeSql(
          'SELECT COUNT(*) as count FROM users',
          [],
          (_, results) => {
            const count = results.rows.item(0).count;
            if (count === 0) {
              tx.executeSql(
                'INSERT INTO users (email, password, role) VALUES (?, ?, ?), (?, ?, ?)',
                ['user@example.com', 'user123', 'User', 'admin@example.com', 'admin123', 'Admin'],
                () => console.log('Default users added successfully'),
                (error) => console.error('Error adding default users', error)
              );
            } else {
              console.log('Users already exist, no need to add default users');
            }
          },
          (error) => console.error('Error checking user count', error)
        );
      },
      (error) => console.error('Error creating user table', error)
    );
  });
};

export const createExpensesTable = (): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, category TEXT, amount REAL, date TEXT)',
      [],
      () => {
        console.log('Expenses table created successfully');
      },
      (error) => {
        console.error('Error creating expenses table', error);
      }
    );
  });
};

export const loginUser = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, password],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0) as User);
          } else {
            reject('Invalid email or password');
          }
        },
        (error) => reject(error)
      );
    });
  });
};


export const insertExpense = (category: string, amount: number, date: string): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'INSERT INTO expenses (category, amount, date) VALUES (?, ?, ?)',
      [category, amount, date],
      () => console.log('Expense added successfully'),
      (error) => console.error('Error adding expense', error)
    );
  });
};

export const getExpenses = (): Promise<Expense[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        'SELECT * FROM expenses ORDER BY date DESC',
        [],
        (_, results) => resolve(results.rows.raw() as Expense[]),
        (error) => reject(error)
      );
    });
  });
};

export const getAllUserExpenses = async (): Promise<Expense[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM expenses',
        [],
        (_, results) => {
          const expenses: Expense[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            expenses.push(results.rows.item(i));
          }
          resolve(expenses);
        },
        (error) => reject(error)
      );
    });
  });
};


// Get expense by ID
export const getExpenseById = (id: number): Promise<Expense | null> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        'SELECT * FROM expenses WHERE id = ?',
        [id],
        (_, results) => {
          if (results.rows.length > 0) {
            resolve(results.rows.item(0) as Expense);
          } else {
            resolve(null); // Return null if no expense found
          }
        },
        (error) => reject(error)
      );
    });
  });
};

// Edit expense
export const updateExpense = (id: number, category: string, amount: number, date: string): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'UPDATE expenses SET category = ?, amount = ?, date = ? WHERE id = ?',
      [category, amount, date, id],
      () => console.log('Expense updated successfully'),
      (error) => console.error('Error updating expense', error)
    );
  });
};

// Delete expense
export const deleteExpense = (id: number): void => {
  db.transaction((tx: Transaction) => {
    tx.executeSql(
      'DELETE FROM expenses WHERE id = ?',
      [id],
      () => console.log('Expense deleted successfully'),
      (error) => console.error('Error deleting expense', error)
    );
  });
};

// Get total spending by date range
export const getTotalSpendingByRange = (startDate: string, endDate: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        'SELECT SUM(amount) as total FROM expenses WHERE date BETWEEN ? AND ?',
        [startDate, endDate],
        (_, results) => {
          const total = results.rows.item(0).total || 0;
          resolve(total);
        },
        (error) => reject(error)
      );
    });
  });
};

// Get total spending per day
export const getTotalSpendingPerDay = (date: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        'SELECT SUM(amount) as total FROM expenses WHERE date = ?',
        [date],
        (_, results) => {
          const total = results.rows.item(0).total || 0;
          resolve(total);
        },
        (error) => reject(error)
      );
    });
  });
};

// Get total spending per year
export const getTotalSpendingPerYear = (year: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        'SELECT SUM(amount) as total FROM expenses WHERE strftime("%Y", date) = ?',
        [year],
        (_, results) => {
          const total = results.rows.item(0).total || 0;
          resolve(total);
        },
        (error) => reject(error)
      );
    });
  });
};

// Get category breakdown
export const getCategoryBreakdown = (selectedCategory: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      let query = 'SELECT category, SUM(amount) as total FROM expenses';
      const params: string[] = [];

      if (selectedCategory) {
        query += ' WHERE category = ?';
        params.push(selectedCategory);
      }

      query += ' GROUP BY category';

      tx.executeSql(
        query,
        params,
        (_, results) => resolve(results.rows.raw()),
        (error) => reject(error)
      );
    });
  });
};

// Get latest expenses with a limit
export const getLatestExpenses = (limit: number = 5): Promise<Expense[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: Transaction) => {
      tx.executeSql(
        'SELECT * FROM expenses ORDER BY date DESC LIMIT ?',
        [limit],
        (_, results) => resolve(results.rows.raw() as Expense[]),
        (error) => reject(error)
      );
    });
  });
};
