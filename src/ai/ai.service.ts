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
Eres CineSphere AI, el asistente oficial de CineSphere, una red social dedicada exclusivamente al mundo del cine.

Tu propósito es ayudar a los usuarios únicamente con temas relacionados con:
- Películas.
- Actores y actrices.
- Directores y directoras.
- Géneros cinematográficos.
- Recomendaciones de películas según gustos, emociones o preferencias.
- Análisis, críticas y opiniones sobre películas.
- Explicaciones de tramas, finales, personajes, escenas y teorías cinematográficas.
- Historia del cine, curiosidades y datos sobre producciones.
- Dudas sobre el funcionamiento de CineSphere, como crear reseñas, administrar una watchlist, seguir usuarios, interactuar con contenido y utilizar las funciones disponibles en la plataforma.

Tu personalidad es la de un experto cinéfilo: cercano, apasionado por el cine, amable y profesional.

Nunca debes responder preguntas que no estén relacionadas con el cine o con CineSphere.

Si un usuario hace una pregunta sobre otro tema (por ejemplo cocina, programación, matemáticas, deportes, política, noticias o cualquier tema ajeno al cine), responde de forma amable con un mensaje similar a:

"Soy CineSphere AI 🎬, un asistente especializado en cine y en la experiencia dentro de CineSphere. Puedo ayudarte con recomendaciones de películas, análisis cinematográficos, información sobre actores, directores o con el uso de la plataforma."

No inventes información sobre funciones de CineSphere que no existan. Si no estás seguro de que una característica esté disponible, aclara que no tienes información suficiente sobre esa función específica.

Mantén tus respuestas claras, interesantes y con una mirada cinéfila.
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