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

const viewEmployees = function () {
    let query = `select employee.id, employee.last_name, employee.first_name, role.title, department.name as department, role.salary
     from employee
     left join role on employee.role_id = role.id
     left join department on role.department_id = department.id;`;

    connection.query(query, function(err, res) {
        if (err) throw err;

        console.table(res);
        
        menu();
    });
};

const addEmployee = function () {
    inquirer.prompt([questions[1], questions[2]]).then(res => {
        connection.query(`insert into employee (first_name, last_name) values (?, ?)`, [res.firstName, res.lastName], (err,result) => {
            if (err) throw err;
            viewEmployees();
        })
    });
};

const removeEmployee = function(employee) {
    if(employee)
        connection.query(`delete from employee where id=?`,[employee.id], (err, res) => {
            if (err) throw err;
            
            viewEmployees();
        });
};

const selectEmployee = function (callback) {
    connection.query("select id, first_name, last_name from employee;", (err,res) => {
        if (err) throw err;

        if(res.length==0) {
            callback(false);
            return;
        }

        questions[3].choices=[];
        res.forEach(emp => {
            questions[3].choices.push(`${emp.id}. ${emp.last_name}, ${emp.first_name}`);
        });
        
        inquirer.prompt(questions[3]).then(res => {
            let empID=res.employee.split('.')[0];
            let name=res.employee.split('. ')[1].split(', ');
            callback({id: empID, first_name: name[1], last_name: name[0]});
        });
    });
};

const viewRoles = function() {
    connection.query("select * from role", (err,res) => {
        if (err) throw err;

        if (res.length == 0)
            console.log('There are no roles yet');
        console.table(res);
        menu();
    })
};

const addRole = function(department) {
    inquirer.prompt([questions[4], questions[5]]).then(res => {
        let query = 'insert into role (title, salary, department_id) values (?,?,null);';

        if (department)
            query=query.replace('null',`'${department.id}'`);
            
        connection.query(query, [res.title,res.salary], (err, res) => {
            if (err) throw err;

            viewRoles();
        });
    });

};

const selectDepartment = function (callback) {
    connection.query("select * from department;", (err,res) => {
        if (err) throw err;

        if(res.length==0) {
            callback(false);
            return;
        }

        questions[6].choices=[];
        res.forEach(dept => {
            questions[6].choices.push(`${dept.id}. ${dept.name}`);
        });
        
        inquirer.prompt(questions[6]).then(res => {
            let dept=res.department.split('. ');
            callback({id: dept[0], name: dept[1]});
        });
    });
};

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
    // 3: selectEmployee
        type: 'list',
        name: 'employee',
        message: `Which employee?`,
        choices: []
    }, {
    // 4: addRole - title
        name: 'title',
        message: `What is the title? `
    }, {
    // 5: addRole - salary
        type: 'number',
        name: 'salary',
        message: `What is the salary? `
    }, {
    // 6: selectDepartment - department
        type: 'list',
        name: 'department',
        message: 'Which department?',
        choices: []
    }
    ];


const menu = function () {
    inquirer.prompt(questions[0]).then(res => {
      switch(res.action) {
        case 'View All Employees':
            viewEmployees();
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
            selectEmployee(removeEmployee);
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
            selectDepartment(addRole);
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