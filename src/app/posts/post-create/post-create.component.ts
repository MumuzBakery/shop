import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from 'src/app/models/post';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit{
  postValue = "";
  postTitle = "";
  postContent = "";
  isLoading = false;
  private mode = 'create';
  private postId: string;
  post: Post;
  @Output() postCreated = new EventEmitter<Post>(); 

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    if (this.mode === 'create') {
    //this.postCreated.emit(post);
    this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content )
    }
  }

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId')!;
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content
          };
          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = '';
      }
    });
  }
}
