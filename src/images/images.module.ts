import { Module } from '@nestjs/common';
import { ImagesController } from './images.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [ImagesController],
})
export class ImagesModule {}
