import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Pasien from 'App/Models/Pasien'
import { umur } from 'App/services/utils'

export default class StorePasienBaru {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const { data: req } = request.body()
    // const tglLahir = new Date(req.pasien.birthDate)

    const noRM = async () => {
      //ambil no rm terakhir
      const lastRM = await Database.from('set_no_rkm_medis').first()

      //tambah 1
      const nextRM = Number(await lastRM?.no_rkm_medis) + 1

      // return padNumber(nextRM, 6)
      return nextRM
    }

    //Jika pasien lama langsung ke bookingController
    if (!req.pasien.isPasienBaru) {
      await next()
    } else {
      const kodeBayar = () => {
        switch (req.pasien.jnsBayar) {
          case 'UMUM':
            return 'A09'
          case 'BPJS':
            return 'BPJ'
          default:
            return '-'
        }
      }
      try {
        await Database.table('pasien')
          .insert({
            no_rkm_medis: await noRM(),
            nm_pasien: req.pasien.name,
            no_ktp: req.pasien.nik,
            jk: req.pasien.jk,
            tmp_lahir: req.pasien.tmp_lahir,
            tgl_lahir: req.pasien.birthDate,
            nm_ibu: req.pasien.nm_ibu,
            alamat: req.pasien.alamat,
            gol_darah: '-',
            pekerjaan: '-',
            stts_nikah: req.pasien.stts_nikah,
            agama: req.pasien.agama,
            tgl_daftar: req.tglPeriksa,
            no_tlp: req.pasien.phone,
            umur: umur(req.pasien.birthDate),
            pnd: '-',
            keluarga: 'SAUDARA',
            namakeluarga: '-',
            kd_pj: kodeBayar(),
            no_peserta: req.pasien.noBPJS,
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
          .then(async () => {
            await Database.from('set_no_rkm_medis').update({
              no_rkm_medis: await noRM(),
            })
          })

        response.json({
          message: 'Berhasil terdaftar',
        })

        const currentPatientRM = await Pasien.query()
          .select('no_rkm_medis')
          .where('no_ktp', req.pasien.nik)
          .first()
        request.updateBody({
          data: {
            pasien: {
              noRM: currentPatientRM?.NoRM,
            },
          },
        })

        await next()
      } catch (error) {
        response.json({
          message: error,
        })
      }
    }
  }
}
