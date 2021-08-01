// import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Dokter extends BaseModel {
  public static table = 'dokter'

  @column({ columnName: 'kd_dokter', isPrimary: true })
  public id: number

  @column({ columnName: 'nm_dokter' })
  public namaDokter: string
}
