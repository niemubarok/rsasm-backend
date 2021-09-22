import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Pasien from 'App/Models/Pasien'
import axios from 'axios'
import hmacSha256 from 'crypto-js/hmac-sha256'
import Base64 from 'crypto-js/enc-base64'

export default class GetPasien {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {

    //deklarasi variable
    const consId = 13534;
    const secret = "9hC375EE0D";
    const ts = Math.round(+new Date() / 1000)
    const salt = `${consId}&${ts}`
    const signature = hmacSha256(salt, secret);
    const encodedSignature = Base64.stringify(signature);

    //AMBIL DATA PASIEN DARI FRONTEND
    const { data: req } = request.body()

    let dataToReturn = {}
    // let noKartuBPJS = ''

    try {
      // Jika KTP 
      //AMBIL DATA DARI API BPJS (NAMA DAN TGL LAHIR)
      await axios
        .get(
          "https://new-api.bpjs-kesehatan.go.id:8080/new-vclaim-rest/Peserta/nik/" + req.noKtp + "/tglSEP/" + req.tgl_daftar,
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET",
              "Content-Type": "application/json",
              'Accept': "application/json",
              "X-cons-id": "13534",
              "X-timestamp": ts,
              "X-signature": encodedSignature,
              "Access-Control-Allow-Credentials": true,
              "Access-Control-Request-Headers": "Content-Type",
              "Access-Control-Request-Method": "GET",
            },
          }
        )
        .then(async (res) => {

          if (res.data.response != null) {//JIKA PESERTA DITEMUKAN DI APIBPJS
            //
            const resData = {
              nama_pasien: res.data.response.peserta.nama,
              tgl_lahir: res.data.response.peserta.tglLahir,
            }

            //CARI PASIEN DI DATABASE
            const pasienFromDB = await Pasien.query()
              .where('no_ktp', req.noKtp)
              .where('nm_pasien', 'like', `%${resData.nama_pasien}%`)
              .orWhere((query) => {
                query.where('nm_pasien', 'like', `%${resData.nama_pasien}%`).where('tgl_lahir', resData.tgl_lahir)
              })
              .first()

            dataToReturn = pasienFromDB || {}

          } else {
            //JIKA PASIEN TIDAK DITEMUKAN DI API BPJS
            const pasienFromDB = await Pasien.query()
              .where('no_ktp', req.noKtp)
              .first()
            dataToReturn = pasienFromDB || {}
          }
        })
        .catch(async (err) => {
          console.log(err);
          //JIKA API BPJS TIDAK BISA DIAKSES
          const pasienFromDB = await Pasien.query()
            .where('no_ktp', req.noKtp)
            .first()
          dataToReturn = pasienFromDB || {}
        });


      //JIKA PASIEN TIDAK DITEMUKAN DI DATABASE
      if (Object.keys(dataToReturn).length == 0) {
        //BERARTI PASIEN ADALAH PASIEN BARU
        //RETURN null
        response.json({
          data: null,
          message: "pasien tidak ditemukan"
        })

      } else {
        request.updateBody({
          pasien: dataToReturn,
          original_request: request.body()
        })
        await next()
        // response.json({
        //   data: {
        //     pasien: { dataToReturn },
        //     original_request: request.body()
        //   }
        // })
      }
    } catch (error) {
      console.log(error);
    }
  }
}
