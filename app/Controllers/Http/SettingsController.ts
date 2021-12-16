import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Setting from 'App/Models/KhanzaSetting'

export default class SettingsController {
  public async index({ response }: HttpContextContract) {
    const setting = await Setting.first()
    response.json({
      data: setting,
    })
  }
}
