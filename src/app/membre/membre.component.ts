import { membremodel } from './../Model/membremodel';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../popup/popup.component';
import { ApiService } from '../shared/api.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-membre',
  templateUrl: './membre.component.html',
  styleUrls: ['./membre.component.css']
})
export class MembreComponent implements OnInit {
  constructor(private dialog: MatDialog, private api: ApiService) { }

  @ViewChild(MatPaginator) _paginator!: MatPaginator;
  @ViewChild(MatSort) _sort!: MatSort;

  employeedata: membremodel[] = [];
  finaldata: MatTableDataSource<membremodel> = new MatTableDataSource<membremodel>([]);
  searchTerm: string = '';
  private searchSubject = new Subject<string>();

  // Define all columns
  displayColumns: string[] = ["id", "firstName", "lastName", "email", "age", "salary", "dob", "address", "contactNumber", "imageUrl", "action"];

  // Define filterable columns (exclude the action column)
  filterableColumns: string[] = this.displayColumns.filter(column => column !== 'action');

  // Define visible columns (defaults to all columns)
  visibleColumns: string[] = [...this.displayColumns];

  // Selected column for filtering
  selectedColumn: string = 'all';

  ngOnInit(): void {
    this.LoadEmployees();
    this.setupSearch();
  }

  private setupSearch() {
    this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after the user stops typing
      distinctUntilChanged() // Only trigger if the search term changes
    ).subscribe(() => {
      this.performSearch();
    });
  }

  applySearch() {
    this.searchSubject.next(this.searchTerm);
  }

  private performSearch() {
    const searchValue = this.searchTerm?.toLowerCase().trim() || '';

    if (searchValue === '') {
      this.finaldata.data = this.employeedata;
    } else {
      this.finaldata.data = this.employeedata.filter(employee => {
        // Search across all columns
        return (
          (employee.id?.toString().toLowerCase().includes(searchValue)) ||
          (employee.firstName?.toLowerCase().includes(searchValue)) ||
          (employee.lastName?.toLowerCase().includes(searchValue)) ||
          (employee.email?.toLowerCase().includes(searchValue)) ||
          (employee.age?.toString().toLowerCase().includes(searchValue)) ||
          (employee.salary?.toString().toLowerCase().includes(searchValue)) ||
          (employee.dob?.toLowerCase().includes(searchValue)) ||
          (employee.address?.toLowerCase().includes(searchValue)) ||
          (employee.contactNumber?.toLowerCase().includes(searchValue)) ||
          (employee.imageUrl?.toLowerCase().includes(searchValue))
        );
      });
    }

    // Reset to first page when search results change
    if (this._paginator) {
      this._paginator.firstPage();
    }

    this.finaldata.paginator = this._paginator;
    this.finaldata.sort = this._sort;
  }

  // Apply column filter
  applyColumnFilter() {
    if (this.selectedColumn === 'all') {
      // Show all columns
      this.visibleColumns = [...this.displayColumns];
    } else {
      // Show only the selected column and the action column
      this.visibleColumns = [this.selectedColumn, 'action'];
    }
  }

  Openpopup(id: any) {
    const _popup = this.dialog.open(PopupComponent, {
      width: '500px',
      exitAnimationDuration: '1000ms',
      enterAnimationDuration: '1000ms',
      data: {
        id: id,
        employee: id ? this.employeedata.find(emp => emp.id === id) : null
      }
    });

    _popup.afterClosed().subscribe((result: membremodel) => {
      if (result) {
        if (id) {
          const index = this.employeedata.findIndex(emp => emp.id === id);
          if (index !== -1) {
            this.employeedata[index] = result;
          }
        } else {
          this.employeedata.push(result);
        }

        this.finaldata.data = [...this.employeedata];
        this.finaldata.paginator = this._paginator;
        this.finaldata.sort = this._sort;
      }
    });
  }

  LoadEmployees() {
    this.api.GetAllEmployees().subscribe(response => {
      this.employeedata = response;
      this.finaldata = new MatTableDataSource<membremodel>(this.employeedata);
      this.finaldata.paginator = this._paginator;
      this.finaldata.sort = this._sort;
      this.performSearch();
    });
  }

  RemoveEmployee(id: number) {
    Swal.fire({
      title: 'Remove Employee',
      text: 'Do you want to remove this employee?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.employeedata = this.employeedata.filter(employee => employee.id !== id);
        this.finaldata.data = [...this.employeedata];
        this.finaldata.paginator = this._paginator;
        this.finaldata.sort = this._sort;

        Swal.fire('Removed!', 'Employee has been removed.', 'success');
      }
    });
  }
}