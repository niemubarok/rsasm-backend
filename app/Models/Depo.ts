import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Depo extends BaseModel {
  public static table = 'bangsal'

  @column({ columnName: 'kd_bangsal', isPrimary: true })
  public kdBangsal: String

  @column({ columnName: 'nm_bangsal' })
  public nmBangsal: String
}
