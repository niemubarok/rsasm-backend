// import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import BookingRegistrasi from './BookingRegistrasi'

export default class Pasien extends BaseModel {
  public static table = 'pasien'

  @belongsTo(() => BookingRegistrasi, {
    localKey: 'NoRM',
  })
  public bookingRegistrasi: BelongsTo<typeof BookingRegistrasi>

  @column({ columnName: 'no_rkm_medis', isPrimary: true })
  public NoRM: number

  @column({ columnName: 'nm_pasien' })
  public NamaPasien: string
}
