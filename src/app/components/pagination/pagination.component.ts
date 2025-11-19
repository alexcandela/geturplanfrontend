import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

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

  constructor() {
    this.updateMaxPagesVisible();
  }

  @HostListener('window:resize')
  onResize() {
    this.updateMaxPagesVisible();
  }

  private updateMaxPagesVisible(): void {
    this.maxPagesVisible = window.innerWidth <= 1024 ? 3 : 5;
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    let startPage = Math.max(1, this.currentPage - Math.floor(this.maxPagesVisible / 2));
    let endPage = Math.min(this.totalPages, startPage + this.maxPagesVisible - 1);

    // Ajustar el inicio si no hay suficientes páginas al final
    if (endPage - startPage < this.maxPagesVisible - 1) {
      startPage = Math.max(1, endPage - this.maxPagesVisible + 1);
    }

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
