import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { PostUseCases } from '@core/use-cases/post.use-cases';
import { PaginatedResponse } from '../rto/paginated.rto';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PaginationDto } from '../dto/pagination.dto';
import { PostResponse } from '../rto/post.rto';

@ApiTags('Blog')
@Controller('posts')
export class PostController {
  constructor(private readonly postUseCases: PostUseCases) {}

  @Post()
  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 201, type: PostResponse })
  create(@Body() dto: CreatePostDto) {
    return this.postUseCases.createPost({
      title: dto.title,
      description: dto.description,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get paginated posts' })
  @ApiResponse({ status: 200, type: PaginatedResponse<PostResponse> })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'step', required: false, type: Number })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.postUseCases.getPosts(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get post by ID' })
  @ApiResponse({ status: 200, type: PostResponse })
  findOne(@Param('id') id: string) {
    return this.postUseCases.getPostById(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, type: PostResponse })
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postUseCases.updatePost(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string) {
    return this.postUseCases.deletePost(+id);
  }
}
