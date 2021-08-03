// import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Dokter from './Dokter'

export default class Spesialis extends BaseModel {
  public static table: 'spesialis'

  @belongsTo(() => Dokter, {
    localKey: 'id',
  })
  public dokter: BelongsTo<typeof Dokter>

  @column({ columnName: 'kd_sps', isPrimary: true })
  public id: String

  @column({ columnName: 'nm_sps' })
  public spesialis: String
}
