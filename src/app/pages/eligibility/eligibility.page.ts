import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { AuthService } from '../../services/auth.service';
import { DegreeLevel, EligibilityData, EligibilityService, Intake, TestType } from '../../services/eligibility.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-eligibility-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    RouterLink,
    ScrollRevealDirective,
  ],
  templateUrl: './eligibility.page.html',
  styleUrl: './eligibility.page.css',
})
export class EligibilityPage {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly eligibilityService = inject(EligibilityService);
  private readonly authService = inject(AuthService);

  readonly degreeLevels = ['Bachelors', 'Masters', 'PhD'] as const;
  readonly intakes = ['Winter 2026', 'Summer 2027'] as const;
  readonly boards = ['Punjab', 'Sindh', 'Federal', 'A-Levels', 'KPK', 'Balochistan'] as const;
  readonly testTypes = ['IELTS', 'PTE', 'TOEFL', 'None'] as const;
  readonly universities = [
    'NUST',
    'FAST National University',
    'GIKI',
    'LUMS',
    'UET Lahore',
    'UET Taxila',
    'COMSATS',
    'IBA Karachi',
    'PIEAS',
    'Air University',
  ];

  readonly form = this.fb.group({
    goal: this.fb.group({
      degreeLevel: this.fb.control<DegreeLevel>('' as DegreeLevel, Validators.required),
      targetIntake: this.fb.control<Intake>('' as Intake, Validators.required),
      targetProgram: this.fb.control<string>('', [Validators.required, Validators.minLength(2)]),
    }),
    academicSchool: this.fb.group({
      interBoard: this.fb.control<string>('', Validators.required),
      interPercentage: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(100)]),
      thirteenthYearComplete: this.fb.control<boolean>(false),
    }),
    academicUniversity: this.fb.group({
      uniName: this.fb.control<string>('', Validators.required),
      totalCGPA: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(4)]),
      isHecRecognized: this.fb.control<boolean>(false),
      isPecRecognized: this.fb.control<boolean>(false),
    }),
    language: this.fb.group({
      testType: this.fb.control<TestType>('' as TestType, Validators.required),
      overallScore: this.fb.control<number | null>(null, [Validators.required, Validators.min(0), Validators.max(120)]),
    }),
  });

  readonly loginForm = this.fb.group({
    email: this.fb.control<string>('', [Validators.required, Validators.email]),
    password: this.fb.control<string>('', [Validators.required, Validators.minLength(6)]),
  });

  showAuthModal = false;

  readonly filteredUniversities: Observable<string[]> = this.form
    .get('academicUniversity.uniName')!
    .valueChanges.pipe(
      startWith(''),
      map((value) => this.filterUniversities((value as string | null) ?? '')),
    );

  constructor() {
    this.configureTestScoreWatcher();
    this.configureDegreeWatcher();
    this.restoreDraft();
    this.syncTestScoreState();
  }

  get goalGroup(): FormGroup {
    return this.form.get('goal') as FormGroup;
  }

  get schoolGroup(): FormGroup {
    return this.form.get('academicSchool') as FormGroup;
  }

  get universityGroup(): FormGroup {
    return this.form.get('academicUniversity') as FormGroup;
  }

  get languageGroup(): FormGroup {
    return this.form.get('language') as FormGroup;
  }

  get showThirteenthYear(): boolean {
    return this.goalGroup.get('degreeLevel')?.value === 'Bachelors';
  }

  get showPec(): boolean {
    const program = (this.goalGroup.get('targetProgram')?.value as string | null) ?? '';
    return /engineering/i.test(program);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const data = this.toEligibilityData();
    this.eligibilityService.setData(data);

    if (!this.authService.isLoggedIn()) {
      this.showAuthModal = true;
      return;
    }

    this.router.navigate(['/pricing']);
  }

  closeModal(): void {
    this.showAuthModal = false;
  }

  submitLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.authService.login();
    this.showAuthModal = false;
    this.router.navigate(['/pricing']);
  }

  continueWithGoogle(): void {
    this.authService.login();
    this.showAuthModal = false;
    this.router.navigate(['/pricing']);
  }

  private configureTestScoreWatcher(): void {
    this.languageGroup.get('testType')?.valueChanges.subscribe((value) => {
      this.toggleScoreControl(value);
    });
  }

  private configureDegreeWatcher(): void {
    this.goalGroup.get('degreeLevel')?.valueChanges.subscribe((value) => {
      if (value !== 'Bachelors') {
        this.schoolGroup.get('thirteenthYearComplete')?.setValue(false, { emitEvent: false });
      }
    });
  }

  private syncTestScoreState(): void {
    const current = this.languageGroup.get('testType')?.value;
    this.toggleScoreControl(current ?? '');
  }

  private toggleScoreControl(value: string): void {
    const overallScoreControl = this.languageGroup.get('overallScore');
    if (!overallScoreControl) {
      return;
    }

    if (value === 'None') {
      overallScoreControl.setValue(null);
      overallScoreControl.clearValidators();
      overallScoreControl.disable({ emitEvent: false });
    } else {
      overallScoreControl.setValidators([Validators.required, Validators.min(0), Validators.max(120)]);
      overallScoreControl.enable({ emitEvent: false });
    }
    overallScoreControl.updateValueAndValidity({ emitEvent: false });
  }

  private restoreDraft(): void {
    const draft = this.eligibilityService.getData();
    if (!draft.degreeLevel && !draft.targetProgram && !draft.uniName) {
      return;
    }

    this.form.patchValue({
      goal: {
        degreeLevel: draft.degreeLevel,
        targetIntake: draft.targetIntake,
        targetProgram: draft.targetProgram,
      },
      academicSchool: {
        interBoard: draft.interBoard,
        interPercentage: draft.interPercentage,
        thirteenthYearComplete: draft.thirteenthYearComplete,
      },
      academicUniversity: {
        uniName: draft.uniName,
        totalCGPA: draft.totalCGPA,
        isHecRecognized: draft.isHecRecognized,
        isPecRecognized: draft.isPecRecognized,
      },
      language: {
        testType: draft.testType,
        overallScore: draft.overallScore,
      },
    });
  }

  private filterUniversities(value: string): string[] {
    const normalized = value.toLowerCase();
    return this.universities.filter((option) => option.toLowerCase().includes(normalized));
  }

  private toEligibilityData(): EligibilityData {
    const raw = this.form.getRawValue();
    return {
      degreeLevel: raw.goal?.degreeLevel ?? '',
      targetIntake: raw.goal?.targetIntake ?? '',
      targetProgram: raw.goal?.targetProgram ?? '',
      interBoard: raw.academicSchool?.interBoard ?? '',
      interPercentage: raw.academicSchool?.interPercentage ?? null,
      thirteenthYearComplete: raw.academicSchool?.thirteenthYearComplete ?? false,
      uniName: raw.academicUniversity?.uniName ?? '',
      totalCGPA: raw.academicUniversity?.totalCGPA ?? null,
      isHecRecognized: raw.academicUniversity?.isHecRecognized ?? false,
      isPecRecognized: raw.academicUniversity?.isPecRecognized ?? false,
      testType: raw.language?.testType ?? '',
      overallScore: raw.language?.overallScore ?? null,
    };
  }
}
