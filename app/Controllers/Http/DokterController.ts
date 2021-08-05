import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class DokterController {
  public async index({ request, response }: HttpContextContract) {
    const hariKerja = request.body().data.hari

    const jadwal = await Database.rawQuery(
      'select jadwal.kd_dokter, jadwal.kd_poli, jadwal.hari_kerja, jadwal.jam_mulai, jadwal.jam_selesai, dokter.nm_dokter,poliklinik.nm_poli, praktek_dokter.isPraktek from jadwal inner join dokter on `jadwal`.`kd_dokter` = `dokter`.`kd_dokter` inner join poliklinik on `jadwal`.`kd_poli`=`poliklinik`.`kd_poli` inner join praktek_dokter on `jadwal`.`kd_dokter` = `praktek_dokter`.`kd_dokter` WHERE jadwal.hari_kerja = ?',
      [hariKerja]
    )

    // console.log(jadwal)

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
