import { Injectable, BadRequestException } from '@nestjs/common';
import { Place } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ImageObject } from './types/image-object';
import { CloudinaryService } from './cloudinary.service';


@Injectable()
export class PlaceService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) { }

  async findAll() {
    return this.prisma.place.findMany();
  }

  async create(data: { name: string, type: any, phone: string, latitude: number, longitude: number, imagens: ImageObject[] }) {
    return this.prisma.place.create({ data });
  }

  async update(id: string, data: Partial<Place>, newImages?: Buffer[]): Promise<Place> {
    const place = await this.prisma.place.findUnique({ where: { id } });
    if (!place) throw new BadRequestException('Local não encontrado');

    let imagens = place.imagens as ImageObject[];
    
    // Se forem enviadas novas imagens
    if (newImages && newImages.length > 0) {
      // Deletar imagens antigas
      await Promise.all(imagens.map(img => this.cloudinaryService.deleteImage(img.public_id)));
      // Upload das novas imagens
      imagens = await Promise.all(newImages.map(file => this.cloudinaryService.uploadImage(file)));
    }

    return this.prisma.place.update({
      where: { id },
      data :{
        ...data,
        ...(newImages ? { imagens: JSON.parse(JSON.stringify(imagens)) } : {}),
      },
    });
  }

  async delete(id: string): Promise<void> {
    const place = await this.prisma.place.findUnique({ where: { id } });
    if (!place) throw new BadRequestException('Local não encontrado');
    const images = place.imagens as ImageObject[];
    await Promise.all(images.map(img => this.cloudinaryService.deleteImage(img.public_id)));
    await this.prisma.place.delete({ where: { id } });
  }

}