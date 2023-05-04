import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../models/post';
import { PostsService } from '../services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
  // posts: Post[] = [
  //   { title: "p1", content: "test"},
  //   { title: "p2", content: "test"},
  //   { title: "p3", content: "test"}
  // ]
  posts: Post[] = [];
  postsSub: Subscription;

  constructor(public postsService: PostsService)  {
    this.postsSub = Subscription.EMPTY;
  }

  ngOnInit(): void {
    this.posts = this.postsService.getPosts();
    this.postsSub = this.postsService.getPostUpdateListener().subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
  }
}
