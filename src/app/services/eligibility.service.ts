import { Injectable, signal } from '@angular/core';

export type DegreeLevel = 'Bachelors' | 'Masters' | 'PhD' | '';
export type Intake = 'Winter 2026' | 'Summer 2027' | '';
export type TestType = 'IELTS' | 'PTE' | 'TOEFL' | 'None' | '';

export interface EligibilityData {
  degreeLevel: DegreeLevel;
  targetIntake: Intake;
  targetProgram: string;
  interBoard: string;
  interPercentage: number | null;
  thirteenthYearComplete: boolean;
  uniName: string;
  totalCGPA: number | null;
  isHecRecognized: boolean;
  isPecRecognized: boolean;
  testType: TestType;
  overallScore: number | null;
}

const DEFAULT_DATA: EligibilityData = {
  degreeLevel: '',
  targetIntake: '',
  targetProgram: '',
  interBoard: '',
  interPercentage: null,
  thirteenthYearComplete: false,
  uniName: '',
  totalCGPA: null,
  isHecRecognized: false,
  isPecRecognized: false,
  testType: '',
  overallScore: null,
};

@Injectable({
  providedIn: 'root',
})
export class EligibilityService {
  private readonly storageKey = 'campusyar_eligibility';
  private readonly dataSignal = signal<EligibilityData>(this.loadFromStorage());

  getData(): EligibilityData {
    return this.dataSignal();
  }

  setData(value: EligibilityData): void {
    this.dataSignal.set(value);
    this.persist(value);
  }

  patchData(value: Partial<EligibilityData>): void {
    const next = { ...this.dataSignal(), ...value };
    this.dataSignal.set(next);
    this.persist(next);
  }

  clear(): void {
    this.dataSignal.set(DEFAULT_DATA);
    sessionStorage.removeItem(this.storageKey);
  }

  private loadFromStorage(): EligibilityData {
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) {
      return DEFAULT_DATA;
    }

    try {
      return { ...DEFAULT_DATA, ...(JSON.parse(raw) as EligibilityData) };
    } catch {
      return DEFAULT_DATA;
    }
  }

  private persist(value: EligibilityData): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(value));
  }
}
