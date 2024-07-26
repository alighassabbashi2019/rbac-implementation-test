import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from './model/product.repository';
import { UserModule } from '@user/user.module';
import { RolePermissionRepository } from '@authentication/model';

const repositories = [ProductRepository, RolePermissionRepository];

@Module({
  imports: [TypeOrmModule.forFeature(repositories), UserModule],
  controllers: [ProductController],
  providers: [...repositories, ProductService],
  exports: [ProductService],
})
export class ProductModule {
}
