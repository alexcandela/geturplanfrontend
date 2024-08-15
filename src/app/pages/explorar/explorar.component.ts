import {
  Component,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  WritableSignal,
  effect,
  signal,
} from '@angular/core';
import { AllPlansResponse, Plan } from '../../core/interfaces/plan';
import { Title } from '@angular/platform-browser';
import { PlanService } from '../../core/services/plan.service';
import { NotificationService } from '../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { PlanComponent } from '../../components/plan/plan.component';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';
import { CategoryService } from '../../core/services/category.service';
import { Category, CategoryResponse } from '../../core/interfaces/category';
import { SkeletonPlanComponent } from '../../components/skeleton-plan/skeleton-plan.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { BuscadorService } from '../../core/services/buscador.service';
import { Filtro } from '../../core/interfaces/filtro';
import { provincias } from '../../core/data';

@Component({
  selector: 'app-explorar',
  standalone: true,
  imports: [
    CommonModule,
    PlanComponent,
    ToastComponent,
    SkeletonPlanComponent,
    PaginationComponent,
    FormsModule,
  ],
  templateUrl: './explorar.component.html',
  styleUrl: './explorar.component.scss',
})
export class ExplorarComponent implements OnInit {
  plans: Plan[] = [];
  token: string | null = null;
  categorias: Category[] = [];

  loading = signal(true);
  cant = signal(10);

  currentPage = signal(1);
  plansPerPage = signal(8);
  totalPlans = signal(0);

  textButton: WritableSignal<string> = signal('Mostrar más');

  buscador: WritableSignal<string> = signal('');
  ordenarFecha = signal(false);
  ordenarPopular = signal(false);
  categoriasSeleccionadas: Array<string> = [];
  provinciaSeleccionada: WritableSignal<string> = signal('Cualquiera');
  provincias: Array<string> = provincias;
  filtro: Filtro = {
    value: '',
    categorias: [],
    provincia: '',
    ordenar: false,
  };

  filtrado = signal(false);
  constructor(
    private titulo: Title,
    private service: PlanService,
    private notificationService: NotificationService,
    private categoryService: CategoryService,
    private buscadorService: BuscadorService
  ) {
    titulo.setTitle('Explorar planes');
  }

  mostrarMas = () => {
    if (this.cant() <= 10) {
      this.cant.set(this.categorias.length);
      this.textButton.set('Mostrar menos');
    } else {
      this.cant.set(10);
      this.textButton.set('Mostrar más');
    }
  };

  getCategorias = () => {
    this.categoryService.getCategories().subscribe(
      (response: CategoryResponse) => {
        if (response.status === 'success') {
          this.categorias = response.categories;
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  getPlans = (page: number) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      this.service.getAllPlans(this.token, page).subscribe(
        (response: AllPlansResponse) => {
          if (response.status === 'success') {
            this.plans = response.plans.data;
            this.totalPlans.set(response.plans.total);
            this.loading.set(false);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  onPageChange(page: number): void {
    this.currentPage.set(page);
    if (this.filtrado()) {
      this.filtrar();
    } else {
      this.getPlans(page);
    }
  }

  actualizarSeleccion(categoriaName: string, event: any) {
    if (event.target.checked) {
      if (!this.categoriasSeleccionadas.includes(categoriaName)) {
        this.categoriasSeleccionadas.push(categoriaName);
      }
    } else {
      this.categoriasSeleccionadas = this.categoriasSeleccionadas.filter(
        (name) => name !== categoriaName
      );
    }
  }

  estaSeleccionada(categoriaName: string): boolean {
    return this.categoriasSeleccionadas.includes(categoriaName);
  }

  alternarOrdenar = (tipo: string) => {
    if (tipo === 'fecha') {
      this.ordenarFecha.set(!this.ordenarFecha());
      if (this.ordenarFecha()) {
        this.ordenarPopular.set(false);
      }
    } else if (tipo === 'popular') {
      this.ordenarPopular.set(!this.ordenarPopular());
      if (this.ordenarPopular()) {
        this.ordenarFecha.set(false);
      }
    }
  };

  buildFiltro = () => {
    this.filtro = {
      value: this.buscador(),
      categorias: this.categoriasSeleccionadas,
      provincia: this.provinciaSeleccionada(),
      ordenar: false,
    };

    if (this.ordenarFecha()) {
      this.filtro.ordenar = 'fecha';
    } else if (this.ordenarPopular()) {
      this.filtro.ordenar = 'popular';
    } else {
      this.filtro.ordenar = false;
    }
  };

  filtrar = () => {
    this.filtrado.set(true);
    this.buildFiltro();
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = localStorage.getItem('jwt');
      this.buscadorService
        .buscar(this.token, this.currentPage(), this.filtro)
        .subscribe(
          (response: AllPlansResponse) => {
            if (response.status === 'success') {
              this.plans = response.plans.data;
              this.totalPlans.set(response.plans.total);
              this.loading.set(false);
            }
          },
          (error) => {
            console.log(error);
          }
        );
    }
  };

  limpiarFiltros = () => {
    this.filtrado.set(false);
    this.buscador.set('');
    this.ordenarFecha.set(false);
    this.ordenarPopular.set(false);
    this.categoriasSeleccionadas.splice(0, this.categoriasSeleccionadas.length);
    this.provinciaSeleccionada.set('Cualquiera');
    this.currentPage.set(1);
    this.getPlans(this.currentPage());
  };

  ngOnInit(): void {
    this.getPlans(this.currentPage());
    this.getCategorias();
  }
}
