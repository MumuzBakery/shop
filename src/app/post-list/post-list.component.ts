import { Component } from '@angular/core';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  posts = [
    { title: "p1", content: "test"},
    { title: "p2", content: "test"},
    { title: "p3", content: "test"}
  ]
}
