/* eslint-disable @typescript-eslint/no-var-requires */
// const path = require('path');

const typeorm = require('typeorm');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const { DataSource } = typeorm;

const entities = ['../dist/modules/**/entities/*.entity.js'];
// TODO: This does not work.
const source = new DataSource({
  type: 'mysql', 
  host: process.env.DB_HOST,
  port: 3306,
  username:  process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities,
});

const SALT_ROUNDS = 12;
const defaultUserMail = 'admin@dunder.com';

async function run() {
  try {
    await source.initialize();
    const defaultDepartmentId = uuidv4();

    await source.query('INSERT INTO roles (id, name) VALUES (1, "admin")');
    await source.query('INSERT INTO roles (id, name) VALUES (2, "managers")');
    await source.query('INSERT INTO roles (id, name) VALUES (3, "employee")');
    await source.query(
      `INSERT INTO department (id, name, description, isActive, created_at, updated_at, managerId) VALUES ("${defaultDepartmentId}", "Managers", "Managers Department", 1, NOW(), NOW(), NULL)`,
    );
    const defaultPass = await bcrypt.hash('admin123456', SALT_ROUNDS);
    await source.query(
      `INSERT INTO employee (id, name, email, password, phone, birthDate, hire_date, position, updated_at, created_at, status, departmentId, roleId)
      VALUES ("${uuidv4()}", "Admin", "${defaultUserMail}", "${defaultPass}", "32999850138", "1999-01-01", NOW(), "SYSTEM Admin", NOW(), NOW(), "Active", "${defaultDepartmentId}", 1)`,
    );
    await source.query(
      'INSERT INTO banks (id, name, code) VALUES (1, "Itaú Unibanco S.A.", 341)',
    );
  } catch (err) {
    console.log('Error inserting values', err.message);
    process.exit(1);
  } finally {
    await source.destroy();
    process.exit();
  }
}

run();
