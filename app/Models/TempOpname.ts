import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class TempOpname extends BaseModel {

  @column({ columnName: "kode_brng", isPrimary: true })
  public kode_brng: string
  @column({ columnName: "kd_bangsal", })
  public kd_bangsal: string
  @column({ columnName: "stok", })
  public stok: number
  @column({ columnName: "tanggal", })
  public tanggal: string

}
