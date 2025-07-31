import { PaginatedResponse } from '@presentation/rto/paginated.rto';
import { PaginationDto } from '@presentation/dto/pagination.dto';

import { Post } from '../domain/post.entity';

export interface PostRepository {
  create(post: Post): Promise<Post>;
  findAll(pagination: PaginationDto): Promise<PaginatedResponse<Post>>;
  findOne(id: number): Promise<Post | null>;
  update(id: number, changes: Partial<Post>): Promise<Post | null>;
  remove(id: number): Promise<void>;
}
