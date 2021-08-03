import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Dokter from './Dokter'
// import Spesialis from './Spesialis'
// import Poliklinik from './Poliklinik'

export default class JadwalDokter extends BaseModel {
  public static table = 'jadwal'

  @hasMany(() => Dokter, {
    foreignKey: 'id',
  })
  public dokter: HasMany<typeof Dokter>

  // @hasMany(() => Poliklinik, {
  //   foreignKey: 'id',
  // })
  // public poliklinik: HasMany<typeof Poliklinik>

  @column({ columnName: 'kd_dokter', isPrimary: true })
  public id: string

  @column({ columnName: 'hari_kerja' })
  public HariKerja: string

  @column({ columnName: 'jam_mulai' })
  public JamMulai: DateTime

  @column({ columnName: 'jam_selesai' })
  public JamSelesai: string

  @column({ columnName: 'kd_poli' })
  public kodePoli: string

  @column()
  public kuota: number
}
