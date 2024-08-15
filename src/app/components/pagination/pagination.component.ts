import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 1;
  maxPagesVisible: number = 5;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  get visiblePages(): number[] {
    const pages = [];
    const startPage = Math.max(1, this.currentPage - Math.floor(this.maxPagesVisible / 2));
    const endPage = Math.min(this.totalPages, startPage + this.maxPagesVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
