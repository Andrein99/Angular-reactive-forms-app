import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";

async function sleep() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 2500) // Simulación de espera del backend.
  })
}

export class FormUtils {
// Expresiones regulares
static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';

static getTextError(errors: ValidationErrors) {
  /*  Devuelve un string con el error correspondiente al primer error
      encontrado en el objeto de errores recibido. Si no hay errores,
      devuelve null.
  */
  for (const key of Object.keys(errors)) {
      switch(key) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `El campo debe tener mínimo ${errors['minlength'].requiredLength} caracteres.`;
        case 'min':
          return `El campo debe tener un valor mínimo de ${errors['min'].min}.`;
        case 'email':
          return `El valor ingresado no es un correo electrónico`;
        case 'emailTaken':
          return `El correo electrónico ya está siendo usado por otro usuario`;
        case 'noStrider':
          return 'No se puede usar el username de Strider en la app'
        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El valor ingresado no luce como un correo electrónico'
          }
          return 'Error de patrón contra expresión regular'

        default:
          return `Error de validación no controlado: ${key}`;
      }
    }

    return null;
}

  static isValidField(form: FormGroup, fieldName: string): boolean | null {
    // Verifica si un campo específico de un formulario es inválido y ha sido tocado.
    return (!!form.controls[fieldName].errors && form.controls[fieldName].touched);
  }


  static getFieldError(form: FormGroup, fieldName: string): string | null {
    // Obtiene el mensaje de error del campo específico de un formulario.
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isValidFieldArray(formArray: FormArray, index: number) {
    // Verifica si un campo específico dentro de un FormArray es inválido y ha sido tocado.
    return (
      formArray.controls[index].errors && formArray.controls[index].touched
    );
  }

  static getFieldErrorInArray(formArray: FormArray, index: number): string | null {
    // Obtiene el mensaje de error de un campo específico dentro de un FormArray.
    if (formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextError(errors);
  }

  static isFieldOneEqualFieldTwo(field1: string, field2: string) {
    // Validador personalizado para comparar dos campos de un formulario.
    return (formGroup: AbstractControl) => {
      const field1Value = formGroup.get(field1)?.value;
      const field2Value = formGroup.get(field2)?.value;
      return (field1Value === field2Value) ? null : { passwordsNotEqual: true };
    }
  }

  static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
    // Simula una llamada al servidor para verificar si un email ya está en uso.

    await sleep();

    const formValue = control.value;
    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true
      };
    }

    return null;
  }

  static notStrider(control: AbstractControl): ValidationErrors | null {
    // Validador personalizado que impide usar "Strider" como valor.
    const formValue = control.value;
    if (formValue === "Strider") {
      return { noStrider: true }
    }

    return null;
  }
}
