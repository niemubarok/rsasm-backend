import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import BookingRegistrasi from 'App/Models/BookingRegistrasi'
import { DateTime } from 'luxon'
import { sendWhatsappMessage } from 'App/services/whatsappService'
import { createQRCode } from 'App/services/utils'
import QrCode from 'qrcode'

export default class PendaftaranPasienLamaController {
  public async test({ request, response }: HttpContextContract) {
    // const qr =
    sendWhatsappMessage({
      contact: '6285524914191',
      qrcode: await createQRCode(),
      message: 'haaai',
    })
  }

  public async store({ request, response }: HttpContextContract) {
    // return request.original()
    //Mengambil data dari request original
    const { tglPeriksa, kodeDokter, kodePoli, kodePJ } = request.original()

    //mengambil data dari request yang sudah diupdate di middleware getPasien
    const { noRM } = request.body()

    //mengambil nomor antrian terakhir dari tabel booking registrasi
    //berdasarkan tgl periksa, kode dokter dan kode poli
    const getMaxAntrian = Database.from('booking_registrasi')
      .where('tanggal_periksa', tglPeriksa)
      .where('kd_dokter', kodeDokter)
      .where('kd_poli', kodePoli)
      .max('no_reg as no_antrian')
      .first()

    //nomor antrian selanjutnya
    const noAntrian = getMaxAntrian.then((antrian) => {
      return parseInt(antrian.no_antrian) + 1 || 1
    })

    try {
      //insert data ke table booking registrasi
      const bookingTable = await BookingRegistrasi.create({
        TanggalBooking: DateTime.now(),
        JamBooking: DateTime.now().toFormat('HH:MM:ss'),
        TanggalPeriksa: tglPeriksa,
        CheckIn: '',
        NoRM: noRM,
        KodeDokter: kodeDokter,
        KodePoli: kodePoli,
        KodePJ: kodePJ,
        NomorAntrian: await noAntrian,
        status: 'Belum',
      })

      //JIKA BERHASIL INSERT DATA KE TABEL BOOKING REGISTRASI
      if (bookingTable.$isPersisted) {
        //kirim response ke frontend
        response.status(201).json({
          message: 'sudah terdaftar',
          nomorAntrian: noAntrian,
          qrcode: createQRCode(),
        })

        // kirim whatsapp ke pasien
        sendWhatsappMessage({
          contact: '6285524914191',
          message: 'haaai',
          qrcode: await createQRCode(),
        })
      }else{ //jika gagal memasukan data ke booking tabel
        response.status(500).json({
          message: "gagal insert data"
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}
