import { InjectRepository } from '@nestjs/typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { PaginatedResponse } from '@presentation/rto/paginated.rto';
import { PaginationDto } from '@presentation/dto/pagination.dto';
import { PostEntity } from '@presentation/entities/post.entity';
import { PostRepository } from '@core/ports/post.repository';
import { Post } from '@core/domain/post.entity';

@Injectable()
export class TypeOrmPostRepository implements PostRepository {
  constructor(
    @InjectRepository(PostEntity)
    private readonly repository: Repository<PostEntity>,
  ) {}

  async create(post: Post): Promise<Post> {
    let createdPost: PostEntity;

    try {
      createdPost = this.repository.create(post);
      await this.repository.save(createdPost);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return this.toDomain(createdPost);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<Post>> {
    const { page, step } = pagination;
    let items: PostEntity[];
    let totalItems = 0;

    try {
      [items, totalItems] = await this.repository.findAndCount({
        skip: (page - 1) * step,
        take: step,
        order: { createdAt: 'DESC' },
      });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      items: items.map((item) => this.toDomain(item)),
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: step,
        totalPages: Math.ceil(totalItems / step),
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<Post | null> {
    let post: PostEntity | null;

    try {
      post = await this.repository.findOne({ where: { id } });
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    if (!post) {
      throw new NotFoundException('Post not exists');
    }

    return this.toDomain(post);
  }

  async update(id: number, changes: Partial<Post>): Promise<Post | null> {
    try {
      await this.repository.update(id, changes);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  private readonly toDomain = (entity: PostEntity): Post => {
    return new Post({
      id: entity.id,
      title: entity.title,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  };
}
