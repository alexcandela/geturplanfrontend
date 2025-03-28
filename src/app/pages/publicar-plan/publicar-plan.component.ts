import { Component, OnInit, ViewChild, WritableSignal, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provincias, categorias } from '../../core/data';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/authservice.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';
import { PlanForm, PlanFormResponse } from '../../core/interfaces/plan-form';
import { MapComponent } from '../../components/map/map.component';

import {
  exactCategoriesCount,
  imageValidator,
  optionalImagesArrayValidator,
} from '../../core/validadores';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { log } from 'console';
import { PlanService } from '../../core/services/plan.service';
import { NotificationService } from '../../core/services/notification.service';
import { backendurl } from '../../core/environments/backendurl';
import { MapService } from '../../core/services/map.service';
@Component({
  selector: 'app-publicar-plan',
  standalone: true,
  imports: [ReactiveFormsModule, ToastComponent, MapComponent],
  templateUrl: './publicar-plan.component.html',
  styleUrl: './publicar-plan.component.scss',
})
export class PublicarPlanComponent implements OnInit {
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  provincias: Array<string> = provincias;
  categorias: Array<string> = categorias;

  defaultImg: String = `${backendurl.apiUrl}/storage/default/noimage.png`;
  img: WritableSignal<SafeUrl> = signal(this.defaultImg);
  secundarias: SafeUrl[] = [
    `${backendurl.apiUrl}/storage/default/noimage.png`,
    `${backendurl.apiUrl}/storage/default/noimage.png`,
    `${backendurl.apiUrl}/storage/default/noimage.png`,
    `${backendurl.apiUrl}/storage/default/noimage.png`,
  ];

  planForm: FormGroup;
  coordinates: google.maps.LatLngLiteral | null = null;
  exactCoordinates: google.maps.LatLngLiteral | null = null;

  submitted = signal(false);

  selectedCategories: string[] = [];
  selectedImages: File[] = [];

  selectedCategory = signal(false);

  constructor(
    private titulo: Title,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private planService: PlanService,
    private notificationService: NotificationService,
    private mapService: MapService
  ) {
    titulo.setTitle('Publicar plan');
    this.planForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      categories: [[], [Validators.required, exactCategoriesCount(3)]],
      principal_image: [null, [Validators.required, imageValidator()]],
      secondary_images: [[], [optionalImagesArrayValidator()]],
    });
  }

  center: google.maps.LatLngLiteral | null = null;

  checkLogged = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt');
      if (!token || !this.authService.isTokenValid(token)) {
        this.router.navigate(['/login']);
      }
    }
  };
  // Método para obtener las coordenadas a partir de la provincia
  getCoordinates(event: Event) {
    const selectedProvince = (event.target as HTMLSelectElement).value;
    this.mapService.getCoordinatesFromLocation(selectedProvince).subscribe(
      (coords) => {
        this.center = coords;
        this.coordinates = coords;
      },
      (error) => {
        console.error('Error al obtener las coordenadas:', error);
      }
    );
  }

  // Coordenadas exactas seleccionadas por el usuario
  getExactCoordinates(coords: google.maps.LatLngLiteral) {
    this.exactCoordinates = coords;
  }

  addOrDeleteCategory = (value: string) => {
    if (!this.selectedCategories.includes(value)) {
      if (this.selectedCategories.length >= 3) {
        this.notificationService.showNotification(
          'Ya se han seleccionado 3 categorias.',
          'warning'
        );
      } else {
        this.selectedCategories.push(value);
      }
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (el) => el !== value
      );
    }
  };

  isCategorySelected(value: string): boolean {
    return this.selectedCategories.includes(value);
  }

  onFileChangePrincipal(event: Event): void {
    if (this.planForm.get('principal_image')?.value !== null) {
      this.notificationService.showNotification(
        'Ya se ha seleccionado una imagen.',
        'warning'
      );
    } else {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        this.img.set(
          this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file))
        );
        this.planForm.get('principal_image')?.setValue(file);
      }
    }
  }
  deletePrincipal = () => {
    this.planForm.get('principal_image')?.setValue(null);
    this.img.set(this.defaultImg);
  };

  onFileChangeSecundaria(event: Event): void {
    if (this.selectedImages.length >= 4) {
      this.notificationService.showNotification(
        'Ya se ha seleccionado 4 imagenes.',
        'warning'
      );
    } else {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const url = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(file)
        );

        if (this.secundarias.length >= 4) {
          this.secundarias.pop();
        }
        if (this.selectedImages.length >= 4) {
          this.selectedImages.pop();
        }
        this.secundarias.unshift(url);
        this.selectedImages.unshift(file);
      }
    }
  }

  reorderArray() {
    let nonNullIndex = 0;

    // Mover todos los elementos no nulos hacia adelante
    for (let i = 0; i < this.secundarias.length; i++) {
      if (this.secundarias[i] !== this.defaultImg) {
        this.secundarias[nonNullIndex] = this.secundarias[i];
        nonNullIndex++;
      }
    }

    // Rellenar el resto del array con null
    for (let i = nonNullIndex; i < this.secundarias.length; i++) {
      this.secundarias[i] = this.defaultImg;
    }
  }

  deleleteSecundarias = (index: number) => {
    this.secundarias[index] = this.defaultImg;
    this.selectedImages.splice(index, 1);
    this.reorderArray();
  };

  generateFormData = (): FormData => {
    const formData = new FormData();
    formData.append('name', this.planForm.get('name')?.value);
    formData.append('description', this.planForm.get('description')?.value);
    formData.append('province', this.planForm.get('province')?.value);
    formData.append('city', this.planForm.get('city')?.value);
    formData.append('url', this.planForm.get('url')?.value);
    formData.append('categories', this.planForm.get('categories')?.value);
    formData.append(
      'principal_image',
      this.planForm.get('principal_image')?.value
    );

    if (this.exactCoordinates) {
      formData.append('latitude', this.exactCoordinates.lat.toString());
      formData.append('longitude', this.exactCoordinates.lng.toString());
    }

    // Añadir imágenes secundarias de manera individual
    const secondaryImages = this.planForm.get('secondary_images')?.value;
    if (Array.isArray(secondaryImages) && secondaryImages.length > 0) {
      secondaryImages.forEach((file: File, index: number) => {
        formData.append(`secondary_images[${index}]`, file);
      });
    }

    return formData;
  };

  onSubmit = (form: PlanForm) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt');
      if (token) {
        this.planForm.get('categories')?.setValue(this.selectedCategories);
        this.planForm.get('secondary_images')?.setValue(this.selectedImages);
        if (this.planForm.valid) {
          const formData = this.generateFormData();
          this.planService.postPlan(token, formData).subscribe(
            (response: PlanFormResponse) => {
              if (response.status === 'success') {
                this.notificationService.showNotification(
                  'Plan publicado correctamente.',
                  'success'
                );
                this.router.navigate([`/showplan/${response.planId}`]);
              }
            },
            (error) => {
              console.log(error);
              this.notificationService.showNotification(
                'Error al publicar el plan.',
                'error'
              );
            }
          );
        } else {
          this.submitted.set(true);
          this.planForm.markAllAsTouched();
        }
      } else {
        this.router.navigate(['/login']);
      }
    }
  };

  ngOnInit(): void {
    this.checkLogged();
  }
}
