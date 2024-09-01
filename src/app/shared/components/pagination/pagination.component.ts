import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent implements OnInit {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() changePage = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
