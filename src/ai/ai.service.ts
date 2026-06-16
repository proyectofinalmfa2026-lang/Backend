import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';

import { ChatAiDto } from './dto/chat-ai.dto';

@Injectable()
export class AiService {

  constructor(
    private readonly httpService: HttpService,
  ) {}

  async chat(
    chatAiDto: ChatAiDto,
  ) {
    const response = await firstValueFrom(
      this.httpService.post(
        'http://localhost:11434/api/generate',
        {
          model: 'gemma2:2b',
          prompt: `
Eres CineSphere AI, un experto en cine integrado dentro de una red social de películas.

Tu función es ayudar a los usuarios a:
- descubrir nuevas películas,
- recomendar películas según gustos y géneros,
- hablar de directores, actores y la historia del cine,
- explicar argumentos y analizar obras cinematográficas.

Responde siempre de manera amigable, profesional y apasionada por el cine.
Habla como si formaras parte de la plataforma CineSphere.

Pregunta del usuario:
${chatAiDto.message}
          `,
          stream: false,
        },
      ),
    );

    return {
      response: response.data.response,
    };
  }
}