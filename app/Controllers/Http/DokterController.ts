import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { getHari } from 'App/services/utils'

export default class DokterController {
  public async index({ request, response }: HttpContextContract) {
    const hariKerja = getHari(request.body().data.hari)
    // console.log(request.body().data.hari)

    // return hariKerja
    const jadwal = await Database.rawQuery(
      'select jadwal.kd_dokter, jadwal.kd_poli, jadwal.hari_kerja, jadwal.jam_mulai, jadwal.jam_selesai, dokter.nm_dokter,poliklinik.nm_poli from jadwal inner join dokter on `jadwal`.`kd_dokter` = `dokter`.`kd_dokter` inner join poliklinik on `jadwal`.`kd_poli`=`poliklinik`.`kd_poli` WHERE jadwal.hari_kerja = ? And jadwal.kuota <> 0',
      [hariKerja]
    )

    console.log(jadwal[0])

    response.status(200).json({
      data: jadwal[0],
    })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
