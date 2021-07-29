import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Pasien from './Pasien'

export default class BookingRegistrasi extends BaseModel {
  public static table = 'booking_registrasi'

  @hasMany(()=>Pasien,{
    foreignKey:'NoRM'
  })
  public pasien:HasMany<typeof Pasien>

  @column.dateTime({autoCreate:true, columnName:'tanggal_booking'})
  public TanggalBooking:DateTime

  @column({columnName:'jam_booking'})
  public JamBooking:string

  @column({columnName:'tanggal_periksa'})
  public TanggalPeriksa:DateTime

  @column({columnName:'waktu_kunjungan'})
  public CheckIn:DateTime

  @column({columnName:'no_rkm_medis', isPrimary:true})
  public NoRM:number
  
  @column({columnName:'kd_dokter'})
  public KodeDokter:string
  
  @column({columnName:'kd_poli'})
  public KodePoli:string
  
  @column({columnName:'kd_pj'})
  public KodePJ:string

  @column({columnName:'no_reg'})
  public NomorAntrian:any

  @column()
  public status:string
}
