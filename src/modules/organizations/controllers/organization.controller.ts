import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateOrganization } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/modules/authentication/guards/role-based';
import { BrandImagePipeInstance } from 'src/modules/storage/file-validations';
import { LoginGuard } from 'src/modules/authentication/guards/login/login.guard';
import { RoleGuard } from 'src/modules/authentication/guards/role-based/role.guard';
import { AddOrganization } from '../use-cases/add-organization';
import { created } from 'src/helpers/http';

@Controller('organization')
export class OrganizationController {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private addOrganization: AddOrganization) {}

  @Get()
  public async get() {
    return 'ok';
  }

  @UseGuards(LoginGuard, RoleGuard)
  @Roles('managers')
  @Post()
  @UseInterceptors(FileInterceptor('brand_image'))
  public async post(
    @UploadedFile(BrandImagePipeInstance) file: Express.Multer.File,
    @Body() data: CreateOrganization,
  ) {
    const res = await this.addOrganization.execute({
      name: data.name,
      file: file,
    });

    return created(res);
  }
}
