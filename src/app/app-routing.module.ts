import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourSequenceComponent } from "../app/features/user/cour-sequence/cour-sequence.component";
import { CoursesComponent } from "../app/features/user/cours/courses.component";
import { SequenceComponent } from "../app/features/user/sequence/sequence.component";
import { AdminGuard } from './core/guards/admin-guard.guard';
import { AuthGuard } from './core/guards/auth-guard.guard';
import { RegisterComponent } from "./features/auth/Register/Registre.component";
import { LoginComponent } from "./features/auth/login/login.component";
import { HomeComponent } from "./features/user/home/home.component";
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';

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

  // User space (courses)
  {
    path: 'sequence',
    canActivate: [AuthGuard],
    component: SequenceComponent,
    children: [
      {
        path: 'coursSequence',
        component: CourSequenceComponent,
        children: [
          {
            path: 'cours',
            component: CoursesComponent
          }
        ]
      },
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
