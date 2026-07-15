import { CommonModule } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Stage {
  icon: string;
  tag: 'build' | 'curate';
  title: string;
  desc: string;
  link: string;
  routerLink: string;
  image: string;
}

interface SplitFeature {
  title: string;
  desc: string;
}

interface Faq {
  q: string;
  a: string;
  open?: boolean;
}

@Component({
  selector: 'app-services-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './services.page.html',
  styleUrl: './services.page.css',
})
export class ServicesPage implements OnInit, AfterViewInit {
  @ViewChild('trailContainer') trailContainer!: ElementRef;

  selectedStageIndex = 0;
  stampsLoaded = false;

  readonly stages: Stage[] = [
    {
      icon: 'compass',
      tag: 'build',
      title: 'Pathway Finder',
      desc: 'Seven questions. One clear answer — which route to Germany actually fits your education level and academic background.',
      link: 'Try Pathway Finder',
      routerLink: '/eligibility',
      image: 'assets/stage1.png',
    },
    {
      icon: 'cap',
      tag: 'build',
      title: 'University Finder',
      desc: "Official university program database, filtered for Pakistani students — with APS and recognition notes attached to help you apply directly.",
      link: 'Search Universities',
      routerLink: '/universities',
      image: 'assets/uni-campus.png',
    },
    {
      icon: 'pen',
      tag: 'build',
      title: 'Application Docs',
      desc: 'SOP, LOR and CV — structure and templates that match what German admissions committees actually expect and look for.',
      link: 'See Templates',
      routerLink: '#',
      image: 'assets/student-laptop.png',
    },
    {
      icon: 'chat',
      tag: 'curate',
      title: 'Language Prep',
      desc: 'The IELTS, TestDaF and German (A1–B2) resources worth your time — free channels, apps, and official practice tests.',
      link: 'Browse Resources',
      routerLink: '#',
      image: 'assets/stage4.png',
    },
    {
      icon: 'coin',
      tag: 'build',
      title: 'Financial Planning',
      desc: 'Blocked account setup, semester contributions, and realistic cost of living — in EUR and PKR, so nothing surprises you later.',
      link: 'Read the Guide',
      routerLink: '#',
      image: 'assets/stage5.png',
    },
    {
      icon: 'seal',
      tag: 'build',
      title: 'APS Certificate',
      desc: 'Costs, document checklists, and the exact step-by-step verification process for your APS appointment in Islamabad.',
      link: 'Read the Guide',
      routerLink: '#',
      image: 'assets/docs-guidance.png',
    },
    {
      icon: 'passport',
      tag: 'build',
      title: 'Visa Application',
      desc: 'Embassy booking tips, complete document requirements, and what actually happens inside the interview room.',
      link: 'Read the Guide',
      routerLink: '#',
      image: 'assets/stage7.png',
    },
    {
      icon: 'plane',
      tag: 'build',
      title: 'Pre-Departure',
      desc: 'City accommodation search, Anmeldung registration, opening a local bank account — your first two weeks, mapped.',
      link: 'Read the Guide',
      routerLink: '#',
      image: 'assets/visa-arrival.png',
    },
  ];

  readonly rotations = [-6, 4, -3, 7, -5, 3, -4, 6];
  readonly progressArray = [0, 1, 2, 3, 4, 5, 6, 7];

  readonly buildFeatures: SplitFeature[] = [
    { title: 'Pathway Finder', desc: 'Your route, mapped in one sitting' },
    { title: 'University Finder', desc: 'Program listings, filtered for you' },
    { title: 'Checklist Generator', desc: 'Every document, one personalized checklist' },
    { title: 'APS Certificate Guide', desc: ' Islamabad verification guidebook' },
    { title: 'Blocked Account Guide', desc: 'Setup walkthrough and provider lists' },
    { title: 'UniAssist Guide', desc: 'Portal navigation and tips' },
    { title: 'Visa Process Guide', desc: 'Embassy guidelines and interview prep' },
    { title: 'SOP / LOR / CV templates', desc: 'Structures that match what admissions expect' },
    { title: 'Pre-departure & Arrival Guide', desc: 'Accommodation, Anmeldung, SIM & bank details' },
  ];

  readonly curateFeatures: SplitFeature[] = [
    { title: 'IELTS preparation', desc: 'Books, YouTube courses, and mock test shortlists' },
    { title: 'TestDaF preparation', desc: 'Curated channels, materials, and practice exams' },
    { title: 'German Language (A1→B2)', desc: "DW free courses, apps, and worksheets" },
    { title: 'Scholarship Resources', desc: 'Funding sources outside official tracks' },
  ];

  readonly faqs: Faq[] = [
    {
      q: 'Is this actually free?',
      a: 'Yes — the Pathway Finder, University Finder, checklists and every guide are free. Nothing is locked behind a paywall in Phase 1.',
      open: false,
    },
    {
      q: 'How long does the whole journey take?',
      a: "From your first search to enrollment, most students take 8–14 months, depending on the pathway and intake you're targeting.",
      open: false,
    },
    {
      q: 'Do I still need an APS certificate?',
      a: "Yes, it's mandatory for every Pakistani applicant regardless of which pathway you take — our APS guide walks through the exact process.",
      open: false,
    },
    {
      q: 'Can I trust the information on CampusYar?',
      a: 'Every guide is sourced from official channels — German university databases, APS Pakistan, the German Embassy — and shows the date it was last checked.',
      open: false,
    },
  ];

  ngOnInit(): void {
    this.stampsLoaded = true;
  }

  ngAfterViewInit(): void {}

  selectStage(index: number): void {
    this.selectedStageIndex = index;
  }

  toggleFaq(faq: Faq): void {
    faq.open = !faq.open;
  }
}
