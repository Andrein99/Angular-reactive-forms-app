import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ɵInternalFormsSharedModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(this.formUtils.namePattern)]],
    email: ['',
      [Validators.required, Validators.pattern(this.formUtils.emailPattern)],
      [FormUtils.checkingServerResponse], // Validaciones asíncronas
    ],
    username: ['',
      [Validators.required, Validators.minLength(6), Validators.pattern(this.formUtils.notOnlySpacesPattern), FormUtils.notStrider],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [
      this.formUtils.isFieldOneEqualFieldTwo('password', 'confirmPassword')
    ]
  });

  // isFieldOneEqualFieldTwo(field1: string, field2: string) {
  //   return (formGroup: AbstractControl) => {
  //     const field1Value = formGroup.get(field1)?.value;
  //     const field2Value = formGroup.get(field2)?.value;
  //     return (field1Value === field2Value) ? null : { passwordsNotEqual: true };
  //   }
  // }

  onSubmit() {
    // Marcar todos los campos como tocados para mostrar errores
    this.myForm.markAllAsTouched();
  }
}
