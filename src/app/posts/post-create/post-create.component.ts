import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  postValue = "";
  postTitle = "";
  postContent = "";
  @Output() postCreated = new EventEmitter<Post>(); 

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    let post :Post = {
      title: form.value.title,
      content: form.value.content,
    };

    //this.postCreated.emit(post);
    this.postsService.addPost(post);
  }

  constructor(public postsService: PostsService) {
  }
}
