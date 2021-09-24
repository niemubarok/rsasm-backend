import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import BookingRegistrasi from 'App/Models/BookingRegistrasi'
import { DateTime } from 'luxon'
import { sendWhatsappMessage } from 'App/services/whatsappService'
import { createQRCode, padNumber, formatDate } from 'App/services/utils'
// import axios from 'axios'
// import QrCode from 'qrcode'
import Registration from 'App/Models/Registration'

export default class BookingController {
  public async test({ request, response }: HttpContextContract) {
    // const qr =
    // sendWhatsappMessage({
    //   contact: '6285524914191',
    //   qrcode: await createQRCode(),
    //   message: 'haaai',
    // })

    response.json({
      data: formatDate('2021-09-24', DateTime.DATE_HUGE),
    })
  }

  // -----------------------------store------------------------------------------------------
  public async store({ request, response }: HttpContextContract) {
    //mengambil data dari request yang sudah diupdate di middleware getPasien
    const { data } = request.original()
    const noRM = request.body().data.pasien.noRM

    const tglPeriksa = formatDate(data.pasien.tgl_periksa, DateTime.DATE_HUGE)

    //mengambil nomor antrian terakhir dari tabel booking registrasi
    //berdasarkan tgl periksa, kode dokter dan kode poli
    const getMaxAntrian = Database.from('booking_registrasi')
      .where('tanggal_periksa', data.pasien.tgl_periksa)
      .where('kd_dokter', data.dokter.id)
      .where('kd_poli', data.dokter.kd_poli)
      .max('no_reg as no_antrian')
      .first()

    //nomor antrian selanjutnya
    const antrian = getMaxAntrian.then((antrian) => {
      const next = parseInt(antrian.no_antrian) + 1
      return next || 1
    })
    // Tambahkan 3 angka sebelum nomor
    const noAntrian = padNumber(await antrian, 3)

    //CEK DULU APAKAH PASIEN SUDAH BOOKING KE DOKTER YANG SAMA DAN HARI YANG SAMA
    const isBooked = await BookingRegistrasi.query()
      .where('no_rkm_medis', noRM)
      .where('tanggal_periksa', data.tglPeriksa)
      .where('kd_dokter', data.dokter.id)
      .where('kd_poli', data.dokter.kd_poli)
      .first()

    //CEK JUGA APAKAH SUDAH TERDAFTAR
    const isRegistered = await Registration.query()
      .where('no_rkm_medis', noRM)
      .where('tgl_registrasi', data.tglPeriksa)
      .where('kd_dokter', data.dokter.id)
      .where('kd_poli', data.dokter.kd_poli)
      .first()

    //jika pasien sudah terdaftar
    if (isBooked !== null || isRegistered !== null) {
      response.status(200).json({
        data: {
          registrationDetail: isRegistered,
          bookDetail: isBooked,
          isRegistered: true,
        },
      })
    } else {
      //JIKA PASIEN BELUM TERDAFTAR
      //DAFTARKAN DI BOOKING TABLE
      //insert data ke table booking registrasi
      const bookingTable = await BookingRegistrasi.create({
        TanggalBooking: DateTime.now(),
        JamBooking: DateTime.now().toFormat('HH:MM:ss'),
        TanggalPeriksa: data.pasien.tgl_periksa,
        CheckIn: data.pasien.tgl_periksa,
        NoRM: noRM,
        KodeDokter: data.dokter.id,
        KodePoli: data.dokter.kd_poli,
        KodePJ: data.pasien.kd_pj,
        NomorAntrian: noAntrian,
        LimitReg: 1,
        status: 'Belum',
      })
      //JIKA BERHASIL INSERT DATA KE TABEL BOOKING REGISTRASI
      if (bookingTable.$isPersisted) {
        //kirim response ke frontend
        response.status(201).json({
          message: 'Berhasil terdaftar',
          nomorAntrian: noAntrian,
          qrcode: createQRCode(),
        })

        // const tglPeriksa = new Date(data.pasien.tgl_periksa)

        const message =
          '✅Anda sudah terdaftar' +
          '\n\n___Detail Pendaftaran___' +
          `\nNama: *${data.pasien.name}*` +
          `\nNo. RM: *${noRM}*` +
          `\nKlinik : *${data.namaPoli.trim()}*` +
          `\nDokter: *${data.dokter.name}*` +
          '\nTanggal Periksa: *' +
          tglPeriksa +
          '*' +
          // "\nJam praktek : pkl+ ${jamMulai} s/d ${jamSelesai}+" +
          // '\n*Jam Kedatangan: PKL+ ' +
          '\nNo. Antrian : *' +
          noAntrian +
          '*' +
          '\n_________________________________' +
          '\n⚠️ *PASTIKAN ANDA HADIR PADA SAAT DIPANGGIL*' +
          '\n_Jika tidak hadir setelah 3x panggilan, nomor anda akan dipanggil TERAKHIR_' +
          '\n__________________________________' +
          '\n\n💡Tunjukan pesan ini kepada petugas pendaftaran di Lobby utama.' +
          '\n\n🙏Terimakasih telah mempercayakan kesehatan keluarga anda di *RS Ali Sibroh Malisi*'
        'AYO❗️❗️ LAWAN COVID-19🦠\n\n' +
          '↔️ MENJAGA JARAK\n' +
          '🙌🏼 MENCUCI TANGAN SETIAP 20 MENIT\n' +
          '😷 MENGGUNAKAN MASKER  '

        // kirim whatsapp ke pasien
        sendWhatsappMessage({
          contact: '6285524914191',
          message,
        })
        // qrcode: await createQRCode(),
        //jika gagal memasukan data ke booking tabel
      } else {
        response.status(500).json({
          message: 'gagal insert data',
        })
      }
    }
  }
}
