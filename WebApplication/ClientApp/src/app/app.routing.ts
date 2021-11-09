import { Route } from '@angular/router';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';
import { InitialDataResolver } from 'app/app.resolvers';

export const appRoutes: Route[] = [

    // Error routes
    {path: 'not-found', loadChildren: () => import('app/modules/error/error-404/error-404.module').then(m => m.Error404Module)},
    {path: 'internal-error', loadChildren: () => import('app/modules/error/error-500/error-500.module').then(m => m.Error500Module)},

    // Default route
    {path: '', pathMatch : 'full', redirectTo: 'profile'},

    // Redirect route
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'profile'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.module').then(m => m.AuthConfirmationRequiredModule)},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)}
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
        ]
    },

    // Pages routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: 'profile', loadChildren: () => import('app/modules/pages/profile/profile.module').then(m => m.ProfileModule)},
            {path: 'profile/:id', loadChildren: () => import('app/modules/pages/profile/profile.module').then(m => m.ProfileModule)},
            {path: 'dating', loadChildren: () => import('app/modules/pages/dating/dating.module').then(m => m.DatingModule)},
            {path: 'calendar', loadChildren: () => import('app/modules/pages/calendar/calendar.module').then(m => m.CalendarModule)},
            {path: 'settings', loadChildren: () => import('app/modules/pages/settings/settings.module').then(m => m.SettingsModule)},
        ]
    },

    // Incorrect route
    {path: '**', loadChildren: () => import('app/modules/error/error-404/error-404.module').then(m => m.Error404Module)},
];
