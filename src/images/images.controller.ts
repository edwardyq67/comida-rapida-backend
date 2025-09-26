import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Param, Query } from '@nestjs/common';
@Controller('images')
export class ImagesController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('test')
  test() {
    return {
      success: true,
      message: 'Images controller is working!',
      endpoints: [
        'POST /images/upload',
        'POST /images/upload-from-url',
        'DELETE /images/delete',
        'PUT /images/update',
        'GET /images/info/:publicId',
      ],
    };
  }

  @Get('info/:publicId')
  async getImageInfo(@Param('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('No public ID provided');
    }

    try {
      const imageInfo = await this.cloudinaryService.getImageInfo(publicId);
      return {
        success: true,
        imageInfo,
        message: 'Image info retrieved successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Error getting image info: ${error.message}`,
      );
    }
  }

  @Get('list')
  async listImages(@Query('folder') folder: string = 'products') {
    try {
      const images = await this.cloudinaryService.listImages(folder);
      return {
        success: true,
        images,
        message: 'Images listed successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Error listing images: ${error.message}`);
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string = 'products',
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const imageUrl = await this.cloudinaryService.uploadImage(file, folder);
      return {
        success: true,
        imageUrl,
        message: 'Image uploaded successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Error uploading image: ${error.message}`);
    }
  }

  @Post('upload-from-url')
  async uploadImageFromUrl(@Body() body: { url: string; folder?: string }) {
    if (!body.url) {
      throw new BadRequestException('No URL provided');
    }

    try {
      const imageUrl = await this.cloudinaryService.uploadImageFromUrl(
        body.url,
        body.folder || 'products',
      );
      return {
        success: true,
        imageUrl,
        message: 'Image uploaded from URL successfully',
      };
    } catch (error) {
      throw new BadRequestException(
        `Error uploading image from URL: ${error.message}`,
      );
    }
  }

  @Delete('delete')
  async deleteImage(@Body() body: { imageUrl: string }) {
    if (!body.imageUrl) {
      throw new BadRequestException('No image URL provided');
    }

    try {
      await this.cloudinaryService.deleteImageByUrl(body.imageUrl);
      return {
        success: true,
        message: 'Image deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Error deleting image: ${error.message}`);
    }
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('oldImageUrl') oldImageUrl: string,
    @Body('folder') folder: string = 'products',
  ) {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    try {
      const newImageUrl = await this.cloudinaryService.updateImage(
        oldImageUrl,
        file,
        folder,
      );
      return {
        success: true,
        imageUrl: newImageUrl,
        message: 'Image updated successfully',
      };
    } catch (error) {
      throw new BadRequestException(`Error updating image: ${error.message}`);
    }
  }
}
