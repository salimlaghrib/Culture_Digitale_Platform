import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {NgClass, NgForOf, NgIf, TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-cours',
  templateUrl: './sequence.component.html',
  standalone: true,
  imports: [
    NgForOf,
    TitleCasePipe,
    NgIf,
    NgClass
  ],

  styleUrl: './sequence.component.css'
})
export class SequenceComponent implements OnInit{
  public sequences: any[] = [
    {
      id: 1,
      titre: "Introduction à TypeScript",
      sousTitre: "Les bases du langage",
      imagePath: "https://miro.medium.com/v2/resize:fit:1400/0*cy5S4LnOIInTBXed.png",
      nbrLesson: 5,
      duration: 120, // en minutes
      difficulty: "beginner",
      isCompleted: false,
      tags: ["programmation", "web"],
      createdAt: "2023-10-15"
    },
    {
      id: 2,
      titre: "Angular Avancé",
      sousTitre: "State management avec NgRx",
      imagePath: "https://media.licdn.com/dms/image/v2/D4D12AQGbTqGbo_n5_Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1726476731558?e=2147483647&v=beta&t=CFBJUWNdFv9TetZ4L1TBOR1HnxUSu8k8I4iu9L9ix_s",
      nbrLesson: 8,
      duration: 180,
      difficulty: "advanced",
      isCompleted: false,
      tags: ["frontend", "rxjs"],
      createdAt: "2023-11-02"
    },
    {
      id: 3,
      titre: "UI/UX Design",
      sousTitre: "Principes fondamentaux",
      imagePath: "https://static-assets.codecademy.com/assets/course-landing-page/meta/16x9/intro-to-ui-ux.jpg",
      nbrLesson: 4,
      duration: 90,
      difficulty: "intermediate",
      isCompleted: true,
      tags: ["design", "figma"],
      createdAt: "2023-09-20"
    },
    {
      id: 4,
      titre: "Introduction à TypeScript",
      sousTitre: "Les bases du langage",
      imagePath: "https://miro.medium.com/v2/resize:fit:1400/0*cy5S4LnOIInTBXed.png",
      nbrLesson: 5,
      duration: 120, // en minutes
      difficulty: "beginner",
      isCompleted: false,
      tags: ["programmation", "web"],
      createdAt: "2023-10-15"
    },
    {
      id: 5,
      titre: "Angular Avancé",
      sousTitre: "State management avec NgRx",
      imagePath: "https://media.licdn.com/dms/image/v2/D4D12AQGbTqGbo_n5_Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1726476731558?e=2147483647&v=beta&t=CFBJUWNdFv9TetZ4L1TBOR1HnxUSu8k8I4iu9L9ix_s",
      nbrLesson: 8,
      duration: 180,
      difficulty: "advanced",
      isCompleted: false,
      tags: ["frontend", "rxjs"],
      createdAt: "2023-11-02"
    },
    {
      id: 6,
      titre: "UI/UX Design",
      sousTitre: "Principes fondamentaux",
      imagePath: "https://static-assets.codecademy.com/assets/course-landing-page/meta/16x9/intro-to-ui-ux.jpg",
      nbrLesson: 4,
      duration: 90,
      difficulty: "intermediate",
      isCompleted: true,
      tags: ["design", "figma"],
      createdAt: "2023-09-20"
    },
    {
      id: 7,
      titre: "Introduction à TypeScript",
      sousTitre: "Les bases du langage",
      imagePath: "https://miro.medium.com/v2/resize:fit:1400/0*cy5S4LnOIInTBXed.png",
      nbrLesson: 5,
      duration: 120, // en minutes
      difficulty: "beginner",
      isCompleted: false,
      tags: ["programmation", "web"],
      createdAt: "2023-10-15"
    },
    {
      id: 8,
      titre: "Angular Avancé",
      sousTitre: "State management avec NgRx",
      imagePath: "https://media.licdn.com/dms/image/v2/D4D12AQGbTqGbo_n5_Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1726476731558?e=2147483647&v=beta&t=CFBJUWNdFv9TetZ4L1TBOR1HnxUSu8k8I4iu9L9ix_s",
      nbrLesson: 8,
      duration: 180,
      difficulty: "advanced",
      isCompleted: false,
      tags: ["frontend", "rxjs"],
      createdAt: "2023-11-02"
    },
    {
      id: 9,
      titre: "UI/UX Design",
      sousTitre: "Principes fondamentaux",
      imagePath: "https://static-assets.codecademy.com/assets/course-landing-page/meta/16x9/intro-to-ui-ux.jpg",
      nbrLesson: 4,
      duration: 90,
      difficulty: "intermediate",
      isCompleted: true,
      tags: ["design", "figma"],
      createdAt: "2023-09-20"
    }
  ];

  // public Courses!:Course[]
  // Course = {
  //
  // }
  constructor(private router:Router) {
  }

  gotoCours() {
    this.router.navigateByUrl('cours')
  }

  ngOnInit(): void {
  }
}
