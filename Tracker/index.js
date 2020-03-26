const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    port: 3306,
    database: "employees_db"
});

const viewEmployees = function (callback) {
    let query = `select employee.id, employee.last_name, employee.first_name, role.title, department.name as department, role.salary
     from employee
     left join role on employee.role_id = role.id
     left join department on role.department_id = department.id;`;

    connection.query(query, function(err, res) {
        if (err) throw err;

        console.table(res);
        
        callback();
    });
};

const addEmployee = function () {
    inquirer.prompt([questions[1], questions[2]]).then(res => {
        connection.query(`insert into employee (first_name, last_name) values (?, ?)`, [res.firstName, res.lastName], (err,result) => {
            if (err) throw err;
            viewEmployees(menu);
        })
    });
}

const options = ['View All Employees', 'View All Employees by Dept', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles', 'Add Role', 'Remove Role', 'View All Departments', 'Add Department', 'Remove Department', 'View Department Budget', 'Exit Program'];
const questions = [{
    // 0: Menu
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: options
    }, {
    // 1: addEmployee - firstname
        name: 'firstName',
        message: `What is the employee's first name: `
    }, {
    // 2: addEmployee - lastname
        name: 'lastName',
        message: `What is the employee's last name: `
    }, {
    // 3: 
    }
    ];


const menu = function () {
    inquirer.prompt(questions[0]).then(res => {
      switch(res.action) {
        case 'View All Employees':
            viewEmployees(menu);
            break;
        case 'View All Employees by Dept':
            departmentSelection();
            break;
        case 'View All Employees by Manager':
            managerSelection();
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Remove Employee':
            removeEmployee();
            break;
        case 'Update Employee Role':
            updateEmployeeRole();
            break;
        case 'Update Employee Manager':
            updateEmployeeManager();
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'Add Role':
            addRole();
            break;
        case 'Remove Role':
            removeRole();
            break;
        case 'View All Departments':
            viewDepartments();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Remove Department':
            removeDepartment();
            break;
        case 'View Department Budget':
            viewDepartmentBudget();
            break;
        case 'Exit Program':
        default:
            connection.end();
            break;
      }
    });
};

menu();