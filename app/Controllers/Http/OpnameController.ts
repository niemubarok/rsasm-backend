import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Depo from 'App/Models/Depo'

export default class OpnameController {
  public async depo({ response }: HttpContextContract) {
    const depos = await Depo.all()
    response.status(200).json({
      data: depos,
    })
  }

  public async obat({ response }: HttpContextContract) {
    // const obat = await Database.rawQuery(
    //   'select databarang.kode_brng, databarang.nama_brng, databarang.kode_sat,kodesatuan.satuan, databarang.h_beli from databarang inner join kodesatuan on databarang.kode_sat = kodesatuan.kode_sat'
    // )

    const obat = await Database.from('databarang')
      .innerJoin('kodesatuan', 'databarang.kode_sat', 'kodesatuan.kode_sat')
      .select(
        'databarang.kode_brng',
        'databarang.nama_brng',
        'databarang.kode_sat',
        'kodesatuan.satuan',
        'databarang.h_beli'
      )

    response.status(200).json({
      data: obat,
    })
  }

  public async store({ request, response }: HttpContextContract) {
    //define variable
    const req = request.body().data
    const kode_brng = req.kode_brng
    const kd_bangsal = req.kd_bangsal
    const h_beli = req.h_beli
    const tanggal = req.tanggal
    const date = new Date()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const jam = `${hour}:${minute}:${second}`

    //ambil stok awal yg ada di gudang barang
    const getStok = await Database.from('gudangbarang')
      .where({
        kd_bangsal,
        kode_brng,
      })
      .select('stok')

    //cek apakah sebelumnya sdh di SO
    const isOpnamed = await Database.from('opname')
      .where({
        kd_bangsal,
        kode_brng,
        tanggal,
      })
      .select('real')
    const real = isOpnamed.length === 0 ? req.real : isOpnamed[0].real + req.real

    const stok = getStok[0]?.stok ? getStok[0]?.stok : 0
    const selisih = real <= stok ? stok - real : 0
    const nomihilang = selisih !== 0 ? h_beli * selisih : 0
    const lebih = real >= stok ? real - stok : 0
    const nomilebih = lebih !== 0 ? h_beli * lebih : 0
    const keterangan = req.petugas

    const no_batch = ''
    const no_faktur = ''
    const petugas = req.petugas
    const stok_awal = getStok[0]?.stok ? getStok[0]?.stok : 0

    //store ke table opname
    try {
      await Database.table('opname').insert({
        kode_brng,
        h_beli,
        tanggal,
        stok,
        real,
        selisih,
        nomihilang,
        lebih,
        nomilebih,
        keterangan,
        kd_bangsal,
        no_batch,
        no_faktur,
      })

      //store ke table gudangbarang
      try {
        if (getStok.length !== 0) {
          await Database.from('gudangbarang')
            .where({
              kode_brng,
              kd_bangsal,
            })
            .update({
              kode_brng,
              kd_bangsal,
              stok: real,
              no_batch,
              no_faktur,
            })
        } else {
          await Database.table('gudangbarang').insert({
            kode_brng,
            kd_bangsal,
            stok: real,
            no_batch,
            no_faktur,
          })
        }

        //store ke table riwayat_obat
        try {
          await Database.table('riwayat_barang_medis').insert({
            kode_brng,
            stok_awal,
            masuk: real,
            keluar: 0,
            stok_akhir: real,
            posisi: 'Opname',
            tanggal,
            jam,
            petugas,
            kd_bangsal,
            status: 'Simpan',
            no_batch,
            // no_faktur,
          })
          response.json({
            message: 'success',
          })
        } catch (error) {
          console.log('executed onerror riwayat')
          //hapus data yg diopname
          await Database.from('opname')
            .where({
              kd_bangsal,
              kode_brng,
              real,
              tanggal,
            })
            .del()

          //kembalikan stok awal
          await Database.from('gudangbarang')
            .where({
              kode_brng,
              kd_bangsal,
            })
            .update({
              kode_brng,
              kd_bangsal,
              stok,
              no_batch,
              no_faktur,
            })
          // response gagal
          response.json({
            error: 'gagal menyimpan ke tabel riwayat_barang_medis',
          })
        }

        //jika gagal insert ke tabel gudangbarang maka hapus data ditable opname
      } catch (error) {
        console.log('executed onerror gudangbarang')
        console.log(error)

        await Database.from('opname')
          .where({
            kd_bangsal: req.kd_bangsal,
            kode_brng: req.kode_brng,
            tanggal,
          })
          .del()

        response.json({
          message: 'berhasil hapus tabel opname',
          error: 'gagal menyimpan ke tabel gudangbarang',
        })
      }
    } catch (error) {
      response.json({
        error,
      })
      //jika berhasil
    }
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
