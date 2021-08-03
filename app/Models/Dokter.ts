// import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import JadwalDokter from './JadwalDokter'
import Spesialis from './Spesialis'

export default class Dokter extends BaseModel {
  public static table = 'dokter'

  @belongsTo(() => JadwalDokter, {
    localKey: 'id',
  })
  public jadwalDokter: BelongsTo<typeof JadwalDokter>

  @hasMany(() => Spesialis, {
    foreignKey: 'kodeSpesialis',
  })
  public spesialis: HasMany<typeof Spesialis>

  @column({ columnName: 'kd_dokter', isPrimary: true })
  public id: number

  @column({ columnName: 'nm_dokter' })
  public namaDokter: string

  @column({ columnName: 'kd_sps' })
  public kodeSpesialis: String
}
