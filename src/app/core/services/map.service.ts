import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCoordinatesFromLocation(location: string): Observable<{ lat: number, lng: number }> {
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${environment.googleMapsApiKey}`;
    
    return this.http.get<any>(geocodingUrl).pipe(
      map(response => {
        if (response.status === 'OK') {
          const lat = response.results[0].geometry.location.lat;
          const lng = response.results[0].geometry.location.lng;
          return { lat, lng }; // Devolvemos las coordenadas
        } else {
          throw new Error('Error en geocaching');
        }
      })
    );
  }
}
