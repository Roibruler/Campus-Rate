import 'dotenv/config';
import { existsSync, readFileSync } from 'node:fs';
import { createServer as createHttpRedirectServer } from 'node:http';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { json, urlencoded } from 'express';
import { ProblemDetailsFilter } from './common/filters/problem-details.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

const TAILLE_MAX_CORPS = '10kb';

function chargerOptionsHttps(): { key: Buffer; cert: Buffer } | undefined {
  const httpsActive = process.env.HTTPS_ENABLED === 'true';
  if (!httpsActive) {
    return undefined;
  }

  const keyPath = process.env.SSL_KEY_PATH;
  const certPath = process.env.SSL_CERT_PATH;

  if (!keyPath || !certPath || !existsSync(keyPath) || !existsSync(certPath)) {
    throw new Error(
      'HTTPS_ENABLED=true mais SSL_KEY_PATH/SSL_CERT_PATH sont manquants ou introuvables. ' +
        'Voir la section HTTPS du README pour générer un certificat local autosigné.',
    );
  }

  return { key: readFileSync(keyPath), cert: readFileSync(certPath) };
}

async function bootstrap() {
  const httpsOptions = chargerOptionsHttps();

  const app = await NestFactory.create(AppModule, { bodyParser: false, httpsOptions });
  app.use(json({ limit: TAILLE_MAX_CORPS }));
  app.use(urlencoded({ extended: true, limit: TAILLE_MAX_CORPS }));

  app.getHttpAdapter().getInstance().set('query parser', 'simple');

  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('NODE_ENV') ?? 'development';
  const isProduction = nodeEnv === 'production';

  app.use(helmet());

  const corsOrigins = (configService.get<string>('CORS_ORIGINS') ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (isProduction && corsOrigins.length === 0) {
    throw new Error(
      "CORS_ORIGINS doit être défini explicitement lorsque NODE_ENV=production.",
    );
  }

  app.enableCors({
    origin: corsOrigins.length > 0 ? corsOrigins : ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: false,
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new ProblemDetailsFilter());

  const config = new DocumentBuilder()
    .setTitle('CampusRate')
    .setDescription("API REST permettant de consulter des endroits du campus et de publier des appréciations")
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = configService.get<number>('PORT')!;
  await app.listen(port);

  const protocole = httpsOptions ? 'https' : 'http';
  console.log(`CampusRate démarré sur ${protocole}://localhost:${port}/v1`);

  if (httpsOptions) {
    const redirectPort = configService.get<number>('HTTP_REDIRECT_PORT') ?? port + 1;
    createHttpRedirectServer((req, res) => {
      const hote = (req.headers.host ?? `localhost:${port}`).split(':')[0];
      res.writeHead(301, { Location: `https://${hote}:${port}${req.url}` });
      res.end();
    }).listen(redirectPort, () => {
      console.log(`Redirection HTTP -> HTTPS active sur http://localhost:${redirectPort}`);
    });
  }
}
void bootstrap();
