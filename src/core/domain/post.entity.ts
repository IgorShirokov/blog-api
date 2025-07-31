export class Post {
  id?: number;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: Partial<Post>) {
    Object.assign(this, data);
  }
}
