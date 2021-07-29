import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Database from '@ioc:Adonis/Lucid/Database'
import Pasien from 'App/Models/Pasien'

export default class PasiensController {
  public async index ({request}: HttpContextContract) {

    const namaPasienDariParam = request.body().nama
    const noKTP= request.body().ktp
    const tglLahir=request.body().tglLahir

    const pasien = await Pasien.query().where('no_ktp',noKTP ).orWhere((query)=>{
      query.where('nm_pasien', 'like', `%${namaPasienDariParam}%`).where('tgl_lahir', tglLahir)
    }).first()
    // pasien?.NoRM 
    pasien.NamaPasien = "Husni Mubarok"

    await pasien?.save()

    return pasien?.NamaPasien
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
