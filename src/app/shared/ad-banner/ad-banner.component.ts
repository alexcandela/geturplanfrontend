import { Component, AfterViewInit, Input, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ad-banner',
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.scss'],
  standalone: true,
})
export class AdBannerComponent implements AfterViewInit {
  @Input() adSlot!: string;

  constructor(private el: ElementRef, @Inject(PLATFORM_ID) private platformId: object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadAd();
    } else {
      console.warn('AdSense intentado cargar en un entorno no compatible (SSR).');
    }
  }

  private loadAd() {
    if (typeof (window as any).adsbygoogle === 'undefined') {
      console.warn('Google AdSense script no está cargado aún.');
      return;
    }

    const adElement = this.el.nativeElement.querySelector('.adsbygoogle');
    if (adElement) {
      try {
        console.log('Cargando anuncio...');
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.error('Error cargando Google AdSense', e);
      }
    } else {
      console.warn('No se encontró el bloque de anuncios en el DOM');
    }
  }
}
