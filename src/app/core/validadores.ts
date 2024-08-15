import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function exactCategoriesCount(count: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (Array.isArray(control.value) && control.value.length === count) {
      return null; // No errors
    }
    return {
      exactCategoriesCount: {
        requiredCount: count,
        actualCount: control.value.length,
      },
    };
  };
}

export function imageValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value;
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        return { image: true };
      }
    }
    return null;
  };
}

export function optionalImagesArrayValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const files = control.value;
    console.log('Validating Files:', files);
    if (Array.isArray(files) && files.length > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      for (let file of files) {
        if (file && !allowedTypes.includes(file.type)) {
          console.log('Invalid File Type:', file.type);
          return { imagesArray: true };
        }
      }
    }
    return null;
  };
}

