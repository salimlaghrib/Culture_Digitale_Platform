import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SequenceDetailComponent } from "./features/user/sequences/sequence-detail/sequence-detail.component";
import { CoursePlayerComponent } from "../app/features/user/courses/course-player/course-player.component";
import { SequenceListComponent } from "./features/user/sequences/sequence-list/sequence-list.component";
import { AdminGuard } from '../app/core/guards/admin.guard';
import { AuthGuard } from '../app/core/guards/auth.guard';
import { RegisterComponent } from "./features/auth/Register/Registre.component";
import { LoginComponent } from "./features/auth/login/login.component";
import { HomeComponent } from "./features/user/home/home.component";
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { UserGuard } from './core/guards/user.guard';

const routes: Routes = [
  // Public routes
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },

  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Admin space
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('../app/features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Tableau de bord'
      },
      {
        path: 'users',
        loadComponent: () => import('../app/features/admin/users/user-list/user-list.component').then(m => m.UserListComponent),
        title: 'Gestion des utilisateurs'
      },
      {
        path: 'trainings',
        loadComponent: () => import('../app/features/admin/trainings/training-list/training-list.component').then(m => m.TrainingListComponent),
        title: 'Gestion des formations'
      },
      {
        path: 'courses',
        loadComponent: () => import('../app/features/admin/courses/course-list/course-list.component').then(m => m.CourseListComponent),
        title: 'Gestion des cours'
      }
    ]
  },

  {
    path: 'sequences',
    canActivate: [AuthGuard, UserGuard],
    children: [
      {
        path: '',
        component: SequenceListComponent // Liste des séquences
      },
      {
        path: ':sequenceId',
        component: SequenceDetailComponent, // Détail d'une séquence
        children: [
          {
            path: 'courses/:courseId',
            component: CoursePlayerComponent // Player de cours
          }
        ]
      }
    ]
  },

  // Other protected routes
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },

  // 404 handling
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
