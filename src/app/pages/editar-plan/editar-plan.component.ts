import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { provincias, categorias } from '../../core/data';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/authservice.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ToastComponent } from '../../components/toast-notification/toast-notification.component';
import { PlanForm, PlanFormResponse } from '../../core/interfaces/plan-form';
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

import { PlanService } from '../../core/services/plan.service';
import { NotificationService } from '../../core/services/notification.service';
import { Plan } from '../../core/interfaces/plan';
import { backendurl } from '../../core/environments/backendurl';

@Component({
  selector: 'app-editar-plan',
  standalone: true,
  imports: [ReactiveFormsModule, ToastComponent, RouterLink],
  templateUrl: './editar-plan.component.html',
  styleUrl: './editar-plan.component.scss',
})
export class EditarPlanComponent implements OnInit {
  plan: Plan | null = null;

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
  submitted = signal(false);

  selectedCategories: string[] = [];
  selectedImages: File[] = [];

  selectedCategory = signal(false);

  linkPerfil: string = '';

  imagesToDelete: SafeUrl[] = [];
  filteredSecundarias: SafeUrl[] = [];

  constructor(
    private titulo: Title,
    private router: Router,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private planService: PlanService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    titulo.setTitle('Editar plan');
    this.planForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      url: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/),
        ],
      ],
      categories: [[], [Validators.required, exactCategoriesCount(3)]],
      principal_image: [null, [imageValidator()]],
      secondary_images: [[], [optionalImagesArrayValidator()]],
    });
  }

  checkLogged = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('jwt');
      if (!token || !this.authService.isTokenValid(token)) {
        this.router.navigate(['/login']);
      }
    }
  };

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

  updateFilteredSecundarias(): void {
    this.filteredSecundarias = this.secundarias.filter(
      (url) => url !== this.defaultImg
    );
  }

  onFileChangeSecundaria(event: Event): void {
    this.updateFilteredSecundarias();
    if (
      this.selectedImages.length >= 4 ||
      this.filteredSecundarias.length >= 4
    ) {
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

    for (let i = 0; i < this.secundarias.length; i++) {
      if (this.secundarias[i] !== this.defaultImg) {
        this.secundarias[nonNullIndex] = this.secundarias[i];
        nonNullIndex++;
      }
    }

    for (let i = nonNullIndex; i < this.secundarias.length; i++) {
      this.secundarias[i] = this.defaultImg;
    }
  }

  deleleteSecundarias = (index: number) => {
    this.imagesToDelete.push(this.secundarias[index]);
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
    if (this.imagesToDelete.length > 0) {
      const imageUrls: string[] = this.imagesToDelete.map((safeUrl: SafeUrl) =>
        safeUrl.toString()
      );
      const imageUrlsJson = JSON.stringify(imageUrls);
      formData.append('imagesToDelete', imageUrlsJson);
    }
    if (this.planForm.get('principal_image')?.value) {
      formData.append(
        'principal_image',
        this.planForm.get('principal_image')?.value
      );
    }
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
          this.planService.updatePlan(token, formData, this.plan?.id).subscribe(
            (response: PlanFormResponse) => {
              if (response.status === 'success') {
                this.notificationService.showNotification(
                  'Plan editado correctamente.',
                  'success'
                );
                this.router.navigate([`/showplan/${response.planId}`]);
              }
            },
            (error) => {
              console.log(error);
              this.notificationService.showNotification(
                'Error al editado el plan.',
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

  initializeForm(): void {
    if (this.plan) {
      this.planForm.patchValue({
        name: this.plan.name,
        description: this.plan.description,
        province: this.plan.province,
        city: this.plan.city,
        url: this.plan.url,
        categories: this.plan.categories,
        // principal_image: this.plan.principal_image,
        // secondary_images: this.plan.secondary_images || [],
      });
      this.selectedCategories = this.plan.categories.map(
        (category) => category.name
      );
      this.img.set(this.plan.img);
      if (this.plan.secondary_images) {
        this.plan.secondary_images.forEach((element) => {
          this.secundarias.unshift(element.img);
          this.secundarias.pop();
        });
      }
    }
  }

  ngOnInit(): void {
    this.planService.plan$.subscribe((plan) => {
      if (plan) {
        this.plan = plan;
        this.initializeForm();
      } else {
        const localStoragePlan = this.planService.getPlanFromLocalStorage();
        if (localStoragePlan) {
          this.plan = localStoragePlan;
          this.initializeForm();
        }
      }
    });
    this.checkLogged();
    this.linkPerfil = `perfil/${this.plan?.user.username}`;
  }
}
