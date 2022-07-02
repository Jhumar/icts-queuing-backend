const knex = require('../utils/knex.js');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const createSuperAdmin = async () => {
  // Create a super admin for the initial setup of the system
  try {
    // Check if there is already a superadmin account
    const [user] = await knex.select()
      .table('users')
      .where({
        'role': 'SUPERADMIN'
      })

    if (user) {
      throw new Error('There is already a registered superadmin.');
    }

    const hashed_password = bcrypt.hashSync('123456', 12);

    await knex.insert({
      uuid: uuidv4(),
      first_name: 'ADMINISTRATOR',
      employee_id: '0000-0000',
      password: hashed_password,
      role: 'SUPERADMIN',
      status: 'ACTIVE',
    }).into('users');

    console.log('Registered a new superadmin.');
  }
  catch(err) {
    console.log(err);
  }
};

createSuperAdmin();