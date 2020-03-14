const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Write code to use inquirer to gather information about the development team members, and to create objects for each team member (using the correct classes as blueprints!)
let teamName;
const employees = [];
const questions = [
    {   //0
        name: 'teamName',
        message: 'What is the name of the team? '
    },{ //1
        name: 'manager',
        message: 'What is the name of the manager? '
    },{ //2
        name: 'ID',
        message: "What is the employee's ID? "
    },{ //3
        name: 'email',
        message: "What is the employee's email? "
    },{ //4
        name: 'office',
        message: "What is the manager's office number? "
    },{ //5
        name: 'engineer',
        message: "What is the engineer's name? "
    },{ //6
        name: 'github',
        message: "What is the engineer's GitHub? "
    },{ //7
        name: 'intern',
        message: "What is the intern's name? "
    },{ //8
        name: 'school',
        message: "What school does the intern attend? "
    },{ //9
        type: 'confirm',
        name: 'add',
        message: 'Add another employee to the team? '
    },{ //10
        type: 'checkbox',
        name: 'employeeType',
        message: 'What role do you want to add to the team?',
        choices: ['Engineer', 'Intern']
    }
];

const addEmployee = () => {
    inquirer.prompt(questions[9]).then(answers => {
        if(answers.add) {
            inquirer.prompt(questions[10]).then( answers => {
                if(answers.employeeType == "Engineer") {
                    inquirer.prompt([questions[5], questions[2], questions[3], questions[6]]).then( answers => {
                        employees.push(new Engineer(answers.engineer, answers.ID, answers.email, answers.github));
                        addEmployee();
                    });
                } else if(answers.employeeType == "Intern") {
                    inquirer.prompt([questions[7], questions[2], questions[3], questions[8]]).then( answers => {
                        employees.push(new Intern(answers.intern, answers.ID, answers.email, answers.school));
                        addEmployee();
                    });
                } else {
                    console.log(`ERROR: default block w/ ${answers.employeeType}`);
                    addEmployee();
                }
                
            }).catch( err => {
                console.log(err);
            }); 
        } else {
            createHtml();
        }
    });
}

const createHtml = () => {
    let html = render(employees, teamName);
    if(!fs.existsSync(OUTPUT_DIR))
        fs.mkdirSync(OUTPUT_DIR);
    console.log(`${teamName} page created in ${outputPath}`);
    fs.writeFileSync(outputPath, html, 'utf8');
}

inquirer.prompt(questions.slice(0,5)).then(answers => {
    teamName = answers.teamName;
    employees.push(new Manager(answers.manager, answers.ID, answers.email, answers.office));
    
    addEmployee();
}).catch(err => {
    console.log(err);
});

// After the user has input all employees desired, call the 'render' function (required above) and pass in an array containing all employee objects; the 'render' function will generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML returned from the 'render' function. Now write it to a file named 'team.html' in the 'output' folder. You can use the variable 'outputPath' above target this location.
// HINT: you may need to check if the 'output' folder exists and create it if it does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different information; write your code to ask different questions via inquirer depending on employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer, and Intern classes should all extend from a class named Employee; see the directions for further information. Be sure to test out each class and verify it generates an objects with the correct structure and methods. This structure will be crucial in order for the provided 'render' function to work!