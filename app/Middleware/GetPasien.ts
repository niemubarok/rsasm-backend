import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Pasien from 'App/Models/Pasien'

export default class GetPasien {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    const { noKtp, namaPasien, tglLahir } = request.body()
    try {
      const pasien = await Pasien.query()
        .where('no_ktp', noKtp)
        .orWhere((query) => {
          query.where('nm_pasien', 'like', `%${namaPasien}%`).where('tgl_lahir', tglLahir)
        })
        .first()

      if (!pasien) {
        response.status(404).json({
          message: 'pasien tidak ditemukan',
          isPasienBaru: true,
        })
      } else {
        request.updateBody(pasien)
        await next()
      }
    } catch (error) {
      response.json({
        message: error,
      })
    }
  }
}
