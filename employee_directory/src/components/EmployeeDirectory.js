import React, { useState, useEffect } from "react";
import employees from "../utils/employees.json";

function EmployeeDirectory() {
  const [data, setData] = useState(employees);
  const [sortType, setSortType] = useState('first');
  const [filterType, setFilterType] = useState('');

  return (
    <div>
      <select onChange={(e) => setSortType(e.target.value)}>
        <option value="first">First Name</option>
        <option value="last">Last Name</option>
      </select>
      <select onChange={(e) => setFilterType(e.target.value)}>
        <option value="">filter...</option>
        <option value="female">Female</option>
        <option value="male">Male</option>
      </select>
      <ul>
        {data.sort((a, b) => b.employee[sortType] > a.employee[sortType] ? -1 : 1).filter(({employee}) => !filterType || employee.gender.toLowerCase()===filterType.toLowerCase()).map((e, index) => (
          <li key={index}><img src={e.employee.picture.thumbnail} alt={`${e.employee.first} ${e.employee.last}`} />{index} {e.employee.gender === "female" ? "f" : "m"} {e.employee.first} {e.employee.last}</li>
        ))}
      </ul>
    </div>
  );
};

export default EmployeeDirectory;