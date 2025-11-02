import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-basic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './basic-page.html',
})
export class BasicPage {

  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(10)]],
    inStorage: [0, [Validators.required, Validators.min(0)]],
  });

  // myForm = new FormGroup({
  //   name: new FormControl(''),
  //   price: new FormControl(0),
  //   inStorage: new FormControl(0),
  // })

  // isValidField(fieldName: string): boolean | null {
  //   return (this.myForm.controls[fieldName].errors && this.myForm.controls[fieldName].touched);
  // }

  // getFieldError(fieldName: string): string | null {
  //   if (!this.myForm.controls[fieldName]) return null;

  //   const errors = this.myForm.controls[fieldName].errors ?? {};

  //   for (const key of Object.keys(errors)) {
  //     switch(key) {
  //       case 'required':
  //         return 'Este campo es requerido';
  //       case 'minlength':
  //         return `El campo debe tener mínimo ${errors['minlength'].requiredLength} caracteres.`
  //       case 'min':
  //         return `El campo debe tener un valor mínimo de ${errors['min'].min}.`

  //     }
  //   }

  //   return null;
  // }

  onSave() {
    /* Maneja el evento de guardado del formulario. Si el formulario es inválido,
       marca todos los campos como tocados para mostrar los errores de validación.
       Si es válido, resetea el formulario.
    */
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }

    this.myForm.reset()
  }
}
