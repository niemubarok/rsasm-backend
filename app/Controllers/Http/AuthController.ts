import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    response.status(200).json({
      data: 'tes',
    })
  }
}
