import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  })
  app.enableShutdownHooks()

  const logger = new Logger('Bootstrap')
  logger.log(
    typeof process.send === 'function'
      ? 'Engine no ar, canal IPC aberto'
      : 'Engine no ar sem IPC — abra pelo app Electron',
  )

  // O contexto não escuta HTTP. O timer segura o event loop até o Electron encerrar.
  setInterval(() => undefined, 60_000)
}

void bootstrap()
