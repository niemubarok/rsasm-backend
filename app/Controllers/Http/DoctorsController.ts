import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Dokter from 'App/Models/Dokter'
// import JadwalDokter from 'App/Models/JadwalDokter'

export default class DoctorsController {
  public async index({ request }: HttpContextContract) {
    const dokter = Dokter.findBy('id', request.param('id'))
    // const jadwal = JadwalDokter.all()
    // const jadwalDokter =

    return dokter
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
