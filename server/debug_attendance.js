import pool from './config/db.js';

async function checkAttendance() {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Checking attendance for date: ${today} (UTC)`);
    
    const [rows] = await pool.execute('SELECT * FROM attendance WHERE date = ?', [today]);
    console.log('Records found:', rows);
    
    // Also check with local date just in case
    const localDate = new Date().toLocaleDateString('en-CA');
    if (localDate !== today) {
        console.log(`Checking attendance for local date: ${localDate}`);
        const [localRows] = await pool.execute('SELECT * FROM attendance WHERE date = ?', [localDate]);
        console.log('Records found (Local):', localRows);
    }

  } catch (error) {
    console.error(error);
  } finally {
      process.exit();
  }
}

checkAttendance();