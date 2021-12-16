import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Setting extends BaseModel {
  public static table = 'setting'

  @column({ columnName: 'nama_instansi', isPrimary: true })
  public nama_instansi: String

  @column({ columnName: 'alamat_instansi' })
  public alamat_instansi = String
  @column({ columnName: 'kontak' })
  public kontak = String
  @column({ columnName: 'email' })
  public email = String
  @column({ columnName: 'logo' })
  public logo = String

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
