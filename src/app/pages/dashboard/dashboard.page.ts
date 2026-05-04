import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EligibilityService } from '../../services/eligibility.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage {
  private readonly eligibilityService = inject(EligibilityService);

  get data() {
    return this.eligibilityService.getData();
  }

  get germanGrade(): number {
    const payload = this.data;
    const userGrade = payload.totalCGPA ?? 0;
    const maxGrade = 4.0;
    const minPassingGrade = 2.0;
    if (!userGrade) {
      return 0;
    }

    const vpd = 1 + 3 * ((maxGrade - userGrade) / (maxGrade - minPassingGrade));
    return Math.min(4, Math.max(1, Number(vpd.toFixed(2))));
  }

  get status(): string {
    const payload = this.data;
    const cgpa = payload.totalCGPA ?? 0;
    const inter = payload.interPercentage ?? 0;

    if (cgpa >= 3.2 && inter >= 70) {
      return 'Eligible';
    }
    if (cgpa >= 2.5 && inter >= 60) {
      return 'Conditional';
    }
    return 'Not Eligible';
  }
}
