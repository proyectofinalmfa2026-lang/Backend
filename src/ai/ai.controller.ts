import {
  Controller,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AiService } from './ai.service';
import { ChatAiDto } from './dto/chat-ai.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';



@ApiTags('AI')
@Controller('ai')
export class AiController {
  constructor(
    private readonly aiService: AiService,
  ) {}

  @Post('chat')
  @UseGuards(
    JwtAuthGuard,
  )
  @ApiBearerAuth()
  chat(
    @Body() chatAiDto: ChatAiDto,
  ) {
    return this.aiService.chat(chatAiDto);
  }
}