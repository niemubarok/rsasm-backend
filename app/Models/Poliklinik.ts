// import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import JadwalDokter from './JadwalDokter'

export default class Poliklinik extends BaseModel {
  public static table = 'poliklinik'

  @belongsTo(() => JadwalDokter, {
    localKey: 'id',
  })
  public jadwalDokter: BelongsTo<typeof JadwalDokter>

  @column({ columnName: 'kd_poli', isPrimary: true })
  public id: number

  @column({ columnName: 'nm_poli' })
  public namaPoli: string
}
