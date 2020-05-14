import React, { Component } from "react";
import employees from "../utils/employees.json";

class EmployeeDirectory extends Component {
  state = {
    // stored in utils\employees.json file created with https://randomuser.me/api/
    employees
  };

  componentDidMount(){
    console.log(this.state.employees);
  };


  render() {
    return (
      <ul>
        {this.state.employees.map((e,index)=> (
          <li key={index}><img src={e.employee.picture.thumbnail}></img>{index} {e.employee.gender==="female"?"f":"m"} {e.employee.name.first} {e.employee.name.last}</li>
        ))}
      </ul>
    );
  };
};

export default EmployeeDirectory;