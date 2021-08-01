import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class JadwalDokter extends BaseModel {
  public static table = 'jadwal'

  @column({ columnName: 'kd_dokter', isPrimary: true })
  public id: string

  @column({ columnName: 'hari_kerja' })
  public HariKerja: string

  @column({ columnName: 'jam_mulai' })
  public JamMulai: DateTime

  @column({ columnName: 'jam_selesai' })
  public JamSelesai: string

  @column()
  public kuota: number
}
