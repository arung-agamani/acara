import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Param,
  Body,
  Res,
  BadRequestException,
  Logger,
  UploadedFile,
  UseInterceptors,
  Head,
} from '@nestjs/common';
import { Response } from 'express';
import { AssetsService } from './assets.service';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.js': 'application/javascript',
    '.ts': 'application/typescript',
    '.html': 'text/html',
    '.css': 'text/css',
    '.csv': 'text/csv',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.ico': 'image/x-icon',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  private readonly logger = new Logger(AssetsController.name);

  @Get('presigned-url')
  async getPresignedUrl(
    @Query('key') key: string,
    @Query('expiresIn') expiresIn?: string,
  ) {
    if (!key) throw new BadRequestException('Missing key');
    const url = await this.assetsService.generatePresignedUrl(
      key,
      expiresIn ? parseInt(expiresIn) : 3600,
    );
    return { success: true, url };
  }

  @Get('object/:key(*)')
  async getObject(@Param('key') key: string, @Res() res: Response) {
    try {
      const decodedKey = decodeURIComponent(key);
      const data = await this.assetsService.getObject(decodedKey);
      if (!data.Body) throw new Error('No object body');
      // Set content-type and content-disposition if available, otherwise infer from extension
      let contentType = data.ContentType;
      if (!contentType) {
        const ext = path.extname(decodedKey).toLowerCase();
        this.logger.log(
          `[AssetsController] Resolved extension for key '${decodedKey}': '${ext}'`,
        );
        contentType = getMimeType(ext);
        this.logger.log(
          `[AssetsController] Resolved mimeType for extension '${ext}': '${contentType}'`,
        );
      }
      res.setHeader('Content-Type', contentType);
      if (data.ContentDisposition) {
        res.setHeader('Content-Disposition', data.ContentDisposition);
      }
      (data.Body as NodeJS.ReadableStream).pipe(res);
    } catch (err: any) {
      res.status(404).json({
        success: false,
        error: err && err.message ? err.message : 'Failed to fetch object',
        data: null,
      });
    }
  }

  @Get('object/:key(*)/exists')
  async objectExists(@Param('key') key: string) {
    try {
      const decodedKey = decodeURIComponent(key);
      const data = await this.assetsService.headObject(decodedKey);
      const {
        ContentType,
        ContentLength,
        LastModified,
        ETag,
        Metadata,
        ContentDisposition,
      } = data;
      return {
        success: true,
        data: {
          contentType: ContentType,
          contentLength: ContentLength,
          lastModified: LastModified,
          etag: ETag,
          metadata: Metadata,
          contentDisposition: ContentDisposition,
        },
      };
    } catch (err: any) {
      return {
        success: false,
        error: err && err.message ? err.message : 'Object not found',
        data: null,
      };
    }
  }

  @Get('list')
  async listObjects(@Query('prefix') prefix?: string) {
    const data = await this.assetsService.listObjects(prefix);
    const prefixStr = prefix || '';
    const list = (data.Contents || []).map((item: any) => ({
      key: prefixStr + (item.Key?.replace(prefixStr, '') ?? ''),
      size: item.Size,
    }));
    return { success: true, data: list };
  }

  @Post('object/:key(*)')
  @UseInterceptors(FileInterceptor('file'))
  async putObject(@Param('key') key: string, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Missing file');
    // Infer content type from file extension
    const decodedKey = decodeURIComponent(key);
    const ext = path.extname(decodedKey).toLowerCase();
    const contentType = getMimeType(ext);
    const data = await this.assetsService.putObject(
      decodedKey,
      file.buffer,
      contentType,
    );
    return { success: true, data };
  }

  @Delete('object/:key(*)')
  async deleteObject(@Param('key') key: string) {
    const decodedKey = decodeURIComponent(key);
    const data = await this.assetsService.deleteObject(decodedKey);
    return { success: true, data };
  }

  @Head('object/:key(*)')
  async headObject(@Param('key') key: string, @Res() res: Response) {
    try {
      const decodedKey = decodeURIComponent(key);
      await this.assetsService.headObject(decodedKey);
      res.status(200).end();
    } catch (err: any) {
      res.status(404).json({
        success: false,
        error: err && err.message ? err.message : 'Object not found',
      });
    }
  }
}
