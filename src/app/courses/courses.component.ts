import { Component } from '@angular/core';
import {Router} from "@angular/router";

class NgbModal {
}

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  constructor(private router:Router,private modalService: NgbModal) {
  }

  gotoreadPdf() {
    this.router.navigateByUrl('pdf')
  }


  openModal() {
    this.modalService.open(this.content, {
      size: 'lg',
      centered: true
    });
  }
}
