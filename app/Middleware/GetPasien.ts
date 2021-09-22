import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Pasien from 'App/Models/Pasien'

export default class GetPasien {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    //AMBIL DATA PASIEN DARI FRONTEND
    const { data: req } = request.body()

    let dataToReturn = {}

    try {
      //CARI PASIEN DI DATABASE
      const pasienFromDB = await Pasien.query()
        .where('no_ktp', req.noKtp)
        // .where('nm_pasien', 'like', `%${req.namaPasien}%`)
        .orWhere((query) => {
          console.log(req.namaPasien)
          query.where('nm_pasien', 'like', `%${req.namaPasien}%`).where('tgl_lahir', req.tglLahir)
        })
        .first()

      dataToReturn = pasienFromDB || {}

      //JIKA PASIEN TIDAK DITEMUKAN DI DATABASE
      if (Object.keys(dataToReturn).length === 0) {
        //BERARTI PASIEN ADALAH PASIEN BARU
        //RETURN null
        response.json({
          data: null,
          message: 'pasien tidak ditemukan',
        })
      } else {
        //jika pasien ditemukan di database
        //update request body
        request.updateBody({
          pasien: dataToReturn,
          original_request: request.body(),
        })
        await next()
        // response.json({
        //   data: {
        //     pasien: { dataToReturn },
        //     original_request: request.body()
        //   }
        // })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
