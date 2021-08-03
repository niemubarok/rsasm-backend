import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Dokter from 'App/Models/Dokter'
import JadwalDokter from 'App/Models/JadwalDokter'
import Poliklinik from 'App/Models/Poliklinik'
import { getHariIni } from 'App/services/utils'

export default class DokterController {
  public async index({ response }: HttpContextContract) {
    //Get dokter yang praktek hari ini
    const hariIni = getHariIni()
    const dokterHariIni = JadwalDokter.query().preload('dokter').where('HariKerja', hariIni)

    const namaPoli = dokterHariIni.then((data) => {
      return data.forEach(async (each) => {
        const poli = await Poliklinik.query().where('kd_poli', each.kodePoli).first()
        console.log(poli?.namaPoli)
        return poli
      })
    })

    console.log(await namaPoli)

    response.json({
      namaPoli: await namaPoli,
      data: await dokterHariIni,
    })
    // console.log(await dokter)

    // const poli = await Poliklinik.query().preload('jadwalDokter')
    //Get dokter yang praktek sesuai tanggal yang dicari
    // return dokter
    // response.json({
    //   data: {
    //     id: await dokter,
    //     name: 'dr. Vincent',
    //     specialist: 'Gigi',
    //     date: '14-06-2021',
    //     time: {
    //       start: '07.50',
    //       end: '08.50',
    //     },
    //     url: 'https://cdn.quasar.dev/img/avatar4.jpg',
    //   },
    // })
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
