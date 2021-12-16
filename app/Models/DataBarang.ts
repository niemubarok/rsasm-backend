import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class DataBarang extends BaseModel {
  public static table = 'databarang'
  @column({ columnName: 'kode_brng', isPrimary: true })
  public kdBarang: String

  @column({ columnName: 'nama_brng' })
  public nmBarang: String

  @column({ columnName: 'kode_sat' })
  public kdSatuan: String

  @column({ columnName: 'h_beli' })
  public hargaBeli: Number
}
