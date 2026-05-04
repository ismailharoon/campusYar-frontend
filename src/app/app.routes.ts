import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { EligibilityPage } from './pages/eligibility/eligibility.page';
import { LoginPage } from './pages/auth/login.page';
import { PricingPage } from './pages/pricing/pricing.page';
import { SignupPage } from './pages/auth/signup.page';
import { HomePage } from './pages/home/home.page';

export const routes: Routes = [
	{ path: '', component: HomePage },
	{ path: 'eligibility', component: EligibilityPage },
	{ path: 'login', component: LoginPage },
	{ path: 'signup', component: SignupPage },
	{ path: 'pricing', component: PricingPage, canActivate: [authGuard] },
	{ path: 'dashboard', component: DashboardPage, canActivate: [authGuard] },
	{ path: '**', redirectTo: '' },
];
