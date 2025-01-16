import { membremodel } from './../Model/membremodel';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.css']
})
export class PopupComponent implements OnInit {
  employeeForm: FormGroup;
  editdata: membremodel | null = null;

  constructor(
    private builder: FormBuilder,
    private dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.employeeForm = this.builder.group({
      id: this.builder.control('', [Validators.required, Validators.pattern(/^\d+$/)]), // Ensure ID is a number
      firstName: this.builder.control('', Validators.required),
      lastName: this.builder.control('', Validators.required),
      email: this.builder.control('', [Validators.required, Validators.email]),
      age: this.builder.control('', [Validators.required, Validators.min(0)]),
      salary: this.builder.control('', [Validators.required, Validators.min(0)]),
      dob: this.builder.control('', Validators.required),
      address: this.builder.control('', Validators.required),
      contactNumber: this.builder.control('', Validators.required),
      imageUrl: this.builder.control('') // Optional field
    });
  }

  ngOnInit(): void {
    if (this.data.id !== '' && this.data.id !== null) {
      // Simulate fetching data for editing (frontend-only)
      this.editdata = this.data.employee;

      // Add null check for editdata
      if (this.editdata) {
        this.employeeForm.setValue({
          id: this.editdata.id.toString(),
          firstName: this.editdata.firstName,
          lastName: this.editdata.lastName,
          email: this.editdata.email,
          age: this.editdata.age,
          salary: this.editdata.salary,
          dob: this.editdata.dob,
          address: this.editdata.address,
          contactNumber: this.editdata.contactNumber,
          imageUrl: this.editdata.imageUrl || '' // Set imageUrl if it exists
        });
      }
    }
  }

  SaveEmployee() {
    if (this.employeeForm.valid) {
      const employeeData: membremodel = this.employeeForm.getRawValue();

      // Convert ID to a number
      employeeData.id = +employeeData.id;

      // Emit the employee data back to the parent component
      this.dialogRef.close(employeeData);

      // Show success message
      Swal.fire('Success', 'Employee saved successfully.', 'success');
    }
  }

  closepopup() {
    this.dialogRef.close();
  }
}