import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink, ScrollRevealDirective],
  templateUrl: './home.page.html',
})
export class HomePage {}
