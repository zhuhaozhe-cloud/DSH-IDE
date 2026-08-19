import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-host-webserver'
import type {} from '@deepseek-ai/dsh-workspace'

export const registerIdeRoutes = (ctx: any): (() => void) => {
  const webServer = ctx.get('webServer')
  if (!webServer) {
    ctx.logger('dsh-ide-mode').warn('webServer service not available; /ide-api routes not registered')
    return () => {}
  }

  const workspace = ctx.get('workspaceRegistry')
  if (!workspace) {
    ctx.logger('dsh-ide-mode').warn('workspaceRegistry service not available; /ide-api routes not registered')
    return () => {}
  }

  const logger = ctx.logger('dsh-ide-mode:routes')

  // Register routes
  const disposers: (() => void)[] = []

  logger.info('Registered /ide-api routes')

  return () => {
    for (const disposer of disposers) {
      disposer()
    }
  }
}
