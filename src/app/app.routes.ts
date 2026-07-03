import { Routes } from '@angular/router';
import { Login } from './Auth/login/login';
import { Register } from './Auth/register/register';
import { AdminPanel } from './Admin/admin-panel/admin-panel';
import { AdminDashboard } from './Admin/admin-dashboard/admin-dashboard';
import { AdminSettings } from './Admin/admin-settings/admin-settings';
import { EditGame } from './Game/edit-game/edit-game';
import { ErrorPage } from './error-page/error-page';
import { AddGame } from './Game/add-game/add-game';
import { GameList } from './Game/game-list/game-list';
import { loggedInGuard } from './Guards/logged-in-guard';
import { isAdminGuard } from './Guards/is-admin-guard';
import { unsavedChangesGuard } from './Guards/unsaved-changes-guard';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'Register', component: Register },

    { path: 'Games', component: GameList, canActivate: [loggedInGuard] },
    { path: 'Add', component: AddGame, canActivate: [loggedInGuard] },
    { path: 'Edit/:id', component: EditGame, canActivate: [loggedInGuard], canDeactivate: [unsavedChangesGuard] },

    {
        path: 'Admin',
        loadChildren: () => import('./Admin/Admin.routes').then(m => m.adminRoutes),
        /*component: AdminPanel,
        children: [
            { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
            { path: 'Dashboard', component: AdminDashboard },
            { path: 'Settings', component: AdminSettings }
        ], canActivate: [loggedInGuard, isAdminGuard]*/
    },

    { path: '**', component: ErrorPage }
];
