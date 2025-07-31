import { PaginatedResponse } from '@presentation/rto/paginated.rto';
import { PaginationDto } from '@presentation/dto/pagination.dto';

import { CacheRepository } from '../ports/cache.repository';
import { PostRepository } from '../ports/post.repository';
import { Post } from '../domain/post.entity';

export class PostUseCases {
  private readonly cachePrefix = {
    post: 'post:',
    postsList: 'posts:list:',
  };

  constructor(
    private postRepository: PostRepository,
    private cacheRepository: CacheRepository,
  ) {}

  async createPost(post: Post): Promise<Post> {
    const createdPost = await this.postRepository.create(post);
    const cacheKey = `${this.cachePrefix.post}${createdPost.id}`;
    await this.cacheRepository.set(cacheKey, createdPost);
    return createdPost;
  }

  async getPosts(pagination: PaginationDto): Promise<PaginatedResponse<Post>> {
    return this.postRepository.findAll(pagination);
  }

  async getPostById(id: number): Promise<Post> {
    const cacheKey = `${this.cachePrefix.post}${id}`;
    const cached = await this.cacheRepository.get<Post>(cacheKey);
    if (cached) return cached;

    const post = await this.postRepository.findOne(id);
    if (!post) throw new Error('Post not exists');

    await this.cacheRepository.set(cacheKey, post);
    return post;
  }

  async updatePost(id: number, changes: Partial<Post>): Promise<Post> {
    const updatedPost = await this.postRepository.update(id, changes);
    if (!updatedPost) throw new Error('Post not exists');

    const cacheKey = `${this.cachePrefix.post}${updatedPost.id}`;
    await this.cacheRepository.set(cacheKey, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<void> {
    await this.postRepository.remove(id);
    await this.cacheRepository.del(`${this.cachePrefix.post}${id}`);
  }
}
