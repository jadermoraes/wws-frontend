import { Component, OnInit } from '@angular/core';
// import { TableColumn, TableColumnType } from 'src/app/shared/components/table/table.component';
import { ToastService } from 'src/app/shared/components/toast/toast.service';

@Component({
  selector: 'showcase',
  templateUrl: './showcase.component.html',
  styleUrl: './showcase.component.css'
})
export class ShowcaseComponent implements OnInit {
[x: string]: any;

  constructor(
    private toastService: ToastService
  ){}

  amount1: number = 0;
  amount2: number = 0;
  amount3: number = 0;
  amount4: number = 0;
  amount5: number = 0;
  date: Date = null;
  percentage: number = 1;
  selectedValue1: number;

  // cols: TableColumn[] = [
  //   {
  //     field: 'color',
  //     label: 'color',
  //     type: TableColumnType.COLOR,
  //     width: '5%',
  //   },
  //   {
  //     field: 'string',
  //     label: 'string',
  //     type: TableColumnType.STRING,
  //     width: '15%',
  //   },
  //   {
  //     field: 'double',
  //     label: 'double',
  //     type: TableColumnType.DOUBLE,
  //     decimals: '1.2-2',
  //     width: '10%',
  //   },
  //   {
  //     field: 'integer',
  //     label: 'integer',
  //     type: TableColumnType.INTEGER,
  //     width: '10%',
  //   },
  //   {
  //     field: 'date',
  //     label: 'date',
  //     type: TableColumnType.DATE,
  //     width: '15%',
  //   },
  //   {
  //     field: 'datetime',
  //     label: 'datetime',
  //     type: TableColumnType.DATE_TIME,
  //     width: '15%',
  //   },
  //   {
  //     field: 'percentage',
  //     label: 'percentage',
  //     type: TableColumnType.PERCENTAGE,
  //     width: '10%',
  //   },
  //   {
  //     field: 'boolean',
  //     label: 'boolean',
  //     type: TableColumnType.BOOLEAN,
  //     width: '5%',
  //   },
  //   {
  //     field: 'checkbox',
  //     label: 'checkbox',
  //     type: TableColumnType.CHECKBOX,
  //     width: '5%',
  //   },
  // ];

  rows: any[] = [
    {
      color: '#ff0000',
      string: 'Sample Text',
      double: 123.45,
      integer: 42,
      date: '2024-04-16',
      datetime: '2024-04-16T12:30:00',
      percentage: 0.75,
      boolean: true,
      checkbox: true
    },
    {
      color: '#00ff00',
      string: 'Another Text',
      double: 987.65,
      integer: 99,
      date: '2024-04-17',
      datetime: '2024-04-17T10:45:00',
      percentage: 0.25,
      boolean: false,
      checkbox: false
    },
    {
      color: '#0000ff',
      string: 'More Text',
      double: 456.78,
      integer: 123,
      date: '2024-04-18',
      datetime: '2024-04-18T08:15:00',
      percentage: 0.50,
      boolean: true,
      checkbox: true
    },
    {
      color: '#ff00ff',
      string: 'Lorem Ipsum',
      double: 321.09,
      integer: 88,
      date: '2024-04-19',
      datetime: '2024-04-19T14:20:00',
      percentage: 0.95,
      boolean: false,
      checkbox: false
    },
  ];


  listValues = [
    {
      label: 'Test1',
      value: 0
    },
    {
      label: 'Test2',
      value: 1
    },
    {
      label: 'Test3',
      value: 2
    },
  ];

  files: File[] = [];

  ngOnInit(): void {


  }

  showToast(type, message) {
    switch (type) {
      case 'Success':
        this.toastService.success(message);
        break;
      case 'Warning':
        this.toastService.warning(message);
        break;
      case 'Danger':
        this.toastService.danger(message);
        break;
      default:
        break;
    }
  }

}
