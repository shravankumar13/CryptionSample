import { Component, OnInit } from '@angular/core';
import { Employee } from './employee.model';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { CryptService } from '../crypt.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees$!: Observable<Employee[]>; // Observable for async data
  employeeForm: FormGroup;
  editingEmployee: Employee | null = null;
  dataSource = new MatTableDataSource<Employee>(); // Use MatTableDataSource for the table
  displayedColumns: string[] = ['name', 'department', 'actions'];
  readonly apiUrl = 'http://localhost:8080/employees'; // Adjust as needed

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cryptService:CryptService,
  ) {
    this.employeeForm = this.fb.group({
      name: [''],
      department: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.http.get(this.apiUrl, { responseType: 'text' }).subscribe(data => {
      const details: Employee[] =JSON.parse(this.cryptService.decrypt(data))
      console.log(details);
      this.dataSource.data = details;  // Set data for MatTableDataSource
    });
  }

  saveEmployee(): void {
    if (this.editingEmployee) {
      this.http.put(`${this.apiUrl}/${this.editingEmployee.id}`, this.cryptService.encrypt(JSON.stringify(this.employeeForm.value)),{responseType: 'text'})
        .subscribe(() => {
          this.loadEmployees();
          this.resetForm();
        });
    } else {
      this.http.post(this.apiUrl, this.cryptService.encrypt(JSON.stringify(this.employeeForm.value)),{responseType: 'text'})
        .subscribe(() => {
          this.loadEmployees();
          this.resetForm();
        });
    }
  }

  editEmployee(employee: Employee): void {
    this.editingEmployee = employee;
    this.employeeForm.patchValue(employee);
  }

  deleteEmployee(id: number): void {
    this.http.delete(`${this.apiUrl}/${id}`)
      .subscribe(() => {
        this.loadEmployees();
      });
  }

  resetForm(): void {
    this.employeeForm.reset();
    this.editingEmployee = null;
  }
}