import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import BookingRegistrasi from 'App/Models/BookingRegistrasi'
import { DateTime } from 'luxon'
// import { sendWhatsappMessage } from 'App/services/whatsappService'
import { createQRCode } from 'App/services/utils'
// import axios from 'axios'
// import QrCode from 'qrcode'

export default class PendaftaranPasienLamaController {
  public async test({ request, response }: HttpContextContract) {
    // const qr =
    // sendWhatsappMessage({
    //   contact: '6285524914191',
    //   qrcode: await createQRCode(),
    //   message: 'haaai',
    // })

    response.json({
      data: request.body(),
    })
  }

  public async store({ request, response }: HttpContextContract) {
    // return request.original()
    //Mengambil data dari request original
    const { data } = request.original()

    //mengambil data dari request yang sudah diupdate di middleware getPasien
    const { noRM } = request.body()

    console.log(noRM)
    console.log(data)
    return false

    //mengambil nomor antrian terakhir dari tabel booking registrasi
    //berdasarkan tgl periksa, kode dokter dan kode poli
    const getMaxAntrian = Database.from('booking_registrasi')
      .where('tanggal_periksa', data.tgl_periksa)
      .where('kd_dokter', data.kd_dokter)
      .where('kd_poli', data.kd_poli)
      .max('no_reg as no_antrian')
      .first()

    //nomor antrian selanjutnya
    const noAntrian = getMaxAntrian.then((antrian) => {
      return parseInt(antrian.no_antrian) + 1 || 1
    })

    //CEK DULU APAKAH PASIEN SUDAH TERDAFTAR KE DOKTER YANG SAMA DAN HARI YANG SAMA
    const isPatientRegistered = await BookingRegistrasi.query()
      .where('no_rkm_medis', noRM)
      .where('tanggal_periksa', data.tgl_periksa)
      .where('kd_dokter', data.kd_dokter)
      .where('kd_poli', data.kd_poli)
      .first()

    console.log('isPatientRegistered:' + isPatientRegistered)

    //jika pasien sudah terdaftar
    if (isPatientRegistered) {
      response.status(200).json({
        data: {
          isRegistered: true,
        },
      })
    } else {
      //JIKA PASIEN BELUM TERDAFTAR
      //DAFTARKAN DI BOOKING TABLE
      try {
        //insert data ke table booking registrasi
        const bookingTable = await BookingRegistrasi.create({
          TanggalBooking: DateTime.now(),
          JamBooking: DateTime.now().toFormat('HH:MM:ss'),
          TanggalPeriksa: data.tgl_periksa,
          CheckIn: '',
          NoRM: noRM,
          KodeDokter: data.kd_dokter,
          KodePoli: data.kd_poli,
          KodePJ: data.kd_pj,
          NomorAntrian: await noAntrian,
          status: 'Belum',
        })

        console.log(bookingTable.$isPersisted)

        //JIKA BERHASIL INSERT DATA KE TABEL BOOKING REGISTRASI
        if (bookingTable.$isPersisted) {
          //kirim response ke frontend
          response.status(201).json({
            message: 'sudah terdaftar',
            nomorAntrian: noAntrian,
            qrcode: createQRCode(),
          })

          // kirim whatsapp ke pasien
          // sendWhatsappMessage({
          //   contact: '6285524914191',
          //   message: 'haaai',
          //   qrcode: await createQRCode(),
          // })
        } else {
          //jika gagal memasukan data ke booking tabel
          response.status(500).json({
            message: 'gagal insert data',
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
