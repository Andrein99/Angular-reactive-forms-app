import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, Observable, of } from 'rxjs';
import type { Country } from '../interfaces/country.interface';

@Injectable({providedIn: 'root'})
export class CountryService {
  private baseUrl = 'https://restcountries.com/v3.1';
  private httpClient = inject(HttpClient);

  private _regions = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania'
  ]

  get regions(): string[] {
    /* Getter para obtener las regiones */
    return [... this._regions];
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    /*
      Funcion para obtener paises por region
      Si no hay region, retornar un arreglo vacio
    */
    if (!region) return of([]);

    const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;
    return this.httpClient.get<Country[]>(url);

  }

  getCountryByAlphaCode(alphaCode: string): Observable<Country> {
    /*
      Funcion para obtener un pais por su codigo alfa
      Si no hay codigo, retornar null
    */
    const url = `${this.baseUrl}/alpha/${alphaCode}?fields=cca3,name,borders`;
    return this.httpClient.get<Country>(url);
  }

  getCountryNamesByCodeArray(countryCodes: string[]): Observable<Country[]> {
    /*
      Funcion para obtener los nombres de los paises a partir de un arreglo de codigos
      Si no hay codigos, retornar un arreglo vacio
    */
    if (!countryCodes || countryCodes.length === 0) return of([]);

    const countriesRequests: Observable<Country>[] = [];

    countryCodes.forEach((code) => {
      const request = this.getCountryByAlphaCode(code);
      countriesRequests.push(request);
    })

    return combineLatest(countriesRequests);
  }
}
