import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Poliklinik from 'App/Models/Poliklinik'

export default class PoliController {
  public async index({ response }: HttpContextContract) {
    const poli = Poliklinik.all()
    response.status(200).json({
      data: await poli,
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
