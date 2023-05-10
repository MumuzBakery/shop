import { Injectable } from '@angular/core';
import { Post } from '../models/post';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdate = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) { 

  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
    .pipe(map((postData) => {
      return {
        posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          };
        }),
        maxPosts: postData.maxPosts
      };
    })
      /*map(postData => {
      return postData.posts.map(post => {
        title: post.title,
        content: post.content,
        id: post._id
      });
    }*/)
    .subscribe((tranPosts) => {
      this.posts = tranPosts.posts;
      this.postsUpdate.next({
        posts: [...this.posts],
        postCount: tranPosts.maxPosts
      });
    });
  }

  getPostUpdateListener() {
    return this.postsUpdate.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {
      id: '',
      title: title,
      content: content
    };
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post).subscribe((responseData) => {
      /*
      console.log(responseData.message);
      post.id = responseData.postId;
      this.posts.push(post);
      this.postsUpdate.next([...this.posts]);*/
      this.router.navigate(["/"]);
    })
  }

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>("http://localhost:3000/api/posts/" + id);
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {
      id: id,
      title: title,
      content: content
    }

    this.http.put("http://localhost:3000/api/posts/" + id, post).subscribe(result => {
      /*
      const updatedPosts = [...this.posts];
      const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
      updatedPosts[oldPostIndex] = post;
      this.posts = updatedPosts;
      this.postsUpdate.next([...this.posts]);*/
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    return this.http.delete("http://localhost:3000/api/posts/" + postId);/*.subscribe(result => {
      console.log(result);
      const updatedPosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatedPosts;
      this.postsUpdate.next([...this.posts]);
    });*/
  }
}
