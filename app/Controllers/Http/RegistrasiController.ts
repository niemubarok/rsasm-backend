import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Pasien from 'App/Models/Pasien'
import BookingRegistrasi from 'App/Models/BookingRegistrasi'
import { DateTime } from 'luxon'

export default class RegistrasiController {
  public async pasienLama({ request, response }: HttpContextContract) {
    const body = request.body().data
    const namaPasienDariParam = body.nama
    const noKTP = body.ktp
    const tglLahir = body.tgl_lahir
    const tglPeriksa = body.tanggal_periksa
    const kodeDokter = body.kode_dokter
    const kodePoli = body.kode_poli

    //Mencari rekam medis di tabel pasien
    const pasien = await Pasien.query()
      .where('no_ktp', noKTP)
      .orWhere((query) => {
        query.where('nm_pasien', 'like', `%${namaPasienDariParam}%`).where('tgl_lahir', tglLahir)
      })
      .first()
    const noRM = pasien?.NoRM

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

    //cek dulu apakah pasien lama
    if (noRM) {
      //cek apakah pasien sudah terdaftar dihari yang sama
      const dataBooking = BookingRegistrasi.query()
        .where('no_rkm_medis', noRM)
        .where('tanggal_periksa', tglPeriksa)
        .where('kd_dokter', kodeDokter)
        .first()

      const isRegistered = dataBooking.then((data) => {
        return data?.$isPersisted
      })

      //Jika pasien sudah terdaftar
      if (isRegistered) {
        //jika sudah terdaftar ke dokter yang sama dan hari yang sama
        //ambil nomor antrian pendaftaran sebelumnya
        const antrianTerdaftar = await dataBooking.then((data) => {
          return data?.NomorAntrian
        })
        response.json({
          status: 304,
          message: 'pasien sudah terdaftar',
          data: {
            nomor_antrian: antrianTerdaftar,
          },
        })
      } else {
        // jika belum terdaftar
        //daftarkan di tabel booking registrasi
        try {
          //insert data ke table booking registrasi
          const bookingTable = await BookingRegistrasi.create({
            TanggalBooking: DateTime.now(),
            JamBooking: DateTime.now().toFormat('HH:MM:ss'),
            TanggalPeriksa: body.tanggal_periksa,
            CheckIn: body.waktu_kunjungan,
            NoRM: noRM,
            KodeDokter: kodeDokter,
            KodePoli: kodePoli,
            KodePJ: body.kode_pj,
            NomorAntrian: await noAntrian,
            status: 'Belum',
          })

          if (bookingTable.$isPersisted) {
            //jika berhasil masuk database

            //kembalikan respon berhasil
            response.json({
              status: 201,
              message: 'created',
              data: {
                nomor_antrian: await noAntrian,
                nomor_rm: noRM,
              },
            })
          }
        } catch (error) {
          response.json({
            status: 304,
            message: error,
          })
        }
      } // end cek apakah pasien sudah terdaftar pada hari yang sama dan ke dokter yang sama

      // end cek pasien lama
    } else {
      //pasien tidak ditemukan artinya pasien baru
      response.json({
        status: 304,
        message: 'pasien baru',
      })
    }
  }

  public async pasienBaru({ request, response }: HttpContextContract) {
    const req = request.body().data?.detail_pasien
    const tglLahir = new Date(req.tgl_lahir)
    const umur = () => {
      var diffMs = Date.now() - tglLahir.getTime()
      var ageDt = new Date(diffMs)

      return Math.abs(ageDt.getUTCFullYear() - 1970)
    }

    try {
      const tabelPasien = Database.table('pasien')
        // .returning('no_rkm_medis')
        .insert({
          no_rkm_medis: '987321',
          nama_pasien: req.nama_pasien,
          no_ktp: req.no_ktp,
          jk: req.jk,
          tmp_lahir: req.tmp_lahir,
          tgl_lahir: req.tgl_lahir,
          nm_ibu: req.nm_ibu,
          alamat: req.alamat,
          gol_darah: '-',
          pekerjaan: '-',
          stts_nikah: '',
          agama: req.agama,
          tgl_daftar: DateTime.now(),
          no_tlp: req.no_tlp,
          umur: umur(),
          pnd: '-',
          keluarga: 'SAUDARA',
          namakeluarga: '-',
          kd_pj: req.kd_pj,
          no_peserta: req.no_peserta,
          kd_kel: '80545',
          kd_kec: '1',
          kd_kab: '1',
          pekerjaanpj: '-',
          alamatpj: '-',
          kelurahanpj: 'KELURAHAN',
          kecamatanpj: 'KECAMATAN',
          kabupatenpj: 'KABUPATEN',
          perusahaan_pasien: '-',
          suku_bangsa: '1',
          bahasa_pasien: '5',
          cacat_fisik: '1',
          email: '-',
          nip: '-',
          kd_prop: '1',
          propinsipj: '-',
        })

      return tabelPasien
    } catch (err) {
      return err
    }
  }
}
