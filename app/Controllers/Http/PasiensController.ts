import { Response } from '@adonisjs/core/build/standalone'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
// import Database from '@ioc:Adonis/Lucid/Database'
import Pasien from 'App/Models/Pasien'

export default class PasiensController {
  public async index({ request, response }: HttpContextContract) {
    // const namaPasienDariParam = request.body().nama
    // const noKTP = request.body().ktp
    // const tglLahir = request.body().tglLahir

    // const pasien = await Pasien.query()
    //   .where('no_ktp', noKTP)
    //   .orWhere((query) => {
    //     query.where('nm_pasien', 'like', `%${namaPasienDariParam}%`).where('tgl_lahir', tglLahir)
    //   })
    //   .first()
    // pasien?.NoRM
    // pasien.NamaPasien = 'Husni Mubarok'

    // await pasien?.save()

    response.status(200).json({
      data: request.body(),
      isPasienBaru: false
    })
  }

  public async create({ }: HttpContextContract) { }

  public async store({ request, response }: HttpContextContract) {
    const {
      // nik,
      // noBPJS,
      // name,
      // birthDate,
      // phone,
      // jnsBayar,
      // jk,
      // tmp_lahir,
      // nm_ibu,
      // alamat,
      // gol_darah, //enum('A', 'B', 'O', 'AB', '-')
      // pekerjaan,
      // stts_nikah, //enum('BELUM MENIKAH', 'MENIKAH', 'JANDA', 'DUDHA',
      // agama,
      // umur,
      // pnd,  //'TS', 'TK', 'SD', 'SMP', 'SMA', 'SLTA/SEDERAJ'.''
      // keluarga, //enum('AYAH', 'IBU', 'ISTRI', 'SUAMI', 'SAUDARA'
      // namakeluarga,
      // kd_pj,
      // kd_kel,
      // kd_kec,
      // kd_kab,
      // pekerjaanpj,
      // alamatpj,
      // kelurahanpj,
      // kecamatanpj,
      // kabupatenpj,
      // perusahaan_pasien,
      // suku_bangsa,
      // bahasa_pasien,
      // cacat_fisik,
      // email,
      // nip,
      // kd_prop,
      // propinsipj,
      // isPasienBaru,
      data
    } = request.body()

    //UBAH JENIS BAYAR KE KODE PJ
    // const kodePJUmum = Database.query().select('kd_pj').from('penjab')

    const kodePJ = () => {
      let pj = ""
      switch (data.pasien.jnsBayar) {
        case "BPJS":
          pj = "BPJ"
        case "UMUM":
          pj = "A09"
        default:
          pj = "-"
      }
      return pj
    }
    const noRM = async()=>{
      const RM =  await Database.from('pasien').max('no_rkm_medis as last_rm').first()
      const lastRM = RM?.last_rm
      const nextRM = (parseInt(lastRM)+ 1)
      return nextRM
    }
    


    const tglDaftar = () => {
      const today = new Date()
      const year = today.getFullYear()
      const month = (today.getMonth()+ 1)
      const date = today.getDate()

      return year + "-" + month + "-" + date
    }

    const umur = () => {
      const today = new Date()
      const year = today.getFullYear()
      const month = (today.getMonth() + 1)
      const date = today.getDate()

      const lahir = data.pasien.birthDate.split('-')
      const tahun_lahir = year - lahir[0]
      const bulan_lahir = month - lahir[1]

      const jumlah_tanggal_dalam_satu_bulan = new Date(year, month, 0).getDate()
      const jumlah_hari = jumlah_tanggal_dalam_satu_bulan - lahir[2] + date

      const _umur = `${tahun_lahir} Th ${bulan_lahir} Bl ${jumlah_hari} Hr`
      return _umur

    }

    try {

      const insertDataPasien = await Database.table('pasien').insert({
        no_rkm_medis: await noRM(),
        nm_pasien: data.pasien.name,
        no_ktp: data.pasien.nik,
        jk: data.pasien.jk,
        tmp_lahir: data.pasien.tmp_lahir,
        tgl_lahir: data.pasien.birthDate,
        nm_ibu: data.pasien.nm_ibu,
        alamat: data.pasien.alamat,
        gol_darah: data.pasien.gol_darah,
        pekerjaan: data.pasien.pekerjaan,
        stts_nikah: data.pasien.stts_nikah,
        agama: data.pasien.agama,
        tgl_daftar: tglDaftar(),
        no_tlp: data.pasien.phone,
        umur: umur(),
        pnd: data.pasien.pnd,
        keluarga: data.pasien.keluarga,
        namakeluarga: data.pasien.namakeluarga,
        kd_pj: kodePJ(),
        no_peserta: data.pasien.noBPJS || 0,
        kd_kel: data.pasien.kd_kel,
        kd_kec: data.pasien.kd_kec,
        kd_kab: data.pasien.kd_kab,
        pekerjaanpj: data.pasien.pekerjaanpj,
        alamatpj: data.pasien.alamatpj,
        kelurahanpj: data.pasien.kelurahanpj,
        kecamatanpj: data.pasien.kecamatanpj,
        kabupatenpj: data.pasien.kabupatenpj,
        perusahaan_pasien: data.pasien.perusahaan_pasien,
        suku_bangsa: data.pasien.suku_bangsa,
        bahasa_pasien: data.pasien.bahasa_pasien,
        cacat_fisik: data.pasien.cacat_fisik,
        email: data.pasien.email,
        nip: data.pasien.nip,
        kd_prop: data.pasien.kd_prop,
        propinsipj: data.pasien.propinsipj,
      })

      if(insertDataPasien){
        console.log("data masuk");
        
      }


      // if (insertDataPasien.$isPersisted) {
      //   console.log("berhasil");

      //   response.status(201)
      // } else {
      //   console.log('gagal');

      // }

    } catch (error) {
      console.log(error);

    }


  }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}

