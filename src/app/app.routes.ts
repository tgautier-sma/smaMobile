import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { ParamsComponent } from './pages/params/params.component';
import { AboutComponent } from './pages/about/about.component';
import { ForgotComponent } from './pages/auth/forgot/forgot.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { SignInComponent } from './pages/auth/sign-in/sign-in.component';
import { Page1Component } from './pages/page1/page1.component';
import { Page2Component } from './pages/page2/page2.component';
import { Page3Component } from './pages/page3/page3.component';

export const routes: Routes = [
    { path: 'home', component: HomeComponent, data: { menu: false } },
    { path: 'signin', component: SignInComponent, data: { menu: false } },
    { path: 'forgot', component: ForgotComponent, data: { menu: false } },
    { path: 'register', component: RegisterComponent, data: { menu: false } },
    { path: 'params', component: ParamsComponent, data: { menu: true } },
    { path: 'about', component: AboutComponent, data: { menu: true } },
    { path: 'page1', component: Page1Component, data: { menu: true } },
    { path: 'page2', component: Page2Component, data: { menu: true } },
    { path: 'page3', component: Page3Component, data: { menu: true } },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', component: PageNotFoundComponent }
];
