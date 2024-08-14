import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColumnConfig } from '../../utils/column-config';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss'],
})
export class BaseTableComponent implements OnInit {
  @Input() data: any[] = [];
  @Input() columns: ColumnConfig[] = [];
  @Input() showPdfButton: boolean = false;
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() generatePdf = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onUpdate(item: any) {
    this.update.emit(item);
  }

  onDelete(item: any) {
    this.delete.emit(item);
  }

  onGeneratePdf(item: any) {
    this.generatePdf.emit(item);
  }
}
