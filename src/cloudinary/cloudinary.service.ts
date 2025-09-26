import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(@Inject('CLOUDINARY') private readonly cloudinaryConfig) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          format: 'webp',
          quality: 'auto',
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
          } else if (result && result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('No result from Cloudinary upload'));
          }
        },
      );

      // Convertir buffer a stream
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);

      readableStream.pipe(uploadStream);
    });
  }

  async uploadImageFromUrl(
    imageUrl: string,
    folder: string = 'products',
  ): Promise<string> {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: folder,
        resource_type: 'image',
        format: 'webp',
        quality: 'auto',
      });

      if (!result || !result.secure_url) {
        throw new Error('No result from Cloudinary upload');
      }

      return result.secure_url;
    } catch (error) {
      throw new Error(`Error uploading image from URL: ${error.message}`);
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      if (result.result !== 'ok') {
        throw new Error(`Failed to delete image: ${result.result}`);
      }
    } catch (error) {
      throw new Error(`Error deleting image: ${error.message}`);
    }
  }

  async deleteImageByUrl(imageUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicIdFromUrl(imageUrl);
      if (publicId) {
        await this.deleteImage(publicId);
      } else {
        throw new Error('Could not extract public ID from URL');
      }
    } catch (error) {
      throw new Error(`Error deleting image by URL: ${error.message}`);
    }
  }

  private extractPublicIdFromUrl(url: string): string | null {
    try {
      // La URL de Cloudinary tiene el formato:
      // https://res.cloudinary.com/cloudname/image/upload/v1234567/folder/public_id.jpg
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');

      // Buscar el índice de 'upload' y tomar todo lo que sigue
      const uploadIndex = pathParts.indexOf('upload');
      if (uploadIndex === -1) return null;

      const publicIdWithVersion = pathParts.slice(uploadIndex + 1).join('/');

      // Remover la versión si existe (v1234567/)
      const publicId = publicIdWithVersion.replace(/^v\d+\//, '');

      // Remover la extensión del archivo
      return publicId.replace(/\.[^/.]+$/, '');
    } catch {
      return null;
    }
  }

  async updateImage(
    oldImageUrl: string,
    newFile: Express.Multer.File,
    folder: string = 'products',
  ): Promise<string> {
    try {
      // Eliminar la imagen anterior si existe
      if (oldImageUrl && oldImageUrl.trim() !== '') {
        await this.deleteImageByUrl(oldImageUrl);
      }

      // Subir la nueva imagen
      return await this.uploadImage(newFile, folder);
    } catch (error) {
      throw new Error(`Error updating image: ${error.message}`);
    }
  }

  // Método adicional útil: Obtener información de la imagen
  async getImageInfo(publicId: string): Promise<any> {
    try {
      const result = await cloudinary.api.resource(publicId);
      return result;
    } catch (error) {
      throw new Error(`Error getting image info: ${error.message}`);
    }
  }

  // Método adicional: Listar imágenes en una carpeta
  async listImages(folder: string = 'products'): Promise<any> {
    try {
      const result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folder,
        max_results: 100,
      });
      return result;
    } catch (error) {
      throw new Error(`Error listing images: ${error.message}`);
    }
  }
}
