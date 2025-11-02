import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { CountryService } from '../../services/country.service';
import type { Country } from '../../interfaces/country.interface';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.html',
})
export class CountryPage {
    fb = inject(FormBuilder);
    countryService = inject(CountryService);

    regions = signal(this.countryService.regions);
    countriesByRegion = signal<Country[]>([]);
    borders = signal<Country[]>([]);

    myForm = this.fb.group({
      region: ['', Validators.required],
      country: ['', Validators.required],
      border: ['', Validators.required],
    });

    onFormChanged = effect((onCleanup) => {
      /* Subscription to region changes */
      const regionSubscription = this.onRegionChanged();
      const countrySubscription = this.onCountryChanged();

      onCleanup(() => {
        regionSubscription.unsubscribe();
        countrySubscription.unsubscribe();
      })
    });

    onRegionChanged() {
      /* Reset country and border when region changes */
      return this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.myForm.get('border')!.setValue('')),
        tap(() => this.borders.set([])),
        tap(() => this.countriesByRegion.set([])),
        switchMap((region) => this.countryService.getCountriesByRegion(region ?? ''))
      )
      .subscribe((countries) => this.countriesByRegion.set(countries));
    }

    onCountryChanged() {
      /* Reset border when country changes */
      return this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value) => value!.length > 0),
        switchMap((alphaCode) => this.countryService.getCountryByAlphaCode(alphaCode ?? '')),
        switchMap((country) => this.countryService.getCountryNamesByCodeArray(country.borders))
      )
      .subscribe((borders) => this.borders.set(borders));
    }
}
