const bcrypt = require('bcryptjs');

async function generateHash() {
    const password = '@Jozzam10650'; // Change this to your desired admin password
    const hash = await bcrypt.hash(password, 10);
    console.log('========================================');
    console.log('ADMIN PASSWORD HASH GENERATED');
    console.log('========================================');
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('========================================');
    console.log('Copy this hash into your database insert statement');
    console.log('========================================');
}

generateHash();