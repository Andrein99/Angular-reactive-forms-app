import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../utils/form-utils';

@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.html',
})
export class DynamicPage {
  private fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array([
      ['Metal Gear', Validators.required],
      ['Death Stranding', Validators.required],

    ],
    Validators.minLength(3)
  ),
  });

  newFavorite = new FormControl('', Validators.required);

  get favoriteGames() {
    // This cast is safe because we know the structure of the form
    return this.myForm.get('favoriteGames') as FormArray;
  }

  onAddToFavorites() {
    /* Validamos el nuevo juego */
    if (this.newFavorite.invalid) return;
    const newGame = this.newFavorite.value;

    this.favoriteGames.push(this.fb.control(newGame, Validators.required));
    this.newFavorite.reset();
  }

  onDeleteFavorite(index: number) {
    /* Elimina el juego en la posición index */
    this.favoriteGames.removeAt(index);
  }

  onSubmit() {
    /* Marca todos los campos como tocados para mostrar errores */
    this.myForm.markAllAsTouched();
  }
 }
