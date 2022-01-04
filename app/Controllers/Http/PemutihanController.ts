import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'

export default class PemutihanController {
  public async index({ }: HttpContextContract) {
  }

  public async create({ }: HttpContextContract) {
  }

  public async store({ }: HttpContextContract) {

  }

  public async show({ }: HttpContextContract) {
  }

  public async edit({ response }: HttpContextContract) {
    // const ObatFromOpname = await Database.from('opname').where({
    //   tanggal: "2021-12-26",
    // }).select('kode_brng', 'kd_bangsal')

    // const kode_brng = ObatFromOpname[0]?.kode_brng
    // const kd_bangsal = ObatFromOpname[0]?.kd_bang

    // const dataFromGudangBarang = () => {
    //   let data = []

    //   ObatFromOpname.forEach(async each => {
    //     const kode_brng = each?.kode_brng
    //     const kd_bangsal = each?.kd_bangsal

    //     const gudangBarang = await Database.from('gudangbarang').where({
    //       kode_brng,
    //       kd_bangsal
    //     }).count('*')

    //     console.log(gudangBarang[0]);


    //     data = gudangBarang[0]


    //     // return gudangBarang[0]
    //     // data = gudangBarang[0]?.stok
    //   })
    //   return data
    // }

    // dataFromGudangBarang()


    // const gudangBarang = await Database.from('gudangbarang').where({
    //   kode_brng,
    //   kd_bangsal
    // }).count('stok')

    // console.log(gudangBarang);

    const whereNotIn = await Database.from('gudangbarang')
      .whereNotIn(['kode_brng', 'kd_bangsal'],
        Database.from('opname').select('kode_brng', 'kd_bangsal').where({
          tanggal: "2021-12-26"
        }))

    console.log(whereNotIn);



    // console.log(await dataFromGudangBarang);


    // response.json({
    //   gudangBarang
    // })
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
