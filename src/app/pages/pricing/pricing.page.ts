import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-pricing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, ScrollRevealDirective],
  templateUrl: './pricing.page.html',
  styleUrl: './pricing.page.css',
})
export class PricingPage {}
