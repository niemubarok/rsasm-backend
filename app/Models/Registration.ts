import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Registration extends BaseModel {
  public static table = 'reg_periksa'

  @column({ columnName: 'no_rawat', isPrimary: true })
  public NoRawat: string

  @column({ columnName: 'no_reg' })
  public NoAntrian: string

  @column({ columnName: 'tgl_registrasi' })
  public TglRegistrasi: string
}

// no_reg
// no_rawat
// tgl_registrasi
// jam_reg	time
// kd_dokter
// no_rkm_medis
// kd_poli
// p_jawab
// almt_pj
// hubunganpj
// biaya_reg
// stts
// stts_daftar
// status_lanjut
// kd_pj
// umurdaftar
// sttsumur
// status_bayar
// status_poli
