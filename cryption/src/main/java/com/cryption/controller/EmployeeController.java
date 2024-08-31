package com.cryption.controller;

import com.cryption.entity.Employee;
import com.cryption.repository.EmployeeRepository;
import com.cryption.util.CryptUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/employees")
@CrossOrigin("*")
public class EmployeeController {

    @Autowired
    private EmployeeRepository employeeRepository;

    ObjectMapper obj=new ObjectMapper();

    @GetMapping
    public String getAllEmployees() throws Exception {
        return CryptUtil.encrypt(obj.writeValueAsString(employeeRepository.findAll()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeRepository.findById(id);
        return employee.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public String createEmployee(@RequestBody String employee) throws Exception {
        employeeRepository.save(obj.readValue(CryptUtil.decrypt(employee), Employee.class));
        return "Inserted Successfully";
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateEmployee(@PathVariable Long id, @RequestBody String employee) throws Exception {
        Optional<Employee> existingEmployee = employeeRepository.findById(id);
        if (existingEmployee.isPresent()) {
            Employee emp=obj.readValue(CryptUtil.decrypt(employee), Employee.class);
            emp.setId(id);
            employeeRepository.save(emp);
            return ResponseEntity.ok("Updated Successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteEmployee(@PathVariable Long id) {
        if (employeeRepository.existsById(id)) {
            employeeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}