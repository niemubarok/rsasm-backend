import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Depo from 'App/Models/Depo'
import TempOpname from 'App/Models/TempOpname'

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
    // return req
    const kode_brng = req.kode_brng
    const kd_bangsal = req.kd_bangsal
    const h_beli = req.h_beli
    const date = new Date()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const jam = `${hour}:${minute}:${second}`
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const tanggal = year + "-" + month + "-" + day




    //cek apakah sebelumnya sdh di SO
    const isOpnamed = await Database.from('opname')
      .where({
        kd_bangsal,
        kode_brng,
        tanggal,
      })
      .sum('real as real')

    //jumlah obat real sesuai fisik
    //ambil stok dari gudangbarang
    const stokFromGudangBarang = await Database.from('gudangbarang')
      .where({
        kd_bangsal,
        kode_brng,
      })
      .select('stok')


    //ambil stok dari temp_opnames
    const stokFromTempOpnames = await Database.from('temp_opnames').where({
      kode_brng,
      kd_bangsal,
      tanggal
    }).select('stok')

    const defineStok = () => {
      // jika belum opname ambil stok dari gudangbarang
      if (isOpnamed[0]?.real === null) {
        //jika di table gudangbarang tidak ditemukan kd_barang stok 0
        return stokFromGudangBarang[0]?.stok ? stokFromGudangBarang[0]?.stok : 0
      } else { //jika sudah opname ambil stok dari temp_opnames
        return stokFromTempOpnames[0]?.stok ? stokFromTempOpnames[0]?.stok : 0
      }
    }

    const stok = defineStok()

    const real = isOpnamed[0]?.real === null ? req.real : isOpnamed[0]?.real + req.real

    //jika sudah opname selisih stok dari temp_onames dikurangi real
    //jika belum opname selisih stok dari gudangbarang dikurangi real
    const selisih = real <= stok ? stok - real : 0
    const nomihilang = selisih !== 0 ? h_beli * selisih : 0
    const lebih = real >= stok ? real - stok : 0
    // return stok

    const nomilebih = lebih !== 0 ? h_beli * lebih : 0
    const keterangan = isOpnamed[0]?.real === null ? "Via web oleh " + req.petugas : "Obat tambahan oleh " + req.petugas

    const no_batch = ''
    const no_faktur = ''
    const petugas = req.petugas
    const stok_awal = stokFromGudangBarang[0]?.stok ? stokFromGudangBarang[0]?.stok : 0





    // const tempOpname = await TempOpname.firstOrCreate({
    //   kode_brng,
    //   kd_bangsal,
    //   tanggal
    // }, {
    //   stok,
    // })

    //store ke table opname
    try {

      //input hanya saat pertama kali di opname
      const tempOpname = await TempOpname.query().where({
        kode_brng,
        kd_bangsal,
        tanggal
      }).first()

      // return tempOpname === null
      if (tempOpname === null) {

        await Database.table('temp_opnames').insert({
          kode_brng,
          kd_bangsal,
          tanggal,
          stok,
        })
      }
      //jika sudah diopname update data opname
      if (isOpnamed[0].real !== null) {
        await Database.from('opname')
          .where({
            kode_brng,
            kd_bangsal,
            tanggal
          })
          .update({
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
      } else {
        //jika belum diopname, input ke table opname dan tabel temp opname

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
      }


      //store ke table gudangbarang
      try {
        if (stokFromGudangBarang.length !== 0) {
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
            no_faktur,
          })
          response.json({
            message: 'success',
          })
        } catch (error) {
          console.log('executed onerror riwayat')
          console.log(error);

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

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
