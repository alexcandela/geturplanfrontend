import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss',
})
export class MapComponent {
  @Input() isCreateMode: boolean = false; 
  @Input() planLocation?: google.maps.LatLngLiteral | null = null;
  @Input() zone?: google.maps.LatLngLiteral | null = null;
  @Input() selected?: google.maps.LatLngLiteral | null = null;
  @Output() exactCoords = new EventEmitter<google.maps.LatLngLiteral>();

  mapOptions: google.maps.MapOptions = {
    disableDefaultUI: true,
  };


  center: google.maps.LatLngLiteral = { lat: 40.4168, lng: -3.7038 };
  
  zoom = 12;

  selectedLocation: google.maps.LatLngLiteral | null = null;

  // Función que se llama cuando el usuario hace clic en el mapa
  onMapClick(event: google.maps.MapMouseEvent) {
    if (this.isCreateMode) {
      const latLng = event.latLng;
      if (latLng) {
        this.selectedLocation = { lat: latLng.lat(), lng: latLng.lng() };
        this.exactCoords.emit(this.selectedLocation);
      }
    }
  }
  // Detecta cambios en los inputs y actualiza el centro del mapa
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['zone'] && this.zone) {
      this.center = this.zone; 
    }
    if (changes['planLocation'] && this.planLocation) {
      this.center = this.planLocation; 
    }
    
  }
  ngOnInit(): void {
    if (this.zone) {
      this.center = this.zone;
    }
    if (this.selected) {
      this.selectedLocation = this.selected;
      this.center = this.selected;
    } 
  }
}
