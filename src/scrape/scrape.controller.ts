import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ScrapeService } from './scrape.service';

@ApiTags('scrape')
@Controller('scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  @Post('url')
  @ApiOperation({ summary: 'Scrape vocabulary from a URL and train the model' })
  @ApiBody({
    schema: {
      properties: { url: { type: 'string', example: 'http://example.com' } },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Vocabulary scraped and model trained.',
  })
  async scrapeUrl(@Body('url') url: string) {
    return this.scrapeService.scrapeAndTrain(url);
  }

  @Post('meaning')
  @ApiOperation({
    summary: 'Get the meaning of a word using the trained AI model',
  })
  @ApiBody({
    schema: { properties: { word: { type: 'string', example: 'example' } } },
  })
  @ApiResponse({
    status: 200,
    description: 'AI model returns the meaning of the word.',
  })
  async getMeaning(@Body('word') word: string) {
    return this.scrapeService.getMeaning(word);
  }

  @Get('vocabulary')
  @ApiOperation({
    summary: 'Get the current vocabulary list',
  })
  @ApiResponse({
    status: 200,
    description: 'Current vocabulary list retrieved successfully.',
  })
  @ApiQuery({
    name: 'all',
    required: false,
    description: 'Number of items to return',
    type: 'string',
    example: 'false',
  })
  async getVocabulary(@Query('all') all: string = 'false') {
    return this.scrapeService.getVocabulary(all === 'true');
  }
}
