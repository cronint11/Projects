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

// ---------- Employee Functions ----------
const viewEmployees = function (whereSQL, value) {
    let query = `select employee.id, employee.last_name, employee.first_name, role.title, department.name as department, role.salary
     from employee
     left join role on employee.role_id = role.id
     left join department on role.department_id = department.id
     `;

    // add where clause
    if(value && whereSQL) {
        query += `where ${whereSQL}='${value.id}'
        `;
        // console.log(query);
    }

    query += 'order by employee.id asc;';

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
    if(employee) {
        connection.query(`delete from employee where id=?`,[employee.id], (err, res) => {
            if (err) throw err;
            
            viewEmployees();
        });
    } else {
        console.log("Error no employee selected.");
        viewEmployees();
    }
};

const updateEmployeeRole = function(employee, role) {
    if(employee) {
        if(role) {
            connection.query(`update employee set role_id=? where id=?;`, [role.id, employee.id], (err, res) => {
                if (err) throw err;
    
                console.log(res);
                viewEmployees();
            });
        } else {
            selectRole(updateEmployeeRole, employee);
        }
    } else {
        console.log("Error no employee selected.");
        viewEmployees();
    }
};

const updateEmployeeManager = function(employee, manager) {
    if(employee) {
        if(manager) {
            connection.query(`update employee set manager_id=? where id=?;`, [manager.id, employee.id], (err, res) => {
                if (err) throw err;
    
                console.log(res);
                viewEmployees();
            });
        } else {
            console.log("Who will be the manager?");
            selectEmployee(updateEmployeeManager, employee);
        }
    } else {
        console.log("Error no employee selected.");
        viewEmployees();
    }
};

const selectEmployee = function (callback, passthrough) {
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

            if (passthrough)
                callback(passthrough, {id: empID, first_name: name[1], last_name: name[0]});
            else
                callback({id: empID, first_name: name[1], last_name: name[0]});
        });
    });
};

// ---------- Manager Functions ----------
const selectManager = function (callback, passthrough) {
    connection.query(`select e1.id, e1.first_name, e1.last_name 
          from employee as e1 
          inner join employee as e2 on e1.id=e2.manager_id
          group by e1.id;`, (err,res) => {
        if (err) throw err;

        if(res.length==0) {
            console.log('No managers assigned');
            callback(false);
            return;
        }

        questions[9].choices=[];
        res.forEach(emp => {
            questions[9].choices.push(`${emp.id}. ${emp.last_name}, ${emp.first_name}`);
        });
        
        inquirer.prompt(questions[9]).then(res => {
            let empID=res.manager.split('.')[0];
            let name=res.manager.split('. ')[1].split(', ');

            if (passthrough)
                callback(passthrough, {id: empID, first_name: name[1], last_name: name[0]});
            else
                callback({id: empID, first_name: name[1], last_name: name[0]});
        });
    });
};

// ---------- Role Functions ----------
const viewRoles = function() {
    connection.query(`select role.title, role.salary, department.name as dept
      from role left join department on role.department_id=department.id 
      order by dept, salary desc;`, (err,res) => {
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

const removeRole = function(role) {
    if(role) {
        connection.query(`delete from role where id=?`,[role.id], (err, res) => {
            if (err) throw err;
            
            viewRoles();
        });
    } else {
        console.log("Error no role selected.");
        viewRoles();
    }
};

const selectRole = function(callback, passthrough) {
    connection.query("select * from role;", (err,res) => {
        if (err) throw err;

        if(res.length==0) {
            callback(false);
            return;
        }

        questions[7].choices=[];
        res.forEach(role => {
            questions[7].choices.push(`${role.id}. ${role.title} - $${role.salary} dept_id: ${role.department_id}`);
        });
        
        inquirer.prompt(questions[7]).then(res => {
            let roleID = res.role.split('. ');
            let roleTitle = roleID[1].split(' - $');
            let roleSalary = roleTitle[1].split(' dept_id: ');
            let role = {id: roleID[0], title: roleTitle[0], salary: roleSalary[0], department_id: roleSalary[1]};
            
            if (passthrough)
                callback(passthrough, role);
            else
                callback(role);
        });
    });
};

// ---------- Department Functions ----------
const viewDepartments = function() {
    connection.query("select name as dept from department", (err,res) => {
        if (err) throw err;

        if (res.length == 0)
            console.log('There are no departments yet');
        console.table(res);
        menu();
    })
};

const viewDepartmentBudgets = function () {
    connection.query(`select sum(salary) as budget, department.name as dept
        from employee
        left join role on employee.role_id=role.id
        left join department on role.department_id=department.id
        group by dept;`, (err,res) => {
            if (err) throw err;

            console.table(res);
            menu();
        });
};

const addDepartment = function() {
    inquirer.prompt(questions[8]).then(res => {
        let query = 'insert into department (name) values (?);';

        connection.query(query, [res.name], (err, res) => {
            if (err) throw err;

            viewDepartments();
        });
    });
};

const removeDepartment = function(department) {
    if(department) {
        connection.query(`delete from department where id=?`,[department.id], (err, res) => {
            if (err) throw err;
            
            viewDepartments();
        });
    } else {
        console.log("Error no department selected.");
        viewDepartments();
    }
};

const selectDepartment = function (callback, passthrough) {
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
            
            if (passthrough)
                callback(passthrough, {id: dept[0], name: dept[1]});
            else
                callback({id: dept[0], name: dept[1]});
        });
    });
};

const options = ['View All Employees', 'View All Employees by Dept', 'View All Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Roles', 'Add Role', 'Remove Role', 'View All Departments', 'Add Department', 'Remove Department', 'View Department Budgets', 'Exit Program'];
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
    }, {
    // 7: selectRole - role
        type: 'list',
        name: 'role',
        message: 'Which role?',
        choices: []
    }, {
    // 8: addDepartment - name
        name: 'name',
        message: 'What is the department name? '
    }, {
    // 9: selectManager
        type: 'list',
        name: 'manager',
        message: `Which manager?`,
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
            selectDepartment(viewEmployees, 'role.department_id');
            break;
        case 'View All Employees by Manager':
            selectManager(viewEmployees, 'employee.manager_id');
            break;
        case 'Add Employee':
            addEmployee();
            break;
        case 'Remove Employee':
            selectEmployee(removeEmployee);
            break;
        case 'Update Employee Role':
            selectEmployee(updateEmployeeRole);
            break;
        case 'Update Employee Manager':
            selectEmployee(updateEmployeeManager);
            break;
        case 'View All Roles':
            viewRoles();
            break;
        case 'Add Role':
            selectDepartment(addRole);
            break;
        case 'Remove Role':
            selectRole(removeRole);
            break;
        case 'View All Departments':
            viewDepartments();
            break;
        case 'Add Department':
            addDepartment();
            break;
        case 'Remove Department':
            selectDepartment(removeDepartment);
            break;
        case 'View Department Budgets':
            viewDepartmentBudgets();
            break;
        case 'Exit Program':
        default:
            connection.end();
            break;
      }
    });
};

menu();