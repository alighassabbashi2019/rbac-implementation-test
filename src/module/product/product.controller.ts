import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductEntity } from './model/product.entity';
import { CreateProductDto } from './dto';
import { Roles } from '@decorator/role.decorator';
import { AuthGuard } from '@guard/auth.guard';
import { RoleGuard } from '@guard/role.guard';
import { ActionEnum, RoleEnum } from '@constant/enum';
import { Permissions } from '@decorator/required-permissions.decorator';

@Controller('product')
@UseGuards(AuthGuard, RoleGuard)
@Roles(RoleEnum.ADMIN, RoleEnum.CUSTOMER)
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  @Get('/')
  @Permissions(ActionEnum.PRODUCT_READ_ALL)
  getAllProducts() {
    return this.productService.findAll();
  }

  @Post('/')
  @Permissions(ActionEnum.PRODUCT_CREATE)
  createProduct(@Body() createProductDto: CreateProductDto): Promise<ProductEntity> {
    return this.productService.create(createProductDto);
  }
}
