import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { SavingsService } from '../savings/savings.service';
import { SavingsProduct } from '../savings/entities/savings-product.entity';
import { CreateProductDto } from '../savings/dto/create-product.dto';
import { UpdateProductDto } from '../savings/dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { ExperimentsService } from '../savings/experiments.service';

@ApiTags('admin/savings')
@Controller('admin/savings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminSavingsController {
  constructor(
    private readonly savingsService: SavingsService,
    private readonly experimentsService: ExperimentsService,
  ) {}

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a savings product (admin)' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created',
    type: SavingsProduct,
  })
  @ApiResponse({ status: 400, description: 'Invalid product data' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin required' })
  async createProduct(@Body() dto: CreateProductDto): Promise<SavingsProduct> {
    return await this.savingsService.createProduct(dto);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update a savings product (admin)' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated',
    type: SavingsProduct,
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin required' })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<SavingsProduct> {
    return await this.savingsService.updateProduct(id, dto);
  }

  @Post('experiments')
  @ApiOperation({ summary: 'Create a savings product experiment (admin)' })
  @ApiResponse({ status: 201, description: 'Experiment created' })
  async createExperiment(
    @Body()
    body: {
      key: string;
      name: string;
      description?: string;
      productId?: string;
      variants: Array<{
        key: string;
        weight: number;
        config: Record<string, any>;
      }>;
      configuration?: Record<string, any>;
      minSampleSize?: number;
      confidenceLevel?: number;
      status?: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
    },
  ) {
    return await this.experimentsService.createExperiment(body);
  }

  @Post('experiments/:id/assignments')
  @ApiOperation({ summary: 'Assign a user to an experiment variant (admin)' })
  @ApiResponse({ status: 200, description: 'User assigned to a variant' })
  async assignExperimentUser(
    @Param('id') id: string,
    @Body() body: { userId: string },
  ) {
    return await this.experimentsService.assignUser(id, body.userId);
  }

  @Post('experiments/:id/conversions')
  @ApiOperation({ summary: 'Track an experiment conversion event (admin)' })
  @ApiResponse({ status: 200, description: 'Conversion tracked' })
  async trackExperimentConversion(
    @Param('id') id: string,
    @Body()
    body: {
      userId: string;
      value?: number;
      metadata?: Record<string, any>;
    },
  ) {
    return await this.experimentsService.trackConversion(
      id,
      body.userId,
      body.value ?? 1,
      body.metadata,
    );
  }

  @Post('experiments/:id/dashboard')
  @ApiOperation({ summary: 'Get experiment dashboard statistics (admin)' })
  @ApiResponse({ status: 200, description: 'Experiment dashboard' })
  async getExperimentDashboard(
    @Param('id') id: string,
  ): Promise<Record<string, unknown>> {
    return await this.experimentsService.getDashboard(id);
  }
}
