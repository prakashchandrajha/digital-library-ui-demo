import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoryComponent } from "../category-component/category-component";

@Component({
  selector: 'app-home-page',
  imports: [CategoryComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
