import { Component, AfterViewInit, Input } from '@angular/core';

@Component({
  selector: 'app-ad-banner',
  templateUrl: './ad-banner.component.html',
  styleUrls: ['./ad-banner.component.scss'],
  standalone: true,
})
export class AdBannerComponent implements AfterViewInit {
  @Input() adSlot!: string; // ID del bloque de anuncios

  ngAfterViewInit() {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error('Error cargando Google AdSense', e);
    }
  }
}
