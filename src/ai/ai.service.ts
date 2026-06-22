import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

import { firstValueFrom } from 'rxjs';

import { ChatAiDto } from './dto/chat-ai.dto';

@Injectable()
export class AiService {

  constructor(
  private readonly httpService: HttpService,
  private readonly configService: ConfigService,
) {}

  async chat(
  chatAiDto: ChatAiDto,
) {

  const response = await firstValueFrom(
    this.httpService.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: this.configService.get<string>('GROQ_MODEL'),
        messages: [
          {
            role: 'system',
            content: `
Eres CineSphere AI, un experto en cine integrado dentro de una red social de películas.

Tu función es ayudar a los usuarios a:
- descubrir nuevas películas,
- recomendar películas según gustos y géneros,
- hablar de directores, actores y la historia del cine,
- explicar argumentos y analizar obras cinematográficas.

Responde siempre de manera amigable, profesional y apasionada por el cine.
Habla como si formaras parte de la plataforma CineSphere.
            `,
          },
          {
            role: 'user',
            content: chatAiDto.message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${this.configService.get<string>('GROQ_API_KEY')}`,
          'Content-Type': 'application/json',
        },
      },
    ),
  );

  return {
    response: response.data.choices[0].message.content,
  };
}
}