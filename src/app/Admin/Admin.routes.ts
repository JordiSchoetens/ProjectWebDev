import { AdminPanel } from "./admin-panel/admin-panel";
import { AdminDashboard } from "./admin-dashboard/admin-dashboard";
import { Routes } from "@angular/router";
import { loggedInGuard } from "../Guards/logged-in-guard";
import { isAdminGuard } from "../Guards/is-admin-guard";

// routes for lazy loading admin module
export const adminRoutes: Routes = [
    {
        path: '',
        component: AdminPanel,
        children: [
            { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
            { path: 'Dashboard', component: AdminDashboard },
            { path: 'Settings',
                // lazy loads the settings component, only gets loaded when route is visited
                loadComponent: () => import('./admin-settings/admin-settings').then(m => m.AdminSettings) }
        ], canActivate: [loggedInGuard, isAdminGuard]
    }
];