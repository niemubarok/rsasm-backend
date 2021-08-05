import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PraktekDokter extends BaseModel {
  @column({ columnName: 'kd_dokter', isPrimary: true })
  public kdDokter: String

  @column({ columnName: 'hari' })
  public hari: String

  @column({ columnName: 'isPraktek' })
  public isPraktek: Number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
