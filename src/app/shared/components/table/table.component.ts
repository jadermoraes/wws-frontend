import { Component, ContentChildren, EventEmitter, Input, Output, QueryList, TemplateRef } from '@angular/core';
import { TableHeader } from '../../interfaces/table';

@Component({
    selector: 'wws-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent {
    @Input() data: any[] = []; // Data to display
    @Input() headers: TableHeader[] = []; // Column headers
    @Output() rowClick = new EventEmitter<any>(); // Event for row click
    

    sortedData: any[] = [];
    sortColumn: string | null = null;
    sortDirection: 'asc' | 'desc' = 'asc';
    @ContentChildren(TemplateRef) customTemplates!: QueryList<TemplateRef<any>>;

    ngOnInit(): void {
        this.sortedData = [...this.data]; // Initialize sortedData with input data
    }

    sortData(key: string): void {
        const header = this.headers.find(h => h.key === key);
        if (!header?.sortable) return;
    
        if (this.sortColumn === key) {
          this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
          this.sortColumn = key;
          this.sortDirection = 'asc';
        }
    
        this.sortedData.sort((a, b) => {
          const valueA = a[key];
          const valueB = b[key];
    
          if (header.type === 'number') {
            return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
          } else if (header.type === 'date') {
            return this.sortDirection === 'asc'
              ? new Date(valueA).getTime() - new Date(valueB).getTime()
              : new Date(valueB).getTime() - new Date(valueA).getTime();
          } else {
            return this.sortDirection === 'asc'
              ? String(valueA).localeCompare(String(valueB))
              : String(valueB).localeCompare(String(valueA));
          }
        });
      }

    formatCell(cell: any): string {
        if (this.isDate(cell)) {
        return new Date(cell).toLocaleDateString();
        }
        return cell;
    }

    isNumber(value: any): boolean {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }

    isDate(value: any): boolean {
        return !isNaN(Date.parse(value));
    }

    onRowClick(row: any): void {
        this.rowClick.emit(row);
    }

    getTemplate(row: any, header: any): TemplateRef<any> | null {
      if (header.customTemplates && row[header.key]) {
        return header.customTemplates[row[header.key]] || null;
      }
      return null;
    }
}